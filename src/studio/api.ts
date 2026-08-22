import type {
  Collection,
  DashboardPayload,
  StudioEntry,
  StudioKeyword,
  StudioMedia,
  StudioUser,
} from './types';

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { 'content-type': 'application/json' }),
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    (err as Error & { status?: number; login?: boolean }).status = res.status;
    (err as Error & { login?: boolean }).login = Boolean(data.login);
    throw err;
  }
  return data as T;
}

export const api = {
  me: () =>
    req<{
      user: StudioUser | null;
      auth: { githubConfigured: boolean; passwordConfigured: boolean; publishConfigured: boolean };
    }>('/api/studio/me'),
  loginPassword: (password: string) => req<{ ok: boolean }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: () => req<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  dashboard: () => req<DashboardPayload>('/api/studio/dashboard'),
  entries: (collection?: Collection, q?: string) => {
    const params = new URLSearchParams();
    if (collection) params.set('collection', collection);
    if (q) params.set('q', q);
    const qs = params.toString();
    return req<{ entries: Omit<StudioEntry, 'data' | 'body'>[] }>(`/api/studio/entries${qs ? `?${qs}` : ''}`);
  },
  entry: (id: string) => req<{ entry: StudioEntry }>(`/api/studio/entries/${id}`),
  create: (payload: unknown) =>
    req<{ entry: StudioEntry }>('/api/studio/entries', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: unknown) =>
    req<{ entry: StudioEntry }>(`/api/studio/entries/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id: string) => req<{ ok: boolean }>(`/api/studio/entries/${id}`, { method: 'DELETE' }),
  duplicate: (id: string) =>
    req<{ entry: StudioEntry }>(`/api/studio/entries/${id}/duplicate`, { method: 'POST' }),
  publish: (id: string) =>
    req<{ entry: StudioEntry; publishedToGithub: boolean; path: string }>(
      `/api/studio/entries/${id}/publish`,
      { method: 'POST' },
    ),
  media: () => req<{ media: StudioMedia[] }>('/api/studio/media'),
  upload: (file: File, alt = '') => {
    const body = new FormData();
    body.append('file', file);
    body.append('alt', alt);
    return req<{ media: StudioMedia; storedInGithub: boolean }>('/api/studio/media', { method: 'POST', body });
  },
  deleteMedia: (id: string) => req<{ ok: boolean }>(`/api/studio/media/${id}`, { method: 'DELETE' }),
  keywords: () => req<{ keywords: StudioKeyword[] }>('/api/studio/keywords'),
  upsertKeyword: (payload: unknown) =>
    req<{ keyword: StudioKeyword }>('/api/studio/keywords', { method: 'POST', body: JSON.stringify(payload) }),
  deleteKeyword: (id: string) => req<{ ok: boolean }>(`/api/studio/keywords/${id}`, { method: 'DELETE' }),
  settings: () =>
    req<{
      repo: string;
      branch: string;
      githubOAuth: boolean;
      passwordFallback: boolean;
      publishReady: boolean;
      timezone?: string;
      targets?: { news: number; 'web-stories': number; blog: number };
      user: StudioUser;
    }>('/api/studio/settings'),
};
