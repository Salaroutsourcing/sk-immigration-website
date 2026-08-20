# Phase 1 — SK Immigration Studio (`/studio/`)

Premium publishing console for the daily **5 news + 5 Web Stories + 1 blog** machine. Public pages stay static. Studio is a client app served from Astro, authenticated by the Worker.

**Stop here.** Do not start Phase 2 until this is confirmed.

## What shipped

- GitHub OAuth (allowlisted usernames) + optional password fallback (`ADMIN_PASSWORD_HASH`)
- All `/studio/*` routes gated in the UI; APIs return 401 without a session
- `noindex` meta + `X-Robots-Tag` + existing `robots.txt` Disallow
- Dashboard, CRUD for news / blog / web-stories, duplicate-as-template, media library, keywords, settings
- D1 is the editor source of truth. **Publish** writes MDX to GitHub (`src/content/...`) when a token is present

## File structure

```
src/pages/studio/index.astro
src/pages/studio/[...slug].astro
src/layouts/StudioLayout.astro          # no GTM / AdSense
src/styles/studio.css
src/studio/
  App.tsx
  api.ts
  types.ts
  constants.ts
  templates.ts
  components/{Icons,Login,Shell,Toast,CommandPalette}.tsx
  pages/{Dashboard,ContentList,EntryEditor,Media,Keywords,Settings}.tsx
worker/studio.js                        # OAuth, session, CRUD, media, publish
migrations/002_studio.sql
docs/PHASE-1-STUDIO.md
```

## How to log in

### 1. Secrets (required)

```bash
npx wrangler secret put SESSION_SECRET
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put STUDIO_GITHUB_ALLOWLIST
# comma-separated GitHub usernames, e.g. your-user
```

Optional:

```bash
npx wrangler secret put ADMIN_PASSWORD_HASH   # sha256 hex of the password (existing admin hash works)
npx wrangler secret put GITHUB_TOKEN          # PAT if you prefer not to use the OAuth token for writes
```

Vars you can set in Wrangler instead of secrets:

- `GITHUB_REPO` (default `Salaroutsourcing/sk-immigration-website`)
- `STUDIO_PUBLISH_BRANCH` or `GITHUB_BRANCH` (default `main`)

Local: copy `.dev.vars.example` → `.dev.vars`.

### 2. GitHub OAuth App

1. GitHub → Settings → Developer settings → OAuth Apps → New
2. Homepage: `https://immigration.salaroutsourcing.com/studio/`
3. Callback: `https://immigration.salaroutsourcing.com/api/auth/github/callback`
4. For `wrangler dev`, add a second callback: `http://localhost:8787/api/auth/github/callback`
5. Scopes requested by Studio: `read:user` and `public_repo` (needed to commit MDX on a public repo)

### 3. D1 tables

Tables are also created on first Studio API call. To apply the migration explicitly:

```bash
npm run db:migrate:studio
# or local:
npm run db:migrate:studio:local
```

### 4. Open Studio

1. Deploy (`npm run deploy`) or run `npm run cf:dev`
2. Visit `/studio/`
3. **Continue with GitHub** (account must be on `STUDIO_GITHUB_ALLOWLIST`)
4. Or use the password fallback if `ADMIN_PASSWORD_HASH` is set

`/admin` still 301s to `/studio/`.

## Create the first content

1. Dashboard → **New News** / **New Blog** / **New Web Story** (or press `C` then `N` / `B` / `S`)
2. **Template** fills a daily-volume starter. **Duplicate** on any existing row clones it as a `-copy` draft
3. Use controlled tags/keywords from the existing taxonomy
4. Blogs need **3 FAQs**. Stories need a **related blog slug**, a poster, and **4–12 slides**
5. **Save draft** writes to D1 immediately (`⌘S`)
6. **Publish** writes `src/content/{news|blog|web-stories}/{slug}.mdx` to GitHub (and media to `public/uploads/`)
7. The public page appears on the **next site build/deploy** (Astro stays static — D1 is not the public renderer)

Sample pieces already in git (and bootstrapped into D1 if the table is empty):

- `/news/germany-blocked-account-2026-what-changed/`
- `/blog/study-europe-without-ielts-from-pakistan/`
- `/stories/europe-without-ielts-story/`

## Shortcuts

| Keys | Action |
| --- | --- |
| `G` then `D N B S M K` or `,` | Jump sections |
| `C` then `N B S` | New news / blog / story |
| `⌘K` or `/` | Command palette |
| `⌘S` | Save |
| `⌘D` | Duplicate (editor) |

Theme follows system preference, defaulting to dark. Toggle is in the top bar.

## What Phase 1 does not do (wait for confirmation)

Public MDX rendering, AMP Web Stories, AI citation expansion, AdSense/Clarity inject, and the daily SOP are later phases.
