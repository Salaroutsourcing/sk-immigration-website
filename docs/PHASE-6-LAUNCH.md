# Phase 6 — Launch readiness (stop here)

The money site is live at **https://immigration.salaroutsourcing.com**. This phase is the launch handbook: architecture, Cloudflare deploy, performance, security, and daily use.

**This is the last numbered phase.** After you confirm, the desk is the product — publish every day from Studio.

## Open these

| What | URL |
| --- | --- |
| Public site | https://immigration.salaroutsourcing.com/ |
| Studio (publish) | https://immigration.salaroutsourcing.com/studio/ |
| Daily click-by-click | [docs/DAILY-USE.md](DAILY-USE.md) |
| Cloudflare deploy | [DEPLOY.md](../DEPLOY.md) |

---

## 1. File architecture map

```
/
├── astro.config.ts                 # static Astro 7, MDX, React Studio, platform sitemap
├── wrangler.jsonc                  # Worker + dist/ assets + custom domain
├── worker/
│   ├── index.js                    # leads API, host 301s, security headers, AMP CSP
│   ├── studio.js                   # GitHub OAuth, D1 CMS, publish to GitHub
│   └── sop.js                      # Pakistan-time 5+5+1 plan + publish rules
├── public/                         # ranking HTML landers + ads.txt + robots + sitemap.xml
├── src/
│   ├── content/{news,blog,web-stories}/
│   ├── data/{taxonomy.json,daily-sop.json}
│   ├── components/{seo,content,ads}
│   ├── layouts/{Base,Article,Studio}Layout.astro
│   ├── pages/{news,blog,stories,studio,rss.xml.ts}
│   ├── studio/                     # React SPA at /studio/
│   ├── lib/{site,schemas,seo,content,llms}.ts
│   └── styles/{platform.css,studio.css}
├── migrations/                     # D1 leads + Studio tables
├── docs/PHASE-0 … PHASE-6
└── .github/workflows/cloudflare.yml
```

**Money pages** stay in `public/` (same URLs as before). **New news / blogs / stories** are Astro collections. **Studio** writes MDX into git; the next deploy builds HTML. D1 is the editor, not the public renderer.

| Surface | Role |
| --- | --- |
| `/` and country landers | Ranking HTML (AdSense Auto ads) |
| `/news/`, `/blog/{new-slug}/`, `/stories/` | Astro content + AdSense slots + Clarity |
| `/stories/{slug}/amp/` | AMP Discover canonical (no ads, no Clarity) |
| `/studio/` | `noindex` publishing desk |
| `/admin` | 301 → `/studio/` |
| `POST /api/lead` | Contact / quiz / WhatsApp-adjacent forms → D1 |

---

## 2. Cloudflare deploy (what actually ships)

Canonical host: **immigration.salaroutsourcing.com** (Worker Custom Domain).

**You do not deploy from your laptop.** Merge to `main`. GitHub Actions **Deploy Cloudflare Worker** runs `npm ci`, `npm run build`, `npx wrangler deploy`.

One GitHub secret is required:

https://github.com/Salaroutsourcing/sk-immigration-website/settings/secrets/actions

Name: `CLOUDFLARE_API_TOKEN` (Secrets tab, not Variables).

Worker secrets (already used in production — do not paste them in chat):

- `SESSION_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `STUDIO_GITHUB_ALLOWLIST`
- `ADMIN_PASSWORD_HASH` (password fallback)
- optional `GITHUB_TOKEN` if OAuth should not write MDX

Account id is in the workflow: `e480701d9e4150072f4f9a09b43e9749`. Worker name: `sk-immigration-website`.

After a green run, wait 1–2 minutes, then hard-refresh the public URL.

Full command list: [DEPLOY.md](../DEPLOY.md). AI crawler allow-list: [CLOUDFLARE-AI.md](../CLOUDFLARE-AI.md).

---

## 3. Performance audit (launch)

Checked 2026-08-22. Fixes in this phase:

| Item | Result |
| --- | --- |
| Static HTML | Astro `compressHTML` + `inlineStylesheets: auto` |
| Fonts on Astro pages | Only Sora + Source Sans 3 (removed unused Playfair / Plus Jakarta) |
| Asset cache | `/_astro/*` immutable 1 year; `/assets/` 1 day; HTML 5 minutes |
| Studio | `Cache-Control: no-store` (private) |
| AMP stories | Separate CSP, no GTM/AdSense/Clarity JS |
| Observability | Wrangler traces on (`head_sampling_rate: 1`) |
| Sitemap `<link>` | Pointed at real files (`/sitemap.xml` + `/sitemap-platform-index.xml`), not a missing `/sitemap-index.xml` |

Still true (not a bug): ranking HTML is large because 313 landers stay byte-for-byte. Do not rewrite them in this phase.

---

## 4. Security checklist (launch)

| Check | Status |
| --- | --- |
| HTTPS + HSTS | Worker sets `strict-transport-security` |
| Apex/www → immigration host | 301 |
| CSP | Site CSP for ads/GTM/Clarity; AMP CSP is separate |
| Studio `noindex` | robots.txt + meta + `X-Robots-Tag` |
| Studio auth | GitHub allowlist + optional password; cookies `HttpOnly; Secure; SameSite` |
| Publish | GitHub token or OAuth `public_repo`; quality gates in `worker/sop.js` |
| Secrets | Wrangler secrets / GitHub Actions secrets — not in git |
| `.dev.vars` | gitignored; example file has empty values |
| Forms | `/api/lead` rate-limited + field caps |
| Old `/admin` HTML | Not deployed; 301 to Studio |
| Do not click your own ads | AdSense policy |

Leads still land in D1 via `POST /api/lead`. The old CRM screens are gone. WhatsApp **+92 304 5999859** is the live follow-up path.

---

## 5. Daily use

Follow **[docs/DAILY-USE.md](DAILY-USE.md)** — 1 blog, 5 news, 5 Web Stories, Pakistan time, no visa guarantees.

Studio: https://immigration.salaroutsourcing.com/studio/

---

## Launch smoke (after this PR deploys)

1. https://immigration.salaroutsourcing.com/ads.txt — must show `pub-5113459275916426`
2. https://immigration.salaroutsourcing.com/llms.txt
3. https://immigration.salaroutsourcing.com/news/germany-blocked-account-2026-what-changed/
4. https://immigration.salaroutsourcing.com/stories/europe-without-ielts-story/amp/ — no ads/Clarity
5. https://immigration.salaroutsourcing.com/studio/ — sign-in card, not indexed
6. https://immigration.salaroutsourcing.com/admin — must redirect to `/studio/`

## How to confirm

After you have opened Studio and the homepage, reply **“Phase 6 confirmed — launched”**.
