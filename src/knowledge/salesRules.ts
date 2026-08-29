// Regras comerciais que o agente (humano ou IA) nunca deve violar — ponto 10
// do pedido de base de conhecimento. Combina os limites éticos que já
// existem no Playbook (ETICA, em data/content.ts) com regras específicas de
// processo já estabelecidas ao longo deste projeto (preço nunca inventado
// por IA, fechamento nunca sem próximo passo, etc.). Esta lista é o
// primeiro bloco do contexto que vai para qualquer modelo de IA — "REGRAS
// ABZA" no formato descrito no pedido.

import { ETICA } from '../data/content';
import type { SalesRule, SalesRulesKnowledge } from './types';

const ethicalRules: SalesRule[] = ETICA.map((e, i) => ({
  id: `etica-${i + 1}`,
  rule: `Nunca ${e.charAt(0).toLowerCase()}${e.slice(1)}.`,
  rationale: 'Limite ético do Playbook ABZA (seção Diagnóstico Comercial) — vale tanto para o vendedor humano quanto para qualquer sugestão do Copilot.',
}));

const processRules: SalesRule[] = [
  {
    id: 'preco-nunca-por-ia',
    rule: 'Nunca gerar, sugerir ou inventar um valor de investimento — preço é sempre preenchimento manual do vendedor, hoje e enquanto não existir um Pricing Engine determinístico aprovado.',
    rationale: 'Regra explícita do projeto: preço não pode ser "inventado" por IA.',
  },
  {
    id: 'fechamento-com-proximo-passo',
    rule: 'Nunca considerar uma reunião encerrada sem outcome definido (fechou/não fechou/follow-up) e, se não fechou, sem próximo passo com data e responsável registrados.',
    rationale: 'Evita o padrão "me avisa" identificado como erro recorrente no Playbook (ERROS).',
  },
  {
    id: 'nao-avancar-sem-diagnostico',
    rule: 'Nunca recomendar apresentar solução ou investimento antes do problema central, impacto e objetivo estarem registrados e confirmados pelo cliente.',
    rationale: 'O processo comercial ABZA é diagnóstico-primeiro; pular etapa quebra a lógica de construção de valor.',
  },
  {
    id: 'distinguir-fonte',
    rule: 'Toda sugestão gerada por IA deve ser marcada com source "ai" e nunca substituir silenciosamente uma resposta manual já registrada pelo vendedor.',
    rationale: 'Preserva a distinção manual/transcrição/IA já modelada em Answer.source e ObjectionEvent.source.',
  },
  {
    id: 'nao-inventar-fato-do-cliente',
    rule: 'Nunca declarar como fato algo sobre o cliente (orçamento, decisor, concorrência, urgência) que não foi efetivamente registrado na reunião — sinalizar como desconhecido em vez de presumir.',
    rationale: 'Uma IA que preenche lacunas com suposições plausíveis é mais perigosa do que uma que admite não saber.',
  },
  {
    id: 'tecnica-so-do-playbook',
    rule: 'Toda técnica recomendada deve vir do catálogo já existente no Playbook (TECH), nunca uma técnica nova inventada na hora.',
    rationale: 'Mantém uma fonte única de verdade para técnicas — consistência de treinamento e linguagem do time.',
  },
  {
    id: 'objecao-nao-e-ignorada',
    rule: 'Nunca recomendar avançar para fechamento enquanto existir uma objeção registrada sem resposta do cliente tratada.',
    rationale: 'Objeção não resolvida tende a retornar depois, sem o vendedor na sala (ver ERROS, no Playbook).',
  },
  {
    id: 'produto-sem-fit-nao-e-empurrado',
    rule: 'Se os sinais de baixo fit de um produto superarem os sinais de fit, sinalizar isso ao vendedor — nunca insistir em avançar a venda.',
    rationale: 'Ética comercial ABZA: "vender para quem não possui fit" está explicitamente proibido (ETICA).',
  },
];

export const salesRules: SalesRulesKnowledge = { rules: [...ethicalRules, ...processRules] };
