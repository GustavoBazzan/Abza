import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** null until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (see .env.example).
 *  Never throws — src/store/index.ts checks this and falls back to
 *  localStorage automatically when it's null. */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;
