-- ABZA Sales Playbook — 0001: schema base de "Scripts de Reunião" / "Reuniões".
--
-- Idempotente: seguro rodar mais de uma vez contra o mesmo projeto (usa
-- `if not exists` nas tabelas/índices e `drop policy if exists` antes de
-- recriar cada policy). Rode este arquivo ANTES do 0002.
--
-- Como aplicar: Supabase Dashboard → SQL Editor → cole o conteúdo inteiro →
-- Run. (Ou `supabase db push` se/quando o projeto adotar o CLI — ainda não
-- há supabase/config.toml neste repo.)
--
-- Modelagem: `meetings` carrega os blocos de valor único (setup,
-- qualification, diagnosis, pricing, closing) como colunas JSONB que
-- espelham 1:1 os tipos TypeScript em src/data/meeting.ts — o frontend lê/
-- escreve sem camada de mapeamento. `meeting_answers` e `meeting_objections`
-- são normalizadas em linhas de verdade porque são coleções que crescem
-- durante a call e se beneficiam de serem consultáveis por si só (ex.:
-- "qual objeção aparece mais", "com que frequência a pergunta X é
-- respondida").

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- clients — opcional hoje (o app não grava nada aqui ainda; setup.client/
-- setup.company na reunião são só texto livre). Existe para quando/se
-- decidirmos ter uma entidade "cliente" de verdade, reutilizável entre
-- reuniões do mesmo contato.
-- ---------------------------------------------------------------------------
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- meetings — uma linha por reunião registrada em Scripts de Reunião.
-- `owner_id` é metadado de atribuição (quem criou/é o vendedor
-- responsável) ligado a auth.users; NÃO é usado para restringir leitura —
-- a área "Reuniões" é histórico compartilhado do time comercial, então
-- qualquer usuário autenticado pode ver todas as reuniões (ver policies
-- abaixo). Se decidirmos exigir visibilidade só do próprio dono no futuro,
-- é uma troca pequena de policy, sem mudança de schema.
-- ---------------------------------------------------------------------------
create table if not exists meetings (
  id text primary key,                    -- mantém o id mtg_* gerado pelo cliente
  product_id text not null,
  client_id uuid references clients(id) on delete set null,
  owner_id uuid references auth.users(id) on delete set null default auth.uid(),
  status text not null default 'em-andamento'
    check (status in ('em-andamento', 'proposta', 'follow-up', 'ganho', 'perdido')),

  setup jsonb not null default '{}'::jsonb,           -- MeetingSetupInfo
  qualification jsonb not null default '{}'::jsonb,   -- CommercialQualification
  diagnosis jsonb not null default '{}'::jsonb,        -- CommercialDiagnosis
  scope jsonb not null default '{}'::jsonb,            -- ScopeSelection
  pricing jsonb not null default '{}'::jsonb,          -- PricingInfo
  closing jsonb not null default '{}'::jsonb,          -- ClosingInfo
  current_stage_index int not null default 0,
  techniques_viewed text[] not null default '{}',

  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ended_at timestamptz
);

create index if not exists meetings_updated_at_idx on meetings (updated_at desc);
create index if not exists meetings_status_idx on meetings (status);
create index if not exists meetings_product_id_idx on meetings (product_id);
create index if not exists meetings_owner_id_idx on meetings (owner_id);

-- One row per question answered during a call. `source` mirrors DataSource
-- ('manual' | 'transcription' | 'ai') so a future live-transcription or
-- Copilot-suggested answer slots in without a schema change.
create table if not exists meeting_answers (
  id uuid primary key default gen_random_uuid(),
  meeting_id text not null references meetings(id) on delete cascade,
  question_id text not null,
  value text not null default '',
  source text not null default 'manual' check (source in ('manual', 'transcription', 'ai')),
  updated_at timestamptz not null default now(),
  unique (meeting_id, question_id)
);

create table if not exists meeting_objections (
  id uuid primary key default gen_random_uuid(),
  meeting_id text not null references meetings(id) on delete cascade,
  type text not null,
  stage_id text not null,
  client_response text not null default '',
  source text not null default 'manual' check (source in ('manual', 'transcription', 'ai')),
  created_at timestamptz not null default now()
);

-- Nota manual genérica (AIInsight no TS) — hoje o app nunca escreve aqui.
-- Não confundir com meeting_copilot_insights (0002), que é o formato
-- estruturado real das análises do ABZA Sales Copilot.
create table if not exists meeting_insights (
  id uuid primary key default gen_random_uuid(),
  meeting_id text not null references meetings(id) on delete cascade,
  source text not null default 'manual' check (source in ('manual', 'ai')),
  text text not null,
  created_at timestamptz not null default now()
);

-- Reservada para o futuro Pricing Engine determinístico (diagnóstico +
-- escopo + tabela oficial + regras -> valor). Não populada hoje —
-- meetings.pricing cobre o fluxo manual desta versão. Preço NUNCA deve ser
-- escrito aqui por uma IA sem revisão humana.
create table if not exists meeting_pricing_scenarios (
  id uuid primary key default gen_random_uuid(),
  meeting_id text not null references meetings(id) on delete cascade,
  scope_item_ids text[] not null default '{}',
  calculated_amount numeric,
  rule_version text,
  created_at timestamptz not null default now()
);

alter table clients enable row level security;
alter table meetings enable row level security;
alter table meeting_answers enable row level security;
alter table meeting_objections enable row level security;
alter table meeting_insights enable row level security;
alter table meeting_pricing_scenarios enable row level security;

-- Ferramenta interna do time comercial: qualquer usuário AUTENTICADO tem
-- acesso total (não pública — sem sessão, zero acesso). `(select auth.role())`
-- em vez de `auth.role()` puro é a forma recomendada pela Supabase para RLS:
-- o subselect deixa o planner cachear o valor por statement em vez de
-- reavaliar por linha.
drop policy if exists "authenticated full access" on clients;
create policy "authenticated full access" on clients
  for all using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');

drop policy if exists "authenticated full access" on meetings;
create policy "authenticated full access" on meetings
  for all using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');

drop policy if exists "authenticated full access" on meeting_answers;
create policy "authenticated full access" on meeting_answers
  for all using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');

drop policy if exists "authenticated full access" on meeting_objections;
create policy "authenticated full access" on meeting_objections
  for all using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');

drop policy if exists "authenticated full access" on meeting_insights;
create policy "authenticated full access" on meeting_insights
  for all using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');

drop policy if exists "authenticated full access" on meeting_pricing_scenarios;
create policy "authenticated full access" on meeting_pricing_scenarios
  for all using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');
