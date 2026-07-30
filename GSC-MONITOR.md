# Google Search Console & ranking monitor

Use this weekly after deploy.

## Setup

1. Add property: `https://www.salaroutsourcing.com` (URL-prefix) and/or Domain property.
2. Verify via DNS TXT or HTML file.
3. Submit sitemap: `https://www.salaroutsourcing.com/sitemap.xml`
4. Confirm Cloudflare AI blocks are off (`CLOUDFLARE-AI.md`).

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

## Pages to request indexing first

- `/`
- `/study-visa/`
- `/study-visa/germany-study-visa-pakistan/`
- `/study-visa/uk-study-visa-pakistan/`
- `/local/rawalpindi-study-visa-consultant/`
- `/guides/study-abroad-without-ielts-pakistan/`
- `/ur/`
- `/llms.txt`

## Weekly checklist

- [ ] Impressions rising on money queries?
- [ ] Any `/study-visa/*` excluded / soft-404?
- [ ] Core Web Vitals OK on mobile (hero image weight)?
- [ ] New Google reviews this week?
- [ ] One YouTube / Reel published with transcript link to a guide URL?
- [ ] One internal link from a blog post → country money page → contact?

## AI Overview / assistant check

Ask ChatGPT / Perplexity / Google AI Mode: “SK Immigration Services Rawalpindi study visa” and “Germany study visa Pakistan consultant Satellite Town”. Note whether `salaroutsourcing.com` or `llms.txt` facts appear. If not, re-check crawler allows + GBP + reviews.
