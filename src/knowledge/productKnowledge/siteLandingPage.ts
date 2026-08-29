import { siteLandingPage as script } from '../../data/products/siteLandingPage';
import type { ProductKnowledge } from '../types';
import { questionsFromScript, scopesFromScript } from './derive';

export const siteLandingPageKnowledge: ProductKnowledge = {
  productId: 'site-landing-page',
  available: true,
  problemSolved:
    'Site ou landing page que não cumpre a função comercial esperada — não converte, não passa a impressão certa, ou não sustenta as campanhas que a empresa já roda.',
  idealClientProfile: [
    'Já direciona tráfego (orgânico ou pago) para o site atual',
    'Tem uma função comercial clara esperada do site (leads, vendas, institucional)',
    'Percebe ou mede problema de conversão, velocidade ou experiência',
  ],
  fitSignals: [
    'Sabe (ou quer saber) a taxa de conversão atual',
    'Tem integrações necessárias claras (CRM, pagamento, agendamento)',
    'Reclamação específica e nomeável sobre o site atual, não só "não gosto"',
  ],
  lowFitSignals: [
    'Não tem nenhum tráfego direcionado ao site — o problema real é de aquisição, não de site',
    'Quer só trocar o visual sem qualquer objetivo de conversão',
    'Não sabe e não quer saber nenhuma métrica do site atual',
  ],
  specificQuestions: questionsFromScript(script),
  possibleScopes: scopesFromScript(script),
  complementaryServices: ['marketing-estrategico', 'identidade-visual', 'trafego-pago'],
};
