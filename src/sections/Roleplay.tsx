import { useState } from 'react';
import { ROLES } from '../data/content';

export function Roleplay() {
  const [role, setRole] = useState(0);
  const active = ROLES[role];

  return (
    <section id="s07" data-screen-label="07 Roleplay Lab" className="section">
      <div className="roleplay-inner">
        <div className="section-kicker">
          <span className="section-kicker-num">07</span>
          <span className="section-kicker-label">Roleplay Lab</span>
        </div>
        <h2 className="section-heading" style={{ marginBottom: 16 }}>Treine antes de valer dinheiro.</h2>
        <p className="roleplay-lede">Dez níveis de dificuldade. Selecione um nível, rode a simulação em dupla por 10 minutos e preencha a ficha de análise ao final.</p>

        <div className="roleplay-layout">
          <div className="roleplay-list">
            {ROLES.map((r, i) => (
              <button key={r.n} className={`roleplay-item${i === role ? ' active' : ''}`} onClick={() => setRole(i)}>
                <span className="roleplay-item-n">{r.n}</span>
                <span className="roleplay-item-titulo">{r.titulo}</span>
              </button>
            ))}
          </div>

          <div className="roleplay-detail">
            <div className="roleplay-detail-head">
              <span className="roleplay-nivel">Nível {active.n}</span>
              <span className="roleplay-dificuldade">{active.dificuldade}</span>
            </div>
            <h3>{active.titulo}</h3>
            <p className="roleplay-cenario">{active.cenario}</p>

            <div className="roleplay-objecao-block">
              <div className="roleplay-objecao-label">Objeção do cliente</div>
              <p className="roleplay-objecao-text">"{active.objecao}"</p>
            </div>

            <div className="roleplay-fields">
              <div className="roleplay-field">
                <label>Minha resposta</label>
                <textarea placeholder="Escreva a resposta que você daria..." />
              </div>
              <div className="roleplay-field">
                <label>O que poderia ser melhor</label>
                <textarea placeholder="Feedback do parceiro de roleplay..." />
              </div>
            </div>

            <div className="roleplay-tecnicas">
              <span className="roleplay-tecnicas-label">Técnicas indicadas</span>
              {active.tecnicas.map((tec) => (
                <span className="roleplay-tecnica-pill" key={tec}>{tec}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
