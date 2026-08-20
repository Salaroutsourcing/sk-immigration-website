# SK Immigration Services website

Public site for **SK Immigration Services** (legal: SK Immigration Services (SMC-Private) Limited, CUIN 0304985).  
Official domain: **`immigration.salaroutsourcing.com`**.  
Email: **`Services@salaroutsourcing.com`**.

Phase 0 is live in this branch: the public site is an **Astro 7 static** project. Existing ranking HTML is copied from `public/` so URLs do not change. New news, blogs, and Web Stories are content collections.

## Commands

```bash
npm install
npm run dev          # Astro preview of new routes + public HTML
npm run build        # static output → dist/
npm run cf:dev       # build + wrangler (Worker API + dist assets)
npm run deploy       # build + wrangler deploy
```

## Key URLs

- Site: https://immigration.salaroutsourcing.com/
- Newsroom: `/news/`
- Web Stories: `/stories/`
- New MDX blogs: `/blog/{slug}/` (legacy country guides stay at `/blog/{country-guide}/`)
- Studio placeholder (noindex): `/studio/`
- Trust: `/trust.html`
- Architecture: [`docs/PHASE-0-ARCHITECTURE.md`](docs/PHASE-0-ARCHITECTURE.md)

## Hosting

Cloudflare Workers + static assets from `dist/`. Worker still handles `/api/*`, host redirects, and security headers. D1 lead capture is unchanged.
