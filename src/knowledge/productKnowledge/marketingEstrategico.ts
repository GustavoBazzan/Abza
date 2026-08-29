import { marketingEstrategico as script } from '../../data/products/marketingEstrategico';
import type { ProductKnowledge } from '../types';
import { questionsFromScript, scopesFromScript } from './derive';

export const marketingEstrategicoKnowledge: ProductKnowledge = {
  productId: 'marketing-estrategico',
  available: true,
  problemSolved:
    'Falta de estratégia e processo estruturado por trás da aquisição e retenção de clientes — marketing tratado como produção de posts, não como motor de crescimento.',
  idealClientProfile: [
    'Empresa com operação comercial ativa mas sem estratégia de aquisição estruturada',
    'Já investe em marketing (interno ou terceirizado) mas sem direção clara',
    'Depende de poucos canais ou de indicação',
    'Tem meta de crescimento de receita nos próximos meses',
  ],
  fitSignals: [
    'Reconhece dependência de um único canal de aquisição',
    'Não tem processo comercial ou CRM estruturado',
    'Já tentou "fazer marketing" sem resultado e sabe nomear a lacuna',
    'Tem orçamento recorrente mensal disponível — é um contrato mensal',
  ],
  lowFitSignals: [
    'Só quer produção de conteúdo pontual, sem interesse em estratégia',
    'Não tem processo comercial nenhum para receber os leads gerados, nem intenção de estruturar',
    'Busca resultado imediato sem disposição para ciclo de meses',
    'Orçamento incompatível com contrato mensal recorrente',
  ],
  specificQuestions: questionsFromScript(script),
  possibleScopes: scopesFromScript(script),
  complementaryServices: ['identidade-visual', 'site-landing-page', 'trafego-pago'],
};
