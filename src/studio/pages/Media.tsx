import { useEffect, useState } from 'react';
import { api } from '../api';
import type { StudioMedia } from '../types';

export function MediaLibrary({ toast }: { toast: (kind: 'ok' | 'err', text: string) => void }) {
  const [items, setItems] = useState<StudioMedia[] | null>(null);
  const [over, setOver] = useState(false);
  const [alt, setAlt] = useState('');

  async function load() {
    try {
      const res = await api.media();
      setItems(res.media);
    } catch (err) {
      toast('err', err instanceof Error ? err.message : 'Could not load media');
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function send(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      try {
        const res = await api.upload(file, alt);
        toast('ok', res.storedInGithub ? `Uploaded ${file.name}` : `Stored ${file.name} in Studio (GitHub token missing)`);
      } catch (err) {
        toast('err', err instanceof Error ? err.message : `Failed ${file.name}`);
      }
    }
    setAlt('');
    await load();
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Media</h1>
          <p>Images up to 4MB. Publish copies them to <code>public/uploads/</code> when GitHub is connected.</p>
        </div>
      </div>
      <div className="field">
        <label>Default alt text for the next drop</label>
        <input value={alt} onChange={(e) => setAlt(e.target.value)} />
      </div>
      <label
        className={`dropzone ${over ? 'over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (e.dataTransfer.files.length) void send(e.dataTransfer.files);
        }}
      >
        <strong>Drop images here</strong>
        <div className="hint">or click to browse · jpg, png, webp, gif, svg</div>
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files && void send(e.target.files)}
        />
      </label>
      {!items ? (
        <div className="empty">
          <div className="skel" style={{ width: 160, margin: '24px auto' }} />
        </div>
      ) : !items.length ? (
        <div className="empty">
          <h3>Library is empty</h3>
          <p>Drop a poster or hero to start the daily pack.</p>
        </div>
      ) : (
        <div className="media-grid">
          {items.map((item) => (
            <article className="media-card" key={item.id}>
              <img src={item.public_path} alt={item.alt || item.original_name} />
              <div className="cap">
                <code>{item.public_path}</code>
                <div className="actions" style={{ marginTop: 8 }}>
                  <button
                    className="btn btn-sm"
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(item.public_path);
                      toast('ok', 'Path copied');
                    }}
                  >
                    Copy path
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    type="button"
                    onClick={async () => {
                      await api.deleteMedia(item.id);
                      toast('ok', 'Removed from library');
                      await load();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
