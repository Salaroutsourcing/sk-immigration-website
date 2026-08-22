import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { COLLECTION_META, TAXONOMY_KEYWORDS, TAXONOMY_TAGS, pathForCollection } from '../constants';
import { entryFromSlot, findSlot, planForDate, publishIssues } from '../sop';
import { blankData, slugFromTitle } from '../templates';
import type { Collection, EntryData } from '../types';

export function EntryEditor({
  collection,
  id,
  isNew,
  onNavigate,
  toast,
}: {
  collection: Collection;
  id?: string;
  isNew: boolean;
  onNavigate: (href: string) => void;
  toast: (kind: 'ok' | 'err', text: string) => void;
}) {
  const meta = COLLECTION_META[collection];
  const [tab, setTab] = useState<'write' | 'meta' | 'extra'>('write');
  const [slug, setSlug] = useState('');
  const [data, setData] = useState<EntryData>(() => blankData(collection));
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(isNew);
  const [entryId, setEntryId] = useState(id);

  useEffect(() => {
    if (isNew || !id) {
      const params = new URLSearchParams(window.location.search);
      const slot = findSlot(collection, params.get('slot'));
      if (slot) {
        const filled = entryFromSlot(collection, slot);
        setData(filled.data);
        setBody(filled.body);
        setSlug(slot.slug || slugFromTitle(filled.data.title));
      } else {
        setData(blankData(collection));
        setBody('');
        setSlug('');
      }
      setStatus('draft');
      setLoaded(true);
      return;
    }
    setLoaded(false);
    api
      .entry(id)
      .then((res) => {
        const entry = res.entry;
        setEntryId(entry.id);
        setSlug(entry.slug);
        setData({ ...blankData(entry.collection), ...entry.data });
        setBody(entry.body || '');
        setStatus(entry.status);
        setLoaded(true);
      })
      .catch((err) => {
        toast('err', err.message);
        onNavigate(pathForCollection(collection));
      });
  }, [collection, id, isNew, onNavigate, toast]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void save();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd' && entryId) {
        e.preventDefault();
        void duplicate();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, body, slug, status, entryId]);

  const issues = useMemo(() => publishIssues(collection, data, body, slug), [collection, data, body, slug]);

  function patch(partial: Partial<EntryData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  async function save(nextStatus = status) {
    setSaving(true);
    try {
      const payload = {
        collection,
        slug: slug || slugFromTitle(data.title),
        status: nextStatus,
        data: { ...data, slug: slug || slugFromTitle(data.title), draft: nextStatus !== 'published' },
        body,
      };
      if (!entryId) {
        const res = await api.create(payload);
        setEntryId(res.entry.id);
        setSlug(res.entry.slug);
        setStatus(res.entry.status);
        toast('ok', 'Draft saved');
        onNavigate(pathForCollection(collection, res.entry.id));
        return res.entry.id;
      }
      const res = await api.update(entryId, payload);
      setSlug(res.entry.slug);
      setStatus(res.entry.status);
      toast('ok', 'Saved');
      return res.entry.id;
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Save failed');
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    if (issues.length) {
      toast('err', issues[0]);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        collection,
        slug: slug || slugFromTitle(data.title),
        status: 'draft' as const,
        data: { ...data, slug: slug || slugFromTitle(data.title), draft: false },
        body,
      };
      let currentId = entryId;
      if (!currentId) {
        const created = await api.create(payload);
        currentId = created.entry.id;
        setEntryId(currentId);
        setSlug(created.entry.slug);
        onNavigate(pathForCollection(collection, currentId));
      } else {
        await api.update(currentId, payload);
      }
      const res = await api.publish(currentId);
      setStatus('published');
      toast(
        'ok',
        res.publishedToGithub
          ? `Published to ${res.path}`
          : 'Marked published (GitHub token missing — saved in Studio only)',
      );
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setSaving(false);
    }
  }

  async function duplicate() {
    if (!entryId) return;
    try {
      const res = await api.duplicate(entryId);
      toast('ok', 'Opened as a draft copy');
      onNavigate(pathForCollection(collection, res.entry.id));
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Duplicate failed');
    }
  }

  async function remove() {
    if (!entryId) return;
    if (!confirm('Delete this draft from Studio? Public files already in git are not removed.')) return;
    try {
      await api.remove(entryId);
      toast('ok', 'Deleted');
      onNavigate(pathForCollection(collection));
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Delete failed');
    }
  }

  function applyTemplate() {
    const plan = planForDate();
    const fromUrl = findSlot(collection, new URLSearchParams(window.location.search).get('slot'));
    const slot =
      fromUrl ||
      (collection === 'blog' ? plan.blog : collection === 'news' ? plan.news[0] : plan.stories[0]);
    if (!slot) return;
    const filled = entryFromSlot(collection, slot);
    setData(filled.data);
    setBody(filled.body);
    setSlug(slot.slug || slugFromTitle(filled.data.title));
    toast('ok', `Loaded today’s ${plan.theme} starter`);
  }

  if (!loaded) {
    return (
      <div className="card">
        <div className="skel" />
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{isNew ? `New ${meta.label.replace(/s$/, '')}` : data.title || 'Untitled'}</h1>
          <p>
            {meta.label} · <kbd>⌘S</kbd> save · <kbd>⌘D</kbd> duplicate
          </p>
        </div>
        <div className="actions">
          <button className="btn" type="button" onClick={applyTemplate}>
            Template
          </button>
          {entryId && (
            <button className="btn" type="button" onClick={() => void duplicate()}>
              Duplicate
            </button>
          )}
          <button className="btn" type="button" disabled={saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button className="btn btn-gold" type="button" disabled={saving} onClick={() => void publish()}>
            Publish
          </button>
        </div>
      </div>
      {issues.length > 0 && (
        <p className="hint" style={{ marginTop: -12, marginBottom: 16 }}>
          Before publish: {issues.join(' · ')}
        </p>
      )}
      <div className="editor-grid">
        <div className="card">
          <div className="tabs">
            {(['write', 'meta', 'extra'] as const).map((t) => (
              <button key={t} className={`tab ${tab === t ? 'active' : ''}`} type="button" onClick={() => setTab(t)}>
                {t === 'write' ? 'Write' : t === 'meta' ? 'SEO & taxonomy' : extraLabel(collection)}
              </button>
            ))}
          </div>
          {tab === 'write' && (
            <>
              <div className="field">
                <label>Title</label>
                <input
                  value={data.title}
                  onChange={(e) => {
                    patch({ title: e.target.value });
                    if (!slug || slug === slugFromTitle(data.title)) setSlug(slugFromTitle(e.target.value));
                  }}
                  placeholder="12–110 characters"
                />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea
                  className="textarea"
                  style={{ minHeight: 90, fontFamily: 'inherit' }}
                  value={data.description}
                  onChange={(e) => patch({ description: e.target.value })}
                  placeholder="40–220 characters"
                />
              </div>
              {collection !== 'web-stories' && (
                <div className="field">
                  <label>Body (MDX)</label>
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} />
                </div>
              )}
              {collection === 'web-stories' && (
                <SlidesEditor slides={data.slides || []} onChange={(slides) => patch({ slides })} />
              )}
            </>
          )}
          {tab === 'meta' && (
            <>
              <div className="field">
                <label>Slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} />
                <span className="hint">
                  Public URL: {meta.publicBase}/{slug || '…'}/
                </span>
              </div>
              <div className="field">
                <label>Category</label>
                <select className="select" value={data.category} onChange={(e) => patch({ category: e.target.value })}>
                  {meta.categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <span className="field-label">Tags (controlled)</span>
                <div className="chip-row">
                  {TAXONOMY_TAGS.map((tag) => {
                    const on = data.tags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        className={`chip ${on ? 'on' : ''}`}
                        onClick={() =>
                          patch({ tags: on ? data.tags.filter((t) => t !== tag.id) : [...data.tags, tag.id] })
                        }
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="field">
                <span className="field-label">Focus keywords</span>
                <div className="chip-row">
                  {TAXONOMY_KEYWORDS.map((kw) => {
                    const on = data.keywords.includes(kw.phrase);
                    return (
                      <button
                        key={kw.id}
                        type="button"
                        className={`chip ${on ? 'on' : ''}`}
                        onClick={() =>
                          patch({
                            keywords: on ? data.keywords.filter((k) => k !== kw.phrase) : [...data.keywords, kw.phrase],
                          })
                        }
                      >
                        {kw.phrase}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="field">
                <label>Publish date</label>
                <input type="date" value={data.publishDate?.slice(0, 10)} onChange={(e) => patch({ publishDate: e.target.value })} />
              </div>
              {collection !== 'web-stories' && (
                <>
                  <div className="field">
                    <label>Hero image path</label>
                    <input value={data.heroImage || ''} onChange={(e) => patch({ heroImage: e.target.value })} placeholder="/uploads/…" />
                  </div>
                  <div className="field">
                    <label>Hero alt</label>
                    <input value={data.heroAlt || ''} onChange={(e) => patch({ heroAlt: e.target.value })} />
                  </div>
                </>
              )}
              {collection === 'web-stories' && (
                <div className="field">
                  <label>Poster (portrait)</label>
                  <input
                    value={data.posterPortrait || ''}
                    onChange={(e) => patch({ posterPortrait: e.target.value })}
                    placeholder="/assets/img/og-share.jpg"
                  />
                </div>
              )}
            </>
          )}
          {tab === 'extra' && collection === 'news' && (
            <NewsExtra data={data} patch={patch} />
          )}
          {tab === 'extra' && collection === 'blog' && <BlogExtra data={data} patch={patch} />}
          {tab === 'extra' && collection === 'web-stories' && (
            <StoryExtra data={data} patch={patch} body={body} setBody={setBody} />
          )}
        </div>
        <aside className="card">
          <h3>Status</h3>
          <p>
            <span className={`badge ${status}`}>{status}</span>
          </p>
          <p className="hint">
            Save writes to D1 instantly. Publish writes MDX into GitHub. The public URL appears after the next site deploy. Never publish a visa guarantee.
          </p>
          <label className="chip" style={{ marginTop: 8 }}>
            <input type="checkbox" checked={Boolean(data.featured)} onChange={(e) => patch({ featured: e.target.checked })} />{' '}
            Featured
          </label>
          {entryId && (
            <button className="btn btn-danger btn-block" type="button" style={{ marginTop: 18 }} onClick={() => void remove()}>
              Delete
            </button>
          )}
        </aside>
      </div>
    </>
  );
}

function extraLabel(collection: Collection) {
  if (collection === 'news') return 'Sources';
  if (collection === 'blog') return 'FAQs';
  return 'Funnel';
}

function NewsExtra({ data, patch }: { data: EntryData; patch: (p: Partial<EntryData>) => void }) {
  const sources = data.sources || [];
  return (
    <>
      <div className="field">
        <label>Dateline</label>
        <input value={data.dateline || ''} onChange={(e) => patch({ dateline: e.target.value })} />
      </div>
      <div className="field">
        <label>Related blog slug</label>
        <input value={data.relatedBlog || ''} onChange={(e) => patch({ relatedBlog: e.target.value })} />
      </div>
      <div className="field">
        <label>Related story slug</label>
        <input value={data.relatedStory || ''} onChange={(e) => patch({ relatedStory: e.target.value })} />
      </div>
      <h3>Sources</h3>
      {sources.map((s, i) => (
        <div className="repeat-card" key={i}>
          <input placeholder="Name" value={s.name} onChange={(e) => {
            const next = sources.slice();
            next[i] = { ...next[i], name: e.target.value };
            patch({ sources: next });
          }} />
          <input
            placeholder="https://"
            style={{ marginTop: 8 }}
            value={s.url}
            onChange={(e) => {
              const next = sources.slice();
              next[i] = { ...next[i], url: e.target.value };
              patch({ sources: next });
            }}
          />
        </div>
      ))}
      <button className="btn btn-sm" type="button" onClick={() => patch({ sources: [...sources, { name: '', url: '' }] })}>
        Add source
      </button>
    </>
  );
}

function BlogExtra({ data, patch }: { data: EntryData; patch: (p: Partial<EntryData>) => void }) {
  const faqs = data.faqs || [];
  return (
    <>
      <p className="hint">Every blog needs at least three FAQs for ranking and AI citation.</p>
      {faqs.map((f, i) => (
        <div className="repeat-card" key={i}>
          <input
            placeholder={`Question ${i + 1}`}
            value={f.question}
            onChange={(e) => {
              const next = faqs.slice();
              next[i] = { ...next[i], question: e.target.value };
              patch({ faqs: next });
            }}
          />
          <textarea
            className="textarea"
            style={{ minHeight: 80, marginTop: 8, fontFamily: 'inherit' }}
            placeholder="Answer"
            value={f.answer}
            onChange={(e) => {
              const next = faqs.slice();
              next[i] = { ...next[i], answer: e.target.value };
              patch({ faqs: next });
            }}
          />
        </div>
      ))}
      <button className="btn btn-sm" type="button" onClick={() => patch({ faqs: [...faqs, { question: '', answer: '' }] })}>
        Add FAQ
      </button>
      <div className="field" style={{ marginTop: 16 }}>
        <label>Related stories (comma slugs)</label>
        <input
          value={(data.relatedStories || []).join(', ')}
          onChange={(e) =>
            patch({
              relatedStories: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
      <div className="field">
        <label>Related news (comma slugs)</label>
        <input
          value={(Array.isArray(data.relatedNews) ? data.relatedNews : []).join(', ')}
          onChange={(e) =>
            patch({
              relatedNews: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
    </>
  );
}

function StoryExtra({
  data,
  patch,
  body,
  setBody,
}: {
  data: EntryData;
  patch: (p: Partial<EntryData>) => void;
  body: string;
  setBody: (v: string) => void;
}) {
  return (
    <>
      <div className="field">
        <label>Related blog slug (required)</label>
        <input value={data.relatedBlog || ''} onChange={(e) => patch({ relatedBlog: e.target.value })} />
      </div>
      <div className="field">
        <label>Related news slug</label>
        <input
          value={typeof data.relatedNews === 'string' ? data.relatedNews : ''}
          onChange={(e) => patch({ relatedNews: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Duration (seconds)</label>
        <input
          type="number"
          min={8}
          max={20}
          value={data.durationSeconds || 12}
          onChange={(e) => patch({ durationSeconds: Number(e.target.value) })}
        />
      </div>
      <div className="field">
        <label>Producer notes</label>
        <textarea className="textarea" style={{ minHeight: 100 }} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
    </>
  );
}

function SlidesEditor({
  slides,
  onChange,
}: {
  slides: NonNullable<EntryData['slides']>;
  onChange: (slides: NonNullable<EntryData['slides']>) => void;
}) {
  return (
    <div>
      <div className="field-label" style={{ marginBottom: 8 }}>
        Slides ({slides.length}/12, min 4)
      </div>
      {slides.map((slide, i) => (
        <div className="repeat-card" key={i}>
          <strong className="hint">Slide {i + 1}</strong>
          <input
            style={{ marginTop: 8 }}
            placeholder="Heading"
            value={slide.heading}
            onChange={(e) => {
              const next = slides.slice();
              next[i] = { ...next[i], heading: e.target.value };
              onChange(next);
            }}
          />
          <textarea
            className="textarea"
            style={{ minHeight: 72, marginTop: 8, fontFamily: 'inherit' }}
            placeholder="Text"
            value={slide.text}
            onChange={(e) => {
              const next = slides.slice();
              next[i] = { ...next[i], text: e.target.value };
              onChange(next);
            }}
          />
          <input
            style={{ marginTop: 8 }}
            placeholder="Optional CTA label"
            value={slide.ctaLabel || ''}
            onChange={(e) => {
              const next = slides.slice();
              next[i] = { ...next[i], ctaLabel: e.target.value };
              onChange(next);
            }}
          />
          <input
            style={{ marginTop: 8 }}
            placeholder="Optional CTA href"
            value={slide.ctaHref || ''}
            onChange={(e) => {
              const next = slides.slice();
              next[i] = { ...next[i], ctaHref: e.target.value };
              onChange(next);
            }}
          />
        </div>
      ))}
      <div className="actions">
        <button
          className="btn btn-sm"
          type="button"
          disabled={slides.length >= 12}
          onClick={() => onChange([...slides, { heading: '', text: '' }])}
        >
          Add slide
        </button>
        <button
          className="btn btn-sm"
          type="button"
          disabled={slides.length <= 4}
          onClick={() => onChange(slides.slice(0, -1))}
        >
          Remove last
        </button>
      </div>
    </div>
  );
}
