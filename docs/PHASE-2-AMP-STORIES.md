# Phase 2 — AMP Web Stories (stop here)

Every Web Story now has a real AMP document for Google Discover, plus a Discover feed. The on-site HTML player is unchanged. The last screen still opens a long-form blog.

**Phase 2 is confirmed.** JSON-LD / `llms.txt` are Phase 3 — see `docs/PHASE-3-JSONLD-LLMS.md`.

## What shipped

| URL | Role |
| --- | --- |
| `/stories/` | Story index. Cards link to the HTML player and to AMP. |
| `/stories/{slug}/` | HTML tap-through player (site header, regular JS). Points at AMP with `rel="amphtml"`. |
| `/stories/{slug}/amp/` | Valid AMP Web Story. **This URL is the canonical story** Google should index. |
| `/stories/sitemap.xml` | AMP URLs + poster images (submit this in Search Console). |
| `/webstories.xml` | RSS of AMP stories (Discover / Web Stories feed). |

Rules that still hold:

- 4–12 slides
- Required `relatedBlog`
- Last screen CTA opens that blog (never a WhatsApp-only dead end)
- AMP pages have **no** GTM, AdSense, Clarity, or regular JavaScript
- Worker CSP on AMP URLs allows only `https://cdn.ampproject.org` scripts

## Sample to click

After this is live on Cloudflare:

1. HTML player: https://immigration.salaroutsourcing.com/stories/europe-without-ielts-story/
2. AMP story (full screen, no website header): https://immigration.salaroutsourcing.com/stories/europe-without-ielts-story/amp/
3. Feed: https://immigration.salaroutsourcing.com/webstories.xml
4. Stories sitemap: https://immigration.salaroutsourcing.com/stories/sitemap.xml

Optional check: paste the AMP URL into [Google’s AMP test](https://search.google.com/test/amp).

## Studio

No new Studio screens. **Publish** still writes MDX; the next GitHub Actions deploy builds the AMP page automatically.

Poster images should be portrait (3:4) when you can. A square publisher logo (at least 96×96) at `/assets/img/logo.jpg` helps Discover.

## What Phase 2 does **not** do (waiting)

3. Full JSON-LD expansion + `llms.txt` rewrite — **done, see `docs/PHASE-3-JSONLD-LLMS.md`**
4. AdSense slot fill + Clarity script inject (Phase 4)
5. Daily publishing SOP — **done, see `docs/PHASE-5-DAILY-SOP.md`**.

## How to confirm

After review, reply **“Phase 2 confirmed — start Phase 3”**.
