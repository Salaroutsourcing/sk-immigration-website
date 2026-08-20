import { useEffect, useMemo, useState } from 'react';
import { NAV } from '../constants';

export function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const items = useMemo(() => {
    const extra = [
      { href: '/studio/news/new', label: 'New news' },
      { href: '/studio/blog/new', label: 'New blog' },
      { href: '/studio/stories/new', label: 'New web story' },
    ];
    const all = [...NAV.map((n) => ({ href: n.href, label: n.label })), ...extra];
    const query = q.trim().toLowerCase();
    return query ? all.filter((x) => x.label.toLowerCase().includes(query)) : all;
  }, [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      setI(0);
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="palette-scrim" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Jump to…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setI(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setI((n) => Math.min(n + 1, items.length - 1));
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              setI((n) => Math.max(n - 1, 0));
            }
            if (e.key === 'Enter' && items[i]) {
              onNavigate(items[i].href);
              onClose();
            }
          }}
        />
        {items.map((item, idx) => (
          <button
            key={item.href}
            type="button"
            className={`palette-item ${idx === i ? 'active' : ''}`}
            onClick={() => {
              onNavigate(item.href);
              onClose();
            }}
          >
            {item.label}
          </button>
        ))}
        {!items.length && <div className="palette-item">No matches</div>}
      </div>
    </div>
  );
}
