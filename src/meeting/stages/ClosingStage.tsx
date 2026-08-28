import type { ClosingInfo, ClosingOutcome, Meeting, Stage } from '../../data/meeting';
import { TechniqueCallout } from '../TechniqueCallout';

interface ClosingStageProps {
  stage: Stage;
  meeting: Meeting;
  update: (patch: (m: Meeting) => Meeting) => void;
  navigate: (path: string) => void;
  onViewTechnique: (num: string) => void;
}

const OUTCOMES: { id: ClosingOutcome; label: string }[] = [
  { id: 'fechou', label: 'Fechou' },
  { id: 'nao-fechou', label: 'Não fechou' },
  { id: 'follow-up', label: 'Follow-up' },
];

const NEXT_STEP_FIELDS: { key: keyof ClosingInfo; label: string }[] = [
  { key: 'lossReason', label: 'Motivo de não fechamento' },
  { key: 'pendingObjection', label: 'Objeção pendente' },
  { key: 'responsiblePerson', label: 'Pessoa responsável pela decisão' },
  { key: 'requiredAction', label: 'Ação necessária' },
  { key: 'nextStep', label: 'Próximo passo' },
  { key: 'nextStepDate', label: 'Data específica' },
  { key: 'nextStepOwner', label: 'Responsável pelo próximo contato' },
];

export function ClosingStage({ stage, meeting, update, navigate, onViewTechnique }: ClosingStageProps) {
  const c = meeting.closing;

  function setOutcome(outcome: ClosingOutcome) {
    update((m) => ({ ...m, closing: { ...m.closing, outcome } }));
  }
  function set(key: keyof ClosingInfo, value: string) {
    update((m) => ({ ...m, closing: { ...m.closing, [key]: value } }));
  }

  const needsNextStep = c.outcome === 'nao-fechou' || c.outcome === 'follow-up';
  const missingNextStep = needsNextStep && (!c.nextStep.trim() || !c.nextStepDate.trim());

  return (
    <>
      <div className="call-block">
        <span className="call-block-label">Como conduzir</span>
        <ul className="call-watchfor-list">
          <li>Valide a solução e confirme o fit</li>
          <li>Identifique a última objeção e isole antes de tratar</li>
          <li>Solicite a decisão — não pergunte "e aí, o que achou?"</li>
        </ul>
      </div>

      {stage.technique && <TechniqueCallout technique={stage.technique} navigate={navigate} onView={onViewTechnique} />}

      <div className="call-block">
        <span className="call-block-label">Resultado da reunião</span>
        <div className="closing-outcome-row">
          {OUTCOMES.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`call-response-option${c.outcome === o.id ? ' active' : ''}`}
              onClick={() => setOutcome(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {needsNextStep && (
        <>
          {missingNextStep && (
            <div className="exit-checklist-warning">Nunca encerre apenas com "me avisa" — preencha o próximo passo e a data antes de encerrar.</div>
          )}
          <div className="notes-field-grid">
            {NEXT_STEP_FIELDS.map((f) => (
              <label className="notes-field" key={f.key}>
                <span>{f.label}</span>
                <input type="text" value={c[f.key] as string} onChange={(e) => set(f.key, e.target.value)} />
              </label>
            ))}
          </div>
        </>
      )}

      {stage.nextMove && <div className="call-nextmove"><span className="arrow">→</span>{stage.nextMove}</div>}
    </>
  );
}
