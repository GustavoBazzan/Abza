-- ABZA Sales Playbook — 0002: histórico estruturado do ABZA Sales Copilot.
--
-- Idempotente. Rode DEPOIS do 0001_initial_schema.sql.
--
-- Espelha CopilotAnalysisRecord + CopilotSuggestion (src/knowledge/
-- copilotAnalysis.ts, src/knowledge/copilotSuggestion.ts) 1:1, achatado em
-- colunas em vez de um único JSONB — os campos de análise (riskLevel,
-- recommendedMove, etc.) são exatamente o tipo de coisa que vale a pena
-- filtrar/agregar depois (ex.: "quantas calls tiveram risco alto").
--
-- Este schema fica pronto para uso; a escrita real a partir do app
-- (src/store/supabaseStore.ts) ainda não está implementada nesta etapa —
-- ver COPILOT_IMPLEMENTATION_STATUS.md.

create table if not exists meeting_copilot_insights (
  id uuid primary key default gen_random_uuid(),
  meeting_id text not null references meetings(id) on delete cascade,

  -- Envelope (CopilotAnalysisRecord)
  stage_id text not null,
  question_id text,                          -- pergunta específica em foco, quando aplicável
  trigger text not null check (trigger in ('stage', 'manual', 'objection')),
  source text not null default 'ai' check (source in ('manual', 'transcription', 'ai')),
  model text,                                 -- ex.: valor de OPENAI_COPILOT_MODEL usado nesta chamada

  -- Sugestão estruturada (CopilotSuggestion) — nunca chain-of-thought/
  -- raciocínio privado do modelo, só o output operacional.
  summary text not null,
  main_insight text not null,
  next_question text,
  why text not null,
  missing_information text[] not null default '{}',
  detected_objection text,
  recommended_technique text,
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  recommended_move text not null check (recommended_move in (
    'continue_diagnosis', 'validate_diagnosis', 'present_solution', 'present_price',
    'handle_objection', 'close', 'schedule_followup'
  )),
  alert text,
  do_not_do text,

  created_at timestamptz not null default now()
);

create index if not exists meeting_copilot_insights_meeting_id_idx on meeting_copilot_insights (meeting_id);
create index if not exists meeting_copilot_insights_created_at_idx on meeting_copilot_insights (created_at desc);

alter table meeting_copilot_insights enable row level security;

drop policy if exists "authenticated full access" on meeting_copilot_insights;
create policy "authenticated full access" on meeting_copilot_insights
  for all using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');
