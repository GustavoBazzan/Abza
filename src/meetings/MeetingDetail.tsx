import { useState } from 'react';
import { TECH } from '../data/content';
import { deriveMeetingStatus, MEETING_STATUS_LABEL, OBJECTION_TYPES } from '../data/meeting';
import { getProduct } from '../data/products';
import { useActiveMeeting } from '../meeting/useMeetingStore';

interface MeetingDetailProps {
  meetingId: string;
  navigate: (path: string) => void;
}

export function MeetingDetail({ meetingId, navigate }: MeetingDetailProps) {
  const { meeting, loading } = useActiveMeeting(meetingId);
  const [copied, setCopied] = useState(false);

  if (loading) return null;

  if (!meeting) {
    return (
      <div className="meeting-shell">
        <p className="meeting-empty-state">Reunião não encontrada.</p>
        <button type="button" className="meeting-back-link" onClick={() => navigate('/reunioes')}>← Reuniões</button>
      </div>
    );
  }

  const product = getProduct(meeting.productId);
  const status = deriveMeetingStatus(meeting);
  const techniques = meeting.techniquesViewed.map((num) => TECH.find((t) => t.num === num)).filter((t) => !!t);

  const history = (product?.stages ?? []).flatMap((stage) => {
    if (stage.kind === 'questions') {
      return (stage.questions ?? [])
        .filter((q) => meeting.answers[q.id]?.value.trim())
        .map((q) => ({ stageTitle: stage.title, prompt: q.text, answer: meeting.answers[q.id].value }));
    }
    if (stage.kind === 'solution') {
      return (stage.solutionParts ?? [])
        .filter((p) => meeting.answers[p.id]?.value.trim())
        .map((p) => ({ stageTitle: stage.title, prompt: p.title, answer: meeting.answers[p.id].value }));
    }
    return [];
  });

  function copySummary() {
    const lines = [
      `Resumo da reunião — ${product?.title ?? meeting!.productId}`,
      '',
      `Cliente: ${meeting!.setup.client || '—'}`,
      `Empresa: ${meeting!.setup.company || '—'}`,
      `Data: ${meeting!.setup.date || '—'}`,
      `Responsável ABZA: ${meeting!.setup.owner || '—'}`,
      '',
      `Problema: ${meeting!.diagnosis.centralProblem || '—'}`,
      `Impacto: ${meeting!.diagnosis.impact || '—'}`,
      `Objetivo: ${meeting!.diagnosis.objective || '—'}`,
      `Urgência: ${meeting!.qualification.urgency || '—'}`,
      `Decisor: ${meeting!.qualification.decisionMaker || '—'}`,
      `Prazo: ${meeting!.qualification.deadline || '—'}`,
      `Budget: ${meeting!.qualification.budgetRange || '—'}`,
      '',
      `Escopo: ${meeting!.scope.selectedItemIds.length || meeting!.scope.customItems.length ? [...meeting!.scope.selectedItemIds, ...meeting!.scope.customItems].join(', ') : '—'}`,
      `Valor apresentado: ${meeting!.pricing.amount || '—'}`,
      '',
      `Objeções: ${meeting!.objections.length ? meeting!.objections.map((o) => OBJECTION_TYPES.find((t) => t.id === o.type)?.label).join(', ') : '—'}`,
      `Técnicas utilizadas: ${techniques.length ? techniques.map((t) => t!.nome).join(', ') : '—'}`,
      '',
      `Resultado: ${MEETING_STATUS_LABEL[status]}`,
      `Próximo passo: ${meeting!.closing.nextStep || '—'}`,
      `Data do próximo passo: ${meeting!.closing.nextStepDate || '—'}`,
    ];
    try { navigator.clipboard.writeText(lines.join('\n')); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="meeting-shell">
      <button type="button" className="meeting-back-link" onClick={() => navigate('/reunioes')}>← Reuniões</button>

      <div className="summary-head">
        <span className={`status-pill status-${status}`}>{MEETING_STATUS_LABEL[status]}</span>
        <h1 className="meeting-overview-title">{meeting.setup.company || meeting.setup.client || 'Reunião'}</h1>
        <p className="meeting-overview-objective">{product?.title ?? meeting.productId}</p>
      </div>

      <div className="summary-block">
        <span className="call-block-label">Resumo</span>
        <div className="summary-grid">
          <div className="summary-field"><span>Cliente</span><strong>{meeting.setup.client || '—'}</strong></div>
          <div className="summary-field"><span>Empresa</span><strong>{meeting.setup.company || '—'}</strong></div>
          <div className="summary-field"><span>Produto</span><strong>{product?.title ?? meeting.productId}</strong></div>
          <div className="summary-field"><span>Data</span><strong>{meeting.setup.date || '—'}</strong></div>
          <div className="summary-field"><span>Responsável</span><strong>{meeting.setup.owner || '—'}</strong></div>
          <div className="summary-field"><span>Participantes</span><strong>{meeting.setup.participants || '—'}</strong></div>
        </div>
      </div>

      <div className="summary-block">
        <span className="call-block-label">Diagnóstico</span>
        <div className="summary-grid">
          <div className="summary-field full"><span>Problema</span><strong>{meeting.diagnosis.centralProblem || '—'}</strong></div>
          <div className="summary-field full"><span>Impacto</span><strong>{meeting.diagnosis.impact || '—'}</strong></div>
          <div className="summary-field full"><span>Objetivo</span><strong>{meeting.diagnosis.objective || '—'}</strong></div>
          <div className="summary-field"><span>Urgência</span><strong>{meeting.qualification.urgency || '—'}</strong></div>
          <div className="summary-field"><span>Decisor</span><strong>{meeting.qualification.decisionMaker || '—'}</strong></div>
          <div className="summary-field"><span>Prazo</span><strong>{meeting.qualification.deadline || '—'}</strong></div>
          <div className="summary-field"><span>Budget</span><strong>{meeting.qualification.budgetRange || '—'}</strong></div>
          <div className="summary-field"><span>Concorrência</span><strong>{meeting.qualification.competitors || '—'}</strong></div>
        </div>
      </div>

      <div className="summary-block">
        <span className="call-block-label">Solução</span>
        <div className="summary-grid">
          <div className="summary-field full">
            <span>Escopo recomendado</span>
            <strong>{[...meeting.scope.selectedItemIds, ...meeting.scope.customItems].join(', ') || '—'}</strong>
          </div>
          <div className="summary-field"><span>Valor apresentado</span><strong>{meeting.pricing.amount || '—'}</strong></div>
          <div className="summary-field"><span>Forma de pagamento</span><strong>{meeting.pricing.paymentTerms || '—'}</strong></div>
        </div>
      </div>

      <div className="summary-block">
        <span className="call-block-label">Negociação</span>
        {meeting.objections.length ? (
          <div className="summary-pill-row">
            {meeting.objections.map((o) => (
              <span className="summary-pill" key={o.id}>{OBJECTION_TYPES.find((t) => t.id === o.type)?.label}</span>
            ))}
          </div>
        ) : <p className="summary-empty">Nenhuma objeção registrada.</p>}
        {techniques.length > 0 && (
          <div className="summary-pill-row">
            {techniques.map((t) => <span className="summary-pill" key={t!.num}>{t!.nome}</span>)}
          </div>
        )}
      </div>

      <div className="summary-block">
        <span className="call-block-label">Próximo passo</span>
        <div className="summary-grid">
          <div className="summary-field full"><span>Descrição</span><strong>{meeting.closing.nextStep || '—'}</strong></div>
          <div className="summary-field"><span>Data</span><strong>{meeting.closing.nextStepDate || '—'}</strong></div>
          <div className="summary-field"><span>Responsável</span><strong>{meeting.closing.nextStepOwner || '—'}</strong></div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="summary-block">
          <span className="call-block-label">Histórico completo da call</span>
          <div className="history-list">
            {history.map((h, i) => (
              <div className="history-item" key={i}>
                <div className="history-stage">{h.stageTitle}</div>
                <div className="history-prompt">{h.prompt}</div>
                <div className="history-answer">{h.answer}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="summary-actions">
        <button type="button" className="meeting-start-btn" onClick={copySummary}>{copied ? 'Copiado ✓' : 'Copiar resumo'}</button>
        {!meeting.endedAt && (
          <button type="button" className="call-nav-btn" onClick={() => navigate(`/scripts/${meeting.productId}/call/${meeting.id}`)}>Continuar reunião</button>
        )}
      </div>
    </div>
  );
}
