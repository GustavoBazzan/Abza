import type { Meeting } from '../data/meeting';

/** Repository contract for meeting persistence. Two implementations exist
 *  today (localStorage, Supabase); `src/store/index.ts` picks one at boot
 *  based on env vars. Components never talk to localStorage or Supabase
 *  directly — only to this interface, via `useMeetingStore`. */
export interface MeetingStore {
  readonly backend: 'localStorage' | 'supabase';
  listMeetings(): Promise<Meeting[]>;
  getMeeting(id: string): Promise<Meeting | null>;
  saveMeeting(meeting: Meeting): Promise<void>;
  deleteMeeting(id: string): Promise<void>;
}
