import { useState, type MouseEvent } from 'react';
import type { Technique } from '../data/content';

interface TechModalProps {
  tech: Technique;
  showScripts: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function TechModal({ tech, showScripts, onClose, onPrev, onNext }: TechModalProps) {
  const [copied, setCopied] = useState(false);

  function copyScript() {
    try { navigator.clipboard.writeText(tech.script); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function stop(e: MouseEvent) { e.stopPropagation(); }

  return (
    <div className="modal-overlay drawer" onClick={onClose}>
      <div className="tech-drawer" onClick={stop}>
        <div className="tech-drawer-head">
          <div>
            <div className="tech-drawer-head-meta">
              <span className="num">Técnica {tech.num}</span>
              <span className="stars">{tech.stars}</span>
              <span className="nivel">{tech.nivel}</span>
            </div>
            <h3>{tech.nome}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="tech-drawer-body">
          <div className="tech-top-grid">
            <div className="tech-top-col">
              <div>
                <div className="tech-block-label">Conceito</div>
                <p className="tech-block-text">{tech.conceito}</p>
              </div>
              <div>
                <div className="tech-block-label">Qual problema resolve</div>
                <p className="tech-block-text">{tech.problema}</p>
              </div>
            </div>
            <div className="tech-objetivo-card">
              <div className="label">Objetivo</div>
              <p>{tech.objetivo}</p>
            </div>
          </div>

          <div className="tech-frase-card">
            <div className="label">Frase para memorizar</div>
            <p>"{tech.frase}"</p>
          </div>

          <div className="tech-two-col">
            <div className="tech-list-card">
              <div className="label">Quando usar</div>
              <div className="dash-list">
                {tech.quandoUsar.map((q) => (
                  <div className="check-item" key={q}><span className="mark ok">✓</span>{q}</div>
                ))}
              </div>
            </div>
            <div className="tech-list-card warn">
              <div className="label">Quando não usar</div>
              <div className="dash-list">
                {tech.quandoNao.map((q) => (
                  <div className="check-item" key={q}><span className="mark no">×</span>{q}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="example-table">
            <div className="example-table-label">Exemplo realista · aplicação ABZA</div>
            {tech.exemplo.map((l, i) => (
              <div className="example-row" key={i}>
                <span className="example-quem" style={{ color: l.color }}>{l.quem}</span>
                <span className="example-fala">{l.fala}</span>
              </div>
            ))}
          </div>

          {showScripts && (
            <div className="script-card">
              <div className="script-card-head">
                <span className="label">Script sugerido</span>
                <button className={`script-copy-btn${copied ? ' copied' : ''}`} onClick={copyScript}>
                  {copied ? 'copiado ✓' : 'copiar script'}
                </button>
              </div>
              <p>{tech.script}</p>
            </div>
          )}

          <div className="tech-two-col">
            <div className="tech-list-card soft">
              <div className="label">Erros comuns</div>
              <div className="dash-list">
                {tech.erros.map((er) => (
                  <div className="check-item" key={er}><span className="mark dash">—</span>{er}</div>
                ))}
              </div>
            </div>
            <div className="tech-list-card soft">
              <div className="label">Sinais para identificar o momento</div>
              <div className="dash-list">
                {tech.sinais.map((si) => (
                  <div className="check-item" key={si}><span className="mark arrow">→</span>{si}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="tech-two-col">
            <div className="tech-list-card soft" style={{ background: '#FAF9F7' }}>
              <div className="label">Aplicação high ticket</div>
              <p className="tech-block-text" style={{ fontSize: 14.5 }}>{tech.highTicket}</p>
            </div>
            <div className="tech-list-card soft" style={{ background: '#FAF9F7' }}>
              <div className="label">Exercício de treinamento</div>
              <p className="tech-block-text" style={{ fontSize: 14.5 }}>{tech.exercicio}</p>
            </div>
          </div>

          <div className="tech-nav-row">
            <button className="tech-nav-btn" onClick={onPrev}>← Anterior</button>
            <button className="tech-nav-btn" onClick={onNext}>Próxima →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
