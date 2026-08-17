# Fix AdSense "ads.txt Status: Not found"

AdSense checks **`https://www.salaroutsourcing.com/ads.txt`** (root domain), not the immigration subdomain alone.

## Current status

| URL | Status | Notes |
|-----|--------|--------|
| https://immigration.salaroutsourcing.com/ads.txt | OK (200) | Correct publisher line in this repo |
| https://www.salaroutsourcing.com/ads.txt | **404** | Missing file in `Salaroutsourcing/salaroutsourcing.com` repo |

## Fix (5 minutes)

1. Open https://github.com/Salaroutsourcing/salaroutsourcing.com
2. Add or replace these files at the **repository root** (copy from `blog-posts/root-domain-adsense/` in this repo):

**`ads.txt`** (exactly):

```
google.com, pub-5113459275916426, DIRECT, f08c47fec0942fa0
subdomain=immigration.salaroutsourcing.com
```

3. Replace **`robots.txt`** and **`index.html`** with the versions in `blog-posts/root-domain-adsense/` (AdSense meta + `Mediapartners-Google` allow + delayed redirect).
4. Commit to **`main`** and wait 2–5 minutes for GitHub Pages.
5. Verify:

```bash
curl -s https://www.salaroutsourcing.com/ads.txt
```

Expected output (two lines):

```
google.com, pub-5113459275916426, DIRECT, f08c47fec0942fa0
subdomain=immigration.salaroutsourcing.com
```

6. In AdSense → **Sites** → open `salaroutsourcing.com` → use **Check for updates** on ads.txt (can take up to 24–48 hours to clear).

Publisher ID: `ca-pub-5113459275916426` (`pub-5113459275916426` in ads.txt).

## No other ads.txt errors in this repo

- `ads.txt` format is valid (IAB line + optional `subdomain=` delegate).
- `robots.txt` allows `Mediapartners-Google` on immigration host.
- Sitewide `google-adsense-account` meta and script use the same publisher ID.
