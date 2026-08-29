// Helpers que extraem escopo e perguntas diretamente do roteiro real de cada
// produto (data/products/*.ts) — garante que `possibleScopes` e
// `specificQuestions` nunca fiquem dessincronizados do que o Modo Call
// realmente pergunta/oferece, sem duplicar nenhum texto à mão.

import type { ProductScript } from '../../data/meeting';

export function scopesFromScript(script: ProductScript): string[] {
  return script.stages.flatMap((s) => (s.scopeItems ?? []).map((i) => i.label));
}

export function questionsFromScript(script: ProductScript): string[] {
  return script.stages.flatMap((s) => (s.questions ?? []).map((q) => q.text));
}
