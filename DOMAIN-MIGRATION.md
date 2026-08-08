# Brand vs domain (decision locked)

## Current state (keep this)

| Layer | Value |
|-------|--------|
| Public brand | **SK Immigration Services** |
| Legal entity | **SK Immigration Services (SMC-Private) Limited** · CUIN **0304985** |
| Website / email domain | **`skimmigrationservices.works`** |
| Canonical URL | **`https://skimmigrationservices.works`** (apex — GitHub Pages primary) |
| Hosting | **GitHub Pages** (`sk-immigration-website.github.io`) |
| Analytics | **`G-WY6GEWLDEL`** |
| Legacy domain | **`salaroutsourcing.com`** — must 301 at registrar to the new apex |

Searchers type “SK Immigration”, “study visa Rawalpindi”, etc. Entity clarity comes from **on-site NAP + CUIN + schema + trust.html**.

## Decision (2026-08-08 / 2026-08-09)

**`https://skimmigrationservices.works` is the primary public website** for SK Immigration Services.

Use apex (no `www`) in canonicals, sitemap, schema, GBP, and Google Analytics stream URL. GitHub Pages serves the apex; `www` should redirect to apex once DNS/SSL settles.

On-site phrasing:

> SK Immigration Services is the public brand of SK Immigration Services (SMC-Private) Limited (CUIN 0304985). Official website and email: skimmigrationservices.works — same company, same Rawalpindi office.

## Live checklist (GitHub Pages)

1. Repo → Settings → Pages → Custom domain = `skimmigrationservices.works` → Wait until HTTPS is green
2. DNS at registrar (Name.com):
   - Apex `A` → `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153`
   - Apex `AAAA` → `2606:50c0:8000::153` `2606:50c0:8001::153` `2606:50c0:8002::153` `2606:50c0:8003::153`
   - `www` `CNAME` → `sk-immigration-website.github.io`
3. Google Analytics stream URL: `https://skimmigrationservices.works` (not www)
4. Google Business Profile website: `https://skimmigrationservices.works`
5. Search Console property for the new domain + submit `https://skimmigrationservices.works/sitemap.xml`
6. Old domain `salaroutsourcing.com`: registrar **301 URL forward** → `https://skimmigrationservices.works` (with path forwarding if available)
7. Email: `Services@skimmigrationservices.works` (or forward from the old inbox)

## Do not do

Do not describe the site as “a division of Salar Outsourcing” in client-facing copy.  
Do not point Instagram to similarly named foreign consultants.
