import { useEffect, useState } from 'react';
import { getScript, type ResponseOption } from '../data/scripts';
import type { MeetingSession } from './useMeetingSession';
import { TechniqueCallout } from './TechniqueCallout';
import { NotesDrawer } from './NotesDrawer';
import { QuickHelpDrawer } from './QuickHelpDrawer';
import { ExitChecklist } from './ExitChecklist';

interface CallModeProps {
  scriptId: string;
  navigate: (path: string) => void;
  session: MeetingSession;
}

function ResponseOptionPicker({ options, selected, onSelect }: { options: ResponseOption[]; selected?: string; onSelect: (label: string) => void }) {
  const active = options.find((o) => o.label === selected);
  return (
    <div className="call-block">
      <div className="call-response-grid">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            className={`call-response-option${o.label === selected ? ' active' : ''}`}
            onClick={() => onSelect(o.label)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="call-response-guidance">
          <p>{active.guidance}</p>
        </div>
      )}
    </div>
  );
}

export function CallMode({ scriptId, navigate, session }: CallModeProps) {
  const script = getScript(scriptId);
  const { meeting } = session;

  useEffect(() => {
    if (!meeting || meeting.scriptId !== scriptId || meeting.endedAt) {
      session.start(scriptId);
    }
    // Only re-run when the target script changes, not on every meeting update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptId]);

  const [notesOpen, setNotesOpen] = useState(false);
  const [quickHelpOpen, setQuickHelpOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const anyDrawerOpen = notesOpen || quickHelpOpen || checklistOpen;
  useEffect(() => {
    if (!anyDrawerOpen) return;
    const scrollY = window.scrollY;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, [anyDrawerOpen]);

  if (!script) {
    return (
      <div className="meeting-shell">
        <p className="meeting-empty-state">Script não encontrado.</p>
        <button type="button" className="meeting-back-link" onClick={() => navigate('/scripts')}>← Voltar</button>
      </div>
    );
  }

  if (!meeting || meeting.scriptId !== scriptId || meeting.endedAt) return null;

  const stepIndex = Math.min(meeting.currentStepIndex, script.steps.length - 1);
  const step = script.steps[stepIndex];
  const total = script.steps.length;
  const isLast = stepIndex === total - 1;

  function goNext() {
    if (isLast) {
      setChecklistOpen(true);
      return;
    }
    setCheckedQuestions({});
    session.goToStep(stepIndex + 1);
  }
  function goPrev() {
    if (stepIndex === 0) return;
    setCheckedQuestions({});
    session.goToStep(stepIndex - 1);
  }
  function endMeeting() {
    session.end();
    navigate(`/scripts/${scriptId}/resumo`);
  }

  return (
    <div className="call-mode">
      <header className="call-topbar">
        <button type="button" className="call-exit-btn" aria-label="Sair da reunião" onClick={() => navigate(`/scripts/${scriptId}`)}>✕</button>
        <div className="call-progress-wrap">
          <div className="call-progress-label">Etapa {stepIndex + 1} de {total}</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${((stepIndex + 1) / total) * 100}%` }} />
          </div>
        </div>
        <div className="call-topbar-actions">
          <button type="button" className="call-tool-btn" onClick={() => setQuickHelpOpen(true)}>Aconteceu na call</button>
          <button type="button" className="call-tool-btn" onClick={() => setNotesOpen(true)}>Notas</button>
        </div>
      </header>

      <main className="call-body">
        <div className="call-step-kicker">{script.title}</div>
        <h2 className="call-step-title">{step.title}</h2>

        <div className="call-block">
          <span className="call-block-label">Objetivo desta etapa</span>
          <p className="call-objective-text">{step.objective}</p>
        </div>

        {step.responseOptions && (
          <ResponseOptionPicker
            options={step.responseOptions}
            selected={meeting.selectedResponseOption}
            onSelect={session.setResponseOption}
          />
        )}

        {step.questions && step.questions.length > 0 && (
          <div className="call-block">
            <span className="call-block-label">Perguntas sugeridas</span>
            <div className="call-question-list">
              {step.questions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  className={`call-question${checkedQuestions[i] ? ' checked' : ''}`}
                  onClick={() => setCheckedQuestions((c) => ({ ...c, [i]: !c[i] }))}
                >
                  <span className="call-question-box">{checkedQuestions[i] ? '✓' : ''}</span>
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step.watchFor && step.watchFor.length > 0 && (
          <div className="call-block soft">
            <span className="call-block-label">O que observar</span>
            <ul className="call-watchfor-list">
              {step.watchFor.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </div>
        )}

        {step.technique && (
          <TechniqueCallout technique={step.technique} navigate={navigate} onView={session.markTechniqueViewed} />
        )}

        {step.nextMove && (
          <div className="call-nextmove"><span className="arrow">→</span>{step.nextMove}</div>
        )}
      </main>

      <footer className="call-footer">
        <button type="button" className="call-nav-btn" onClick={goPrev} disabled={stepIndex === 0}>← Etapa anterior</button>
        {isLast ? (
          <button type="button" className="call-nav-btn primary" onClick={() => setChecklistOpen(true)}>Checklist de saída →</button>
        ) : (
          <button type="button" className="call-nav-btn primary" onClick={goNext}>Próxima etapa →</button>
        )}
      </footer>

      {notesOpen && <NotesDrawer session={session} onClose={() => setNotesOpen(false)} />}
      {quickHelpOpen && (
        <QuickHelpDrawer navigate={navigate} onView={session.markTechniqueViewed} onClose={() => setQuickHelpOpen(false)} />
      )}
      {checklistOpen && (
        <ExitChecklist
          checklist={meeting.checklist}
          onToggle={session.toggleChecklist}
          onClose={() => setChecklistOpen(false)}
          onEnd={endMeeting}
        />
      )}
    </div>
  );
}
