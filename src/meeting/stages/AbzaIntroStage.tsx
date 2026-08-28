import type { Meeting } from '../../data/meeting';

const GUIDE = [
  'Abordagem — como a ABZA pensa esse tipo de projeto.',
  'Metodologia — as fases do processo, em uma frase cada.',
  'Experiência relevante — um case real e comparável, nunca genérico.',
  'Como resolve especificamente este problema — não um discurso institucional.',
];

export function AbzaIntroStage({ meeting }: { meeting: Meeting }) {
  const d = meeting.diagnosis;
  const hasDiagnosis = d.centralProblem.trim() || d.objective.trim();

  return (
    <>
      {hasDiagnosis && (
        <div className="call-block soft">
          <span className="call-block-label">Conecte com o diagnóstico</span>
          <p className="diagnosis-return-script">
            {d.centralProblem && <>Problema: <strong>{d.centralProblem}</strong>. </>}
            {d.objective && <>Objetivo: <strong>{d.objective}</strong>.</>}
          </p>
        </div>
      )}
      <div className="call-block">
        <span className="call-block-label">Apresente apenas isso</span>
        <ul className="call-watchfor-list">
          {GUIDE.map((g) => <li key={g}>{g}</li>)}
        </ul>
      </div>
      <div className="call-nextmove"><span className="arrow">→</span>Nada institucional. Tudo conectado ao que o cliente já disse.</div>
    </>
  );
}
