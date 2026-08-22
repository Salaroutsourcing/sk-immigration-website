# AdSense “Low value content” — content audit & replacement list

Track B plan for **immigration.salaroutsourcing.com**. You handle **blogs** in Studio; this doc lists everything else that needs expansion or is duplicated.

## Phase status

| Phase | What | Status |
|-------|------|--------|
| **0** | Disable `autoAds` until reapply | Done in `public/assets/js/config.js` |
| **1** | noindex + sitemap cleanup (Urdu, guides, Saudi stub) | Done — run `node scripts/adsense-phase1-cleanup.mjs` if needed again |
| **2** | Unique visit-visa pages (biggest duplicate cluster) | **Your team + next commits** |
| **3** | Homepage depth, appointments, tier-2 study | Homepage block added; rest ongoing |
| **4** | Blogs | **You** — Studio `/studio/` → Publish → deploy |
| **5** | E-E-A-T (process stories, Google reviews link) | Planned |
| **6** | Re-enable ads + AdSense “Request review” | After Phases 2–4 |

---

## A. Legacy static blogs — **you replace these** (not in Studio)

These live under `public/blog/*/index.html`. They are **noindex** and **canonical** to `study-visa/*` pages. Studio does **not** edit these files.

| Folder | Replace by editing this file | Canonical target (main guide) |
|--------|---------------------------|-------------------------------|
| `public/blog/germany-student-visa/` | `index.html` | `study-visa/germany-study-visa-pakistan/` |
| `public/blog/uk-student-visa/` | `index.html` | `study-visa/uk-study-visa-pakistan/` |
| `public/blog/canada-student-visa/` | `index.html` | `study-visa/canada-study-visa-pakistan/` |
| `public/blog/australia-student-visa/` | `index.html` | `study-visa/australia-study-visa-pakistan/` |
| `public/blog/hungary-student-visa/` | `index.html` | `study-visa/hungary-study-visa-pakistan/` |
| `public/blog/france-student-visa/` | `index.html` | `study-visa/france-study-visa-pakistan/` |
| `public/blog/italy-student-visa/` | `index.html` | `study-visa/italy-study-visa-pakistan/` |
| `public/blog/spain-student-visa/` | `index.html` | `study-visa/spain-study-visa-pakistan/` |
| `public/blog/poland-student-visa/` | `index.html` | `study-visa/poland-study-visa-pakistan/` |
| `public/blog/netherlands-student-visa/` | `index.html` | `study-visa/netherlands-study-visa-pakistan/` |
| `public/blog/portugal-student-visa/` | `index.html` | `study-visa/portugal-study-visa-pakistan/` |
| `public/blog/romania-student-visa/` | `index.html` | `study-visa/romania-study-visa-pakistan/` |
| `public/blog/czech-republic-student-visa/` | `index.html` | `study-visa/czech-republic-study-visa-pakistan/` |
| `public/blog/malta-student-visa/` | `index.html` | `study-visa/malta-study-visa-pakistan/` |
| `public/blog/slovakia-student-visa/` | `index.html` | `study-visa/slovakia-study-visa-pakistan/` |
| `public/blog/turkey-student-visa/` | `index.html` | `study-visa/turkey-study-visa-pakistan/` |
| `public/blog/ireland-student-visa/` | `index.html` | `study-visa/ireland-study-visa-pakistan/` |
| `public/blog/malaysia-student-visa/` | `index.html` | `study-visa/malaysia-study-visa-pakistan/` |
| `public/blog/cyprus-student-visa/` | `index.html` | `study-visa/cyprus-study-visa-pakistan/` |
| `public/blog/dubai-visit-visa/` | `index.html` | `visit-visa/dubai-visit-visa-pakistan/` |

**Target:** 800–1,200+ words unique editorial content per file, or delete/stop linking once Studio MDX posts replace them.

---

## B. Studio MDX blogs — **you publish here**

| Item | Detail |
|------|--------|
| Editor | `https://immigration.salaroutsourcing.com/studio/` → **Blog** |
| Live URL after publish + deploy | `https://immigration.salaroutsourcing.com/blog/{slug}/` |
| Source file on publish | `src/content/blog/{slug}.mdx` |
| Sample live post | `/blog/study-europe-without-ielts-from-pakistan/` |

See `docs/BLOG-STUDIO-WORKFLOW.md` for why drafts don’t appear instantly.

---

## C. Guides — **noindex until expanded** (Phase 1)

| Path | Action |
|------|--------|
| `guides/study-abroad-without-ielts-pakistan/` | Expand to 1,000w+ or merge into `answers/` |
| `guides/study-abroad-low-marks-pakistan/` | Same |
| `guides/ausbildung-pakistan/` | Same |
| `guides/saudi-e-number-pakistan/` | Same |

Removed from `public/sitemap.xml`. Do not reindex until deep.

---

## D. Urdu section — **removed** (English only)

All `public/ur/**` → **noindex**, **redirect** `/ur` → `/`, **Disallow** in `robots.txt`. Do not restore without full English-quality translations.

---

## E. Visit visa — **highest duplicate risk** (~85–90% similar text)

Expand each to **800w+** with **unique**: embassy/VFS centre, fee table, Pakistan-specific refusal tips, official links.

**Priority batch (traffic):** `uk`, `usa`, `dubai`, `germany`, `schengen-visit-visa-pakistan`

**Schengen secondaries (very similar templates):**  
`belgium`, `austria`, `slovakia`, `greece`, `czech-republic`, `cyprus`, `malta`, `romania`, `hungary`, `netherlands`, `portugal`, `poland`, `spain`, `france`, `italy`, `switzerland`, `ireland`

**Others:** `canada`, `turkey`, `malaysia`, `australia`

---

## F. Study visa — tier 2 (formulaic, 600–700w)

Expand with country-specific fees, MOI rules, embassy quirks:

`austria`, `belgium`, `cyprus`, `czech-republic`, `greece`, `ireland`, `malaysia`, `malta`, `romania`, `slovakia`, `switzerland`, `turkey`, `usa`, `australia` (under `study-visa/*-study-visa-pakistan/`)

**Strong (keep, minor polish):** Germany, UK, Canada, Hungary, Italy, France, Poland, Portugal, Netherlands

---

## G. Visa appointment pages (~478w, similar)

Deepen to match France depth (~1,200w):  
`uk`, `germany`, `usa`, `canada`, `italy`, `australia`, `schengen-visa-appointment-pakistan`

---

## H. Local city pages (thin consultant landers)

`local/islamabad-study-visa-consultant/`, `local/lahore-study-visa-consultant/`, `local/karachi-study-visa-consultant/` — add city-specific office logistics, popular destinations, FAQ.

**Stronger:** `local/rawalpindi-study-visa-consultant/`

---

## I. Old `blog.html` + D1 admin (legacy)

`public/blog.html` + `admin/blog.html` use Cloudflare D1 (`/api/blog`). That is **separate** from Studio MDX. Prefer **Studio** for new English articles.

---

## Before AdSense reapply checklist

- [ ] No indexed page under ~500w (except intentional redirects)
- [ ] Visit-visa cluster unique or consolidated
- [ ] `autoAds: true` only after approval (`config.js`)
- [ ] `www.salaroutsourcing.com/ads.txt` live
- [ ] No fake `aggregateRating` in schema (removed from homepage)
- [ ] Do **not** click “Request review” until above are done
