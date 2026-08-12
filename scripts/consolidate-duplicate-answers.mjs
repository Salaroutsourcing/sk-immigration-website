#!/usr/bin/env node
/**
 * Consolidate near-duplicate Answers pages into primary study-visa landers.
 *
 * Strategy (SEO-safe):
 * - Replace thin/near-duplicate cost + requirements + how-to-apply pages with
 *   noindex redirect stubs pointing at /study-visa/{country}-study-visa-pakistan/
 * - Remove those URLs from sitemap.xml
 * - Remove matching entries from answers-index.json
 * - Keep substantial unique how-to pages (Germany, UK, Canada) unless flagged
 *
 * Safe to re-run.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ANSWERS = path.join(ROOT, 'answers');
const ORIGIN = 'https://immigration.salaroutsourcing.com';

/** Keep these how-to pages (more unique / higher depth). */
const KEEP_HOWTO = new Set([
  'how-to-apply-germany-student-visa-pakistan',
  'how-to-apply-uk-student-visa-pakistan',
  'how-to-apply-canada-study-permit-pakistan',
]);

const COUNTRY_LABEL = {
  austria: 'Austria',
  belgium: 'Belgium',
  cyprus: 'Cyprus',
  'czech-republic': 'Czech Republic',
  france: 'France',
  germany: 'Germany',
  greece: 'Greece',
  hungary: 'Hungary',
  ireland: 'Ireland',
  italy: 'Italy',
  malaysia: 'Malaysia',
  malta: 'Malta',
  netherlands: 'Netherlands',
  poland: 'Poland',
  portugal: 'Portugal',
  romania: 'Romania',
  slovakia: 'Slovakia',
  spain: 'Spain',
  switzerland: 'Switzerland',
  turkey: 'Turkey',
  uk: 'UK',
  canada: 'Canada',
};

function stubHtml(dest, label) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<script>location.replace(${JSON.stringify(dest)} + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${dest}">
<link rel="canonical" href="${dest}">
<title>Moved — ${label} Study Visa | SK Immigration Services</title>
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
  <h1>This page has moved</h1>
  <p>Country cost/requirements answers are consolidated into the primary <strong>${label}</strong> study visa guide to avoid duplicate thin content.</p>
  <p><a class="btn" href="${dest}">Continue to ${label} study visa guide</a></p>
</div>
</body>
</html>
`;
}

function countryFromCost(stem) {
  return stem.replace(/-study-visa-cost-pakistan$/, '');
}
function countryFromReq(stem) {
  return stem.replace(/-study-visa-requirements-pakistan$/, '');
}
function countryFromHowto(stem) {
  let m = stem.match(/^how-to-apply-(.+)-student-visa-pakistan$/);
  if (m) return m[1];
  m = stem.match(/^how-to-apply-(.+)-study-permit-pakistan$/);
  if (m) return m[1];
  return null;
}

function landerUrl(country) {
  return `${ORIGIN}/study-visa/${country}-study-visa-pakistan/`;
}

const redirected = [];
const skipped = [];

for (const file of fs.readdirSync(ANSWERS)) {
  if (!file.endsWith('.html')) continue;
  const stem = file.replace(/\.html$/, '');
  let country = null;
  let kind = null;

  if (stem.endsWith('-study-visa-cost-pakistan')) {
    country = countryFromCost(stem);
    kind = 'cost';
  } else if (stem.endsWith('-study-visa-requirements-pakistan')) {
    country = countryFromReq(stem);
    kind = 'requirements';
  } else if (stem.startsWith('how-to-apply-')) {
    if (KEEP_HOWTO.has(stem)) {
      skipped.push(file + ' (kept)');
      continue;
    }
    country = countryFromHowto(stem);
    kind = 'howto';
  } else if (stem.startsWith('ielts-for-') && stem.endsWith('-study')) {
    country = stem.replace(/^ielts-for-/, '').replace(/-study$/, '');
    kind = 'ielts';
  } else if (stem.startsWith('study-') && stem.endsWith('-low-marks')) {
    country = stem.replace(/^study-/, '').replace(/-low-marks$/, '');
    kind = 'lowmarks';
  } else {
    continue;
  }

  if (!country) {
    skipped.push(file + ' (no country)');
    continue;
  }

  const landerDir = path.join(ROOT, 'study-visa', `${country}-study-visa-pakistan`);
  if (!fs.existsSync(path.join(landerDir, 'index.html'))) {
    skipped.push(file + ' (missing lander)');
    continue;
  }

  const label = COUNTRY_LABEL[country] || country.replace(/-/g, ' ');
  const dest = landerUrl(country);
  fs.writeFileSync(path.join(ANSWERS, file), stubHtml(dest, label));
  redirected.push({ file, kind, dest });
}

// Remove from sitemap
const sitemapPath = path.join(ROOT, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
let removedSitemap = 0;
for (const { file } of redirected) {
  const stem = file.replace(/\.html$/, '');
  const re = new RegExp(
    `\\s*<url><loc>${ORIGIN}/answers/${stem}(?:\\.html)?</loc>[\\s\\S]*?</url>`,
    'g'
  );
  const next = sitemap.replace(re, '');
  if (next !== sitemap) {
    removedSitemap += 1;
    sitemap = next;
  }
}
fs.writeFileSync(sitemapPath, sitemap);

// Remove from answers-index.json
const indexPath = path.join(ROOT, 'assets/data/answers-index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const removeSlugs = new Set(redirected.map((r) => r.file.replace(/\.html$/, '')));
const filtered = index.filter((item) => !removeSlugs.has(item.slug));
const removedIndex = index.length - filtered.length;
fs.writeFileSync(indexPath, JSON.stringify(filtered, null, 2) + '\n');

// Append Cloudflare-style redirects for Worker/_redirects hosts
const redirectsPath = path.join(ROOT, '_redirects');
let redirects = fs.readFileSync(redirectsPath, 'utf8');
const blockStart = '# Phase duplicate-answers consolidation';
const newLines = redirected.map(({ file, dest }) => {
  const stem = file.replace(/\.html$/, '');
  const pathOnly = dest.replace(ORIGIN, '');
  return [`/answers/${stem} ${pathOnly} 301`, `/answers/${stem}.html ${pathOnly} 301`];
}).flat();

if (!redirects.includes(blockStart)) {
  redirects = redirects.trimEnd() + `\n\n${blockStart} → primary study landers\n` + newLines.join('\n') + '\n';
} else {
  // Append only missing redirect lines
  for (const line of newLines) {
    if (!redirects.includes(line)) redirects += `${line}\n`;
  }
}
fs.writeFileSync(redirectsPath, redirects);

console.log(`Redirected ${redirected.length} answers → study landers`);
console.log(`Sitemap URLs removed: ${removedSitemap}`);
console.log(`answers-index entries removed: ${removedIndex}`);
console.log(`Skipped: ${skipped.length}`);
skipped.forEach((s) => console.log('  skip', s));
console.log('By kind:', Object.fromEntries(
  ['cost', 'requirements', 'howto', 'ielts', 'lowmarks'].map((k) => [k, redirected.filter((r) => r.kind === k).length])
));
