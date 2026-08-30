/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  /** Current Supabase client-safe key name (sb_publishable_...). Preferred. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  /** Legacy Supabase client-safe key name (JWT-based anon key). Still accepted as a fallback. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
