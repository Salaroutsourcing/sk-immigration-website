# Deploy SK Immigration Services

Canonical site: **https://immigration.salaroutsourcing.com**  
Architecture: [docs/PHASE-0-ARCHITECTURE.md](docs/PHASE-0-ARCHITECTURE.md) · Launch: [docs/PHASE-6-LAUNCH.md](docs/PHASE-6-LAUNCH.md)

## Production (what you actually do)

1. Merge the pull request into `main`.
2. GitHub Actions **Deploy Cloudflare Worker** builds Astro and runs `npx wrangler deploy`.
3. Wait until that run is green: https://github.com/Salaroutsourcing/sk-immigration-website/actions
4. Hard-refresh the public page.

The Worker Custom Domain is already `immigration.salaroutsourcing.com`. Do not upload the repo root by hand. Astro must run first (`dist/`).

### One GitHub secret

https://github.com/Salaroutsourcing/sk-immigration-website/settings/secrets/actions

- Tab: **Secrets** (not Variables)
- Name: `CLOUDFLARE_API_TOKEN`

Account id is already in the workflow. Do not paste the token into chat or into Variables (this repo is public).

## Laptop deploy (optional)

```bash
npm ci
npm run build
npx wrangler deploy
```

- Output: `dist/`
- Worker: `worker/index.js`
- Assets: `wrangler.jsonc` → `assets.directory = "./dist"`

Studio secrets (Wrangler, not git): `SESSION_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `STUDIO_GITHUB_ALLOWLIST`, optional `ADMIN_PASSWORD_HASH`, optional `GITHUB_TOKEN`. See [docs/PHASE-1-STUDIO.md](docs/PHASE-1-STUDIO.md).

## GitHub Pages (backup CDN)

`.github/workflows/pages.yml` publishes `dist`. Canonical URLs stay on the immigration host.

## Local

```bash
npm run dev          # Astro
npm run cf:dev       # build + wrangler (API + assets)
```

## Forms / leads

Public HTML forms `POST /api/lead` on the Worker (D1). Optional Sheets mirror: `LEAD_WEBHOOK_URL`.

## After every production deploy

1. https://immigration.salaroutsourcing.com/ads.txt — `pub-5113459275916426`
2. `/llms.txt`, `/robots.txt`, `/sitemap.xml`, `/sitemap-platform-index.xml`
3. Spot-check `/news/`, `/stories/`, a new blog slug
4. `/admin` → `/studio/` (noindex)
5. [CLOUDFLARE-AI.md](CLOUDFLARE-AI.md) if crawlers look blocked
6. Search Console: submit sitemaps if new URLs are missing — [GSC-MONITOR.md](GSC-MONITOR.md)
