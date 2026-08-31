import { useCallback, useRef, useState } from 'react';
import type { Meeting } from '../data/meeting';
import type { CopilotAnalysisRecord, CopilotTrigger } from '../knowledge/copilotAnalysis';
import type { CopilotSuggestion } from '../knowledge/copilotSuggestion';
import { useAuth } from '../auth/useAuth';

export type CopilotStatus = 'idle' | 'loading' | 'success' | 'error';

interface CopilotApiErrorBody {
  error?: { code?: string; message?: string };
}

interface CopilotApiSuccessBody {
  suggestion?: CopilotSuggestion;
  /** Nome do modelo que gerou a sugestão (ex.: "gpt-5.6-terra") — não é
   *  secreto, só metadado para o histórico persistido (ver
   *  meeting_copilot_insights.model). */
  model?: string | null;
}

function newAnalysisId(): string {
  return `ins_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Fala com POST /api/copilot e mantém o estado de uma análise em andamento.
 *  Nunca bloqueia a call: erro de rede, timeout ou IA indisponível só afeta
 *  este painel — o roteiro continua totalmente utilizável sem IA. */
export function useCopilotAnalysis(update: (patch: (m: Meeting) => Meeting) => void) {
  const { authEnabled, session } = useAuth();
  const [status, setStatus] = useState<CopilotStatus>('idle');
  const [suggestion, setSuggestion] = useState<CopilotSuggestion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const analyze = useCallback(
    async (meeting: Meeting, trigger: CopilotTrigger, stageId: string) => {
      if (inFlightRef.current) return;

      // Sem sessão ativa (login obrigatório neste deployment), nem tentamos
      // chamar a API: o back-end recusaria com 401 mesmo assim, mas evitar a
      // chamada aqui poupa uma viagem de rede e dá um erro mais claro. A
      // call/roteiro em si nunca é bloqueada — só este painel fica indisponível.
      if (authEnabled && !session) {
        setStatus('error');
        setErrorMessage('Sua sessão expirou. Faça login novamente para usar o Copilot.');
        return;
      }

      inFlightRef.current = true;
      setStatus('loading');
      setErrorMessage(null);

      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }

        const res = await fetch('/api/copilot', {
          method: 'POST',
          headers,
          body: JSON.stringify({ meeting }),
        });

        const data = (await res.json().catch(() => null)) as (CopilotApiErrorBody & CopilotApiSuccessBody) | null;

        if (!res.ok || !data?.suggestion) {
          setStatus('error');
          setErrorMessage(data?.error?.message || 'Não foi possível analisar agora.');
          return;
        }

        setSuggestion(data.suggestion);
        setStatus('success');

        const record: CopilotAnalysisRecord = {
          id: newAnalysisId(),
          meetingId: meeting.id,
          timestamp: new Date().toISOString(),
          stageId,
          questionId: null, // Modo Call ainda não rastreia "pergunta em foco" separadamente da etapa
          trigger,
          source: 'ai',
          model: data.model ?? null,
          suggestion: data.suggestion,
        };
        update((m) => ({ ...m, copilotHistory: [...(m.copilotHistory ?? []), record] }));
      } catch {
        setStatus('error');
        setErrorMessage('Não foi possível conectar ao Copilot agora.');
      } finally {
        inFlightRef.current = false;
      }
    },
    [update, authEnabled, session],
  );

  return { status, suggestion, errorMessage, analyze };
}
