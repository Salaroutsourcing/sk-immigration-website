import { useEffect, useState } from 'react';
import { api } from '../api';
import { COLLECTION_META, pathForCollection } from '../constants';
import type { Collection, DashboardPayload } from '../types';

export function Dashboard({
  onNavigate,
  toast,
}: {
  onNavigate: (href: string) => void;
  toast: (kind: 'ok' | 'err', text: string) => void;
}) {
  const [data, setData] = useState<DashboardPayload | null>(null);
  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((err) => toast('err', err instanceof Error ? err.message : 'Dashboard failed'));
  }, [toast]);

  if (!data) {
    return (
      <div className="grid-3">
        {[0, 1, 2].map((n) => (
          <div className="card" key={n}>
            <div className="skel" />
          </div>
        ))}
      </div>
    );
  }

  const cards: { key: Collection; label: string; target: number }[] = [
    { key: 'news', label: 'News', target: data.targets.news },
    { key: 'web-stories', label: 'Web Stories', target: data.targets['web-stories'] },
    { key: 'blog', label: 'Blog', target: data.targets.blog },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Today’s desk</h1>
          <p>
            {data.today} · daily machine is 5 news, 5 stories, 1 blog.
          </p>
        </div>
      </div>
      <div className="grid-3">
        {cards.map((card) => {
          const c = data.counts[card.key];
          const pct = Math.min(100, Math.round((c.today / card.target) * 100));
          return (
            <button
              key={card.key}
              type="button"
              className="card stat"
              onClick={() => onNavigate(pathForCollection(card.key))}
            >
              <div className="label">{card.label}</div>
              <div className="num">
                {c.today}
                <span style={{ fontSize: 16, color: 'var(--faint)' }}> / {card.target}</span>
              </div>
              <div className="sub">
                {c.published} published · {c.drafts} drafts
              </div>
              <div className="meter">
                <span style={{ width: `${pct}%` }} />
              </div>
            </button>
          );
        })}
      </div>
      <div className="quick-row">
        <a className="quick" href="/studio/news/new" onClick={(e) => (e.preventDefault(), onNavigate('/studio/news/new'))}>
          <span className="mark">N</span>
          <div>
            <strong>New News</strong>
            <div className="hint">Brief + official source</div>
          </div>
        </a>
        <a className="quick" href="/studio/blog/new" onClick={(e) => (e.preventDefault(), onNavigate('/studio/blog/new'))}>
          <span className="mark">B</span>
          <div>
            <strong>New Blog</strong>
            <div className="hint">Long guide · 3 FAQs min</div>
          </div>
        </a>
        <a
          className="quick"
          href="/studio/stories/new"
          onClick={(e) => (e.preventDefault(), onNavigate('/studio/stories/new'))}
        >
          <span className="mark">S</span>
          <div>
            <strong>New Web Story</strong>
            <div className="hint">Must land on a blog</div>
          </div>
        </a>
      </div>
      <div className="grid-2">
        <section className="card">
          <h2>Recent content</h2>
          {!data.recent.length && <div className="empty">Nothing in Studio yet.</div>}
          {data.recent.map((row) => (
            <button
              key={row.id}
              type="button"
              className="row"
              style={{ width: '100%', border: 0, background: 'transparent' }}
              onClick={() => onNavigate(pathForCollection(row.collection, row.id))}
            >
              <span className={`badge ${row.collection}`}>{COLLECTION_META[row.collection].label}</span>
              <span style={{ textAlign: 'left', fontWeight: 600 }}>{row.title}</span>
              <span className={`badge ${row.status}`}>{row.status}</span>
              <span className="hint">{row.updated_at.slice(0, 10)}</span>
            </button>
          ))}
        </section>
        <section className="card">
          <h2>Keyword wins</h2>
          {!data.keywords.length && <p className="hint">Seeded from the site taxonomy on first load.</p>}
          {data.keywords.map((k) => (
            <div key={k.keyword} className="row" style={{ gridTemplateColumns: '1fr auto' }}>
              <div>
                <strong>{k.keyword}</strong>
                <div className="hint">{k.cluster}</div>
              </div>
              <span className="badge">{k.status}</span>
            </div>
          ))}
          <button className="btn btn-sm" type="button" style={{ marginTop: 12 }} onClick={() => onNavigate('/studio/keywords')}>
            Open keywords
          </button>
        </section>
      </div>
    </>
  );
}
