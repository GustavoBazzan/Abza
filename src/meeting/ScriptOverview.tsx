import { getScript } from '../data/scripts';

interface ScriptOverviewProps {
  scriptId: string;
  navigate: (path: string) => void;
  onStart: (scriptId: string) => void;
}

export function ScriptOverview({ scriptId, navigate, onStart }: ScriptOverviewProps) {
  const script = getScript(scriptId);
  if (!script) {
    return (
      <div className="meeting-shell">
        <p className="meeting-empty-state">Script não encontrado.</p>
        <button type="button" className="meeting-back-link" onClick={() => navigate('/scripts')}>← Voltar</button>
      </div>
    );
  }

  return (
    <div className="meeting-shell">
      <button type="button" className="meeting-back-link" onClick={() => navigate('/scripts')}>← Scripts de Reunião</button>

      <div className="meeting-overview-head">
        <h1 className="meeting-overview-title">{script.title}</h1>
        <p className="meeting-overview-objective">{script.objective}</p>
      </div>

      <ol className="meeting-overview-steps">
        {script.steps.map((step, i) => (
          <li key={step.id} className="meeting-overview-step">
            <span className="meeting-overview-step-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="meeting-overview-step-title">{step.title}</span>
          </li>
        ))}
      </ol>

      <button type="button" className="meeting-start-btn" onClick={() => onStart(script.id)}>
        Iniciar reunião →
      </button>
    </div>
  );
}
