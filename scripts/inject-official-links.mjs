#!/usr/bin/env node
/**
 * Inject official embassy/gov links into study, work, visit, saudi landers + hub page.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/official-links.json'), 'utf8'));

const CODE_BY_SLUG_PART = {
  germany: 'de',
  france: 'fr',
  italy: 'it',
  spain: 'es',
  netherlands: 'nl',
  portugal: 'pt',
  poland: 'pl',
  hungary: 'hu',
  'czech-republic': 'cz',
  malta: 'mt',
  cyprus: 'cy',
  slovakia: 'sk',
  romania: 'ro',
  ireland: 'ie',
  austria: 'at',
  belgium: 'be',
  greece: 'gr',
  switzerland: 'ch',
  turkey: 'tr',
  malaysia: 'my',
  uk: 'gb',
  'united-kingdom': 'gb',
  usa: 'us',
  'united-states': 'us',
  canada: 'ca',
  australia: 'au',
  dubai: 'ae',
  uae: 'ae',
  saudi: 'sa',
  schengen: 'schengen',
};

function detectCode(relPath) {
  const base = path.basename(path.dirname(relPath));
  for (const [key, code] of Object.entries(CODE_BY_SLUG_PART)) {
    if (base.includes(key)) return code;
  }
  return null;
}

function sectionHtml(code, depth) {
  const c = data.countries[code];
  if (!c) return '';
  const prefix = '../'.repeat(depth);
  const lis = c.links
    .map(
      (l) =>
        `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a> <span class="text-muted" style="font-size:0.8rem">(${l.type})</span></li>`
    )
    .join('');
  return `
        <h2>Official government &amp; embassy links</h2>
        <p>Verify requirements on these official sites before you pay fees. SK Immigration prepares files — authorities decide visas.</p>
        <ul class="official-links">${lis}</ul>
        <p class="text-muted" style="font-size:0.88rem"><a href="${prefix}official-links/">All countries — official links hub</a> · <a href="${prefix}checklist.html?country=${code}">Document checklist</a></p>
`;
}

function injectFile(rel, depth) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) return false;
  let t = fs.readFileSync(full, 'utf8');
  const code = detectCode(rel);
  if (!code || !data.countries[code]) return false;
  const block = sectionHtml(code, depth);
  if (!block) return false;

  // Remove previous inject
  t = t.replace(/\n\s*<h2>Official government &amp; embassy links<\/h2>[\s\S]*?(?=\n\s*<h2>)/g, '\n');

  if (t.includes('<h2>Frequently asked questions</h2>')) {
    t = t.replace('<h2>Frequently asked questions</h2>', block + '\n        <h2>Frequently asked questions</h2>');
  } else if (t.includes('<h2>Talk to SK Immigration</h2>')) {
    t = t.replace('<h2>Talk to SK Immigration</h2>', block + '\n        <h2>Talk to SK Immigration</h2>');
  } else if (t.includes('<h2>Official sources (verify here)</h2>')) {
    // blog already has sources — append hub link only if missing
    if (!t.includes('official-links/')) {
      t = t.replace(
        /(<h2>Official sources \(verify here\)<\/h2>[\s\S]*?<\/ul>)/,
        `$1\n        <p><a href="../../official-links/">Browse all country official links →</a></p>`
      );
    }
  } else {
    return false;
  }
  fs.writeFileSync(full, t);
  return true;
}

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

let n = 0;
for (const root of ['study-visa', 'work-permit', 'visit-visa', 'saudi-visa', 'blog']) {
  for (const f of walkHtml(path.join(ROOT, root))) {
    const rel = path.relative(ROOT, f);
    const depth = rel.split('/').length - 1;
    if (injectFile(rel, depth)) {
      n++;
      console.log('injected', rel);
    }
  }
}

/* Hub page */
const countriesSorted = Object.entries(data.countries).sort((a, b) => a[1].name.localeCompare(b[1].name));
const cards = countriesSorted
  .map(([code, c]) => {
    const lis = c.links
      .map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a></li>`)
      .join('');
    return `<article class="glass card reveal" id="${code}" style="padding:1.25rem">
      <h2 style="font-family:var(--font-display);font-size:1.15rem;margin-bottom:0.5rem">${c.name}</h2>
      <ul>${lis}</ul>
      <p class="text-muted" style="font-size:0.85rem;margin-top:0.75rem"><a href="../checklist.html?country=${code}">Checklist</a>${
        fs.existsSync(path.join(ROOT, `study-visa/${c.name.toLowerCase().replace(/ /g, '-')}-study-visa-pakistan`)) ||
        fs.existsSync(path.join(ROOT, 'study-visa'))
          ? ''
          : ''
      }</p>
    </article>`;
  })
  .join('\n');

// Better related study links by code
const studyMap = {
  de: '../study-visa/germany-study-visa-pakistan/',
  gb: '../study-visa/uk-study-visa-pakistan/',
  ca: '../study-visa/canada-study-visa-pakistan/',
  us: '../study-visa/usa-study-visa-pakistan/',
  au: '../study-visa/australia-study-visa-pakistan/',
  fr: '../study-visa/france-study-visa-pakistan/',
  it: '../study-visa/italy-study-visa-pakistan/',
  es: '../study-visa/spain-study-visa-pakistan/',
  nl: '../study-visa/netherlands-study-visa-pakistan/',
  pt: '../study-visa/portugal-study-visa-pakistan/',
  pl: '../study-visa/poland-study-visa-pakistan/',
  hu: '../study-visa/hungary-study-visa-pakistan/',
  cz: '../study-visa/czech-republic-study-visa-pakistan/',
  mt: '../study-visa/malta-study-visa-pakistan/',
  cy: '../study-visa/cyprus-study-visa-pakistan/',
  sk: '../study-visa/slovakia-study-visa-pakistan/',
  ro: '../study-visa/romania-study-visa-pakistan/',
  ie: '../study-visa/ireland-study-visa-pakistan/',
  at: '../study-visa/austria-study-visa-pakistan/',
  be: '../study-visa/belgium-study-visa-pakistan/',
  gr: '../study-visa/greece-study-visa-pakistan/',
  ch: '../study-visa/switzerland-study-visa-pakistan/',
  tr: '../study-visa/turkey-study-visa-pakistan/',
  my: '../study-visa/malaysia-study-visa-pakistan/',
  sa: '../saudi-visa/saudi-visa-processing-pakistan/',
  ae: '../visit-visa/dubai-visit-visa-pakistan/',
};

const cards2 = countriesSorted
  .map(([code, c]) => {
    const lis = c.links
      .map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a> <span class="text-muted" style="font-size:0.78rem">· ${l.type}</span></li>`)
      .join('');
    const more = studyMap[code]
      ? `<p style="margin-top:0.75rem"><a class="btn btn-ghost btn-sm" href="${studyMap[code]}">SK country guide →</a> <a class="btn btn-ghost btn-sm" href="../checklist.html?country=${code}">Checklist</a></p>`
      : `<p style="margin-top:0.75rem"><a class="btn btn-ghost btn-sm" href="../checklist.html?country=${code}">Checklist</a></p>`;
    return `<article class="glass card reveal" id="${code}" style="padding:1.25rem">
      <h2 style="font-family:var(--font-display);font-size:1.15rem;margin-bottom:0.5rem">${c.name}</h2>
      <ul>${lis}</ul>
      ${more}
    </article>`;
  })
  .join('\n');

const pkLis = data.pakistan
  .map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a></li>`)
  .join('');

const hub = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Official Embassy &amp; Government Links by Country | SK Immigration</title>
  <meta name="description" content="Official embassy, immigration and study-government websites for Germany, UK, Canada, USA, Schengen, Hungary, Poland, Saudi, UAE and more — verify before you apply. SK Immigration Services." />
  <link rel="canonical" href="https://www.skimmigrationservices.works/official-links/" />
  <meta property="og:title" content="Official Embassy &amp; Government Links | SK Immigration" />
  <meta property="og:description" content="Country-by-country official visa, study and embassy websites for Pakistani applicants." />
  <meta property="og:url" content="https://www.skimmigrationservices.works/official-links/" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css?v=iosbar3" />
</head>
<body data-page="checklist">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main">
    <section class="hero" style="padding-bottom:1.5rem">
      <div class="container">
        <p class="eyebrow">Verify on official sites</p>
        <h1 class="display" style="font-size:clamp(1.8rem,4vw,2.6rem)">Embassy &amp; government links</h1>
        <p class="hero-lead" style="max-width:40rem">Every destination we cover — immigration portals, study sites, embassies and VFS channels. Always confirm fees and rules here before you pay anyone.</p>
        <p class="text-muted" style="max-width:40rem;margin-top:0.75rem;font-size:0.92rem">${data.disclaimer}</p>
      </div>
    </section>
    <section>
      <div class="container" style="padding-bottom:1rem">
        <article class="glass card" style="padding:1.25rem">
          <h2 style="font-family:var(--font-display);font-size:1.2rem">Pakistan reference</h2>
          <ul>${pkLis}</ul>
        </article>
      </div>
    </section>
    <section>
      <div class="container grid-2" style="padding-bottom:3rem">
${cards2}
      </div>
    </section>
  </main>
  <div id="site-footer"></div>
  <script src="../assets/js/config.js"></script>
  <script src="../assets/js/theme.js"></script>
  <script src="../assets/js/api.js"></script>
  <script src="../assets/js/layout.js?v=iosbar3"></script>
  <script src="../assets/js/seo.js"></script>
</body>
</html>
`;
fs.mkdirSync(path.join(ROOT, 'official-links'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'official-links/index.html'), hub);
console.log('wrote official-links/index.html');

/* Sync into visa-intel official_sources */
const intelPath = path.join(ROOT, 'assets/data/visa-intel.json');
const intel = JSON.parse(fs.readFileSync(intelPath, 'utf8'));
for (const c of intel.countries) {
  const pack = data.countries[c.code];
  if (!pack) continue;
  c.official_sources = pack.links.map((l) => ({ name: l.name, url: l.url }));
}
intel.updated = '2026-07-30';
fs.writeFileSync(intelPath, JSON.stringify(intel, null, 2) + '\n');
console.log('visa-intel official_sources synced');

/* Footer + sitemap + llms + redirects */
let layout = fs.readFileSync(path.join(ROOT, 'assets/js/layout.js'), 'utf8');
if (!layout.includes("official-links/")) {
  layout = layout.replace(
    `<a href="\${href('answers.html')}">Answers Hub</a>`,
    `<a href="\${href('answers.html')}">Answers Hub</a>\n            <a href="\${href('official-links/')}">Official embassy links</a>`
  );
  fs.writeFileSync(path.join(ROOT, 'assets/js/layout.js'), layout);
  console.log('footer link added');
}

let nested = fs.readFileSync(path.join(ROOT, 'assets/js/layout.js'), 'utf8');
if (!nested.includes("'official-links'")) {
  nested = nested.replace(
    `'guides',\n      'ur',`,
    `'guides',\n      'official-links',\n      'ur',`
  );
  fs.writeFileSync(path.join(ROOT, 'assets/js/layout.js'), nested);
}

let sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const loc = 'https://www.skimmigrationservices.works/official-links/';
if (!sm.includes(loc)) {
  sm = sm.replace(
    '</urlset>',
    `  <url><loc>${loc}</loc><lastmod>2026-07-30</lastmod><changefreq>monthly</changefreq><priority>0.95</priority></url>\n</urlset>`
  );
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm);
}

let llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
if (!llms.includes('official-links')) {
  llms = llms.replace(
    '- Checklist tool: https://www.skimmigrationservices.works/checklist.html',
    '- Checklist tool: https://www.skimmigrationservices.works/checklist.html\n- Official embassy & government links: https://www.skimmigrationservices.works/official-links/'
  );
  fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms);
}

let ai = fs.readFileSync(path.join(ROOT, 'ai.txt'), 'utf8');
if (!ai.includes('official-links')) {
  ai = ai.replace(
    '- Checklist tool: https://www.skimmigrationservices.works/checklist.html',
    '- Checklist tool: https://www.skimmigrationservices.works/checklist.html\n- Official embassy links: https://www.skimmigrationservices.works/official-links/'
  );
  fs.writeFileSync(path.join(ROOT, 'ai.txt'), ai);
}

let redirects = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8');
if (!redirects.includes('/official-links')) {
  fs.appendFileSync(
    path.join(ROOT, '_redirects'),
    '\n/official /official-links/ 301\n/embassy-links /official-links/ 301\n'
  );
}

console.log('Done. Pages injected:', n);
