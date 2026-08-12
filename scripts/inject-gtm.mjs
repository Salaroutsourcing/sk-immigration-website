#!/usr/bin/env node
/**
 * Inject Google Tag Manager GTM-NFWDQ5XB sitewide:
 * 1) Head snippet immediately after Consent Mode defaults (still high in <head>)
 * 2) noscript iframe immediately after opening <body>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP = new Set([
  'node_modules', '.git', '.wrangler', '.wrangler-logs', 'admin', 'apps-script',
  'blog-posts', 'scripts',
]);
const GTM_ID = 'GTM-NFWDQ5XB';

const HEAD = `  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${GTM_ID}');</script>
  <!-- End Google Tag Manager -->
`;

const NOSCRIPT = `  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
`;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP.has(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else if (e.name.endsWith('.html')) out.push(path.join(dir, e.name));
  }
  return out;
}

let headAdded = 0;
let bodyAdded = 0;
let skipped = 0;

for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (html.includes(GTM_ID) && html.includes('gtm.js?id=')) {
    // already has head; maybe only need noscript
  } else if (/<head[^>]*>/i.test(html)) {
    // Prefer right after Consent Mode block so defaults stay first
    if (html.includes('<!-- Google Consent Mode')) {
      const afterConsent = html.replace(
        /(<!-- Google Consent Mode[\s\S]*?<\/script>\s*)/,
        `$1${HEAD}`
      );
      if (afterConsent !== html) {
        html = afterConsent;
        headAdded += 1;
        changed = true;
      }
    }
    if (!html.includes(GTM_ID)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>\n${HEAD}`);
      headAdded += 1;
      changed = true;
    }
  }

  if (!html.includes(`ns.html?id=${GTM_ID}`)) {
    if (/<body[^>]*>/i.test(html)) {
      html = html.replace(/(<body[^>]*>)/i, `$1\n${NOSCRIPT}`);
      bodyAdded += 1;
      changed = true;
    }
  }

  if (changed) fs.writeFileSync(file, html);
  else skipped += 1;
}

console.log(JSON.stringify({ headAdded, bodyAdded, skipped }, null, 2));
