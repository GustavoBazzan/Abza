// Tráfego Pago ainda não tem roteiro completo no Modo Call (`comingSoon` em
// data/products/index.ts) — este conhecimento fica deliberadamente enxuto e
// marcado `available: false` até que o script real seja escrito. Quando
// isso acontecer, basta seguir o padrão dos outros arquivos deste diretório.

import type { ProductKnowledge } from '../types';

export const trafegoPagoKnowledge: ProductKnowledge = {
  productId: 'trafego-pago',
  available: false,
  problemSolved: 'Roteiro comercial ainda em preparação — conhecimento estruturado deste produto será adicionado quando o script for construído.',
  idealClientProfile: [],
  fitSignals: [],
  lowFitSignals: [],
  specificQuestions: [],
  possibleScopes: [],
  complementaryServices: ['marketing-estrategico'],
};
