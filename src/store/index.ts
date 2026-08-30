import { supabase } from './supabaseClient';
import { createSupabaseStore } from './supabaseStore';
import { createLocalStorageStore } from './localStorageStore';
import type { MeetingStore } from './types';

// Automatic backend selection: if VITE_SUPABASE_URL and a client-safe key
// (VITE_SUPABASE_PUBLISHABLE_KEY, or legacy VITE_SUPABASE_ANON_KEY) are set,
// use Supabase; otherwise fall back to localStorage so the app keeps
// working with zero configuration. See .env.example and
// supabase/migrations/ to switch this over for real.
export const meetingStore: MeetingStore = supabase ? createSupabaseStore(supabase) : createLocalStorageStore();

export type { MeetingStore } from './types';
