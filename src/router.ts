import { useCallback, useEffect, useState } from 'react';

// Minimal hash-based router — no external dependency, works on any static host
// (Vercel included) without server-side rewrites. Uses a `#/...` prefix so it
// never collides with the Playbook's own in-page anchors (`#s00`..`#s10`),
// which are always followed by preventDefault() and never touch the hash.

export type Route =
  | { name: 'login' }
  | { name: 'playbook'; openTechniqueNum?: string }
  | { name: 'scripts-home' }
  | { name: 'meeting-setup'; productId: string }
  | { name: 'call-mode'; productId: string; meetingId: string }
  | { name: 'meetings-list' }
  | { name: 'meeting-detail'; meetingId: string };

function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean).map(decodeURIComponent);

  if (parts[0] === 'login') {
    return { name: 'login' };
  }

  if (parts[0] === 'scripts') {
    if (parts.length < 2) return { name: 'scripts-home' };
    const productId = parts[1];
    if (parts[2] === 'call') {
      // No meeting id (stale link / manual edit) — land on setup instead of crashing.
      if (parts[3]) return { name: 'call-mode', productId, meetingId: parts[3] };
      return { name: 'meeting-setup', productId };
    }
    return { name: 'meeting-setup', productId };
  }

  if (parts[0] === 'reunioes') {
    if (parts[1]) return { name: 'meeting-detail', meetingId: parts[1] };
    return { name: 'meetings-list' };
  }

  if (parts[0] === 'playbook') {
    const openTechniqueNum = parts[1] === 'tecnica' ? parts[2] : undefined;
    return { name: 'playbook', openTechniqueNum };
  }

  return { name: 'playbook' };
}

export function routePath(route: Route): string {
  switch (route.name) {
    case 'login': return '/login';
    case 'scripts-home': return '/scripts';
    case 'meeting-setup': return `/scripts/${route.productId}`;
    case 'call-mode': return `/scripts/${route.productId}/call/${route.meetingId}`;
    case 'meetings-list': return '/reunioes';
    case 'meeting-detail': return `/reunioes/${route.meetingId}`;
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
