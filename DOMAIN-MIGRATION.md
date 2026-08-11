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
| Apex / www | Temporary redirect → immigration subdomain until it ranks |

## Decision (2026-08-11)

**`https://immigration.salaroutsourcing.com` is the only public website** for SK Immigration Services.

Use that host in canonicals, sitemap, schema, GBP, Analytics, `ai.txt`, and `llms.txt`. Keep email on the parent domain: `Services@salaroutsourcing.com`.

## Live checklist (GitHub Pages only — no Cloudflare required)

1. Repo → Settings → Pages → Custom domain = `immigration.salaroutsourcing.com` → Wait until HTTPS is green.
2. DNS at registrar for zone `salaroutsourcing.com`:
   - `immigration` **CNAME** → `salaroutsourcing.github.io`
3. Apex / www temporary SEO bridge (until subdomain ranks), pick one:
   - Registrar **URL forward / redirect** (path-preserving if available) → `https://immigration.salaroutsourcing.com`
   - Or run `npm run build:legacy-redirect` and publish the stubs from a separate Pages repo whose custom domain is `salaroutsourcing.com` / `www`
4. Google Analytics stream URL: `https://immigration.salaroutsourcing.com`
5. Google Business Profile website: `https://immigration.salaroutsourcing.com`
6. Search Console: verify subdomain + submit `https://immigration.salaroutsourcing.com/sitemap.xml`
7. Email stays: `Services@salaroutsourcing.com`

## Do not do

Do not describe the site as “a division of Salar Outsourcing” in client-facing copy.  
Do not point Instagram to similarly named foreign consultants.
