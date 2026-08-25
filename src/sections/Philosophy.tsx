import { CONSEQUENCIAS, PIPELINE, PRESSAO, CONSULTIVA } from '../data/content';

export function Philosophy() {
  return (
    <section id="s01" data-screen-label="01 Filosofia ABZA" className="section philosophy">
      <div className="section-kicker">
        <span className="section-kicker-num">01</span>
        <span className="section-kicker-label">A filosofia comercial ABZA</span>
      </div>
      <div className="philosophy-top">
        <div>
          <h2 className="section-heading">Fechamento não começa no final da reunião.</h2>
          <p>Uma venda complexa raramente é ganha por uma frase mágica no último minuto. O fechamento é consequência de tudo que aconteceu antes.</p>
        </div>
        <div className="consequencias-grid">
          {CONSEQUENCIAS.map((c) => (
            <div className="consequencia-item" key={c}>{c}</div>
          ))}
        </div>
      </div>

      <div className="pipeline-card">
        <div className="pipeline-card-label">Jornada comercial ABZA · o fechamento é uma etapa, não um evento</div>
        <div className="pipeline-row">
          {PIPELINE.map((label, i) => {
            const isClose = label === 'Fechamento';
            return (
              <div className="pipeline-step" key={label}>
                <div className="pipeline-bar" style={{ background: isClose ? 'var(--abza-red)' : 'var(--ink-200)' }} />
                <div className="pipeline-step-n">{String(i + 1).padStart(2, '0')}</div>
                <div className="pipeline-step-label" style={{ color: isClose ? 'var(--abza-red)' : 'var(--ink-800)' }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="insight-grid">
        <div className="insight-card">
          <div className="insight-card-label">Insight ABZA</div>
          <p className="insight-card-quote">"Se chegamos ao final da reunião tentando convencer desesperadamente o cliente, provavelmente alguma etapa anterior ficou incompleta."</p>
        </div>
        <div className="insight-dark">
          <p>O vendedor não controla a decisão.<br /><span style={{ color: 'var(--abza-red)' }}>Ele controla a qualidade do processo de decisão.</span></p>
        </div>
      </div>

      <div className="venda-compare">
        <h3>Venda por pressão <span className="vs">vs</span> venda consultiva</h3>
        <div className="venda-grid">
          <div className="venda-col pressao">
            <div className="venda-col-label">Coluna 01 · Venda por pressão</div>
            <div className="venda-list">
              {PRESSAO.map((p) => (
                <div className="venda-item" key={p}>{p}</div>
              ))}
            </div>
          </div>
          <div className="venda-col consultiva">
            <div className="venda-col-label">Coluna 02 · Venda consultiva ABZA</div>
            <div className="venda-list">
              {CONSULTIVA.map((c) => (
                <div className="venda-item" key={c}><span className="arrow">→</span>{c}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
