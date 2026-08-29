// Histórico de análises do Copilot + configuração de quando o gatilho
// automático "ao concluir etapa" deve disparar uma nova análise. Fica no
// pacote de conhecimento (não em data/meeting.ts) porque é especificamente
// sobre o Copilot — mas `Meeting` referencia `CopilotAnalysisRecord` para o
// histórico persistido junto com o resto da reunião.

import type { CopilotSuggestion } from './copilotSuggestion';

export type CopilotTrigger = 'stage' | 'manual' | 'objection';

/** Um registro de análise do Copilot, associado a uma reunião e etapa —
 *  histórico bruto, pronto para persistência (localStorage hoje, via
 *  Meeting.copilotHistory; Supabase quando a tabela correspondente for
 *  adicionada ao schema). */
export interface CopilotAnalysisRecord {
  id: string;
  meetingId: string;
  timestamp: string;
  stageId: string;
  trigger: CopilotTrigger;
  /** Resposta estruturada completa da IA — carrega mainInsight, nextQuestion,
   *  recommendedMove, riskLevel e todo o resto, sem duplicar o formato aqui. */
  suggestion: CopilotSuggestion;
}

/** Etapas cuja CONCLUSÃO dispara uma análise automática (gatilho "Analisar
 *  etapa") — deliberadamente restrito aos momentos em que dado estruturado
 *  novo acabou de ser capturado (qualificação, diagnóstico, devolução do
 *  diagnóstico, escopo). Etapas de perguntas livres não disparam sozinhas,
 *  para não gerar uma chamada de IA a cada etapa da call. */
export const AUTO_ANALYZE_STAGE_KINDS: readonly string[] = [
  'qualification',
  'diagnosis',
  'diagnosisReturn',
  'scope',
];
