import type { Meeting } from '../data/meeting';
import type { MeetingStore } from './types';

// v1 of the *current* meeting data model. The previous "Scripts de Reunião"
// iteration stored a single meeting-type-based Meeting under
// `abza-meeting-session-v1` — that shape is incompatible with this one
// (products vs. meeting-types, no `answers`/`qualification`/`diagnosis`...),
// so we deliberately do NOT try to migrate it. It's dropped once, safely,
// the first time this module loads, so old data can never crash a JSON.parse
// here or downstream.
const CURRENT_KEY = 'abza-meetings-v1';
const LEGACY_KEYS = ['abza-meeting-session-v1'];

let legacyCleanupDone = false;
function cleanupLegacyKeysOnce() {
  if (legacyCleanupDone) return;
  legacyCleanupDone = true;
  try {
    for (const key of LEGACY_KEYS) localStorage.removeItem(key);
  } catch {
    /* localStorage unavailable */
  }
}

function readAll(): Meeting[] {
  cleanupLegacyKeysOnce();
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Meeting[]) : [];
  } catch {
    return [];
  }
}

function writeAll(meetings: Meeting[]) {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(meetings));
  } catch {
    /* localStorage unavailable (private mode / quota) — in-memory only for this tab */
  }
}

export function createLocalStorageStore(): MeetingStore {
  return {
    backend: 'localStorage',
    async listMeetings() {
      return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async getMeeting(id) {
      return readAll().find((m) => m.id === id) ?? null;
    },
    async saveMeeting(meeting) {
      const all = readAll();
      const idx = all.findIndex((m) => m.id === meeting.id);
      const withTimestamp = { ...meeting, updatedAt: new Date().toISOString() };
      if (idx >= 0) all[idx] = withTimestamp;
      else all.push(withTimestamp);
      writeAll(all);
    },
    async deleteMeeting(id) {
      writeAll(readAll().filter((m) => m.id !== id));
    },
  };
}
