# Brand vs domain (decision locked)

## Current state

| Layer | Value |
|-------|--------|
| Public brand | **SK Immigration Services** |
| Legal entity | **SK Immigration Services (SMC-Private) Limited** · CUIN **0304985** |
| Canonical website | **`https://immigration.salaroutsourcing.com`** |
| Email | **`Services@salaroutsourcing.com`** |
| Hosting | **GitHub Pages** (org: Salaroutsourcing) |
| Analytics | **`G-NLZG0RV6ZZ`** |
| Apex / www | **301 → immigration subdomain** until the subdomain ranks |

## Decision (2026-08-11)

**`https://immigration.salaroutsourcing.com` is the only public website** for SK Immigration Services.

Use that host in canonicals, sitemap, schema, GBP, Analytics, `ai.txt`, and `llms.txt`. Keep email on the parent domain: `Services@salaroutsourcing.com`.

On-site phrasing:

> SK Immigration Services is the public brand of SK Immigration Services (SMC-Private) Limited (CUIN 0304985). Official website: immigration.salaroutsourcing.com · Email: Services@salaroutsourcing.com — same company, same Rawalpindi office.

## Live checklist (GitHub Pages)

1. Repo → Settings → Pages → Custom domain = `immigration.salaroutsourcing.com` → Wait until HTTPS is green.
2. DNS at registrar for zone `salaroutsourcing.com`:
   - `immigration` **CNAME** → `salaroutsourcing.github.io` (or the Pages host GitHub shows for this repo)
3. Apex / www temporary SEO bridge (until subdomain ranks):
   - Prefer Cloudflare Redirect Rule: `https://salaroutsourcing.com/*` and `https://www.salaroutsourcing.com/*` → `https://immigration.salaroutsourcing.com/${1}` (301, preserve query)
   - Or deploy Worker routes in `wrangler.jsonc` / `src/index.js` (already redirects apex + www → immigration)
4. Google Analytics stream URL: `https://immigration.salaroutsourcing.com`
5. Google Business Profile website: `https://immigration.salaroutsourcing.com`
6. Search Console: verify `https://immigration.salaroutsourcing.com` + submit `https://immigration.salaroutsourcing.com/sitemap.xml`
7. Email stays: `Services@salaroutsourcing.com`

## Do not do

Do not describe the site as “a division of Salar Outsourcing” in client-facing copy.  
Do not point Instagram to similarly named foreign consultants.
