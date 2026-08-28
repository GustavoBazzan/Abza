import App from './App';
import { ScriptsApp } from './meeting/ScriptsApp';
import { MeetingsApp } from './meetings/MeetingsApp';
import { useRoute } from './router';

export default function Root() {
  const [route, navigate] = useRoute();

  if (route.name === 'playbook') {
    return <App onNavigateArea={navigate} openTechniqueNum={route.openTechniqueNum} />;
  }

  if (route.name === 'meetings-list' || route.name === 'meeting-detail') {
    return <MeetingsApp route={route} navigate={navigate} />;
  }

  return <ScriptsApp route={route} navigate={navigate} />;
}
