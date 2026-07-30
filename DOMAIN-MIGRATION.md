# Brand domain migration decision

## Current state

| Layer | Value |
|-------|--------|
| Public brand | **SK Immigration Services** |
| Parent company | **Salar Outsourcing** |
| Domain | `salaroutsourcing.com` |

Searchers type “SK Immigration”, “study visa Rawalpindi”, “Germany study visa Pakistan” — not “outsourcing”. The domain mismatches the brand and dilutes entity clarity for Google Knowledge / AI.

## Decision (recommended)

**Keep `salaroutsourcing.com` live** for now (email, GBP, WhatsApp already use it), while:

1. Claiming GBP strictly as **SK Immigration Services** with this NAP.
2. Using consistent on-site phrasing: “SK Immigration Services by Salar Outsourcing”.
3. Optionally registering `skimmigration.pk` or `skimmigrationservices.com` as a future primary.

## If you migrate later

1. Buy brand domain; point DNS to same Cloudflare Pages project (or 301 at edge).
2. 301 **every** indexed URL (not just homepage).
3. Update canonicals, sitemap, `llms.txt`, schema `url` / `@id`, GBP website, social bios.
4. Keep parent company mention in footer + schema `parentOrganization`.
5. Monitor GSC coverage for 90 days.

## Do not do yet

Do not change domains until GBP is claimed and top `/study-visa/` pages are indexed — migrating first multiplies crawl debt.
