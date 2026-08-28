import { supabase } from './supabaseClient';
import { createSupabaseStore } from './supabaseStore';
import { createLocalStorageStore } from './localStorageStore';
import type { MeetingStore } from './types';

// Automatic backend selection: if VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// are set, use Supabase; otherwise fall back to localStorage so the app
// keeps working with zero configuration. See .env.example and
// supabase/schema.sql to switch this over for real.
export const meetingStore: MeetingStore = supabase ? createSupabaseStore(supabase) : createLocalStorageStore();

export type { MeetingStore } from './types';
