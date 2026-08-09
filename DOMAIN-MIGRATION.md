# Brand vs domain (decision locked)

## Current state (keep this)

| Layer | Value |
|-------|--------|
| Public brand | **SK Immigration Services** |
| Legal entity | **SK Immigration Services (SMC-Private) Limited** · CUIN **0304985** |
| Website / email domain | **`skimmigrationservices.works`** |
| Canonical URL | **`https://skimmigrationservices.works`** (apex — GitHub Pages primary) |
| Hosting | **GitHub Pages** (`sk-immigration-website.github.io`) |
| Analytics | **`G-NLZG0RV6ZZ`** |
| Legacy domain | **`salaroutsourcing.com`** — live redirect to the new apex, see [Legacy domain redirect](#legacy-domain-redirect-live) |

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
   - `www` `CNAME` → `salaroutsourcing.github.io`  
     Do **not** use `sk-immigration-website.github.io` (that shows “There isn’t a GitHub Pages site here”).
3. Google Analytics stream URL: `https://skimmigrationservices.works` (not www)
4. Google Business Profile website: `https://skimmigrationservices.works`
5. Search Console property for the new domain + submit `https://skimmigrationservices.works/sitemap.xml`
6. Old domain `salaroutsourcing.com`: done — see [Legacy domain redirect](#legacy-domain-redirect-live)
7. Email: `Services@skimmigrationservices.works` (or forward from the old inbox)

## Legacy domain redirect (live)

The old site was canonicalised on **`www.salaroutsourcing.com`** — all 293
pre-migration sitemap URLs used the `www` host, not the apex. Any fix that only
covers the apex misses every indexed URL.

After the domain move nothing claimed the old host, so all of it served GitHub's
"There isn't a GitHub Pages site here" 404. It is now served by the
**`Salaroutsourcing/salaroutsourcing.com`** repo (Pages custom domain =
`www.salaroutsourcing.com`; GitHub 301s the bare apex to `www` on its own).

Regenerate and redeploy after any URL change on the live site:

```bash
npm run build:legacy-redirect          # reads sitemap.xml → legacy-redirect/
# then copy legacy-redirect/ into the Salaroutsourcing/salaroutsourcing.com repo and push
```

`legacy-redirect/` is generated, gitignored, and excluded from this site's Pages
build — it must never publish under the new domain.

### Why per-URL stubs instead of a registrar forward

GitHub Pages cannot emit an HTTP 301. Each old URL therefore gets its own
200-status stub with an instant meta refresh plus a canonical tag, which Google
documents as a permanent redirect. A registrar/Hostinger URL forward would give
a real 301 but drops the path, collapsing all 292 URLs onto the homepage —
Google reads mass redirects to an unrelated page as soft 404s, so per-page
ranking signals would be lost. Path-preserving soft redirects beat a
homepage-only hard redirect here.

Unmatched paths fall through to `404.html`, which keeps the path via JS. Query
strings and fragments are preserved on every stub.

### Optional upgrade to a true 301

A real 301 is still the strongest signal. To get one, move
`salaroutsourcing.com` DNS to Cloudflare (free) and replace this whole site with
a single rule:

1. Add `salaroutsourcing.com` to Cloudflare, switch nameservers at the registrar
   away from `ns1/ns2.dns-parking.com`.
2. Proxy (orange-cloud) the apex and `www` records.
3. **Rules → Redirect Rules**: wildcard `https://*salaroutsourcing.com/*` →
   `https://skimmigrationservices.works/${2}`, status **301**, preserve query string.
4. Once verified, the `Salaroutsourcing/salaroutsourcing.com` repo can be archived.

Note: `wrangler.jsonc` still lists `salaroutsourcing.com` routes and
`src/index.js` still has legacy-host redirect logic, but that Worker is **not
deployed** — the site is served by GitHub Pages. That code does nothing today.

### Still to do after the redirect (Google + AI assistants)

1. **Search Console → Settings → Change of Address** on the old property,
   pointing to the new one. This is the single biggest signal to Google; it
   needs the redirect in place first (done).
2. Verify `www.salaroutsourcing.com` as a GSC property if it is not already, and
   submit `https://www.salaroutsourcing.com/sitemap.xml` (the generated
   old-URL sitemap) so the retired URLs get recrawled and the redirects found.
3. **Bing Webmaster Tools → Site Move.**
4. Update off-site citations, which is what AI assistants mostly read:
   Google Business Profile, Facebook/Instagram/LinkedIn, WhatsApp Business,
   directory and SECP listings, email signatures, ad accounts.
5. Keep the old domain registered and this redirect live for **at least 12
   months**; retiring it early throws away the accumulated links.

## Do not do

Do not describe the site as “a division of Salar Outsourcing” in client-facing copy.  
Do not point Instagram to similarly named foreign consultants.
