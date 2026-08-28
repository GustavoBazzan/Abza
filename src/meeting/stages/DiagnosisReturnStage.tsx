import type { Meeting } from '../../data/meeting';

interface DiagnosisReturnStageProps {
  meeting: Meeting;
  update: (patch: (m: Meeting) => Meeting) => void;
  onEditDiagnosis: () => void;
}

export function DiagnosisReturnStage({ meeting, update, onEditDiagnosis }: DiagnosisReturnStageProps) {
  const d = meeting.diagnosis;
  const hasDiagnosis = d.centralProblem.trim() || d.impact.trim() || d.objective.trim();

  return (
    <>
      <div className="call-block soft">
        <span className="call-block-label">Antes de apresentar a solução, confirme se sua leitura está correta</span>
        <p className="diagnosis-return-script">
          "Pelo que eu entendi, hoje vocês estão enfrentando <strong>{d.centralProblem || '[problema]'}</strong>,
          isso está gerando <strong>{d.impact || '[impacto]'}</strong> e o objetivo de vocês é chegar em{' '}
          <strong>{d.objective || '[objetivo]'}</strong>. Faz sentido essa leitura?"
        </p>
        {!hasDiagnosis && (
          <button type="button" className="meeting-back-link" onClick={onEditDiagnosis}>← Preencher o diagnóstico primeiro</button>
        )}
      </div>

      <button
        type="button"
        className={`call-question${d.clientConfirmed ? ' checked' : ''}`}
        onClick={() => update((m) => ({ ...m, diagnosis: { ...m.diagnosis, clientConfirmed: !m.diagnosis.clientConfirmed } }))}
      >
        <span className="call-question-box">{d.clientConfirmed ? '✓' : ''}</span>
        <span>Cliente confirmou o diagnóstico</span>
      </button>

      <label className="notes-field full">
        <span>Observações</span>
        <textarea
          value={d.confirmationNotes}
          onChange={(e) => update((m) => ({ ...m, diagnosis: { ...m.diagnosis, confirmationNotes: e.target.value } }))}
          placeholder="O que o cliente corrigiu ou complementou na leitura..."
        />
      </label>

      <div className="call-nextmove"><span className="arrow">→</span>Se o cliente corrigir algo, volte e atualize o diagnóstico antes de continuar.</div>
    </>
  );
}
