# Salar Outsourcing Website

Premium static website for **Salar Outsourcing** (parent company) and **SK Immigration Services** (brand).

- Fast hosting: GitHub Pages / Cloudflare Pages / Netlify / Vercel
- Dark/light mode, glass UI, mobile-first
- Eligibility quiz, CV builder, jobs/Ausbildung portal, blog admin, Admin CRM
- Thin Google Apps Script API for Sheets (optional) — UI is NOT hosted on Apps Script

## Folder structure

```
website/
├── index.html, about.html, services.html, contact.html
├── ausbildung.html, jobs.html, attestation.html, countries.html
├── blog.html, blog-post.html, eligibility.html, cv-builder.html, portal.html
├── admin/                 # Fast CRM + blog/jobs admin (password: Salaar@98)
├── assets/
│   ├── css/main.css
│   ├── js/                # config, theme, api, layout, quiz, jobs, blog, cv
│   ├── data/              # jobs.json, blog-posts.json, countries.json
│   └── img/logo.svg
├── apps-script/           # Code.gs + Index.html — deploy as Web App API
├── robots.txt, sitemap.xml, manifest.json
├── README.md
└── DEPLOY.md
```

## Quick start (local)

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```

## Admin password

Default blog/CRM/jobs admin password: `Salaar@98`  
Change it in `assets/js/api.js` (`loginAdmin` hash source) and `apps-script/Code.gs`.

## Connect Google Sheets

1. Create a Google Sheet (or use existing lead sheet).
2. Extensions → Apps Script → paste `apps-script/Code.gs`.
3. Deploy → New deployment → Web app → Anyone.
4. Paste URL into `assets/js/config.js` → `appsScriptUrl`.

Legacy full portal URL is already set as `legacyPortalUrl` (your current slow Apps Script UI).

See **DEPLOY.md** for GitHub Pages + Cloudflare custom domain steps.
