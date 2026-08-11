/**
 * Optional path-preserving redirect stubs: apex/www → immigration subdomain.
 *
 * Prefer a real Cloudflare/DNS 301 when possible. This stub builder is only
 * for GitHub Pages hosts that cannot emit HTTP 301s.
 *
 * Usage: node scripts/build-legacy-redirect.mjs
 */

import { readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'legacy-redirect');
const SITEMAP = join(ROOT, 'sitemap.xml');

const NEW_ORIGIN = 'https://immigration.salaroutsourcing.com';
const OLD_HOST = 'salaroutsourcing.com';
const OLD_ORIGIN = `https://${OLD_HOST}`;
const BRAND = 'SK Immigration Services';

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

function outputFileFor(path) {
  if (path === '/') return 'index.html';
  const clean = path.replace(/^\//, '');
  if (clean.endsWith('/')) return `${clean}index.html`;
  if (clean.endsWith('.html')) return clean;
  if (/\.[a-z0-9]+$/i.test(clean)) return null;
  return `${clean}.html`;
}

function targetFor(path) {
  return ALIASES[path] || path;
}

function stubHtml(fromPath, toPath) {
  const dest = new URL(toPath, NEW_ORIGIN).toString();
  const title = `${BRAND} moved to ${NEW_ORIGIN}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <meta http-equiv="refresh" content="0;url=${escapeHtml(dest)}" />
  <link rel="canonical" href="${escapeHtml(dest)}" />
  <meta name="robots" content="noindex" />
  <script>location.replace(${JSON.stringify(dest)}+location.search+location.hash);</script>
</head>
<body>
  <p>${escapeHtml(BRAND)} is now at <a href="${escapeHtml(dest)}">${escapeHtml(dest)}</a>.</p>
  <p>Requested path: <code>${escapeHtml(fromPath)}</code></p>
</body>
</html>
`;
}

async function main() {
  const paths = await readSitemapPaths();
  for (const alias of Object.keys(ALIASES)) paths.push(alias);
  const unique = [...new Set(paths)].sort();

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  for (const path of unique) {
    const file = outputFileFor(path);
    if (!file) continue;
    const abs = join(OUT_DIR, file);
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, stubHtml(path, targetFor(path)), 'utf8');
  }

  const sitemapLocs = unique
    .map((path) => {
      const loc = path === '/' ? `${OLD_ORIGIN}/` : `${OLD_ORIGIN}${path}`;
      return `  <url><loc>${loc}</loc></url>`;
    })
    .join('\n');

  await writeFile(
    join(OUT_DIR, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapLocs}\n</urlset>\n`,
    'utf8'
  );

  await writeFile(
    join(OUT_DIR, 'robots.txt'),
    `# Redirect stubs for ${OLD_ORIGIN} → ${NEW_ORIGIN}\nUser-agent: *\nAllow: /\nSitemap: ${OLD_ORIGIN}/sitemap.xml\n`,
    'utf8'
  );

  await writeFile(join(OUT_DIR, '404.html'), stubHtml('/404', '/'), 'utf8');
  await writeFile(join(OUT_DIR, 'CNAME'), `${OLD_HOST}\n`, 'utf8');

  console.log(`Wrote ${unique.length} redirect stubs to ${OUT_DIR}`);
  console.log(`Old host: ${OLD_ORIGIN} → ${NEW_ORIGIN}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
