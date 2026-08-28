import { Symbol } from '../components/Brand';
import { AreaSwitcher } from '../components/AreaSwitcher';

interface MeetingTopBarProps {
  navigate: (path: string) => void;
  active: 'scripts' | 'reunioes';
  label: string;
  backTo?: { label: string; path: string };
}

export function MeetingTopBar({ navigate, active, label, backTo }: MeetingTopBarProps) {
  return (
    <header className="meeting-topbar">
      <div className="meeting-topbar-brand">
        <Symbol size={18} color="var(--abza-red)" />
        <span className="meeting-topbar-label">{label}</span>
      </div>
      {backTo && (
        <button type="button" className="meeting-back-link" onClick={() => navigate(backTo.path)}>
          ← {backTo.label}
        </button>
      )}
      <AreaSwitcher active={active} onNavigate={navigate} className="meeting-topbar-switcher" />
    </header>
  );
}
