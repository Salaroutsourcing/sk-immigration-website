# Phase 0 — Architecture (stop here)

This document is the Phase 0 report. **Do not start Phase 1 (Studio) until this is confirmed.**

## Decision

| Topic | Choice | Why |
| --- | --- | --- |
| Public renderer | **Astro 7.2** + TypeScript, `output: 'static'` | Fast HTML, content collections, AdSense/SEO/Core Web Vitals, AI citation |
| Hosting | **Cloudflare Workers** assets from `dist/` + existing Worker | Same routes, D1 leads, security headers. No Pages→Workers adapter (not needed for static) |
| Ranking pages | Copied into `public/` **byte-for-byte URLs** | 313 HTML landers stay live. No mass rewrite in Phase 0 |
| Old CRM | Removed from the deploy root (`_legacy/admin`) | `/admin` 301s to `/studio/` |
| New CMS UI | `/studio/` placeholder only | Phase 1 after confirmation |
| Content | Collections: `news`, `blog`, `web-stories` | Daily 5+5+1 machine. Stories **must** set `relatedBlog` |
| Monetization IDs | Kept in `src/lib/site.ts` | ads.txt `pub-5113459275916426`, GTM, GA, Clarity ID stored (script inject is Phase 4) |

## URL preservation

Everything that ranked yesterday still ships from `public/`:

- `/`, `/about.html`, `/trust.html`, `/contact.html`, `/pricing.html`
- `/study-visa/`, `/work-permit/`, `/visit-visa/`, `/visa-appointment/`, `/saudi-visa/`
- `/answers/`, `/local/`, `/guides/`, `/ur/`, `/document-services/`
- Existing `/blog/{country-student-visa}/` HTML guides
- `/ads.txt`, `/robots.txt`, `/llms.txt`, `/ai.txt`, `/sitemap.xml`

New surfaces (Astro):

| Route | Role |
| --- | --- |
| `/news/`, `/news/{slug}/`, `/news/category/{category}/` | Newsroom |
| `/blog/` | Index of **new** MDX blogs only |
| `/blog/{new-slug}/` | New MDX posts (do not reuse an existing HTML slug) |
| `/stories/`, `/stories/{slug}/` | HTML Web Story player → blog funnel |
| `/stories/{slug}/amp/` | AMP Web Story (Discover canonical) — Phase 2 |
| `/rss.xml` | News RSS |
| `/studio/` | `noindex` placeholder |

## Folder map

```
/
├── astro.config.ts              # static Astro, MDX, platform sitemap
├── wrangler.jsonc               # assets = ./dist, main = worker/index.js
├── worker/index.js              # API, redirects, security headers
├── public/                      # ALL current ranking HTML + assets + ads.txt
├── src/
│   ├── content.config.ts        # collection schemas
│   ├── content/news|blog|web-stories
│   ├── data/taxonomy.json       # controlled tags + keyword tracker seed
│   ├── components/{seo,content,ads,studio}
│   ├── layouts/{Base,Article,Studio}Layout.astro
│   ├── pages/{news,blog,stories,studio,rss.xml.ts}
│   ├── lib/{site,schemas,seo,content}.ts
│   └── styles/platform.css
├── _legacy/admin                # dead CRM, not deployed
└── docs/PHASE-0-ARCHITECTURE.md
```

## Content model (Phase 2 ready)

- **News** — `NewsArticle` JSON-LD, category, optional `relatedBlog` / `relatedStory`, source list.
- **Blog** — `BlogPosting` + **required FAQs** (min 3), `relatedStories`, `relatedService`, affiliate cards with `rel="sponsored nofollow"`.
- **Web Stories** — 4–12 slides, **required `relatedBlog`**, last CTA opens the blog. AMP packaging is Phase 2; the player and funnel ship now.

## Worker / deploy

1. `npm run build` → `dist/` (public HTML + Astro pages).
2. `wrangler deploy` uploads `dist/` as assets and `worker/index.js`.
3. GitHub Pages workflow now builds Astro and publishes `dist` (backup CDN).

Secrets unchanged: `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` (used by remaining `/api/admin/*` until Phase 1). Lead `POST /api/lead` still works for existing HTML forms.

## What Phase 0 does **not** do (waiting)

1. Premium Studio UI, GitHub OAuth, media library, duplicate templates.
2. AMP Web Story XML / Discover feed packaging — **done, see `docs/PHASE-2-AMP-STORIES.md`**.
3. Full JSON-LD expansion + `llms.txt` rewrite — **done, see `docs/PHASE-3-JSONLD-LLMS.md`**.
4. AdSense slot fill + Clarity script inject (Phase 4) — IDs are already in `site.ts`.
5. Daily publishing SOP (Phase 5).

## How to confirm

After review, reply **“Phase 0 confirmed — start Phase 1”**. Phase 1 will replace `/studio/` with the SaaS dashboard and keep this static public site as the money pages.
