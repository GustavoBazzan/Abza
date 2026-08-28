import { useState } from 'react';
import { TECH } from '../data/content';
import { OBJECTION_OPTIONS, getScript, type Meeting } from '../data/scripts';

interface MeetingSummaryProps {
  scriptId: string;
  meeting: Meeting | null;
  navigate: (path: string) => void;
  onReset: () => void;
}

function buildSummaryText(meeting: Meeting, scriptTitle: string): string {
  const n = meeting.notes;
  const techniques = meeting.techniquesViewed.map((num) => TECH.find((t) => t.num === num)?.nome).filter(Boolean);
  const objections = n.objections.map((o) => OBJECTION_OPTIONS.find((opt) => opt.id === o)?.label).filter(Boolean);

  return [
    `Resumo da reunião — ${scriptTitle}`,
    '',
    `Cliente: ${n.client || '—'}`,
    `Empresa: ${n.company || '—'}`,
    `Responsável ABZA: ${n.owner || '—'}`,
    '',
    `Problema: ${n.mainPain || '—'}`,
    `Objetivo: ${n.objective || '—'}`,
    `Urgência: ${n.urgency || '—'}`,
    `Prazo: ${n.deadline || '—'}`,
    `Orçamento mencionado: ${n.budgetMentioned || '—'}`,
    `Decisor: ${n.decisionMaker || '—'}`,
    `Concorrentes mencionados: ${n.competitorsMentioned || '—'}`,
    '',
    `Técnicas utilizadas: ${techniques.length ? techniques.join(', ') : '—'}`,
    `Objeções: ${objections.length ? objections.join(', ') : '—'}`,
    '',
    `Observações: ${n.observations || '—'}`,
    '',
    `Próximo passo: ${n.nextStep || '—'}`,
    `Data do próximo passo: ${n.nextStepDate || '—'}`,
  ].join('\n');
}

export function MeetingSummary({ scriptId, meeting, navigate, onReset }: MeetingSummaryProps) {
  const [copied, setCopied] = useState(false);
  const script = getScript(scriptId);

  if (!meeting || !script) {
    return (
      <div className="meeting-shell">
        <p className="meeting-empty-state">Nenhuma reunião para resumir.</p>
        <button type="button" className="meeting-back-link" onClick={() => navigate('/scripts')}>← Scripts de Reunião</button>
      </div>
    );
  }

  const n = meeting.notes;
  const techniques = meeting.techniquesViewed.map((num) => TECH.find((t) => t.num === num)).filter((t) => !!t);
  const objections = n.objections.map((o) => OBJECTION_OPTIONS.find((opt) => opt.id === o)?.label).filter(Boolean);

  function copySummary() {
    const text = buildSummaryText(meeting!, script!.title);
    try { navigator.clipboard.writeText(text); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function startNew() {
    onReset();
    navigate('/scripts');
  }

  return (
    <div className="meeting-shell">
      <div className="summary-head">
        <span className="meeting-eyebrow">Reunião encerrada</span>
        <h1 className="meeting-overview-title">Resumo da reunião</h1>
        <p className="meeting-overview-objective">{script.title}</p>
      </div>

      <div className="summary-grid">
        <div className="summary-field"><span>Cliente</span><strong>{n.client || '—'}</strong></div>
        <div className="summary-field"><span>Empresa</span><strong>{n.company || '—'}</strong></div>
        <div className="summary-field"><span>Responsável ABZA</span><strong>{n.owner || '—'}</strong></div>
        <div className="summary-field"><span>Decisor</span><strong>{n.decisionMaker || '—'}</strong></div>
        <div className="summary-field full"><span>Problema</span><strong>{n.mainPain || '—'}</strong></div>
        <div className="summary-field full"><span>Objetivo</span><strong>{n.objective || '—'}</strong></div>
        <div className="summary-field"><span>Urgência</span><strong>{n.urgency || '—'}</strong></div>
        <div className="summary-field"><span>Prazo</span><strong>{n.deadline || '—'}</strong></div>
        <div className="summary-field"><span>Orçamento mencionado</span><strong>{n.budgetMentioned || '—'}</strong></div>
        <div className="summary-field"><span>Concorrentes mencionados</span><strong>{n.competitorsMentioned || '—'}</strong></div>
      </div>

      <div className="summary-block">
        <span className="call-block-label">Técnicas utilizadas</span>
        {techniques.length ? (
          <div className="summary-pill-row">
            {techniques.map((t) => <span className="summary-pill" key={t!.num}>{t!.nome}</span>)}
          </div>
        ) : <p className="summary-empty">Nenhuma técnica aberta durante a call.</p>}
      </div>

      <div className="summary-block">
        <span className="call-block-label">Objeções</span>
        {objections.length ? (
          <div className="summary-pill-row">
            {objections.map((o) => <span className="summary-pill" key={o}>{o}</span>)}
          </div>
        ) : <p className="summary-empty">Nenhuma objeção marcada.</p>}
      </div>

      <div className="summary-block">
        <span className="call-block-label">Observações</span>
        <p className="summary-observations">{n.observations || '—'}</p>
      </div>

      <div className="summary-grid">
        <div className="summary-field"><span>Próximo passo</span><strong>{n.nextStep || '—'}</strong></div>
        <div className="summary-field"><span>Data do próximo passo</span><strong>{n.nextStepDate || '—'}</strong></div>
      </div>

      <div className="summary-actions">
        <button type="button" className="meeting-start-btn" onClick={copySummary}>
          {copied ? 'Copiado ✓' : 'Copiar resumo'}
        </button>
        <button type="button" className="call-nav-btn" onClick={startNew}>Nova reunião</button>
      </div>
    </div>
  );
}
