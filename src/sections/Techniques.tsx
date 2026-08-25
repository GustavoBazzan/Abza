import { TECH } from '../data/content';

interface TechniquesProps {
  showStars: boolean;
  onOpen: (index: number) => void;
}

export function Techniques({ showStars, onOpen }: TechniquesProps) {
  return (
    <section id="s03" data-screen-label="03 As 10 Técnicas" className="section">
      <div className="tech-head">
        <div>
          <div className="section-kicker" style={{ marginBottom: 22 }}>
            <span className="section-kicker-num">03</span>
            <span className="section-kicker-label">Biblioteca de técnicas</span>
          </div>
          <h2 className="section-heading" style={{ margin: 0, maxWidth: '16ch' }}>As 10 técnicas, traduzidas para a ABZA.</h2>
        </div>
        <p className="tech-head-desc">Cada técnica abre uma ficha completa: conceito, quando usar, quando não usar, script, erros comuns e exercício de treino. Clique em qualquer card.</p>
      </div>

      <div className="tech-grid">
        {TECH.map((t, i) => (
          <button className="tech-card" key={t.num} onClick={() => onOpen(i)}>
            <div className="tech-card-top">
              <span className="tech-card-num">{t.num}</span>
              <span className="tech-card-momento">{t.momento}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div className="tech-card-nome">{t.nome}</div>
              <div className="tech-card-objetivo">{t.objetivo}</div>
            </div>
            <div className="tech-card-foot">
              {showStars ? (
                <span className="tech-card-stars">
                  <span className="stars">{t.stars}</span>
                  <span className="nivel">{t.nivel}</span>
                </span>
              ) : <span />}
              <span className="tech-card-open">abrir ↗</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
