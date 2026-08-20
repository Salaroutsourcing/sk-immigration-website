import { useMemo, useState } from 'react';
import { api } from '../api';
import { IconGitHub } from './Icons';

const ERRORS: Record<string, string> = {
  oauth_state: 'GitHub sign-in was interrupted. Try again.',
  oauth_expired: 'The sign-in link expired. Try again.',
  oauth_config: 'GitHub OAuth is not fully configured on the Worker.',
  oauth_token: 'GitHub did not return an access token.',
  oauth_user: 'Could not read your GitHub profile.',
  not_allowlisted: 'This GitHub account is not on the Studio allowlist.',
};

export function Login({
  githubConfigured,
  passwordConfigured,
  onPasswordOk,
}: {
  githubConfigured: boolean;
  passwordConfigured: boolean;
  onPasswordOk: () => void;
}) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const oauthError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('error') || '';
    return ERRORS[code] || (code ? decodeURIComponent(code) : '');
  }, []);

  async function submit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.loginPassword(password);
      onPasswordOk();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <img src="/assets/img/logo.jpg" alt="" />
          <div>
            <div className="login-kicker">SK Immigration</div>
            <strong>Studio</strong>
          </div>
        </div>
        <h1>Sign in to publish</h1>
        <p className="lede">Private console for news, blogs, and Web Stories. This route is noindex.</p>
        {(oauthError || error) && <div className="login-error">{oauthError || error}</div>}
        {githubConfigured ? (
          <a className="btn btn-gold btn-block" href="/api/auth/github">
            <IconGitHub width={18} height={18} />
            Continue with GitHub
          </a>
        ) : (
          <p className="hint">
            GitHub OAuth is off until <code>GITHUB_CLIENT_ID</code>, <code>GITHUB_CLIENT_SECRET</code>, and{' '}
            <code>STUDIO_GITHUB_ALLOWLIST</code> are set on the Worker.
          </p>
        )}
        {passwordConfigured && (
          <form onSubmit={submit} style={{ marginTop: 18 }}>
            <div className="field">
              <label htmlFor="studio-password">Password fallback</label>
              <input
                id="studio-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-block" type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in with password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
