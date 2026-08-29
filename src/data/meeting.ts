// Modelos estruturados da área "Scripts de Reunião" / "Reuniões".
//
// Regra de ouro: nenhum dado comercialmente importante vive só dentro de uma
// string solta num componente visual. Tudo passa por aqui — é o que permite
// que um futuro ABZA Sales Copilot (ou um Pricing Engine determinístico)
// leia o estado de uma reunião sem precisar entender JSX.

import type { CopilotAnalysisRecord } from '../knowledge/copilotAnalysis';

// ---------------------------------------------------------------------------
// Roteiro por produto (conteúdo estático, versionado no código-fonte)
// ---------------------------------------------------------------------------

/** Aponta para uma técnica já existente em data/content.ts (TECH[].num). Nunca duplicada aqui. */
export interface RecommendedTechnique {
  techniqueNum: string;
  guidance: string;
}

export interface QuestionDef {
  id: string;
  text: string;
  /** o que procurar na resposta do cliente — indicadores comerciais, não instruções de UI */
  watchFor?: string[];
}

export interface SolutionPartDef {
  id: string;
  title: string;
  /** por que essa parte entra no projeto — texto padrão, editável mentalmente pelo comercial */
  whyItEnters: string;
}

export interface ScopeItemDef {
  id: string;
  label: string;
  /** pré-selecionado como baseline recomendado para este produto */
  recommended?: boolean;
}

export type StageKind =
  | 'intro'            // preparação/abertura — sem perguntas, só orientação
  | 'questions'         // perguntas com campo de resposta inline
  | 'qualification'      // campos estruturados de qualificação comercial
  | 'diagnosis'           // diagnóstico ABZA (preenchimento manual) + recap da qualificação
  | 'diagnosisReturn'     // devolução do diagnóstico ao cliente + confirmação
  | 'abzaIntro'           // apresentação curta da ABZA conectada ao diagnóstico
  | 'solution'            // apresentação da solução, parte a parte, com "por que entra"
  | 'scope'               // construção do escopo (checklist + item customizado)
  | 'pricing'             // investimento
  | 'closing';            // fechamento / próximo passo

export interface Stage {
  id: string;
  kind: StageKind;
  title: string;
  objective: string;
  questions?: QuestionDef[];
  technique?: RecommendedTechnique;
  nextMove?: string;
  solutionParts?: SolutionPartDef[];
  scopeItems?: ScopeItemDef[];
}

export type ProductId =
  | 'marketing-estrategico'
  | 'identidade-visual'
  | 'site-landing-page'
  | 'producao-audiovisual'
  | 'trafego-pago'
  | 'projeto-personalizado';

export interface ProductScript {
  id: ProductId;
  order: number;
  title: string;
  shortDescription: string;
  objective: string;
  /** true = card visível mas sem roteiro ainda (estrutura preparada, conteúdo pendente) */
  comingSoon?: boolean;
  stages: Stage[];
}

// ---------------------------------------------------------------------------
// Instância de reunião (dado dinâmico, gerado em runtime, persistido)
// ---------------------------------------------------------------------------

/** De onde veio um dado — hoje sempre 'manual'; existe desde já para não exigir migração de banco quando a transcrição ao vivo chegar. */
export type DataSource = 'manual' | 'transcription' | 'ai';

export interface Answer {
  value: string;
  source: DataSource;
  updatedAt: string;
}

export interface MeetingSetupInfo {
  client: string;
  company: string;
  productId: ProductId | '';
  owner: string;
  date: string;
  participants: string;
  origin: string;
  note: string;
}

export function emptyMeetingSetup(productId: ProductId | '' = ''): MeetingSetupInfo {
  return {
    client: '', company: '', productId, owner: '',
    date: new Date().toISOString().slice(0, 10),
    participants: '', origin: '', note: '',
  };
}

export type ObjectionType =
  | 'preco' | 'prazo' | 'vouPensar' | 'socio' | 'semVerba'
  | 'comparando' | 'desconto' | 'comecarDepois' | 'naoPrioridade' | 'outro';

export const OBJECTION_TYPES: { id: ObjectionType; label: string }[] = [
  { id: 'preco', label: 'Preço' },
  { id: 'prazo', label: 'Prazo' },
  { id: 'vouPensar', label: 'Vou pensar' },
  { id: 'socio', label: 'Preciso falar com meu sócio' },
  { id: 'semVerba', label: 'Sem verba agora' },
  { id: 'comparando', label: 'Estou comparando' },
  { id: 'desconto', label: 'Quero desconto' },
  { id: 'comecarDepois', label: 'Quero começar depois' },
  { id: 'naoPrioridade', label: 'Não é prioridade' },
  { id: 'outro', label: 'Outro' },
];

export interface ObjectionPlaybookEntry {
  whatsHappening: string[];
  whatNotToDo: string[];
  recommendedQuestion: string;
  technique?: RecommendedTechnique;
}

export interface ObjectionEvent {
  id: string;
  type: ObjectionType;
  stageId: string;
  clientResponse: string;
  source: DataSource;
  createdAt: string;
}

export interface CommercialQualification {
  decisionMaker: string;
  otherParticipants: string;
  deadline: string;
  urgency: string;
  budgetRange: string;
  competitors: string;
  otherVendors: string;
  decisionCriteria: string;
  pastExperience: string;
  constraints: string;
  realChance: string;
}

export function emptyQualification(): CommercialQualification {
  return {
    decisionMaker: '', otherParticipants: '', deadline: '', urgency: '', budgetRange: '',
    competitors: '', otherVendors: '', decisionCriteria: '', pastExperience: '',
    constraints: '', realChance: '',
  };
}

export interface CommercialDiagnosis {
  centralProblem: string;
  impact: string;
  objective: string;
  mainOpportunity: string;
  urgency: string;
  fitWithAbza: string;
  risks: string;
  undiscovered: string;
  clientConfirmed: boolean;
  confirmationNotes: string;
}

export function emptyDiagnosis(): CommercialDiagnosis {
  return {
    centralProblem: '', impact: '', objective: '', mainOpportunity: '', urgency: '',
    fitWithAbza: '', risks: '', undiscovered: '', clientConfirmed: false, confirmationNotes: '',
  };
}

export interface ScopeSelection {
  selectedItemIds: string[];
  customItems: string[];
  notes: string;
}

export function emptyScope(): ScopeSelection {
  return { selectedItemIds: [], customItems: [], notes: '' };
}

/** Preenchido manualmente hoje. Estrutura pronta para um Pricing Engine
 *  determinístico (diagnóstico + escopo + tabela oficial + regras) no futuro —
 *  a IA poderá sugerir escopo, mas o valor nunca deve ser "inventado" por ela. */
export interface PricingInfo {
  amount: string;
  paymentTerms: string;
  deadline: string;
  note: string;
}

export function emptyPricing(): PricingInfo {
  return { amount: '', paymentTerms: '', deadline: '', note: '' };
}

export type ClosingOutcome = 'fechou' | 'nao-fechou' | 'follow-up';

export interface ClosingInfo {
  outcome?: ClosingOutcome;
  lossReason: string;
  pendingObjection: string;
  responsiblePerson: string;
  requiredAction: string;
  nextStep: string;
  nextStepDate: string;
  nextStepOwner: string;
}

export function emptyClosing(): ClosingInfo {
  return {
    outcome: undefined, lossReason: '', pendingObjection: '', responsiblePerson: '',
    requiredAction: '', nextStep: '', nextStepDate: '', nextStepOwner: '',
  };
}

/** Espaço reservado para o futuro ABZA Sales Copilot. Nunca gerado hoje —
 *  `source` existe desde já para diferenciar nota manual de insight de IA
 *  assim que a integração chegar. */
export interface AIInsight {
  id: string;
  createdAt: string;
  source: 'manual' | 'ai';
  text: string;
}

export type MeetingStatus = 'em-andamento' | 'proposta' | 'follow-up' | 'ganho' | 'perdido';

export interface Meeting {
  id: string;
  productId: ProductId;
  setup: MeetingSetupInfo;
  currentStageIndex: number;
  answers: Record<string, Answer>;
  qualification: CommercialQualification;
  diagnosis: CommercialDiagnosis;
  scope: ScopeSelection;
  pricing: PricingInfo;
  objections: ObjectionEvent[];
  closing: ClosingInfo;
  techniquesViewed: string[];
  insights: AIInsight[];
  /** Histórico de análises do ABZA Sales Copilot nesta reunião — uma entrada por chamada bem-sucedida. */
  copilotHistory: CopilotAnalysisRecord[];
  startedAt: string;
  updatedAt: string;
  endedAt?: string;
}

export function createMeeting(productId: ProductId, setup: MeetingSetupInfo): Meeting {
  const now = new Date().toISOString();
  return {
    id: `mtg_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    productId,
    setup,
    currentStageIndex: 0,
    answers: {},
    qualification: emptyQualification(),
    diagnosis: emptyDiagnosis(),
    scope: emptyScope(),
    pricing: emptyPricing(),
    objections: [],
    closing: emptyClosing(),
    techniquesViewed: [],
    insights: [],
    copilotHistory: [],
    startedAt: now,
    updatedAt: now,
  };
}

/** Deriva o status de exibição a partir dos fatos registrados — nunca
 *  persistido como campo separado (evitaria ficar dessincronizado). */
export function deriveMeetingStatus(meeting: Meeting): MeetingStatus {
  if (meeting.closing.outcome === 'fechou') return 'ganho';
  if (meeting.closing.outcome === 'nao-fechou') return 'perdido';
  if (meeting.closing.outcome === 'follow-up') return 'follow-up';
  if (meeting.pricing.amount.trim()) return 'proposta';
  return 'em-andamento';
}

export const MEETING_STATUS_LABEL: Record<MeetingStatus, string> = {
  'em-andamento': 'Em andamento',
  'proposta': 'Proposta',
  'follow-up': 'Follow-up',
  'ganho': 'Ganho',
  'perdido': 'Perdido',
};

/** Campos-chave que o painel "ABZA Copilot" verifica para mostrar o que já
 *  foi identificado vs. o que ainda falta descobrir — hoje calculado por
 *  regra simples (campo preenchido ou não); é exatamente o tipo de sinal
 *  que uma IA usaria como contexto de entrada no futuro. */
export interface CopilotFieldStatus {
  label: string;
  known: boolean;
}

export function computeCopilotStatus(meeting: Meeting): CopilotFieldStatus[] {
  const q = meeting.qualification;
  const d = meeting.diagnosis;
  return [
    { label: 'Dor', known: !!d.centralProblem.trim() },
    { label: 'Impacto', known: !!d.impact.trim() },
    { label: 'Objetivo', known: !!d.objective.trim() },
    { label: 'Urgência', known: !!(q.urgency.trim() || d.urgency.trim()) },
    { label: 'Decisor', known: !!q.decisionMaker.trim() },
    { label: 'Prazo', known: !!q.deadline.trim() },
    { label: 'Budget', known: !!q.budgetRange.trim() },
    { label: 'Concorrência', known: !!q.competitors.trim() },
    { label: 'Critério de decisão', known: !!q.decisionCriteria.trim() },
    { label: 'Escopo', known: meeting.scope.selectedItemIds.length > 0 },
  ];
}
