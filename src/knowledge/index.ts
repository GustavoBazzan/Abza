// Ponto único de entrada da camada de conhecimento comercial ABZA — o que o
// futuro backend do Sales Copilot vai importar para montar contexto de IA.
// Nenhum destes módulos faz chamada de rede ou depende de React; são
// estruturas de dados tipadas e funções puras sobre o `Meeting` já existente.

export type {
  CommercialPhilosophy,
  ProcessStep,
  ObjectionMovementRef,
  RecommendedProcess,
  CommercialKnowledge,
  DiscoveryDimension,
  DiscoverySignal,
  DiagnosisRule,
  QualificationRules,
  StageDecision,
  StageDecisionRule,
  ClosingRules,
  ProductKnowledge,
  SalesRule,
  SalesRulesKnowledge,
} from './types';

export { commercialKnowledge } from './commercialKnowledge';

export { qualificationRules, evaluateDiscoveryStatus, isReadyForProposal } from './qualificationRules';
export type { DiscoveryStatusEntry } from './qualificationRules';

export { closingRules, recommendStageDecision } from './closingRules';

export { salesRules } from './salesRules';

export { PRODUCT_KNOWLEDGE, getProductKnowledge } from './productKnowledge';

export { buildCopilotContext } from './context';
export type { CopilotContext } from './context';

export { buildCopilotPromptContext } from './copilotPromptContext';
export type { CopilotPromptContext } from './copilotPromptContext';

export { COPILOT_SUGGESTION_JSON_SCHEMA, RISK_LEVELS, RECOMMENDED_MOVES } from './copilotSuggestion';
export type { CopilotSuggestion, RiskLevel, RecommendedMove } from './copilotSuggestion';

export { AUTO_ANALYZE_STAGE_KINDS } from './copilotAnalysis';
export type { CopilotAnalysisRecord, CopilotTrigger } from './copilotAnalysis';
