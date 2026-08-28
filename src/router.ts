import { useCallback, useEffect, useState } from 'react';

// Minimal hash-based router — no external dependency, works on any static host
// (Vercel included) without server-side rewrites. Uses a `#/...` prefix so it
// never collides with the Playbook's own in-page anchors (`#s00`..`#s10`),
// which are always followed by preventDefault() and never touch the hash.

export type Route =
  | { name: 'playbook'; openTechniqueNum?: string }
  | { name: 'scripts-home' }
  | { name: 'script-overview'; scriptId: string }
  | { name: 'script-call'; scriptId: string }
  | { name: 'script-summary'; scriptId: string };

function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean).map(decodeURIComponent);

  if (parts[0] === 'scripts') {
    if (parts.length < 2) return { name: 'scripts-home' };
    const scriptId = parts[1];
    if (parts[2] === 'call') return { name: 'script-call', scriptId };
    if (parts[2] === 'resumo') return { name: 'script-summary', scriptId };
    return { name: 'script-overview', scriptId };
  }

  if (parts[0] === 'playbook') {
    const openTechniqueNum = parts[1] === 'tecnica' ? parts[2] : undefined;
    return { name: 'playbook', openTechniqueNum };
  }

  return { name: 'playbook' };
}

export function routePath(route: Route): string {
  switch (route.name) {
    case 'scripts-home': return '/scripts';
    case 'script-overview': return `/scripts/${route.scriptId}`;
    case 'script-call': return `/scripts/${route.scriptId}/call`;
    case 'script-summary': return `/scripts/${route.scriptId}/resumo`;
    case 'playbook': return route.openTechniqueNum ? `/playbook/tecnica/${route.openTechniqueNum}` : '/playbook';
  }
}

export function useRoute(): [Route, (path: string) => void] {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    function onHashChange() {
      setRoute(parseHash(window.location.hash));
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  return [route, navigate];
}
