import { PRODUCTS } from '../data/products';

interface ProductsHomeProps {
  navigate: (path: string) => void;
}

export function ProductsHome({ navigate }: ProductsHomeProps) {
  return (
    <div className="meeting-shell">
      <div className="meeting-home-head">
        <span className="meeting-eyebrow">Modo Call</span>
        <h1 className="meeting-home-title">Qual solução você está vendendo?</h1>
        <p className="meeting-home-lede">Cada produto tem seu próprio roteiro comercial completo — do primeiro "por que agora?" até a tentativa de fechamento, na mesma call.</p>
      </div>

      <div className="meeting-script-grid">
        {PRODUCTS.map((p) => (
          <button
            type="button"
            key={p.id}
            className={`meeting-script-card${p.comingSoon ? ' coming-soon' : ''}`}
            disabled={p.comingSoon}
            onClick={() => navigate(`/scripts/${p.id}`)}
          >
            <div className="meeting-script-card-num">{String(p.order).padStart(2, '0')}</div>
            <div className="meeting-script-card-title">{p.title}</div>
            <div className="meeting-script-card-desc">{p.shortDescription}</div>
            <div className="meeting-script-card-foot">
              {p.comingSoon ? 'Em preparação' : `${p.stages.length} etapas · abrir ↗`}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
