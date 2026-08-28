import type { ProductScript } from '../meeting';
import { openingStage, qualificationStage, diagnosisStage, diagnosisReturnStage, abzaIntroStage, pricingStage, closingStage } from './shared';

export const producaoAudiovisual: ProductScript = {
  id: 'producao-audiovisual',
  order: 4,
  title: 'Produção Audiovisual',
  shortDescription: 'Da finalidade real do material até o fechamento, sem sair do roteiro.',
  objective: 'Entender finalidade, canal e volume antes de falar de formato ou orçamento.',
  stages: [
    openingStage('produção audiovisual'),
    {
      id: 'motivacao',
      kind: 'questions',
      title: 'Motivação — por que agora?',
      objective: 'Descobrir se existe uma data ou campanha puxando a decisão.',
      questions: [
        { id: 'av-q1', text: 'O que motivou pensar em produção audiovisual agora?', watchFor: ['Evento motivador'] },
        { id: 'av-q2', text: 'Existe uma campanha, lançamento ou data específica puxando isso?', watchFor: ['Prazo apertado — sinaliza urgência real'] },
      ],
    },
    {
      id: 'cenario-problema',
      kind: 'questions',
      title: 'Cenário atual e problema',
      objective: 'Mapear finalidade, canais e o que falta no que já existe.',
      questions: [
        { id: 'av-q3', text: 'Qual a finalidade principal — institucional, campanha, redes sociais, vendas?' },
        { id: 'av-q4', text: 'Onde esse conteúdo vai ser veiculado — quais canais?' },
        { id: 'av-q5', text: 'Vocês já produzem hoje? O que falta no que existe?' },
        { id: 'av-q6', text: 'Qual o volume e a frequência necessários?' },
      ],
    },
    {
      id: 'impacto',
      kind: 'questions',
      title: 'Impacto e consequências',
      objective: 'Entender o custo de seguir sem esse material.',
      questions: [
        { id: 'av-q7', text: 'A falta desse material está custando alguma oportunidade — campanha parada, lançamento sem apoio?' },
        { id: 'av-q8', text: 'Isso afeta a percepção da marca nos canais onde ela aparece?' },
      ],
    },
    {
      id: 'objetivo',
      kind: 'questions',
      title: 'Objetivo desejado',
      objective: 'Definir o resultado esperado e como será medido.',
      questions: [
        { id: 'av-q9', text: 'Que resultado esse material precisa gerar — engajamento, conversão, percepção?' },
        { id: 'av-q10', text: 'Como será medido o sucesso dessa produção?' },
      ],
    },
    qualificationStage('produção audiovisual'),
    diagnosisStage(),
    diagnosisReturnStage(),
    abzaIntroStage(),
    {
      id: 'apresentacao-solucao',
      kind: 'solution',
      title: 'Apresentação da solução',
      objective: 'Conectar cada etapa da produção à finalidade e ao canal relatados pelo cliente.',
      solutionParts: [
        { id: 'av-s1', title: 'Roteiro e direção criativa', whyItEnters: 'Conecta com a finalidade e o resultado esperado relatados pelo cliente.' },
        { id: 'av-s2', title: 'Captação', whyItEnters: 'Executa o roteiro aprovado dentro do volume e prazo necessários.' },
        { id: 'av-s3', title: 'Locações e logística', whyItEnters: 'Resolve as necessidades específicas de local e equipe do projeto.' },
        { id: 'av-s4', title: 'Edição e pós-produção', whyItEnters: 'Adapta o material bruto ao formato de cada canal citado.' },
        { id: 'av-s5', title: 'Formatos por canal', whyItEnters: 'Conecta com os canais de veiculação relatados pelo cliente.' },
        { id: 'av-s6', title: 'Entrega e direitos de uso', whyItEnters: 'Garante que o cliente possa usar o material como e onde precisa.' },
      ],
      nextMove: 'Diga: "Você comentou [X]. É exatamente por isso que aqui entra [Y]."',
    },
    {
      id: 'escopo',
      kind: 'scope',
      title: 'Construção do escopo',
      objective: 'Montar o escopo recomendado durante a própria reunião.',
      scopeItems: [
        { id: 'av-sc1', label: 'Roteiro', recommended: true },
        { id: 'av-sc2', label: 'Captação', recommended: true },
        { id: 'av-sc3', label: 'Edição', recommended: true },
        { id: 'av-sc4', label: 'Locação' },
        { id: 'av-sc5', label: 'Elenco / talentos' },
        { id: 'av-sc6', label: 'Motion / animação' },
        { id: 'av-sc7', label: 'Trilha sonora' },
        { id: 'av-sc8', label: 'Formatos múltiplos (cortes para redes)' },
        { id: 'av-sc9', label: 'Direitos de uso estendidos' },
      ],
    },
    pricingStage(),
    closingStage(),
  ],
};
