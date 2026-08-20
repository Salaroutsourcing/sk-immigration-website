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
  apiOnline,
  onPasswordOk,
}: {
  githubConfigured: boolean;
  passwordConfigured: boolean;
  apiOnline: boolean;
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
    if (!apiOnline) {
      setError('Login is not connected on GitHub Pages. Deploy the Cloudflare Worker first.');
      return;
    }
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
        {!apiOnline && (
          <div className="login-error">
            You can see Studio, but login is not connected yet. This copy of the site is GitHub Pages (files only).
            Sign-in needs Cloudflare — the same system that ran the old /admin.
          </div>
        )}
        {(oauthError || error) && <div className="login-error">{oauthError || error}</div>}
        {githubConfigured && apiOnline ? (
          <a className="btn btn-gold btn-block" href="/api/auth/github">
            <IconGitHub width={18} height={18} />
            Continue with GitHub
          </a>
        ) : (
          <button
            className="btn btn-gold btn-block"
            type="button"
            disabled
            title="GitHub login turns on after Cloudflare is connected"
          >
            <IconGitHub width={18} height={18} />
            Continue with GitHub
          </button>
        )}
        <form onSubmit={submit} style={{ marginTop: 18 }}>
          <div className="field">
            <label htmlFor="studio-password">Password</label>
            <input
              id="studio-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Same password as the old /admin"
              required
            />
          </div>
          <button className="btn btn-block" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in with password'}
          </button>
          {apiOnline && !passwordConfigured && (
            <p className="hint" style={{ marginTop: 10 }}>
              Password login is off until the old admin password is set on Cloudflare.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
