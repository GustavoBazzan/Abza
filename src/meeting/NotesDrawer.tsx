import type { MouseEvent } from 'react';
import { OBJECTION_OPTIONS, type MeetingNotes } from '../data/scripts';
import type { MeetingSession } from './useMeetingSession';

interface NotesDrawerProps {
  session: MeetingSession;
  onClose: () => void;
}

const TEXT_FIELDS: { key: keyof MeetingNotes; label: string }[] = [
  { key: 'client', label: 'Cliente' },
  { key: 'company', label: 'Empresa' },
  { key: 'owner', label: 'Responsável ABZA' },
  { key: 'mainPain', label: 'Dor principal' },
  { key: 'objective', label: 'Objetivo' },
  { key: 'urgency', label: 'Urgência' },
  { key: 'deadline', label: 'Prazo' },
  { key: 'budgetMentioned', label: 'Orçamento mencionado' },
  { key: 'decisionMaker', label: 'Decisor' },
  { key: 'competitorsMentioned', label: 'Concorrentes mencionados' },
];

export function NotesDrawer({ session, onClose }: NotesDrawerProps) {
  const notes = session.meeting?.notes;
  function stop(e: MouseEvent) { e.stopPropagation(); }
  if (!notes) return null;

  return (
    <div className="modal-overlay drawer" onClick={onClose}>
      <div className="notes-drawer" onClick={stop}>
        <div className="notes-drawer-head">
          <h3>Notas da call</h3>
          <button type="button" className="modal-close" aria-label="Fechar notas" onClick={onClose}>✕</button>
        </div>

        <div className="notes-drawer-body">
          <div className="notes-field-grid">
            {TEXT_FIELDS.map((f) => (
              <label className="notes-field" key={f.key}>
                <span>{f.label}</span>
                <input
                  type="text"
                  value={notes[f.key] as string}
                  onChange={(e) => session.updateNotes({ [f.key]: e.target.value })}
                />
              </label>
            ))}
          </div>

          <div className="notes-objections">
            <span className="call-block-label">Objeções</span>
            <div className="notes-objection-grid">
              {OBJECTION_OPTIONS.map((o) => {
                const checked = notes.objections.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={`notes-objection-chip${checked ? ' active' : ''}`}
                    onClick={() => session.toggleObjection(o.id)}
                  >
                    <span className="notes-objection-box">{checked ? '✓' : ''}</span>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="notes-field full">
            <span>Observações</span>
            <textarea
              value={notes.observations}
              onChange={(e) => session.updateNotes({ observations: e.target.value })}
              placeholder="Anotações livres sobre a call..."
            />
          </label>

          <div className="notes-field-grid">
            <label className="notes-field">
              <span>Próximo passo</span>
              <input type="text" value={notes.nextStep} onChange={(e) => session.updateNotes({ nextStep: e.target.value })} />
            </label>
            <label className="notes-field">
              <span>Data do próximo passo</span>
              <input type="text" value={notes.nextStepDate} onChange={(e) => session.updateNotes({ nextStepDate: e.target.value })} placeholder="dd/mm" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
