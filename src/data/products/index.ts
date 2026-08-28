import type { ProductScript } from '../meeting';
import { marketingEstrategico } from './marketingEstrategico';
import { identidadeVisual } from './identidadeVisual';
import { siteLandingPage } from './siteLandingPage';
import { producaoAudiovisual } from './producaoAudiovisual';

// Tráfego Pago e Projeto Personalizado ficam estruturalmente presentes
// (aparecem como card, o tipo ProductId já os inclui) mas sem roteiro
// completo ainda — `comingSoon` evita um roteiro raso só para preencher a
// grade. Escrever o conteúdo completo depois é só remover a flag.
const trafegoPago: ProductScript = {
  id: 'trafego-pago',
  order: 5,
  title: 'Tráfego Pago',
  shortDescription: 'Roteiro completo em preparação.',
  objective: '',
  comingSoon: true,
  stages: [],
};

const projetoPersonalizado: ProductScript = {
  id: 'projeto-personalizado',
  order: 6,
  title: 'Projeto Personalizado / Solução Integrada',
  shortDescription: 'Roteiro completo em preparação.',
  objective: '',
  comingSoon: true,
  stages: [],
};

export const PRODUCTS: ProductScript[] = [
  marketingEstrategico,
  identidadeVisual,
  siteLandingPage,
  producaoAudiovisual,
  trafegoPago,
  projetoPersonalizado,
].sort((a, b) => a.order - b.order);

export function getProduct(id: string): ProductScript | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
