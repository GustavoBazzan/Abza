import type { MouseEvent } from 'react';
import { computeCopilotStatus, type Meeting } from '../data/meeting';

interface CopilotPanelProps {
  meeting: Meeting;
  onClose: () => void;
}

export function CopilotPanel({ meeting, onClose }: CopilotPanelProps) {
  function stop(e: MouseEvent) { e.stopPropagation(); }
  const fields = computeCopilotStatus(meeting);
  const known = fields.filter((f) => f.known);
  const missing = fields.filter((f) => !f.known);

  return (
    <div className="modal-overlay drawer" onClick={onClose}>
      <div className="copilot-panel" onClick={stop}>
        <div className="notes-drawer-head">
          <h3>ABZA Copilot</h3>
          <button type="button" className="modal-close" aria-label="Fechar" onClick={onClose}>✕</button>
        </div>

        <div className="copilot-body">
          <div className="copilot-placeholder">Copilot será ativado em uma próxima etapa. Por enquanto, veja abaixo o que já conseguimos identificar sem IA.</div>

          {meeting.objections.length > 0 && (
            <div className="call-block soft">
              <span className="call-block-label">Objeções registradas nesta call</span>
              <ul className="call-watchfor-list">
                {meeting.objections.map((o) => <li key={o.id}>{o.type}{o.clientResponse ? ` — ${o.clientResponse}` : ''}</li>)}
              </ul>
            </div>
          )}

          <div className="copilot-status">
            <span className="call-block-label">Informações identificadas</span>
            <div className="copilot-field-list">
              {known.map((f) => (
                <div className="copilot-field known" key={f.label}><span>✅</span>{f.label}</div>
              ))}
            </div>
          </div>

          {missing.length > 0 && (
            <div className="copilot-status">
              <span className="call-block-label">Ainda precisamos descobrir</span>
              <div className="copilot-field-list">
                {missing.map((f) => (
                  <div className="copilot-field missing" key={f.label}><span>❌</span>{f.label}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
