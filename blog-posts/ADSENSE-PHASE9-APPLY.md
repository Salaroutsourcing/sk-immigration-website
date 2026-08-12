# Phase 9 — Apply for Google AdSense

**Site:** https://immigration.salaroutsourcing.com/  
**Readiness:** 94/100 (Phases 1–8 done, live on GitHub Pages)  
**Goal this phase:** Submit the site for AdSense review.  
**Not this phase:** Visible ad units / Auto ads (that is **Phase 10**, only after Google approves).

Official Google guide: [Connect your site to AdSense](https://support.google.com/adsense/answer/7584263).

---

## A. Pre-flight (already done on this site)

Confirm these before you click Apply. All should be **yes**:

| Check | Live URL / note |
|-------|-----------------|
| Custom HTTPS domain | https://immigration.salaroutsourcing.com/ |
| Privacy Policy (mentions AdSense) | /privacy · /privacy.html |
| Cookie Policy + consent banner | /cookies · Consent Mode defaults denied until opt-in |
| Terms (ads language, no click baiting) | /terms.html |
| About + real business identity | /about.html · CUIN **0304985** |
| Contact | /contact.html · Services@salaroutsourcing.com · +92 304 5999859 |
| Editorial / E-E-A-T | /editorial-policy.html · /trust.html |
| Sitemap in Search Console | https://immigration.salaroutsourcing.com/sitemap.xml |
| No AdSense ad units live yet | Correct — connection only after you share `ca-pub-…` |
| No guarantees / fake testimonials | Site policy: embassies decide |

**Do not** click your own ads, ask staff/clients to click ads, or place ads next to WhatsApp CTAs in a way that invites accidental clicks.

---

## B. What you enter in AdSense (copy/paste)

Use one Google account owned by the business (prefer the account already used for Search Console / Analytics `G-D0559366D6`).

| Field | Value |
|-------|--------|
| Website URL | `https://immigration.salaroutsourcing.com` |
| Site language | English (Urdu pages are secondary) |
| Payee / legal name | SK Immigration Services (SMC-Private) Limited |
| Country | Pakistan |
| Address | Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi |
| Phone | +92 304 5999859 |
| Contact email | Services@salaroutsourcing.com |
| CUIN (if asked / for your records) | 0304985 |

Account type: **Business / Organization** (not personal blog).

---

## C. Step-by-step application

### 1. Create or sign in
1. Open https://www.google.com/adsense/
2. Sign in with the business Google account.
3. Accept AdSense Program Policies and Terms.

### 2. Add the site
1. AdSense home → **Sites** → **Add site** (or **Add site** on the homepage card).
2. Paste exactly: `https://immigration.salaroutsourcing.com`
3. Save. Do **not** add random free subdomains or a different host.

### 3. Connect the site (pick one method)

Google needs to verify ownership. Preferred order for this project:

**Option A — Meta tag (recommended for Phase 9)**  
1. In AdSense, choose the **meta tag** connection method.  
2. Copy the tag (looks like):  
   `<meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">`  
3. Reply in this chat with your **`ca-pub-…` ID only** (or the full meta tag).  
4. We will set `adsense.publisherId` in `assets/js/config.js`, deploy, and confirm it is live on the homepage.  
5. Back in AdSense → check the box → **Verify** → **Request review**.

**Option B — Head script (also fine)**  
Same flow, but AdSense gives a `pagead2.googlesyndication.com/.../adsbygoogle.js?client=ca-pub-…` script.  
We can add that as **connect-only** (no Auto ads, no `<ins class="adsbygoogle">` units). Still send the `ca-pub-…` here first.

**Option C — ads.txt**  
AdSense may also show an ads.txt line:  
`google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`  
(Note: ads.txt uses `pub-…`, not `ca-pub-…`.)  
We will publish `/ads.txt` at the site root when you share the ID.

You can combine A + C. You do **not** need visible ads for review.

### 4. Request review
1. Confirm connection verified.
2. Click **Request review**.
3. Review usually takes a few days; sometimes **2–4 weeks**. Status is on the AdSense **Sites** card.

### 5. Consent / CMP (optional after request)
AdSense may ask for a consent management platform for European regulations.

- You already have a **first-party consent banner** + Consent Mode v2 defaults (`ad_storage` denied until opt-in) on this site.
- If AdSense offers **Google’s CMP**, you may enable it for EU traffic **or** keep the existing banner and choose a certified third-party later.
- Do not turn on personalised ads until consent plumbing is clear. Phase 10 will align Auto ads with consent.

### 6. Payments (can do while waiting)
In AdSense → **Payments**:
1. Enter the legal payee name and Rawalpindi address exactly as on company documents.
2. Complete identity / tax forms when Google asks.
3. Add a payout method when the account is approved and pin / threshold requirements are shown (Pakistan methods vary by AdSense UI).

---

## D. While you wait (do / don’t)

**Do**
- Keep publishing useful study-visa updates on the calendar in `blog-posts/PUBLISHING-CALENDAR.md`.
- Watch Search Console for sitemap coverage; request indexing for `/`, `/trust.html`, top study landers if needed.
- Answer real leads on WhatsApp — AdSense is secondary to consultancy revenue.

**Don’t**
- Install Auto ads or ad units yet (Phase 10).
- Click your own ads or ask anyone to.
- Promise visas or invent fees/testimonials to “look richer” for review.
- Cloak or block Googlebot / Mediapartners-Google in `robots.txt`.

---

## E. If Google says “not ready” or rejects

1. Read the exact reason in AdSense → Sites.  
2. Common fixes already prepared here: legal pages, unique landers, consent, HTTPS.  
3. Improve the cited pages, wait the cool-down AdSense shows (often ~1–2+ weeks), then request review again.  
4. Paste the rejection text here and we will patch the site for a re-apply.

---

## F. Handoff to Phase 10 (only after “Ready”)

When AdSense status is **Ready** / approved:

1. Tell us — we enable conservative placements (Phase 10).  
2. Prefer few in-article / sidebar units on long guides — never on top of WhatsApp CTAs.  
3. Keep consent: advertising cookies stay off until the visitor opts in.  
4. Publish final `ads.txt` if not already live.

---

## G. Site hook (already in repo)

`assets/js/config.js` includes:

```js
adsense: {
  publisherId: '',          // set to ca-pub-XXXXXXXX when you have it
  connectMeta: true,        // Phase 9: ownership meta only
  loadConnectScript: false, // optional head script
  autoAds: false,           // Phase 10 only
}
```

`assets/js/adsense-connect.js` injects the meta tag (and optional connect script) **only** when `publisherId` is set. Until then, nothing AdSense-related is loaded.

---

## Checklist for you today

- [ ] Sign in to AdSense and add `https://immigration.salaroutsourcing.com`
- [ ] Copy `ca-pub-…` (or meta / ads.txt line) and send it in chat
- [ ] After we deploy connection → **Verify** → **Request review**
- [ ] Fill Payments address with the legal company details above
- [ ] Wait for email / Sites status — then start Phase 10
