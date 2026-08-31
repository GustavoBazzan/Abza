import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthContextValue {
  /** false when Supabase isn't configured (see supabaseClient.ts) — matches
   *  the app's existing "never crash without env vars" philosophy: with no
   *  auth backend to check against, auth is simply not enforced rather than
   *  locking the app out. Configure VITE_SUPABASE_URL/PUBLISHABLE_KEY to
   *  actually require login. */
  authEnabled: boolean;
  session: Session | null;
  user: User | null;
  /** true only while the initial session is being read on first load. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
