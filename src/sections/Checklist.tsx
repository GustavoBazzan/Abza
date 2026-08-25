import { useState } from 'react';
import { CHECK, SINAIS, REVIEW_PERGUNTAS, REVIEW_CAMPOS } from '../data/content';

function verdictFor(score: number) {
  if (score >= 8) {
    return {
      titulo: 'Oportunidade madura para o fechamento.',
      texto: 'Faça a recomendação de forma explícita e ofereça duas alternativas de avanço. Não continue apresentando.',
      border: 'var(--ink-900)', bg: '#FFFFFF', labelColor: 'var(--ink-500)', scoreColor: 'var(--support-green)', titleColor: 'var(--ink-900)',
    };
  }
  if (score >= 5) {
    return {
      titulo: 'Falta clareza em pontos decisivos.',
      texto: 'Volte às lacunas antes de pedir a decisão. Use o Processo de Eliminação para nomear o que ainda bloqueia.',
      border: 'var(--ink-200)', bg: '#FAF9F7', labelColor: 'var(--ink-500)', scoreColor: 'var(--support-amber)', titleColor: 'var(--ink-900)',
    };
  }
  return {
    titulo: 'Ainda não é hora de fechar.',
    texto: 'O diagnóstico está incompleto. Pedir a decisão agora produz um "vou pensar" — ou um não sem motivo conhecido.',
    border: 'var(--abza-red-200)', bg: 'var(--abza-red-50)', labelColor: 'var(--abza-red-700)', scoreColor: 'var(--abza-red)', titleColor: 'var(--abza-red-700)',
  };
}

export function Checklist() {
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [nota, setNota] = useState<number | null>(null);

  const score = Object.values(checks).filter(Boolean).length;
  const verdict = verdictFor(score);

  function toggle(i: number) {
    setChecks((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <section id="s08" data-screen-label="08 Checklist de Call" className="section bordered">
      <div className="checklist-inner">
        <div className="section-kicker">
          <span className="section-kicker-num">08</span>
          <span className="section-kicker-label">Checklist de call</span>
        </div>
        <h2 className="section-heading" style={{ maxWidth: '22ch' }}>Dez perguntas antes de pedir a decisão.</h2>

        <div className="checklist-layout">
          <div className="checklist-card">
            {CHECK.map((label, i) => {
              const on = !!checks[i];
              return (
                <button className="checklist-row" key={label} onClick={() => toggle(i)}>
                  <span className={`checklist-box${on ? ' on' : ''}`}>{on ? '✓' : ''}</span>
                  <span className={`checklist-label${on ? ' on' : ''}`}>{label}</span>
                  <span className="checklist-n">{String(i + 1).padStart(2, '0')}</span>
                </button>
              );
            })}
          </div>

          <div className="checklist-side">
            <div className="verdict-card" style={{ border: `1px solid ${verdict.border}`, background: verdict.bg }}>
              <div className="verdict-label" style={{ color: verdict.labelColor }}>Diagnóstico da oportunidade</div>
              <div className="verdict-score-row">
                <span className="verdict-score" style={{ color: verdict.scoreColor }}>{score}</span>
                <span className="verdict-score-suffix">/ 10 confirmados</span>
              </div>
              <div className="verdict-track">
                <div className="verdict-fill" style={{ background: verdict.scoreColor, width: `${score * 10}%` }} />
              </div>
              <p className="verdict-title" style={{ color: verdict.titleColor }}>{verdict.titulo}</p>
              <p className="verdict-text">{verdict.texto}</p>
            </div>
            <div className="radar-card">
              <div className="radar-label">Radar de sinais de compra</div>
              <div className="radar-chips">
                {SINAIS.map((s) => (
                  <span className="radar-chip" key={s}>{s}</span>
                ))}
              </div>
              <p className="radar-note">Quando o cliente começa a perguntar <strong>"como"</strong>, talvez ele já tenha parado de perguntar <strong>"se"</strong>.</p>
            </div>
          </div>
        </div>

        <div className="review-card">
          <div className="review-head">
            <div>
              <div className="review-head-label">Ficha pós-call</div>
              <h3>Review da reunião</h3>
            </div>
            <div className="review-score-row">
              <span className="review-score-label">Nota da call</span>
              <div className="review-score-dots">
                {Array.from({ length: 11 }, (_, v) => (
                  <button key={v} className={`review-score-dot${nota === v ? ' active' : ''}`} onClick={() => setNota(v)}>{v}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="review-perguntas">
            {REVIEW_PERGUNTAS.map((rp) => (
              <div className="review-pergunta" key={rp}>
                <span className="review-pergunta-dot" />{rp}
              </div>
            ))}
          </div>
          <div className="review-fields">
            {REVIEW_CAMPOS.map((rc) => (
              <div className="review-field" key={rc}>
                <label>{rc}</label>
                <input type="text" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
