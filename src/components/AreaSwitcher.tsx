interface AreaSwitcherProps {
  active: 'playbook' | 'scripts' | 'reunioes';
  onNavigate: (path: string) => void;
  className?: string;
}

const TABS: { id: AreaSwitcherProps['active']; label: string; path: string }[] = [
  { id: 'playbook', label: 'Playbook', path: '/playbook' },
  { id: 'scripts', label: 'Scripts', path: '/scripts' },
  { id: 'reunioes', label: 'Reuniões', path: '/reunioes' },
];

export function AreaSwitcher({ active, onNavigate, className }: AreaSwitcherProps) {
  return (
    <div className={`area-switcher${className ? ` ${className}` : ''}`}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`area-switcher-tab${active === tab.id ? ' active' : ''}`}
          onClick={() => onNavigate(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
