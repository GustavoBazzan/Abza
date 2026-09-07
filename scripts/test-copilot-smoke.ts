// Smoke test de /api/copilot — garante que o simples IMPORT do handler não
// lança exceção, e que os caminhos mais baratos (método errado, sem
// autenticação) respondem sem depender de OpenAI nem Supabase reais.
//
// Isto existe especificamente por causa de um incidente em produção:
// FUNCTION_INVOCATION_FAILED em TODA requisição, inclusive GET — sintoma de
// uma exceção durante o carregamento do módulo (import de nível superior),
// não da lógica do handler em si. `npm run test:copilot:smoke` roda isso
// isoladamente, sem precisar de nenhuma variável de ambiente.
//
// Uso: npm run test:copilot:smoke

let failures = 0;
function check(name: string, cond: boolean, extra = '') {
  if (cond) console.log(`OK   ${name}`);
  else { failures++; console.log(`FAIL ${name} ${extra}`); }
}

async function main() {
  // O próprio `import(...)` é o primeiro teste: se algo no módulo (ou em
  // qualquer dependência estática dele) lançar durante o carregamento, essa
  // linha já falha — exatamente a classe de bug que causou o incidente.
  let mod: typeof import('../api/copilot');
  try {
    mod = await import('../api/copilot');
    check('import de api/copilot.ts não lança exceção', true);
  } catch (err) {
    check('import de api/copilot.ts não lança exceção', false, `-- ${err instanceof Error ? err.stack : err}`);
    console.log(`\n== RESULTADO: 1 falhou (import quebrado — sem isso mais nada pode ser testado) ==`);
    process.exitCode = 1;
    return;
  }

  const handler = mod.default;
  type Res = { status: number; body: unknown };
  function mockResponse() {
    let status = 200;
    let body: unknown = null;
    const self = {
      status(c: number) { status = c; return self; },
      setHeader() { return self; },
      json(b: unknown) { body = b; },
    };
    return { res: self, get: (): Res => ({ status, body }) };
  }

  // GET -> 405, sem precisar de nenhuma configuração.
  {
    const { res, get } = mockResponse();
    await handler({ method: 'GET', headers: {}, body: {} }, res);
    const { status } = get();
    check('GET -> 405', status === 405, `(recebido ${status})`);
  }

  // POST sem Authorization -> 401 quando Supabase Auth está configurado
  // neste ambiente, ou passa direto (sem crash) quando não está — os dois
  // são comportamentos válidos dependendo de VITE_SUPABASE_URL/KEY estarem
  // setadas; o que importa aqui é que NUNCA lança exceção nem tenta chamar
  // a OpenAI.
  {
    const { res, get } = mockResponse();
    await handler({ method: 'POST', headers: {}, body: {} }, res);
    const { status, body } = get();
    const authConfigured = !!(process.env.VITE_SUPABASE_URL && (process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY));
    if (authConfigured) {
      check('POST sem Authorization -> 401 (Supabase Auth configurado)', status === 401, `(recebido ${status}, body: ${JSON.stringify(body)})`);
    } else {
      check('POST sem Authorization não lança e não chega em 2xx com sugestão real (Supabase Auth não configurado neste teste)', status !== 200, `(recebido ${status})`);
    }
  }

  console.log(failures === 0 ? '\n== RESULTADO: OK ==' : `\n== RESULTADO: ${failures} falhou ==`);
  process.exitCode = failures > 0 ? 1 : 0;
}

main().catch((err) => {
  console.error('Falha inesperada no smoke test:', err);
  process.exitCode = 1;
});
