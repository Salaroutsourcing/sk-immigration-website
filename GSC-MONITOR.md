# Google Search Console & ranking monitor

Use this weekly after deploy. Official domain: **skimmigrationservices.works** (`https://www.skimmigrationservices.works`).

## Setup

1. Add property: `https://www.skimmigrationservices.works` (URL-prefix) and/or Domain property.
2. Verify via DNS TXT or HTML file.
3. Submit sitemap: `https://www.skimmigrationservices.works/sitemap.xml`
4. Confirm Cloudflare AI blocks are off (`CLOUDFLARE-AI.md`).
5. Run local ops check: `node scripts/check-ai-ops.mjs` (optional live probes with network).

## Money keywords to track (Pakistan)

- germany study visa pakistan
- uk study visa pakistan
- canada study visa pakistan
- study visa consultant rawalpindi
- schengen appointment pakistan
- saudi visa processing pakistan / e number
- ausbildung pakistan
- study abroad without ielts pakistan
- document attestation rawalpindi
- SK Immigration Services CUIN 0304985

## Pages to request indexing first

- `/`
- `/trust.html`
- `/study-visa/`
- `/study-visa/germany-study-visa-pakistan/`
- `/study-visa/hungary-study-visa-pakistan/`
- `/study-visa/uk-study-visa-pakistan/`
- `/visit-visa/uk-visit-visa-pakistan/`
- `/visit-visa/schengen-visit-visa-pakistan/`
- `/work-permit/germany-work-permit-pakistan/`
- `/saudi-visa/saudi-visa-processing-pakistan/`
- `/local/rawalpindi-study-visa-consultant/`
- `/answers`
- `/answers/who-is-sk-immigration`
- `/llms.txt`
- `/services.html`

## Weekly checklist

- [ ] Impressions rising on money queries?
- [ ] Any `/study-visa/*` excluded / soft-404?
- [ ] Core Web Vitals OK on mobile (hero image weight)?
- [ ] New Google reviews this week? (link from `/trust.html`)
- [ ] Cloudflare AI Crawl Control still allowing citation bots?
- [ ] One internal link from a blog post → country money page → contact?
- [ ] Sitemap resubmitted after large content batches?

## AI Overview / assistant check

Ask ChatGPT / Perplexity / Google AI Mode:

1. “Who is SK Immigration Services Rawalpindi CUIN?”
2. “Germany study visa Pakistan consultant Satellite Town”
3. “Is skimmigrationservices.works the same as SK Immigration?”

Note whether `skimmigrationservices.works`, `/trust.html`, or `llms.txt` facts appear. If not, re-check crawler allows + GBP + reviews + deploy freshness (`wrangler deploy` — git push alone does not update Workers assets).
