import type { Meeting, Stage } from '../../data/meeting';

interface SolutionStageProps {
  stage: Stage;
  meeting: Meeting;
  update: (patch: (m: Meeting) => Meeting) => void;
}

export function SolutionStage({ stage, meeting, update }: SolutionStageProps) {
  function setJustification(partId: string, value: string) {
    update((m) => ({
      ...m,
      answers: { ...m.answers, [partId]: { value, source: 'manual', updatedAt: new Date().toISOString() } },
    }));
  }

  return (
    <>
      {(stage.solutionParts ?? []).map((part, i) => (
        <div className="solution-part" key={part.id}>
          <div className="solution-part-head">
            <span className="solution-part-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="solution-part-title">{part.title}</span>
          </div>
          <div className="solution-part-why">
            <span className="call-block-label">Por que isso entra</span>
            <p>{part.whyItEnters}</p>
          </div>
          <label className="notes-field full">
            <span>Informação do cliente que justifica esta etapa</span>
            <textarea
              value={meeting.answers[part.id]?.value ?? ''}
              onChange={(e) => setJustification(part.id, e.target.value)}
              placeholder="Ex.: você comentou que..."
              rows={2}
            />
          </label>
        </div>
      ))}
      {stage.nextMove && <div className="call-nextmove"><span className="arrow">→</span>{stage.nextMove}</div>}
    </>
  );
}
