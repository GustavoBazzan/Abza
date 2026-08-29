import { useState, type MouseEvent } from 'react';
import { TECH } from '../data/content';
import { computeCopilotStatus, type Meeting } from '../data/meeting';
import type { CopilotSuggestion } from '../knowledge/copilotSuggestion';
import type { CopilotStatus } from './useCopilot';
import { TechniqueCallout } from './TechniqueCallout';

interface CopilotPanelProps {
  meeting: Meeting;
  isOpen: boolean;
  onClose: () => void;
  status: CopilotStatus;
  suggestion: CopilotSuggestion | null;
  errorMessage: string | null;
  onAnalyzeNow: () => void;
  navigate: (path: string) => void;
  onViewTechnique: (num: string) => void;
}

const MOVE_LABEL: Record<CopilotSuggestion['recommendedMove'], string> = {
  continue_diagnosis: 'Continuar diagnosticando',
  validate_diagnosis: 'Validar o diagnóstico com o cliente',
  present_solution: 'Apresentar a solução',
  present_price: 'Apresentar o investimento',
  handle_objection: 'Tratar a objeção',
  close: 'Tentar o fechamento',
  schedule_followup: 'Marcar o próximo passo',
};

const STATUS_LABEL: Record<CopilotStatus, string> = {
  idle: '',
  loading: 'Analisando…',
  success: 'Insight atualizado',
  error: 'Erro ao analisar',
};

/** Resolve o texto de técnica devolvido pela IA contra o catálogo real do
 *  Playbook — a IA deve usar exatamente nome ou número de `tecnicasDisponiveis`,
 *  mas nunca confiamos cegamente: sem correspondência, cai no fallback textual. */
function resolveTechnique(recommended: string | null) {
  if (!recommended) return null;
  const value = recommended.trim();
  const norm = value.toLowerCase();
  return (
    TECH.find((t) => t.num === value) ||
    TECH.find((t) => t.nome.toLowerCase() === norm) ||
    TECH.find((t) => norm.includes(t.nome.toLowerCase())) ||
    TECH.find((t) => norm.startsWith(t.num)) ||
    null
  );
}

export function CopilotPanel({
  meeting,
  isOpen,
  onClose,
  status,
  suggestion,
  errorMessage,
  onAnalyzeNow,
  navigate,
  onViewTechnique,
}: CopilotPanelProps) {
  const [copied, setCopied] = useState(false);
  function stop(e: MouseEvent) {
    e.stopPropagation();
  }

  const fields = computeCopilotStatus(meeting);
  const matchedTechnique = resolveTechnique(suggestion?.recommendedTechnique ?? null);

  function copyQuestion() {
    if (!suggestion?.nextQuestion) return;
    try {
      navigator.clipboard.writeText(suggestion.nextQuestion);
    } catch {
      /* clipboard indisponível — sem crash */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <div className={`copilot-sidebar-backdrop${isOpen ? ' open' : ''}`} onClick={onClose} />
      <aside className={`copilot-sidebar${isOpen ? ' open' : ''}`} aria-label="ABZA Copilot" onClick={stop}>
        <div className="notes-drawer-head">
          <h3>ABZA Copilot</h3>
          <button type="button" className="modal-close copilot-close-btn" aria-label="Fechar" onClick={onClose}>✕</button>
        </div>

        <div className="copilot-body">
          <div className="copilot-toolbar">
            <button type="button" className="call-tool-btn" onClick={onAnalyzeNow} disabled={status === 'loading'}>
              Analisar agora
            </button>
            {status !== 'idle' && <span className={`copilot-status-line status-${status}`}>{STATUS_LABEL[status]}</span>}
          </div>

          {status === 'error' && (
            <div className="call-block warn">
              <p className="copilot-note-text">{errorMessage || 'Não foi possível analisar agora.'}</p>
              <button type="button" className="meeting-back-link" onClick={onAnalyzeNow}>Tentar novamente</button>
            </div>
          )}

          {!suggestion && status !== 'error' && (
            <div className="copilot-placeholder">
              {status === 'loading'
                ? 'Analisando o momento da reunião…'
                : 'Toque em "Analisar agora" para um insight — o Copilot também analisa sozinho em alguns momentos-chave da call.'}
            </div>
          )}

          {suggestion && (
            <>
              <div className="call-block">
                <span className="call-block-label">Agora</span>
                <p className="call-objective-text">{MOVE_LABEL[suggestion.recommendedMove]}</p>
                <p className="copilot-note-text">{suggestion.summary}</p>
              </div>

              {suggestion.nextQuestion && (
                <div className="call-block">
                  <span className="call-block-label">Pergunte</span>
                  <p className="quickhelp-next-question">"{suggestion.nextQuestion}"</p>
                  <button type="button" className="call-tool-btn" onClick={copyQuestion}>
                    {copied ? 'Copiado ✓' : 'Copiar pergunta'}
                  </button>
                </div>
              )}

              <div className="call-block">
                <span className="call-block-label">Por quê</span>
                <p className="copilot-note-text">{suggestion.why}</p>
              </div>

              <div className="call-block">
                <span className="call-block-label">Ainda precisamos descobrir</span>
                <div className="copilot-field-list">
                  {fields.map((f) => (
                    <div className={`copilot-field ${f.known ? 'known' : 'missing'}`} key={f.label}>
                      <span>{f.known ? '✓' : '✕'}</span>{f.label}
                    </div>
                  ))}
                </div>
                {suggestion.missingInformation.length > 0 && (
                  <ul className="call-watchfor-list copilot-ai-missing-list">
                    {suggestion.missingInformation.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                )}
              </div>

              {suggestion.alert && (
                <div className="call-block warn">
                  <span className="call-block-label">Alerta</span>
                  <p className="copilot-note-text">{suggestion.alert}</p>
                </div>
              )}

              {matchedTechnique ? (
                <TechniqueCallout
                  technique={{ techniqueNum: matchedTechnique.num, guidance: suggestion.why }}
                  navigate={navigate}
                  onView={onViewTechnique}
                />
              ) : (
                suggestion.recommendedTechnique && (
                  <div className="call-block soft">
                    <span className="call-block-label">Técnica recomendada</span>
                    <p className="copilot-note-text">{suggestion.recommendedTechnique}</p>
                  </div>
                )
              )}

              {suggestion.doNotDo && (
                <div className="call-block warn">
                  <span className="call-block-label">Evite agora</span>
                  <p className="copilot-note-text">{suggestion.doNotDo}</p>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
