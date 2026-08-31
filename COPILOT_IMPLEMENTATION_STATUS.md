# ABZA Sales Copilot — Status de Implementação

> Arquivo de continuidade. Se uma sessão do Claude Code acabar, uma nova sessão
> deve ler este arquivo inteiro antes de tocar em qualquer código. Nunca
> contém secrets — só nomes de variáveis de ambiente, nunca valores.

Última atualização: **Checkpoint 1c — Supabase Auth implementado (login/logout, sessão, rotas protegidas)** (ainda aguardando respostas do questionário do Checkpoint 1 sobre o Copilot em si — usuários/produtos/comportamento do agente).

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
  **Gap conhecido, ainda não fechado**: essa proteção é a nível de
  página (frontend). `/api/copilot` **ainda não verifica a sessão no
  servidor** — continua aceitando qualquer POST bem formado, autenticado ou
  não, na Vercel. Fechar isso é validar o JWT do Supabase dentro de
  `api/copilot.ts` — próximo passo natural, não feito nesta etapa porque não
  foi pedido explicitamente agora.

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
| 7 | Segurança/abuso do endpoint público | **Parcial** — páginas protegidas por login (novo). `/api/copilot` em si ainda **não** valida sessão no servidor — risco de uso indevido direto no endpoint continua real (ver seção 5) |
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
- **`/api/copilot`** — POST, Structured Outputs, tratamento de erro completo (chave ausente, timeout, rate limit, quota insuficiente, resposta inválida, erro genérico), nunca vaza stack trace.
- **`useCopilotAnalysis`** (`src/meeting/useCopilot.ts`) — hook client-side, guarda contra chamadas sobrepostas, nunca bloqueia a call.
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

**Risco de segurança — parcialmente resolvido, não fechado:**
As páginas (Playbook/Scripts/Reuniões) agora exigem login. Mas
`/api/copilot` continua publicamente acessível por si só — sem verificação
de sessão no servidor, sem rate limit por usuário/IP, sem limite de tamanho
de payload além do default da Vercel. Alguém com a URL do endpoint (não da
página) ainda pode chamá-lo diretamente e gastar créditos da conta OpenAI da
ABZA. **Recomendo fechar isso validando o JWT do Supabase dentro de
`api/copilot.ts`** antes de considerar o Copilot pronto para uso real —
posso implementar isso quando você quiser.

- Modelo de RLS escolhido: **qualquer usuário autenticado vê/edita todas as
  reuniões** (histórico compartilhado do time comercial — combina com a UI
  atual de Reuniões, que já lista tudo sem filtro por dono). `owner_id` em
  `meetings` guarda quem criou cada reunião (atribuição), mas **não**
  restringe quem pode ler — se vocês quiserem "cada um só vê o que é seu"
  no futuro, é uma troca pequena de policy, não de schema.

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

---

## 9. Próximo passo exato

**Ainda aguardando o Gustavo responder ao questionário consolidado do
Checkpoint 1** (usuários/produtos/comportamento do Copilot) — a
implementação de Auth desta sessão foi um pedido à parte, já concluída.

Ação manual pendente do Gustavo: criar o primeiro usuário no Supabase
Dashboard (ver mensagem de entrega desta etapa) e configurar
`VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` na Vercel + rodar as
migrations — sem isso, o Auth fica automaticamente desativado (app
continua funcionando, só sem exigir login).

Sugestão de próximo passo técnico (não decidido, oferecido): validar o JWT
do Supabase dentro de `api/copilot.ts` para fechar o gap descrito na seção 5.
