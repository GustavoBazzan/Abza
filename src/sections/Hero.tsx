import { Symbol } from '../components/Brand';
import { Button } from '../components/Button';
import { HERO_STATS, USOS } from '../data/content';

interface HeroProps {
  onExplore: () => void;
  onTechniques: () => void;
}

export function Hero({ onExplore, onTechniques }: HeroProps) {
  return (
    <section id="s00" data-screen-label="00 Visão Geral" className="hero">
      <div className="hero-glow" />
      <div className="hero-inner">
        <div className="hero-brandline">
          <Symbol size={16} color="var(--abza-red)" />
          <span>ABZA Sales Playbook · 01/11</span>
        </div>
        <h1>Vender não é <span className="accent">convencer.</span></h1>
        <p className="hero-lede">É conduzir uma decisão até que o cliente tenha clareza suficiente para dizer sim — ou segurança suficiente para dizer não.</p>

        <div className="hero-grid">
          <div className="hero-col">
            <div>
              <div className="hero-col-title">Técnicas de fechamento para vendas consultivas high ticket</div>
              <p className="hero-col-text">Este playbook reúne técnicas clássicas de fechamento e as adapta para a realidade de vendas complexas da ABZA: marketing, estratégia, branding, performance, comunicação e projetos de alto valor.</p>
            </div>
            <div className="hero-ctas">
              <Button size="lg" onClick={onExplore}>Explorar o playbook →</Button>
              <Button variant="ghost" size="lg" onClick={onTechniques}>Ir para as 10 técnicas</Button>
            </div>
          </div>

          <div className="hero-premise">
            <div className="hero-premise-label">Premissa central</div>
            <p className="hero-premise-text">O objetivo não é fazer o cliente dizer sim. É descobrir o que ainda impede o cliente de tomar uma decisão com segurança.</p>
            <div className="hero-stats">
              {HERO_STATS.map((st) => (
                <div key={st.label}>
                  <div className="hero-stat-value">{st.value}</div>
                  <div className="hero-stat-label">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-usos">
          {USOS.map((u) => (
            <div className="hero-uso" key={u.n}>
              <span className="hero-uso-n">{u.n}</span>
              <span className="hero-uso-t">{u.t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
