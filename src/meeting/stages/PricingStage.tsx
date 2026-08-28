import type { Meeting, PricingInfo, Stage } from '../../data/meeting';

interface PricingStageProps {
  stage: Stage;
  meeting: Meeting;
  update: (patch: (m: Meeting) => Meeting) => void;
}

export function PricingStage({ stage, meeting, update }: PricingStageProps) {
  function set(key: keyof PricingInfo, value: string) {
    update((m) => ({ ...m, pricing: { ...m.pricing, [key]: value } }));
  }

  return (
    <>
      <div className="notes-field-grid">
        <label className="notes-field">
          <span>Valor apresentado</span>
          <input type="text" value={meeting.pricing.amount} onChange={(e) => set('amount', e.target.value)} placeholder="R$" />
        </label>
        <label className="notes-field">
          <span>Forma de pagamento</span>
          <input type="text" value={meeting.pricing.paymentTerms} onChange={(e) => set('paymentTerms', e.target.value)} />
        </label>
        <label className="notes-field">
          <span>Prazo</span>
          <input type="text" value={meeting.pricing.deadline} onChange={(e) => set('deadline', e.target.value)} />
        </label>
        <label className="notes-field">
          <span>Observação comercial</span>
          <input type="text" value={meeting.pricing.note} onChange={(e) => set('note', e.target.value)} />
        </label>
      </div>

      <div className="call-block soft">
        <span className="call-block-label">Como introduzir</span>
        <ul className="call-watchfor-list">
          <li>Apresente com clareza — não justifique o preço excessivamente</li>
          <li>Diga o valor e permaneça em silêncio depois</li>
          <li>Observe a reação antes de falar de novo</li>
        </ul>
      </div>

      {stage.nextMove && <div className="call-nextmove"><span className="arrow">→</span>{stage.nextMove}</div>}
    </>
  );
}
