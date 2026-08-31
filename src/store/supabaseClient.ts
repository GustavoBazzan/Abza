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
 *  Never throws — src/store/index.ts and src/auth/AuthContext.tsx both check
 *  this and fall back to (respectively) localStorage and "auth disabled"
 *  automatically when it's null. */
export const supabase: SupabaseClient | null =
  url && publishableKey
    ? createClient(url, publishableKey, {
        auth: {
          // Explicit even though these are the client's own defaults — this
          // is exactly the persistence Supabase Auth needs (session survives
          // reload/new tab via localStorage, refreshed automatically before
          // it expires). detectSessionInUrl is off: this app has no OAuth/
          // magic-link redirect flow, only email+password.
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : null;
