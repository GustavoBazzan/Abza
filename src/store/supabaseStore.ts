import type { SupabaseClient } from '@supabase/supabase-js';
import type { Answer, Meeting, ObjectionEvent } from '../data/meeting';
import { deriveMeetingStatus } from '../data/meeting';
import type { MeetingStore } from './types';
import type { CopilotAnalysisRecord, CopilotTrigger } from '../knowledge/copilotAnalysis';

// Maps Meeting <-> the normalized schema in supabase/migrations/. Only
// exercised once VITE_SUPABASE_URL and a client-safe key are set — see
// src/store/index.ts for the fallback-to-localStorage selection.

interface MeetingRow {
  id: string;
  product_id: string;
  status: string;
  setup: Meeting['setup'];
  qualification: Meeting['qualification'];
  diagnosis: Meeting['diagnosis'];
  scope: Meeting['scope'];
  pricing: Meeting['pricing'];
  closing: Meeting['closing'];
  current_stage_index: number;
  techniques_viewed: string[];
  started_at: string;
  updated_at: string;
  ended_at: string | null;
}

interface CopilotInsightRow {
  id: string;
  meeting_id: string;
  stage_id: string;
  question_id: string | null;
  trigger: string;
  source: string;
  model: string | null;
  summary: string;
  main_insight: string;
  next_question: string | null;
  why: string;
  missing_information: string[];
  detected_objection: string | null;
  recommended_technique: string | null;
  risk_level: string;
  recommended_move: string;
  alert: string | null;
  do_not_do: string | null;
  created_at: string;
}

async function loadRelated(client: SupabaseClient, meetingId: string) {
  const [answersRes, objectionsRes, insightsRes, copilotRes] = await Promise.all([
    client.from('meeting_answers').select('*').eq('meeting_id', meetingId),
    client.from('meeting_objections').select('*').eq('meeting_id', meetingId),
    client.from('meeting_insights').select('*').eq('meeting_id', meetingId),
    client.from('meeting_copilot_insights').select('*').eq('meeting_id', meetingId).order('created_at', { ascending: true }),
  ]);
  return {
    answers: answersRes.data ?? [],
    objections: objectionsRes.data ?? [],
    insights: insightsRes.data ?? [],
    copilotInsights: (copilotRes.data ?? []) as CopilotInsightRow[],
  };
}

function copilotRowToRecord(row: CopilotInsightRow): CopilotAnalysisRecord {
  return {
    id: row.id,
    meetingId: row.meeting_id,
    timestamp: row.created_at,
    stageId: row.stage_id,
    questionId: row.question_id,
    trigger: row.trigger as CopilotTrigger,
    source: row.source as CopilotAnalysisRecord['source'],
    model: row.model,
    suggestion: {
      summary: row.summary,
      mainInsight: row.main_insight,
      nextQuestion: row.next_question,
      why: row.why,
      missingInformation: row.missing_information,
      detectedObjection: row.detected_objection,
      recommendedTechnique: row.recommended_technique,
      riskLevel: row.risk_level as CopilotAnalysisRecord['suggestion']['riskLevel'],
      recommendedMove: row.recommended_move as CopilotAnalysisRecord['suggestion']['recommendedMove'],
      alert: row.alert,
      doNotDo: row.do_not_do,
    },
  };
}

function rowToMeeting(
  row: MeetingRow,
  answers: { question_id: string; value: string; source: string; updated_at: string }[],
  objections: { id: string; type: string; stage_id: string; client_response: string; source: string; created_at: string }[],
  insights: { id: string; source: string; text: string; created_at: string }[],
  copilotInsights: CopilotInsightRow[],
): Meeting {
  const answerMap: Record<string, Answer> = {};
  for (const a of answers) {
    answerMap[a.question_id] = { value: a.value, source: a.source as Answer['source'], updatedAt: a.updated_at };
  }
  return {
    id: row.id,
    productId: row.product_id as Meeting['productId'],
    setup: row.setup,
    currentStageIndex: row.current_stage_index,
    answers: answerMap,
    qualification: row.qualification,
    diagnosis: row.diagnosis,
    scope: row.scope,
    pricing: row.pricing,
    closing: row.closing,
    objections: objections.map((o) => ({
      id: o.id, type: o.type as ObjectionEvent['type'], stageId: o.stage_id,
      clientResponse: o.client_response, source: o.source as ObjectionEvent['source'], createdAt: o.created_at,
    })),
    techniquesViewed: row.techniques_viewed,
    insights: insights.map((i) => ({ id: i.id, source: i.source as 'manual' | 'ai', text: i.text, createdAt: i.created_at })),
    copilotHistory: copilotInsights.map(copilotRowToRecord),
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    endedAt: row.ended_at ?? undefined,
  };
}

/** Erro estável (não a mensagem crua do Postgres) para o chamador decidir o
 *  que fazer sem precisar interpretar texto — a mensagem completa ainda vai
 *  pro console para diagnóstico, nunca pra UI. */
function supabaseWriteError(table: string, error: { message: string; code?: string }): Error {
  return new Error(`supabase: falha ao gravar em ${table} (${error.code ?? error.message})`);
}

export function createSupabaseStore(client: SupabaseClient): MeetingStore {
  return {
    backend: 'supabase',

    async listMeetings() {
      const { data, error } = await client.from('meetings').select('*').order('updated_at', { ascending: false });
      if (error || !data) return [];
      const full = await Promise.all(
        (data as MeetingRow[]).map(async (row) => {
          const { answers, objections, insights, copilotInsights } = await loadRelated(client, row.id);
          return rowToMeeting(row, answers, objections, insights, copilotInsights);
        }),
      );
      return full;
    },

    async getMeeting(id) {
      const { data, error } = await client.from('meetings').select('*').eq('id', id).maybeSingle();
      if (error || !data) return null;
      const { answers, objections, insights, copilotInsights } = await loadRelated(client, id);
      return rowToMeeting(data as MeetingRow, answers, objections, insights, copilotInsights);
    },

    // Lança (nunca engole) o primeiro erro de escrita que encontrar — quem
    // chama (ver src/store/resilientStore.ts) é responsável por preservar o
    // dado localmente e sinalizar isso na UI. Nunca reportar sucesso quando
    // uma dessas gravações falhou de verdade.
    async saveMeeting(meeting) {
      const status = deriveMeetingStatus(meeting);
      const { error: meetingError } = await client.from('meetings').upsert({
        id: meeting.id,
        product_id: meeting.productId,
        status,
        setup: meeting.setup,
        qualification: meeting.qualification,
        diagnosis: meeting.diagnosis,
        scope: meeting.scope,
        pricing: meeting.pricing,
        closing: meeting.closing,
        current_stage_index: meeting.currentStageIndex,
        techniques_viewed: meeting.techniquesViewed,
        started_at: meeting.startedAt,
        updated_at: new Date().toISOString(),
        ended_at: meeting.endedAt ?? null,
      });
      if (meetingError) throw supabaseWriteError('meetings', meetingError);

      const answerRows = Object.entries(meeting.answers).map(([questionId, a]) => ({
        meeting_id: meeting.id, question_id: questionId, value: a.value, source: a.source, updated_at: a.updatedAt,
      }));
      if (answerRows.length) {
        const { error: answersError } = await client.from('meeting_answers').upsert(answerRows, { onConflict: 'meeting_id,question_id' });
        if (answersError) throw supabaseWriteError('meeting_answers', answersError);
      }

      // Objections are append-only from the app's perspective (each is a
      // discrete event); only insert ones the server doesn't have yet.
      const { data: existingObjections, error: existingObjectionsError } = await client
        .from('meeting_objections')
        .select('id')
        .eq('meeting_id', meeting.id);
      if (existingObjectionsError) throw supabaseWriteError('meeting_objections (select)', existingObjectionsError);
      const existingObjectionIds = new Set((existingObjections ?? []).map((r: { id: string }) => r.id));
      const newObjections = meeting.objections.filter((o) => !existingObjectionIds.has(o.id));
      if (newObjections.length) {
        const { error: objectionsError } = await client.from('meeting_objections').insert(
          newObjections.map((o) => ({
            id: o.id, meeting_id: meeting.id, type: o.type, stage_id: o.stageId,
            client_response: o.clientResponse, source: o.source, created_at: o.createdAt,
          })),
        );
        if (objectionsError) throw supabaseWriteError('meeting_objections (insert)', objectionsError);
      }

      // Histórico do Copilot também é append-only — cada análise já é um
      // registro imutável no momento em que sai da IA.
      const copilotHistory = meeting.copilotHistory ?? [];
      if (copilotHistory.length) {
        const { data: existingCopilot, error: existingCopilotError } = await client
          .from('meeting_copilot_insights')
          .select('id')
          .eq('meeting_id', meeting.id);
        if (existingCopilotError) throw supabaseWriteError('meeting_copilot_insights (select)', existingCopilotError);
        const existingCopilotIds = new Set((existingCopilot ?? []).map((r: { id: string }) => r.id));
        const newCopilotRecords = copilotHistory.filter((r) => !existingCopilotIds.has(r.id));
        if (newCopilotRecords.length) {
          const { error: copilotError } = await client.from('meeting_copilot_insights').insert(
            newCopilotRecords.map((r) => ({
              id: r.id,
              meeting_id: meeting.id,
              stage_id: r.stageId,
              question_id: r.questionId,
              trigger: r.trigger,
              source: r.source,
              model: r.model,
              summary: r.suggestion.summary,
              main_insight: r.suggestion.mainInsight,
              next_question: r.suggestion.nextQuestion,
              why: r.suggestion.why,
              missing_information: r.suggestion.missingInformation,
              detected_objection: r.suggestion.detectedObjection,
              recommended_technique: r.suggestion.recommendedTechnique,
              risk_level: r.suggestion.riskLevel,
              recommended_move: r.suggestion.recommendedMove,
              alert: r.suggestion.alert,
              do_not_do: r.suggestion.doNotDo,
              created_at: r.timestamp,
            })),
          );
          if (copilotError) throw supabaseWriteError('meeting_copilot_insights (insert)', copilotError);
        }
      }
    },

    async deleteMeeting(id) {
      const { error } = await client.from('meetings').delete().eq('id', id);
      if (error) throw supabaseWriteError('meetings (delete)', error);
    },
  };
}
