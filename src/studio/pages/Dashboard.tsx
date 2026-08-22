import { useEffect, useState } from 'react';
import { api } from '../api';
import { COLLECTION_META, pathForCollection } from '../constants';
import type { Collection, DashboardPayload, SopSlot } from '../types';

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
    { key: 'blog', label: 'Blog', target: data.targets.blog },
    { key: 'news', label: 'News', target: data.targets.news },
    { key: 'web-stories', label: 'Web Stories', target: data.targets['web-stories'] },
  ];

  const remainingTotal = data.remaining.blog + data.remaining.news + data.remaining['web-stories'];

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Today’s desk</h1>
          <p>
            {data.today} {data.timezone} · {data.sop.theme || 'Daily 5 news, 5 stories, 1 blog'}
          </p>
        </div>
        <div className="actions">
          <span className={`badge ${data.complete ? 'published' : 'draft'}`}>
            {data.complete ? 'Quota done' : `${remainingTotal} left today`}
          </span>
        </div>
      </div>

      <ol className="sop-steps">
        <li>
          <strong>1. Blog first.</strong> Stories need this URL. Write the long guide, 3 FAQs, then Publish.
        </li>
        <li>
          <strong>2. Five news briefs.</strong> Each needs an official https source. No visa guarantees.
        </li>
        <li>
          <strong>3. Five Web Stories.</strong> Last slide must open today’s blog, not WhatsApp alone.
        </li>
        <li>
          <strong>4. Wait for deploy.</strong> After Publish, GitHub Actions rebuilds the live site. Then open the public URL.
        </li>
      </ol>

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

      <section className="card sop-plan">
        <h2>
          Today’s plan · {data.sop.weekday}
          {data.complete ? ' · complete' : ''}
        </h2>
        <p className="hint" style={{ marginTop: -8, marginBottom: 14 }}>
          Click Start. Edit the facts. Publish only after the checklist on the editor is clear. Skip a slot rather than invent a fee.
        </p>
        {data.sop.blog ? (
          <SlotRow
            kicker="Blog · do this first"
            slot={data.sop.blog}
            onStart={() => onNavigate('/studio/blog/new?slot=blog')}
          />
        ) : (
          <p className="hint">Today’s blog quota is filled.</p>
        )}
        {data.sop.news.map((slot, i) => (
          <SlotRow
            key={slot.id}
            kicker={`News ${i + 1 + (data.targets.news - data.remaining.news)}`}
            slot={slot}
            onStart={() => onNavigate(`/studio/news/new?slot=${slot.id}`)}
          />
        ))}
        {data.sop.stories.map((slot, i) => (
          <SlotRow
            key={slot.id}
            kicker={`Story ${i + 1 + (data.targets['web-stories'] - data.remaining['web-stories'])}`}
            slot={slot}
            onStart={() => onNavigate(`/studio/stories/new?slot=${slot.id}`)}
          />
        ))}
      </section>

      <div className="grid-2">
        <section className="card">
          <h2>Published today</h2>
          {!data.todayEntries.length && <div className="empty">Nothing published yet today (PKT).</div>}
          {data.todayEntries.map((row) => (
            <button
              key={row.id}
              type="button"
              className="row"
              style={{ width: '100%', border: 0, background: 'transparent' }}
              onClick={() => onNavigate(pathForCollection(row.collection, row.id))}
            >
              <span className={`badge ${row.collection}`}>{COLLECTION_META[row.collection].label}</span>
              <span style={{ textAlign: 'left', fontWeight: 600 }}>{row.title}</span>
              <span className="hint">{COLLECTION_META[row.collection].publicBase}/{row.slug}/</span>
            </button>
          ))}
        </section>
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
      </div>
    </>
  );
}

function SlotRow({
  kicker,
  slot,
  onStart,
}: {
  kicker: string;
  slot: SopSlot;
  onStart: () => void;
}) {
  return (
    <div className="sop-slot">
      <div>
        <div className="sop-kicker">{kicker}</div>
        <strong>{slot.title}</strong>
        <div className="hint">{slot.angle}</div>
      </div>
      <button className="btn btn-gold btn-sm" type="button" onClick={onStart}>
        Start
      </button>
    </div>
  );
}
