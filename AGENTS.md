# AGENTS.md

## Cursor Cloud specific instructions

### What this project is
Static marketing/immigration site (root `*.html`, `assets/`, `admin/`) served by a
Cloudflare Worker (`src/index.js`) that also exposes an `/api/*` JSON API. Leads are
stored in a Cloudflare D1 database (`DB` binding); the `/admin/` CRM is gated by an
HttpOnly, HMAC-signed session cookie. There is a single service: the Worker
(`wrangler dev`) serves both the static assets and the API. There is no separate
frontend build, and there are no lint/test scripts (only `dev`/`deploy`/`db:*` in
`package.json`).

### Running the dev server (important gotchas)
- `wrangler dev` watches its asset directory, which is the repo root (`.` in
  `wrangler.jsonc`). With the default local state dir (`./.wrangler`), the local D1
  state churns inside the watched tree and puts the dev server into an **infinite
  reload loop**. Always run with local state persisted **outside** the repo:
  ```bash
  npx wrangler dev --port 8787 --ip 0.0.0.0 --persist-to /tmp/wrangler-state
  ```
- The Worker throws if `SESSION_SECRET` is missing and admin/lead endpoints return
  `storage_unavailable`/`auth_not_configured` without D1 + secrets. Local secrets
  live in `.dev.vars` (gitignored). If `.dev.vars` is missing, recreate it:
  ```bash
  # dev password below is "devpassword123"
  printf 'ADMIN_PASSWORD_HASH=%s\nSESSION_SECRET=%s\n' \
    "$(printf 'devpassword123' | sha256sum | awk '{print $1}')" \
    "$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')" > .dev.vars
  ```
- The local D1 database must be migrated once (using the SAME `--persist-to` path so
  `wrangler dev` sees the tables):
  ```bash
  npx wrangler d1 execute sk-immigration-leads --local --persist-to /tmp/wrangler-state --file=./schema.sql
  ```

### Verifying it works
- Health: `curl http://127.0.0.1:8787/api/health` → `{"ok":true,"storage":"d1"}`.
- End-to-end: submit `POST /api/lead` (or the `/contact.html` form), then log into
  `/admin/` with `devpassword123` and confirm the lead shows in the Leads inbox.
- Session cookies are `Secure`; browsers accept them on `http://localhost`, so the
  admin login works locally without HTTPS.

### Deploy / DB (production)
Standard commands are in `package.json` (`npm run deploy`, `npm run db:migrate`) and
documented in `DEPLOY.md`. Production secrets are set via `wrangler secret put`.
