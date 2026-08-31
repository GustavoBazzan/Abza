import { supabase } from './supabaseClient';
import { createSupabaseStore } from './supabaseStore';
import { createLocalStorageStore } from './localStorageStore';
import { withCloudBackup } from './resilientStore';
import type { MeetingStore } from './types';

// Automatic backend selection: if VITE_SUPABASE_URL and a client-safe key
// (VITE_SUPABASE_PUBLISHABLE_KEY, or legacy VITE_SUPABASE_ANON_KEY) are set,
// use Supabase — wrapped in withCloudBackup so a failed cloud write is never
// silently lost or silently reported as saved (see resilientStore.ts).
// Otherwise fall back to localStorage so the app keeps working with zero
// configuration. See .env.example and supabase/migrations/ to switch this
// over for real.
export const meetingStore: MeetingStore = supabase ? withCloudBackup(createSupabaseStore(supabase)) : createLocalStorageStore();

export type { MeetingStore } from './types';
export { CloudSaveFailedError } from './resilientStore';
