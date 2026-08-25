import type { MouseEvent } from 'react';
import type { Objection } from '../data/content';

interface ObjModalProps {
  obj: Objection;
  index: number;
  onClose: () => void;
}

export function ObjModal({ obj, index, onClose }: ObjModalProps) {
  function stop(e: MouseEvent) { e.stopPropagation(); }

  return (
    <div className="modal-overlay center" onClick={onClose}>
      <div className="obj-modal" onClick={stop}>
        <div className="obj-modal-head">
          <div>
            <div className="meta">Objeção {String(index + 1).padStart(2, '0')} · técnica recomendada: {obj.tecnica}</div>
            <h3>"{obj.titulo}"</h3>
          </div>
          <button className="modal-close on-dark" onClick={onClose}>✕</button>
        </div>
        <div className="obj-modal-body">
          <div className="tech-two-col">
            <div className="tech-list-card">
              <div className="label">O que pode estar por trás</div>
              <div className="dash-list">
                {obj.portras.map((p) => (
                  <div className="dash-item" key={p}><span className="dash">—</span>{p}</div>
                ))}
              </div>
            </div>
            <div className="tech-list-card warn">
              <div className="label">O que NÃO responder</div>
              <div className="dash-list">
                {obj.naoResponder.map((p) => (
                  <div className="check-item" key={p}><span className="mark no">×</span>{p}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="obj-perguntas-card">
            <div className="label">Perguntas para investigar</div>
            <div className="obj-perguntas-list">
              {obj.perguntas.map((p) => (
                <div className="obj-pergunta" key={p}>"{p}"</div>
              ))}
            </div>
          </div>
          <div className="obj-script-card">
            <div className="label">Script exemplo</div>
            <p>{obj.script}</p>
            <div className="obj-proxima">
              <div className="label">Próxima pergunta</div>
              <p>"{obj.proxima}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
