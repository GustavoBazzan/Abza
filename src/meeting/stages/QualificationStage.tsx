import type { CommercialQualification, Meeting, Stage } from '../../data/meeting';
import { TechniqueCallout } from '../TechniqueCallout';

interface QualificationStageProps {
  stage: Stage;
  meeting: Meeting;
  update: (patch: (m: Meeting) => Meeting) => void;
  navigate: (path: string) => void;
  onViewTechnique: (num: string) => void;
}

const FIELDS: { key: keyof CommercialQualification; label: string; placeholder?: string }[] = [
  { key: 'decisionMaker', label: 'Decisor' },
  { key: 'otherParticipants', label: 'Outros participantes da decisão' },
  { key: 'deadline', label: 'Prazo' },
  { key: 'urgency', label: 'Urgência' },
  { key: 'budgetRange', label: 'Budget / faixa de investimento' },
  { key: 'competitors', label: 'Concorrentes mencionados' },
  { key: 'otherVendors', label: 'Outros fornecedores avaliados' },
  { key: 'decisionCriteria', label: 'Critério de decisão' },
  { key: 'pastExperience', label: 'Experiências anteriores' },
  { key: 'constraints', label: 'Restrições' },
  { key: 'realChance', label: 'Possibilidade real de contratação' },
];

export function QualificationStage({ stage, meeting, update, navigate, onViewTechnique }: QualificationStageProps) {
  function set(key: keyof CommercialQualification, value: string) {
    update((m) => ({ ...m, qualification: { ...m.qualification, [key]: value } }));
  }

  return (
    <>
      <div className="notes-field-grid">
        {FIELDS.map((f) => (
          <label className="notes-field" key={f.key}>
            <span>{f.label}</span>
            <input type="text" value={meeting.qualification[f.key]} onChange={(e) => set(f.key, e.target.value)} />
          </label>
        ))}
      </div>
      {stage.technique && <TechniqueCallout technique={stage.technique} navigate={navigate} onView={onViewTechnique} />}
      {stage.nextMove && <div className="call-nextmove"><span className="arrow">→</span>{stage.nextMove}</div>}
    </>
  );
}
