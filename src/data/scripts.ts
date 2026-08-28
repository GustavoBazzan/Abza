// Dados dos Scripts de Reunião — roteiros operacionais para uso AO VIVO em call.
// Diferente de data/content.ts (que ensina), este arquivo estrutura o que EXECUTAR.
// As técnicas citadas aqui apontam para TECH em content.ts por `num` — nunca duplicadas.

export type ScriptCategory = 'vender' | 'fechar' | 'crescer';

export const CATEGORY_LABEL: Record<ScriptCategory, string> = {
  vender: 'Vender',
  fechar: 'Fechar',
  crescer: 'Crescer',
};

/** Aponta para uma técnica já existente em data/content.ts (TECH[].num). */
export interface RecommendedTechnique {
  techniqueNum: string;
  /** orientação curta e contextual — não repete o conteúdo completo do Playbook */
  guidance: string;
}

export interface ResponseOption {
  label: string;
  guidance: string;
  technique?: RecommendedTechnique;
}

export interface MeetingStep {
  id: string;
  title: string;
  objective: string;
  questions?: string[];
  /** o que observar na resposta do cliente */
  watchFor?: string[];
  technique?: RecommendedTechnique;
  /** próximo movimento — uma frase, não um parágrafo */
  nextMove?: string;
  /** usado apenas na etapa de abertura do Follow-up (seleção da resposta do cliente) */
  responseOptions?: ResponseOption[];
}

export interface MeetingScript {
  id: string;
  category: ScriptCategory;
  title: string;
  shortDescription: string;
  objective: string;
  steps: MeetingStep[];
}

export const SCRIPTS: MeetingScript[] = [
  {
    id: 'diagnostico',
    category: 'vender',
    title: 'Primeira Reunião / Diagnóstico',
    shortDescription: 'Entender se existe oportunidade real antes de apresentar qualquer solução.',
    objective: 'Construir o diagnóstico completo: problema, impacto, objetivo, decisor, prazo e investimento.',
    steps: [
      {
        id: 'abertura',
        title: 'Abertura',
        objective: 'Enquadrar a reunião e abrir espaço para o cliente falar primeiro.',
        questions: [
          'O que fez vocês decidirem ter essa conversa agora?',
          'O que vocês já sabem sobre a ABZA?',
        ],
        watchFor: ['Motivação real ("perdemos um cliente por isso") vs. genérica ("estamos vendo o mercado")'],
        nextMove: 'Deixe o cliente falar mais que você nos primeiros minutos.',
      },
      {
        id: 'cenario-problema',
        title: 'Cenário atual e problema',
        objective: 'Descobrir o que está acontecendo hoje e por que virou prioridade.',
        questions: [
          'O que está acontecendo hoje que deveria estar acontecendo diferente?',
          'O que vocês já tentaram fazer para resolver isso?',
          'Por que isso se tornou prioridade agora, e não há 6 meses?',
        ],
        watchFor: ['Um evento específico que disparou a busca (gatilho real, não achismo)'],
      },
      {
        id: 'impacto',
        title: 'Consequências',
        objective: 'Dimensionar o custo de não agir.',
        questions: [
          'Como isso afeta o negócio de vocês hoje?',
          'O que acontece se nada mudar nos próximos 12 meses?',
        ],
        nextMove: 'Se a resposta for vaga, peça um número ou exemplo concreto.',
      },
      {
        id: 'objetivo',
        title: 'Objetivo desejado',
        objective: 'Entender como seria o resultado ideal, na visão do cliente.',
        questions: [
          'Se isso desse certo, como seria o resultado?',
          'Qual seria uma boa métrica de sucesso para vocês?',
        ],
      },
      {
        id: 'processo-decisao',
        title: 'Processo de decisão',
        objective: 'Mapear decisores, prazo e orçamento antes de qualquer proposta.',
        questions: [
          'Quem mais participa dessa decisão além de você?',
          'Existe algum prazo para isso começar?',
          'Já existe investimento previsto, ou ainda está em aberto?',
          'Como vocês costumam escolher um fornecedor?',
        ],
        technique: { techniqueNum: '02', guidance: 'Use microcompromissos para mapear decisor, prazo e processo antes de enviar qualquer proposta.' },
      },
      {
        id: 'fechamento',
        title: 'Próximo passo',
        objective: 'Sair da reunião com um passo concreto e datado.',
        questions: ['Pelo que conversamos, faz sentido eu voltar com uma proposta?'],
        technique: { techniqueNum: '01', guidance: 'Recomende o próximo passo — não pergunte "posso mandar uma proposta?".' },
        nextMove: 'Nunca saia sem data marcada para a devolutiva.',
      },
    ],
  },
  {
    id: 'identidade-visual',
    category: 'vender',
    title: 'Identidade Visual',
    shortDescription: 'Transformar "preciso de uma logo nova" em uma conversa sobre percepção e valor.',
    objective: 'Sair de um pedido estético e chegar a posicionamento, confiança e crescimento.',
    steps: [
      {
        id: 'motivacao',
        title: 'Motivação da mudança',
        objective: 'Entender o gatilho — nunca aceite "queremos modernizar" como resposta final.',
        questions: [
          'O que está motivando pensar na marca agora?',
          'O que incomoda hoje na identidade atual?',
        ],
        nextMove: 'Se a resposta for só "quer uma logo nova", volte com: "o que exatamente incomoda hoje?"',
      },
      {
        id: 'percepcao-atual',
        title: 'Percepção atual',
        objective: 'Verificar se a empresa evoluiu e a marca ficou para trás.',
        questions: [
          'A empresa mudou e a identidade ficou para trás?',
          'Como vocês acham que são percebidos hoje?',
          'Teve alguma reação de cliente ou do mercado que fez vocês notarem isso?',
        ],
      },
      {
        id: 'percepcao-desejada',
        title: 'Percepção desejada',
        objective: 'Descobrir como querem ser vistos e por quem.',
        questions: [
          'Como vocês querem ser percebidos?',
          'Quem vocês querem atrair que hoje não atraem?',
          'Existe desalinhamento entre o que vocês cobram/entregam e como a marca aparece?',
        ],
        watchFor: ['Menção a "parecer mais caro/premium" — sinal de desalinhamento preço x percepção'],
      },
      {
        id: 'confianca',
        title: 'Confiança e pontos de contato',
        objective: 'Ligar a identidade a resultado comercial, não só estética.',
        questions: [
          'A identidade atual passa confiança na hora de fechar negócio?',
          'Como a marca aparece hoje — site, proposta, redes, materiais? Está tudo alinhado?',
        ],
      },
      {
        id: 'consequencia-comercial',
        title: 'Consequência comercial',
        objective: 'Conectar o projeto a posicionamento e crescimento, não só a um novo visual.',
        questions: [
          'O que muda comercialmente depois desse projeto?',
          'Isso deveria refletir em preço, posicionamento, ou só na estética?',
        ],
      },
      {
        id: 'decisao',
        title: 'Decisão e prazo',
        objective: 'Mapear decisor e horizonte antes de propor.',
        questions: [
          'Quem decide esse investimento?',
          'Existe prazo — algum lançamento, evento ou momento específico?',
        ],
        technique: { techniqueNum: '02', guidance: 'Mapeie decisor e prazo como microcompromisso antes de propor.' },
      },
      {
        id: 'fechamento',
        title: 'Próximo passo',
        objective: 'Recomendar o caminho.',
        questions: ['Da minha parte, recomendo avançarmos com o diagnóstico de marca. Faz sentido?'],
        technique: { techniqueNum: '01', guidance: 'Recomende — não pergunte se o cliente "quer pensar".' },
      },
    ],
  },
  {
    id: 'marketing-estrategico',
    category: 'vender',
    title: 'Marketing Estratégico / Contrato Mensal',
    shortDescription: 'Ir além de "quantidade de posts": aquisição, posicionamento e crescimento.',
    objective: 'Entender cenário comercial, operação de marketing atual e onde está o gargalo real.',
    steps: [
      {
        id: 'cenario-comercial',
        title: 'Cenário comercial',
        objective: 'Entender faturamento e de onde vêm os clientes hoje.',
        questions: [
          'Como está o faturamento hoje e qual o objetivo de crescimento?',
          'De onde vêm os clientes de vocês hoje?',
        ],
      },
      {
        id: 'marketing-atual',
        title: 'Marketing e time atual',
        objective: 'Mapear operação atual sem julgar.',
        questions: [
          'O que vocês fazem hoje de marketing?',
          'Existe time interno ou é tudo terceirizado?',
          'Quais canais vocês usam — redes, mídia paga, outros?',
        ],
      },
      {
        id: 'processo-comercial',
        title: 'Processo comercial e dados',
        objective: 'Entender o que acontece depois que o lead chega.',
        questions: [
          'Como funciona o processo comercial depois que o lead chega?',
          'Vocês usam CRM? Existe dado histórico disso?',
        ],
        watchFor: ['Se não há CRM/dado, o diagnóstico precisa incluir isso como gargalo, não só mídia'],
      },
      {
        id: 'posicionamento',
        title: 'Posicionamento e concorrência',
        objective: 'Entender como se diferenciam hoje.',
        questions: [
          'Como vocês se posicionam frente à concorrência?',
          'Quem são os concorrentes que mais preocupam vocês?',
        ],
      },
      {
        id: 'gargalos',
        title: 'Gargalos e capacidade',
        objective: 'Descobrir onde está o verdadeiro limite: geração, conversão ou entrega.',
        questions: [
          'Onde está o principal gargalo hoje — geração de lead, conversão, ou capacidade de atender?',
          'Se a demanda aumentasse, vocês conseguiriam atender?',
        ],
        nextMove: 'Não trate marketing como "quantidade de posts" — direcione para aquisição e conversão.',
      },
      {
        id: 'metas',
        title: 'Metas e prioridades',
        objective: 'Alinhar o que é prioridade nos próximos meses.',
        questions: [
          'Qual a principal meta dos próximos meses?',
          'Prioridade é crescer receita, marca, ou os dois?',
        ],
      },
      {
        id: 'decisao-investimento',
        title: 'Decisão e investimento',
        objective: 'Mapear decisor, orçamento e horizonte antes de propor.',
        questions: [
          'Quem decide esse tipo de investimento?',
          'Já existe orçamento previsto ou ainda está em avaliação?',
          'O horizonte é um projeto pontual ou continuidade mensal?',
        ],
        technique: { techniqueNum: '02', guidance: 'Trate isso como microcompromisso — mapeie antes de montar a proposta.' },
      },
      {
        id: 'fechamento',
        title: 'Próximo passo',
        objective: 'Recomendar o caminho.',
        questions: ['Da minha parte, recomendo avançarmos com [proposta]. Faz sentido para você?'],
        technique: { techniqueNum: '01', guidance: 'Recomende com base no gargalo identificado, não em um pacote genérico.' },
      },
    ],
  },
  {
    id: 'apresentacao-proposta',
    category: 'fechar',
    title: 'Apresentação de Proposta',
    shortDescription: 'A proposta já existe. Objetivo agora é validar, apresentar investimento e conduzir a decisão.',
    objective: 'Reconectar com o diagnóstico, apresentar a lógica da solução e isolar a objeção real.',
    steps: [
      {
        id: 'retomada',
        title: 'Retomar diagnóstico',
        objective: 'Confirmar que nada mudou desde a primeira reunião.',
        questions: [
          'Antes de entrar na proposta: mudou algo desde nossa última conversa?',
          'O problema que identificamos — [resumo] — ainda é esse?',
        ],
      },
      {
        id: 'objetivo-solucao',
        title: 'Objetivo e lógica da solução',
        objective: 'Reconectar objetivo antes de mostrar escopo — nunca apresente a solução primeiro.',
        questions: ['O que vocês esperam alcançar continua sendo [objetivo]?'],
        nextMove: 'Conecte cada item do escopo a uma dor que o cliente relatou — nunca apresente como lista de entregáveis.',
      },
      {
        id: 'validacao',
        title: 'Validação de entendimento',
        objective: 'Garantir que o cliente entendeu a lógica antes do valor.',
        questions: ['Isso faz sentido para vocês? Ficou claro como isso resolve o que conversamos?'],
      },
      {
        id: 'investimento',
        title: 'Investimento',
        objective: 'Apresentar o valor e aguardar — não preencher o silêncio.',
        questions: ['O investimento para esse escopo é [valor].'],
        nextMove: 'Diga o valor e fique em silêncio. Quem fala primeiro depois do preço, geralmente perde poder de negociação.',
      },
      {
        id: 'objecoes',
        title: 'Identificar e isolar objeção',
        objective: 'Descobrir a objeção real antes de negociar qualquer coisa.',
        questions: [
          'O que vem à cabeça quando você vê esse investimento?',
          'Tirando isso, existe mais alguma coisa que impediria vocês de avançarem?',
        ],
        watchFor: ['"Está caro" · "Vou pensar" · "Preciso falar com meu sócio" · "Quero comparar" · "Não tenho verba agora" · "Me manda que eu vejo depois"'],
        technique: { techniqueNum: '04', guidance: 'Condicione: "se resolvermos isso, existe mais alguma coisa?" — depois isole com Objeção Final (10).' },
      },
      {
        id: 'fechamento',
        title: 'Fechamento',
        objective: 'Pedir a decisão ou travar o próximo passo concreto.',
        questions: [
          'Da minha parte, recomendo seguirmos. Faz sentido para você?',
          'Prefere começarmos [opção A] ou [opção B]?',
        ],
        technique: { techniqueNum: '01', guidance: 'Recomende primeiro. Se travar, ofereça duas alternativas reais (Ou/Ou).' },
      },
    ],
  },
  {
    id: 'follow-up-fechamento',
    category: 'fechar',
    title: 'Follow-up e Fechamento',
    shortDescription: 'Roteiro operacional para retomar um negócio parado — nunca um "só passando aqui".',
    objective: 'Adaptar a conversa à resposta real do cliente e sair com data específica de retorno.',
    steps: [
      {
        id: 'resposta-cliente',
        title: 'Qual foi a resposta do cliente?',
        objective: 'Selecionar o cenário para adaptar o restante do roteiro.',
        responseOptions: [
          { label: 'Ainda não respondeu', guidance: 'Não é objeção, é silêncio. Evite "só passando aqui". Traga um motivo real ou uma pergunta nova para reabrir.' },
          { label: 'Gostou, mas está pensando', guidance: 'Descubra o que exatamente será pensado antes de qualquer novo follow-up.', technique: { techniqueNum: '09', guidance: '' } },
          { label: 'Achou caro', guidance: 'Isole se o preço é a única variável antes de negociar qualquer coisa.', technique: { techniqueNum: '10', guidance: '' } },
          { label: 'Precisa falar com alguém', guidance: 'Ofereça participar dessa conversa ou preparar um material de apoio de uma página.', technique: { techniqueNum: '02', guidance: '' } },
          { label: 'Está esperando orçamento/verba', guidance: 'Descubra a janela real — pergunte a data em que o orçamento libera.' },
          { label: 'Está comparando fornecedores', guidance: 'Pergunte os critérios de comparação — não entre em disputa de preço.', technique: { techniqueNum: '05', guidance: '' } },
          { label: 'Pediu mais tempo', guidance: 'Aceite o tempo, mas combine data e o que será avaliado nesse período.', technique: { techniqueNum: '09', guidance: '' } },
          { label: 'Outro', guidance: 'Registre a resposta literal nas notas da call antes de seguir.' },
        ],
      },
      {
        id: 'validar-isolar',
        title: 'Validar e isolar',
        objective: 'Confirmar a objeção real antes de tentar resolvê-la.',
        questions: [
          'Pelo que você me disse, o ponto principal é [X], correto?',
          'Tirando isso, existe mais alguma coisa que impediria vocês de avançarem?',
        ],
        technique: { techniqueNum: '10', guidance: 'Isole a variável antes de negociar qualquer coisa.' },
      },
      {
        id: 'condicional',
        title: 'Compromisso condicional',
        objective: 'Testar se, resolvido o ponto, o negócio avança.',
        questions: ['Se essa questão estivesse resolvida hoje, existiria algum outro ponto impedindo vocês de avançarem?'],
        technique: { techniqueNum: '04', guidance: 'A resposta revela se essa é a objeção real ou só a primeira da fila.' },
      },
      {
        id: 'data-especifica',
        title: 'Data específica',
        objective: 'Nunca sair sem uma data marcada.',
        questions: ['Então vamos combinar uma data específica para retomarmos exatamente deste ponto?'],
        nextMove: 'Nunca saia sem data. "Te chamo semana que vem" não é compromisso.',
      },
      {
        id: 'fechamento',
        title: 'Fechamento',
        objective: 'Recomendar o próximo passo com base no que foi resolvido.',
        questions: ['Da minha parte, recomendo avançarmos. Faz sentido para você?'],
        technique: { techniqueNum: '01', guidance: 'Recomende — a clareza que você construiu precisa virar decisão.' },
      },
    ],
  },
];

export function getScript(id: string): MeetingScript | undefined {
  return SCRIPTS.find((s) => s.id === id);
}

// ---------------------------------------------------------------------------
// "Aconteceu na Call" — referência rápida para imprevistos durante a reunião
// ---------------------------------------------------------------------------

export interface QuickHelpItem {
  id: string;
  situation: string;
  whatsHappening: string[];
  whatNotToDo: string[];
  nextQuestion: string;
  technique?: RecommendedTechnique;
  howToConduct: string[];
}

export const QUICK_HELP: QuickHelpItem[] = [
  {
    id: 'preco-cedo',
    situation: 'Perguntou preço cedo demais',
    whatsHappening: ['Quer filtrar rápido antes de investir tempo', 'Testando se você tem preço fechado'],
    whatNotToDo: ['Dar um número sem contexto', 'Ser evasivo ou fugir da pergunta'],
    nextQuestion: 'Consigo te responder com precisão em poucos minutos — antes, me conta: [pergunta de diagnóstico]?',
    technique: { techniqueNum: '08', guidance: 'Elimine hipóteses antes de ancorar um número.' },
    howToConduct: ['Adie com uma razão real, nunca fugindo da pergunta.'],
  },
  {
    id: 'esta-caro',
    situation: 'Disse que está caro',
    whatsHappening: ['Sem orçamento alocado', 'Comparou com concorrente mais barato', 'Não percebeu valor suficiente'],
    whatNotToDo: ['Listar tudo que está incluso', 'Oferecer desconto imediato'],
    nextQuestion: 'Quando você fala caro, está comparando com o quê?',
    technique: { techniqueNum: '08', guidance: 'Mesma frase, causas diferentes — elimine antes de argumentar.' },
    howToConduct: ['Descubra a referência de comparação antes de qualquer resposta.'],
  },
  {
    id: 'falar-socio',
    situation: 'Precisa falar com o sócio',
    whatsHappening: ['Decisor real ausente da reunião', 'Quer validar sozinho antes de se comprometer'],
    whatNotToDo: ['Aceitar "te aviso depois" sem próximo passo'],
    nextQuestion: 'O que você acha que ele vai questionar?',
    technique: { techniqueNum: '02', guidance: 'Ofereça participar da conversa ou preparar material de apoio.' },
    howToConduct: ['Proponha uma call de 20 minutos com os dois, ou um racional de uma página.'],
  },
  {
    id: 'vou-pensar',
    situation: 'Quer pensar',
    whatsHappening: ['Informação incompleta — não é objeção fechada'],
    whatNotToDo: ['"Ok, te ligo semana que vem" sem contexto'],
    nextQuestion: 'O que especificamente ainda precisa ficar mais claro?',
    technique: { techniqueNum: '09', guidance: 'Vou pensar é informação incompleta, não uma resposta final.' },
    howToConduct: ['Descubra o que será pensado antes de combinar qualquer retorno.'],
  },
  {
    id: 'comparando',
    situation: 'Está comparando concorrentes',
    whatsHappening: ['Processo formal de escolha', 'Buscando validar se o preço está justo'],
    whatNotToDo: ['Falar mal do concorrente'],
    nextQuestion: 'Quais critérios vocês vão usar para comparar?',
    technique: { techniqueNum: '05', guidance: 'Ajude a construir os critérios — não entre em disputa de preço.' },
    howToConduct: ['Ofereça um comparativo dos critérios que costumam diferenciar o projeto.'],
  },
  {
    id: 'sem-orcamento',
    situation: 'Sem orçamento agora',
    whatsHappening: ['Prioridade real está em outro lugar', 'Momento errado no calendário financeiro'],
    whatNotToDo: ['Insistir que "agora é sempre a hora"'],
    nextQuestion: 'O que precisaria mudar para isso virar prioridade?',
    technique: { techniqueNum: '08', guidance: 'Descubra se é caixa, calendário ou falta de urgência real.' },
    howToConduct: ['Pergunte o gatilho concreto para retomar — e agende esse retorno.'],
  },
  {
    id: 'proposta-whatsapp',
    situation: 'Pediu proposta por WhatsApp',
    whatsHappening: ['Quer decidir sozinho, sem call', 'Testando se você aceita pular etapas'],
    whatNotToDo: ['Mandar a proposta sem próximo passo marcado'],
    nextQuestion: 'Consigo te mandar, sim — só me ajuda antes: [pergunta que falta]. Já aproveito e marco 15 minutos para te apresentar.',
    technique: { techniqueNum: '02', guidance: 'Nunca envie proposta como resposta final sem call marcada.' },
    howToConduct: ['Condicione o envio a uma pergunta de diagnóstico e a uma apresentação marcada.'],
  },
  {
    id: 'desconto',
    situation: 'Quer desconto',
    whatsHappening: ['Hábito de negociação, não necessidade real'],
    whatNotToDo: ['Ceder sem pedir nada em troca'],
    nextQuestion: 'Tirando o valor, o restante já está fechado para você?',
    technique: { techniqueNum: '10', guidance: 'Isole antes de negociar — nunca conceda sem contrapartida.' },
    howToConduct: ['Peça algo em troca: prazo maior, pagamento à vista, indicação, case público.'],
  },
  {
    id: 'comecar-depois',
    situation: 'Quer começar depois',
    whatsHappening: ['Quer reduzir risco', 'Não é prioridade real ainda'],
    whatNotToDo: ['Aceitar "depois" sem data'],
    nextQuestion: 'Começar depois é uma questão de orçamento ou de confiança?',
    technique: { techniqueNum: '03', guidance: 'Ofereça dois caminhos concretos de avanço, não um adiamento aberto.' },
    howToConduct: ['Se for confiança, proponha uma fase de diagnóstico menor em vez de adiar tudo.'],
  },
  {
    id: 'silencio-preco',
    situation: 'Ficou em silêncio após o preço',
    whatsHappening: ['Processando a decisão', 'Pode estar desconfortável, não necessariamente contra'],
    whatNotToDo: ['Preencher o silêncio explicando ou justificando o preço'],
    nextQuestion: '(nenhuma — apenas aguarde)',
    howToConduct: ['Deixe o silêncio existir. Quem fala primeiro depois do preço perde poder de negociação.'],
  },
];

// ---------------------------------------------------------------------------
// Notas da call — estado estruturado, pronto para persistir em banco no futuro
// ---------------------------------------------------------------------------

export type ObjectionFlag =
  | 'preco' | 'prazo' | 'prioridade' | 'socio' | 'concorrencia' | 'verba' | 'vouPensar' | 'outro';

export const OBJECTION_OPTIONS: { id: ObjectionFlag; label: string }[] = [
  { id: 'preco', label: 'Preço' },
  { id: 'prazo', label: 'Prazo' },
  { id: 'prioridade', label: 'Prioridade' },
  { id: 'socio', label: 'Sócio / Decisor' },
  { id: 'concorrencia', label: 'Concorrência' },
  { id: 'verba', label: 'Falta de verba' },
  { id: 'vouPensar', label: 'Vou pensar' },
  { id: 'outro', label: 'Outro' },
];

export interface MeetingNotes {
  client: string;
  company: string;
  owner: string;
  mainPain: string;
  objective: string;
  urgency: string;
  deadline: string;
  budgetMentioned: string;
  decisionMaker: string;
  competitorsMentioned: string;
  objections: ObjectionFlag[];
  observations: string;
  nextStep: string;
  nextStepDate: string;
}

export function emptyMeetingNotes(): MeetingNotes {
  return {
    client: '', company: '', owner: '', mainPain: '', objective: '', urgency: '',
    deadline: '', budgetMentioned: '', decisionMaker: '', competitorsMentioned: '',
    objections: [], observations: '', nextStep: '', nextStepDate: '',
  };
}

// ---------------------------------------------------------------------------
// Checklist de saída
// ---------------------------------------------------------------------------

export interface ExitChecklistItem {
  id: string;
  label: string;
  critical?: boolean;
}

export const EXIT_CHECKLIST: ExitChecklistItem[] = [
  { id: 'problem', label: 'Entendi o problema', critical: true },
  { id: 'why-now', label: 'Entendi por que isso importa agora' },
  { id: 'objective', label: 'Entendi o objetivo', critical: true },
  { id: 'decision-maker', label: 'Identifiquei o decisor', critical: true },
  { id: 'deadline', label: 'Identifiquei prazo' },
  { id: 'budget', label: 'Entendi investimento/orçamento quando aplicável' },
  { id: 'objections', label: 'Identifiquei objeções' },
  { id: 'validated', label: 'Validei a solução' },
  { id: 'next-step', label: 'Existe próximo passo definido', critical: true },
  { id: 'next-step-date', label: 'Existe uma DATA para o próximo passo', critical: true },
];

// ---------------------------------------------------------------------------
// Meeting — sessão de call em andamento (localStorage hoje; pronta para backend)
// ---------------------------------------------------------------------------

/** Espaço reservado para o futuro ABZA Sales Copilot: nunca preenchido manualmente hoje. */
export interface MeetingInsight {
  id: string;
  createdAt: string;
  source: 'manual' | 'ai';
  text: string;
}

export interface Meeting {
  id: string;
  scriptId: string;
  startedAt: string;
  endedAt?: string;
  currentStepIndex: number;
  notes: MeetingNotes;
  /** técnicas (por num) abertas/consultadas durante esta call */
  techniquesViewed: string[];
  checklist: Record<string, boolean>;
  selectedResponseOption?: string;
  insights?: MeetingInsight[];
}

export function createMeeting(scriptId: string): Meeting {
  return {
    id: `mtg_${Date.now().toString(36)}`,
    scriptId,
    startedAt: new Date().toISOString(),
    currentStepIndex: 0,
    notes: emptyMeetingNotes(),
    techniquesViewed: [],
    checklist: {},
  };
}
