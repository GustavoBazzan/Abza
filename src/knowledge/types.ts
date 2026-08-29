// Tipos compartilhados da camada de conhecimento comercial — a base que o
// futuro ABZA Sales Copilot vai consumir para montar contexto de IA.
//
// Regra de arquitetura: nada aqui faz chamada de rede, depende de React ou
// de qualquer SDK de IA. São apenas estruturas de dados tipadas e funções
// puras que leem o `Meeting` já modelado em `data/meeting.ts`. A integração
// real com um modelo de IA é um passo futuro e deliberadamente separado.

import type { Meeting, ProductId } from '../data/meeting';

// ---------------------------------------------------------------------------
// 1-3. Conhecimento comercial geral — filosofia, técnicas, processo
// (módulo `commercialKnowledge`)
// ---------------------------------------------------------------------------

export interface CommercialPhilosophy {
  /** Postura central em uma frase — o que separa venda consultiva de venda empurrada. */
  corePosture: string;
  /** Comportamentos de venda "empurrada" a evitar (espelha PRESSAO em data/content.ts). */
  avoid: string[];
  /** Comportamentos de venda consultiva a praticar (espelha CONSULTIVA). */
  practice: string[];
  /** O que cada interação de valor produz, na ordem em que aparece na call (espelha CONSEQUENCIAS). */
  valueBuildingBlocks: string[];
  /** Etapas do funil comercial ABZA, do início ao fim (espelha PIPELINE). */
  pipeline: string[];
  /** Limites éticos não-negociáveis (espelha ETICA) — reforçados também em `salesRules`. */
  ethicalBoundaries: string[];
}

export interface ProcessStep {
  order: number;
  /** Corresponde a `Stage.kind` em data/meeting.ts — a mesma etapa que existe no Modo Call. */
  stageKind: string;
  label: string;
  purpose: string;
  guidance: string;
  /** Números de técnica (TECH[].num, em data/content.ts) mais relevantes nesta etapa. */
  relatedTechniqueNums?: string[];
}

export interface ObjectionMovementRef {
  n: string;
  nome: string;
  desc: string;
}

export interface RecommendedProcess {
  steps: ProcessStep[];
  /** Os 7 movimentos de tratamento de objeção (espelha METODO em data/content.ts). */
  objectionMovement: ObjectionMovementRef[];
}

export interface CommercialKnowledge {
  philosophy: CommercialPhilosophy;
  process: RecommendedProcess;
}

// ---------------------------------------------------------------------------
// 4-6. Regras de diagnóstico e lógica de descoberta
// (módulo `qualificationRules`)
// ---------------------------------------------------------------------------

export type DiscoveryDimension =
  | 'dor' | 'impacto' | 'objetivo' | 'urgencia' | 'decisor'
  | 'budget' | 'prazo' | 'concorrencia' | 'objecoes';

export interface DiscoverySignal {
  dimension: DiscoveryDimension;
  label: string;
  description: string;
  /** Se true, apresentar investimento sem esse dado registrado é considerado prematuro. */
  requiredBeforeProposal: boolean;
  /** Onde esse dado vive dentro de `Meeting` — documentação em texto, não um path executável. */
  meetingLocation: string;
  /** Palavras/frases do cliente que costumam sinalizar essa dimensão na fala. */
  detectionHints: string[];
  /** Categorias de pergunta do Playbook (CATS[].nome, em data/content.ts) relacionadas. */
  relatedQuestionCategories: string[];
  /** Função pura: essa dimensão já está registrada nesta reunião? */
  isKnown: (meeting: Meeting) => boolean;
}

export interface DiagnosisRule {
  id: string;
  rule: string;
}

export interface QualificationRules {
  discoveryDimensions: DiscoverySignal[];
  diagnosisRules: DiagnosisRule[];
  /** Dimensões que precisam estar conhecidas antes de apresentar investimento. */
  mustKnowBeforeProposal: DiscoveryDimension[];
}

// ---------------------------------------------------------------------------
// 7. Critérios de decisão de etapa
// (módulo `closingRules` — nome sugerido pelo pedido original; cobre as 6
// decisões de progressão da call, não só o fechamento em si)
// ---------------------------------------------------------------------------

export type StageDecision =
  | 'continuar-diagnostico'
  | 'apresentar-solucao'
  | 'apresentar-investimento'
  | 'tratar-objecao'
  | 'tentar-fechamento'
  | 'marcar-proximo-passo';

export interface StageDecisionRule {
  decision: StageDecision;
  label: string;
  description: string;
  /** Função pura: essa decisão se aplica ao estado atual da reunião? */
  condition: (meeting: Meeting) => boolean;
}

export interface ClosingRules {
  /** Ordem = prioridade de avaliação — a primeira regra cuja condição bater vence. */
  rules: StageDecisionRule[];
}

// ---------------------------------------------------------------------------
// 8-9. Conhecimento por produto (módulo `productKnowledge`)
// ---------------------------------------------------------------------------

export interface ProductKnowledge {
  productId: ProductId;
  /** false para produtos "em preparação" (sem roteiro completo ainda). */
  available: boolean;
  problemSolved: string;
  idealClientProfile: string[];
  fitSignals: string[];
  lowFitSignals: string[];
  /** Derivado do roteiro real do produto (data/products/*.ts) — nunca reescrito à mão. */
  specificQuestions: string[];
  /** Derivado do roteiro real do produto (data/products/*.ts) — nunca reescrito à mão. */
  possibleScopes: string[];
  /** Outros produtos ABZA que costumam entrar em conjunto com este. */
  complementaryServices: ProductId[];
}

// ---------------------------------------------------------------------------
// 10. Regras que o agente nunca deve violar (módulo `salesRules`)
// ---------------------------------------------------------------------------

export interface SalesRule {
  id: string;
  rule: string;
  rationale: string;
}

export interface SalesRulesKnowledge {
  rules: SalesRule[];
}
