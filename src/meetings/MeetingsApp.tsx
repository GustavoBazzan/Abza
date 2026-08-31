import type { Route } from '../router';
import { MeetingTopBar } from '../meeting/MeetingTopBar';
import { MeetingsList } from './MeetingsList';
import { MeetingDetail } from './MeetingDetail';

interface MeetingsAppProps {
  route: Extract<Route, { name: 'meetings-list' | 'meeting-detail' }>;
  navigate: (path: string) => void;
  onSignOut?: () => void;
  userEmail?: string;
}

export function MeetingsApp({ route, navigate, onSignOut, userEmail }: MeetingsAppProps) {
  return (
    <div className="meeting-app">
      <MeetingTopBar
        navigate={navigate}
        active="reunioes"
        label="Reuniões"
        backTo={route.name !== 'meetings-list' ? { label: 'Reuniões', path: '/reunioes' } : undefined}
        onSignOut={onSignOut}
        userEmail={userEmail}
      />
      {route.name === 'meetings-list' && <MeetingsList navigate={navigate} />}
      {route.name === 'meeting-detail' && <MeetingDetail meetingId={route.meetingId} navigate={navigate} />}
    </div>
  );
}
