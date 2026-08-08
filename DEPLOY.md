# Deploy SK Immigration Services (free + fast)

> **After every production deploy:** follow [CLOUDFLARE-AI.md](CLOUDFLARE-AI.md) so AI crawlers are not blocked, then [GSC-MONITOR.md](GSC-MONITOR.md) for indexing. Brand-domain notes: [DOMAIN-MIGRATION.md](DOMAIN-MIGRATION.md).

## Why this is faster than Apps Script alone

| Layer | Where it runs | Speed |
|-------|---------------|-------|
| Website UI | Cloudflare / GitHub Pages CDN | Very fast |
| Admin CRM | Same static host | Very fast |
| Lead storage | Google Apps Script → Sheets | Only API calls (small) |
| Legacy case portal | Existing Apps Script UI | Optional / slower |

---

## Option A — GitHub Pages + Cloudflare (recommended)

### 1. Create repo & push

```bash
cd website
git init
git add .
git commit -m "Initial SK Immigration Services website"
# create repo on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USER/sk-immigration-website.git
git push -u origin main
```

### 2. Enable GitHub Pages

- Repo → **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: `main` / root (or `/docs` if you move files)
- Save — wait for `https://YOUR_USER.github.io/sk-immigration-website/`

If the site is in a subfolder of a larger repo, set Pages root to `/website`.

### 3. Custom domain on GitHub Pages (skimmigrationservices.works)

1. Repo → **Settings → Pages → Custom domain** → `skimmigrationservices.works` → Save.
2. Wait until **DNS check** passes and **Enforce HTTPS** is available/green.
3. At your DNS host (e.g. Name.com) set:
   - Apex `A` → `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153`
   - Apex `AAAA` → `2606:50c0:8000::153` `2606:50c0:8001::153` `2606:50c0:8002::153` `2606:50c0:8003::153`
   - `www` `CNAME` → `salaroutsourcing.github.io`  
     (**not** `sk-immigration-website.github.io` — that host has no Pages site and shows the GitHub 404 page)
4. Canonical site URL is the **apex**: `https://skimmigrationservices.works` (not www).
5. Google Analytics stream URL must match the apex.
6. Old domain: use registrar **301 URL forwarding** → `https://skimmigrationservices.works`

### 4. Forms / leads via Apps Script

1. Open Google Drive → New Spreadsheet: `SK Immigration Leads`
2. **Extensions → Apps Script**
3. Paste contents of `apps-script/Code.gs`
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy Web App URL
6. Set in `assets/js/config.js`:

```js
appsScriptUrl: 'https://script.google.com/macros/s/XXXX/exec',
```

7. Commit & push. Test a contact form — rows appear in the Sheet.

Email notifications: uncomment / use `_notify()` in Code.gs if desired.

---

## Option B — Cloudflare Pages (even simpler)

1. Cloudflare Dashboard → **Workers & Pages → Create → Pages**
2. Connect GitHub repo, root directory = `website` (or repo root if site is root)
3. Build command: none (static) · Output: `/`
4. Custom domain → add `skimmigrationservices.works`

---

## Option C — Netlify / Vercel

- Drag-and-drop the `website` folder, or connect Git.
- Publish directory = site root.
- Add custom domain in project settings.

---

## Legacy portal (keep both)

Your existing portal:

`https://script.google.com/macros/s/AKfycbz_Xy6fTRi1ompDQxHIYk-aRzBhzMS3PylHAlmJ98Dao1MA2GVWUpGoeGb4V8HvD752dQ/exec`

Linked from **portal.html**. Use it for existing candidate workflows.

Use **Admin CRM** (`/admin/`) for fast collection of:

- Bookings / contact forms  
- Eligibility quiz leads  
- CV builder submissions  
- Job / Ausbildung applications  
- Blog & job posting  

---

## Security notes

- Admin login is **server-side**: `ADMIN_PASSWORD_HASH` + `SESSION_SECRET` via `wrangler secret put`. Never put the plaintext password in HTML, JS, or git.
- Session cookie: HttpOnly, Secure, SameSite=Strict, 12h TTL.
- Failed logins are delayed and rate-limited by IP hash.
- `Disallow: /admin/` and `/portal` in robots.txt (already done).
- Blog/jobs admin still store drafts in browser localStorage until Phase C (CMS) — CRM leads use D1.

---

## Post-launch checklist

- [ ] Confirm `ADMIN_PASSWORD_HASH` + `SESSION_SECRET` are set on the Worker  
- [ ] Test `/admin/` login with the new password (hard-refresh first)  
- [ ] Submit sitemap in Google Search Console  
- [ ] Test WhatsApp link on mobile  
- [ ] Test dark/light toggle persistence  
- [ ] Submit sample contact + CV and confirm they appear in Admin CRM  
- [ ] Replace ad placeholders with real partners when ready  
