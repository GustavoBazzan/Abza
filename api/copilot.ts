// Vercel Function server-side do ABZA Sales Copilot.
//
// POST /api/copilot  Authorization: Bearer <supabase access_token>  { meeting: Meeting }
//   ->  { suggestion: CopilotSuggestion }
//
// Responsabilidade única: confirmar que quem está chamando é um usuário
// Supabase autenticado de verdade, montar o contexto enxuto (Context
// Builder em src/knowledge/copilotPromptContext.ts), chamar a OpenAI
// Responses API com Structured Outputs e devolver a sugestão estruturada.
// Nenhuma lógica de conhecimento comercial vive aqui — só transporte HTTP,
// autenticação, chamada de rede e tratamento de erro.
//
// Ordem de verificação, do mais barato/fundamental para o mais caro:
// método -> sessão Supabase -> forma do payload -> tamanho do payload ->
// configuração da OpenAI -> chamada à OpenAI. Nada depois da checagem de
// sessão executa se o chamador não estiver autenticado (quando a
// autenticação está ativa neste deployment).
//
// A chave da OpenAI é lida exclusivamente de `process.env.OPENAI_API_KEY`
// (nunca `VITE_OPENAI_API_KEY` — isso vazaria a chave no bundle do
// frontend). Esta rota roda só no servidor; o frontend nunca vê a chave.
//
// Hoje a persistência de reuniões é client-side (localStorage por padrão,
// Supabase quando configurado — ver src/store/). Por isso este endpoint
// recebe a reunião inteira no corpo da requisição em vez de buscá-la por id:
// o cliente já tem o objeto `Meeting` completo em memória (via
// useActiveMeeting). Quando existir um backend de persistência sempre
// ativo, dá para trocar para `{ meetingId }` + busca server-side sem mudar
// o contrato de resposta.

import OpenAI from 'openai';
import { buildCopilotPromptContext } from '../src/knowledge/copilotPromptContext';
import { COPILOT_SUGGESTION_JSON_SCHEMA, type CopilotSuggestion } from '../src/knowledge/copilotSuggestion';
import type { Meeting } from '../src/data/meeting';
import { verifySupabaseUser } from './_lib/verifySupabaseUser';

// Vercel lê esta config estática para definir o tempo máximo da função —
// precisa ser >= REQUEST_TIMEOUT_MS abaixo, senão a plataforma mata a
// função antes do timeout do SDK da OpenAI ter chance de disparar. 30s
// exige plano Vercel compatível (Hobby permite até 60s nas contas atuais;
// confirme no seu projeto — ver COPILOT_IMPLEMENTATION_STATUS.md).
export const config = { maxDuration: 30 };

// Tipos estruturais mínimos do runtime Node da Vercel — evita depender do
// pacote @vercel/node só por tipos (ele traz uma árvore de dependências
// transitivas pesada e, na auditoria de segurança, vulnerabilidades sem
// relação com este endpoint). Em produção a Vercel injeta objetos que
// satisfazem esta forma normalmente.
export interface CopilotRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface CopilotResponse {
  status(code: number): CopilotResponse;
  setHeader(name: string, value: string): CopilotResponse;
  json(body: unknown): void;
}

const REQUEST_TIMEOUT_MS = 20_000;
const DEFAULT_MODEL = 'gpt-4o-mini';
const MAX_PAYLOAD_BYTES = 200_000; // 200KB — folgado para um Meeting real, pequeno o bastante para barrar abuso.

// OPENAI_COPILOT_MODEL/OPENAI_COPILOT_REASONING são os nomes atuais;
// OPENAI_MODEL segue aceita como fallback legado para não quebrar um
// deployment que só tenha a variável antiga configurada. `reasoning` só é
// enviado à OpenAI quando a variável existe — modelos que não são da
// família "reasoning" simplesmente não a esperam, e omiti-la evita mandar
// um parâmetro que o modelo configurado talvez não reconheça.
function resolveModel(): string {
  return process.env.OPENAI_COPILOT_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL;
}
function resolveReasoningEffort(): string | undefined {
  return process.env.OPENAI_COPILOT_REASONING || undefined;
}

// Rate limit simples, em memória, por usuário autenticado — sem
// infraestrutura nova (sem Redis/serviço externo). É "best effort": cada
// instância serverless da Vercel tem sua própria memória, então sob várias
// instâncias concorrentes o limite real pode passar um pouco do número
// abaixo. Ainda assim barra o caso comum (um script/loop batendo no
// endpoint repetidamente) sem depender de nada além do próprio processo.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestTimestampsByUser = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const recent = (requestTimestampsByUser.get(userId) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestTimestampsByUser.set(userId, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

const SYSTEM_PROMPT = `Você é o ABZA Sales Copilot, um assistente que apoia vendedores da ABZA durante reuniões comerciais ao vivo.

Sua tarefa: analisar o estado atual da reunião (enviado como JSON na mensagem do usuário) e devolver uma sugestão estruturada e objetiva para o vendedor, seguindo exatamente o schema fornecido.

Regras que você NUNCA pode violar:
- Nunca inventar fatos sobre a ABZA, seus cases, prazos ou capacidades.
- Nunca inventar ou sugerir um valor de preço/investimento — isso é decisão exclusivamente humana.
- Nunca inventar respostas do cliente que não estejam no contexto enviado.
- Nunca afirmar como certa uma informação listada em "informacoesDesconhecidas" — trate-a como desconhecida, não presuma.
- Nunca sugerir desconto, a menos que exista uma regra comercial explícita autorizando isso em "regrasComerciaisAbza".
- Nunca recomendar avançar para proposta/investimento só porque o cliente "parece interessado" — baseie-se nos dados estruturados de diagnóstico e qualificação do contexto.
- Toda técnica em "recommendedTechnique" precisa vir exatamente da lista em "tecnicasDisponiveis" (use nome ou número como fornecido) — nunca invente uma técnica nova.
- Respeite também todas as regras listadas em "regrasComerciaisAbza".

Se informações importantes ainda não foram descobertas, liste-as em "missingInformation" em vez de presumir. Seja direto, específico e curto — o vendedor está lendo isso durante a ligação.`;

type CopilotErrorCode =
  | 'method_not_allowed'
  | 'unauthorized'
  | 'invalid_request'
  | 'payload_too_large'
  | 'rate_limited'
  | 'not_configured'
  | 'timeout'
  | 'insufficient_quota'
  | 'invalid_response'
  | 'upstream_error';

function sendError(res: CopilotResponse, status: number, code: CopilotErrorCode, message: string): void {
  res.status(status).json({ error: { code, message } });
}

function isMeeting(value: unknown): value is Meeting {
  if (!value || typeof value !== 'object') return false;
  const m = value as Record<string, unknown>;
  return typeof m.id === 'string' && typeof m.productId === 'string' && typeof m.currentStageIndex === 'number';
}

/** Mapeia erros do SDK da OpenAI para uma resposta HTTP segura — nunca repassa stack trace ou corpo bruto do provedor. */
function handleOpenAiError(res: CopilotResponse, err: unknown): void {
  if (err instanceof OpenAI.APIConnectionTimeoutError) {
    console.error('[api/copilot] timeout na chamada à OpenAI');
    sendError(res, 504, 'timeout', 'A IA demorou demais para responder. Tente novamente.');
    return;
  }

  if (err instanceof OpenAI.RateLimitError) {
    const isQuota = err.code === 'insufficient_quota' || /insufficient_quota|quota/i.test(err.message ?? '');
    console.error('[api/copilot] rate limit/quota da OpenAI', err.code ?? '(sem código)');
    if (isQuota) {
      sendError(res, 402, 'insufficient_quota', 'Créditos da conta OpenAI esgotados. Verifique o faturamento da conta.');
      return;
    }
    sendError(res, 429, 'rate_limited', 'Muitas chamadas à IA em pouco tempo. Aguarde alguns segundos e tente novamente.');
    return;
  }

  if (err instanceof OpenAI.AuthenticationError) {
    console.error('[api/copilot] OPENAI_API_KEY inválida ou revogada');
    sendError(res, 500, 'not_configured', 'A chave de IA configurada neste ambiente é inválida.');
    return;
  }

  if (err instanceof OpenAI.APIError) {
    console.error('[api/copilot] erro da API OpenAI', err.status);
    sendError(res, 502, 'upstream_error', 'A IA não conseguiu processar esta reunião agora.');
    return;
  }

  console.error('[api/copilot] erro inesperado ao chamar a OpenAI');
  sendError(res, 500, 'upstream_error', 'Erro inesperado ao consultar o Copilot.');
}

export default async function handler(req: CopilotRequest, res: CopilotResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendError(res, 405, 'method_not_allowed', 'Use POST.');
    return;
  }

  // 1) Sessão Supabase — nada abaixo executa sem um usuário autenticado de
  // verdade (exceto quando este deployment não tem Supabase Auth
  // configurado, o mesmo estado em que o frontend também não exige login).
  const authResult = await verifySupabaseUser(req.headers?.authorization);
  if (!authResult.ok) {
    if (authResult.reason === 'not_configured') {
      console.warn('[api/copilot] Supabase Auth não configurado neste ambiente — seguindo sem exigir login (mesmo fallback do frontend).');
    } else {
      console.warn('[api/copilot] requisição rejeitada:', authResult.reason);
      sendError(res, 401, 'unauthorized', 'Sessão ausente, inválida ou expirada. Faça login novamente.');
      return;
    }
  }

  // 2) Rate limit por usuário autenticado — só se sabemos quem é o chamador.
  if (authResult.ok && isRateLimited(authResult.user.id)) {
    console.warn('[api/copilot] rate limit atingido para o usuário', authResult.user.id);
    sendError(res, 429, 'rate_limited', 'Muitas análises em pouco tempo. Aguarde um instante e tente novamente.');
    return;
  }

  // 3) Forma e tamanho do payload.
  const contentLength = Number((Array.isArray(req.headers?.['content-length']) ? req.headers['content-length'][0] : req.headers?.['content-length']) ?? 0);
  if (contentLength > MAX_PAYLOAD_BYTES) {
    sendError(res, 413, 'payload_too_large', 'Reunião enviada é grande demais.');
    return;
  }

  const body = req.body as { meeting?: unknown } | undefined;
  if (!isMeeting(body?.meeting)) {
    sendError(res, 400, 'invalid_request', 'Envie { meeting } com a reunião completa no corpo da requisição.');
    return;
  }
  const meeting = body.meeting;

  // Checagem defensiva de tamanho mesmo sem Content-Length confiável (ex.:
  // proxy que não repassa o header) — nunca confiar só no header do cliente.
  if (JSON.stringify(meeting).length > MAX_PAYLOAD_BYTES) {
    sendError(res, 413, 'payload_too_large', 'Reunião enviada é grande demais.');
    return;
  }

  // 4) Configuração da OpenAI.
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[api/copilot] OPENAI_API_KEY não configurada neste ambiente.');
    sendError(res, 500, 'not_configured', 'O Copilot ainda não foi configurado neste ambiente.');
    return;
  }

  let promptContext;
  try {
    promptContext = buildCopilotPromptContext(meeting);
  } catch (err) {
    console.error('[api/copilot] falha ao montar contexto a partir da reunião enviada', err instanceof Error ? err.message : '(erro desconhecido)');
    sendError(res, 400, 'invalid_request', 'Não foi possível interpretar os dados da reunião enviada.');
    return;
  }

  // 5) Só agora, com sessão validada e payload são, a OpenAI é chamada.
  const client = new OpenAI({ apiKey });
  const model = resolveModel();
  const reasoningEffort = resolveReasoningEffort();

  try {
    const response = await client.responses.create(
      {
        model,
        ...(reasoningEffort ? { reasoning: { effort: reasoningEffort as OpenAI.Reasoning['effort'] } } : {}),
        input: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(promptContext) },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'copilot_suggestion',
            schema: COPILOT_SUGGESTION_JSON_SCHEMA,
            strict: true,
          },
        },
      },
      { timeout: REQUEST_TIMEOUT_MS },
    );

    const raw = response.output_text;
    if (!raw) {
      console.error('[api/copilot] resposta da OpenAI sem output_text — response id:', response.id, 'status:', response.status);
      sendError(res, 502, 'invalid_response', 'A IA não retornou uma resposta válida.');
      return;
    }

    let suggestion: CopilotSuggestion;
    try {
      suggestion = JSON.parse(raw) as CopilotSuggestion;
    } catch {
      console.error('[api/copilot] JSON inválido retornado pela OpenAI — response id:', response.id);
      sendError(res, 502, 'invalid_response', 'A IA retornou uma resposta em formato inesperado.');
      return;
    }

    // `model` não é secreto (é só o nome do modelo configurado, ex.:
    // "gpt-5.6-terra") — devolvido para o frontend poder persistir qual
    // modelo gerou cada sugestão em meeting_copilot_insights.model.
    res.status(200).json({ suggestion, model });
  } catch (err) {
    handleOpenAiError(res, err);
  }
}
