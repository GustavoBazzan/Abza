import { identidadeVisual as script } from '../../data/products/identidadeVisual';
import type { ProductKnowledge } from '../types';
import { questionsFromScript, scopesFromScript } from './derive';

export const identidadeVisualKnowledge: ProductKnowledge = {
  productId: 'identidade-visual',
  available: true,
  problemSolved:
    'Marca que não reflete mais o estágio, o posicionamento ou o preço que a empresa pratica hoje — gerando desconfiança ou desalinhamento de percepção.',
  idealClientProfile: [
    'Empresa em momento de mudança — crescimento, reposicionamento, fusão',
    'Percebe desalinhamento entre o que cobra/entrega e como a marca aparece',
    'Tem múltiplos pontos de contato inconsistentes (site, redes, materiais, propostas)',
  ],
  fitSignals: [
    'Consegue nomear o que incomoda além de "queremos algo mais moderno"',
    'Relaciona a marca a perda de confiança ou de negócio, não só estética',
    'Tem clareza de quem quer atrair e não atrai hoje',
  ],
  lowFitSignals: [
    'Só quer "uma logo nova" sem interesse em direção estratégica',
    'Não consegue nomear nenhum impacto comercial, só preferência pessoal',
    'Vai decidir por gosto de um único sócio, sem processo de aprovação',
  ],
  specificQuestions: questionsFromScript(script),
  possibleScopes: scopesFromScript(script),
  complementaryServices: ['marketing-estrategico', 'site-landing-page'],
};
