export type ToastItem = { id: string; kind: 'ok' | 'err'; text: string };

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (!toasts.length) return null;
  return (
    <div className="toast-stack" role="status">
      {toasts.map((t) => (
        <button key={t.id} className={`toast ${t.kind}`} type="button" onClick={() => onDismiss(t.id)}>
          {t.text}
        </button>
      ))}
    </div>
  );
}
