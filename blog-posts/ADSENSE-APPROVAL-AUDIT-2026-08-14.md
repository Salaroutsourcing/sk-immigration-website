# AdSense approval audit — 14 Aug 2026

Live check while application under review. Fixes applied on immigration host.

## Still OK
- Privacy / Cookies / Terms / About / Contact / Editorial / Trust → **200**
- Footer links Privacy, Cookies, Terms, Cookie settings (via `layout.js`)
- `ads.txt` → `google.com, pub-5113459275916426, DIRECT, f08c47fec0942fa0`
- AdSense client + meta `ca-pub-5113459275916426`
- GTM `GTM-NFWDQ5XB`
- Consent Mode regional defaults

## Issues found & fixed
1. **Ads on legal pages** (Privacy, Cookies, Terms, Editorial, About, Contact, Trust) — removed (reviewers expect clean policy pages).
2. **Cookie Policy** still said `sk_consent_v1` and “ads only after Accept all” — updated for `sk_consent_v2` + regional defaults.
3. **Success stories** used placeholder images + story-style quotes — set `noindex`, disclaimer, removed from sitemap until real consented client media exists.
4. **robots.txt** — explicit `Mediapartners-Google` Allow.
5. Extra spacing so ad units sit farther from WhatsApp / CTA blocks.

## Still on you (root domain)
`https://www.salaroutsourcing.com/ads.txt` is still **404**. AdSense Sites uses the root domain — publish ads.txt there (files in `blog-posts/root-domain-adsense/`).
