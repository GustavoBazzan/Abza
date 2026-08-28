import type { Route } from '../router';
import { useMeetingSession } from './useMeetingSession';
import { MeetingTopBar } from './MeetingTopBar';
import { ScriptsHome } from './ScriptsHome';
import { ScriptOverview } from './ScriptOverview';
import { CallMode } from './CallMode';
import { MeetingSummary } from './MeetingSummary';

interface ScriptsAppProps {
  route: Extract<Route, { name: 'scripts-home' | 'script-overview' | 'script-call' | 'script-summary' }>;
  navigate: (path: string) => void;
}

export function ScriptsApp({ route, navigate }: ScriptsAppProps) {
  const session = useMeetingSession();

  function startMeeting(scriptId: string) {
    // Resume in place if this script already has a meeting in progress —
    // re-entering the overview screen (e.g. after tapping "sair") must not
    // wipe notes already captured.
    const inProgress = session.meeting && session.meeting.scriptId === scriptId && !session.meeting.endedAt;
    if (!inProgress) session.start(scriptId);
    navigate(`/scripts/${scriptId}/call`);
  }

  if (route.name === 'script-call') {
    // Modo Call owns its own minimal chrome — no top bar, to stay out of the way during a live meeting.
    return <CallMode scriptId={route.scriptId} navigate={navigate} session={session} />;
  }

  return (
    <div className="meeting-app">
      <MeetingTopBar
        navigate={navigate}
        backTo={route.name !== 'scripts-home' ? { label: 'Scripts de Reunião', path: '/scripts' } : undefined}
      />
      {route.name === 'scripts-home' && <ScriptsHome navigate={navigate} />}
      {route.name === 'script-overview' && (
        <ScriptOverview scriptId={route.scriptId} navigate={navigate} onStart={startMeeting} />
      )}
      {route.name === 'script-summary' && (
        <MeetingSummary scriptId={route.scriptId} meeting={session.meeting} navigate={navigate} onReset={session.reset} />
      )}
    </div>
  );
}
