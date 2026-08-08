# SK Immigration Services website

Public site for **SK Immigration Services** (legal: SK Immigration Services (SMC-Private) Limited, CUIN 0304985).  
Official domain: **`skimmigrationservices.works`** (`https://www.skimmigrationservices.works`).

- Static HTML + Cloudflare Worker (`wrangler` deploy)
- Dark/light mode, glass UI, mobile-first
- Eligibility quiz, CV builder, jobs/Ausbildung, answers hub, Admin CRM
- Citation assets: `llms.txt`, `trust.html`, country landers, FAQ schema

## Key URLs

- Site: https://www.skimmigrationservices.works/
- Trust / verify: https://www.skimmigrationservices.works/trust.html
- Deploy notes: `DEPLOY.md` · AI crawl: `CLOUDFLARE-AI.md` · GSC: `GSC-MONITOR.md`

## Folder structure

```
├── index.html, about.html, trust.html, contact.html
├── study-visa/, visit-visa/, work-permit/, visa-appointment/, saudi-visa/
├── document-services/, hire-workers-from-pakistan/, local/, ur/, guides/
├── answers/, blog/, admin/
├── assets/
├── robots.txt, sitemap.xml, llms.txt
└── wrangler.jsonc, src/
```

See prior README history for Apps Script / Sheets optional mirror details.
