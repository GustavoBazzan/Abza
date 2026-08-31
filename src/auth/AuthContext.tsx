import { useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../store/supabaseClient';
import { AuthContext, type AuthContextValue } from './authContext';

const GENERIC_ERROR = 'Não foi possível entrar. Verifique e-mail e senha e tente novamente.';

function translateAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'E-mail ou senha incorretos.';
  if (/email not confirmed/i.test(message)) return 'Este e-mail ainda não foi confirmado — verifique sua caixa de entrada.';
  if (/too many requests/i.test(message)) return 'Muitas tentativas em pouco tempo. Aguarde um instante e tente novamente.';
  return GENERIC_ERROR;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authEnabled = !!supabase;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(authEnabled);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'Autenticação não configurada neste ambiente.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translateAuthError(error.message) };
    return { error: null };
  }

  async function signOut(): Promise<void> {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  const value: AuthContextValue = {
    authEnabled,
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
