import { useState } from 'react';
import { TREE, ERROS, MATRIZ } from '../data/content';

export function Diagnostic() {
  const [tree, setTree] = useState(0);
  const active = TREE[tree];

  return (
    <section id="s09" data-screen-label="09 Diagnóstico Comercial" className="section">
      <div className="diagnostic-inner">
        <div className="section-kicker">
          <span className="section-kicker-num">09</span>
          <span className="section-kicker-label">Diagnóstico comercial</span>
        </div>
        <h2 className="section-heading" style={{ maxWidth: '20ch' }}>Qual técnica usar agora?</h2>

        <div className="diagnostic-top">
          <div className="tree-list">
            {TREE.map((t, i) => (
              <button key={t.pergunta} className={`tree-item${i === tree ? ' active' : ''}`} onClick={() => setTree(i)}>
                {t.pergunta}
              </button>
            ))}
          </div>
          <div className="tree-detail">
            <div className="tree-detail-label">Rota recomendada</div>
            <p className="tree-detail-pergunta">{active.pergunta}</p>
            <div className="tree-rota">
              {active.rota.map((step, i) => (
                <div className="tree-rota-step" key={i}>
                  <span className="n">{step.n}</span>
                  <span className="nome">{step.nome}</span>
                </div>
              ))}
            </div>
            <p className="tree-detail-nota">{active.nota}</p>
          </div>
        </div>

        <h3>Os 10 erros que mais custam negócios</h3>
        <div className="erros-grid">
          {ERROS.map((t, i) => (
            <div className="erro-card" key={t}>
              <span className="erro-card-n">Erro {String(i + 1).padStart(2, '0')}</span>
              <span className="erro-card-t">{t}</span>
            </div>
          ))}
        </div>

        <h3>Matriz das 10 técnicas</h3>
        <div className="matriz-table">
          <div className="matriz-head">
            <span>Técnica</span><span>Objetivo</span><span>Momento</span><span>Risco</span><span>Utilidade ABZA</span>
          </div>
          {MATRIZ.map(([tecnica, objetivo, momento, risco, stars]) => (
            <div className="matriz-row" key={tecnica}>
              <span className="matriz-tecnica">{tecnica}</span>
              <span>{objetivo}</span>
              <span className="matriz-momento">{momento}</span>
              <span className="matriz-risco" style={{ color: risco === 'médio' ? 'var(--support-amber)' : 'var(--support-green)' }}>{risco}</span>
              <span className="matriz-stars">{stars}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
