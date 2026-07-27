# Deploy Salar Outsourcing

The site runs entirely on Cloudflare Workers: static pages are served from the
assets bundle, and `src/index.js` handles `/api/*` for form submissions and
admin access. Leads are stored in Cloudflare D1.

## Architecture

| Layer | Where it runs |
|-------|---------------|
| Website pages | Cloudflare Workers static assets |
| Form submissions | Worker `POST /api/lead` |
| Lead storage | Cloudflare D1 (`sk-immigration-leads`) |
| Admin CRM | `/admin/`, gated by a signed HttpOnly session cookie |
| Legacy case portal | Existing Apps Script UI, linked from `portal.html` |

---

## First-time setup

### 1. Create the database

```bash
npm install
npx wrangler d1 create sk-immigration-leads
```

Copy the printed `database_id` into `wrangler.jsonc`, replacing
`REPLACE_WITH_D1_DATABASE_ID`, then create the table:

```bash
npm run db:migrate
```

### 2. Set the secrets

```bash
printf 'your-new-admin-password' | shasum -a 256   # copy the hex digest
npx wrangler secret put ADMIN_PASSWORD_HASH        # paste the digest
npx wrangler secret put SESSION_SECRET             # openssl rand -hex 32
```

Optional, for instant notification of every new lead:

```bash
npx wrangler secret put LEAD_WEBHOOK_URL
```

### 3. Deploy

```bash
npm run deploy
```

---

## DNS

`www.salaroutsourcing.com` is the canonical hostname. Every canonical tag and
sitemap entry points at it.

The apex `salaroutsourcing.com` currently has **no A/AAAA record**, so it does
not resolve at all. Add it in Cloudflare → DNS:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `@` | `www.salaroutsourcing.com` | Proxied |
| CNAME | `www` | (existing Workers route) | Proxied |

Then add a redirect rule (Cloudflare → Rules → Redirect Rules) sending
`salaroutsourcing.com/*` to `https://www.salaroutsourcing.com/$1` with a 301,
so the apex and www never both serve the same content.

## Cloudflare settings that affect SEO

**Turn off the managed robots.txt / AI Crawl Control block.** Cloudflare
prepends its own block to `robots.txt` that disallows `GPTBot`, `ClaudeBot`,
`CCBot`, `Google-Extended`, `Applebot-Extended`, `Bytespider` and
`meta-externalagent`. That block takes precedence over the rules in this repo,
which defeats the whole `llms.txt` / answers-hub strategy. Disable it under
Cloudflare → AI Crawl Control (or Security → Bots, depending on plan).

Also enable SSL **Full (strict)** and **Always Use HTTPS**.

---

## What is and is not published

`.assetsignore` keeps the backend and internal files out of the public bundle:
`src/`, `scripts/`, `apps-script/`, `schema.sql`, `wrangler.jsonc`,
`package.json`, `node_modules/`, `.dev.vars` and all `*.md`.

Verify after any deploy:

```bash
curl -sI https://www.salaroutsourcing.com/src/index.js | head -1     # expect 404
curl -sI https://www.salaroutsourcing.com/wrangler.jsonc | head -1   # expect 404
curl -sI https://www.salaroutsourcing.com/.dev.vars | head -1        # expect 404
```

---

## Security notes

- The admin password is never in the repo and never sent to the browser. Only
  its SHA-256 hash is stored, as a Cloudflare secret.
- Sessions are HMAC-signed, HttpOnly, Secure, SameSite=Strict, 12-hour expiry.
- `/api/lead` validates input, rejects unknown lead types, applies a honeypot
  check and rate-limits to 8 submissions per IP per 10 minutes.
- Visitor IPs are stored only as a salted hash, never in plain text.
- If storage is unavailable the API returns 503 rather than reporting a false
  success. Never make this endpoint fail silently.

---

## Post-launch checklist

- [ ] Add the apex DNS record and the apex → www redirect
- [ ] Turn off Cloudflare's managed robots.txt block
- [ ] Rotate the admin password (the old one was public)
- [ ] Submit `https://www.salaroutsourcing.com/sitemap.xml` in Search Console
- [ ] Submit a real contact form and confirm the row appears in `/admin/`
- [ ] Test the WhatsApp link on mobile
- [ ] Test dark/light toggle persistence
