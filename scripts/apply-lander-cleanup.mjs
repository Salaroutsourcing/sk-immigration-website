/**
 * After extract-landers: 301 aliases, sitemap, visa-intel URLs, delete converted public HTML.
 * Run: node scripts/apply-lander-cleanup.mjs
 */
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const today = '2026-08-30';
const host = 'https://immigration.salaroutsourcing.com';

const BLOG_TO_LANDER = {
  'germany-student-visa': '/study-visa/germany-study-visa-pakistan/',
  'uk-student-visa': '/study-visa/uk-study-visa-pakistan/',
  'canada-student-visa': '/study-visa/canada-study-visa-pakistan/',
  'italy-student-visa': '/study-visa/italy-study-visa-pakistan/',
  'australia-student-visa': '/study-visa/australia-study-visa-pakistan/',
  'australia-study-visa-from-pakistan-2026': '/study-visa/australia-study-visa-pakistan/',
  'france-student-visa': '/study-visa/france-study-visa-pakistan/',
  'hungary-student-visa': '/study-visa/hungary-study-visa-pakistan/',
  'poland-student-visa': '/study-visa/poland-study-visa-pakistan/',
  'romania-student-visa': '/study-visa/romania-study-visa-pakistan/',
  'spain-student-visa': '/study-visa/spain-study-visa-pakistan/',
  'malaysia-student-visa': '/study-visa/malaysia-study-visa-pakistan/',
  'turkey-student-visa': '/study-visa/turkey-study-visa-pakistan/',
  'dubai-visit-visa': '/visit-visa/dubai-visit-visa-pakistan/',
  'ireland-student-visa': '/study-visa/ireland-study-visa-pakistan/',
  'netherlands-student-visa': '/study-visa/netherlands-study-visa-pakistan/',
  'cyprus-student-visa': '/study-visa/cyprus-study-visa-pakistan/',
  'malta-student-visa': '/study-visa/malta-study-visa-pakistan/',
  'slovakia-student-visa': '/study-visa/slovakia-study-visa-pakistan/',
  'czech-republic-student-visa': '/study-visa/czech-republic-study-visa-pakistan/',
  'portugal-student-visa': '/study-visa/portugal-study-visa-pakistan/',
};

function walkJson(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkJson(full, out);
    else if (name.endsWith('.json')) out.push(JSON.parse(readFileSync(full, 'utf8')));
  }
  return out;
}

function landerPath(entry) {
  const { cluster, slug } = entry;
  if (cluster === 'guides') return `/guides/${slug}/`;
  if (slug === 'index' || slug === 'hub') return `/${cluster}/`;
  return `/${cluster}/${slug}/`;
}

function rm(rel) {
  const full = join(root, rel);
  if (!existsSync(full)) return;
  rmSync(full, { recursive: true, force: true });
}

/* ——— visa-intel ——— */
const intelPath = join(root, 'public/assets/data/visa-intel.json');
let intel = readFileSync(intelPath, 'utf8');
for (const [blog, dest] of Object.entries(BLOG_TO_LANDER)) {
  intel = intel.replaceAll(`"guide_url": "blog/${blog}/"`, `"guide_url": "${dest}"`);
}
writeFileSync(intelPath, intel);

/* ——— redirects ——— */
const redirectsPath = join(root, 'public/_redirects');
let redirects = readFileSync(redirectsPath, 'utf8');
redirects = redirects.replace(/^\/answers\/ \/answers 301\n?/m, '');
if (!redirects.includes('/answers.html /answers/ 301')) {
  redirects += `\n/answers.html /answers/ 301\n`;
}

const extra = [];
const add = (from, to) => extra.push(`${from} ${to} 301`);

for (const [blog, dest] of Object.entries(BLOG_TO_LANDER)) {
  add(`/blog/${blog}`, dest);
  add(`/blog/${blog}/`, dest);
}
add('/guides/ausbildung-pakistan', '/guides/germany-student-visa-ausbildung/');
add('/guides/ausbildung-pakistan/', '/guides/germany-student-visa-ausbildung/');
add('/attestation.html', '/document-services/');
add('/attestation', '/document-services/');
add('/countries.html', '/study-visa/');
add('/countries', '/study-visa/');
add('/embassy-links.html', '/official-links/');
add('/official.html', '/official-links/');
add('/hire-workers.html', '/hire-workers-from-pakistan/');
add('/saudi.html', '/saudi-visa/saudi-visa-processing-pakistan/');
add('/visit.html', '/visit-visa/');
add('/work.html', '/work-permit/');
add('/work-visa.html', '/work-permit/');
add('/eligibility.html', '/eligibility/');
add('/checklist.html', '/checklist/');
add('/calculator.html', '/calculator/');
add('/compare.html', '/compare/');
add('/cv-builder.html', '/cv-builder/');
add('/blog-post.html', '/blog/');
add('/study-visa/germany.html', '/study-visa/germany-study-visa-pakistan/');
add('/study-visa/usa.html', '/study-visa/usa-study-visa-pakistan/');

const landers = walkJson(join(root, 'src/content/landers'));
for (const entry of landers) {
  if (entry.cluster === 'answers') {
    add(`/answers/${entry.slug}.html`, `/answers/${entry.slug}/`);
  }
}

const existing = new Set(
  redirects
    .split('\n')
    .map((line) => line.trim().split(/\s+/)[0])
    .filter(Boolean),
);
const uniqueExtra = extra.filter((rule) => {
  const from = rule.split(/\s+/)[0];
  if (existing.has(from)) return false;
  existing.add(from);
  return true;
});

redirects += `\n# Astro 7 lander + tool pretty URLs\n${uniqueExtra.join('\n')}\n`;
writeFileSync(redirectsPath, redirects);

/* ——— sitemap ——— */
const core = [
  ['/', 1.0, 'daily'],
  ['/about/', 0.9, 'monthly'],
  ['/services/', 0.9, 'weekly'],
  ['/contact/', 0.85, 'monthly'],
  ['/guides/', 0.9, 'weekly'],
  ['/guides/germany-student-visa-ausbildung/', 0.95, 'weekly'],
  ['/privacy/', 0.3, 'monthly'],
  ['/terms/', 0.3, 'monthly'],
  ['/blog/', 0.85, 'weekly'],
  ['/blog/study-europe-without-ielts-from-pakistan/', 0.9, 'weekly'],
  ['/news/', 0.8, 'daily'],
  ['/stories/', 0.8, 'daily'],
  ['/eligibility/', 0.85, 'weekly'],
  ['/checklist/', 0.85, 'weekly'],
  ['/calculator/', 0.85, 'weekly'],
  ['/compare/', 0.85, 'weekly'],
  ['/cv-builder/', 0.85, 'weekly'],
  ['/official-links/', 0.85, 'weekly'],
  ['/answers/', 0.85, 'weekly'],
  ['/llms.txt', 0.85, 'monthly'],
  ['/ai.txt', 0.85, 'monthly'],
  ['/pricing.html', 0.7, 'weekly'],
  ['/jobs.html', 0.7, 'weekly'],
  ['/cookies.html', 0.3, 'monthly'],
  ['/editorial-policy.html', 0.55, 'monthly'],
  ['/client-journey.html', 0.7, 'monthly'],
];

const urls = new Map();
function push(path, priority = 0.85, freq = 'weekly') {
  const loc = path.startsWith('http') ? path : `${host}${path}`;
  urls.set(loc, { loc, lastmod: today, changefreq: freq, priority });
}
for (const [path, priority, freq] of core) push(path, priority, freq);
for (const entry of landers) {
  if (entry.cluster === 'guides' && entry.slug === 'ausbildung-pakistan') continue;
  const path = landerPath(entry);
  const hub = entry.slug === 'index' || ['study-visa', 'visit-visa', 'work-permit', 'visa-appointment', 'document-services'].includes(entry.cluster);
  push(path, hub ? 0.95 : 0.9, 'weekly');
}
for (const cluster of ['study-visa', 'visit-visa', 'work-permit', 'visa-appointment', 'document-services', 'saudi-visa', 'local', 'answers']) {
  push(`/${cluster}/`, 0.95, 'weekly');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls.values()]
  .sort((a, b) => a.loc.localeCompare(b.loc))
  .map(
    (row) =>
      `  <url><loc>${row.loc}</loc><lastmod>${row.lastmod}</lastmod><changefreq>${row.changefreq}</changefreq><priority>${row.priority.toFixed(1)}</priority></url>`,
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(root, 'public/sitemap.xml'), xml);

/* ——— delete converted HTML ——— */
const htmlDirs = [
  'public/study-visa',
  'public/visit-visa',
  'public/work-permit',
  'public/visa-appointment',
  'public/document-services',
  'public/saudi-visa',
  'public/local',
  'public/hire-workers-from-pakistan',
  'public/hire-workers',
  'public/official-links',
  'public/answers',
];
for (const dir of htmlDirs) rm(dir);

for (const name of readdirSync(join(root, 'public/guides'))) {
  const full = join(root, 'public/guides', name);
  if (statSync(full).isDirectory()) rm(`public/guides/${name}`);
}

const blogDir = join(root, 'public/blog');
if (existsSync(blogDir)) {
  for (const name of readdirSync(blogDir)) {
    if (name === 'study-europe-without-ielts-from-pakistan') continue;
    rm(`public/blog/${name}`);
  }
}

const staleFiles = [
  'public/answers.html',
  'public/attestation.html',
  'public/countries.html',
  'public/embassy-links.html',
  'public/official.html',
  'public/hire-workers.html',
  'public/saudi.html',
  'public/visit.html',
  'public/work.html',
  'public/work-visa.html',
  'public/eligibility.html',
  'public/checklist.html',
  'public/calculator.html',
  'public/compare.html',
  'public/cv-builder.html',
  'public/blog-post.html',
];
for (const file of staleFiles) rm(file);

console.log(`cleanup done · ${landers.length} landers · ${urls.size} sitemap urls · ${uniqueExtra.length} new redirects`);
