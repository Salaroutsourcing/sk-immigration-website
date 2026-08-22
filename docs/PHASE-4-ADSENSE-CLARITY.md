# Phase 4 — AdSense slots + Microsoft Clarity (stop here)

**Phase 4 is confirmed.** Daily publishing SOP is Phase 5 — see `docs/PHASE-5-DAILY-SOP.md`.

Public Astro pages now mount real AdSense units (same publisher as the ranking HTML) and load Microsoft Clarity. Studio and AMP Web Stories stay ad-free and Clarity-free.

## What shipped

| Surface | Ads | Clarity |
| --- | --- | --- |
| News / blog articles | In-article + bottom display + sidebar | Yes |
| `/news/`, `/blog/`, `/stories/` indexes | In-feed unit | Yes |
| Ranking HTML landers | Unchanged (`adsense-connect.js` + Auto ads) | Unchanged (not injected into 313 HTML files) |
| `/studio/` | None | None |
| `/stories/{slug}/amp/` | None | None |

IDs (already in `src/lib/site.ts`):

- AdSense: `ca-pub-5113459275916426`
- Clarity: `y3u0myqn1l`

The Worker CSP now allows `https://www.clarity.ms` so Clarity is not blocked.

Ads may show as a blank reserved box until Google serves a creative. That is normal. Do not click your own ads.

## Sample to click (after merge + deploy)

1. https://immigration.salaroutsourcing.com/news/germany-blocked-account-2026-what-changed/ — look for **Advertisement** boxes; view-source and search `clarity.ms` and `adsbygoogle`
2. https://immigration.salaroutsourcing.com/studio/ — must **not** contain `clarity.ms` or `adsbygoogle`
3. https://immigration.salaroutsourcing.com/stories/europe-without-ielts-story/amp/ — must **not** contain ads or Clarity

## What Phase 4 does **not** do

Ranking HTML landers were not rewritten to add Clarity (they already have AdSense). Daily publishing SOP is `docs/PHASE-5-DAILY-SOP.md`.
