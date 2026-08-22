import { useEffect, useState } from 'react';
import { api } from '../api';
import { COLLECTION_META, pathForCollection } from '../constants';
import { entryFromSlot, planForDate } from '../sop';
import type { Collection, StudioEntrySummary } from '../types';

export function ContentList({
  collection,
  onNavigate,
  toast,
}: {
  collection: Collection;
  onNavigate: (href: string) => void;
  toast: (kind: 'ok' | 'err', text: string) => void;
}) {
  const meta = COLLECTION_META[collection];
  const [rows, setRows] = useState<StudioEntrySummary[] | null>(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  async function load(query = q) {
    try {
      const res = await api.entries(collection, query);
      setRows(res.entries as StudioEntrySummary[]);
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Could not load');
    }
  }

  useEffect(() => {
    setRows(null);
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  async function duplicate(id: string) {
    setBusy(id);
    try {
      const res = await api.duplicate(id);
      toast('ok', 'Duplicated as a draft template');
      onNavigate(pathForCollection(collection, res.entry.id));
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Duplicate failed');
    } finally {
      setBusy(null);
    }
  }

  async function fromTemplate() {
    const plan = planForDate();
    const slot =
      collection === 'blog' ? plan.blog : collection === 'news' ? plan.news[0] : plan.stories[0];
    const t = entryFromSlot(collection, slot);
    try {
      const res = await api.create({
        collection,
        slug: slot.slug || `${collection}-template-${Date.now().toString(36)}`,
        data: t.data,
        body: t.body,
      });
      toast('ok', `Started from today’s ${plan.theme} slot`);
      onNavigate(pathForCollection(collection, res.entry.id));
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Template failed');
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{meta.label}</h1>
          <p>
            Public URLs live at {meta.publicBase}/. Today’s desk has the 5+5+1 slots. Duplicate yesterday only when the intent is new.
          </p>
        </div>
        <div className="actions">
          <button className="btn" type="button" onClick={fromTemplate}>
            Use template
          </button>
          <button className="btn btn-gold" type="button" onClick={() => onNavigate(pathForCollection(collection, undefined, true))}>
            New {meta.label.replace(/s$/, '')}
          </button>
        </div>
      </div>
      <div className="toolbar">
        <input
          className="input search"
          placeholder={`Filter ${meta.label.toLowerCase()}…`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(q)}
        />
        <button className="btn" type="button" onClick={() => load(q)}>
          Search
        </button>
      </div>
      <div className="table-wrap">
        {!rows ? (
          <div className="empty">
            <div className="skel" style={{ width: 180, margin: '0 auto' }} />
          </div>
        ) : !rows.length ? (
          <div className="empty">
            <h3>No {meta.label.toLowerCase()} yet</h3>
            <p>Create the first piece, or start from a daily template.</p>
            <button className="btn btn-gold" type="button" onClick={() => onNavigate(pathForCollection(collection, undefined, true))}>
              Create
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="title-cell">
                    <button
                      className="btn-ghost"
                      type="button"
                      style={{ border: 0, background: 'none', padding: 0, fontWeight: 650 }}
                      onClick={() => onNavigate(pathForCollection(collection, row.id))}
                    >
                      {row.title}
                    </button>
                  </td>
                  <td>
                    <code>{row.slug}</code>
                  </td>
                  <td>
                    <span className={`badge ${row.status}`}>{row.status}</span>
                  </td>
                  <td className="hint">{row.updated_at.slice(0, 16).replace('T', ' ')}</td>
                  <td>
                    <button className="btn btn-sm" type="button" disabled={busy === row.id} onClick={() => duplicate(row.id)}>
                      Duplicate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
