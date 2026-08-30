/**
 * Launch-readiness guards: ads.txt, robots, Studio noindex, SOP calendar, Worker host.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function read(rel) {
  const path = join(root, rel);
  if (!existsSync(path)) {
    errors.push(`missing ${rel}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

const ads = read('public/ads.txt');
if (ads && !ads.includes('pub-5113459275916426')) {
  errors.push('ads.txt must contain pub-5113459275916426');
}

const robots = read('public/robots.txt');
if (robots && !robots.includes('Disallow: /studio/')) {
  errors.push('robots.txt must Disallow /studio/');
}

const seo = read('src/components/seo/SeoHead.astro');
if (seo.includes('/sitemap-index.xml') && !seo.includes('sitemap-platform-index.xml')) {
  errors.push('SeoHead still points at missing /sitemap-index.xml');
}
if (seo.includes('Playfair+Display')) {
  errors.push('SeoHead still loads unused Playfair font');
}

const studio = read('src/layouts/StudioLayout.astro');
if (studio && !studio.includes('noindex')) {
  errors.push('StudioLayout must be noindex');
}

const wrangler = read('wrangler.jsonc');
if (wrangler && !wrangler.includes('immigration.salaroutsourcing.com')) {
  errors.push('wrangler.jsonc must pin the immigration custom domain');
}

const pkg = read('package.json');
if (pkg && !pkg.includes('"cf:preview"')) {
  errors.push('package.json missing cf:preview script');
}
if (pkg && !pkg.includes('patch-wrangler-alias.mjs')) {
  errors.push('package.json missing postinstall wrangler alias patch');
}
if (!existsSync(join(root, 'scripts/wrangler-preview.mjs'))) {
  errors.push('missing scripts/wrangler-preview.mjs');
}
if (!existsSync(join(root, 'scripts/sanitize-preview-alias.cjs'))) {
  errors.push('missing scripts/sanitize-preview-alias.cjs');
}
const redirects = read('public/_redirects');
if (redirects) {
  const rules = redirects
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  let sawDynamic = false;
  let dynamic = 0;
  let staticCount = 0;
  for (const rule of rules) {
    const from = rule.split(/\s+/)[0] || '';
    const isDynamic = /[*]|:[A-Za-z]/.test(from);
    if (isDynamic) sawDynamic = true;
    if (sawDynamic) dynamic += 1;
    else staticCount += 1;
  }
  if (dynamic > 100) {
    errors.push(`public/_redirects has ${dynamic} dynamic rules (Cloudflare max 100). Put exact paths first; keep splats last or in the Worker.`);
  }
  if (staticCount > 2000) {
    errors.push(`public/_redirects has ${staticCount} static rules (Cloudflare max 2000)`);
  }
  if (rules.some((r) => (r.split(/\s+/)[0] || '').includes('*'))) {
    errors.push('public/_redirects must not use splat rules; handle prefixes in worker/index.js so static aliases stay under the 100 dynamic cap');
  }
}

const required = [
  'docs/PHASE-0-ARCHITECTURE.md',
  'docs/PHASE-1-STUDIO.md',
  'docs/PHASE-2-AMP-STORIES.md',
  'docs/PHASE-3-JSONLD-LLMS.md',
  'docs/PHASE-4-ADSENSE-CLARITY.md',
  'docs/PHASE-5-DAILY-SOP.md',
  'docs/PHASE-6-LAUNCH.md',
  'docs/DAILY-USE.md',
  'DEPLOY.md',
  'src/lib/site.ts',
  'src/data/daily-sop.json',
];
for (const file of required) read(file);

const site = read('src/lib/site.ts');
if (site && !site.includes('ca-pub-5113459275916426')) errors.push('site.ts missing AdSense publisher');
if (site && !site.includes('y3u0myqn1l')) errors.push('site.ts missing Clarity id');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('launch checks ok');
