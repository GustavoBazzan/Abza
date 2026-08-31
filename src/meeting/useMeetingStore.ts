import { useCallback, useEffect, useRef, useState } from 'react';
import { meetingStore } from '../store';
import { createMeeting, type Meeting, type MeetingSetupInfo, type ProductId } from '../data/meeting';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const AUTOSAVE_DEBOUNCE_MS = 600;

/** Loads one meeting by id and keeps it saved with a debounce, so the caller
 *  never has to click "Salvar" — every `update()` schedules a write and
 *  exposes a status the UI can show discreetly ("Salvando..." / "Salvo"). */
export function useActiveMeeting(meetingId: string | undefined) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!meetingId) {
      setMeeting(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    meetingStore.getMeeting(meetingId).then((m) => {
      if (!cancelled) {
        setMeeting(m);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [meetingId]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  const scheduleSave = useCallback((next: Meeting) => {
    setSaveStatus('saving');
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      meetingStore
        .saveMeeting(next)
        .then(() => setSaveStatus('saved'))
        // Nunca reporta "Salvo" quando a gravação na nuvem falhou — o dado
        // já foi preservado localmente pelo store (ver resilientStore.ts),
        // mas o usuário precisa ver que ainda não sincronizou.
        .catch(() => setSaveStatus('error'));
    }, AUTOSAVE_DEBOUNCE_MS);
  }, []);

  const update = useCallback(
    (patch: (m: Meeting) => Meeting) => {
      setMeeting((prev) => {
        if (!prev) return prev;
        const next = patch(prev);
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  /** Flush immediately, bypassing the debounce — used right before navigating away. */
  const flush = useCallback(async () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    setMeeting((prev) => {
      if (prev) {
        meetingStore
          .saveMeeting(prev)
          .then(() => setSaveStatus('saved'))
          .catch(() => setSaveStatus('error'));
      }
      return prev;
    });
  }, []);

  return { meeting, loading, saveStatus, update, flush };
}

/** Meeting list for the "Reuniões" area. */
export function useMeetingsList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    meetingStore.listMeetings().then((all) => {
      setMeetings(all);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { meetings, loading, refresh };
}

/** Creates a meeting and persists it immediately, so the id in the URL
 *  (`/scripts/:productId/call/:meetingId`) always resolves to a real record —
 *  including on the very first render of Modo Call. */
export async function startMeeting(productId: ProductId, setup: MeetingSetupInfo): Promise<Meeting> {
  const meeting = createMeeting(productId, setup);
  try {
    await meetingStore.saveMeeting(meeting);
  } catch (err) {
    // Preservado localmente pelo store (ver resilientStore.ts) — a call
    // nunca é bloqueada por uma falha de sincronização com a nuvem; o
    // autosave do Modo Call vai tentar de novo e mostrar o status.
    console.error('[useMeetingStore] falha ao criar reunião na nuvem — seguindo com backup local', err instanceof Error ? err.message : '(erro desconhecido)');
  }
  return meeting;
}
