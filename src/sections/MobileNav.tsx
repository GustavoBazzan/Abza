import { useEffect, useState } from 'react';
import { Logo, Symbol } from '../components/Brand';
import { AreaSwitcher } from '../components/AreaSwitcher';
import { NAV } from '../data/content';

interface MobileNavProps {
  active: number;
  progress: number;
  onNavigate: (id: string) => void;
  onNavigateArea: (path: string) => void;
}

export function MobileNav({ active, progress, onNavigate, onNavigateArea }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pct = Math.round(progress * 100);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  function go(id: string) {
    setOpen(false);
    // Closing the panel restores the scroll position it had when it opened
    // (see the scroll-lock effect above). Defer the actual navigation two
    // frames so that restore's effect cleanup runs first and doesn't cancel
    // this scroll.
    requestAnimationFrame(() => requestAnimationFrame(() => onNavigate(id)));
  }

  return (
    <>
      <div className="mobile-topbar">
        <div className="mobile-topbar-brand">
          <Symbol size={18} color="var(--abza-red)" />
          <span className="mobile-topbar-label">Sales Playbook</span>
        </div>
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
        </button>
        <div className="mobile-topbar-progress">
          <div className="mobile-topbar-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {open && (
        <div className="mobile-nav-panel" onClick={() => setOpen(false)}>
          <div className="mobile-nav-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-head">
              <Logo height={22} />
              <button type="button" className="modal-close" aria-label="Fechar menu" onClick={() => setOpen(false)}>✕</button>
            </div>

            <AreaSwitcher active="playbook" onNavigate={onNavigateArea} className="mobile-nav-area-switcher" />

            <nav className="mobile-nav-list">
              {NAV.map((item, i) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-item${i === active ? ' active' : ''}`}
                  onClick={(e) => { e.preventDefault(); go(item.id); }}
                >
                  <span className="nav-item-num">{item.num}</span>
                  <span className="nav-item-label">{item.label}</span>
                </a>
              ))}
            </nav>

            <div className="mobile-nav-progress">
              <div className="sidebar-progress-row">
                <span className="eyebrow-mono">Progresso</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-900)' }}>{pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
