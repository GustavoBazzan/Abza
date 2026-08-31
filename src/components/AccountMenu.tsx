interface AccountMenuProps {
  userEmail?: string;
  onSignOut: () => void;
  className?: string;
}

/** Renderizado nas 3 áreas autenticadas (Sidebar/MobileNav do Playbook,
 *  MeetingTopBar de Scripts/Reuniões) — nunca no Modo Call em si, que
 *  mantém chrome mínimo de propósito durante a call. */
export function AccountMenu({ userEmail, onSignOut, className }: AccountMenuProps) {
  return (
    <div className={`account-menu${className ? ` ${className}` : ''}`}>
      {userEmail && <span className="account-menu-email">{userEmail}</span>}
      <button type="button" className="account-menu-signout" onClick={onSignOut}>Sair</button>
    </div>
  );
}
