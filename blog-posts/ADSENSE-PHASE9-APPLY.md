# Phase 9 — AdSense worldwide earnings

**Publisher:** `ca-pub-5113459275916426`  
**Ads host:** https://immigration.salaroutsourcing.com/  
**AdSense Sites entry:** root domain `salaroutsourcing.com` / www (Google rule)

## Goal
Earn from AdSense for visitors **in any country**, while staying compliant where Google requires a certified CMP (EEA / UK / Switzerland).

## Subdomain — live setup

| Piece | Status |
|-------|--------|
| Client script + meta | Sitewide `ca-pub-5113459275916426` |
| Auto ads | `autoAds: true` |
| ads.txt | `/ads.txt` |
| Consent Mode | **Regional**: deny EEA/UK/CH; **grant rest of world** (Pakistan, Gulf, US, etc.) |
| Cookie banner | Only for regulated-region hint; footer Cookie settings always available |

## What you must do in AdSense (UI)

1. Add/verify **`https://www.salaroutsourcing.com`** (or apex) — not the immigration subdomain alone.
2. When Ready: enable **Auto ads**.
3. Open **Privacy & messaging** → create **European regulations** message (Google’s certified CMP / TCF).  
   This unlocks **personalised ads** in EEA/UK/CH per [Google’s CMP requirements](https://support.google.com/adsense/answer/13554116).  
   Without it, Europe may only get limited / non-personalised ads.

## How worldwide revenue works

| Visitor region | Ads |
|----------------|-----|
| Pakistan, Middle East, Americas, Asia (non-EU), etc. | Consent granted by default → Auto ads can earn |
| EEA / UK / Switzerland | Need opt-in + Google Privacy & messaging CMP for personalised ads |

## Do not
- Click your own ads or ask staff/clients to click ads.
- Promise visas in ad-adjacent content.
