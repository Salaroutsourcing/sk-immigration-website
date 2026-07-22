# Deploy Salar Outsourcing (free + fast)

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
git commit -m "Initial Salar Outsourcing website"
# create repo on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USER/salar-outsourcing.git
git push -u origin main
```

### 2. Enable GitHub Pages

- Repo → **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: `main` / root (or `/docs` if you move files)
- Save — wait for `https://YOUR_USER.github.io/salar-outsourcing/`

If the site is in a subfolder of a larger repo, set Pages root to `/website`.

### 3. Cloudflare custom domain (salaroutsourcing.com)

1. Add site in [Cloudflare](https://dash.cloudflare.com) (free plan).
2. Point domain nameservers to Cloudflare.
3. **DNS** → CNAME:
   - `www` → `YOUR_USER.github.io` (Proxied)
   - Or A/AAAA records per GitHub Pages docs for apex `@`
4. GitHub Pages → Custom domain → `salaroutsourcing.com` / `www.salaroutsourcing.com`
5. Enable Cloudflare SSL (Full) + Always Use HTTPS
6. Optional: Page Rules / Cache Everything for static assets

### 4. Forms / leads via Apps Script

1. Open Google Drive → New Spreadsheet: `Salar Outsourcing Leads`
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
4. Custom domain → add `salaroutsourcing.com`

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

- Client-side password (`Salaar@98`) gates the admin UI — fine for a small team, but **not** bank-grade. Change password after launch.
- For stronger security: verify password in Apps Script (`ADMIN_PASSWORD`) before listing leads, and never commit secrets to public repos.
- Set `Disallow: /admin/` in robots.txt (already done).

---

## Post-launch checklist

- [ ] Update `appsScriptUrl` in config.js  
- [ ] Change admin password  
- [ ] Submit sitemap in Google Search Console  
- [ ] Test WhatsApp link on mobile  
- [ ] Test dark/light toggle persistence  
- [ ] Submit sample CV + job application and confirm Sheet rows  
- [ ] Replace ad placeholders with real partners when ready  
