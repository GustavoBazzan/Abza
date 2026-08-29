// Vercel Function server-side do ABZA Sales Copilot.
//
// POST /api/copilot  { meeting: Meeting }  ->  { suggestion: CopilotSuggestion }
//
// Responsabilidade única: receber uma reunião, montar o contexto enxuto
// (Context Builder em src/knowledge/copilotPromptContext.ts), chamar a
// OpenAI Responses API com Structured Outputs e devolver a sugestão
// estruturada. Nenhuma lógica de conhecimento comercial vive aqui — só
// transporte HTTP, chamada de rede e tratamento de erro.
//
// A chave é lida exclusivamente de `process.env.OPENAI_API_KEY` (nunca
// `VITE_OPENAI_API_KEY` — isso vazaria a chave no bundle do frontend). Esta
// rota roda só no servidor; o frontend nunca vê a chave.
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

// Tipos estruturais mínimos do runtime Node da Vercel — evita depender do
// pacote @vercel/node só por tipos (ele traz uma árvore de dependências
// transitivas pesada e, na auditoria de segurança, vulnerabilidades sem
// relação com este endpoint). Em produção a Vercel injeta objetos que
// satisfazem esta forma normalmente.
export interface CopilotRequest {
  method?: string;
  body?: unknown;
}

export interface CopilotResponse {
  status(code: number): CopilotResponse;
  setHeader(name: string, value: string): CopilotResponse;
  json(body: unknown): void;
}

const REQUEST_TIMEOUT_MS = 20_000;
const DEFAULT_MODEL = 'gpt-4o-mini';

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
  | 'invalid_request'
  | 'not_configured'
  | 'timeout'
  | 'rate_limited'
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
    console.error('[api/copilot] rate limit/quota da OpenAI', err.code ?? err.message);
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
    console.error('[api/copilot] erro da API OpenAI', err.status, err.message);
    sendError(res, 502, 'upstream_error', 'A IA não conseguiu processar esta reunião agora.');
    return;
  }

  console.error('[api/copilot] erro inesperado', err);
  sendError(res, 500, 'upstream_error', 'Erro inesperado ao consultar o Copilot.');
}

export default async function handler(req: CopilotRequest, res: CopilotResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendError(res, 405, 'method_not_allowed', 'Use POST.');
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[api/copilot] OPENAI_API_KEY não configurada neste ambiente.');
    sendError(res, 500, 'not_configured', 'O Copilot ainda não foi configurado neste ambiente.');
    return;
  }

  const body = req.body as { meeting?: unknown } | undefined;
  if (!isMeeting(body?.meeting)) {
    sendError(res, 400, 'invalid_request', 'Envie { meeting } com a reunião completa no corpo da requisição.');
    return;
  }
  const meeting = body.meeting;

  let promptContext;
  try {
    promptContext = buildCopilotPromptContext(meeting);
  } catch (err) {
    console.error('[api/copilot] falha ao montar contexto a partir da reunião enviada', err);
    sendError(res, 400, 'invalid_request', 'Não foi possível interpretar os dados da reunião enviada.');
    return;
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.create(
      {
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
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
      console.error('[api/copilot] resposta da OpenAI sem output_text', JSON.stringify(response).slice(0, 500));
      sendError(res, 502, 'invalid_response', 'A IA não retornou uma resposta válida.');
      return;
    }

    let suggestion: CopilotSuggestion;
    try {
      suggestion = JSON.parse(raw) as CopilotSuggestion;
    } catch (err) {
      console.error('[api/copilot] JSON inválido retornado pela OpenAI', err);
      sendError(res, 502, 'invalid_response', 'A IA retornou uma resposta em formato inesperado.');
      return;
    }

    res.status(200).json({ suggestion });
  } catch (err) {
    handleOpenAiError(res, err);
  }
}
