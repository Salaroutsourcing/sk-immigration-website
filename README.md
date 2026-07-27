# Salar Outsourcing Website

Website for **Salar Outsourcing** (parent company) and **SK Immigration Services** (brand).

Live at <https://www.salaroutsourcing.com>.

- Static pages served by Cloudflare Workers static assets
- A small Worker API (`src/index.js`) handles form submissions and admin access
- Leads are stored in Cloudflare D1, not in the visitor's browser
- Dark/light mode, glass UI, mobile-first
- Eligibility quiz, CV builder, jobs/Ausbildung portal, blog admin, Admin CRM

## Folder structure

```
.
├── index.html, about.html, services.html, contact.html
├── ausbildung.html, jobs.html, attestation.html, countries.html
├── blog.html, blog-post.html, eligibility.html, cv-builder.html, portal.html
├── admin/                 # CRM + blog/jobs admin (server-authenticated)
├── answers/, blog/        # SEO / AI-citable content
├── assets/
│   ├── css/main.css
│   ├── js/                # config, theme, api, layout, quiz, jobs, blog, cv
│   ├── data/              # jobs.json, blog-posts.json, countries.json
│   └── img/
├── src/index.js           # Cloudflare Worker: /api/* + static asset serving
├── schema.sql             # D1 table definition
├── .assetsignore          # keeps backend/internal files off the public site
├── robots.txt, sitemap.xml, manifest.json
├── README.md
└── DEPLOY.md
```

## Quick start (local)

```bash
npm install
cp .dev.vars.example .dev.vars     # then fill in the two required values
npm run db:migrate:local
npm run dev                        # http://localhost:8787
```

The site needs the Worker running to accept form submissions; a plain static
file server will show the pages but every form will fail.

## Admin access

The admin password is never stored in the repo or sent to the browser. It lives
as a Cloudflare secret holding the SHA-256 hash of the password:

```bash
printf 'your-new-password' | shasum -a 256      # copy the hex digest
npx wrangler secret put ADMIN_PASSWORD_HASH     # paste it
npx wrangler secret put SESSION_SECRET          # openssl rand -hex 32
```

Signing in sets an HttpOnly, HMAC-signed cookie that expires after 12 hours.

## Lead notifications (optional)

Set `LEAD_WEBHOOK_URL` and every new lead is POSTed there as JSON, so you get
an instant alert instead of waiting to check the dashboard:

```bash
npx wrangler secret put LEAD_WEBHOOK_URL
```

This works with Zapier, Make, n8n, or the Google Apps Script Web App in
`apps-script/` if you want a Google Sheets mirror.

See **DEPLOY.md** for deployment and DNS steps.
