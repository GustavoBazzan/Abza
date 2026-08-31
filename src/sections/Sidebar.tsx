import { Logo } from '../components/Brand';
import { AreaSwitcher } from '../components/AreaSwitcher';
import { AccountMenu } from '../components/AccountMenu';
import { NAV } from '../data/content';

interface SidebarProps {
  active: number;
  progress: number;
  onNavigate: (id: string) => void;
  onNavigateArea: (path: string) => void;
  onSignOut?: () => void;
  userEmail?: string;
}

export function Sidebar({ active, progress, onNavigate, onNavigateArea, onSignOut, userEmail }: SidebarProps) {
  const pct = Math.round(progress * 100);
  return (
    <aside className="sidebar">
      <AreaSwitcher active="playbook" onNavigate={onNavigateArea} className="sidebar-area-switcher" />
      <div className="sidebar-brand">
        <Logo height={26} />
        <div className="sidebar-brand-label">Sales Playbook<br />Ed. 2026 · Uso interno</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-item${i === active ? ' active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
          >
            <span className="nav-item-num">{item.num}</span>
            <span className="nav-item-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-progress">
        <div className="sidebar-progress-row">
          <span className="eyebrow-mono">Progresso</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-900)' }}>{pct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {onSignOut && <AccountMenu userEmail={userEmail} onSignOut={onSignOut} className="sidebar-account-menu" />}
    </aside>
  );
}
