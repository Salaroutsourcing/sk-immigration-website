# Phase 9 — AdSense (subdomain complete)

**Publisher:** `ca-pub-5113459275916426`  
**Content host:** https://immigration.salaroutsourcing.com/  
**AdSense Sites entry:** root domain `salaroutsourcing.com` / `www` (Google does not accept subdomains as separate Sites)

## Subdomain status — DONE

| Item | Live |
|------|------|
| `ads.txt` | https://immigration.salaroutsourcing.com/ads.txt |
| Ownership meta | `google-adsense-account` = ca-pub-5113459275916426 |
| Client script | `adsbygoogle.js?client=ca-pub-5113459275916426` sitewide |
| Auto ads flag | `SALAR_CONFIG.adsense.autoAds = true` |
| Consent Mode | ad_storage denied until visitor opts in |
| CSP | allows pagead / googlesyndication |

Google approves the **main domain**; the same pub ID on this subdomain is enough for ads to serve here. No separate subdomain site add is required.

## Your AdSense UI steps

1. Add / verify **`https://www.salaroutsourcing.com`** (or `https://salaroutsourcing.com`) in Sites.
2. Turn on **Auto ads** for that site when Ready.
3. Do not add `immigration.salaroutsourcing.com` as its own site.

## Code map

- `assets/js/config.js` — publisher + autoAds
- `assets/js/adsense-connect.js` — meta + client script + page-level Auto ads
- `/ads.txt` — `google.com, pub-5113459275916426, DIRECT, f08c47fec0942fa0`
- Homepage also has static meta + script in `<head>`
