/**
 * Phase 1 — AdSense low-value index cleanup
 * - noindex thin guides + entire Urdu tree
 * - noindex saudi-visa hub redirect stub
 * - remove those URLs from public/sitemap.xml
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');
const SITEMAP = join(PUBLIC, 'sitemap.xml');
const NOINDEX_META = '<meta name="robots" content="noindex, follow" />';

function walkHtml(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walkHtml(p, acc);
    } else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function ensureNoindex(file) {
  let html = readFileSync(file, 'utf8');
  if (/noindex/i.test(html)) return false;
  if (html.includes('<meta name="robots"')) {
    html = html.replace(
      /<meta\s+name="robots"[^>]*>/i,
      NOINDEX_META
    );
  } else if (html.includes('<head>')) {
    html = html.replace('<head>', `<head>\n  ${NOINDEX_META}`);
  } else if (html.includes('<head ')) {
    html = html.replace(/<head([^>]*)>/, `<head$1>\n  ${NOINDEX_META}`);
  } else {
    return false;
  }
  writeFileSync(file, html);
  return true;
}

const patterns = [
  join(PUBLIC, 'guides'),
  join(PUBLIC, 'ur'),
  join(PUBLIC, 'saudi-visa', 'index.html'),
];

let noindexCount = 0;
for (const target of patterns) {
  if (target.endsWith('.html')) {
    if (ensureNoindex(target)) noindexCount += 1;
    continue;
  }
  if (!statSync(target).isDirectory()) continue;
  for (const file of walkHtml(target)) {
    if (ensureNoindex(file)) noindexCount += 1;
  }
}

let sitemap = readFileSync(SITEMAP, 'utf8');
const before = (sitemap.match(/<url>/g) || []).length;
const removeRe =
  /<url>[^<]*<loc>https:\/\/immigration\.salaroutsourcing\.com\/(?:ur\/|guides\/|saudi-visa\/)[^<]*<\/loc>[\s\S]*?<\/url>\s*/g;
sitemap = sitemap.replace(removeRe, '');
// saudi-visa/ hub only (not processing page)
sitemap = sitemap.replace(
  /<url><loc>https:\/\/immigration\.salaroutsourcing\.com\/saudi-visa\/<\/loc>[\s\S]*?<\/url>\s*/g,
  ''
);
writeFileSync(SITEMAP, sitemap);
const after = (sitemap.match(/<url>/g) || []).length;

console.log(`noindex applied: ${noindexCount} files`);
console.log(`sitemap urls: ${before} → ${after} (removed ${before - after})`);
