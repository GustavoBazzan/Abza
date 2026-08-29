import type { SupabaseClient } from '@supabase/supabase-js';
import type { Answer, Meeting, ObjectionEvent } from '../data/meeting';
import { deriveMeetingStatus } from '../data/meeting';
import type { MeetingStore } from './types';

// Maps Meeting <-> the normalized schema in supabase/schema.sql. Only
// exercised once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set — see
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

async function loadRelated(client: SupabaseClient, meetingId: string) {
  const [answersRes, objectionsRes, insightsRes] = await Promise.all([
    client.from('meeting_answers').select('*').eq('meeting_id', meetingId),
    client.from('meeting_objections').select('*').eq('meeting_id', meetingId),
    client.from('meeting_insights').select('*').eq('meeting_id', meetingId),
  ]);
  return {
    answers: answersRes.data ?? [],
    objections: objectionsRes.data ?? [],
    insights: insightsRes.data ?? [],
  };
}

function rowToMeeting(
  row: MeetingRow,
  answers: { question_id: string; value: string; source: string; updated_at: string }[],
  objections: { id: string; type: string; stage_id: string; client_response: string; source: string; created_at: string }[],
  insights: { id: string; source: string; text: string; created_at: string }[],
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
    // Histórico do Copilot ainda não tem tabela própria no schema Supabase —
    // hoje só é persistido via localStorage. Ver supabase/schema.sql.
    copilotHistory: [],
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    endedAt: row.ended_at ?? undefined,
  };
}

export function createSupabaseStore(client: SupabaseClient): MeetingStore {
  return {
    backend: 'supabase',

    async listMeetings() {
      const { data, error } = await client.from('meetings').select('*').order('updated_at', { ascending: false });
      if (error || !data) return [];
      const full = await Promise.all(
        (data as MeetingRow[]).map(async (row) => {
          const { answers, objections, insights } = await loadRelated(client, row.id);
          return rowToMeeting(row, answers, objections, insights);
        }),
      );
      return full;
    },

    async getMeeting(id) {
      const { data, error } = await client.from('meetings').select('*').eq('id', id).maybeSingle();
      if (error || !data) return null;
      const { answers, objections, insights } = await loadRelated(client, id);
      return rowToMeeting(data as MeetingRow, answers, objections, insights);
    },

    async saveMeeting(meeting) {
      const status = deriveMeetingStatus(meeting);
      await client.from('meetings').upsert({
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

      const answerRows = Object.entries(meeting.answers).map(([questionId, a]) => ({
        meeting_id: meeting.id, question_id: questionId, value: a.value, source: a.source, updated_at: a.updatedAt,
      }));
      if (answerRows.length) {
        await client.from('meeting_answers').upsert(answerRows, { onConflict: 'meeting_id,question_id' });
      }

      // Objections are append-only from the app's perspective (each is a
      // discrete event); only insert ones the server doesn't have yet.
      const { data: existing } = await client.from('meeting_objections').select('id').eq('meeting_id', meeting.id);
      const existingIds = new Set((existing ?? []).map((r: { id: string }) => r.id));
      const newObjections = meeting.objections.filter((o) => !existingIds.has(o.id));
      if (newObjections.length) {
        await client.from('meeting_objections').insert(
          newObjections.map((o) => ({
            id: o.id, meeting_id: meeting.id, type: o.type, stage_id: o.stageId,
            client_response: o.clientResponse, source: o.source, created_at: o.createdAt,
          })),
        );
      }
    },

    async deleteMeeting(id) {
      await client.from('meetings').delete().eq('id', id);
    },
  };
}
