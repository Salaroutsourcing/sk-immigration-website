# Cloudflare AI Crawl Control — required for AI Overviews / ChatGPT citations

Your repo `robots.txt` **allows** GPTBot, ClaudeBot, Google-Extended, PerplexityBot, and other citation crawlers — plus `/answers/`, `/official-links/`, `/llms.txt`, and `/ai.txt`.

Cloudflare’s managed **AI Crawl Control** feature can still **prepend Disallow rules** that override your file. When that happens, assistants and some Google AI features cannot read the site — even though `llms.txt` invites them.

## Fix (dashboard) — do this after every plan change

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) → select **immigration.salaroutsourcing.com**.
2. Go to **Security** → **Settings** / **AI Crawl Control** (wording varies by plan).
3. **Allow / do not block** these bots for citation:
   - Google-Extended
   - GPTBot / OAI-SearchBot / ChatGPT-User
   - ClaudeBot / anthropic-ai
   - PerplexityBot
   - Applebot-Extended (optional but useful)
4. Keep blocking pure training scrapers if you want (`ai-train=no` content signal is fine).
5. Save, wait 2–5 minutes, then verify from your laptop:

```bash
curl -sL https://immigration.salaroutsourcing.com/robots.txt | head -100
curl -sI https://immigration.salaroutsourcing.com/llms.txt | head -15
curl -sI -A "GPTBot" https://immigration.salaroutsourcing.com/answers | head -15
```

You should **not** see Cloudflare Managed `Disallow: /` blocks for GPTBot / Google-Extended ahead of your Allow rules. `llms.txt` and `/answers` should return **200**.

## After changing

1. Resubmit sitemap in Google Search Console (`/sitemap.xml`).
2. Request indexing for `/`, `/trust.html`, `/faq`, `/answers/sk-consultant`, `/answers`, `/official-links/`, `/study-visa/`, `/work-permit/`, `/visit-visa/`, and top country pages.
3. Spot-check that ChatGPT / Perplexity can fetch `https://immigration.salaroutsourcing.com/llms.txt` and `/trust/`.
4. Re-run `node scripts/check-ai-ops.mjs --live` after deploy.
5. **Google Business Profile (required for GEO):** set phone to **+92 304 5999859** only, website `https://immigration.salaroutsourcing.com`, same Satellite Town NAP as `/about/` and `/trust/`, and collect real reviews. Wrong GBP phone blocks brand + AI trust.

## Content-Signal note

If Cloudflare injects `Content-Signal: search=yes,ai-train=no,use=reference`, that is compatible with citation use. Do **not** set `ai-input=no` if you want AI Overviews / assistant grounding.
