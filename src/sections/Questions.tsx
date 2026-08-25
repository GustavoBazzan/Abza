import { useState } from 'react';
import { CATS } from '../data/content';

export function Questions() {
  const [cat, setCat] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  function copy(text: string, key: string) {
    try { navigator.clipboard.writeText(text); } catch { /* clipboard unavailable */ }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
  }

  return (
    <section id="s06" data-screen-label="06 Biblioteca de Perguntas" className="section bordered">
      <div className="questions-inner">
        <div className="section-kicker">
          <span className="section-kicker-num">06</span>
          <span className="section-kicker-label">Biblioteca de perguntas</span>
        </div>
        <h2 className="section-heading" style={{ maxWidth: '20ch' }}>Perguntas prontas para a call de hoje.</h2>

        <div className="cat-tabs">
          {CATS.map((c, i) => (
            <button key={c.nome} className={`cat-tab${i === cat ? ' active' : ''}`} onClick={() => setCat(i)}>
              {c.nome}
            </button>
          ))}
        </div>

        <div className="questions-grid">
          {CATS[cat].itens.map(([texto, uso], i) => {
            const key = `${cat}-${i}`;
            const isCopied = copiedKey === key;
            return (
              <div className="question-card" key={key}>
                <p className="question-text">"{texto}"</p>
                <div className="question-foot">
                  <span className="question-uso">{uso}</span>
                  <button className="question-copy" style={{ color: isCopied ? 'var(--abza-red)' : 'var(--ink-600)' }} onClick={() => copy(texto, key)}>
                    {isCopied ? 'copiado ✓' : 'copiar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
