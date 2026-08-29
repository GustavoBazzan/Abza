import type { ProductId } from '../../data/meeting';
import type { ProductKnowledge } from '../types';
import { marketingEstrategicoKnowledge } from './marketingEstrategico';
import { identidadeVisualKnowledge } from './identidadeVisual';
import { siteLandingPageKnowledge } from './siteLandingPage';
import { producaoAudiovisualKnowledge } from './producaoAudiovisual';
import { trafegoPagoKnowledge } from './trafegoPago';
import { projetoPersonalizadoKnowledge } from './projetoPersonalizado';

export const PRODUCT_KNOWLEDGE: Record<ProductId, ProductKnowledge> = {
  'marketing-estrategico': marketingEstrategicoKnowledge,
  'identidade-visual': identidadeVisualKnowledge,
  'site-landing-page': siteLandingPageKnowledge,
  'producao-audiovisual': producaoAudiovisualKnowledge,
  'trafego-pago': trafegoPagoKnowledge,
  'projeto-personalizado': projetoPersonalizadoKnowledge,
};

/** Sempre retorna um `ProductKnowledge` válido para qualquer ProductId — nunca undefined. */
export function getProductKnowledge(productId: ProductId): ProductKnowledge {
  return PRODUCT_KNOWLEDGE[productId];
}
