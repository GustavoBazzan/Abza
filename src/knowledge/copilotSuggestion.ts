// Formato de saída do ABZA Sales Copilot — o mesmo tipo é usado pelo
// endpoint server-side (api/copilot.ts, via Structured Outputs da OpenAI) e
// será usado pelo futuro painel visual no frontend. Fica em `src/knowledge`
// porque é conhecimento estruturado, não lógica de UI nem de transporte.

export type RiskLevel = 'low' | 'medium' | 'high';
export const RISK_LEVELS: readonly RiskLevel[] = ['low', 'medium', 'high'];

export type RecommendedMove =
  | 'continue_diagnosis'
  | 'validate_diagnosis'
  | 'present_solution'
  | 'present_price'
  | 'handle_objection'
  | 'close'
  | 'schedule_followup';

export const RECOMMENDED_MOVES: readonly RecommendedMove[] = [
  'continue_diagnosis',
  'validate_diagnosis',
  'present_solution',
  'present_price',
  'handle_objection',
  'close',
  'schedule_followup',
];

export interface CopilotSuggestion {
  summary: string;
  mainInsight: string;
  nextQuestion: string | null;
  why: string;
  missingInformation: string[];
  detectedObjection: string | null;
  recommendedTechnique: string | null;
  riskLevel: RiskLevel;
  recommendedMove: RecommendedMove;
  alert: string | null;
  doNotDo: string | null;
}

const nullableString = { type: ['string', 'null'] } as const;

/** JSON Schema estrito para Structured Outputs da OpenAI — espelha `CopilotSuggestion` 1:1. */
export const COPILOT_SUGGESTION_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string', description: 'Resumo objetivo do momento atual da reunião, em 1-2 frases.' },
    mainInsight: { type: 'string', description: 'O insight mais importante para o vendedor agora.' },
    nextQuestion: { ...nullableString, description: 'Próxima pergunta sugerida ao cliente, ou null se não houver uma clara.' },
    why: { type: 'string', description: 'Por que essa sugestão faz sentido agora, conectando com o que já foi dito na reunião.' },
    missingInformation: {
      type: 'array',
      items: { type: 'string' },
      description: 'Informações importantes ainda não descobertas nesta reunião.',
    },
    detectedObjection: { ...nullableString, description: 'Objeção detectada na última resposta do cliente, ou null se nenhuma.' },
    recommendedTechnique: {
      ...nullableString,
      description: 'Nome ou número de uma técnica da lista "tecnicasDisponiveis" do contexto — nunca uma técnica inventada.',
    },
    riskLevel: { type: 'string', enum: RISK_LEVELS, description: 'Risco de perder a venda ou travar a reunião neste momento.' },
    recommendedMove: {
      type: 'string',
      enum: RECOMMENDED_MOVES,
      description: 'Próximo movimento recomendado no processo comercial ABZA.',
    },
    alert: { ...nullableString, description: 'Alerta crítico para o vendedor (ex.: regra ABZA em risco de ser violada), ou null.' },
    doNotDo: { ...nullableString, description: 'Uma ação específica que o vendedor NÃO deve fazer agora, ou null.' },
  },
  required: [
    'summary',
    'mainInsight',
    'nextQuestion',
    'why',
    'missingInformation',
    'detectedObjection',
    'recommendedTechnique',
    'riskLevel',
    'recommendedMove',
    'alert',
    'doNotDo',
  ],
} as const;
