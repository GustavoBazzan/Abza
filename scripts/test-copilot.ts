// Mecanismo de teste em desenvolvimento do endpoint /api/copilot.
//
// Roda o handler diretamente em processo — sem precisar de `vercel dev`
// nem de um deploy — simulando uma requisição HTTP real: monta uma reunião
// de exemplo, chama o handler, e imprime a sugestão estruturada (ou o erro
// tratado) devolvida. Prova a cadeia completa pedida:
//
//   ENTRADA DE REUNIÃO -> Context Builder -> OPENAI -> JSON ESTRUTURADO
//
// Uso:
//   OPENAI_API_KEY=sk-... npx tsx scripts/test-copilot.ts
//   npm run test:copilot          (usa a OPENAI_API_KEY já exportada no shell)
//
// Sem OPENAI_API_KEY configurada, o script ainda roda e mostra o erro 500
// "not_configured" tratado pelo handler — é uma forma rápida de confirmar
// que o tratamento de erro funciona mesmo sem chave.

import handler, { type CopilotRequest, type CopilotResponse } from '../api/copilot';
import { createMeeting, type Meeting } from '../src/data/meeting';

function buildSampleMeeting(): Meeting {
  const now = new Date().toISOString();
  const meeting = createMeeting('marketing-estrategico', {
    client: 'Fulano de Tal',
    company: 'ACME Ltda',
    productId: 'marketing-estrategico',
    owner: 'Vendedor Teste',
    date: '2026-08-29',
    participants: 'Fulano (CEO)',
    origin: 'Indicação',
    note: '',
  });

  meeting.currentStageIndex = 2; // "Cenário atual e problema"
  meeting.diagnosis.centralProblem = 'Depende quase inteiramente de indicação para gerar novos clientes.';
  meeting.diagnosis.impact = 'Perdeu duas oportunidades grandes nos últimos 6 meses por falta de previsibilidade de pipeline.';
  meeting.qualification.decisionMaker = 'O próprio CEO, sem outros sócios envolvidos.';
  meeting.qualification.budgetRange = 'Entre R$ 12 mil e R$ 18 mil por mês.';
  meeting.answers['mkt-q1'] = {
    value: 'Perdemos um cliente grande mês passado e isso acendeu o alerta.',
    source: 'manual',
    updatedAt: now,
  };
  meeting.answers['mkt-q3'] = {
    value: 'Faturamento estagnado há 3 trimestres, querem crescer 30% este ano.',
    source: 'manual',
    updatedAt: now,
  };
  return meeting;
}

function mockResponse(): CopilotResponse {
  let statusCode = 200;
  const self: CopilotResponse = {
    status(code) {
      statusCode = code;
      return self;
    },
    setHeader() {
      return self;
    },
    json(body) {
      console.log(`\n== SAÍDA (HTTP ${statusCode}) ==`);
      console.log(JSON.stringify(body, null, 2));
    },
  };
  return self;
}

async function main() {
  console.log('== ENTRADA DE REUNIÃO ==');
  const meeting = buildSampleMeeting();
  console.log(`Produto: ${meeting.productId}`);
  console.log(`Etapa atual (índice): ${meeting.currentStageIndex}`);
  console.log(`Diagnóstico já registrado: ${meeting.diagnosis.centralProblem ? 'sim' : 'não'}`);
  console.log(`OPENAI_API_KEY configurada: ${process.env.OPENAI_API_KEY ? 'sim' : 'não'}`);

  console.log('\n== CHAMANDO O HANDLER DE /api/copilot (in-process) ==');
  const req: CopilotRequest = { method: 'POST', body: { meeting } };
  const res = mockResponse();
  await handler(req, res);
}

main().catch((err) => {
  console.error('Falha ao rodar o teste:', err);
  process.exitCode = 1;
});
