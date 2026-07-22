# Go live on GitHub Pages (salaroutsourcing.com)

Your complete website files are here on your Mac:

```
/Users/4star/visa_bot/website
```

---

## Option 1 — New GitHub repo (cleanest)

### A. Create repo on GitHub
1. Open https://github.com/new
2. Name: `salaroutsourcing` (or `sk-immigration`)
3. Public · **Do not** add README
4. Create repository

### B. Push this folder

```bash
cd /Users/4star/visa_bot/website
git init
git add .
git commit -m "SK Immigration Services — production website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/salaroutsourcing.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username.)

### C. Enable GitHub Pages
1. Repo → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)`
4. Save → wait 1–2 minutes
5. Temporary URL: `https://YOUR_USERNAME.github.io/salaroutsourcing/`

### D. Connect salaroutsourcing.com (Cloudflare recommended)
1. Cloudflare → Add site → `salaroutsourcing.com` (free plan)
2. Change domain nameservers at your registrar to Cloudflare’s
3. DNS:
   - `www` → CNAME → `YOUR_USERNAME.github.io` (Proxied)
   - Apex `@` → follow GitHub Pages A records **or** CNAME flattening to `YOUR_USERNAME.github.io`
4. GitHub Pages → Custom domain → `salaroutsourcing.com` (+ www)
5. Enable HTTPS in both GitHub and Cloudflare (SSL Full)

### E. After DNS works
1. Google Search Console → Add property → Submit `sitemap.xml`
2. Bing Webmaster Tools → Submit sitemap
3. Keep your old content live until DNS fully switches (avoid downtime)

---

## Option 2 — Replace files in your existing live repo

If salaroutsourcing.com already points to a GitHub repo:

1. Backup the current repo (download ZIP)
2. Copy everything inside `/Users/4star/visa_bot/website/` into that repo root
3. Commit & push
4. Pages will update automatically

⚠️ Keep your blog country URLs if they already rank (or set redirects). Your live site ranks partly because of `/blog/germany-student-visa/` style pages — migrate those posts into the new blog system or keep those paths.

---

## AI / SEO files included

| File | Purpose |
|------|---------|
| `llms.txt` | Facts for ChatGPT / Claude / Gemini / Perplexity |
| `ai.txt` | Short AI crawler hint |
| `faq.html` | FAQPage schema (AI loves citing FAQs) |
| `robots.txt` | Allows GPTBot, ClaudeBot, PerplexityBot, Google |
| `sitemap.xml` | Search + AI discovery map |
| `assets/js/seo.js` | Organization + LocalBusiness schema |

---

## After go-live checklist

- [ ] Open https://salaroutsourcing.com — confirms new site
- [ ] Test WhatsApp, contact form, eligibility, CV send
- [ ] Search Console → Request indexing for `/` and `/faq.html`
- [ ] Google Business Profile (Rawalpindi office) → link website
- [ ] Post 2–4 new blog answers per week (same style as your current guides)
- [ ] Deploy Apps Script API → paste URL in `assets/js/config.js` → `appsScriptUrl`
