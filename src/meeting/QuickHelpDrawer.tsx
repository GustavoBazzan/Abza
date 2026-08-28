import { useState, type MouseEvent } from 'react';
import { QUICK_HELP } from '../data/scripts';
import { TechniqueCallout } from './TechniqueCallout';

interface QuickHelpDrawerProps {
  navigate: (path: string) => void;
  onView: (num: string) => void;
  onClose: () => void;
}

export function QuickHelpDrawer({ navigate, onView, onClose }: QuickHelpDrawerProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  function stop(e: MouseEvent) { e.stopPropagation(); }
  const active = QUICK_HELP.find((q) => q.id === openId);

  return (
    <div className="modal-overlay drawer" onClick={onClose}>
      <div className="quickhelp-drawer" onClick={stop}>
        <div className="notes-drawer-head">
          <h3>Aconteceu na call</h3>
          <button type="button" className="modal-close" aria-label="Fechar" onClick={onClose}>✕</button>
        </div>

        {!active ? (
          <div className="quickhelp-list">
            {QUICK_HELP.map((q) => (
              <button key={q.id} type="button" className="quickhelp-item" onClick={() => setOpenId(q.id)}>
                {q.situation}
              </button>
            ))}
          </div>
        ) : (
          <div className="quickhelp-detail">
            <button type="button" className="meeting-back-link" onClick={() => setOpenId(null)}>← Outras situações</button>
            <h4 className="quickhelp-detail-title">{active.situation}</h4>

            <div className="call-block soft">
              <span className="call-block-label">O que provavelmente está acontecendo</span>
              <ul className="call-watchfor-list">
                {active.whatsHappening.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>

            <div className="call-block warn">
              <span className="call-block-label">O que NÃO fazer</span>
              <ul className="call-watchfor-list">
                {active.whatNotToDo.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>

            <div className="call-block">
              <span className="call-block-label">Próxima pergunta</span>
              <p className="quickhelp-next-question">"{active.nextQuestion}"</p>
            </div>

            {active.technique && (
              <TechniqueCallout technique={active.technique} navigate={navigate} onView={onView} label="Ver técnica completa" />
            )}

            <div className="call-block soft">
              <span className="call-block-label">Como conduzir</span>
              <ul className="call-watchfor-list">
                {active.howToConduct.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
