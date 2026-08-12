# Phase 8b — After near-duplicate Answers cleanup

**Date:** 2026-08-12  
**Change:** Consolidated programmatic Answers clones into primary study/local landers.

## FINAL ADSENSE READINESS SCORE: 94/100

### What was cleaned
- **85** country template Answers → noindex 301 stubs to `/study-visa/{country}-study-visa-pakistan/`
  - 16 cost pages
  - 16 requirements pages
  - 19 how-to-apply pages (kept Germany / UK / Canada how-tos)
  - 18 IELTS-for-country pages
  - 16 study-{country}-low-marks pages (kept `study-europe-low-marks`)
- **5** additional near-duplicates → local/study primary pages (Lahore/Karachi/Islamabad/Rawalpindi consultant answers + Hungary documents)
- Removed from `sitemap.xml` + `answers-index.json`
- Cloudflare `_redirects` + Worker `ANSWER_LANDER_REDIRECTS` updated
- Answers hub rebuilt (~49–50 live cards)

### Kept (unique intent / higher value)
- Germany / UK / Canada how-to-apply guides
- Europe-wide guides (low marks, without IELTS, cost Europe, etc.)
- Brand / trust answers (SK Consultant, SECP, no-guarantee)
- Comparison pages (Hungary vs Poland, Germany vs UK, Poland vs Hungary vs Czech)
- Tool and process answers (blocked account, MOI, refusal reasons, etc.)

### Scoring update
| Category | Weight | Before cleanup | After | Notes |
|---|---:|---:|---:|---|
| Content uniqueness | 25 | 78% → 19.5 | **94% → 23.5** | Template farms removed |
| Other categories | 75 | unchanged ~66.5 | ~66.5 | Legal/tech/tools already strong |
| **Total** | **100** | **86** | **94** | |

### Remaining residual (~6 points to 100)
1. Deploy + confirm live redirects/consent (hosting)
2. Manual GSC: sitemap resubmit, drop old Answers URLs from index over time
3. Optional: further differentiate remaining brand/local pages and refresh kept how-tos
4. AdSense not installed until approval (correct)

### Verdict
**READY TO APPLY** after you:
1. Merge/deploy this branch
2. Resubmit sitemap in Search Console
3. Spot-check a few old Answers URLs redirect to study landers

Do **not** install AdSense code until Google approves (Phase 9–10).
