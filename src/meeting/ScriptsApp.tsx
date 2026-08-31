import type { Route } from '../router';
import { MeetingTopBar } from './MeetingTopBar';
import { ProductsHome } from './ProductsHome';
import { MeetingSetup } from './MeetingSetup';
import { CallMode } from './CallMode';

interface ScriptsAppProps {
  route: Extract<Route, { name: 'scripts-home' | 'meeting-setup' | 'call-mode' }>;
  navigate: (path: string) => void;
  onSignOut?: () => void;
  userEmail?: string;
}

export function ScriptsApp({ route, navigate, onSignOut, userEmail }: ScriptsAppProps) {
  if (route.name === 'call-mode') {
    // Modo Call owns its own minimal chrome — no top bar, to stay out of the way during a live meeting.
    return <CallMode productId={route.productId} meetingId={route.meetingId} navigate={navigate} />;
  }

  return (
    <div className="meeting-app">
      <MeetingTopBar
        navigate={navigate}
        active="scripts"
        label="Scripts de Reunião"
        backTo={route.name !== 'scripts-home' ? { label: 'Scripts de Reunião', path: '/scripts' } : undefined}
        onSignOut={onSignOut}
        userEmail={userEmail}
      />
      {route.name === 'scripts-home' && <ProductsHome navigate={navigate} />}
      {route.name === 'meeting-setup' && <MeetingSetup productId={route.productId} navigate={navigate} />}
    </div>
  );
}
