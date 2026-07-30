# Cloudflare AI Crawl Control — required for AI Overviews

Your repo `robots.txt` **allows** GPTBot, ClaudeBot, Google-Extended, PerplexityBot, and other citation crawlers.

Cloudflare’s managed **AI Crawl Control** feature can still **prepend Disallow rules** that override your file. When that happens, assistants and some Google AI features cannot read the site — even though `llms.txt` invites them.

## Fix (dashboard)

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) → select **salaroutsourcing.com**.
2. Go to **Security** → **Settings** / **AI Crawl Control** (wording varies by plan).
3. **Disable** blanket blocks for:
   - Google-Extended
   - GPTBot / OAI-SearchBot / ChatGPT-User
   - ClaudeBot / anthropic-ai
   - PerplexityBot
   - Applebot-Extended (optional but useful)
4. Keep blocking pure training scrapers if you want (`ai-train=no` content signal is fine).
5. Save, then verify:

```bash
curl -sL https://www.salaroutsourcing.com/robots.txt | head -80
```

You should **not** see Cloudflare Managed `Disallow: /` blocks for GPTBot / Google-Extended ahead of your Allow rules.

## After changing

1. Resubmit sitemap in Google Search Console.
2. Request indexing for `/`, `/study-visa/`, and top country pages.
3. Spot-check that ChatGPT / Perplexity can fetch `https://www.salaroutsourcing.com/llms.txt`.

## Content-Signal note

If Cloudflare injects `Content-Signal: search=yes,ai-train=no,use=reference`, that is compatible with citation use. Do **not** set `ai-input=no` if you want AI Overviews / assistant grounding.
