# Phase 5 — Daily publishing SOP (stop here)

Studio’s **Today’s desk** is now the daily machine: **1 blog, then 5 news, then 5 Web Stories**, counted in **Pakistan time (Asia/Karachi)**. Drafts do not fill the quota. Publish is blocked if the piece is too thin, sells a visa guarantee, or (for stories) does not open a blog.

**Phase 5 is confirmed.** Launch handbook is Phase 6 — see `docs/PHASE-6-LAUNCH.md` and `docs/DAILY-USE.md`.

## Open this

https://immigration.salaroutsourcing.com/studio/

(Sign in with GitHub or the Studio password.)

## What you do every day (click-by-click)

1. Open **Today’s desk**. The theme of the weekday is already chosen (Monday Germany, Tuesday IELTS/MOI, Wednesday Saudi, Thursday Schengen, Friday UK/Canada, Saturday Ausbildung, Sunday documents / Rawalpindi).
2. Click **Start** on the **blog** row first. Edit the facts. Fill **3 FAQs**. Click **Publish**.
3. Click **Start** on each **news** row. Keep the official `https://` source. Click **Publish** five times.
4. Click **Start** on each **Web Story**. The last slide must say **Open the blog** and go to today’s blog URL. Click **Publish** five times.
5. Wait for GitHub Actions **Deploy Cloudflare Worker** on `main`. Then open the public URLs from the **Published today** list.

If a slot would be a copy of yesterday with no new fact — **skip it**. Empty is better than a fake fee or a visa promise.

## Rules the Publish button now enforces

| Type | Must have |
| --- | --- |
| News | Official source name + `https://` URL, enough body, no “guarantee / 100% visa / fake job offer” |
| Blog | 3 FAQs, a real long guide, same language ban |
| Web Story | `relatedBlog`, poster, 4–12 slides, **last slide opens `/blog/…`** |

## After Publish

The public page is not instant. Studio writes the MDX file into GitHub; the next Worker deploy builds HTML. If Publish says “GitHub token missing”, the draft is only in Studio — sign in with GitHub (`public_repo`) or set `GITHUB_TOKEN`.

## Sample to click (after merge + deploy)

1. https://immigration.salaroutsourcing.com/studio/ — **Today’s desk** shows today’s theme and remaining 5 / 5 / 1
2. Start a news slot → **Sources** already has an official URL to verify
3. Try to Publish a story whose last slide is WhatsApp-only → it should refuse

## What Phase 5 does **not** do

Auto-write articles, post to TikTok/YouTube, or rewrite ranking HTML landers. Launch docs are `docs/PHASE-6-LAUNCH.md`.
