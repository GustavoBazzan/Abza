import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;

// Supabase's current-generation client-safe key is the "publishable" key
// (sb_publishable_...), replacing the legacy JWT-based "anon" key. Both are
// safe to ship in a browser bundle (that's the whole point of this key
// class — never a secret/service_role key). We prefer the new name and
// silently accept the old one too, so an already-configured
// VITE_SUPABASE_ANON_KEY keeps working without forcing an env var rename
// the moment this ships — see .env.example for the current guidance.
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

/** null until VITE_SUPABASE_URL and a client-safe key are set (see .env.example).
 *  Never throws — src/store/index.ts checks this and falls back to
 *  localStorage automatically when it's null. */
export const supabase: SupabaseClient | null = url && publishableKey ? createClient(url, publishableKey) : null;
