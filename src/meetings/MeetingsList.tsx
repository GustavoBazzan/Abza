import { useMemo, useState } from 'react';
import { deriveMeetingStatus, MEETING_STATUS_LABEL, type MeetingStatus } from '../data/meeting';
import { getProduct } from '../data/products';
import { useMeetingsList } from '../meeting/useMeetingStore';

interface MeetingsListProps {
  navigate: (path: string) => void;
}

const STATUS_FILTERS: { id: MeetingStatus | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'em-andamento', label: 'Em andamento' },
  { id: 'proposta', label: 'Proposta' },
  { id: 'follow-up', label: 'Follow-up' },
  { id: 'ganho', label: 'Ganho' },
  { id: 'perdido', label: 'Perdido' },
];

export function MeetingsList({ navigate }: MeetingsListProps) {
  const { meetings, loading } = useMeetingsList();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | 'todos'>('todos');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return meetings.filter((m) => {
      const status = deriveMeetingStatus(m);
      if (statusFilter !== 'todos' && status !== statusFilter) return false;
      if (!q) return true;
      return (
        m.setup.client.toLowerCase().includes(q) ||
        m.setup.company.toLowerCase().includes(q) ||
        (getProduct(m.productId)?.title.toLowerCase() ?? '').includes(q)
      );
    });
  }, [meetings, query, statusFilter]);

  return (
    <div className="meeting-shell wide">
      <div className="meeting-home-head">
        <span className="meeting-eyebrow">Histórico</span>
        <h1 className="meeting-home-title">Reuniões</h1>
        <p className="meeting-home-lede">Todas as reuniões registradas, com o diagnóstico, escopo e próximo passo de cada uma.</p>
      </div>

      <div className="meetings-filters">
        <input
          type="text"
          className="meetings-search"
          placeholder="Buscar por cliente, empresa ou produto…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="cat-tabs">
          {STATUS_FILTERS.map((f) => (
            <button key={f.id} type="button" className={`cat-tab${statusFilter === f.id ? ' active' : ''}`} onClick={() => setStatusFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="meeting-empty-state">Carregando…</p>
      ) : filtered.length === 0 ? (
        <p className="meeting-empty-state">Nenhuma reunião encontrada.{meetings.length === 0 && ' Inicie uma em "Scripts".'}</p>
      ) : (
        <div className="meetings-table">
          <div className="meetings-table-head">
            <span>Empresa / Cliente</span>
            <span>Produto</span>
            <span>Data</span>
            <span>Responsável</span>
            <span>Status</span>
          </div>
          {filtered.map((m) => {
            const status = deriveMeetingStatus(m);
            return (
              <button type="button" key={m.id} className="meetings-table-row" onClick={() => navigate(`/reunioes/${m.id}`)}>
                <span className="meetings-row-client">
                  <strong>{m.setup.company || '—'}</strong>
                  <small>{m.setup.client || '—'}</small>
                </span>
                <span>{getProduct(m.productId)?.title ?? m.productId}</span>
                <span>{m.setup.date || '—'}</span>
                <span>{m.setup.owner || '—'}</span>
                <span><span className={`status-pill status-${status}`}>{MEETING_STATUS_LABEL[status]}</span></span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
