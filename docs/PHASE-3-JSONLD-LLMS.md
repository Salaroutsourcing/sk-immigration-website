# Phase 3 — JSON-LD + `llms.txt` (stop here)

Astro news, blogs, and Web Stories now emit the same class of entity JSON-LD as the ranking HTML pages (Organization, LocalBusiness, WebSite, speakable, citations, FAQ). `llms.txt` is generated at build time from published collections so the daily 5+5+1 machine stays visible to AI crawlers.

**Phase 3 is confirmed.** AdSense / Clarity are Phase 4 — see `docs/PHASE-4-ADSENSE-CLARITY.md`.

## What shipped

| URL | Role |
| --- | --- |
| `/llms.txt` | Short [llms.txt](https://llmstxt.org) index: identity, hubs, **live** news/blogs/AMP stories, feeds |
| `/llms-full.txt` | Full citation brief including the existing Q&A answers |
| `/ai.txt` | Short pointer for crawlers |
| `/.well-known/llms.txt` | 301 → `/llms.txt` |
| `/.well-known/ai.txt` | 301 → `/ai.txt` |

JSON-LD on Astro pages now includes:

- Organization + LocalBusiness + WebSite (same `@id`s as ranking pages)
- `NewsArticle` with dateline, sources, speakable, related blog
- `BlogPosting` + `FAQPage` with related AMP stories
- `CollectionPage` + `ItemList` on `/news/`, `/blog/`, `/stories/`
- AMP stories still canonical on `/stories/{slug}/amp/`

## Sample to click (after merge + deploy)

1. https://immigration.salaroutsourcing.com/llms.txt — should list the Europe-without-IELTS blog, the Germany blocked-account news, and the AMP story
2. https://immigration.salaroutsourcing.com/llms-full.txt — should still answer “Does SK Immigration guarantee a visa?”
3. View-source on https://immigration.salaroutsourcing.com/news/germany-blocked-account-2026-what-changed/ and search for `NewsArticle` and `citation`

Studio does not change. **Publish** still writes MDX; the next deploy regenerates `llms.txt`.

## What Phase 3 does **not** do (waiting)

4. AdSense slot fill + Clarity script inject — **done, see `docs/PHASE-4-ADSENSE-CLARITY.md`**
5. Daily publishing SOP (Phase 5)
6. Rewriting the 313 ranking HTML landers (they already inject schema via `geo-schema.js`)

## How to confirm

After review, reply **“Phase 3 confirmed — start Phase 4”**.
