import type { Stage } from '../meeting';

// Etapas do processo comercial que não variam de forma no conteúdo por
// produto (qualificação, diagnóstico, devolução, apresentação da ABZA,
// investimento, fechamento) — a FORMA é comum, o produto só entra no rótulo.
// Perguntas, diagnóstico do problema, solução e escopo são sempre
// específicos de cada produto e vivem nos arquivos individuais.

export function openingStage(productLabel: string): Stage {
  return {
    id: 'abertura',
    kind: 'intro',
    title: 'Abertura',
    objective: `Enquadrar a reunião de ${productLabel} e abrir espaço para o cliente falar primeiro.`,
    nextMove: 'Deixe o cliente falar mais que você nos primeiros minutos. Não apresente a ABZA ainda.',
  };
}

export function qualificationStage(productLabel: string): Stage {
  return {
    id: 'qualificacao',
    kind: 'qualification',
    title: 'Qualificação comercial',
    objective: `Entender como a decisão sobre ${productLabel} realmente acontece dentro da empresa.`,
    technique: { techniqueNum: '02', guidance: 'Trate isso como microcompromisso — mapeie antes de propor.' },
    nextMove: 'Deixe essas perguntas surgirem no fluxo da conversa — isso não é um interrogatório.',
  };
}

export function diagnosisStage(): Stage {
  return {
    id: 'diagnostico-abza',
    kind: 'diagnosis',
    title: 'Diagnóstico ABZA',
    objective: 'Estruturar sua leitura da oportunidade antes de devolver ao cliente.',
    nextMove: 'Seja honesto sobre riscos e pontos ainda não descobertos — isso orienta a próxima pergunta, não só a proposta.',
  };
}

export function diagnosisReturnStage(): Stage {
  return {
    id: 'devolucao-diagnostico',
    kind: 'diagnosisReturn',
    title: 'Devolução do diagnóstico',
    objective: 'Confirmar sua leitura com o cliente antes de apresentar qualquer solução.',
    nextMove: 'Se o cliente corrigir algo, volte e atualize o diagnóstico antes de continuar.',
  };
}

export function abzaIntroStage(): Stage {
  return {
    id: 'apresentacao-abza',
    kind: 'abzaIntro',
    title: 'Apresentação da ABZA',
    objective: 'Conectar abordagem e experiência ao que foi diagnosticado — nada institucional.',
    nextMove: 'Mostre só: abordagem, metodologia, experiência relevante e como isso resolve especificamente o problema dele.',
  };
}

export function pricingStage(): Stage {
  return {
    id: 'investimento',
    kind: 'pricing',
    title: 'Investimento',
    objective: 'Apresentar o valor com clareza e observar a reação, sem justificar demais.',
    nextMove: 'Diga o valor e fique em silêncio. Quem fala primeiro depois do preço perde poder de negociação.',
  };
}

export function closingStage(): Stage {
  return {
    id: 'fechamento',
    kind: 'closing',
    title: 'Fechamento',
    objective: 'Validar a solução, tratar a última objeção e buscar a decisão.',
    technique: { techniqueNum: '01', guidance: 'Recomende — a clareza construída precisa virar decisão.' },
    nextMove: 'Se não fechar, o próximo passo com data é obrigatório — nunca "me avisa".',
  };
}
