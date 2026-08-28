import type { Meeting, Stage } from '../../data/meeting';
import { TechniqueCallout } from '../TechniqueCallout';

interface QuestionsStageProps {
  stage: Stage;
  meeting: Meeting;
  update: (patch: (m: Meeting) => Meeting) => void;
  navigate: (path: string) => void;
  onViewTechnique: (num: string) => void;
}

export function QuestionsStage({ stage, meeting, update, navigate, onViewTechnique }: QuestionsStageProps) {
  function setAnswer(questionId: string, value: string) {
    update((m) => ({
      ...m,
      answers: { ...m.answers, [questionId]: { value, source: 'manual', updatedAt: new Date().toISOString() } },
    }));
  }

  return (
    <>
      {(stage.questions ?? []).map((q) => {
        const answered = !!meeting.answers[q.id]?.value.trim();
        return (
          <div className="question-block" key={q.id}>
            <div className="question-block-head">
              <span className={`question-block-dot${answered ? ' done' : ''}`}>{answered ? '✓' : ''}</span>
              <p className="question-block-text">{q.text}</p>
            </div>
            <textarea
              className="question-answer"
              value={meeting.answers[q.id]?.value ?? ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              placeholder="Registre aqui os principais pontos da resposta…"
              rows={2}
            />
            {q.watchFor && q.watchFor.length > 0 && (
              <div className="question-watchfor">
                <span className="call-block-label">O que identificar nessa resposta</span>
                <ul className="call-watchfor-list">
                  {q.watchFor.map((w) => <li key={w}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      {stage.technique && (
        <TechniqueCallout technique={stage.technique} navigate={navigate} onView={onViewTechnique} />
      )}
      {stage.nextMove && (
        <div className="call-nextmove"><span className="arrow">→</span>{stage.nextMove}</div>
      )}
    </>
  );
}
