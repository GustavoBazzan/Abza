import { Symbol } from '../components/Brand';
import { AreaSwitcher } from '../components/AreaSwitcher';

interface MeetingTopBarProps {
  navigate: (path: string) => void;
  backTo?: { label: string; path: string };
}

export function MeetingTopBar({ navigate, backTo }: MeetingTopBarProps) {
  return (
    <header className="meeting-topbar">
      <div className="meeting-topbar-brand">
        <Symbol size={18} color="var(--abza-red)" />
        <span className="meeting-topbar-label">Scripts de Reunião</span>
      </div>
      {backTo && (
        <button type="button" className="meeting-back-link" onClick={() => navigate(backTo.path)}>
          ← {backTo.label}
        </button>
      )}
      <AreaSwitcher active="scripts" onNavigate={navigate} className="meeting-topbar-switcher" />
    </header>
  );
}
