import { useEffect, useState } from 'react';
import { api } from '../api';
import type { StudioKeyword } from '../types';

export function Keywords({ toast }: { toast: (kind: 'ok' | 'err', text: string) => void }) {
  const [rows, setRows] = useState<StudioKeyword[] | null>(null);
  const [keyword, setKeyword] = useState('');
  const [intent, setIntent] = useState('informational');
  const [cluster, setCluster] = useState('blog');

  async function load() {
    try {
      const res = await api.keywords();
      setRows(res.keywords);
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Could not load keywords');
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e: { preventDefault: () => void }) {
    e.preventDefault();
    try {
      await api.upsertKeyword({ keyword, intent, cluster, status: 'active' });
      setKeyword('');
      toast('ok', 'Keyword saved');
      await load();
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Keywords</h1>
          <p>Tracker for winning phrases. Seeded from <code>src/data/taxonomy.json</code>.</p>
        </div>
      </div>
      <form className="toolbar" onSubmit={add}>
        <input className="input search" placeholder="Add a phrase" value={keyword} onChange={(e) => setKeyword(e.target.value)} required />
        <select className="select" value={intent} onChange={(e) => setIntent(e.target.value)} style={{ width: 160 }}>
          <option value="informational">informational</option>
          <option value="commercial">commercial</option>
          <option value="transactional">transactional</option>
        </select>
        <select className="select" value={cluster} onChange={(e) => setCluster(e.target.value)} style={{ width: 140 }}>
          <option value="news">news</option>
          <option value="blog">blog</option>
          <option value="story">story</option>
          <option value="lander">lander</option>
        </select>
        <button className="btn btn-gold" type="submit">
          Save
        </button>
      </form>
      <div className="table-wrap">
        {!rows ? (
          <div className="empty">
            <div className="skel" style={{ width: 140, margin: '0 auto' }} />
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Intent</th>
                <th>Cluster</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="title-cell">{row.keyword}</td>
                  <td>{row.intent}</td>
                  <td>{row.cluster}</td>
                  <td>
                    <span className="badge">{row.status}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      type="button"
                      onClick={async () => {
                        await api.deleteKeyword(row.id);
                        await load();
                      }}
                    >
                      Remove
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
