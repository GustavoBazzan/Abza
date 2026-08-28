import type { CommercialDiagnosis, Meeting } from '../../data/meeting';

interface DiagnosisStageProps {
  meeting: Meeting;
  update: (patch: (m: Meeting) => Meeting) => void;
}

const FIELDS: { key: keyof CommercialDiagnosis; label: string }[] = [
  { key: 'centralProblem', label: 'Problema central' },
  { key: 'impact', label: 'Impacto' },
  { key: 'objective', label: 'Objetivo' },
  { key: 'mainOpportunity', label: 'Principal oportunidade' },
  { key: 'urgency', label: 'Urgência' },
  { key: 'fitWithAbza', label: 'Fit com ABZA' },
  { key: 'risks', label: 'Riscos' },
  { key: 'undiscovered', label: 'Pontos ainda não descobertos' },
];

const RECAP: { key: 'decisionMaker' | 'deadline' | 'budgetRange' | 'competitors'; label: string }[] = [
  { key: 'decisionMaker', label: 'Decisor' },
  { key: 'deadline', label: 'Prazo' },
  { key: 'budgetRange', label: 'Budget' },
  { key: 'competitors', label: 'Concorrência' },
];

export function DiagnosisStage({ meeting, update }: DiagnosisStageProps) {
  function set(key: keyof CommercialDiagnosis, value: string) {
    update((m) => ({ ...m, diagnosis: { ...m.diagnosis, [key]: value } }));
  }

  return (
    <>
      <div className="call-block soft">
        <span className="call-block-label">Já registrado na qualificação</span>
        <div className="diagnosis-recap-grid">
          {RECAP.map((r) => (
            <div className="diagnosis-recap-item" key={r.key}>
              <span>{r.label}</span>
              <strong>{meeting.qualification[r.key] || '—'}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="notes-field-grid">
        {FIELDS.map((f) => (
          <label className={`notes-field${f.key === 'centralProblem' || f.key === 'impact' || f.key === 'objective' ? ' full' : ''}`} key={f.key}>
            <span>{f.label}</span>
            <textarea value={meeting.diagnosis[f.key] as string} onChange={(e) => set(f.key, e.target.value)} rows={2} />
          </label>
        ))}
      </div>
    </>
  );
}
