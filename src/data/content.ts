// Conteúdo do ABZA Sales Playbook — Ed. 2026.
// Extraído do protótipo de design (Claude Design) e mantido literal.

export interface NavItem {
  num: string;
  label: string;
  id: string;
}

export const NAV: NavItem[] = [
  { num: '00', label: 'Visão Geral', id: 's00' },
  { num: '01', label: 'Filosofia ABZA', id: 's01' },
  { num: '02', label: 'Anatomia do Fechamento', id: 's02' },
  { num: '03', label: 'As 10 Técnicas', id: 's03' },
  { num: '04', label: 'Sistema de Objeções', id: 's04' },
  { num: '05', label: 'Aplicação High Ticket', id: 's05' },
  { num: '06', label: 'Biblioteca de Perguntas', id: 's06' },
  { num: '07', label: 'Roleplay', id: 's07' },
  { num: '08', label: 'Checklist de Call', id: 's08' },
  { num: '09', label: 'Diagnóstico Comercial', id: 's09' },
  { num: '10', label: 'Próximos Passos', id: 's10' },
];

export interface TechniqueExample {
  quem: string;
  fala: string;
  color: string;
}

export interface Technique {
  num: string;
  nome: string;
  momento: string;
  stars: string;
  nivel: string;
  objetivo: string;
  conceito: string;
  problema: string;
  frase: string;
  quandoUsar: string[];
  quandoNao: string[];
  exemplo: TechniqueExample[];
  script: string;
  erros: string[];
  sinais: string[];
  highTicket: string;
  exercicio: string;
}

export const TECH: Technique[] = [
  { num: '01', nome: 'Solicitar', momento: 'Fechamento', stars: '★★★★★', nivel: 'Essencial',
    objetivo: 'Pedir a decisão de forma clara e liderar o próximo passo.',
    conceito: 'Muitos vendedores apresentam bem, geram interesse e constroem valor — mas nunca convidam efetivamente o prospect a avançar. A reunião termina em "qualquer dúvida me chama". O vendedor consultivo lidera o próximo passo em vez de esperar que o cliente o proponha.',
    problema: 'Resolve o vácuo do final da call: a conversa esquenta, o valor é percebido e ninguém formaliza a recomendação. Sem pedido explícito, a decisão simplesmente não acontece.',
    frase: 'Da minha parte, eu recomendaria avançarmos. Faz sentido para você?',
    quandoUsar: ['O problema foi entendido e o cliente o reconheceu', 'A solução foi apresentada e conectada ao problema', 'O investimento já foi colocado na mesa', 'As principais objeções já foram tratadas'],
    quandoNao: ['O diagnóstico ainda está incompleto', 'Você está falando com quem não decide', 'Existe uma objeção conhecida e não resolvida', 'O cliente ainda não reconheceu o problema como prioritário'],
    exemplo: [
      { quem: 'Evitar', fala: '"Vai fechar?" — transfere toda a responsabilidade da decisão para o cliente sem recomendação profissional.', color: 'var(--abza-red-700)' },
      { quem: 'ABZA', fala: 'Pelo que você me trouxe hoje, vejo bastante aderência entre o problema e a forma como conseguimos trabalhar. Da minha parte, eu recomendaria avançarmos. Faz sentido para você?', color: 'var(--abza-red)' },
      { quem: 'Alternativa', fala: 'Existe alguma coisa que ainda impede vocês de tomar essa decisão?', color: 'var(--ink-500)' },
    ],
    script: 'Recomendo o seguinte: pelo diagnóstico que fizemos, o gargalo está na falta de uma estratégia que conecte o que vocês já executam. É exatamente o tipo de projeto que conduzimos. Minha recomendação é avançarmos com o kickoff ainda neste ciclo. Faz sentido para você?',
    erros: ['Continuar vendendo depois que o cliente já decidiu comprar', 'Pedir a decisão sem ter apresentado o investimento', 'Fazer a pergunta e preencher o silêncio antes da resposta'],
    sinais: ['O cliente já usa linguagem de futuro ("quando começarmos...")', 'As perguntas migraram de "se" para "como"', 'Não surgem novas objeções há vários minutos'],
    highTicket: 'Em ticket alto, a recomendação precisa vir com racional: pedir a decisão é apresentar uma opinião profissional fundamentada, não cobrar uma resposta. Diga por que você recomenda, e só então pergunte.',
    exercicio: 'Grave três calls suas. Marque o minuto exato em que você pediu a decisão. Se não existir esse minuto em alguma delas, reescreva o final da reunião.' },
  { num: '02', nome: 'Próximo Passo', momento: 'Avanço', stars: '★★★★★', nivel: 'Essencial',
    objetivo: 'Transformar interesse abstrato em movimento concreto via microcompromissos.',
    conceito: 'O conceito clássico do "formulário do pedido" consistia em iniciar pequenas ações relacionadas à compra antes do fechamento formal. Na ABZA, isso vira microcompromissos: em vez de pedir dados burocráticos prematuramente, você constrói o caminho da decisão junto com o cliente.',
    problema: 'Resolve o interesse que não vira agenda. Cliente elogia, pede proposta e desaparece — porque nada concreto foi combinado dentro da própria reunião.',
    frase: 'Quem além de você precisa estar confortável com essa decisão?',
    quandoUsar: ['O cliente demonstrou interesse real', 'Você precisa mapear o processo de decisão', 'Antes de enviar qualquer proposta', 'Quando existe mais de um decisor envolvido'],
    quandoNao: ['Na primeira conversa exploratória, antes de qualquer diagnóstico', 'Como forma de pressionar quem ainda não entendeu o problema', 'Para pedir documentos e dados que ainda não têm função'],
    exemplo: [
      { quem: 'Cliente', fala: 'Gostei bastante.', color: 'var(--ink-500)' },
      { quem: 'ABZA', fala: 'Perfeito. Quem além de você precisa estar confortável com essa decisão?', color: 'var(--abza-red)' },
      { quem: 'Cliente', fala: 'Meu sócio.', color: 'var(--ink-500)' },
      { quem: 'ABZA', fala: 'Então vamos fazer o seguinte: marcamos 20 minutos com vocês dois e eu apresento apenas os pontos críticos da decisão.', color: 'var(--abza-red)' },
    ],
    script: 'Antes de eu montar a proposta, me ajuda com três coisas: quem participa dessa decisão além de você, se o contrato precisa passar por jurídico e qual seria a janela realista de início. Assim eu monto algo que já cabe no processo de vocês.',
    erros: ['Pedir CNPJ e dados de contrato antes de existir decisão', 'Sair da call sem data marcada para o próximo passo', 'Aceitar "eu te retorno" como próximo passo'],
    sinais: ['O cliente pergunta sobre prazos e implementação', 'Aparece um segundo nome na conversa', 'O cliente começa a projetar o projeto internamente'],
    highTicket: 'Em projetos anuais, o próximo passo costuma ser uma call de decisão com o comitê — não a assinatura. Trate a agenda dessa call como o verdadeiro fechamento da reunião atual.',
    exercicio: 'Liste os cinco microcompromissos possíveis do seu funil. Ao final de cada call desta semana, saia com pelo menos um deles combinado e datado.' },
  { num: '03', nome: 'Ou / Ou', momento: 'Fechamento', stars: '★★★★', nivel: 'Muito útil',
    objetivo: 'Substituir uma escolha ampla demais por duas alternativas de avanço.',
    conceito: 'Decisões abertas travam. Duas alternativas concretas de avanço reduzem a carga cognitiva e tornam o próximo passo tangível — desde que ambas as opções sejam legítimas e o cliente já tenha intenção real de seguir.',
    problema: 'Resolve a paralisia de decisão em clientes que já querem avançar mas não sabem por onde começar.',
    frase: 'Para vocês faz mais sentido iniciar em setembro ou outubro?',
    quandoUsar: ['A intenção de avançar já existe e foi verbalizada', 'Restam apenas variáveis operacionais (data, escopo inicial, formato)', 'O cliente está indeciso entre caminhos, não sobre comprar'],
    quandoNao: ['O cliente ainda não decidiu comprar', 'Para forçar uma escolha entre duas opções que não interessam a ele', 'Quando uma das alternativas é claramente artificial'],
    exemplo: [
      { quem: 'Evitar', fala: '"Quer contratar?" — devolve o problema inteiro para o cliente.', color: 'var(--abza-red-700)' },
      { quem: 'ABZA', fala: 'Vocês preferem iniciar pela estratégia ou pela estruturação da aquisição?', color: 'var(--abza-red)' },
      { quem: 'ABZA', fala: 'Faz mais sentido envolver seu sócio numa próxima call ou eu preparar um racional para você apresentar internamente?', color: 'var(--abza-red)' },
    ],
    script: 'Considerando o calendário de vocês, faz mais sentido fazermos o kickoff na última semana deste mês ou na primeira do próximo? Pergunto porque a imersão inicial toma cerca de duas semanas antes de qualquer entrega.',
    erros: ['Criar falsa escolha entre duas opções idênticas', 'Usar a técnica cedo demais, como atalho para pular o diagnóstico', 'Oferecer três ou mais opções — volta a travar'],
    sinais: ['O cliente pergunta sobre datas de início', 'As dúvidas restantes são operacionais, não conceituais', 'Ele já falou "quando" alguma vez'],
    highTicket: 'Em high ticket, o Ou/Ou raramente é sobre fechar — é sobre desenhar o caminho: fase 1 versus projeto completo, kickoff agora versus após o planejamento anual.',
    exercicio: 'Escreva cinco pares de alternativas reais para os seus projetos. Elimine qualquer par em que uma das opções você não entregaria de verdade.' },
  { num: '04', nome: 'Chave de Braço', momento: 'Objeções', stars: '★★★★★', nivel: 'Essencial',
    objetivo: 'Transformar uma objeção em condição de fechamento.',
    conceito: 'Em vez de argumentar contra a objeção, você a converte em critério: "se isso for resolvido, avançamos?". A resposta revela se aquela era a objeção real ou apenas a primeira da fila.',
    problema: 'Resolve o argumento desperdiçado: responder objeções que não eram determinantes para a decisão.',
    frase: 'Se resolvermos esse ponto, existe alguma outra coisa que impediria vocês de avançarem?',
    quandoUsar: ['Surgiu uma objeção específica e nomeável', 'Antes de gastar tempo construindo o argumento', 'Antes de qualquer concessão comercial'],
    quandoNao: ['Quando a objeção ainda está vaga ("não sei, preciso ver")', 'Como forma de encurralar o cliente', 'Quando você não consegue de fato resolver o ponto levantado'],
    exemplo: [
      { quem: 'Cliente', fala: 'Tenho receio de vocês não conhecerem nosso mercado.', color: 'var(--ink-500)' },
      { quem: 'ABZA', fala: 'Entendi. Se eu conseguir te mostrar como funciona nossa imersão estratégica e exemplos de projetos em segmentos que inicialmente não conhecíamos, essa preocupação fica resolvida ou existe algum outro ponto que impediria vocês de avançarem?', color: 'var(--abza-red)' },
    ],
    script: 'Fórmula: SE RESOLVERMOS [objeção] + EXISTE MAIS ALGUMA COISA? + VOCÊ AVANÇA? — "Se eu conseguir te mostrar isso de forma clara, e não havendo outro ponto, você se sente seguro para avançarmos?"',
    erros: ['Prometer resolver algo que não se resolve', 'Fazer a pergunta e não confirmar a resolução depois', 'Usar tom de negociação agressiva em vez de curiosidade'],
    sinais: ['O cliente nomeia uma preocupação concreta', 'Ele diz "o único problema é..."', 'A conversa gira em torno de risco, não de valor'],
    highTicket: 'Em contratos longos, aplique a chave de braço antes de acionar jurídico ou financeiro: valide que a estrutura contratual é a única variável antes de mobilizar o time.',
    exercicio: 'Pegue as cinco objeções mais frequentes do seu pipeline e escreva a versão condicional de cada uma. Treine em voz alta até soar natural.' },
  { num: '05', nome: 'Matriz de Decisão', momento: 'Avaliação', stars: '★★★★', nivel: 'Muito útil',
    objetivo: 'Racionalizar a decisão comparando cenários com o cliente.',
    conceito: 'A lógica do Duque de Wellington, traduzida para uma matriz honesta de decisão: o que pesa a favor e contra, incluindo o cenário de não fazer nada. O cliente participa da construção — não é uma lista montada pelo vendedor.',
    problema: 'Resolve a decisão emocional travada: o cliente sente que deveria avançar mas não consegue justificar internamente.',
    frase: 'Qual desses fatores tem mais importância para vocês?',
    quandoUsar: ['O cliente precisa justificar a decisão para terceiros', 'Perfil analítico, orientado a dados', 'Existe comparação com o cenário de manter tudo como está'],
    quandoNao: ['Quando a matriz seria manipulada para favorecer a ABZA', 'Quando o cliente já decidiu — só adiciona atrito', 'Quando o problema ainda não está claro'],
    exemplo: [
      { quem: 'Cenário A', fala: 'Continuar como está: menor investimento imediato, nenhuma mudança, menor esforço interno — mas o problema continua e as oportunidades seguem sendo perdidas.', color: 'var(--ink-500)' },
      { quem: 'Cenário B', fala: 'Avançar com a ABZA: exige investimento e participação do time — em troca de estratégia especializada, estruturação, acompanhamento e potencial real de mudança.', color: 'var(--abza-red)' },
    ],
    script: 'Vamos fazer uma coisa: me ajuda a listar o que pesa contra essa decisão hoje. Agora o que pesa a favor. E o cenário de não fazer nada nos próximos 12 meses — o que acontece? Qual desses fatores tem mais peso para vocês?',
    erros: ['Construir a lista sozinho e apresentar pronta', 'Omitir os pontos negativos reais do projeto', 'Transformar a matriz em argumentação disfarçada'],
    sinais: ['O cliente pede tempo para "colocar no papel"', 'Ele menciona que precisa justificar para o board', 'Surge comparação com fornecedores ou com o status quo'],
    highTicket: 'Em decisões de comitê, entregue a matriz como documento: ela costuma ser o material que o seu contato usa para defender o projeto quando você não está na sala.',
    exercicio: 'Monte a matriz de um cliente atual incluindo três pontos genuinamente negativos do projeto. Se você não consegue listar três, você não conhece o projeto.' },
  { num: '06', nome: 'História Semelhante', momento: 'Valor / Prova', stars: '★★★★★', nivel: 'Essencial',
    objetivo: 'Gerar confiança por reconhecimento de padrão, sem intimidar.',
    conceito: 'A versão clássica ("história intimidante") usa medo. A ABZA usa storytelling comercial: um cliente parecido, um problema parecido, uma decisão, uma ação e um resultado real. O efeito buscado é "eles já viram esse problema antes" — não "se eu não comprar vai dar errado".',
    problema: 'Resolve a falta de confiança e a sensação de ineditismo: o cliente acha que o caso dele é único e imprevisível.',
    frase: 'Atendemos uma empresa que estava numa situação muito parecida.',
    quandoUsar: ['O cliente demonstra insegurança quanto ao risco', 'Você tem um case real e comparável', 'Para dar contexto antes de apresentar uma recomendação'],
    quandoNao: ['Quando não existe case real — nunca invente', 'Para criar medo artificial de perder oportunidade', 'Quando o case citado não tem semelhança verdadeira'],
    exemplo: [
      { quem: 'Estrutura', fala: 'Cliente parecido → problema parecido → decisão → ação → resultado.', color: 'var(--ink-500)' },
      { quem: 'ABZA', fala: 'Atendemos uma empresa que estava numa situação muito parecida. Eles já produziam conteúdo, investiam em mídia e tinham fornecedores bons. O problema não era execução. Era que ninguém conectava tudo dentro de uma estratégia.', color: 'var(--abza-red)' },
    ],
    script: 'Deixa eu te contar uma situação parecida. [Cliente com contexto semelhante]. O problema deles era o mesmo que você descreveu. A decisão que tomaram foi [decisão]. O que fizemos foi [ação]. Em [prazo], o que mudou foi [resultado verificável].',
    erros: ['Inventar cases ou inflar resultados', 'Contar história longa demais e perder o ponto', 'Usar case de segmento sem qualquer relação'],
    sinais: ['O cliente pergunta "vocês já fizeram isso antes?"', 'Ele questiona conhecimento de mercado', 'Aparece insegurança sobre o time interno dele'],
    highTicket: 'Quanto maior o ticket, mais o case precisa incluir o que deu errado no caminho. Cases perfeitos soam comerciais; cases com fricção soam verdadeiros.',
    exercicio: 'Escreva três cases da ABZA em cinco frases cada, seguindo a estrutura. Valide os números com quem conduziu o projeto antes de usar.' },
  { num: '07', nome: 'Venda Perdida', momento: 'Negócio perdido', stars: '★★★★★', nivel: 'Essencial',
    objetivo: 'Descobrir a objeção real depois que o cliente já disse não.',
    conceito: 'Quando você para de tentar vender, a pressão sai da sala e o cliente costuma revelar o motivo verdadeiro. É a única técnica que se aplica após o "não" — e frequentemente reabre a conversa por um caminho legítimo.',
    problema: 'Resolve o não sem diagnóstico: perder o negócio e também o aprendizado.',
    frase: 'Onde você acha que eu falhei em demonstrar valor?',
    quandoUsar: ['O cliente comunicou que não vai avançar', 'Você quer entender o motivo real da perda', 'Depois de aceitar a decisão de forma genuína'],
    quandoNao: ['Como truque para reabrir a negociação disfarçadamente', 'Antes do cliente efetivamente dizer não', 'Se você não estiver disposto a aceitar a resposta'],
    exemplo: [
      { quem: 'Cliente', fala: 'Não vamos avançar.', color: 'var(--ink-500)' },
      { quem: 'ABZA', fala: 'Tranquilo. Não vou tentar mudar tua decisão. Mas queria aprender com essa conversa: onde você acha que eu não consegui demonstrar valor?', color: 'var(--abza-red)' },
      { quem: 'Cliente', fala: 'O trabalho é bom. O problema foi o contrato de 12 meses.', color: 'var(--ink-500)' },
      { quem: 'Resultado', fala: 'Agora surgiu a objeção verdadeira — e ela é negociável. Encadeie: Chave de Braço → Objeção Final.', color: 'var(--abza-red-700)' },
    ],
    script: 'Tudo bem, respeito a decisão e não vou tentar revertê-la. Mas você me ajudaria muito com uma coisa: pelo diagnóstico que fizemos, eu realmente imaginei que havia aderência. O que pesou mais na decisão de não seguir?',
    erros: ['Fingir aceitação e voltar a vender na frase seguinte', 'Fazer a pergunta por e-mail, onde a resposta vem protocolar', 'Reagir defensivamente à resposta recebida'],
    sinais: ['O cliente encerra a conversa educadamente sem justificativa clara', 'A recusa não bate com o interesse demonstrado antes', 'O motivo dado é genérico demais'],
    highTicket: 'Em ticket alto, esta conversa vale mesmo quando não reabre o negócio: o motivo real de perda é a informação mais valiosa que o time comercial pode levar para a próxima proposta.',
    exercicio: 'Nos últimos cinco negócios perdidos, você sabe o motivo real de cada um? Ligue para dois deles esta semana e pergunte.' },
  { num: '08', nome: 'Processo de Eliminação', momento: 'Objeções', stars: '★★★★★', nivel: 'Essencial',
    objetivo: 'Descobrir a objeção antes de respondê-la.',
    conceito: 'Uma frase vaga pode esconder problemas completamente diferentes. Em vez de argumentar, você elimina hipóteses: confiança, investimento, escopo, momento, retorno, decisor ou prioridade.',
    problema: 'Resolve o argumento cego: responder à objeção errada e criar dúvidas que o cliente ainda não tinha.',
    frase: 'Quando você fala caro, está comparando com o quê?',
    quandoUsar: ['A objeção veio vaga ou genérica', 'O cliente diz "não tenho certeza"', 'Sempre antes de qualquer argumentação de valor'],
    quandoNao: ['Quando a objeção já veio nomeada com precisão', 'Como interrogatório em sequência de cinco perguntas seguidas', 'Quando o cliente já demonstrou desconforto com perguntas'],
    exemplo: [
      { quem: 'Cliente', fala: 'Está caro.', color: 'var(--ink-500)' },
      { quem: 'Não responda', fala: 'Mas veja tudo que está incluso...', color: 'var(--abza-red-700)' },
      { quem: 'ABZA', fala: 'Quando você fala caro, está comparando com outro fornecedor, com o orçamento que vocês separaram ou com o retorno que imagina conseguir gerar?', color: 'var(--abza-red)' },
      { quem: 'Leitura', fala: 'Mesma frase, três problemas completamente diferentes — e três respostas diferentes.', color: 'var(--ink-500)' },
    ],
    script: 'Só para eu te ajudar direito: quando você diz que não tem certeza, é mais uma questão de confiança no time, de investimento, de escopo, de momento ou de retorno? Qualquer uma delas é legítima — só muda o que eu preciso te mostrar.',
    erros: ['Oferecer a lista de hipóteses com tom de teste', 'Parar na primeira resposta sem confirmar', 'Sugerir uma hipótese que planta uma objeção nova'],
    sinais: ['Respostas curtas e genéricas', 'O cliente muda de assunto ao tocar no ponto', 'A objeção reaparece em formatos diferentes'],
    highTicket: 'Em vendas complexas, a objeção verdadeira raramente é a primeira verbalizada. Considere concluída a investigação só quando o cliente nomear um risco específico.',
    exercicio: 'Liste as sete categorias de objeção e escreva uma pergunta de eliminação para cada. Use uma delas na próxima call em que ouvir "vou avaliar".' },
  { num: '09', nome: 'Eu Vou Pensar', momento: 'Fechamento', stars: '★★★★★', nivel: 'Essencial',
    objetivo: 'Converter uma resposta vaga em informação utilizável.',
    conceito: '"Vou pensar" não é objeção — é informação incompleta. Aceitá-lo sem entender o que exatamente será pensado transforma o follow-up em perseguição sem contexto.',
    problema: 'Resolve o pipeline cheio de oportunidades paradas em estágio indefinido.',
    frase: 'Quando você diz que quer pensar, qual parte da decisão ainda precisa ficar mais clara?',
    quandoUsar: ['O cliente adia a decisão sem nomear o motivo', 'Ao final de uma reunião que correu bem', 'Antes de combinar qualquer follow-up'],
    quandoNao: ['Quando o cliente pede tempo por razão explícita e legítima', 'Insistindo depois de já ter recebido a resposta', 'Com tom de cobrança'],
    exemplo: [
      { quem: 'Cliente', fala: 'Gostei bastante. Vou pensar.', color: 'var(--ink-500)' },
      { quem: 'ABZA', fala: 'Claro, é uma decisão importante. Para eu não ficar te perseguindo depois com follow-up sem contexto: o que especificamente você quer avaliar antes de decidir?', color: 'var(--abza-red)' },
      { quem: 'Se disser sócio', fala: '"O que você acredita que ele vai questionar?"', color: 'var(--ink-500)' },
      { quem: 'Se disser investimento', fala: '"É mais uma questão de disponibilidade financeira ou ainda não está claro se o retorno justifica o investimento?"', color: 'var(--ink-500)' },
      { quem: 'Se disser comparar', fala: '"Quais critérios você vai utilizar para comparar as opções?"', color: 'var(--ink-500)' },
    ],
    script: 'Faz todo sentido pensar. Só me ajuda a te ajudar: quais pontos ainda precisam ficar mais claros? Pergunto porque, se for algo que eu consigo esclarecer agora, evitamos duas semanas de troca de e-mails.',
    erros: ['Responder "claro, te ligo semana que vem" e encerrar', 'Perguntar de forma que soe como desconfiança', 'Não combinar data e formato do retorno'],
    sinais: ['Elogio seguido de adiamento', 'Ausência de perguntas técnicas durante a call', 'O cliente evita falar de prazos'],
    highTicket: 'Em projetos anuais, "vou pensar" normalmente significa "preciso alinhar internamente". Descubra com quem, sobre o quê, e se ofereça para preparar o material dessa conversa.',
    exercicio: 'Nas próximas três calls que terminarem em "vou pensar", registre a resposta obtida. Compare: quantas eram sobre investimento e quantas eram sobre risco?' },
  { num: '10', nome: 'Objeção Final', momento: 'Negociação', stars: '★★★★★', nivel: 'Essencial',
    objetivo: 'Isolar a variável antes de negociar qualquer coisa.',
    conceito: 'Antes de conceder prazo, preço ou escopo, confirme que aquele é o único ponto pendente. Isolar a variável impede concessões que não produzem decisão.',
    problema: 'Resolve o desconto que não fecha negócio: dar concessão e ouvir uma nova objeção logo em seguida.',
    frase: 'Tirando esse ponto, existe alguma outra coisa que impediria vocês de avançarem?',
    quandoUsar: ['Surgiu uma objeção comercial concreta', 'Antes de acionar jurídico, financeiro ou desconto', 'Quando você suspeita que existe mais de um bloqueio'],
    quandoNao: ['Antes de compreender a objeção declarada', 'Quando o cliente ainda não percebeu valor', 'Como pressão para o cliente se comprometer no vazio'],
    exemplo: [
      { quem: 'Cliente', fala: 'O problema é o contrato de 12 meses.', color: 'var(--ink-500)' },
      { quem: 'ABZA', fala: 'Perfeito. Tirando o prazo contratual, existe alguma outra coisa que impediria vocês de avançarem?', color: 'var(--abza-red)' },
      { quem: 'Cliente', fala: 'Não.', color: 'var(--ink-500)' },
      { quem: 'ABZA', fala: 'Então, se conseguirmos encontrar uma estrutura contratual que deixe vocês confortáveis, você se sente seguro para avançar?', color: 'var(--abza-red)' },
    ],
    script: 'Fluxo: objeção → isolar → confirmar → negociar → compromisso. "Antes de eu levar isso internamente, quero ter certeza de que é o único ponto. Tirando [variável], existe algo mais? Se resolvermos, avançamos?"',
    erros: ['Negociar antes de isolar', 'Conceder sem receber nada em troca', 'Aceitar "acho que não" como confirmação'],
    sinais: ['O cliente foca em uma cláusula específica', 'Ele pede desconto sem questionar o escopo', 'Surge menção a aprovação de terceiros'],
    highTicket: 'Regra de negociação ABZA: nunca entregue uma concessão sem descobrir o que recebe em troca — antecipação de pagamento, prazo maior, case público, indicação.',
    exercicio: 'Revise as três últimas negociações em que houve desconto. Em quantas você isolou a variável antes? Em quantas o desconto realmente fechou o negócio?' },
];

export interface Objection {
  titulo: string;
  tecnica: string;
  portras: string[];
  naoResponder: string[];
  perguntas: string[];
  script: string;
  proxima: string;
}

export const OBJ: Objection[] = [
  { titulo: 'Está caro', tecnica: 'Processo de Eliminação',
    portras: ['Não percebeu valor suficiente', 'Comparou com um fornecedor mais barato', 'Não tem orçamento alocado neste ciclo', 'Não enxerga o retorno com clareza'],
    naoResponder: ['Listar tudo que está incluso', 'Oferecer desconto imediato', 'Justificar o preço com esforço interno da ABZA'],
    perguntas: ['Quando você fala caro, está comparando com outro fornecedor, com o orçamento separado ou com o retorno esperado?', 'O que precisaria acontecer para esse investimento fazer sentido?'],
    script: 'Entendi. Só para eu te responder com precisão: quando você diz caro, é caro em relação ao orçamento que vocês reservaram, a outra proposta, ou ao retorno que você consegue projetar hoje? Cada um desses casos muda completamente a conversa.',
    proxima: 'Com o que exatamente vocês estão comparando esse investimento?' },
  { titulo: 'Vou pensar', tecnica: 'Eu Vou Pensar',
    portras: ['Falta clareza sobre um ponto específico', 'Precisa alinhar com outro decisor', 'Não quer dizer não na sua frente', 'A prioridade interna mudou'],
    naoResponder: ['"Sem problemas, te ligo semana que vem"', 'Reapresentar a proposta inteira', 'Criar urgência artificial com prazo inventado'],
    perguntas: ['O que especificamente você quer avaliar?', 'Quem precisa participar dessa reflexão?', 'Quais pontos ainda precisam ficar claros?'],
    script: 'Claro, é uma decisão importante. Para eu não te perseguir com follow-up sem contexto: qual parte da decisão ainda precisa ficar mais clara? Se for algo que eu consigo esclarecer agora, resolvemos em dois minutos.',
    proxima: 'Se esse ponto ficar resolvido, o restante faz sentido para vocês?' },
  { titulo: 'Preciso falar com meu sócio', tecnica: 'Próximo Passo',
    portras: ['Existe mesmo um segundo decisor', 'Ele quer tempo para pensar sozinho', 'Não se sente seguro para defender o projeto', 'Você mapeou mal o processo de decisão'],
    naoResponder: ['"Sem problemas, me avisa depois"', 'Enviar a proposta e esperar', 'Tentar convencer só o seu contato com mais argumentos'],
    perguntas: ['O que você acredita que ele vai questionar?', 'Faz sentido eu participar dessa conversa?', 'Quem mais precisa estar confortável com essa decisão?'],
    script: 'Perfeito, faz sentido. Duas coisas: o que você imagina que ele vai questionar? E prefere que eu prepare um racional de uma página para você apresentar, ou que a gente marque 20 minutos com vocês dois para eu responder direto?',
    proxima: 'Quando vocês conseguem conversar? Deixo a agenda reservada para o dia seguinte.' },
  { titulo: 'Agora não é o momento', tecnica: 'Processo de Eliminação',
    portras: ['Prioridade real está em outro projeto', 'Falta de caixa neste trimestre', 'Não enxerga urgência no problema', 'Recusa educada'],
    naoResponder: ['Insistir que o momento é sempre agora', 'Aceitar sem entender o que muda depois', 'Prometer condição especial se decidir hoje'],
    perguntas: ['O que precisaria mudar para virar prioridade?', 'O que acontece se nada mudar nos próximos 12 meses?', 'Existe alguma data ou evento que destrava isso?'],
    script: 'Entendo. Me ajuda a entender o que faria isso virar prioridade — é uma questão de caixa, de calendário interno ou de o problema ainda não estar doendo o suficiente? Pergunto porque a resposta muda se eu volto em 30 dias ou em seis meses.',
    proxima: 'Qual seria o gatilho concreto para retomarmos essa conversa?' },
  { titulo: 'Já temos uma agência', tecnica: 'Matriz de Decisão',
    portras: ['Está satisfeito e não vê motivo para mudar', 'Está insatisfeito mas evita o custo da troca', 'Contrato vigente com prazo', 'Não entendeu a diferença de escopo'],
    naoResponder: ['Criticar o fornecedor atual', 'Prometer fazer o mesmo mais barato', 'Comparar entregas ponto a ponto'],
    perguntas: ['O que funciona bem hoje e o que você mudaria?', 'O que vocês esperavam que já tivesse acontecido e não aconteceu?', 'Como vocês avaliam esse trabalho hoje?'],
    script: 'Ótimo, e isso é bom sinal. Não vim propor substituição por substituição. Me conta: o que funciona bem hoje, e o que você esperava que já tivesse acontecido e ainda não aconteceu? Se a resposta for "nada", eu sou o primeiro a dizer que não faz sentido conversarmos agora.',
    proxima: 'Existe alguma frente estratégica que hoje não está coberta por ninguém?' },
  { titulo: 'Preciso comparar', tecnica: 'Matriz de Decisão',
    portras: ['Processo formal de concorrência', 'Insegurança sobre critérios', 'Busca por preço menor', 'Quer validar a decisão internamente'],
    naoResponder: ['Falar mal dos concorrentes', 'Baixar preço antes da comparação', 'Pressionar para decidir sem comparar'],
    perguntas: ['Quais critérios vocês vão utilizar para comparar?', 'Quem participa dessa avaliação?', 'O que faria uma proposta ganhar de outra?'],
    script: 'Comparar é o certo a fazer num projeto desse porte. Me diz quais critérios vocês vão usar — se for só preço, eu já te adianto que provavelmente não seremos os mais baratos. Se entrar profundidade estratégica e acompanhamento, aí a conversa é outra.',
    proxima: 'Posso te enviar um comparativo dos critérios que costumam diferenciar esse tipo de projeto?' },
  { titulo: 'Não tenho certeza do retorno', tecnica: 'Chave de Braço',
    portras: ['Experiência anterior frustrada', 'Não sabe como medir resultado', 'Expectativa desalinhada de prazo', 'Falta de indicadores internos'],
    naoResponder: ['Prometer números específicos de resultado', 'Mostrar cases sem relação com o contexto', 'Garantir prazo de retorno'],
    perguntas: ['Como vocês medem resultado hoje?', 'O que seria um bom retorno para vocês em 12 meses?', 'Qual experiência anterior gerou essa dúvida?'],
    script: 'Legítimo, e eu não vou te prometer número. O que consigo é te mostrar como acompanhamos impacto: quais indicadores olhamos, com que frequência, e o que fazemos quando não está funcionando. Se eu te mostrar isso de forma clara, essa preocupação fica resolvida?',
    proxima: 'Quais indicadores precisariam se mover para você considerar o projeto bem-sucedido?' },
  { titulo: 'Contrato muito longo', tecnica: 'Objeção Final',
    portras: ['Receio de errar na escolha', 'Política interna de contratação', 'Insegurança sobre fluxo de caixa', 'Quer testar antes de se comprometer'],
    naoResponder: ['Reduzir o prazo imediatamente', 'Justificar apenas com custo operacional da ABZA', 'Ignorar e seguir para assinatura'],
    perguntas: ['Tirando o prazo, existe algo mais que impediria o avanço?', 'O receio é de resultado ou de flexibilidade?', 'Que estrutura deixaria vocês confortáveis?'],
    script: 'Perfeito. Tirando o prazo contratual, existe alguma outra coisa que impediria vocês de avançarem? Se não, vamos desenhar juntos uma estrutura que respeite o tempo mínimo que o projeto precisa e o conforto que vocês precisam.',
    proxima: 'Se encontrarmos uma estrutura confortável, você se sente seguro para avançar?' },
  { titulo: 'Não conheço a ABZA o suficiente', tecnica: 'História Semelhante',
    portras: ['Falta de prova social no segmento', 'Primeira conversa com o time', 'Receio sobre tamanho ou estrutura', 'Decisão de alto risco reputacional interno'],
    naoResponder: ['Listar clientes sem conexão com o caso', 'Falar de prêmios e conquistas da agência', 'Prometer atenção especial genérica'],
    perguntas: ['O que você precisaria ver para se sentir seguro?', 'É sobre capacidade técnica ou sobre continuidade?', 'Faz sentido conversar com um cliente atual nosso?'],
    script: 'Justo. Me diz o que você precisaria ver para se sentir seguro: um projeto parecido em detalhe, uma conversa com um cliente atual, ou conhecer o time que estaria no seu projeto? Qualquer um dos três eu consigo organizar esta semana.',
    proxima: 'Prefere ver o caso em detalhe ou falar diretamente com quem já passou por isso?' },
  { titulo: 'Quero começar menor', tecnica: 'Ou / Ou',
    portras: ['Quer reduzir risco antes de escalar', 'Restrição orçamentária real', 'Não percebeu valor no escopo completo', 'Precisa de vitória rápida para justificar internamente'],
    naoResponder: ['Aceitar qualquer redução para fechar', 'Recusar de imediato sem avaliar', 'Fatiar o projeto de um jeito que inviabiliza o resultado'],
    perguntas: ['O que te faria confortável para ampliar depois?', 'Qual frente resolveria o problema mais urgente?', 'Começar menor é sobre orçamento ou sobre confiança?'],
    script: 'Consigo trabalhar com isso, desde que o recorte ainda produza resultado. Me diz: começar menor é sobre orçamento ou sobre confiança? Se for confiança, faz mais sentido fecharmos uma fase de diagnóstico do que cortar a execução pela metade.',
    proxima: 'Se a primeira fase entregar o que combinamos, o que definiria a ampliação?' },
];

export interface Movimento {
  n: string;
  nome: string;
  desc: string;
  frase: string;
  detalhe: string;
}

export const METODO: Movimento[] = [
  { n: '01', nome: 'Pausar', desc: 'Não responda imediatamente.', frase: 'Silêncio de dois segundos antes de qualquer resposta.', detalhe: 'A resposta reflexa é o principal destruidor de reuniões boas. Pausar sinaliza consideração e te dá tempo para escolher entre argumentar e perguntar — quase sempre perguntar é melhor.' },
  { n: '02', nome: 'Clarificar', desc: 'Entenda o que a frase realmente significa.', frase: '"Quando você fala X, o que exatamente te preocupa?"', detalhe: 'A objeção declarada raramente é a objeção central. Clarificar transforma uma frase genérica em um risco nomeável — e só riscos nomeáveis podem ser resolvidos.' },
  { n: '03', nome: 'Isolar', desc: 'Confirme se é o único ponto.', frase: '"Além disso, existe alguma outra coisa?"', detalhe: 'Isolar impede que você gaste argumento, tempo e concessão em um bloqueio que não era o determinante da decisão.' },
  { n: '04', nome: 'Condicionar', desc: 'Transforme o ponto em critério.', frase: '"Se resolvermos esse ponto, você se sente confortável para avançar?"', detalhe: 'A resposta a esta pergunta vale mais que qualquer argumento: ela revela se você está diante da objeção real ou da primeira de uma fila.' },
  { n: '05', nome: 'Resolver', desc: 'Argumento, case, dado, prova ou ajuste.', frase: 'Agora — e só agora — você responde.', detalhe: 'Resolver pode ser um argumento, uma demonstração, um case, um dado, uma mudança de escopo ou uma negociação. A escolha depende inteiramente do que os movimentos 02 e 03 revelaram.' },
  { n: '06', nome: 'Confirmar', desc: 'Verifique se o ponto caiu de fato.', frase: '"Como você enxerga esse ponto agora?"', detalhe: 'Sem confirmação, você não sabe se resolveu ou apenas falou. Objeções não confirmadas retornam — geralmente por e-mail, dias depois, sem você na sala.' },
  { n: '07', nome: 'Solicitar', desc: 'Peça a decisão com recomendação.', frase: '"Então minha recomendação é avançarmos. Faz sentido para você?"', detalhe: 'Fechar o ciclo: a objeção virou clareza, e a clareza precisa virar decisão. Sem este movimento, todo o trabalho anterior termina em "qualquer coisa me avisa".' },
];

export interface QuestionCategory {
  nome: string;
  itens: [pergunta: string, uso: string][];
}

export const CATS: QuestionCategory[] = [
  { nome: 'Diagnóstico', itens: [
    ['Por que vocês começaram a olhar para isso agora?', 'Abertura'],
    ['O que está acontecendo hoje que deveria estar acontecendo diferente?', 'Gap'],
    ['Qual o impacto desse problema?', 'Dimensionamento'],
    ['O que vocês já tentaram fazer?', 'Histórico'],
    ['O que acontece se nada mudar nos próximos 12 meses?', 'Custo da inação'],
  ]},
  { nome: 'Decisão', itens: [
    ['Quem além de você participa dessa decisão?', 'Mapa de decisores'],
    ['Quais critérios vocês vão utilizar para decidir?', 'Critérios'],
    ['Existe alguma data importante para isso começar?', 'Timing'],
    ['O que precisa acontecer para vocês se sentirem seguros em avançar?', 'Condição'],
  ]},
  { nome: 'Objeções', itens: [
    ['Quando você fala X, o que exatamente te preocupa?', 'Clarificar'],
    ['Além disso, existe mais alguma coisa?', 'Isolar'],
    ['Se resolvermos esse ponto, o restante faz sentido?', 'Condicionar'],
  ]},
  { nome: 'Investimento', itens: [
    ['É uma questão de disponibilidade ou de percepção de retorno?', 'Eliminação'],
    ['Com o que vocês estão comparando esse investimento?', 'Referência'],
    ['O que precisaria acontecer para esse investimento fazer sentido?', 'Condição'],
  ]},
  { nome: 'Vou pensar', itens: [
    ['O que especificamente você quer avaliar?', 'Clarificar'],
    ['Quem precisa participar dessa reflexão?', 'Decisores'],
    ['Quais pontos ainda precisam ficar claros?', 'Lacunas'],
  ]},
  { nome: 'Fechamento', itens: [
    ['Existe alguma coisa que ainda impede vocês de avançarem?', 'Solicitar'],
    ['Da minha parte, eu recomendaria seguir. Faz sentido para você?', 'Recomendação'],
    ['Qual seria o melhor próximo passo?', 'Próximo passo'],
  ]},
];

export interface Roleplay {
  n: string;
  titulo: string;
  dificuldade: string;
  cenario: string;
  objecao: string;
  tecnicas: string[];
}

export const ROLES: Roleplay[] = [
  { n: '01', titulo: 'Cliente interessado', dificuldade: 'Iniciante', cenario: 'O prospect chegou por indicação, reconhece o problema e demonstrou entusiasmo durante toda a apresentação. Tudo indica que vai avançar — e é exatamente por isso que o vendedor costuma continuar apresentando quando já deveria ter parado.', objecao: 'Gostei muito. E aí, como funciona daqui pra frente?', tecnicas: ['01 Solicitar', '03 Ou / Ou', '02 Próximo Passo'] },
  { n: '02', titulo: 'Cliente analítico', dificuldade: 'Iniciante', cenario: 'Diretor de operações, orientado a dados, pede planilha comparativa e questiona metodologia. Não é resistência: é forma de decidir. Ele precisa de estrutura para defender a escolha internamente.', objecao: 'Como vocês medem que isso funcionou? Quero ver o racional.', tecnicas: ['05 Matriz de Decisão', '06 História Semelhante'] },
  { n: '03', titulo: 'Cliente desconfiado', dificuldade: 'Intermediário', cenario: 'Teve experiência ruim com duas agências anteriores. Responde de forma curta, evita se comprometer e testa seu conhecimento de mercado logo nos primeiros minutos.', objecao: 'Todo mundo fala isso. Por que com vocês seria diferente?', tecnicas: ['06 História Semelhante', '08 Processo de Eliminação'] },
  { n: '04', titulo: 'Cliente comparando concorrentes', dificuldade: 'Intermediário', cenario: 'Três propostas na mesa, sendo uma bem mais barata. Processo formal de escolha, com apresentação para o board na semana seguinte.', objecao: 'Recebi uma proposta 40% menor pelo mesmo escopo.', tecnicas: ['08 Processo de Eliminação', '05 Matriz de Decisão'] },
  { n: '05', titulo: 'Cliente com objeção de preço', dificuldade: 'Intermediário', cenario: 'Percebeu valor, gostou do time, mas trava no número. Não fica claro se é orçamento, comparação ou percepção de retorno.', objecao: 'Faz sentido, mas está acima do que imaginávamos.', tecnicas: ['08 Processo de Eliminação', '04 Chave de Braço'] },
  { n: '06', titulo: 'Cliente "vou pensar"', dificuldade: 'Intermediário', cenario: 'Reunião excelente, zero objeções verbalizadas, e no minuto final vem o adiamento. Nenhuma pergunta técnica foi feita durante a call.', objecao: 'Ficou muito bom. Vou pensar e te retorno.', tecnicas: ['09 Eu Vou Pensar', '08 Processo de Eliminação'] },
  { n: '07', titulo: 'Cliente com sócio ausente', dificuldade: 'Avançado', cenario: 'Seu contato está convencido, mas não decide sozinho. O sócio nunca participou de nenhuma reunião e é descrito como "mais conservador".', objecao: 'Por mim seguimos, mas preciso alinhar com meu sócio.', tecnicas: ['02 Próximo Passo', '05 Matriz de Decisão'] },
  { n: '08', titulo: 'Cliente querendo desconto', dificuldade: 'Avançado', cenario: 'Pede redução de 20% sem questionar escopo. Sinal clássico de que o desconto é hábito de negociação, não necessidade real.', objecao: 'Se vocês fizerem por 20% menos, eu assino hoje.', tecnicas: ['10 Objeção Final', '04 Chave de Braço'] },
  { n: '09', titulo: 'Cliente quase perdido', dificuldade: 'Avançado', cenario: 'Comunicou por mensagem que não vai avançar, sem justificativa detalhada. Você tem uma última conversa de cinco minutos.', objecao: 'Decidimos não seguir por enquanto. Obrigado pelo tempo.', tecnicas: ['07 Venda Perdida', '04 Chave de Braço'] },
  { n: '10', titulo: 'Negociação high ticket complexa', dificuldade: 'Especialista', cenario: 'Projeto anual, três decisores com interesses diferentes, jurídico envolvido e comparação com estruturação de time interno. Ciclo de decisão de 60 dias.', objecao: 'Estamos avaliando montar isso internamente em vez de contratar.', tecnicas: ['05 Matriz de Decisão', '10 Objeção Final', '01 Solicitar'] },
];

export const CHECK: string[] = [
  'O cliente reconheceu um problema?', 'O problema possui impacto mensurável?', 'Existe prioridade dentro da empresa?',
  'Existe orçamento ou capacidade de investimento?', 'Conhecemos o processo de decisão?', 'Conhecemos todos os decisores?',
  'O cliente percebe valor na solução?', 'A solução está conectada ao problema declarado?',
  'Não existe objeção relevante em aberto?', 'Existe próximo passo definido e datado?',
];

export interface TreeStep {
  n: string;
  nome: string;
}

export interface TreeNode {
  pergunta: string;
  rota: TreeStep[];
  nota: string;
}

export const TREE: TreeNode[] = [
  { pergunta: 'O cliente está pronto para decidir?', rota: [{ n: '01', nome: 'Solicitar' }, { n: '03', nome: 'Ou / Ou' }], nota: 'Faça a recomendação e ofereça duas alternativas reais de avanço. Pare de apresentar — a venda já está feita.' },
  { pergunta: 'Não sei se ele está pronto.', rota: [{ n: '08', nome: 'Processo de Eliminação' }, { n: '01', nome: 'Solicitar' }], nota: 'Investigue antes de argumentar. Elimine hipóteses até nomear o que ainda falta, e só então peça a decisão.' },
  { pergunta: 'Ele apresentou uma objeção concreta.', rota: [{ n: '—', nome: 'Clarificar' }, { n: '10', nome: 'Objeção Final' }, { n: '04', nome: 'Chave de Braço' }], nota: 'Clarifique, isole a variável e condicione. Só negocie depois de confirmar que aquele é o único bloqueio.' },
  { pergunta: 'Ele disse "vou pensar".', rota: [{ n: '09', nome: 'Eu Vou Pensar' }, { n: '08', nome: 'Processo de Eliminação' }], nota: 'Não aceite a frase como resposta final. Descubra o que exatamente será pensado e por quem.' },
  { pergunta: 'Ele disse não definitivamente.', rota: [{ n: '07', nome: 'Venda Perdida' }, { n: '04', nome: 'Chave de Braço' }], nota: 'Aceite a decisão de verdade e peça aprendizado. Se surgir a objeção real, ela costuma ser negociável.' },
  { pergunta: 'Ele precisa racionalizar ou ganhar confiança.', rota: [{ n: '05', nome: 'Matriz de Decisão' }, { n: '06', nome: 'História Semelhante' }], nota: 'Construa a matriz com ele, incluindo o cenário de não fazer nada, e ancore com um case real e comparável.' },
];

export const MATRIZ: [tecnica: string, objetivo: string, momento: string, risco: string, stars: string][] = [
  ['Solicitar', 'pedir decisão', 'fechamento', 'baixo', '★★★★★'],
  ['Próximo Passo', 'criar compromisso', 'avanço', 'médio', '★★★★★'],
  ['Ou / Ou', 'facilitar decisão', 'fechamento', 'médio', '★★★★'],
  ['Chave de Braço', 'condicionar objeção', 'objeções', 'baixo', '★★★★★'],
  ['Matriz de Decisão', 'racionalizar decisão', 'avaliação', 'baixo', '★★★★'],
  ['História Semelhante', 'gerar confiança', 'valor / prova', 'baixo', '★★★★★'],
  ['Venda Perdida', 'descobrir objeção real', 'negócio perdido', 'baixo', '★★★★★'],
  ['Processo de Eliminação', 'descobrir objeção', 'objeções', 'baixo', '★★★★★'],
  ['Eu Vou Pensar', 'identificar incerteza', 'fechamento', 'baixo', '★★★★★'],
  ['Objeção Final', 'isolar variável', 'negociação', 'baixo', '★★★★★'],
];

export const DIALOGO: [quem: string, fala: string, tag: string][] = [
  ['Cliente', 'Gostei bastante. Vou pensar e depois te retorno.', ''],
  ['ABZA', 'Claro. É uma decisão que merece ser pensada. Mas me ajuda numa coisa: quando você fala que quer pensar, o que especificamente ainda precisa ficar mais claro?', '09 Eu Vou Pensar'],
  ['Cliente', 'Principalmente o investimento.', ''],
  ['ABZA', 'Quando você fala investimento, é mais uma questão de caixa ou você ainda não conseguiu visualizar se o projeto consegue justificar esse valor?', '08 Processo de Eliminação'],
  ['Cliente', 'Mais retorno.', ''],
  ['ABZA', 'Tirando a questão do retorno, existe algum outro ponto que faria vocês não avançarem?', '10 Objeção Final'],
  ['Cliente', 'Não.', ''],
  ['ABZA', 'Se eu conseguir te mostrar de forma clara como vamos acompanhar impacto e retorno, você se sente confortável para avançar?', '04 Chave de Braço'],
  ['ABZA', 'Deixa eu te mostrar um caso parecido: uma empresa que já investia em mídia e produzia conteúdo, mas não tinha ninguém conectando isso a uma estratégia. Estruturamos o acompanhamento em quatro indicadores e revisamos mensalmente.', '06 História Semelhante'],
  ['Cliente', 'Isso responde bem a minha dúvida.', ''],
  ['ABZA', 'Para mim faz sentido avançarmos. Vocês preferem fazer o kickoff na última semana deste mês ou na primeira do próximo?', '01 Solicitar + 03 Ou / Ou'],
];

export const HERO_STATS = [
  { value: '10', label: 'Técnicas de fechamento' },
  { value: '07', label: 'Movimentos de objeção' },
  { value: '30+', label: 'Perguntas prontas' },
];

export const USOS = [
  { n: '01', t: 'Treinamento da equipe' }, { n: '02', t: 'Consulta rápida antes de calls' },
  { n: '03', t: 'Tratamento de objeções' }, { n: '04', t: 'Biblioteca de técnicas' },
  { n: '05', t: 'Base para scripts comerciais' }, { n: '06', t: 'Análise de reuniões' },
  { n: '07', t: 'Roleplays internos' }, { n: '08', t: 'Documento vivo, sempre em evolução' },
];

export const CONSEQUENCIAS = ['Diagnóstico', 'Entendimento do problema', 'Construção de valor', 'Confiança', 'Demonstração', 'Redução de risco', 'Tratamento de objeções', 'Clareza sobre próximos passos'];

export const PIPELINE = ['Prospecção', 'Abordagem', 'Diagnóstico', 'Demonstração', 'Prova', 'Objeções', 'Negociação', 'Fechamento', 'Pós-venda', 'Indicação'];

export const PRESSAO = ['Convencer', 'Insistir', 'Responder rápido', 'Criar urgência artificial', 'Esconder pontos negativos', 'Tentar vencer objeções', 'Perseguir o cliente', 'Buscar qualquer "sim"'];

export const CONSULTIVA = ['Diagnosticar', 'Compreender', 'Questionar', 'Reduzir risco', 'Construir valor', 'Isolar objeções', 'Conduzir próximos passos', 'Recomendar decisões'];

export const ANATOMIA = [
  { n: '01', t: 'Objeção declarada', d: 'A frase que o cliente diz em voz alta.' },
  { n: '02', t: 'Significado real', d: 'O que aquela frase quer dizer no contexto dele.' },
  { n: '03', t: 'Risco percebido', d: 'O que ele teme perder ao decidir.' },
  { n: '04', t: 'Objeção central', d: 'O bloqueio que de fato trava a decisão.' },
  { n: '05', t: 'Decisão', d: 'O que acontece quando o risco é reduzido.' },
];

export const CARO_SIGNIFICADOS = ['Não tenho orçamento', 'Não percebi valor', 'Encontrei algo mais barato', 'Tenho medo de errar', 'Não vejo retorno', 'Não tenho autoridade para decidir', 'Não é prioridade agora'];

export const REVIEW_PERGUNTAS = ['Entendi realmente o problema?', 'Fiz perguntas suficientes?', 'Falei demais?', 'Identifiquei o decisor?', 'Entendi critérios de decisão?', 'Descobri a principal objeção?', 'Isolei a objeção?', 'Construí valor?', 'Utilizei provas?', 'Pedi a decisão?', 'Existe próximo passo?'];

export const REVIEW_CAMPOS = ['Principal objeção', 'Momento mais forte', 'Momento mais fraco', 'Oportunidade perdida', 'Pergunta que deveria ter feito', 'Próxima ação'];

export const SINAIS = ['Pergunta sobre início', 'Onboarding', 'Equipe', 'Contrato', 'Pagamento', 'Implementação', 'Disponibilidade', 'Suporte', '"Como funcionaria no nosso caso?"', 'Linguagem de futuro', 'Envolve outro decisor', 'Pergunta próximos passos'];

export const ERROS = [
  'Responder objeção rápido demais.', 'Dar desconto antes de descobrir a objeção.', 'Continuar apresentando depois que o cliente está pronto.',
  'Mandar proposta sem próximo passo marcado.', 'Aceitar "vou pensar" sem entender o que será pensado.', 'Tentar convencer quem deveria ser desqualificado.',
  'Falar mais que o cliente.', 'Negociar com alguém sem poder de decisão.', 'Confundir simpatia com intenção de compra.', 'Criar urgência artificial.',
];

export const ETICA = ['Inventar escassez', 'Inventar cases', 'Esconder riscos', 'Pressionar emocionalmente', 'Manipular escolhas', 'Vender para quem não possui fit', 'Prometer resultados impossíveis'];

export const SIGNATURE_DEFAULT = 'abza · Strategy that moves business.';
