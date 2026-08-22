# Blog & Studio — why posts don’t show / aren’t editable

## Two different “blog” systems

| System | Where you edit | Where it goes live | In Studio? |
|--------|----------------|-------------------|------------|
| **Studio (new)** | `/studio/` → Blog | `/blog/{slug}/` (Astro MDX) | Yes |
| **Legacy static HTML** | Edit files in `public/blog/*/index.html` in Git | `/blog/germany-student-visa/` etc. | **No** |
| **Legacy D1 admin** | `/admin/blog.html` | `/blog-post.html?slug=…` or old URLs in DB | No (old CRM) |

Studio only manages entries in **D1 `studio_entries`** and, on **Publish**, writes **`src/content/blog/*.mdx`** to GitHub.

The **20 country guides** under `public/blog/germany-student-visa/` etc. are **static HTML**. They will **not** appear in Studio’s blog list unless you import them as new Studio entries.

---

## Why your new Studio post isn’t on the website

1. **Save draft** → stored in D1 only. **Not public.**
2. **Publish** in Studio → commits MDX to `src/content/blog/{slug}.mdx` on GitHub (needs GitHub OAuth token or `GITHUB_TOKEN` on Worker).
3. **Site build + deploy** → `npm run build` && `wrangler deploy` (or CI on `main`). Astro renders MDX into `/blog/{slug}/`.
4. Until deploy finishes, the post **does not exist** on the live site.

Check: `https://immigration.salaroutsourcing.com/blog/your-slug/`

---

## Why you can’t edit “all blogs” in Studio

Studio lists **Studio entries** (D1). Legacy static posts are **files in `public/blog/`** — edit those in the repo or replace them with new Studio MDX posts.

**Your workflow (recommended):**

1. Write new high-quality posts in **Studio** → Publish.
2. For the 20 legacy country pages, either:
   - Replace HTML in `public/blog/{country}-student-visa/index.html`, **or**
   - Publish a new Studio article and remove/redirect the old static URL.

See `docs/ADSENSE-CONTENT-AUDIT.md` table **Section A** for the full file list.

---

## Studio publish requirements

- Log in at `/studio/` with GitHub (username on `STUDIO_GITHUB_ALLOWLIST`)
- Worker secrets: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`
- After Publish, confirm GitHub commit on `src/content/blog/`
- Trigger deploy (push to `main` or manual `npm run deploy`)

Settings in Studio dashboard shows `publishReady` / `githubConfigured`.

---

## Public blog index

- **New platform:** `https://immigration.salaroutsourcing.com/blog/` (Astro — Studio MDX)
- **Legacy listing:** `https://immigration.salaroutsourcing.com/blog.html` (JS + D1/JSON fallback)

Footer links to **New guides** → `/blog/` (MDX). Use that for AdSense-quality articles going forward.
