-- ABZA Sales Playbook — schema for "Scripts de Reunião" / "Reuniões".
--
-- Not applied automatically. Run this once against a Supabase project (SQL
-- Editor, or `supabase db push` if you adopt the CLI), then set
-- VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (see .env.example). Until those
-- vars are set, the app runs entirely on localStorage — this schema is
-- prepared, not required.
--
-- Modeling choice: `meetings` carries the structured single-valued fields
-- (setup, qualification, diagnosis, pricing, closing) as JSONB columns that
-- mirror the TypeScript types in src/data/meeting.ts 1:1 — the frontend can
-- read/write them without a mapping layer. `meeting_objections` and
-- `meeting_answers` are normalized into real rows because they're
-- append-heavy collections that benefit from being queryable on their own
-- (e.g. "which objection comes up most", "how often is question X answered")
-- once reporting/Copilot work starts.

create extension if not exists pgcrypto;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  created_at timestamptz not null default now()
);

create table if not exists meetings (
  id text primary key,                    -- keeps the client-generated mtg_* id used by the app
  product_id text not null,
  client_id uuid references clients(id),
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

-- One row per question answered during a call (kind: StageKind, questionId
-- match Stage/QuestionDef ids in the product script). `source` mirrors
-- DataSource ('manual' | 'transcription' | 'ai') so future live-transcription
-- or Copilot-suggested answers slot in without a schema change.
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

-- Reserved for the future ABZA Sales Copilot. Never written to by the app today.
create table if not exists meeting_insights (
  id uuid primary key default gen_random_uuid(),
  meeting_id text not null references meetings(id) on delete cascade,
  source text not null default 'manual' check (source in ('manual', 'ai')),
  text text not null,
  created_at timestamptz not null default now()
);

-- Reserved for the future deterministic Pricing Engine (diagnosis + scope +
-- official price table + business rules -> price). Not populated today —
-- `meetings.pricing` covers the manual flow in this version.
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

-- Internal sales tool behind the app's own auth — start permissive for the
-- authenticated role and tighten (e.g. per-owner) once ABZA has real user
-- accounts in Supabase Auth.
create policy "authenticated full access" on clients for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on meetings for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on meeting_answers for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on meeting_objections for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on meeting_insights for all using (auth.role() = 'authenticated');
create policy "authenticated full access" on meeting_pricing_scenarios for all using (auth.role() = 'authenticated');
