import { useState } from 'react';
import { getProduct } from '../data/products';
import { emptyMeetingSetup, type MeetingSetupInfo, type ProductId } from '../data/meeting';
import { startMeeting } from './useMeetingStore';

interface MeetingSetupProps {
  productId: string;
  navigate: (path: string) => void;
}

export function MeetingSetup({ productId, navigate }: MeetingSetupProps) {
  const product = getProduct(productId);
  const [setup, setSetup] = useState<MeetingSetupInfo>(() => emptyMeetingSetup(productId as ProductId));
  const [starting, setStarting] = useState(false);

  if (!product) {
    return (
      <div className="meeting-shell">
        <p className="meeting-empty-state">Produto não encontrado.</p>
        <button type="button" className="meeting-back-link" onClick={() => navigate('/scripts')}>← Voltar</button>
      </div>
    );
  }

  if (product.comingSoon) {
    return (
      <div className="meeting-shell">
        <p className="meeting-empty-state">O roteiro de {product.title} ainda está em preparação.</p>
        <button type="button" className="meeting-back-link" onClick={() => navigate('/scripts')}>← Scripts de Reunião</button>
      </div>
    );
  }

  function set<K extends keyof MeetingSetupInfo>(key: K, value: MeetingSetupInfo[K]) {
    setSetup((s) => ({ ...s, [key]: value }));
  }

  async function handleStart() {
    setStarting(true);
    const meeting = await startMeeting(product!.id, setup);
    navigate(`/scripts/${product!.id}/call/${meeting.id}`);
  }

  return (
    <div className="meeting-shell">
      <button type="button" className="meeting-back-link" onClick={() => navigate('/scripts')}>← Scripts de Reunião</button>

      <div className="meeting-overview-head">
        <h1 className="meeting-overview-title">{product.title}</h1>
        <p className="meeting-overview-objective">{product.objective}</p>
      </div>

      <div className="setup-form">
        <div className="notes-field-grid">
          <label className="notes-field">
            <span>Cliente</span>
            <input type="text" value={setup.client} onChange={(e) => set('client', e.target.value)} />
          </label>
          <label className="notes-field">
            <span>Empresa</span>
            <input type="text" value={setup.company} onChange={(e) => set('company', e.target.value)} />
          </label>
          <label className="notes-field">
            <span>Responsável ABZA</span>
            <input type="text" value={setup.owner} onChange={(e) => set('owner', e.target.value)} />
          </label>
          <label className="notes-field">
            <span>Data</span>
            <input type="date" value={setup.date} onChange={(e) => set('date', e.target.value)} />
          </label>
          <label className="notes-field">
            <span>Participantes</span>
            <input type="text" value={setup.participants} onChange={(e) => set('participants', e.target.value)} placeholder="Quem estará na call" />
          </label>
          <label className="notes-field">
            <span>Origem da oportunidade</span>
            <input type="text" value={setup.origin} onChange={(e) => set('origin', e.target.value)} placeholder="Indicação, inbound, prospecção..." />
          </label>
        </div>
        <label className="notes-field full">
          <span>Observação prévia (opcional)</span>
          <textarea value={setup.note} onChange={(e) => set('note', e.target.value)} placeholder="Algo que já sabe sobre esse cliente antes de começar..." />
        </label>
      </div>

      <ol className="meeting-overview-steps">
        {product.stages.map((stage, i) => (
          <li key={stage.id} className="meeting-overview-step">
            <span className="meeting-overview-step-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="meeting-overview-step-title">{stage.title}</span>
          </li>
        ))}
      </ol>

      <button type="button" className="meeting-start-btn" disabled={starting} onClick={handleStart}>
        {starting ? 'Iniciando…' : 'Iniciar reunião →'}
      </button>
    </div>
  );
}
