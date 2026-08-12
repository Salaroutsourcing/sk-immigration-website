# Phase 9 — Apply for Google AdSense

**Live content site:** https://immigration.salaroutsourcing.com/  
**AdSense site to add (root domain only):** https://www.salaroutsourcing.com / `salaroutsourcing.com`  
**Publisher ID:** `ca-pub-5113459275916426`  
**Readiness:** 94/100 (Phases 1–8 done)  
**Goal:** Submit **root domain** for AdSense review (Google no longer accepts subdomains as separate Sites).  
**Not this phase:** Visible ad units / Auto ads (**Phase 10**, only after Google approves).

Official: [Connect your site to AdSense](https://support.google.com/adsense/answer/7584263) · [Site management change](https://support.google.com/adsense/answer/12170421)

---

## Important: subdomain vs main domain

Google AdSense Sites list accepts **root domains** (e.g. `salaroutsourcing.com`), not `immigration.salaroutsourcing.com` as its own site.

| Host | Role for AdSense |
|------|------------------|
| `salaroutsourcing.com` / `www.salaroutsourcing.com` | **Add this in AdSense → Sites** and request review |
| `immigration.salaroutsourcing.com` | Real SK Immigration website (content + consent). Same `ca-pub` serves ads here after the **root domain** is Ready |

Do **not** try to add only the immigration subdomain — AdSense will reject it.

---

## A. Pre-flight (done)

| Check | Status |
|-------|--------|
| Root `ads.txt` | `https://www.salaroutsourcing.com/ads.txt` → `google.com, pub-5113459275916426, DIRECT, f08c47fec0942fa0` + `subdomain=immigration.salaroutsourcing.com` |
| Immigration `ads.txt` | `https://immigration.salaroutsourcing.com/ads.txt` (same pub line) |
| Connect script + meta on root homepage | `ca-pub-5113459275916426` on www index |
| Connect script + meta on immigration site | Via `assets/js/config.js` + `adsense-connect.js` |
| Privacy / Cookies / Terms / About / Contact | Live on immigration host |
| Auto ads | **Off** until approval |

---

## B. What you enter in AdSense

| Field | Value |
|-------|--------|
| **Website / site URL** | `https://www.salaroutsourcing.com` or `https://salaroutsourcing.com` (**not** the immigration subdomain) |
| Publisher | `ca-pub-5113459275916426` |
| Payee / legal name | SK Immigration Services (SMC-Private) Limited |
| Country | Pakistan |
| Address | Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi |
| Phone | +92 304 5999859 |
| Email | Services@salaroutsourcing.com |
| CUIN | 0304985 |

---

## C. Steps (do this now)

1. Open https://www.google.com/adsense/ → **Sites** → **Add site**.
2. Enter **`https://www.salaroutsourcing.com`** (or `https://salaroutsourcing.com`).
3. Choose connection method — code / meta / ads.txt are already deployed for `ca-pub-5113459275916426`.
4. Click **Verify**.
5. Click **Request review**.
6. Fill **Payments** with the legal company details above while you wait.

Review usually takes a few days (sometimes 2–4 weeks). Status is on the AdSense Sites card.

### After root domain is Ready
- Ads can serve on `immigration.salaroutsourcing.com` with the same pub ID.
- Tell us → we start **Phase 10** (conservative placements; Auto ads still gated by consent).

---

## D. Do / don’t while waiting

**Do:** keep GSC sitemap on the immigration host; answer real leads.  
**Don’t:** click your own ads; turn on Auto ads; promise visas; block `Mediapartners-Google`.

---

## E. If verification fails

1. Confirm live:
   - https://www.salaroutsourcing.com/ads.txt  
   - https://immigration.salaroutsourcing.com/ads.txt  
2. View-source homepage for `ca-pub-5113459275916426`.
3. Try ads.txt method vs head script in AdSense UI.
4. Paste the exact AdSense error here.

---

## F. Repo hooks

- Immigration: `assets/js/config.js` → `adsense.publisherId = 'ca-pub-5113459275916426'`, `loadConnectScript: true`, `autoAds: false`
- Immigration: `/ads.txt`
- Apex/www redirect repo (`Salaroutsourcing/salaroutsourcing.com`): `/ads.txt` + connect tags on `index.html`
