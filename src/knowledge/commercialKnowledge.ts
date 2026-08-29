// Filosofia comercial ABZA + processo comercial recomendado — pontos 1-3 do
// pedido de base de conhecimento. O conteúdo reaproveita literalmente os
// arrays já existentes em data/content.ts (fonte única do Playbook); este
// módulo só estrutura esse conteúdo no formato que o Copilot vai consumir,
// sem duplicar texto.

import { PRESSAO, CONSULTIVA, CONSEQUENCIAS, PIPELINE, ETICA, METODO } from '../data/content';
import type { CommercialKnowledge, CommercialPhilosophy, ProcessStep, RecommendedProcess } from './types';

const philosophy: CommercialPhilosophy = {
  corePosture:
    'Vender é consequência de diagnosticar bem e conduzir com clareza — nunca de convencer, insistir ou empurrar.',
  avoid: PRESSAO,
  practice: CONSULTIVA,
  valueBuildingBlocks: CONSEQUENCIAS,
  pipeline: PIPELINE,
  ethicalBoundaries: ETICA,
};

// Espelha a ordem de StageKind em data/meeting.ts e das etapas compartilhadas
// em data/products/shared.ts — é o roteiro-produto único (abertura até
// próximo passo) que toda a área de Scripts segue, descrito aqui de forma
// independente de produto.
const steps: ProcessStep[] = [
  { order: 1, stageKind: 'intro', label: 'Abertura', purpose: 'Enquadrar a reunião e abrir espaço para o cliente falar primeiro.', guidance: 'Não apresente a ABZA ainda. Deixe o cliente falar mais que você nos primeiros minutos.' },
  { order: 2, stageKind: 'questions', label: 'Motivação — por que agora?', purpose: 'Descobrir o gatilho real que trouxe o cliente à mesa.', guidance: 'Nunca aceite uma resposta genérica ("queremos modernizar") como final — pergunte o que motivou isso agora.' },
  { order: 3, stageKind: 'questions', label: 'Cenário atual', purpose: 'Mapear a operação do cliente sem julgar.', guidance: 'Escute mais do que fale. Ainda não é hora de vender.' },
  { order: 4, stageKind: 'questions', label: 'Problema', purpose: 'Nomear o problema central, não o sintoma.', guidance: 'Um pedido estético ou operacional quase sempre esconde um problema comercial maior — cave até achar.' },
  { order: 5, stageKind: 'questions', label: 'Impacto e consequências', purpose: 'Transformar o problema em impacto mensurável.', guidance: 'Pergunte o custo de não agir — "o que acontece se nada mudar nos próximos 12 meses?"' },
  { order: 6, stageKind: 'questions', label: 'Objetivo desejado', purpose: 'Entender como seria o sucesso na visão do cliente.', guidance: 'Deixe o cliente descrever o resultado com as próprias palavras — isso vira a base da devolução do diagnóstico.' },
  { order: 7, stageKind: 'qualification', label: 'Qualificação comercial', purpose: 'Mapear decisor, prazo, budget, concorrência e critério de decisão.', guidance: 'Trate como microcompromisso dentro do fluxo — nunca como interrogatório.', relatedTechniqueNums: ['02'] },
  { order: 8, stageKind: 'diagnosis', label: 'Diagnóstico ABZA', purpose: 'Estruturar a leitura da oportunidade antes de devolver ao cliente.', guidance: 'Seja honesto sobre riscos e pontos ainda não descobertos.' },
  { order: 9, stageKind: 'diagnosisReturn', label: 'Devolução do diagnóstico', purpose: 'Confirmar a leitura com o cliente antes de apresentar qualquer solução.', guidance: 'Se o cliente corrigir algo, volte e atualize o diagnóstico antes de continuar.' },
  { order: 10, stageKind: 'abzaIntro', label: 'Apresentação da ABZA', purpose: 'Conectar abordagem e experiência ao que foi diagnosticado.', guidance: 'Nada institucional — só o que resolve especificamente o problema dele.' },
  { order: 11, stageKind: 'solution', label: 'Apresentação da solução', purpose: 'Apresentar cada parte conectada ao que o cliente já disse.', guidance: 'Nunca apresentar como lista de entregáveis genérica — sempre "você comentou X, por isso entra Y".' },
  { order: 12, stageKind: 'scope', label: 'Construção do escopo', purpose: 'Montar o escopo recomendado durante a própria reunião.', guidance: 'Comece pelos itens recomendados; adicione customizados só quando o cliente pedir algo específico.' },
  { order: 13, stageKind: 'pricing', label: 'Investimento', purpose: 'Apresentar o valor com clareza.', guidance: 'Diga o valor e fique em silêncio. Nunca justifique demais.' },
  { order: 14, stageKind: 'closing', label: 'Objeções e fechamento', purpose: 'Tratar a última objeção e buscar a decisão.', guidance: 'Se não fechar, o próximo passo com data é obrigatório — nunca "me avisa".', relatedTechniqueNums: ['01'] },
];

const process: RecommendedProcess = {
  steps,
  objectionMovement: METODO.map((m) => ({ n: m.n, nome: m.nome, desc: m.desc })),
};

export const commercialKnowledge: CommercialKnowledge = { philosophy, process };
