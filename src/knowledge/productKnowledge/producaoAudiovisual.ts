import { producaoAudiovisual as script } from '../../data/products/producaoAudiovisual';
import type { ProductKnowledge } from '../types';
import { questionsFromScript, scopesFromScript } from './derive';

export const producaoAudiovisualKnowledge: ProductKnowledge = {
  productId: 'producao-audiovisual',
  available: true,
  problemSolved:
    'Falta de material audiovisual com finalidade, canal e volume definidos — produção tratada como entrega avulsa em vez de ativo reutilizável.',
  idealClientProfile: [
    'Tem canal(is) definido(s) de veiculação (redes, campanha, institucional)',
    'Consegue nomear finalidade clara do material — não é "só para ter"',
    'Tem volume ou frequência de necessidade recorrente, não um evento único isolado',
  ],
  fitSignals: [
    'Tem uma campanha, lançamento ou data puxando a decisão',
    'Sabe onde o material vai ser usado e em que formato',
    'Já produz algo hoje e consegue nomear especificamente o que falta',
  ],
  lowFitSignals: [
    'Não tem canal nem plano de veiculação definido',
    'Pede "vídeo institucional" sem finalidade ou métrica de sucesso',
    'Orçamento incompatível com produção profissional (expectativa de baixo custo/UGC)',
  ],
  specificQuestions: questionsFromScript(script),
  possibleScopes: scopesFromScript(script),
  complementaryServices: ['marketing-estrategico', 'trafego-pago'],
};
