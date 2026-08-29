// Critérios de decisão de etapa — ponto 7 do pedido de base de conhecimento:
// quando continuar diagnosticando, apresentar solução, apresentar
// investimento, tratar objeção, tentar fechamento ou marcar próximo passo.
//
// Nome do módulo (`closingRules`) segue a sugestão original do pedido, mas o
// escopo é mais amplo que só "fechamento" — cobre as 6 decisões de
// progressão da call. `rules` está em ordem de prioridade: a primeira cuja
// condição bater é a recomendação. Isso é heurística determinística, não IA
// — mesmo depois que o Copilot existir, esta função pode continuar sendo o
// fallback/checagem de sanidade sobre a sugestão do modelo.

import type { Meeting } from '../data/meeting';
import type { ClosingRules, StageDecision, StageDecisionRule } from './types';
import { isReadyForProposal } from './qualificationRules';

function hasDiagnosisCore(m: Meeting): boolean {
  return !!m.diagnosis.centralProblem.trim() && !!m.diagnosis.impact.trim() && !!m.diagnosis.objective.trim();
}

function hasScopeStarted(m: Meeting): boolean {
  return m.scope.selectedItemIds.length > 0 || m.scope.customItems.length > 0;
}

const rules: StageDecisionRule[] = [
  {
    decision: 'tratar-objecao',
    label: 'Tratar objeção',
    description: 'Existe ao menos uma objeção registrada sem resposta do cliente tratada — resolva antes de seguir.',
    condition: (m) => m.objections.some((o) => !o.clientResponse.trim()),
  },
  {
    decision: 'marcar-proximo-passo',
    label: 'Marcar próximo passo',
    description: 'A reunião já teve um resultado que não é fechamento e ainda falta próximo passo com data.',
    condition: (m) =>
      (m.closing.outcome === 'nao-fechou' || m.closing.outcome === 'follow-up') &&
      (!m.closing.nextStep.trim() || !m.closing.nextStepDate.trim()),
  },
  {
    decision: 'continuar-diagnostico',
    label: 'Continuar diagnosticando',
    description: 'Problema, impacto ou objetivo ainda não foram registrados — não avance para solução.',
    condition: (m) => !hasDiagnosisCore(m),
  },
  {
    decision: 'apresentar-solucao',
    label: 'Apresentar solução',
    description: 'Diagnóstico está registrado e confirmado pelo cliente, mas o escopo ainda não começou a ser montado.',
    condition: (m) => hasDiagnosisCore(m) && m.diagnosis.clientConfirmed && !hasScopeStarted(m) && !m.pricing.amount.trim(),
  },
  {
    decision: 'apresentar-investimento',
    label: 'Apresentar investimento',
    description: 'Escopo já tem itens selecionados e as informações mínimas de qualificação estão completas — hora de falar de valor.',
    condition: (m) => hasScopeStarted(m) && isReadyForProposal(m) && !m.pricing.amount.trim(),
  },
  {
    decision: 'tentar-fechamento',
    label: 'Tentar fechamento',
    description: 'O investimento já foi apresentado e não há objeção pendente — é hora de pedir a decisão.',
    condition: (m) => !!m.pricing.amount.trim() && m.objections.every((o) => o.clientResponse.trim()) && !m.closing.outcome,
  },
];

export const closingRules: ClosingRules = { rules };

/** Primeira decisão recomendada pela ordem de prioridade — `null` se nenhuma regra bater
 *  (ex.: escopo em andamento mas qualificação ainda incompleta para precificar). */
export function recommendStageDecision(meeting: Meeting): StageDecision | null {
  const match = rules.find((r) => r.condition(meeting));
  return match ? match.decision : null;
}
