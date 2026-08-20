# Deploy SK Immigration Services (free + fast)

> **Phase 0:** `npm run build` then Wrangler deploys `dist/`. Ranking HTML lives in `public/` and is copied into `dist/` unchanged.

> **After every production deploy:** follow [CLOUDFLARE-AI.md](CLOUDFLARE-AI.md), then [GSC-MONITOR.md](GSC-MONITOR.md). Architecture: [docs/PHASE-0-ARCHITECTURE.md](docs/PHASE-0-ARCHITECTURE.md).

## Production (Cloudflare Workers)

```bash
npm ci
npm run build
npx wrangler deploy
```

- Output: `dist/`
- Worker entry: `worker/index.js`
- Assets: `wrangler.jsonc` → `assets.directory = "./dist"`
- Custom host: `immigration.salaroutsourcing.com` (existing routes)
- Secrets: `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, plus Studio OAuth (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `STUDIO_GITHUB_ALLOWLIST`). See [docs/PHASE-1-STUDIO.md](docs/PHASE-1-STUDIO.md).

Do not upload the repo root. Astro must run first.

## GitHub Pages (backup)

`.github/workflows/pages.yml` runs `npm ci && npm run build` and publishes `dist`.

Canonical URL stays `https://immigration.salaroutsourcing.com`.

## Local

```bash
npm run dev          # Astro
npm run cf:dev       # build + wrangler (API + assets)
```

## Forms / leads

Public HTML forms still `POST /api/lead` on the Worker (D1). Optional Sheets mirror: `LEAD_WEBHOOK_URL`.

## After deploy

1. Confirm `https://immigration.salaroutsourcing.com/ads.txt` still has `pub-5113459275916426`
2. Confirm `/llms.txt`, `/robots.txt`, `/sitemap.xml`
3. Spot-check `/news/`, `/stories/`, `/blog/study-europe-without-ielts-from-pakistan/`
4. Confirm `/admin` redirects to `/studio/` (noindex). Log in with GitHub OAuth — [docs/PHASE-1-STUDIO.md](docs/PHASE-1-STUDIO.md)
5. Submit sitemap in Search Console if new URLs are missing
