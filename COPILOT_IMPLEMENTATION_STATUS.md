# ABZA Sales Copilot — Status de Implementação

> Arquivo de continuidade. Se uma sessão do Claude Code acabar, uma nova sessão
> deve ler este arquivo inteiro antes de tocar em qualquer código. Nunca
> contém secrets — só nomes de variáveis de ambiente, nunca valores.

Última atualização: **Checkpoint 1e — persistência real (Supabase) resiliente + histórico do Copilot persistido; migrations reais ainda NÃO aplicadas (bloqueado em autenticação da Supabase CLI, ver seção 11)** (ainda aguardando respostas do questionário do Checkpoint 1 sobre o Copilot em si — usuários/produtos/comportamento do agente).

---

## 1. Objetivo

Transformar o ABZA Sales Copilot (hoje um assistente funcional mas ainda cru)
em um agente comercial real, seguro e utilizável ao vivo durante reuniões,
mantendo as quatro áreas do produto:

- **Playbook** — conhecimento e treinamento comercial.
- **Scripts** — processos de venda completos por produto.
- **Reuniões** — registro e histórico das calls.
- **ABZA Sales Copilot** — segundo cérebro comercial: entende produto, etapa,
  respostas, dor, impacto, objetivo, urgência, decisor, prazo, budget,
  objeções, escopo, o que falta descobrir, se já dá para avançar, qual
  técnica usar e qual o próximo movimento.

Não é um chatbot genérico. Não inventa preço, fato ou resposta do cliente.

---

## 2. Arquitetura decidida (já em produção no branch)

- **Frontend**: React 19 + TypeScript + Vite 8, roteamento hash-based próprio
  (`src/router.ts`), sem framework de estado externo.
- **Backend do Copilot**: uma única Vercel Function (`api/copilot.ts`,
  Node runtime, sem `@vercel/node` como dependência — tipos mínimos
  declarados localmente para evitar a árvore de dependência vulnerável do
  pacote oficial). Chama a OpenAI **Responses API** com **Structured
  Outputs** (JSON Schema estrito). Chave lida exclusivamente de
  `process.env.OPENAI_API_KEY`.
- **Camada de conhecimento comercial**: `src/knowledge/` — dados e funções
  puras, sem React, sem chamada de rede. Fonte única de verdade para
  filosofia, processo, regras de qualificação/decisão de etapa, regras que
  a IA nunca pode violar e conhecimento por produto.
- **Context Builder**: `src/knowledge/copilotPromptContext.ts` — monta só o
  necessário (produto, etapa atual, pergunta atual, respostas relevantes até
  a etapa atual, diagnóstico, dor/impacto/objetivo/urgência/decisor/budget/
  prazo/concorrência, objeções, escopo atual, investimento se já
  apresentado, lista enxuta de técnicas, regras ABZA, informações
  desconhecidas). Não envia o roteiro inteiro nem técnicas completas.
- **Persistência de reuniões**: repositório trocável (`src/store/`) —
  `localStorage` por padrão, `Supabase` automaticamente se
  `VITE_SUPABASE_URL` + um key client-safe (`VITE_SUPABASE_PUBLISHABLE_KEY`,
  nome atual da Supabase; `VITE_SUPABASE_ANON_KEY` legado ainda aceito como
  fallback) estiverem definidas. Hoje **nenhuma variável está configurada
  neste ambiente** (ver seção 6) — a aplicação roda 100% em localStorage.
  Nenhuma `service_role`/secret key existe em nenhum lugar do repositório.
- **Schema Supabase**: `supabase/migrations/0001_initial_schema.sql` e
  `0002_copilot_insights.sql` — validados de verdade contra um Postgres 16
  local (não só lidos): ambos rodam sem erro, são idempotentes (rodar duas
  vezes não quebra nada), RLS testado com insert real (bloqueia sem
  `authenticated`, libera com `authenticated`). **Nunca aplicados contra o
  projeto Supabase real do Gustavo** — isso é ação manual dele (ver seção 7).
- **Autenticação**: **Supabase Auth implementado de ponta a ponta no
  frontend.** Só e-mail+senha, sem cadastro público (contas criadas
  manualmente no Dashboard — ver seção 10). `src/auth/AuthContext.tsx`
  (provider + `getSession`/`onAuthStateChange`) + `src/auth/useAuth.ts` +
  `src/auth/LoginPage.tsx` (`/login`, sem link de cadastro). `Root.tsx`
  redireciona para `/login` quando não autenticado e protege Playbook,
  Scripts e Reuniões; sessão persiste via `persistSession`/`autoRefreshToken`
  do próprio `supabase-js` (localStorage do navegador, gerenciado pelo SDK).
  Botão "Sair" (`AccountMenu`) na Sidebar/MobileNav do Playbook e na
  MeetingTopBar de Scripts/Reuniões. Se `VITE_SUPABASE_URL`/`PUBLISHABLE_KEY`
  não estiverem configuradas, a autenticação fica desativada automaticamente
  (mesma filosofia de fallback do resto do projeto) — comportamento
  confirmado sem regressão nesta sessão.
  **Gap fechado nesta etapa**: `/api/copilot` agora valida a sessão Supabase
  **no servidor**, não só na página. Ver seção 5-A para os detalhes
  completos (como funciona, o que foi testado, o que ainda depende de
  configuração manual na Vercel).

---

## 3. Fases (do pedido do Gustavo) e status

| Fase | Descrição | Status |
|---|---|---|
| 0 | Auditoria + questionário | **Em andamento — aguardando respostas** |
| 1 | Backend real do Copilot (`/api/copilot`, Responses API, Structured Outputs) | **Já existe e funciona** (testado com endpoint real em sessão anterior) — precisa de ajustes de modelo/variáveis (ver pendências) |
| 2 | Copilot na interface (painel com os 7 blocos + gatilhos) | **Já existe e funciona** — testado end-to-end (mock de rede) |
| 3 | Persistência dos insights | **Parcial** — `Meeting.copilotHistory` existe e é gravado no localStorage; formato ainda não bate 1:1 com o pedido atual (faltam `questionId`, `model`); Supabase não tem tabela para isso |
| 4 | Área Reuniões mostrando insights do Copilot | **Não implementada** — `MeetingDetail.tsx` ainda não exibe `copilotHistory` |
| 5 | Radar comercial (13 dimensões, prontidão determinística) | **Parcial** — `closingRules.ts`/`qualificationRules.ts` já têm heurística determinística de decisão de etapa (reaproveitável), mas não o radar completo com as 13 dimensões e os 3 estados de prontidão pedidos agora |
| 6 | Suíte de avaliação (10 casos) | **Não implementada** |
| 7 | Segurança/abuso do endpoint público | **Fechado nesta etapa** — páginas protegidas por login E `/api/copilot` agora exige sessão Supabase válida no servidor, com rate limit por usuário e limite de tamanho de payload (ver seção 5-A) |
| 8 | Privacidade / minimização de dados | **Parcial** — Context Builder já não envia dado irrelevante, mas não há função de redação/sanitização de PII |
| 9 | Configuração de modelo via variável | **Parcial** — hoje é `OPENAI_MODEL` com default `gpt-4o-mini` hardcoded em um único arquivo (fácil de trocar); pedido atual quer `OPENAI_COPILOT_MODEL` + `OPENAI_COPILOT_REASONING` com defaults novos |
| 10 | Teste real (mock + OpenAI real) | Mock testado em sessão anterior; **OpenAI real nunca foi testada neste sandbox** (sem acesso à internet para api.openai.com) |
| 11 | Vercel | Sem `vercel.json` (zero-config, correto para este projeto) |
| 12 | Supabase (migrations, RLS) | **Migrations prontas e validadas** (`supabase/migrations/0001` e `0002`) — RLS testado de verdade, sem `using(true)`, `meetings.owner_id default auth.uid()`. **Não aplicadas** no projeto real (ação manual do Gustavo, ver seção 7). **Login/Auth UI implementado** (login, logout, sessão persistente, rotas protegidas) — testado de ponta a ponta com um servidor GoTrue fake nesta sessão. |
| 13 | Read AI | Não implementada (conforme pedido) — arquitetura já preparada (`DataSource: 'manual'\|'transcription'\|'ai'` em `Answer`/`ObjectionEvent`) |
| 14 | Pricing Engine | Não implementada (conforme pedido) — `PricingInfo` isolado, `salesRules` já proíbe IA inventar preço |

---

## 4. O que já está pronto (não recriar)

- **Playbook** completo e estável (`src/sections/*`, `src/data/content.ts`) — filosofia, 10 técnicas, sistema de objeções, biblioteca de perguntas, roleplay, checklist, diagnóstico.
- **Scripts por produto**: 4 roteiros completos (Marketing Estratégico, Identidade Visual, Site/Landing Page, Produção Audiovisual) com etapas de abertura → motivação → cenário → problema → impacto → objetivo → qualificação → diagnóstico → devolução → apresentação ABZA → solução → escopo → investimento → fechamento. 2 produtos (Tráfego Pago, Projeto Personalizado) existem só como card "em preparação" (`comingSoon: true`, sem etapas).
- **Modelo `Meeting`** (`src/data/meeting.ts`) — tipado, único, sem dado comercial solto em componente. Já cobre `answers`, `qualification`, `diagnosis`, `scope`, `pricing`, `objections`, `closing`, `techniquesViewed`, `insights` (genérico, nunca escrito), `copilotHistory`.
- **Camada de conhecimento comercial** (`src/knowledge/`) — filosofia, processo de 14 etapas, regras de diagnóstico, 9 dimensões de descoberta com detecção, regras de decisão de etapa (`closingRules`), conhecimento por produto (problema resolvido, ICP, sinais de fit/baixo-fit, perguntas e escopos derivados do roteiro real — nunca duplicados à mão), 15 regras que a IA nunca pode violar.
- **`/api/copilot`** — POST, **protegido por sessão Supabase server-side (ver seção 5-A)**, rate limit por usuário, limite de tamanho de payload, Structured Outputs, tratamento de erro completo (chave ausente, timeout, rate limit, quota insuficiente, resposta inválida, erro genérico), nunca vaza stack trace/token/chave.
- **`useCopilotAnalysis`** (`src/meeting/useCopilot.ts`) — hook client-side, guarda contra chamadas sobrepostas, nunca bloqueia a call, envia `Authorization: Bearer <access_token>` da sessão Supabase administrada pelo SDK (nunca salvo à mão), recusa chamar a API sem sessão.
- **`CopilotPanel`** — os 7 blocos (Agora, Pergunte + copiar, Por quê, Ainda precisamos descobrir, Alerta, Técnica recomendada linkada ao Playbook, Evite agora), coluna fixa no desktop (≥1080px), drawer no mobile.
- **3 gatilhos**: manual (botão sempre disponível), automático ao concluir Qualificação/Diagnóstico/Devolução/Escopo, automático ao registrar objeção. Testado com Playwright contra servidor fake — todos os 3 confirmados funcionando corretamente.
- **Responsividade**: testada em 360/375/390/412/430px nas telas do Copilot — touch, z-index, pointer-events, scroll lock revisados.
- **`OBJECTION_PLAYBOOK`**: 10 tipos de objeção com o que fazer/não fazer/pergunta/técnica.
- **Autenticação** (`src/auth/`): `AuthProvider`/`useAuth`/`LoginPage`, só e-mail+senha, sem cadastro público. `AccountMenu` (`src/components/`) — usado em Sidebar, MobileNav e MeetingTopBar. Rotas protegidas via `Root.tsx`; `#/login` como rota própria no router hash-based.
- **Build/deploy**: `npm run build` (tsc -b + vite build), `npm run build:api` (typecheck isolado de `api/`+`scripts/`), `npm run lint` (oxlint), `npm run test:copilot` (script de teste em processo). Deploy Vercel zero-config (sem `vercel.json`), branch atual `claude/abza-sales-playbook-mhar8t`.

---

## 5. Decisões técnicas já tomadas (não re-perguntar)

- Preço nunca é gerado por IA — regra codificada em `salesRules.ts` e reforçada no system prompt.
- Toda técnica sugerida pela IA é validada contra o catálogo real do Playbook (`TECH`); sem correspondência, cai em texto simples, nunca inventa um link quebrado.
- Copilot nunca bloqueia a navegação da call — erro de rede/IA vira estado visual, roteiro continua 100% utilizável.
- Painel é "segunda camada": prioridade visual é sempre pergunta+resposta do roteiro, Copilot é lateral/drawer, nunca modal central.
- Nenhuma chamada de IA a cada tecla — só nos 3 gatilhos definidos.
- Endpoint recebe a reunião inteira no corpo (`{ meeting }`) em vez de buscar por id, porque a persistência hoje é client-side — reavaliar se/quando Supabase virar obrigatório.

**Risco de segurança — fechado nesta etapa:** ver seção 5-A abaixo para o
detalhamento completo (como funciona, arquivos, testes, o que ainda depende
de configuração manual na Vercel).

- Modelo de RLS escolhido: **qualquer usuário autenticado vê/edita todas as
  reuniões** (histórico compartilhado do time comercial — combina com a UI
  atual de Reuniões, que já lista tudo sem filtro por dono). `owner_id` em
  `meetings` guarda quem criou cada reunião (atribuição), mas **não**
  restringe quem pode ler — se vocês quiserem "cada um só vê o que é seu"
  no futuro, é uma troca pequena de policy, não de schema.

---

## 5-A. `/api/copilot` protegido server-side (Checkpoint 1d)

**Como funciona:** o frontend (`useCopilotAnalysis` em `src/meeting/useCopilot.ts`)
lê a sessão já administrada pelo `supabase-js` via `useAuth()` (a mesma sessão
usada para proteger as páginas — nada de token salvo à mão em
`localStorage`) e, quando existe, envia `Authorization: Bearer
<session.access_token>` em todo POST para `/api/copilot`. Se não houver
sessão (usuário deslogado ou sessão expirada) num deployment com Supabase
Auth ativo, o hook **nem chama a API** — mostra "Sua sessão expirou. Faça
login novamente para usar o Copilot." e retorna; a call/roteiro nunca é
bloqueada, só esse painel fica indisponível até logar de novo.

No servidor, `api/copilot.ts` chama `verifySupabaseUser` (novo helper em
`api/_lib/verifySupabaseUser.ts`) **antes de tudo o mais** — antes até do
rate limit e da validação do payload. Esse helper faz exatamente o que a
Supabase recomenda para verificar identidade dentro de uma função
serverless: `supabase.auth.getUser(jwt)`, que chama `/auth/v1/user` do
projeto Supabase e deixa a própria Supabase confirmar assinatura e validade
do token — **não é uma verificação baseada em nada que o frontend apenas
diga ser verdade.** Sem token, token inválido, malformado ou expirado →
`401 { error: { code: 'unauthorized' } }` e a OpenAI **nunca** é chamada.
Só depois de um usuário confirmado é que o handler segue para rate limit →
validação de forma/tamanho do payload → checagem de `OPENAI_API_KEY` →
chamada à OpenAI.

Exceção deliberada, para não travar ambientes sem Supabase configurado:
se `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` **não** estiverem
definidas neste deployment (Supabase Auth desativado — mesmo estado em que
o frontend também não exige login hoje), o endpoint segue funcionando sem
exigir token, exatamente como antes desta etapa. Assim que essas variáveis
forem configuradas na Vercel (ação manual pendente do Gustavo, seção 6),
a exigência de login passa a valer automaticamente dos dois lados, sem
precisar mexer em código de novo.

**Sem `service_role`.** `verifySupabaseUser` usa a mesma chave
client-safe (`VITE_SUPABASE_PUBLISHABLE_KEY`/`VITE_SUPABASE_ANON_KEY`) que
o frontend já usa — é o suficiente para `auth.getUser(jwt)` confirmar um
usuário, e é exatamente por isso que a Supabase recomenda esse padrão em
vez de `service_role` para esse propósito.

**Nenhuma variável de ambiente nova foi necessária.** Variáveis com prefixo
`VITE_` continuam acessíveis via `process.env` dentro de uma Vercel
Function (o prefixo só controla o que o Vite embute no bundle do
navegador) — então `api/_lib/verifySupabaseUser.ts` reaproveita as mesmas
`VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` já documentadas na
seção 6. `OPENAI_API_KEY` continua sendo lida só de
`process.env.OPENAI_API_KEY`, nunca logada nem devolvida em resposta
alguma.

**Proteções adicionais adicionadas junto:**
- Só `POST` é aceito (`405` para qualquer outro método).
- Limite de tamanho de payload: `413` acima de 200KB — checado tanto pelo
  header `Content-Length` (rápido) quanto por `JSON.stringify(meeting).length`
  (defensivo, para não confiar só no header que o cliente manda).
- Rate limit simples, em memória, por usuário autenticado — 10
  requisições/minuto, sem infraestrutura nova (sem Redis/serviço externo),
  conforme pedido. É "best effort": cada instância serverless da Vercel tem
  sua própria memória, então sob várias instâncias concorrentes o limite
  real pode passar um pouco de 10/min — mesmo assim barra o caso comum (um
  script batendo no endpoint repetidamente).
- Corpo malformado ou sem `meeting` → `400`, nunca chega a chamar a OpenAI.
- `export const config = { maxDuration: 30 }` — timeout da função Vercel
  compatível com o timeout de 20s já existente da chamada à OpenAI (exige
  plano Vercel que permita 30s; confirme no projeto).
- Logs revisados: nenhum deles imprime o token do usuário, `OPENAI_API_KEY`,
  corpo de erro bruto do provedor upstream, nem mensagem de erro que possa
  ecoar conteúdo sensível — só código/status/id seguros para diagnóstico.

**Testado nesta sessão** (ver seção 8 para os 7 casos + evidências) — em
processo, contra o handler **real** de `api/copilot.ts` (não uma
reimplementação/mock da lógica) autenticando contra um servidor GoTrue fake
local que fala o mesmo contrato HTTP do Supabase Auth real
(`/auth/v1/user`), e via Playwright contra a build real do frontend. **Não
testado contra Supabase/OpenAI real** — este sandbox não tem acesso de rede
a `api.openai.com` nem a um projeto Supabase real; ver seção 8 para o
procedimento manual exato a rodar na Vercel.

---

## 6. Variáveis de ambiente

| Variável | Onde é usada | Status |
|---|---|---|
| `OPENAI_API_KEY` | `api/copilot.ts`, server-side apenas | Precisa ser configurada na Vercel (Project Settings → Environment Variables). Nunca no código, nunca `VITE_`. |
| `OPENAI_COPILOT_MODEL` | Será usado por `api/copilot.ts` (hoje ainda é `OPENAI_MODEL`, será renomeado) | Pendente — default a implementar: `gpt-5.6-terra` |
| `OPENAI_COPILOT_REASONING` | Novo — ainda não existe no código | Pendente — default a implementar: `low` |
| `VITE_SUPABASE_URL` | `src/store/supabaseClient.ts` | Opcional — vazia hoje, app roda em localStorage. Preencher com a URL do projeto Supabase real do Gustavo quando for ativar. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `src/store/supabaseClient.ts` | **Nome atual, preferido.** Client-safe por design (não é secreta) — só não fará nada sem RLS correta, que já está pronta nas migrations. |
| `VITE_SUPABASE_ANON_KEY` | `src/store/supabaseClient.ts` | Legado — ainda aceito como fallback se `PUBLISHABLE_KEY` não estiver definida, para projetos Supabase mais antigos que só mostram "anon public". |

Nenhum valor real está ou será commitado. `.env.example` documenta só os nomes.
Nenhuma `service_role`/secret key é usada em lugar nenhum do projeto — nunca deve ser.

---

## 7. Migrations (Supabase)

- `supabase/migrations/0001_initial_schema.sql` — clients, meetings (+ `owner_id` novo, ligado a `auth.users`), meeting_answers, meeting_objections, meeting_insights, meeting_pricing_scenarios. RLS: `authenticated` apenas, sem `using(true)`.
- `supabase/migrations/0002_copilot_insights.sql` — nova tabela `meeting_copilot_insights`, espelhando `CopilotAnalysisRecord`+`CopilotSuggestion` em colunas (não JSONB), pronta para quando a Fase 3 (persistência real dos insights) for implementada.
- **Validadas de verdade** contra Postgres 16 local nesta sessão: rodam sem erro, idempotentes, RLS testado com insert real (nego + permite). Ver seção 8.
- `supabase/schema.sql` (arquivo antigo, achatado) foi substituído por um ponteiro para `supabase/migrations/` — não há mais duas fontes de verdade do schema.
- **Nunca aplicadas contra o Supabase real** — ação manual do Gustavo, ver mensagem de entrega desta auditoria para o passo a passo exato.
- **Auditoria desta etapa (implementação de Auth)**: nenhuma alteração de
  migration foi necessária — `owner_id default auth.uid()` e a RLS
  `authenticated`-only já cobriam os requisitos de "associar reunião ao
  usuário" e "impedir acesso não autorizado" desde a auditoria anterior.

---

## 8. Testes realizados até agora

- Typecheck (`tsc -b` + `tsc --noEmit -p tsconfig.server.json`): limpo.
- Lint (`oxlint`): limpo (3 warnings pré-existentes não relacionados).
- Build de produção: limpo, bundle do frontend não cresce com código server-side (confirma que a chave/SDK da OpenAI nunca vai para o navegador).
- `/api/copilot` testado com chave real em sessão anterior — confirmado funcionando (resposta estruturada válida recebida).
- Frontend testado com Playwright contra um servidor fake (mesmo contrato HTTP) — 3 gatilhos, 7 blocos, desktop/mobile, estado de erro, tudo confirmado.
- **OpenAI real nunca foi testada neste sandbox atual** — sem acesso de rede a `api.openai.com` neste ambiente.
- Migrations 0001+0002 testadas contra Postgres 16 local: aplicação limpa, reaplicação idempotente, RLS validado com insert real negado (role `anon`) e permitido (role `authenticated`), insert real em `meeting_copilot_insights` com todos os CHECK de enum aceitando os valores esperados.
- **Auth testado de ponta a ponta** com Playwright contra um servidor GoTrue
  fake (mesmo contrato HTTP do Supabase Auth real — `/auth/v1/token`,
  `/auth/v1/logout`) nesta sessão: acesso direto a `/scripts`, `/reunioes`,
  `/playbook` sem sessão redireciona para `/login`; credenciais erradas
  mostram erro em português e não avançam; login correto libera as 3 áreas,
  mostra e-mail + botão Sair na Sidebar/MobileNav/MeetingTopBar; sessão
  sobrevive a um reload de página; sair redireciona para `/login` e a
  proteção volta a valer imediatamente. Testado em 360/390/430px (touch,
  sem overflow, alvos de toque ≥44px). Testado também **sem** Supabase
  configurado — confirmado zero regressão (app funciona exatamente como
  antes, nenhum botão de conta aparece).
- **`/api/copilot` protegido server-side testado nesta sessão (Checkpoint 1d)**:
  - **Backend, em processo, contra o handler real** (`api/copilot.ts` sem
    reimplementação/mock), autenticando de verdade contra um servidor
    GoTrue fake local que fala o mesmo contrato HTTP do Supabase Auth real
    (`/auth/v1/user`): sem `Authorization` → `401`; Bearer forjado/inválido
    → `401`; token válido + reunião válida → passa da autenticação, do
    rate limit e da validação de payload (confirmado chegando no gate da
    OpenAI); token válido + payload inválido/sem `meeting` → `400`; método
    `GET` → `405`; payload de ~300KB → `413`; 11ª requisição autenticada no
    mesmo minuto → `429` (rate limit isolado em processo próprio, sem
    contaminação de chamadas anteriores). Verificado em cada uma dessas
    respostas e nos logs capturados: nenhum token, nenhuma
    `OPENAI_API_KEY` e nenhum stack trace aparecem. Regressão também
    confirmada: sem `VITE_SUPABASE_URL`/`KEY` configuradas, o endpoint
    continua funcionando sem exigir login (mesmo fallback do frontend).
  - **Frontend, com Playwright contra a build real do app**, apontando
    para o mesmo servidor GoTrue fake (agora também servindo um shim
    mínimo de `/rest/v1/*` em memória, só para permitir criar/carregar uma
    reunião de teste de ponta a ponta): usuário sem sessão nunca dispara
    nenhuma chamada a `/api/copilot` e é redirecionado para `/login` ao
    tentar entrar direto numa call; usuário autenticado, ao clicar
    "Analisar agora", dispara exatamente 1 chamada contendo
    `Authorization: Bearer <access_token>` da sessão Supabase real (não um
    valor inventado no teste) e a sugestão retornada aparece na UI; após
    clicar "Sair", a URL protegida da call deixa de ser acessível (volta
    para `/login`, sem nova chamada ao Copilot); nenhum `service_role` ou
    stack trace aparece no console/DOM do navegador.
  - **Não testado contra Supabase real nem contra a OpenAI real** — este
    sandbox não tem acesso de rede a `api.openai.com` nem a um projeto
    Supabase de verdade. O procedimento manual exato para validar isso na
    Vercel está na mensagem de entrega desta etapa.

---

## 8-A. Persistência real resiliente + histórico do Copilot (Checkpoint 1e)

**Contexto**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
`OPENAI_API_KEY`, `OPENAI_COPILOT_MODEL` e `OPENAI_COPILOT_REASONING` já
estão configuradas na Vercel (confirmado pelo Gustavo), mas as migrations
(seção 7) **ainda não foram aplicadas no projeto Supabase real** — ver
seção 11 para o bloqueio exato. Enquanto isso, o código dos itens abaixo já
está pronto e testado (com um shim local do banco, nunca contra o projeto
real — ver seção 11).

**1) Persistência nunca mascara erro da nuvem** (`src/store/resilientStore.ts`,
novo): quando o backend é Supabase, `saveMeeting` grava normalmente; se a
gravação falhar (rede, RLS, projeto fora do ar), o dado é preservado num
cache local (`localStorage`, chave própria — nunca a fonte de verdade) e um
`CloudSaveFailedError` é lançado — nunca engolido. `useActiveMeeting`
(`src/meeting/useMeetingStore.ts`) captura isso e muda `saveStatus` para
`'error'`, que o Modo Call (`CallMode.tsx`) mostra como "· Não sincronizado
— salvo só neste dispositivo" no lugar de "· Salvo". `startMeeting` (criar
reunião) nunca bloqueia a call mesmo se o save inicial falhar — só loga e
segue, confiando no backup local + no autosave tentando de novo depois.
Quando a gravação volta a funcionar, o backup local daquela reunião é
removido — ele nunca vira uma segunda fonte de verdade permanente.
`getMeeting` cai pro backup local só quando a nuvem não tem o registro (útil
exatamente para o caso do save inicial ter falhado) — nunca inventa dado.
`src/store/supabaseStore.ts` foi ajustado para checar o `error` de toda
chamada de escrita (`meetings`, `meeting_answers`, `meeting_objections`,
`meeting_copilot_insights`) e lançar em vez de silenciosamente seguir —
antes disso, uma escrita podia falhar e o app reportar "Salvo" mesmo assim.

**2) Histórico do Copilot em `meeting_copilot_insights`**
(`src/store/supabaseStore.ts`): cada análise do Copilot (`CopilotAnalysisRecord`,
`src/knowledge/copilotAnalysis.ts` — agora com os campos `questionId`,
`source`, `model` que faltavam) é persistida ali de forma append-only
(mesmo padrão já usado para objeções), com todas as colunas pedidas:
`meeting_id`, `stage_id`, `question_id` (sempre `null` hoje — o Modo Call
ainda não rastreia "pergunta em foco" separado da etapa), `trigger`,
`source` (sempre `'ai'`), `model`, `summary`, `main_insight`,
`next_question`, `why`, `missing_information`, `detected_objection`,
`recommended_technique`, `risk_level`, `recommended_move`, `alert`,
`do_not_do`, `created_at`. Ao reabrir uma reunião, `getMeeting` já devolve
`copilotHistory` populado a partir dessa tabela — a análise mais recente
existe nos dados assim que a reunião é recarregada. **Não implementado
ainda**: a UI do `CopilotPanel`/`MeetingDetail` não reidrata/mostra esse
histórico automaticamente ao reabrir (hoje só mostra o que foi gerado na
sessão atual) — isso é um ajuste de UI pequeno, separado, não feito nesta
etapa para não expandir escopo sem pedido explícito.

**3) `OPENAI_COPILOT_MODEL`/`OPENAI_COPILOT_REASONING` agora usadas de
verdade** (`api/copilot.ts`): antes só existiam na Vercel mas o código lia
`OPENAI_MODEL` (nome antigo). Agora `OPENAI_COPILOT_MODEL` é a primeira
opção, com `OPENAI_MODEL` como fallback legado e `gpt-4o-mini` como último
fallback (não presumi que "gpt-5.6-terra" fosse um nome de modelo válido
para hardcodar como default — só passo o que estiver na env var). Quando
`OPENAI_COPILOT_REASONING` existe, é enviada como `reasoning.effort` na
chamada à Responses API; quando não existe, o parâmetro é omitido (não
força `reasoning` num modelo que talvez não seja da família reasoning). A
resposta de `/api/copilot` agora inclui `model` (não é secreto — só o nome
do modelo usado) para o frontend persistir em `meeting_copilot_insights.model`.

**Testado nesta sessão**:
- Unit test isolado de `resilientStore.ts` (sem browser, `localStorage`
  polyfillado em memória): save bem-sucedido não lança; save que falha
  lança `CloudSaveFailedError` e preserva localmente sem tocar o backend
  remoto; a reunião cujo save falhou continua recuperável via
  `getMeeting`; ao sincronizar de novo, o backup é limpo. 6/6 OK.
- E2E com Playwright contra a build real do app + um shim local de
  `/rest/v1/*` (não é o Supabase real — ver seção 11): login → nova
  reunião → responde uma pergunta → "Analisar agora" → confirma via
  `fetch` direto ao shim que `meetings`, `meeting_answers` e
  `meeting_copilot_insights` foram gravados de verdade pelo código real
  (não reimplementado) de `supabaseStore.ts`, com `summary`, `risk_level`,
  `model`, `source`, `trigger` corretos na linha — reload completo da
  página → resposta em texto livre recuperada. 10/10 OK.
- Typecheck (`tsc -b` + `tsc --noEmit -p tsconfig.server.json`), lint
  (`oxlint`) e `npm run build`: limpos.
- **Não testado contra o Supabase real nem contra a OpenAI real** — ver
  seção 11 para o motivo exato (bloqueio de autenticação da CLI) e o que
  falta para isso ser possível.

---

## 9. Próximo passo exato

**Ainda aguardando o Gustavo responder ao questionário consolidado do
Checkpoint 1** (usuários/produtos/comportamento do Copilot) — Auth,
proteção server-side do `/api/copilot` e persistência resiliente (Checkpoint
1e) foram pedidos à parte, já concluídos no código.

**Bloqueado agora**: aplicar as migrations no projeto Supabase real requer
autenticar a Supabase CLI — ver seção 11 para o comando exato que o
Gustavo precisa rodar (nada de secret colado no chat). Assim que isso
acontecer, a sessão retoma exatamente do ponto em que parou: link do
projeto → mostrar project ref/nome → aplicar `0001` e `0002` via
`supabase db push` → auditar RLS/schema real → seguir para os testes de
segurança e funcionais de ponta a ponta contra o projeto real.

Se ainda não houver nenhum usuário real no projeto, essa é a única outra
ação manual esperada: criar o primeiro usuário em Authentication → Users →
Add user no Supabase Dashboard (detalhes exatos na seção 11/mensagem de
entrega desta etapa).

---

## 10. Não implementado ainda (por pedido explícito)

Read AI, áudio/transcrição, Pricing Engine automático, CRM, dashboards
complexos. A prioridade combinada é a infraestrutura atual 100% funcional
antes de expandir escopo.

---

## 11. Automação Supabase CLI — auditoria e bloqueio atual

**Auditoria feita nesta sessão**:
- Supabase CLI: **não estava instalada** neste ambiente — instalada agora
  (`npm install -g supabase`, versão 2.116.0). Isso resolve globalmente
  para esta sessão; não é algo que precise ser repetido pelo Gustavo.
- `supabase/config.toml`: **não existe** no repositório — o projeto nunca
  foi inicializado com `supabase init`.
- Vínculo com o projeto real: **nenhum** — sem `config.toml` linkado a
  nenhum project ref.
- Autenticação da CLI: **nenhuma** — `supabase projects list` devolve
  `LegacyPlatformAuthRequiredError` (token de acesso ausente).

**Por que parei exatamente aqui**: autenticar a CLI é uma ação que só pode
ser feita pelo dono da conta Supabase — gerar um token de acesso pessoal.
Testei as duas rotas oficiais disponíveis num ambiente sem navegador/TTY
(`supabase login` interativo e `supabase login --no-browser`) e ambas
recusam por não haver terminal interativo aqui — a CLI pede explicitamente
`--token` ou a variável de ambiente `SUPABASE_ACCESS_TOKEN`. Não vou pedir
esse token colado no chat (regra explícita do Gustavo).

### AÇÃO MANUAL NECESSÁRIA

1. **Onde**: gere um Personal Access Token em
   `https://supabase.com/dashboard/account/tokens` → "Generate new token"
   (dê um nome como `abza-cli`). Copie o valor uma única vez.
2. **O que fazer**: **não cole esse token no chat.** Adicione-o como
   variável de ambiente **deste ambiente do Claude Code** (não é uma
   variável da Vercel, é separada) chamada `SUPABASE_ACCESS_TOKEN`, com o
   valor do token gerado — isso é exatamente o mecanismo oficial que a
   própria Supabase documenta para autenticar a CLI em ambientes sem
   navegador/CI. Isso é feito nas configurações do ambiente na interface do
   Claude Code (claude.ai/code ou no app), não nesta conversa.
3. **O que responder quando terminar**: só confirme que configurou a
   variável (não precisa dizer o valor). Se este ambiente exigir uma nova
   sessão para a variável ficar disponível no container, me avise disso
   também, ou simplesmente me diga "configurei" e eu confirmo se a CLI já
   enxerga o token.

Depois de autenticado, os próximos passos automáticos (sem nova ação sua,
a não ser a criação do primeiro usuário — ver seção 6/9) são: descobrir o
project ref via `supabase projects list`, mostrar project ref + nome antes
de tocar no banco, `supabase link`, `supabase db push` com as duas
migrations, depois auditoria de RLS/schema real, testes de segurança e
funcionais de ponta a ponta.
