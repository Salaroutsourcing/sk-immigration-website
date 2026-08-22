import type { ReactNode } from 'react';
import { NAV } from '../constants';
import type { StudioUser } from '../types';
import {
  IconBlog,
  IconDash,
  IconGear,
  IconKey,
  IconMedia,
  IconMenu,
  IconMoon,
  IconNews,
  IconStory,
  IconSun,
} from './Icons';

const ICONS = {
  dashboard: IconDash,
  news: IconNews,
  blog: IconBlog,
  stories: IconStory,
  media: IconMedia,
  keywords: IconKey,
  settings: IconGear,
};

function activeId(path: string) {
  const pathname = path.split('?')[0];
  if (pathname.startsWith('/studio/news')) return 'news';
  if (pathname.startsWith('/studio/blog')) return 'blog';
  if (pathname.startsWith('/studio/stories')) return 'stories';
  if (pathname.startsWith('/studio/media')) return 'media';
  if (pathname.startsWith('/studio/keywords')) return 'keywords';
  if (pathname.startsWith('/studio/settings')) return 'settings';
  return 'dashboard';
}

function titleFor(path: string) {
  const id = activeId(path);
  return NAV.find((n) => n.id === id)?.label || 'Studio';
}

export function Shell({
  path,
  user,
  theme,
  navOpen,
  children,
  onNavigate,
  onLogout,
  onToggleTheme,
  onToggleNav,
  onOpenPalette,
}: {
  path: string;
  user: StudioUser;
  theme: 'light' | 'dark';
  navOpen: boolean;
  children: ReactNode;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  onToggleTheme: () => void;
  onToggleNav: () => void;
  onOpenPalette: () => void;
}) {
  const current = activeId(path);
  return (
    <div className="shell">
      {navOpen && <button className="overlay-nav" type="button" aria-label="Close menu" onClick={onToggleNav} />}
      <aside className={`sidebar ${navOpen ? 'open' : ''}`}>
        <a className="side-brand" href="/studio/" onClick={(e) => (e.preventDefault(), onNavigate('/studio/'))}>
          <img src="/assets/img/logo.jpg" alt="" />
          <div>
            <strong>SK Studio</strong>
            <span>5 news · 5 stories · 1 blog</span>
          </div>
        </a>
        <nav className="nav-group" aria-label="Studio">
          {NAV.map((item) => {
            const Icon = ICONS[item.id];
            return (
              <a
                key={item.id}
                href={item.href}
                className={`nav-item ${current === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.href);
                }}
              >
                <Icon />
                {item.label}
                <span className="nav-kbd">{item.kbd}</span>
              </a>
            );
          })}
        </nav>
        <div className="side-foot">
          <div className="user-chip">
            {user.avatar ? <img src={user.avatar} alt="" /> : <span className="avatar" />}
            <div className="meta">
              <strong>{user.name}</strong>
              <span>
                @{user.login} · {user.method}
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-block btn-sm" type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <button className="icon-btn mobile-toggle" type="button" aria-label="Menu" onClick={onToggleNav}>
            <IconMenu width={16} height={16} />
          </button>
          <div className="crumb">{titleFor(path)}</div>
          <button className="top-search" type="button" onClick={onOpenPalette}>
            Search or jump <kbd>/</kbd>
          </button>
          <button className="icon-btn" type="button" aria-label="Toggle theme" onClick={onToggleTheme}>
            {theme === 'dark' ? <IconSun width={16} height={16} /> : <IconMoon width={16} height={16} />}
          </button>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
