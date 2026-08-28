interface AreaSwitcherProps {
  active: 'playbook' | 'scripts';
  onNavigate: (path: string) => void;
  className?: string;
}

export function AreaSwitcher({ active, onNavigate, className }: AreaSwitcherProps) {
  return (
    <div className={`area-switcher${className ? ` ${className}` : ''}`}>
      <button
        type="button"
        className={`area-switcher-tab${active === 'playbook' ? ' active' : ''}`}
        onClick={() => onNavigate('/playbook')}
      >
        Playbook
      </button>
      <button
        type="button"
        className={`area-switcher-tab${active === 'scripts' ? ' active' : ''}`}
        onClick={() => onNavigate('/scripts')}
      >
        Scripts de Reunião
      </button>
    </div>
  );
}
