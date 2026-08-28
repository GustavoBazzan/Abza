import { useCallback, useEffect, useState } from 'react';
import { createMeeting, type Meeting, type MeetingNotes, type ObjectionFlag } from '../data/scripts';

// Local-storage backed today. Every mutation goes through a single setMeeting
// call with a plain-object patch, so swapping the persistence layer for a
// real backend later means changing load/save here — the components and
// their call sites never need to change.

const STORAGE_KEY = 'abza-meeting-session-v1';

function loadMeeting(): Meeting | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Meeting) : null;
  } catch {
    return null;
  }
}

function saveMeeting(meeting: Meeting | null) {
  try {
    if (meeting) localStorage.setItem(STORAGE_KEY, JSON.stringify(meeting));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* localStorage unavailable (private mode / quota) — session stays in-memory only */
  }
}

export interface MeetingSession {
  meeting: Meeting | null;
  start: (scriptId: string) => Meeting;
  goToStep: (index: number) => void;
  updateNotes: (patch: Partial<MeetingNotes>) => void;
  toggleObjection: (flag: ObjectionFlag) => void;
  markTechniqueViewed: (num: string) => void;
  toggleChecklist: (id: string) => void;
  setResponseOption: (label: string) => void;
  end: () => void;
  reset: () => void;
}

export function useMeetingSession(): MeetingSession {
  const [meeting, setMeeting] = useState<Meeting | null>(() => loadMeeting());

  useEffect(() => {
    saveMeeting(meeting);
  }, [meeting]);

  const start = useCallback((scriptId: string) => {
    const m = createMeeting(scriptId);
    setMeeting(m);
    return m;
  }, []);

  const goToStep = useCallback((index: number) => {
    setMeeting((m) => (m ? { ...m, currentStepIndex: index } : m));
  }, []);

  const updateNotes = useCallback((patch: Partial<MeetingNotes>) => {
    setMeeting((m) => (m ? { ...m, notes: { ...m.notes, ...patch } } : m));
  }, []);

  const toggleObjection = useCallback((flag: ObjectionFlag) => {
    setMeeting((m) => {
      if (!m) return m;
      const has = m.notes.objections.includes(flag);
      const objections = has ? m.notes.objections.filter((o) => o !== flag) : [...m.notes.objections, flag];
      return { ...m, notes: { ...m.notes, objections } };
    });
  }, []);

  const markTechniqueViewed = useCallback((num: string) => {
    setMeeting((m) => {
      if (!m || m.techniquesViewed.includes(num)) return m;
      return { ...m, techniquesViewed: [...m.techniquesViewed, num] };
    });
  }, []);

  const toggleChecklist = useCallback((id: string) => {
    setMeeting((m) => (m ? { ...m, checklist: { ...m.checklist, [id]: !m.checklist[id] } } : m));
  }, []);

  const setResponseOption = useCallback((label: string) => {
    setMeeting((m) => (m ? { ...m, selectedResponseOption: label } : m));
  }, []);

  const end = useCallback(() => {
    setMeeting((m) => (m ? { ...m, endedAt: new Date().toISOString() } : m));
  }, []);

  const reset = useCallback(() => setMeeting(null), []);

  return { meeting, start, goToStep, updateNotes, toggleObjection, markTechniqueViewed, toggleChecklist, setResponseOption, end, reset };
}
