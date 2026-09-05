#!/usr/bin/env node
/**
 * Set Consent Mode v2 regional defaults sitewide:
 * - EEA / UK / CH / NO / IS / LI → denied until CMP / banner
 * - Rest of world → granted (ads can earn immediately)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', '.wrangler', '.wrangler-logs', 'admin', 'apps-script', 'blog-posts', 'scripts']);

const REGIONS = [
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV',
  'LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH',
].map((c) => `'${c}'`).join(',');

const NEW_BLOCK = `  <!-- Google Consent Mode v2 — regional defaults for worldwide AdSense -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500,
      region: [${REGIONS}]
    });
    gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
  </script>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-D0559366D6"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-D0559366D6');
  </script>
`;

const OLD_CONSENT_BLOCK = /[ \t]*<!-- Google Consent Mode[^>]*>[\s\S]*?<\/script>\s*<!-- Google tag \(gtag\.js\) -->\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-D0559366D6"><\/script>\s*<script>\s*(?:window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*)?gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-D0559366D6'[^<]*<\/script>\s*/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP.has(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else if (e.name.endsWith('.html')) out.push(path.join(dir, e.name));
  }
  return out;
}

let updated = 0;
let skipped = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('G-D0559366D6')) {
    skipped += 1;
    continue;
  }
  if (html.includes('regional defaults for worldwide AdSense')) {
    skipped += 1;
    continue;
  }
  if (OLD_CONSENT_BLOCK.test(html)) {
    html = html.replace(OLD_CONSENT_BLOCK, NEW_BLOCK);
    fs.writeFileSync(file, html);
    updated += 1;
    continue;
  }
  // Broader replace: from Consent Mode comment through GA config script
  const broad = /[ \t]*<!-- Google Consent Mode[\s\S]*?gtag\('config', 'G-D0559366D6'[^;]*;\s*<\/script>\s*/;
  if (broad.test(html)) {
    html = html.replace(broad, NEW_BLOCK);
    fs.writeFileSync(file, html);
    updated += 1;
  } else {
    skipped += 1;
  }
}

// Bump consent.js query string
let bumped = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const next = html.replace(/consent\.js\?v=consent\d+/g, 'consent.js?v=consent2');
  if (next !== html) {
    fs.writeFileSync(file, next);
    bumped += 1;
  }
}

console.log(JSON.stringify({ updated, skipped, bumped }, null, 2));
