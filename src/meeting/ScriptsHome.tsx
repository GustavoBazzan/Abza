import { CATEGORY_LABEL, SCRIPTS, type ScriptCategory } from '../data/scripts';

const CATEGORY_ORDER: ScriptCategory[] = ['vender', 'fechar', 'crescer'];

interface ScriptsHomeProps {
  navigate: (path: string) => void;
}

export function ScriptsHome({ navigate }: ScriptsHomeProps) {
  return (
    <div className="meeting-shell">
      <div className="meeting-home-head">
        <span className="meeting-eyebrow">Modo Call</span>
        <h1 className="meeting-home-title">Qual reunião você vai fazer?</h1>
        <p className="meeting-home-lede">Escolha o script. Ele conduz a reunião etapa por etapa, com as técnicas do Playbook aplicadas ao momento certo.</p>
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const scripts = SCRIPTS.filter((s) => s.category === cat);
        return (
          <section className="meeting-category" key={cat}>
            <div className="meeting-category-label">{CATEGORY_LABEL[cat]}</div>
            {scripts.length > 0 ? (
              <div className="meeting-script-grid">
                {scripts.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className="meeting-script-card"
                    onClick={() => navigate(`/scripts/${s.id}`)}
                  >
                    <div className="meeting-script-card-title">{s.title}</div>
                    <div className="meeting-script-card-desc">{s.shortDescription}</div>
                    <div className="meeting-script-card-foot">{s.steps.length} etapas · abrir ↗</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="meeting-category-empty">Em preparação — novos scripts em breve.</div>
            )}
          </section>
        );
      })}
    </div>
  );
}
