import taxonomy from '../data/taxonomy.json';
import { BLOG_CATEGORIES, NEWS_CATEGORIES, STORY_CATEGORIES } from '../lib/site';
import type { Collection } from './types';

export const NAV = [
  { href: '/studio/', id: 'dashboard', label: 'Dashboard', kbd: 'G D' },
  { href: '/studio/news', id: 'news', label: 'News', kbd: 'G N' },
  { href: '/studio/blog', id: 'blog', label: 'Blog', kbd: 'G B' },
  { href: '/studio/stories', id: 'stories', label: 'Web Stories', kbd: 'G S' },
  { href: '/studio/media', id: 'media', label: 'Media', kbd: 'G M' },
  { href: '/studio/keywords', id: 'keywords', label: 'Keywords', kbd: 'G K' },
  { href: '/studio/settings', id: 'settings', label: 'Settings', kbd: 'G ,' },
] as const;

export const COLLECTION_META: Record<
  Collection,
  { label: string; path: string; publicBase: string; categories: readonly string[] }
> = {
  news: { label: 'News', path: '/studio/news', publicBase: '/news', categories: NEWS_CATEGORIES },
  blog: { label: 'Blog', path: '/studio/blog', publicBase: '/blog', categories: BLOG_CATEGORIES },
  'web-stories': {
    label: 'Web Stories',
    path: '/studio/stories',
    publicBase: '/stories',
    categories: STORY_CATEGORIES,
  },
};

export const TAXONOMY_TAGS = taxonomy.tags;
export const TAXONOMY_KEYWORDS = taxonomy.keywords;

export function collectionFromPath(pathname: string): Collection | null {
  const path = pathname.split('?')[0];
  if (path.startsWith('/studio/news')) return 'news';
  if (path.startsWith('/studio/blog')) return 'blog';
  if (path.startsWith('/studio/stories')) return 'web-stories';
  return null;
}

export function pathForCollection(collection: Collection, id?: string, isNew = false): string {
  const base = COLLECTION_META[collection].path;
  if (isNew) return `${base}/new`;
  if (id) return `${base}/${id}`;
  return base;
}
