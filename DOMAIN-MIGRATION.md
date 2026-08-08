# Brand vs domain (decision locked)

## Current state (keep this)

| Layer | Value |
|-------|--------|
| Public brand | **SK Immigration Services** |
| Legal entity | **SK Immigration Services (SMC-Private) Limited** · CUIN **0304985** |
| Website / email domain | **`skimmigrationservices.works`** (canonical: `https://www.skimmigrationservices.works`) |
| Legacy domain | **`salaroutsourcing.com`** — 301 redirect to the new domain (Worker) |

Searchers type “SK Immigration”, “study visa Rawalpindi”, etc. Entity clarity comes from **on-site NAP + CUIN + schema + trust.html**.

## Decision (2026-08-08)

**`skimmigrationservices.works` is the primary public website** for SK Immigration Services.

On-site phrasing (use everywhere):

> SK Immigration Services is the public brand of SK Immigration Services (SMC-Private) Limited (CUIN 0304985). Official website and email: skimmigrationservices.works — same company, same Rawalpindi office.

Do **not** describe the site as “a division of Salar Outsourcing” in client-facing copy. Public SEO/AI citation must lead with SK Immigration + CUIN + `skimmigrationservices.works`.

## Migration checklist

1. Cloudflare DNS + Worker routes for `skimmigrationservices.works` (and `www`)
2. Keep legacy `salaroutsourcing.com` routes until Search Console shows redirects settled, then retire
3. Update Google Business Profile website URL to `https://www.skimmigrationservices.works`
4. Resubmit sitemap in Google Search Console for the new property
5. Point email to `Services@skimmigrationservices.works` (or forward from the old inbox)

## Do not do

Do not point Instagram to similarly named foreign consultants.
