import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from './api';
import { CommandPalette } from './components/CommandPalette';
import { Login } from './components/Login';
import { Shell } from './components/Shell';
import { ToastStack, type ToastItem } from './components/Toast';
import { collectionFromPath } from './constants';
import { ContentList } from './pages/ContentList';
import { Dashboard } from './pages/Dashboard';
import { EntryEditor } from './pages/EntryEditor';
import { Keywords } from './pages/Keywords';
import { MediaLibrary } from './pages/Media';
import { Settings } from './pages/Settings';
import type { StudioUser } from './types';

function readPath() {
  return window.location.pathname.replace(/\/+$/, '') || '/studio';
}

function parseRoute(path: string) {
  const clean = path.endsWith('/') && path !== '/studio/' ? path.slice(0, -1) : path;
  const parts = clean.split('/').filter(Boolean);
  // ['studio', ...]
  const rest = parts.slice(1);
  const section = rest[0] || '';
  const second = rest[1] || '';
  return { section, second, isLogin: section === 'login' };
}

export default function StudioApp() {
  const [path, setPath] = useState('/studio');
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<StudioUser | null>(null);
  const [auth, setAuth] = useState({ githubConfigured: false, passwordConfigured: false });
  const [apiOnline, setApiOnline] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [navOpen, setNavOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((kind: 'ok' | 'err', text: string) => {
    const id = crypto.randomUUID();
    setToasts((list) => [...list, { id, kind, text }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4200);
  }, []);

  const refreshMe = useCallback(async () => {
    const me = await api.me();
    setUser(me.user);
    setAuth(me.auth);
    setApiOnline(true);
    return me.user;
  }, []);

  const navigate = useCallback((href: string) => {
    const next = href.startsWith('/studio') ? href : `/studio${href}`;
    window.history.pushState({}, '', next);
    setPath(readPath());
    setNavOpen(false);
    setPalette(false);
  }, []);

  useEffect(() => {
    setPath(readPath());
    const stored = localStorage.getItem('sk-studio-theme');
    const next =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    refreshMe()
      .catch(() => {
        setUser(null);
        setApiOnline(false);
      })
      .finally(() => setReady(true));
  }, [refreshMe]);

  useEffect(() => {
    const onPop = () => setPath(readPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    let pending = '';
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((v) => !v);
        return;
      }
      if (e.key === '/' && !typing) {
        e.preventDefault();
        setPalette(true);
        return;
      }
      if (e.key === 'Escape') {
        setPalette(false);
        setNavOpen(false);
      }
      if (typing) return;
      if (e.key.toLowerCase() === 'g') {
        pending = 'g';
        window.setTimeout(() => (pending = ''), 600);
        return;
      }
      if (pending === 'g') {
        pending = '';
        const map: Record<string, string> = {
          d: '/studio/',
          n: '/studio/news',
          b: '/studio/blog',
          s: '/studio/stories',
          m: '/studio/media',
          k: '/studio/keywords',
          ',': '/studio/settings',
        };
        if (map[e.key.toLowerCase()]) {
          e.preventDefault();
          navigate(map[e.key.toLowerCase()]);
        }
      }
      if (e.key.toLowerCase() === 'c') {
        pending = 'c';
        window.setTimeout(() => (pending = ''), 600);
        return;
      }
      if (pending === 'c') {
        pending = '';
        const map: Record<string, string> = {
          n: '/studio/news/new',
          b: '/studio/blog/new',
          s: '/studio/stories/new',
        };
        if (map[e.key.toLowerCase()]) {
          e.preventDefault();
          navigate(map[e.key.toLowerCase()]);
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const route = useMemo(() => parseRoute(path === '/studio' ? '/studio/' : path), [path]);

  async function logout() {
    await api.logout();
    setUser(null);
    navigate('/studio/login');
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sk-studio-theme', next);
    document.documentElement.dataset.theme = next;
  }

  if (!ready) {
    return (
      <div className="login-screen">
        <div className="skel" style={{ width: 240 }} />
      </div>
    );
  }

  const needsAuth = !user;
  if (needsAuth) {
    return (
      <>
        <Login
          githubConfigured={auth.githubConfigured}
          passwordConfigured={auth.passwordConfigured}
          apiOnline={apiOnline}
          onPasswordOk={() => {
            void refreshMe().then(() => navigate('/studio/'));
          }}
        />
        <ToastStack toasts={toasts} onDismiss={(id) => setToasts((list) => list.filter((t) => t.id !== id))} />
      </>
    );
  }

  const collection = collectionFromPath(path.startsWith('/studio') ? path : '/studio/');
  const isNew = Boolean(collection && route.second === 'new');
  const isEditor = Boolean(collection && route.second && route.second !== 'new');

  let page: ReactNode = <Dashboard onNavigate={navigate} toast={toast} />;
  if (route.section === 'media') page = <MediaLibrary toast={toast} />;
  else if (route.section === 'keywords') page = <Keywords toast={toast} />;
  else if (route.section === 'settings') page = <Settings toast={toast} />;
  else if (collection && isNew) {
    page = <EntryEditor collection={collection} isNew onNavigate={navigate} toast={toast} />;
  } else if (collection && isEditor) {
    page = <EntryEditor collection={collection} id={route.second} isNew={false} onNavigate={navigate} toast={toast} />;
  } else if (collection) {
    page = <ContentList collection={collection} onNavigate={navigate} toast={toast} />;
  }

  return (
    <div className="studio-app">
      <Shell
        path={path.startsWith('/studio') ? (path === '/studio' ? '/studio/' : path) : '/studio/'}
        user={user}
        theme={theme}
        navOpen={navOpen}
        onNavigate={navigate}
        onLogout={() => void logout()}
        onToggleTheme={toggleTheme}
        onToggleNav={() => setNavOpen((v) => !v)}
        onOpenPalette={() => setPalette(true)}
      >
        {page}
      </Shell>
      <CommandPalette open={palette} onClose={() => setPalette(false)} onNavigate={navigate} />
      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((list) => list.filter((t) => t.id !== id))} />
    </div>
  );
}
