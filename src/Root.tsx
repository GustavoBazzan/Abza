import { useEffect } from 'react';
import App from './App';
import { ScriptsApp } from './meeting/ScriptsApp';
import { MeetingsApp } from './meetings/MeetingsApp';
import { useRoute } from './router';
import { useAuth } from './auth/useAuth';
import { LoginPage } from './auth/LoginPage';
import { Symbol } from './components/Brand';

export default function Root() {
  const [route, navigate] = useRoute();
  const { authEnabled, session, loading, signIn, signOut, user } = useAuth();
  const isAuthenticated = !authEnabled || !!session;

  // Keeps the URL itself correct (#/login when signed out, bounced away from
  // #/login once signed in) instead of just swapping what renders — matches
  // "usuário não autenticado deve ir para /login" literally, and means a
  // stale bookmark to a protected page after sign-out lands on /login too.
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated && route.name !== 'login') {
      navigate('/login');
    } else if (isAuthenticated && route.name === 'login') {
      navigate('/playbook');
    }
  }, [isAuthenticated, loading, route.name, navigate]);

  if (authEnabled && loading) {
    return (
      <div className="login-shell">
        <Symbol size={32} color="var(--abza-red)" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Renders directly rather than waiting for the effect above to fire the
    // hash change, so the form appears on the same tick sign-out happens.
    return <LoginPage onSignIn={signIn} />;
  }

  if (route.name === 'login') {
    // Already authenticated (or auth disabled) — the effect above is
    // navigating away; render nothing for this one tick.
    return null;
  }

  const onSignOut = authEnabled ? signOut : undefined;
  const userEmail = user?.email;

  if (route.name === 'playbook') {
    return (
      <App
        onNavigateArea={navigate}
        openTechniqueNum={route.openTechniqueNum}
        onSignOut={onSignOut}
        userEmail={userEmail}
      />
    );
  }

  if (route.name === 'meetings-list' || route.name === 'meeting-detail') {
    return <MeetingsApp route={route} navigate={navigate} onSignOut={onSignOut} userEmail={userEmail} />;
  }

  return <ScriptsApp route={route} navigate={navigate} onSignOut={onSignOut} userEmail={userEmail} />;
}
