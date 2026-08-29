import { useState, type MouseEvent } from 'react';
import { OBJECTION_TYPES, type Meeting, type ObjectionEvent, type ObjectionType } from '../data/meeting';
import { OBJECTION_PLAYBOOK } from '../data/objectionPlaybook';
import type { CopilotTrigger } from '../knowledge/copilotAnalysis';
import { TechniqueCallout } from './TechniqueCallout';

interface ObjectionOverlayProps {
  meeting: Meeting;
  currentStageId: string;
  update: (patch: (m: Meeting) => Meeting) => void;
  analyze: (meeting: Meeting, trigger: CopilotTrigger, stageId: string) => void;
  navigate: (path: string) => void;
  onViewTechnique: (num: string) => void;
  onClose: () => void;
}

export function ObjectionOverlay({ meeting, currentStageId, update, analyze, navigate, onViewTechnique, onClose }: ObjectionOverlayProps) {
  const [selected, setSelected] = useState<ObjectionType | null>(null);
  const [response, setResponse] = useState('');
  function stop(e: MouseEvent) { e.stopPropagation(); }

  function back() {
    if (selected) {
      const event: ObjectionEvent = {
        id: `obj_${Date.now().toString(36)}`,
        type: selected,
        stageId: currentStageId,
        clientResponse: response,
        source: 'manual',
        createdAt: new Date().toISOString(),
      };
      const updatedMeeting: Meeting = { ...meeting, objections: [...meeting.objections, event] };
      update(() => updatedMeeting);
      // Gatilho C: uma objeção acabou de ser registrada — nova análise contextual.
      analyze(updatedMeeting, 'objection', currentStageId);
    }
    onClose();
  }

  const entry = selected ? OBJECTION_PLAYBOOK[selected] : null;
  const label = selected ? OBJECTION_TYPES.find((o) => o.id === selected)?.label : null;

  return (
    <div className="modal-overlay drawer" onClick={back}>
      <div className="objection-overlay" onClick={stop}>
        <div className="notes-drawer-head">
          <h3>Cliente apresentou uma objeção</h3>
          <button type="button" className="modal-close" aria-label="Fechar" onClick={back}>✕</button>
        </div>

        {!selected ? (
          <div className="quickhelp-list">
            {OBJECTION_TYPES.map((o) => (
              <button key={o.id} type="button" className="quickhelp-item" onClick={() => setSelected(o.id)}>{o.label}</button>
            ))}
          </div>
        ) : (
          <div className="quickhelp-detail">
            <button type="button" className="meeting-back-link" onClick={() => setSelected(null)}>← Outras objeções</button>
            <h4 className="quickhelp-detail-title">{label}</h4>

            <div className="call-block soft">
              <span className="call-block-label">O que provavelmente está acontecendo</span>
              <ul className="call-watchfor-list">{entry!.whatsHappening.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
            <div className="call-block warn">
              <span className="call-block-label">O que NÃO fazer</span>
              <ul className="call-watchfor-list">{entry!.whatNotToDo.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
            <div className="call-block">
              <span className="call-block-label">Pergunta recomendada</span>
              <p className="quickhelp-next-question">"{entry!.recommendedQuestion}"</p>
            </div>
            {entry!.technique && (
              <TechniqueCallout technique={entry!.technique} navigate={navigate} onView={onViewTechnique} />
            )}
            <label className="notes-field full">
              <span>Resposta do cliente</span>
              <textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Registre o que o cliente respondeu…" />
            </label>
            <button type="button" className="meeting-start-btn" onClick={back}>Voltar para a reunião</button>
          </div>
        )}
      </div>
    </div>
  );
}
