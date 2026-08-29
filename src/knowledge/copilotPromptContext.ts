// Context Builder do ABZA Sales Copilot — monta SOMENTE as informações
// necessárias para uma sugestão de IA nesta etapa específica da reunião.
// Deliberadamente mais enxuto que `buildCopilotContext` (context.ts): aquele
// monta o pacote completo de conhecimento (útil para debug/inspeção); este
// é pensado para ir direto no prompt, então evita conteúdo irrelevante para
// não gastar tokens à toa (ex.: perguntas de etapas futuras, técnicas com
// script/exemplo completo, todo o catálogo de escopo do produto).

import { TECH } from '../data/content';
import type { Meeting } from '../data/meeting';
import { getProduct } from '../data/products';
import { evaluateDiscoveryStatus } from './qualificationRules';
import { salesRules } from './salesRules';

export interface CopilotPromptContext {
  product: { id: string; title: string; objective: string };
  currentStage: { title: string; kind: string; objective: string } | null;
  /** Primeira pergunta ainda sem resposta na etapa atual — null fora de etapas do tipo "questions". */
  currentQuestion: string | null;
  /** Só o que já foi respondido até a etapa atual (inclusive) — nunca conteúdo de etapas futuras. */
  relevantAnswers: { question: string; answer: string }[];
  diagnosis: { mainOpportunity: string; fitWithAbza: string; risks: string; undiscovered: string; clientConfirmed: boolean };
  dor: string;
  impacto: string;
  objetivo: string;
  urgencia: string;
  decisor: string;
  budget: string;
  prazo: string;
  concorrencia: string;
  objecoes: { type: string; clientResponse: string; treated: boolean }[];
  escopoAtual: string[];
  investimentoApresentado: { amount: string; paymentTerms: string; deadline: string; note: string } | null;
  /** Lista enxuta (num + nome + momento) — nunca o objeto Technique completo do Playbook. */
  tecnicasDisponiveis: { num: string; nome: string; momento: string }[];
  regrasComerciaisAbza: string[];
  informacoesDesconhecidas: string[];
}

export function buildCopilotPromptContext(meeting: Meeting): CopilotPromptContext {
  const product = getProduct(meeting.productId);
  const stages = product?.stages ?? [];
  const stageIndex = stages.length > 0 ? Math.min(meeting.currentStageIndex, stages.length - 1) : 0;
  const stage = stages[stageIndex];

  let currentQuestion: string | null = null;
  if (stage?.kind === 'questions') {
    const pending = (stage.questions ?? []).find((q) => !meeting.answers[q.id]?.value.trim());
    currentQuestion = pending?.text ?? null;
  }

  const relevantAnswers: { question: string; answer: string }[] = [];
  for (const s of stages.slice(0, stageIndex + 1)) {
    for (const q of s.questions ?? []) {
      const value = meeting.answers[q.id]?.value.trim();
      if (value) relevantAnswers.push({ question: q.text, answer: value });
    }
    for (const p of s.solutionParts ?? []) {
      const value = meeting.answers[p.id]?.value.trim();
      if (value) relevantAnswers.push({ question: p.title, answer: value });
    }
  }

  const scopeStage = stages.find((s) => s.kind === 'scope');
  const scopeLabels = new Map((scopeStage?.scopeItems ?? []).map((i) => [i.id, i.label] as const));
  const escopoAtual = [
    ...meeting.scope.selectedItemIds.map((id) => scopeLabels.get(id) ?? id),
    ...meeting.scope.customItems,
  ];

  const informacoesDesconhecidas = evaluateDiscoveryStatus(meeting)
    .filter((d) => !d.known)
    .map((d) => d.label);

  return {
    product: product
      ? { id: product.id, title: product.title, objective: product.objective }
      : { id: meeting.productId, title: meeting.productId, objective: '' },
    currentStage: stage ? { title: stage.title, kind: stage.kind, objective: stage.objective } : null,
    currentQuestion,
    relevantAnswers,
    diagnosis: {
      mainOpportunity: meeting.diagnosis.mainOpportunity,
      fitWithAbza: meeting.diagnosis.fitWithAbza,
      risks: meeting.diagnosis.risks,
      undiscovered: meeting.diagnosis.undiscovered,
      clientConfirmed: meeting.diagnosis.clientConfirmed,
    },
    dor: meeting.diagnosis.centralProblem,
    impacto: meeting.diagnosis.impact,
    objetivo: meeting.diagnosis.objective,
    urgencia: meeting.qualification.urgency || meeting.diagnosis.urgency,
    decisor: meeting.qualification.decisionMaker,
    budget: meeting.qualification.budgetRange,
    prazo: meeting.qualification.deadline,
    concorrencia: meeting.qualification.competitors,
    objecoes: meeting.objections.map((o) => ({
      type: o.type,
      clientResponse: o.clientResponse,
      treated: !!o.clientResponse.trim(),
    })),
    escopoAtual,
    investimentoApresentado: meeting.pricing.amount.trim()
      ? {
          amount: meeting.pricing.amount,
          paymentTerms: meeting.pricing.paymentTerms,
          deadline: meeting.pricing.deadline,
          note: meeting.pricing.note,
        }
      : null,
    tecnicasDisponiveis: TECH.map((t) => ({ num: t.num, nome: t.nome, momento: t.momento })),
    regrasComerciaisAbza: salesRules.rules.map((r) => r.rule),
    informacoesDesconhecidas,
  };
}
