// Regras de diagnóstico + lógica de descoberta — pontos 4, 5 e 6 do pedido
// de base de conhecimento: o que precisa ser descoberto antes de apresentar
// proposta, e como reconhecer dor, impacto, objetivo, urgência, decisor,
// budget, prazo, concorrência e objeções dentro de uma reunião.
//
// `isKnown` é a única parte executável — o resto é texto/estrutura pronta
// para virar contexto de prompt. A função de avaliação (`evaluateDiscoveryStatus`)
// é o mesmo tipo de checagem que `computeCopilotStatus` já faz em
// data/meeting.ts para o painel lateral atual; aqui a lógica é mais rica
// (inclui hints de detecção e categorias de pergunta do Playbook) porque é
// pensada para alimentar a IA, não só uma lista visual de ✅/❌. As duas
// convivem por ora — unificar é um passo futuro de baixo risco.

import type { Meeting } from '../data/meeting';
import type { DiagnosisRule, DiscoveryDimension, DiscoverySignal, QualificationRules } from './types';

const discoveryDimensions: DiscoverySignal[] = [
  {
    dimension: 'dor',
    label: 'Dor / problema central',
    description: 'O problema real por trás do pedido inicial do cliente — não o sintoma superficial.',
    requiredBeforeProposal: true,
    meetingLocation: 'diagnosis.centralProblem',
    detectionHints: ['problema', 'incomoda', 'travando', 'não está funcionando', 'perdendo', 'dificuldade'],
    relatedQuestionCategories: ['Diagnóstico'],
    isKnown: (m) => !!m.diagnosis.centralProblem.trim(),
  },
  {
    dimension: 'impacto',
    label: 'Impacto',
    description: 'Consequência comercial mensurável de o problema continuar existindo.',
    requiredBeforeProposal: true,
    meetingLocation: 'diagnosis.impact',
    detectionHints: ['custou', 'perdemos', 'deixamos de', 'impacto', 'prejuízo', 'oportunidade perdida'],
    relatedQuestionCategories: ['Diagnóstico'],
    isKnown: (m) => !!m.diagnosis.impact.trim(),
  },
  {
    dimension: 'objetivo',
    label: 'Objetivo desejado',
    description: 'Como o cliente descreve o sucesso, com as próprias palavras.',
    requiredBeforeProposal: true,
    meetingLocation: 'diagnosis.objective',
    detectionHints: ['queremos chegar', 'nosso objetivo', 'gostaríamos', 'meta'],
    relatedQuestionCategories: ['Diagnóstico'],
    isKnown: (m) => !!m.diagnosis.objective.trim(),
  },
  {
    dimension: 'urgencia',
    label: 'Urgência',
    description: 'O quanto essa decisão precisa acontecer logo, e por quê.',
    requiredBeforeProposal: false,
    meetingLocation: 'qualification.urgency (ou diagnosis.urgency)',
    detectionHints: ['prazo apertado', 'precisa ser rápido', 'já devíamos ter feito', 'urgente'],
    relatedQuestionCategories: ['Decisão'],
    isKnown: (m) => !!(m.qualification.urgency.trim() || m.diagnosis.urgency.trim()),
  },
  {
    dimension: 'decisor',
    label: 'Decisor',
    description: 'Quem de fato decide, e quem mais participa da decisão.',
    requiredBeforeProposal: true,
    meetingLocation: 'qualification.decisionMaker',
    detectionHints: ['preciso falar com', 'meu sócio', 'quem decide', 'vou levar para'],
    relatedQuestionCategories: ['Decisão'],
    isKnown: (m) => !!m.qualification.decisionMaker.trim(),
  },
  {
    dimension: 'budget',
    label: 'Budget',
    description: 'Faixa de investimento disponível ou esperada pelo cliente.',
    requiredBeforeProposal: true,
    meetingLocation: 'qualification.budgetRange',
    detectionHints: ['orçamento', 'quanto vocês cobram', 'faixa de investimento', 'verba'],
    relatedQuestionCategories: ['Investimento'],
    isKnown: (m) => !!m.qualification.budgetRange.trim(),
  },
  {
    dimension: 'prazo',
    label: 'Prazo',
    description: 'Quando o cliente precisa que o projeto comece ou entregue.',
    requiredBeforeProposal: true,
    meetingLocation: 'qualification.deadline',
    detectionHints: ['até quando', 'precisa estar pronto', 'data', 'prazo'],
    relatedQuestionCategories: ['Decisão'],
    isKnown: (m) => !!m.qualification.deadline.trim(),
  },
  {
    dimension: 'concorrencia',
    label: 'Concorrência',
    description: 'Outros fornecedores ou alternativas sendo avaliadas pelo cliente.',
    requiredBeforeProposal: false,
    meetingLocation: 'qualification.competitors',
    detectionHints: ['comparando', 'outra agência', 'outra proposta', 'outro fornecedor'],
    relatedQuestionCategories: ['Investimento'],
    isKnown: (m) => !!m.qualification.competitors.trim(),
  },
  {
    dimension: 'objecoes',
    label: 'Objeções',
    description: 'Bloqueios declarados pelo cliente e se já foram tratados.',
    requiredBeforeProposal: false,
    meetingLocation: 'objections[]',
    detectionHints: ['caro', 'vou pensar', 'preciso falar com', 'sem verba', 'comparando', 'desconto'],
    relatedQuestionCategories: ['Objeções'],
    // "known" aqui significa "nenhuma objeção pendente sem resposta registrada" —
    // vacuamente verdadeiro se nenhuma objeção foi levantada ainda.
    isKnown: (m) => m.objections.every((o) => o.clientResponse.trim().length > 0),
  },
];

const diagnosisRules: DiagnosisRule[] = [
  { id: 'nao-aceitar-sintoma', rule: 'Nunca aceitar o primeiro pedido do cliente (ex.: "quero um logo novo", "quero mais posts") como o problema real — perguntar o que está por trás.' },
  { id: 'problema-antes-de-solucao', rule: 'Não apresentar solução, escopo ou investimento antes do problema central estar nomeado e confirmado pelo cliente.' },
  { id: 'impacto-mensuravel', rule: 'Um problema só está bem diagnosticado quando tem um impacto comercial associado (receita, custo, oportunidade perdida, risco) — não basta ser um incômodo.' },
  { id: 'objetivo-nas-palavras-do-cliente', rule: 'O objetivo deve ser registrado com as palavras do próprio cliente, não inferido ou reescrito pelo vendedor (ou pela IA).' },
  { id: 'diagnostico-honesto', rule: 'Riscos e pontos ainda não descobertos devem ser registrados no diagnóstico mesmo quando isso significa admitir que a reunião não gerou informação suficiente.' },
  { id: 'confirmar-antes-de-avancar', rule: 'O diagnóstico precisa ser devolvido e confirmado explicitamente pelo cliente antes de qualquer apresentação de solução.' },
];

const mustKnowBeforeProposal: DiscoveryDimension[] = discoveryDimensions
  .filter((d) => d.requiredBeforeProposal)
  .map((d) => d.dimension);

export const qualificationRules: QualificationRules = {
  discoveryDimensions,
  diagnosisRules,
  mustKnowBeforeProposal,
};

export interface DiscoveryStatusEntry {
  dimension: DiscoveryDimension;
  label: string;
  known: boolean;
  requiredBeforeProposal: boolean;
}

/** Snapshot serializável do que já foi descoberto nesta reunião — a peça que entra no contexto de IA. */
export function evaluateDiscoveryStatus(meeting: Meeting): DiscoveryStatusEntry[] {
  return discoveryDimensions.map((d) => ({
    dimension: d.dimension,
    label: d.label,
    known: d.isKnown(meeting),
    requiredBeforeProposal: d.requiredBeforeProposal,
  }));
}

/** Todas as dimensões obrigatórias antes de proposta já estão preenchidas? */
export function isReadyForProposal(meeting: Meeting): boolean {
  return discoveryDimensions.filter((d) => d.requiredBeforeProposal).every((d) => d.isKnown(meeting));
}
