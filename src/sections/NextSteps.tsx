import { Symbol } from '../components/Brand';
import { Button } from '../components/Button';
import { ETICA, SIGNATURE_DEFAULT } from '../data/content';

interface NextStepsProps {
  onTechniques: () => void;
  onTop: () => void;
}

export function NextSteps({ onTechniques, onTop }: NextStepsProps) {
  return (
    <section id="s10" data-screen-label="10 Próximos Passos" className="nextsteps">
      <div className="nextsteps-inner">
        <div className="section-kicker">
          <span className="section-kicker-num">10</span>
          <span className="section-kicker-label">Venda responsável · próximos passos</span>
        </div>
        <h2 className="section-heading" style={{ maxWidth: '20ch' }}>Técnica sem ética é só pressão bem escrita.</h2>

        <div className="etica-grid">
          <div className="etica-card">
            <div className="etica-card-label">A ABZA não faz</div>
            <div className="etica-list">
              {ETICA.map((e) => (
                <div className="etica-item" key={e}><span className="x">×</span>{e}</div>
              ))}
            </div>
          </div>
          <div className="decline-card">
            <div className="decline-card-label">Um bom fechamento também pode ser</div>
            <p className="decline-quote">"Não acredito que nossa solução seja a melhor escolha para vocês neste momento."</p>
            <p className="decline-text">Recusar um negócio sem fit protege o portfólio, o time e a reputação. E aumenta autoridade — quem pode dizer não é ouvido de outra forma quando diz sim.</p>
          </div>
        </div>

        <div className="closing">
          <h2>O melhor fechamento é uma <span className="accent">decisão bem construída.</span></h2>
          <p>A técnica não substitui diagnóstico. O argumento não substitui confiança. E pressão nunca deve substituir clareza.</p>
          <p className="strong">Quanto melhor for o processo comercial, menos o fechamento parecerá um fechamento.</p>
          <div className="closing-ctas">
            <Button size="lg" onClick={onTechniques}>Revisar as 10 técnicas</Button>
            <Button variant="outline" size="lg" onClick={onTop}>Voltar ao início</Button>
          </div>
          <div className="closing-foot">
            <Symbol size={26} color="var(--abza-red)" />
            <div className="closing-foot-label">ABZA Sales Playbook<br />Estratégia · Diagnóstico · Condução · Decisão</div>
            <div className="closing-signature">{SIGNATURE_DEFAULT}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
