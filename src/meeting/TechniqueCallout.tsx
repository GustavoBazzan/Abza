import { TECH } from '../data/content';
import type { RecommendedTechnique } from '../data/scripts';

interface TechniqueCalloutProps {
  technique: RecommendedTechnique;
  navigate: (path: string) => void;
  onView?: (num: string) => void;
  /** shorter label used inside the call-mode step ("Ver técnica no Playbook") vs. drawers ("Ver técnica completa") */
  label?: string;
}

export function TechniqueCallout({ technique, navigate, onView, label = 'Ver técnica no Playbook' }: TechniqueCalloutProps) {
  const tech = TECH.find((t) => t.num === technique.techniqueNum);
  if (!tech) return null;

  function open() {
    onView?.(technique.techniqueNum);
    navigate(`/playbook/tecnica/${technique.techniqueNum}`);
  }

  return (
    <div className="tech-callout">
      <div className="tech-callout-label">Técnica recomendada</div>
      <div className="tech-callout-name">{tech.nome}</div>
      {technique.guidance && <p className="tech-callout-guidance">{technique.guidance}</p>}
      <button type="button" className="tech-callout-link" onClick={open}>
        {label} ↗
      </button>
    </div>
  );
}
