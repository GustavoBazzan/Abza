import type { ProductScript } from '../meeting';
import { openingStage, qualificationStage, diagnosisStage, diagnosisReturnStage, abzaIntroStage, pricingStage, closingStage } from './shared';

export const siteLandingPage: ProductScript = {
  id: 'site-landing-page',
  order: 3,
  title: 'Site / Landing Page',
  shortDescription: 'Da função real do site até o fechamento, sem sair do roteiro.',
  objective: 'Descobrir se o problema é experiência, conversão, tecnologia ou percepção — antes de desenhar qualquer página.',
  stages: [
    openingStage('site / landing page'),
    {
      id: 'motivacao',
      kind: 'questions',
      title: 'Motivação — por que agora?',
      objective: 'Descobrir o gatilho — campanha, reclamação, lançamento, ou desgaste acumulado.',
      questions: [
        { id: 'site-q1', text: 'O que fez vocês decidirem repensar o site/landing page agora?', watchFor: ['Evento motivador'] },
        { id: 'site-q2', text: 'Teve algum evento recente — campanha, lançamento, reclamação — que motivou isso?' },
      ],
    },
    {
      id: 'cenario-problema',
      kind: 'questions',
      title: 'Cenário atual e problema',
      objective: 'Entender a função real do site hoje e onde ele falha.',
      questions: [
        { id: 'site-q3', text: 'Qual a função principal do site hoje — institucional, geração de leads, vendas?' },
        { id: 'site-q4', text: 'De onde vem o tráfego hoje?' },
        { id: 'site-q5', text: 'O site converte? Vocês sabem a taxa de conversão hoje?', watchFor: ['Dado disponível ou ausência de dado — isso já é diagnóstico'] },
        { id: 'site-q6', text: 'Qual a maior reclamação sobre o site atual — velocidade, design, conteúdo, tecnologia?' },
      ],
    },
    {
      id: 'impacto',
      kind: 'questions',
      title: 'Impacto e consequências',
      objective: 'Quantificar o custo de manter o site como está.',
      questions: [
        { id: 'site-q7', text: 'Quanto isso custa em oportunidades perdidas hoje?' },
        { id: 'site-q8', text: 'A experiência atual passa a impressão que vocês querem passar?' },
        { id: 'site-q9', text: 'Isso afeta SEO, velocidade ou geração de leads de forma mensurável?' },
      ],
    },
    {
      id: 'objetivo',
      kind: 'questions',
      title: 'Objetivo desejado',
      objective: 'Definir o que o novo site precisa fazer que o atual não faz.',
      questions: [
        { id: 'site-q10', text: 'O que o novo site precisa fazer que o atual não faz?' },
        { id: 'site-q11', text: 'Quais páginas e integrações são essenciais — CRM, pagamento, agendamento?' },
      ],
    },
    qualificationStage('site / landing page'),
    diagnosisStage(),
    diagnosisReturnStage(),
    abzaIntroStage(),
    {
      id: 'apresentacao-solucao',
      kind: 'solution',
      title: 'Apresentação da solução',
      objective: 'Conectar cada etapa técnica ao problema relatado — nunca apresentar como lista de tecnologias.',
      solutionParts: [
        { id: 'site-s1', title: 'Diagnóstico de experiência e funil', whyItEnters: 'Conecta com a taxa de conversão (ou a falta de dado) relatada pelo cliente.' },
        { id: 'site-s2', title: 'Arquitetura de informação', whyItEnters: 'Resolve a reclamação relatada sobre conteúdo/navegação.' },
        { id: 'site-s3', title: 'Design de interface', whyItEnters: 'Conecta com a impressão que o cliente quer passar.' },
        { id: 'site-s4', title: 'Desenvolvimento e integrações', whyItEnters: 'Conecta com as integrações essenciais citadas pelo cliente.' },
        { id: 'site-s5', title: 'SEO e performance', whyItEnters: 'Resolve a reclamação de velocidade e a origem do tráfego relatada.' },
        { id: 'site-s6', title: 'Publicação e acompanhamento', whyItEnters: 'Garante que o objetivo definido seja medido depois do lançamento.' },
      ],
      nextMove: 'Diga: "Você comentou [X]. É exatamente por isso que aqui entra [Y]."',
    },
    {
      id: 'escopo',
      kind: 'scope',
      title: 'Construção do escopo',
      objective: 'Montar o escopo recomendado durante a própria reunião.',
      scopeItems: [
        { id: 'site-sc1', label: 'Diagnóstico de UX', recommended: true },
        { id: 'site-sc2', label: 'Arquitetura de páginas', recommended: true },
        { id: 'site-sc3', label: 'Design', recommended: true },
        { id: 'site-sc4', label: 'Desenvolvimento', recommended: true },
        { id: 'site-sc5', label: 'Integrações (CRM/pagamento)' },
        { id: 'site-sc6', label: 'SEO técnico' },
        { id: 'site-sc7', label: 'Conteúdo' },
        { id: 'site-sc8', label: 'Manutenção mensal' },
      ],
    },
    pricingStage(),
    closingStage(),
  ],
};
