import { ANATOMIA, CARO_SIGNIFICADOS } from '../data/content';

export function Anatomy() {
  return (
    <section id="s02" data-screen-label="02 Anatomia do Fechamento" className="section bordered">
      <div className="anatomy-inner">
        <div className="section-kicker">
          <span className="section-kicker-num">02</span>
          <span className="section-kicker-label">Anatomia de uma objeção</span>
        </div>
        <h2 className="section-heading" style={{ maxWidth: '20ch', marginBottom: 48 }}>Toda objeção é a superfície de um risco percebido.</h2>

        <div className="anatomy-grid">
          {ANATOMIA.map((a) => (
            <div className="anatomy-card" key={a.n}>
              <span className="anatomy-card-n">{a.n}</span>
              <span className="anatomy-card-t">{a.t}</span>
              <span className="anatomy-card-d">{a.d}</span>
            </div>
          ))}
        </div>

        <div className="anatomy-bottom">
          <div className="objecao-card">
            <div className="objecao-card-head">
              <div className="label">Objeção declarada</div>
              <div className="quote">"Está caro."</div>
            </div>
            <div className="objecao-card-body">
              <div className="label">Pode significar</div>
              <div className="dash-list">
                {CARO_SIGNIFICADOS.map((m) => (
                  <div className="dash-item" key={m}><span className="dash">—</span>{m}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="anatomy-side">
            <div className="error-card">
              <div className="error-card-label">⚠ Erro comum</div>
              <p>"Responder imediatamente 'está caro' explicando tudo que está incluso pode significar responder uma objeção que o cliente nunca teve."</p>
            </div>
            <div className="rule-card">
              <div className="rule-card-label">Regra ABZA</div>
              <p className="rule-card-title">Antes de responder uma objeção: <span className="accent">clarifique.</span></p>
              <p className="rule-card-text">Uma pergunta bem feita custa dez segundos. Uma resposta errada custa a reunião.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
