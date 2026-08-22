# SK Immigration Services website

Public site for **SK Immigration Services** (legal: SK Immigration Services (SMC-Private) Limited, CUIN 0304985).  
Official domain: **https://immigration.salaroutsourcing.com**  
Email: **Services@salaroutsourcing.com** · WhatsApp **+92 304 5999859**

Astro 7 static site on Cloudflare Workers. Ranking HTML stays in `public/` so old URLs do not change. News, blogs, and Web Stories are content collections. Studio at `/studio/` is the daily 5+5+1 desk.

## Daily publishing

Open **https://immigration.salaroutsourcing.com/studio/** and follow [docs/DAILY-USE.md](docs/DAILY-USE.md).

## Commands

```bash
npm install
npm run dev          # Astro preview of new routes + public HTML
npm run build        # static output → dist/
npm run cf:dev       # build + wrangler (Worker API + dist assets)
npm run deploy       # build + wrangler deploy
npm run check        # astro check
npm run check:sop    # weekday 5+5+1 calendar
npm run check:launch # ads.txt, robots, Studio noindex, docs
```

## Key URLs

- Site: https://immigration.salaroutsourcing.com/
- Newsroom: `/news/`
- Web Stories: `/stories/` (AMP at `/stories/{slug}/amp/`)
- New MDX blogs: `/blog/{slug}/` (legacy country guides stay at `/blog/{country-guide}/`)
- Studio: `/studio/` — [docs/PHASE-1-STUDIO.md](docs/PHASE-1-STUDIO.md)
- Trust: `/trust.html`
- Launch handbook: [docs/PHASE-6-LAUNCH.md](docs/PHASE-6-LAUNCH.md)
- Deploy: [DEPLOY.md](DEPLOY.md)

## Hosting

Cloudflare Workers + static assets from `dist/`. Merge to `main` deploys. Worker handles `/api/*`, host redirects, and security headers. D1 stores Studio drafts and inbound leads.
