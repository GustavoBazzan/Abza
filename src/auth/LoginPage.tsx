import { useState, type FormEvent } from 'react';
import { Symbol } from '../components/Brand';
import { Button } from '../components/Button';

interface LoginPageProps {
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
}

/** Login-only — não há cadastro público. Contas são criadas manualmente
 *  pela ABZA no Supabase Dashboard (ver instruções entregues junto com a
 *  implementação). */
export function LoginPage({ onSignIn }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const { error } = await onSignIn(email.trim(), password);
    if (error) setError(error);
    setSubmitting(false);
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <Symbol size={36} color="var(--abza-red)" />
        <div className="login-heading">
          <h1 className="login-title">ABZA Sales Playbook</h1>
          <p className="login-subtitle">Acesso restrito ao time comercial ABZA.</p>
        </div>

        <label className="login-field">
          <span>E-mail</span>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </label>
        <label className="login-field">
          <span>Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
