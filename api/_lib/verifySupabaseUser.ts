// Valida a sessão do Supabase Auth no servidor — sem service_role, só o
// mesmo client-safe key que o frontend já usa. É exatamente o padrão
// recomendado pela Supabase para verificar um usuário dentro de uma função
// serverless: `supabase.auth.getUser(jwt)` chama `/auth/v1/user` do
// projeto, que confere assinatura/expiração do token no servidor da
// Supabase e devolve o usuário — nunca confiamos em nada que o frontend
// apenas *diz* ser verdade.
//
// Reaproveita as MESMAS variáveis já configuradas para o frontend
// (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY). Variáveis com
// prefixo VITE_ continuam disponíveis via process.env em funções
// serverless da Vercel — o prefixo só controla o que o Vite embute no
// bundle do navegador, não limita o acesso no servidor. Por isso nenhuma
// variável de ambiente nova precisa ser configurada para este endpoint.
//
// Este arquivo fica em api/_lib/ (prefixo `_`) para a Vercel nunca tratá-lo
// como uma rota própria — é só código compartilhado.

import { createClient } from '@supabase/supabase-js';

export interface VerifiedUser {
  id: string;
  email: string | null;
}

export type VerifyAuthResult =
  | { ok: true; user: VerifiedUser }
  /** 'not_configured': Supabase Auth não está ativo neste deployment (sem
   *  VITE_SUPABASE_URL/KEY) — mesmo estado em que o frontend também não
   *  exige login (ver src/auth/AuthContext.tsx). 'missing_token': nenhum
   *  Authorization Bearer foi enviado. 'invalid_token': token presente mas
   *  a Supabase recusou (inválido, expirado, ou malformado). */
  | { ok: false; reason: 'not_configured' | 'missing_token' | 'invalid_token' };

function getSupabaseServerConfig(): { url: string; key: string } | null {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

/** Extrai o token de um header `Authorization: Bearer <token>`, ou null se ausente/mal formado. */
export function extractBearerToken(authHeader: string | string[] | undefined): string | null {
  const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  const token = match?.[1]?.trim();
  return token ? token : null;
}

/** Chama a Supabase para confirmar que o access token é de um usuário real
 *  e válido agora. Nunca loga o token em si — só o resultado. */
export async function verifySupabaseUser(authHeader: string | string[] | undefined): Promise<VerifyAuthResult> {
  const config = getSupabaseServerConfig();
  if (!config) return { ok: false, reason: 'not_configured' };

  const token = extractBearerToken(authHeader);
  if (!token) return { ok: false, reason: 'missing_token' };

  // persistSession/autoRefreshToken desligados: este client é descartável,
  // usado uma única vez por requisição, sem localStorage (nem existe em
  // Node) e sem nenhum timer de background — não pode ficar "pendurado"
  // numa função serverless.
  const client = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) return { ok: false, reason: 'invalid_token' };

  return { ok: true, user: { id: data.user.id, email: data.user.email ?? null } };
}
