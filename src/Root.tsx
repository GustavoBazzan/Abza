import App from './App';
import { ScriptsApp } from './meeting/ScriptsApp';
import { useRoute } from './router';

export default function Root() {
  const [route, navigate] = useRoute();

  if (route.name === 'playbook') {
    return <App onNavigateArea={navigate} openTechniqueNum={route.openTechniqueNum} />;
  }

  return <ScriptsApp route={route} navigate={navigate} />;
}
