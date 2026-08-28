import type { MouseEvent } from 'react';
import { EXIT_CHECKLIST } from '../data/scripts';

interface ExitChecklistProps {
  checklist: Record<string, boolean>;
  onToggle: (id: string) => void;
  onClose: () => void;
  onEnd: () => void;
}

export function ExitChecklist({ checklist, onToggle, onClose, onEnd }: ExitChecklistProps) {
  function stop(e: MouseEvent) { e.stopPropagation(); }
  const missingCritical = EXIT_CHECKLIST.filter((i) => i.critical && !checklist[i.id]);

  return (
    <div className="modal-overlay center" onClick={onClose}>
      <div className="exit-checklist-modal" onClick={stop}>
        <div className="notes-drawer-head">
          <h3>Não saia da call sem isso</h3>
          <button type="button" className="modal-close" aria-label="Fechar" onClick={onClose}>✕</button>
        </div>

        <div className="exit-checklist-body">
          {missingCritical.length > 0 && (
            <div className="exit-checklist-warning">
              Faltam {missingCritical.length} ponto{missingCritical.length > 1 ? 's' : ''} crítico{missingCritical.length > 1 ? 's' : ''} antes de encerrar.
            </div>
          )}

          <div className="exit-checklist-list">
            {EXIT_CHECKLIST.map((item) => {
              const on = !!checklist[item.id];
              const critical = !!item.critical && !on;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`exit-checklist-row${critical ? ' critical' : ''}`}
                  onClick={() => onToggle(item.id)}
                >
                  <span className={`checklist-box${on ? ' on' : ''}`}>{on ? '✓' : ''}</span>
                  <span className={`checklist-label${on ? ' on' : ''}`}>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button type="button" className="meeting-start-btn" onClick={onEnd}>
            Encerrar reunião →
          </button>
        </div>
      </div>
    </div>
  );
}
