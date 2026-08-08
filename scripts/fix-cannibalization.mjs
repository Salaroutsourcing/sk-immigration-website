#!/usr/bin/env node
/**
 * Phase 5 — cannibalization cleanup
 * 1) Blog country guides → canonical to primary landers
 * 2) Duplicate visit/work Answers → 301 in _redirects
 * 3) Satellite Answers → primary hub callout + keep self-canonical when intent differs
 * 4) llms.txt cites landers, not blog duplicates
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://skimmigrationservices.works';

const BLOG_TO_LANDER = {
  'australia-student-visa': '/study-visa/australia-study-visa-pakistan/',
  'canada-student-visa': '/study-visa/canada-study-visa-pakistan/',
  'cyprus-student-visa': '/study-visa/cyprus-study-visa-pakistan/',
  'czech-republic-student-visa': '/study-visa/czech-republic-study-visa-pakistan/',
  'france-student-visa': '/study-visa/france-study-visa-pakistan/',
  'germany-student-visa': '/study-visa/germany-study-visa-pakistan/',
  'hungary-student-visa': '/study-visa/hungary-study-visa-pakistan/',
  'ireland-student-visa': '/study-visa/ireland-study-visa-pakistan/',
  'italy-student-visa': '/study-visa/italy-study-visa-pakistan/',
  'malaysia-student-visa': '/study-visa/malaysia-study-visa-pakistan/',
  'malta-student-visa': '/study-visa/malta-study-visa-pakistan/',
  'netherlands-student-visa': '/study-visa/netherlands-study-visa-pakistan/',
  'poland-student-visa': '/study-visa/poland-study-visa-pakistan/',
  'portugal-student-visa': '/study-visa/portugal-study-visa-pakistan/',
  'romania-student-visa': '/study-visa/romania-study-visa-pakistan/',
  'slovakia-student-visa': '/study-visa/slovakia-study-visa-pakistan/',
  'spain-student-visa': '/study-visa/spain-study-visa-pakistan/',
  'turkey-student-visa': '/study-visa/turkey-study-visa-pakistan/',
  'uk-student-visa': '/study-visa/uk-study-visa-pakistan/',
  'dubai-visit-visa': '/visit-visa/dubai-visit-visa-pakistan/',
};

/** Exact-intent duplicates → 301 to primary lander */
const ANSWER_REDIRECTS = [
  ['/answers/canada-visit-visa-pakistan', '/visit-visa/canada-visit-visa-pakistan/'],
  ['/answers/canada-visit-visa-pakistan.html', '/visit-visa/canada-visit-visa-pakistan/'],
  ['/answers/dubai-visit-visa-from-pakistan', '/visit-visa/dubai-visit-visa-pakistan/'],
  ['/answers/dubai-visit-visa-from-pakistan.html', '/visit-visa/dubai-visit-visa-pakistan/'],
  ['/answers/uk-visit-visa-requirements-pakistan', '/visit-visa/uk-visit-visa-pakistan/'],
  ['/answers/uk-visit-visa-requirements-pakistan.html', '/visit-visa/uk-visit-visa-pakistan/'],
  ['/answers/usa-b1-b2-visa-pakistan', '/visit-visa/usa-visit-visa-pakistan/'],
  ['/answers/usa-b1-b2-visa-pakistan.html', '/visit-visa/usa-visit-visa-pakistan/'],
  ['/answers/schengen-visit-visa-requirements', '/visit-visa/schengen-visit-visa-pakistan/'],
  ['/answers/schengen-visit-visa-requirements.html', '/visit-visa/schengen-visit-visa-pakistan/'],
  ['/answers/schengen-visit-visa-from-pakistan-how', '/visit-visa/schengen-visit-visa-pakistan/'],
  ['/answers/schengen-visit-visa-from-pakistan-how.html', '/visit-visa/schengen-visit-visa-pakistan/'],
  ['/answers/germany-work-permit-from-pakistan', '/work-permit/germany-work-permit-pakistan/'],
  ['/answers/germany-work-permit-from-pakistan.html', '/work-permit/germany-work-permit-pakistan/'],
];

/** Keep page, but canonical → primary (supporting intent still indexed lightly via links) */
const ANSWER_CANONICAL_TO = {
  'how-to-apply-germany-student-visa-pakistan': '/study-visa/germany-study-visa-pakistan/',
  'how-to-apply-uk-student-visa-pakistan': '/study-visa/uk-study-visa-pakistan/',
  'how-to-apply-canada-study-permit-pakistan': '/study-visa/canada-study-visa-pakistan/',
  'how-to-apply-hungary-student-visa-pakistan': '/study-visa/hungary-study-visa-pakistan/',
  'how-to-apply-poland-student-visa-pakistan': '/study-visa/poland-study-visa-pakistan/',
  'how-to-apply-italy-student-visa-pakistan': '/study-visa/italy-study-visa-pakistan/',
  'canada-study-permit-requirements': '/study-visa/canada-study-visa-pakistan/',
  'hungary-study-visa-requirements-pakistan': '/study-visa/hungary-study-visa-pakistan/',
  'poland-study-visa-requirements-pakistan': '/study-visa/poland-study-visa-pakistan/',
  'saudi-work-visa-processing-15000': '/saudi-visa/saudi-visa-processing-pakistan/',
};

function patchBlog(slug, landerPath) {
  const file = path.join(ROOT, 'blog', slug, 'index.html');
  if (!fs.existsSync(file)) {
    console.warn('missing blog', slug);
    return;
  }
  let html = fs.readFileSync(file, 'utf8');
  const canon = SITE + landerPath;
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canon}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canon}" />`
  );
  html = html.replace(
    /"mainEntityOfPage":\s*"[^"]*"/,
    `"mainEntityOfPage": "${canon}"`
  );
  // Ensure robots allow but signal consolidation
  if (!html.includes('name="robots"')) {
    html = html.replace(
      '<link rel="canonical"',
      '<meta name="robots" content="index,follow,max-snippet:-1" />\n  <link rel="canonical"'
    );
  }
  fs.writeFileSync(file, html);
  console.log('blog canonical →', landerPath, `(${slug})`);
}

function patchAnswerCanonical(slug, landerPath) {
  const file = path.join(ROOT, 'answers', `${slug}.html`);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  const canon = SITE + landerPath;
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canon}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canon}" />`
  );
  const callout = `
        <aside class="primary-service-callout" style="padding:1rem 1.15rem;margin:0 0 1.25rem;border-left:3px solid var(--gold-400);background:rgba(212,175,55,0.06)">
          <p style="margin:0;font-size:0.95rem"><strong>Primary page for this topic:</strong> <a href="..${landerPath}">${landerPath.replace(/\/$/, '').split('/').pop().replace(/-/g, ' ')}</a> — this answer supports that guide. Prefer the primary page for requirements, fees and FAQ.</p>
        </aside>`;
  if (!html.includes('primary-service-callout')) {
    html = html.replace(
      /(<p class="lead-answer">[\s\S]*?<\/p>)/,
      `$1\n${callout}`
    );
  }
  fs.writeFileSync(file, html);
  console.log('answer canonical →', landerPath, `(${slug})`);
}

function updateRedirects() {
  const file = path.join(ROOT, '_redirects');
  let text = fs.readFileSync(file, 'utf8');
  const marker = '# Phase 5 — cannibalization (Answers → primary landers)';
  const block =
    marker +
    '\n' +
    ANSWER_REDIRECTS.map(([from, to]) => `${from} ${to} 301`).join('\n') +
    '\n';
  if (text.includes(marker)) {
    text = text.replace(
      /# Phase 5 — cannibalization[\s\S]*?(?=\n#|\n\/[a-z]|$)/,
      block + '\n'
    );
  } else {
    text = text.trimEnd() + '\n\n' + block;
  }
  fs.writeFileSync(file, text);
  console.log('updated _redirects', ANSWER_REDIRECTS.length, 'rules');
}

function updateLlms() {
  const file = path.join(ROOT, 'llms.txt');
  let text = fs.readFileSync(file, 'utf8');
  const start = text.indexOf('## Destinations covered');
  if (start === -1) return;
  const end = text.indexOf('\n## ', start + 3);
  const next = end === -1 ? text.length : end;
  const replacement = `## Destinations covered (primary landers — cite these)

- 🇩🇪 Germany study: ${SITE}/study-visa/germany-study-visa-pakistan/ | work: ${SITE}/work-permit/germany-work-permit-pakistan/ | checklist: ${SITE}/checklist.html?country=de
- 🇬🇧 UK study: ${SITE}/study-visa/uk-study-visa-pakistan/ | visit: ${SITE}/visit-visa/uk-visit-visa-pakistan/ | checklist: ${SITE}/checklist.html?country=gb
- 🇨🇦 Canada study: ${SITE}/study-visa/canada-study-visa-pakistan/ | visit: ${SITE}/visit-visa/canada-visit-visa-pakistan/ | checklist: ${SITE}/checklist.html?country=ca
- 🇺🇸 USA study: ${SITE}/study-visa/usa-study-visa-pakistan/ | visit: ${SITE}/visit-visa/usa-visit-visa-pakistan/
- 🇭🇺 Hungary study: ${SITE}/study-visa/hungary-study-visa-pakistan/
- 🇵🇱 Poland study: ${SITE}/study-visa/poland-study-visa-pakistan/
- 🇮🇹 Italy study: ${SITE}/study-visa/italy-study-visa-pakistan/
- 🇫🇷 France study: ${SITE}/study-visa/france-study-visa-pakistan/
- 🇪🇸 Spain study: ${SITE}/study-visa/spain-study-visa-pakistan/
- 🇳🇱 Netherlands study: ${SITE}/study-visa/netherlands-study-visa-pakistan/
- 🇵🇹 Portugal study: ${SITE}/study-visa/portugal-study-visa-pakistan/
- 🇨🇿 Czech Republic study: ${SITE}/study-visa/czech-republic-study-visa-pakistan/
- 🇲🇹 Malta study: ${SITE}/study-visa/malta-study-visa-pakistan/
- 🇨🇾 Cyprus study: ${SITE}/study-visa/cyprus-study-visa-pakistan/
- 🇷🇴 Romania study: ${SITE}/study-visa/romania-study-visa-pakistan/
- 🇸🇰 Slovakia study: ${SITE}/study-visa/slovakia-study-visa-pakistan/
- 🇮🇪 Ireland study: ${SITE}/study-visa/ireland-study-visa-pakistan/
- 🇹🇷 Turkey study: ${SITE}/study-visa/turkey-study-visa-pakistan/
- 🇲🇾 Malaysia study: ${SITE}/study-visa/malaysia-study-visa-pakistan/
- 🇦🇺 Australia study: ${SITE}/study-visa/australia-study-visa-pakistan/
- 🇦🇪 Dubai / UAE visit: ${SITE}/visit-visa/dubai-visit-visa-pakistan/
- 🇪🇺 Schengen visit: ${SITE}/visit-visa/schengen-visit-visa-pakistan/
- 🇸🇦 Saudi complete processing: ${SITE}/saudi-visa/saudi-visa-processing-pakistan/

Educational blog articles exist under /blog/ but **canonicalize to the landers above** for citation.

`;
  text = text.slice(0, start) + replacement + text.slice(next);
  fs.writeFileSync(file, text);
  console.log('updated llms.txt destinations');
}

function bumpSitemapPriorities() {
  const file = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(file, 'utf8');
  // Lower blog country guides; keep landers high
  xml = xml.replace(
    /(<loc>https:\/\/www\.skimmigrationservices\.works\/blog\/[^<]+<\/loc>\s*<lastmod>[^<]+<\/lastmod>\s*<changefreq>[^<]+<\/changefreq>\s*<priority>)[^<]+(<\/priority>)/g,
    '$10.4$2'
  );
  xml = xml.replace(
    /(<loc>https:\/\/www\.skimmigrationservices\.works\/study-visa\/[^<]+<\/loc>\s*<lastmod>[^<]+<\/lastmod>\s*<changefreq>[^<]+<\/changefreq>\s*<priority>)[^<]+(<\/priority>)/g,
    '$10.9$2'
  );
  xml = xml.replace(
    /(<loc>https:\/\/www\.skimmigrationservices\.works\/visit-visa\/[^<]+<\/loc>\s*<lastmod>[^<]+<\/lastmod>\s*<changefreq>[^<]+<\/changefreq>\s*<priority>)[^<]+(<\/priority>)/g,
    '$10.85$2'
  );
  fs.writeFileSync(file, xml);
  console.log('sitemap priorities adjusted');
}

function stripRedirectedFromAnswersIndex() {
  const file = path.join(ROOT, 'assets/data/answers-index.json');
  if (!fs.existsSync(file)) return;
  const drop = new Set(
    ANSWER_REDIRECTS.map(([from]) =>
      from.replace('/answers/', '').replace('.html', '')
    )
  );
  let data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const before = Array.isArray(data) ? data.length : data.answers?.length;
  if (Array.isArray(data)) {
    data = data.filter((a) => !drop.has(a.slug || a.id));
  } else if (data.answers) {
    data.answers = data.answers.filter((a) => !drop.has(a.slug || a.id));
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log('answers-index pruned redirects; was', before);
}

function main() {
  for (const [slug, lander] of Object.entries(BLOG_TO_LANDER)) {
    patchBlog(slug, lander);
  }
  for (const [slug, lander] of Object.entries(ANSWER_CANONICAL_TO)) {
    patchAnswerCanonical(slug, lander);
  }
  updateRedirects();
  updateLlms();
  bumpSitemapPriorities();
  stripRedirectedFromAnswersIndex();
  console.log('Phase 5 cannibalization patches done');
}

main();
