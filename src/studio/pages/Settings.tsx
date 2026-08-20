import { useEffect, useState } from 'react';
import { api } from '../api';

export function Settings({ toast }: { toast: (kind: 'ok' | 'err', text: string) => void }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.settings>> | null>(null);
  useEffect(() => {
    api
      .settings()
      .then(setData)
      .catch((err) => toast('err', err.message));
  }, [toast]);

  if (!data) {
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
          <h1>Settings</h1>
          <p>Studio stays on this Worker. Public pages remain static HTML.</p>
        </div>
      </div>
      <div className="grid-2">
        <section className="card">
          <h2>Signed in</h2>
          <p>
            <strong>{data.user.name}</strong>
            <br />
            <span className="hint">
              @{data.user.login} via {data.user.method}
            </span>
          </p>
        </section>
        <section className="card">
          <h2>Publish target</h2>
          <p>
            <code>{data.repo}</code>
            <br />
            Branch <code>{data.branch}</code>
          </p>
          <p className="hint">
            {data.publishReady
              ? 'A GitHub token is available. Publish will write MDX into the repo.'
              : 'No GitHub token yet. Drafts still save to D1. Sign in with GitHub (public_repo scope) or set GITHUB_TOKEN.'}
          </p>
        </section>
        <section className="card">
          <h2>Auth</h2>
          <p>GitHub OAuth: {data.githubOAuth ? 'on' : 'off'}</p>
          <p>Password fallback: {data.passwordFallback ? 'on' : 'off'}</p>
        </section>
        <section className="card">
          <h2>Shortcuts</h2>
          <p>
            <kbd>G</kbd> then <kbd>D</kbd> <kbd>N</kbd> <kbd>B</kbd> <kbd>S</kbd> <kbd>M</kbd> <kbd>K</kbd>
          </p>
          <p>
            <kbd>⌘K</kbd> command palette · <kbd>⌘S</kbd> save · <kbd>⌘D</kbd> duplicate
          </p>
        </section>
      </div>
    </>
  );
}
