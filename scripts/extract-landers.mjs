/**
 * Convert ranking HTML landers into JSON content for the Astro 7 template.
 * Run: node scripts/extract-landers.mjs
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = join(root, 'src/content/landers');

const CLUSTERS = [
  'study-visa',
  'visit-visa',
  'work-permit',
  'visa-appointment',
  'document-services',
  'saudi-visa',
  'local',
];

const SKIP_SLUGS = new Set([
  'visa-appointment/schengen-appointment-pakistan',
]);

const SKIP_GUIDES = new Set(['ausbildung-pakistan']);

const HTML_ALIASES = {
  'trust.html': '/about/',
  'about.html': '/about/',
  'contact.html': '/contact/',
  'privacy.html': '/privacy/',
  'terms.html': '/terms/',
  'faq.html': '/guides/',
  'ausbildung.html': '/guides/germany-student-visa-ausbildung/',
  'eligibility.html': '/eligibility/',
  'checklist.html': '/checklist/',
  'calculator.html': '/calculator/',
  'compare.html': '/compare/',
  'cv-builder.html': '/cv-builder/',
  'services.html': '/services/',
  'answers.html': '/answers/',
  'blog.html': '/blog/',
};

function decode(s = '') {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function attr(html, name) {
  const re = new RegExp(`${name}="([^"]*)"`, 'i');
  return decode(html.match(re)?.[1] || '');
}

function prettyPath(path, cluster = '') {
  if (!path) return '/';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:') || path.startsWith('#')) {
    return path;
  }
  const cleaned = path.replace(/^\.\//, '').replace(/^(?:\.\.\/)+/, '');
  const file = cleaned.split('/').pop();
  if (file && HTML_ALIASES[file]) return HTML_ALIASES[file];
  if (cleaned.endsWith('.html')) {
    const noExt = cleaned.replace(/\.html$/, '');
    if (noExt.startsWith('answers/') || (!noExt.includes('/') && cluster === 'answers')) {
      return `/answers/${noExt.replace(/^answers\//, '')}/`;
    }
    return `/${noExt.replace(/^\/+/, '')}/`;
  }
  const abs = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  return abs.endsWith('/') ? abs : `${abs}/`;
}

function rewriteLinks(html, cluster = '') {
  let out = html
    .replace(/https:\/\/immigration\.salaroutsourcing\.com\/trust\.html/g, '/about/')
    .replace(/trust\.html/g, '/about/')
    .replace(/href="(?:\.\.\/)+blog\/([a-z0-9-]+)\/?"/g, (_, slug) => {
      if (slug === 'dubai-visit-visa') return 'href="/visit-visa/dubai-visit-visa-pakistan/"';
      const country = slug.replace(/-student-visa$/, '').replace(/-study-visa-from-pakistan-2026$/, '');
      return `href="/study-visa/${country}-study-visa-pakistan/"`;
    })
    .replace(/href="([^"]+)"/g, (match, href) => {
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('/')) {
        if (href.startsWith('/') && HTML_ALIASES[href.slice(1)]) {
          return `href="${HTML_ALIASES[href.slice(1)]}"`;
        }
        return match;
      }
      return `href="${prettyPath(href, cluster)}"`;
    })
    .replace(/class="btn btn-gold"/g, 'class="btn-primary"')
    .replace(/class="btn btn-navy"/g, 'class="btn-primary"')
    .replace(/class="btn btn-ghost"/g, 'class="btn-tertiary"')
    .replace(/class="btn btn-whatsapp"/g, 'class="btn-whatsapp"');

  if (cluster === 'answers') {
    out = out.replace(/href="([a-z0-9-]+)\.html"/g, 'href="/answers/$1/"');
  }
  return out;
}

function stripAds(html) {
  return html
    .replace(/<!--\s*Mid-Article[\s\S]*?<div class="sk-ad-container"[\s\S]*?<\/div>\s*<\/div>/gi, '')
    .replace(/<div class="sk-ad-container"[\s\S]*?<\/ins>\s*<\/div>\s*<\/div>/gi, '')
    .replace(/\\n/g, '\n');
}

function extractFaqs(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const block of blocks) {
    try {
      const data = JSON.parse(block[1]);
      const type = data['@type'];
      if (type === 'FAQPage' && Array.isArray(data.mainEntity)) {
        return data.mainEntity
          .map((item) => ({
            question: decode(item.name || ''),
            answer: decode(item.acceptedAnswer?.text || ''),
          }))
          .filter((item) => item.question && item.answer);
      }
    } catch {
      /* ignore malformed json-ld */
    }
  }
  const mini = html.match(/<div class="faq-mini">([\s\S]*?)<\/div>/i)?.[1] || '';
  const details = [...mini.matchAll(/<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/gi)];
  return details.map((row) => ({
    question: decode(row[1].replace(/<[^>]+>/g, '')),
    answer: decode(row[2].replace(/<[^>]+>/g, '')),
  }));
}

function extractBody(html, cluster = '') {
  let body =
    html.match(/<div class="prose"[^>]*>([\s\S]*?)<\/div>\s*<\/article>/i)?.[1] ||
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] ||
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ||
    '';
  body = stripAds(body);
  body = body.replace(/<nav[^>]*aria-label="Breadcrumb"[\s\S]*?<\/nav>/gi, '');
  body = body.replace(/<p class="eyebrow"[\s\S]*?<\/p>/i, '');
  body = body.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
  body = body.replace(/<p class="lead-answer">[\s\S]*?<\/p>/i, (m) => m);
  body = body.replace(/<h2[^>]*>Frequently asked questions<\/h2>[\s\S]*?(?=<h2|$)/i, '');
  body = body.replace(/<div class="faq-mini">[\s\S]*?<\/div>/i, '');
  body = body.replace(/<h2[^>]*>Talk to SK Immigration<\/h2>[\s\S]*$/i, '');
  body = body.replace(/<div class="hero-ctas[^"]*"[\s\S]*?<\/div>/gi, '');
  body = body.replace(/<div id="site-header"><\/div>/g, '');
  body = body.replace(/<div class="bg-orbs"[\s\S]*?<\/div>/g, '');
  body = body.replace(/<h2[^>]*>FAQ<\/h2>\s*/i, '');
  return rewriteLinks(body, cluster).trim();
}

function extractPage(filePath, cluster, slug) {
  const html = readFileSync(filePath, 'utf8');
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ');
  const description = attr(html, 'name="description" content') || attr(html.replace('name="description" ', ''), 'content');
  const desc =
    html.match(/name="description"\s+content="([^"]*)"/i)?.[1] ||
    html.match(/content="([^"]*)"\s+name="description"/i)?.[1] ||
    '';
  const image = html.match(/property="og:image"\s+content="([^"]+)"/i)?.[1] || '';
  const reviewed = html.match(/name="last-reviewed"\s+content="([^"]+)"/i)?.[1] || '2026-08-01';
  const h1 = decode(
    (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || title).replace(/<[^>]+>/g, ''),
  );
  const imagePath = image.replace('https://immigration.salaroutsourcing.com', '') || undefined;
  const faqs = extractFaqs(html).map((faq) => ({
    question: rewriteLinks(faq.question, cluster),
    answer: rewriteLinks(faq.answer, cluster),
  }));
  return {
    cluster,
    slug,
    title: title.slice(0, 220) || h1,
    h1: h1.slice(0, 220) || title,
    description: decode(desc).slice(0, 500) || `${h1} from SK Immigration Services, Rawalpindi. Embassies decide visas.`,
    image: imagePath,
    publishDate: reviewed,
    faqs,
    body: extractBody(html, cluster),
  };
}

function writeLander(cluster, slug, data) {
  const dest = join(outRoot, cluster, `${slug}.json`);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, `${JSON.stringify(data, null, 2)}\n`);
}

function walkCluster(cluster) {
  const dir = join(root, 'public', cluster);
  if (!existsSync(dir)) return 0;
  let count = 0;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    const index = join(full, 'index.html');
    if (!existsSync(index)) continue;
    const key = `${cluster}/${name}`;
    if (SKIP_SLUGS.has(key)) continue;
    const data = extractPage(index, cluster, name);
    if (!data.body || data.body.length < 80) {
      console.warn('thin/skip', key, data.body.length);
      continue;
    }
    writeLander(cluster, name, data);
    count += 1;
  }
  return count;
}

function extractSingle(relDir, cluster, slug) {
  const index = join(root, 'public', relDir, 'index.html');
  if (!existsSync(index)) return 0;
  const data = extractPage(index, cluster, slug);
  writeLander(cluster, slug, data);
  return 1;
}

function redirectedAnswers() {
  const text = readFileSync(join(root, 'public/_redirects'), 'utf8');
  const skip = new Set();
  for (const line of text.split('\n')) {
    const from = line.trim().split(/\s+/)[0] || '';
    const m = from.match(/^\/answers\/([^/.]+)/);
    if (m) skip.add(m[1]);
  }
  return skip;
}

function extractAnswers() {
  const dir = join(root, 'public/answers');
  const skip = redirectedAnswers();
  skip.add('index');
  let count = 0;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.html')) continue;
    const slug = name.replace(/\.html$/, '');
    if (skip.has(slug)) continue;
    const data = extractPage(join(dir, name), 'answers', slug);
    if (!data.body || data.body.length < 40) continue;
    writeLander('answers', slug, data);
    count += 1;
  }
  return count;
}

function extractPublicGuides() {
  const dir = join(root, 'public/guides');
  let count = 0;
  if (!existsSync(dir)) return 0;
  for (const name of readdirSync(dir)) {
    const index = join(dir, name, 'index.html');
    if (!existsSync(index)) continue;
    if (SKIP_GUIDES.has(name)) continue;
    const data = extractPage(index, 'guides', name);
    writeLander('guides', name, data);
    count += 1;
  }
  return count;
}

let total = 0;
for (const cluster of CLUSTERS) total += walkCluster(cluster);
total += extractSingle('hire-workers-from-pakistan', 'hire-workers-from-pakistan', 'hub');
total += extractSingle('official-links', 'official-links', 'hub');
total += extractAnswers();
total += extractPublicGuides();
total += extractSingle('blog/australia-study-visa-from-pakistan-2026', 'study-visa', 'australia-study-visa-pakistan');
console.log(`extracted ${total} landers → src/content/landers`);
