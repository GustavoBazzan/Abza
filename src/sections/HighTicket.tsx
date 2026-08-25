import { Symbol } from '../components/Brand';
import { DIALOGO } from '../data/content';

export function HighTicket() {
  return (
    <section id="s05" data-screen-label="05 Aplicação High Ticket" className="section">
      <div className="highticket-inner">
        <div className="section-kicker">
          <span className="section-kicker-num">05</span>
          <span className="section-kicker-label">Simulação high ticket</span>
        </div>
        <h2 className="section-heading" style={{ maxWidth: '20ch' }}>Uma call inteira, técnica por técnica.</h2>
        <p className="highticket-lede">Cenário: projeto estratégico anual de marketing. Ticket alto, dois decisores, proposta já apresentada. Observe que nenhuma frase tenta convencer — todas tentam esclarecer.</p>

        <div className="dialogo-card">
          {DIALOGO.map(([quem, fala, tag], i) => (
            <div className="dialogo-row" key={i}>
              <div className="dialogo-quem" style={{ color: quem === 'ABZA' ? 'var(--abza-red)' : 'var(--ink-400)' }}>{quem}</div>
              <div className="dialogo-fala">{fala}</div>
              <div className="dialogo-tag-wrap">
                {tag && <span className="dialogo-tag">{tag}</span>}
              </div>
            </div>
          ))}
          <div className="dialogo-foot">
            <Symbol size={14} color="var(--abza-red)" />
            <span>Cinco técnicas encadeadas. Nenhuma delas usada isoladamente — é a sequência que produz a decisão.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
