#!/usr/bin/env node
/**
 * Upgrade every public page GA snippet to Google Consent Mode v2 defaults
 * and ensure consent.js is loaded before layout.js.
 *
 * Safe to re-run.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const GA_ID = 'G-D0559366D6';
const SKIP_DIRS = new Set(['node_modules', '.git', '.wrangler', '.wrangler-logs', 'admin', 'apps-script', 'blog-posts']);

const OLD_BLOCK_RE = /[ \t]*<!-- Google tag \(gtag\.js\) -->\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-D0559366D6"><\/script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-D0559366D6'\);\s*<\/script>\s*/g;

const NEW_BLOCK = `  <!-- Google Consent Mode defaults -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
  </script>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
  <script>
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { anonymize_ip: true });
  </script>
`;

function htmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...htmlFiles(path.join(dir, entry.name)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function consentSrcFor(file) {
  const rel = path.relative(ROOT, path.dirname(file)).replace(/\\/g, '/');
  if (!rel || rel === '.') return 'assets/js/consent.js?v=consent1';
  const depth = rel.split('/').filter(Boolean).length;
  return `${'../'.repeat(depth)}assets/js/consent.js?v=consent1`;
}

let upgradedGa = 0;
let alreadyGa = 0;
let addedConsent = 0;
let skippedConsent = 0;

for (const file of htmlFiles(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (html.includes("gtag('consent', 'default'")) {
    alreadyGa += 1;
  } else if (OLD_BLOCK_RE.test(html)) {
    html = html.replace(OLD_BLOCK_RE, NEW_BLOCK);
    upgradedGa += 1;
    changed = true;
  } else if (html.includes(GA_ID) && html.includes('googletagmanager.com/gtag/js')) {
    // Fallback: insert consent defaults immediately before existing gtag loader
    html = html.replace(
      /([ \t]*)<!-- Google tag \(gtag\.js\) -->/,
      `$1<!-- Google Consent Mode defaults -->
$1<script>
$1  window.dataLayer = window.dataLayer || [];
$1  function gtag(){dataLayer.push(arguments);}
$1  gtag('consent', 'default', {
$1    ad_storage: 'denied',
$1    ad_user_data: 'denied',
$1    ad_personalization: 'denied',
$1    analytics_storage: 'denied',
$1    wait_for_update: 500
$1  });
$1</script>
$1<!-- Google tag (gtag.js) -->`
    );
    html = html.replace(
      /gtag\('config', 'G-D0559366D6'\);/,
      "gtag('config', 'G-D0559366D6', { anonymize_ip: true });"
    );
    upgradedGa += 1;
    changed = true;
  }

  if (html.includes('consent.js')) {
    skippedConsent += 1;
  } else if (/assets\/js\/layout\.js/.test(html)) {
    const src = consentSrcFor(file);
    html = html.replace(
      /(<script[^>]+src=["'][^"']*assets\/js\/layout\.js[^"']*["'][^>]*><\/script>)/,
      `<script src="${src}"></script>\n  $1`
    );
    if (html.includes('consent.js')) {
      addedConsent += 1;
      changed = true;
    }
  }

  if (changed) fs.writeFileSync(file, html);
}

console.log(`Consent Mode GA: upgraded=${upgradedGa}, already=${alreadyGa}`);
console.log(`consent.js tags: added=${addedConsent}, already=${skippedConsent}`);
