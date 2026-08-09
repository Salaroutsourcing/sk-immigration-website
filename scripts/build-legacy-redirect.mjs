/**
 * Build the legacy-domain redirect site for salaroutsourcing.com.
 *
 * GitHub Pages cannot emit HTTP 301s, so every old URL gets its own 200-status
 * stub carrying an instant meta refresh plus a canonical tag. Google documents
 * that combination as a permanent redirect; a homepage-only registrar forward
 * would instead collapse all 292 URLs into one and read as soft 404s.
 *
 * Output is deployed to the Salaroutsourcing/salaroutsourcing.com repo, whose
 * Pages custom domain is the old www host. Once a true 301 exists at the
 * DNS/CDN layer this whole directory can be deleted.
 *
 * Usage: node scripts/build-legacy-redirect.mjs
 */

import { readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'legacy-redirect');
const SITEMAP = join(ROOT, 'sitemap.xml');

const NEW_ORIGIN = 'https://skimmigrationservices.works';
const OLD_DOMAIN = 'salaroutsourcing.com';
// Every indexed old URL was canonicalised on www, so www is the host that has
// to be served. GitHub Pages then 301s the bare apex across to it by itself.
const OLD_HOST = `www.${OLD_DOMAIN}`;
const OLD_ORIGIN = `https://${OLD_HOST}`;
const BRAND = 'SK Immigration Services';

/**
 * Old entry points whose target path differs from the request path: the short
 * aliases that `_redirects` used to resolve, plus pages the old site had under
 * a different name. Everything else is a same-path move.
 */
const ALIASES = {
  '/blogs.html': '/blog.html',
  '/hire-workers': '/hire-workers-from-pakistan/',
  '/saudi': '/saudi-visa/saudi-visa-processing-pakistan/',
  '/work': '/work-permit/',
  '/work-visa': '/work-permit/',
  '/visit': '/visit-visa/',
  '/official': '/official-links/',
  '/embassy-links': '/official-links/',
  '/study-visa/usa': '/study-visa/usa-study-visa-pakistan/',
  '/study-visa/germany': '/study-visa/germany-study-visa-pakistan/',
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Read every <loc> from the live sitemap and reduce it to a path. */
async function readSitemapPaths() {
  const xml = await readFile(SITEMAP, 'utf8');
  const paths = new Set(['/']);
  for (const match of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const loc = match[1];
    if (!loc.startsWith(NEW_ORIGIN)) continue;
    paths.add(new URL(loc).pathname || '/');
  }
  return [...paths].sort();
}

/**
 * Map a URL path to the file GitHub Pages must serve for that exact request.
 * Directory paths need an index.html; extensionless paths rely on Pages'
 * implicit `.html` resolution.
 */
function outputFileFor(path) {
  if (path === '/') return 'index.html';
  const clean = path.replace(/^\//, '');
  if (clean.endsWith('/')) return `${clean}index.html`;
  if (clean.endsWith('.html')) return clean;
  if (/\.[a-z0-9]+$/i.test(clean)) return null; // non-HTML asset, handled separately
  return `${clean}.html`;
}

function redirectPage(path) {
  const target = `${NEW_ORIGIN}${path}`;
  const safeTarget = escapeHtml(target);
  const safeJsTarget = JSON.stringify(target);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>location.replace(${safeJsTarget} + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${safeTarget}">
<link rel="canonical" href="${safeTarget}">
<title>Moved to ${BRAND} — skimmigrationservices.works</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
       font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
       background:#0b1020;color:#e8ecf8;text-align:center;line-height:1.6}
  .card{max-width:34rem}
  h1{font-size:1.35rem;margin:0 0 .5rem}
  p{margin:0 0 1.25rem;color:#aab4d4}
  a.btn{display:inline-block;padding:.75rem 1.4rem;border-radius:999px;
        background:#d4af37;color:#1a1a1a;font-weight:600;text-decoration:none}
</style>
</head>
<body>
<div class="card">
  <h1>We have moved to a new website</h1>
  <p>${BRAND} is now at <strong>skimmigrationservices.works</strong> — same company, same Rawalpindi office. Taking you to this page on the new site&hellip;</p>
  <p><a class="btn" href="${safeTarget}">Continue to the new site</a></p>
</div>
</body>
</html>
`;
}

/** Catch-all for paths that were never in the sitemap. Status is 404, so this
 *  one optimises for the human: JS keeps the path, meta refresh is the no-JS net. */
function notFoundPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>location.replace(${JSON.stringify(NEW_ORIGIN)} + location.pathname + location.search + location.hash);</script>
<meta http-equiv="refresh" content="2; url=${NEW_ORIGIN}/">
<title>Moved to ${BRAND}</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
       font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
       background:#0b1020;color:#e8ecf8;text-align:center;line-height:1.6}
  .card{max-width:34rem}
  h1{font-size:1.35rem;margin:0 0 .5rem}
  p{margin:0 0 1.25rem;color:#aab4d4}
  a.btn{display:inline-block;padding:.75rem 1.4rem;border-radius:999px;
        background:#d4af37;color:#1a1a1a;font-weight:600;text-decoration:none}
</style>
</head>
<body>
<div class="card">
  <h1>We have moved to a new website</h1>
  <p>${BRAND} is now at <strong>skimmigrationservices.works</strong> — same company, same Rawalpindi office.</p>
  <p><a class="btn" href="${NEW_ORIGIN}/">Go to the new site</a></p>
</div>
</body>
</html>
`;
}

/** Plain-text notice for the AI/LLM discovery files, which bots read without JS. */
function movedNotice(filename) {
  return `# This domain has moved

${BRAND} has moved from ${OLD_DOMAIN} to skimmigrationservices.works.
Same company, same Rawalpindi office, same team.

Canonical website: ${NEW_ORIGIN}/
Current version of this file: ${NEW_ORIGIN}/${filename}

All ${OLD_DOMAIN} URLs redirect to the same path on ${NEW_ORIGIN}.
Please update any cached or cited links to the new domain.
`;
}

/** Keep the old URLs crawlable so search engines revisit them and see the move. */
function robotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${OLD_ORIGIN}/sitemap.xml
`;
}

/** Old-domain sitemap: prompts a recrawl of the retired URLs so the redirects
 *  are discovered quickly instead of at Google's natural pace. */
function legacySitemap(paths, lastmod) {
  const entries = paths
    .map(
      (path) =>
        `  <url>\n    <loc>${escapeHtml(OLD_ORIGIN + path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

async function write(relativePath, contents) {
  const full = join(OUT_DIR, relativePath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, contents, 'utf8');
}

async function main() {
  const paths = await readSitemapPaths();
  const lastmod = new Date().toISOString().slice(0, 10);

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const redirected = [];
  const textFiles = [];

  for (const path of paths) {
    const file = outputFileFor(path);
    if (file) {
      await write(file, redirectPage(path));
      redirected.push(path);
      continue;
    }
    const name = path.replace(/^\//, '');
    await write(name, movedNotice(name));
    textFiles.push(path);
  }

  const aliased = [];
  for (const [from, to] of Object.entries(ALIASES)) {
    const file = outputFileFor(from);
    if (!file) continue;
    await write(file, redirectPage(to));
    aliased.push(`${from} -> ${to}`);
  }

  await write('CNAME', `${OLD_HOST}\n`);
  await write('404.html', notFoundPage());
  await write('robots.txt', robotsTxt());
  await write('sitemap.xml', legacySitemap(redirected, lastmod));
  await write('.nojekyll', '');

  console.log(`legacy-redirect built in ${OUT_DIR}`);
  console.log(`  HTML redirect stubs : ${redirected.length}`);
  console.log(`  alias stubs         : ${aliased.length}`);
  console.log(`  plain-text notices  : ${textFiles.length} (${textFiles.join(', ') || 'none'})`);
  console.log(`  plus CNAME, 404.html, robots.txt, sitemap.xml, .nojekyll`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
