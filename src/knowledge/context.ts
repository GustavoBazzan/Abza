// Monta o contexto estruturado que uma futura API vai enviar a um modelo de
// IA: REGRAS ABZA + PRODUTO + REUNIÃO ATUAL + RESPOSTAS + DIAGNÓSTICO +
// ETAPA ATUAL — exatamente a composição descrita no pedido de base de
// conhecimento. Esta função não faz nenhuma chamada de rede e não depende
// de nenhum SDK de IA: é só a montagem do payload, já serializável em JSON,
// pronta para o dia em que o backend do Copilot existir (ver auditoria
// anterior — isso exige uma função serverless própria, nunca uma chamada
// direta do frontend para um provedor de IA).

import type { Meeting } from '../data/meeting';
import { getProduct } from '../data/products';
import { commercialKnowledge } from './commercialKnowledge';
import { salesRules } from './salesRules';
import { evaluateDiscoveryStatus, type DiscoveryStatusEntry } from './qualificationRules';
import { recommendStageDecision } from './closingRules';
import { getProductKnowledge } from './productKnowledge';
import type { CommercialPhilosophy, ProductKnowledge, RecommendedProcess, SalesRulesKnowledge, StageDecision } from './types';

export interface CopilotContext {
  /** REGRAS ABZA */
  rules: SalesRulesKnowledge;
  philosophy: CommercialPhilosophy;
  process: RecommendedProcess;
  /** PRODUTO */
  product: ProductKnowledge;
  /** ETAPA ATUAL */
  currentStage: { index: number; kind: string; title: string; objective: string } | null;
  /** REUNIÃO ATUAL (setup + qualificação + escopo + investimento + fechamento + objeções) */
  meeting: {
    setup: Meeting['setup'];
    qualification: Meeting['qualification'];
    scope: Meeting['scope'];
    pricing: Meeting['pricing'];
    closing: Meeting['closing'];
    objections: Meeting['objections'];
  };
  /** RESPOSTAS */
  answers: Meeting['answers'];
  /** DIAGNÓSTICO */
  diagnosis: Meeting['diagnosis'];
  discoveryStatus: DiscoveryStatusEntry[];
  recommendedNextAction: StageDecision | null;
}

/** Monta o contexto completo para uma reunião — pura, síncrona, sem I/O. */
export function buildCopilotContext(meeting: Meeting): CopilotContext {
  const product = getProduct(meeting.productId);
  const stage = product?.stages[meeting.currentStageIndex] ?? null;

  return {
    rules: salesRules,
    philosophy: commercialKnowledge.philosophy,
    process: commercialKnowledge.process,
    product: getProductKnowledge(meeting.productId),
    currentStage: stage
      ? { index: meeting.currentStageIndex, kind: stage.kind, title: stage.title, objective: stage.objective }
      : null,
    meeting: {
      setup: meeting.setup,
      qualification: meeting.qualification,
      scope: meeting.scope,
      pricing: meeting.pricing,
      closing: meeting.closing,
      objections: meeting.objections,
    },
    answers: meeting.answers,
    diagnosis: meeting.diagnosis,
    discoveryStatus: evaluateDiscoveryStatus(meeting),
    recommendedNextAction: recommendStageDecision(meeting),
  };
}
