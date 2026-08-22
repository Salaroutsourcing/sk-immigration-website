# AdSense “Low value content” — content audit & replacement list

Track B plan for **immigration.salaroutsourcing.com**. English only. You handle **blogs** in Studio; this doc lists everything else.

## Phase status

| Phase | What | Status |
|-------|------|--------|
| **0** | Disable `autoAds` until reapply | Done — `public/assets/js/config.js` |
| **1** | noindex + sitemap cleanup (Urdu, guides, Saudi stub) | Done — `node scripts/adsense-phase1-cleanup.mjs` |
| **2** | Unique visit-visa pages | Done — `node scripts/adsense-phase2-visit-visa.mjs` + `adsense-phase2-visit-extra.mjs` |
| **3** | Appointments, tier-2 study, local cities | Done — see scripts below |
| **4** | Blogs | **You** — Studio `/studio/` → Publish → deploy |
| **5** | E-E-A-T (client journey, Google reviews link) | Done — `client-journey.html` |
| **6** | Re-enable ads + AdSense “Request review” | After you finish blogs + deploy |

### Phase 3 scripts (re-run after edits)

```bash
node scripts/adsense-phase3-appointments.mjs
node scripts/phase3-deepen-study-landers.mjs
node scripts/adsense-phase3-local.mjs
```

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

**Target:** 800–1,200+ words unique editorial per file, or stop linking once Studio MDX posts replace them.

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
| `guides/study-abroad-without-ielts-pakistan/` | Expand or merge into `answers/` |
| `guides/study-abroad-low-marks-pakistan/` | Same |
| `guides/ausbildung-pakistan/` | Same |
| `guides/saudi-e-number-pakistan/` | Same |

Removed from `public/sitemap.xml`. Do not reindex until deep.

---

## D. Urdu section — **removed** (English only)

All `public/ur/**` → **noindex**, **redirect** `/ur` → `/`, **Disallow** in `robots.txt`.

---

## E. Visit visa — duplicate cluster (Phase 2 expanded)

Each country page now has unique VFS channel, fees table, refusal risks and cover-letter outline. Re-run Phase 2 scripts if you edit templates.

**Strongest pages:** UK, USA, Schengen hub, Germany, France, Dubai (750–900+ words).

**Still polish optional:** Hungary, Malaysia, Malta, Poland, Portugal (700–750w) — add manual country news if AdSense asks again.

---

## F. Study visa — tier 2 (Phase 3 deepened)

Expanded with country-specific blocks: Austria, Belgium, Cyprus, Czech, Greece, Ireland, Malaysia, Malta, Romania, Slovakia, Switzerland, Turkey, Netherlands (+ prior Germany/UK/Canada batch).

**Strong (keep):** Germany, UK, Canada, Hungary, Italy, France, Poland, Portugal, Spain, Romania, USA.

**Missing lander:** `australia-study-visa-pakistan` — no page in repo yet.

---

## G. Visa appointment pages (Phase 3)

Deepened: UK, Germany, USA, Canada, Italy, Australia, Schengen hub. **Reference depth:** France appointment page (~1,200w).

---

## H. Local city pages (Phase 3)

Islamabad, Lahore, Karachi, Rawalpindi — added process, destinations and logistics blocks.

---

## I. Duplicate / thin content map

| Type | Duplication risk | Action |
|------|------------------|--------|
| **20 legacy `public/blog/*`** | Near-duplicate of `study-visa/*` | **You replace** or rely on canonical + noindex |
| **Schengen visit secondaries** | Was ~85% same template | Phase 2 unique blocks per country |
| **Tier-2 study landers** | Formulaic 600w | Phase 3 lander-depth blocks |
| **Appointment pages** | Generic 420w | Phase 3 appointment-depth (except France) |
| **Guides `public/guides/*`** | Thin vs answers | noindex — do not reindex until merged |
| **Urdu `public/ur/*`** | Duplicate of English | Removed from index |
| **Legacy D1 `blog.html`** | Separate from Astro `/blog/` | Use Studio for new English posts |

---

## Before AdSense reapply checklist

- [ ] You publish 3–5 high-quality Studio blogs (Phase 4)
- [ ] Visit-visa cluster deployed (Phase 2)
- [ ] `autoAds: true` only after approval (`config.js`)
- [ ] `www.salaroutsourcing.com/ads.txt` live on root domain
- [ ] No fake `aggregateRating` in schema
- [ ] Do **not** click “Request review” until above are done
