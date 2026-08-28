import type { ObjectionPlaybookEntry, ObjectionType } from './meeting';

// Orientação para o overlay "Cliente apresentou uma objeção" — a mesma
// referência vale para qualquer produto, por isso vive fora de products/.
// Reaproveita as técnicas do Playbook por número; nunca duplica o texto.

export const OBJECTION_PLAYBOOK: Record<ObjectionType, ObjectionPlaybookEntry> = {
  preco: {
    whatsHappening: ['Sem orçamento alocado', 'Comparou com um fornecedor mais barato', 'Não percebeu valor suficiente'],
    whatNotToDo: ['Listar tudo que está incluso', 'Oferecer desconto imediato'],
    recommendedQuestion: 'Quando você fala caro, está comparando com o quê?',
    technique: { techniqueNum: '08', guidance: 'Elimine a hipótese antes de argumentar.' },
  },
  prazo: {
    whatsHappening: ['O prazo do projeto não encaixa no calendário do cliente', 'Existe uma data específica pressionando a decisão'],
    whatNotToDo: ['Prometer um prazo que a equipe não sustenta'],
    recommendedQuestion: 'O que precisa acontecer até essa data — e o que muda se ela não for cumprida?',
    technique: { techniqueNum: '02', guidance: 'Trate o prazo como microcompromisso, não como imposição.' },
  },
  vouPensar: {
    whatsHappening: ['Informação incompleta — não é uma objeção fechada'],
    whatNotToDo: ['"Ok, te ligo semana que vem" sem contexto'],
    recommendedQuestion: 'O que especificamente ainda precisa ficar mais claro?',
    technique: { techniqueNum: '09', guidance: '"Vou pensar" é informação incompleta, não resposta final.' },
  },
  socio: {
    whatsHappening: ['Decisor real ausente da reunião', 'Quer validar sozinho antes de se comprometer'],
    whatNotToDo: ['Aceitar "te aviso depois" sem próximo passo'],
    recommendedQuestion: 'O que você acha que ele vai questionar?',
    technique: { techniqueNum: '02', guidance: 'Ofereça participar da conversa ou preparar material de apoio.' },
  },
  semVerba: {
    whatsHappening: ['Prioridade real está em outro lugar', 'Momento errado no calendário financeiro'],
    whatNotToDo: ['Insistir que "agora é sempre a hora"'],
    recommendedQuestion: 'O que precisaria mudar para isso virar prioridade?',
    technique: { techniqueNum: '08', guidance: 'Descubra se é caixa, calendário ou falta de urgência real.' },
  },
  comparando: {
    whatsHappening: ['Processo formal de escolha', 'Buscando validar se o preço está justo'],
    whatNotToDo: ['Falar mal do concorrente'],
    recommendedQuestion: 'Quais critérios vocês vão usar para comparar?',
    technique: { techniqueNum: '05', guidance: 'Ajude a construir os critérios — não entre em disputa de preço.' },
  },
  desconto: {
    whatsHappening: ['Hábito de negociação, não necessidade real'],
    whatNotToDo: ['Ceder sem pedir nada em troca'],
    recommendedQuestion: 'Tirando o valor, o restante já está fechado para você?',
    technique: { techniqueNum: '10', guidance: 'Isole antes de negociar — nunca conceda sem contrapartida.' },
  },
  comecarDepois: {
    whatsHappening: ['Quer reduzir risco', 'Não é prioridade real ainda'],
    whatNotToDo: ['Aceitar "depois" sem data'],
    recommendedQuestion: 'Começar depois é uma questão de orçamento ou de confiança?',
    technique: { techniqueNum: '03', guidance: 'Ofereça dois caminhos concretos de avanço, não um adiamento aberto.' },
  },
  naoPrioridade: {
    whatsHappening: ['O problema ainda não dói o suficiente', 'Existe uma prioridade concorrente mais urgente'],
    whatNotToDo: ['Insistir sem entender o que definiria prioridade'],
    recommendedQuestion: 'O que precisaria acontecer para isso virar prioridade?',
    technique: { techniqueNum: '08', guidance: 'Descubra o gatilho real antes de tentar reverter a posição.' },
  },
  outro: {
    whatsHappening: ['Registre a objeção literal antes de responder'],
    whatNotToDo: ['Responder no automático sem entender o que está por trás'],
    recommendedQuestion: 'Me ajuda a entender melhor: o que exatamente te preocupa nesse ponto?',
  },
};
