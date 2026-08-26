import { METODO, OBJ } from '../data/content';

interface ObjectionsProps {
  step: number;
  onHoverStep: (i: number) => void;
  onOpenObjection: (i: number) => void;
}

export function Objections({ step, onHoverStep, onOpenObjection }: ObjectionsProps) {
  const activeStep = METODO[step];
  return (
    <section id="s04" data-screen-label="04 Sistema de Objeções" className="objections-section">
      <div className="objections-inner">
        <div className="section-kicker">
          <span className="section-kicker-num">04</span>
          <span className="section-kicker-label on-dark">O sistema ABZA para objeções</span>
        </div>
        <h2 className="section-heading" style={{ fontSize: 'clamp(38px, 4.2vw, 64px)', lineHeight: 1, marginBottom: 18 }}>
          Protocolo <span style={{ color: 'var(--abza-red)' }}>7 Movimentos</span>
        </h2>
        <p className="objections-lede">Sete movimentos entre a objeção e a decisão. A ordem importa mais que o argumento: quase todo erro comercial é um movimento executado fora de sequência.</p>

        <div className="movimentos-grid">
          {METODO.map((m, i) => (
            <button
              type="button"
              key={m.n}
              className={`movimento-card${i === step ? ' active' : ''}`}
              onMouseEnter={() => onHoverStep(i)}
              onClick={() => onHoverStep(i)}
            >
              <span className="movimento-card-n">{m.n}</span>
              <span className="movimento-card-nome">{m.nome}</span>
              <span className="movimento-card-desc">{m.desc}</span>
            </button>
          ))}
        </div>

        <div className="movimento-active">
          <div>
            <div className="movimento-active-label">Movimento {activeStep.n}</div>
            <div className="movimento-active-nome">{activeStep.nome}</div>
          </div>
          <div>
            <p className="movimento-active-frase">{activeStep.frase}</p>
            <p className="movimento-active-detalhe">{activeStep.detalhe}</p>
          </div>
        </div>

        <div className="objections-map">
          <div className="objections-map-head">
            <h3>Mapa de objeções</h3>
            <p>As dez frases que a equipe mais ouve. Cada uma abre o que pode estar por trás, o que não responder e a técnica recomendada.</p>
          </div>
          <div className="objections-grid">
            {OBJ.map((o, i) => (
              <button className="objection-card" key={o.titulo} onClick={() => onOpenObjection(i)}>
                <span className="objection-card-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="objection-card-titulo">"{o.titulo}"</span>
                <span className="objection-card-tecnica">{o.tecnica} ↗</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
