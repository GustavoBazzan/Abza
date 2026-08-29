import { useCallback, useRef, useState } from 'react';
import type { Meeting } from '../data/meeting';
import type { CopilotAnalysisRecord, CopilotTrigger } from '../knowledge/copilotAnalysis';
import type { CopilotSuggestion } from '../knowledge/copilotSuggestion';

export type CopilotStatus = 'idle' | 'loading' | 'success' | 'error';

interface CopilotApiErrorBody {
  error?: { code?: string; message?: string };
}

interface CopilotApiSuccessBody {
  suggestion?: CopilotSuggestion;
}

function newAnalysisId(): string {
  return `ins_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Fala com POST /api/copilot e mantém o estado de uma análise em andamento.
 *  Nunca bloqueia a call: erro de rede, timeout ou IA indisponível só afeta
 *  este painel — o roteiro continua totalmente utilizável sem IA. */
export function useCopilotAnalysis(update: (patch: (m: Meeting) => Meeting) => void) {
  const [status, setStatus] = useState<CopilotStatus>('idle');
  const [suggestion, setSuggestion] = useState<CopilotSuggestion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const analyze = useCallback(
    async (meeting: Meeting, trigger: CopilotTrigger, stageId: string) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setStatus('loading');
      setErrorMessage(null);

      try {
        const res = await fetch('/api/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
          trigger,
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
    [update],
  );

  return { status, suggestion, errorMessage, analyze };
}
