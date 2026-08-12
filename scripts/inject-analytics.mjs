#!/usr/bin/env node
/**
 * Inject the Google Analytics (gtag.js) tag into the <head> of every public page.
 *
 * Safe to re-run: pages that already carry the measurement ID are skipped.
 * admin/ is internal CRM (noindex) and apps-script/ never ships, so both stay out.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const GA_ID = 'G-D0559366D6';
const SKIP_DIRS = new Set(['node_modules', '.git', '.wrangler', '.wrangler-logs', 'admin', 'apps-script', 'blog-posts']);

const SNIPPET = `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
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

let added = 0;
let skipped = 0;
const failed = [];

for (const file of htmlFiles(ROOT)) {
  const rel = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');

  if (html.includes(GA_ID)) {
    skipped += 1;
    continue;
  }

  /* Sit right below charset/viewport so the tag loads before page content. */
  const viewport = html.match(/^[ \t]*<meta[^>]*name=["']viewport["'][^>]*>[ \t]*\r?\n/mi);
  let updated;
  if (viewport) {
    const at = viewport.index + viewport[0].length;
    updated = html.slice(0, at) + SNIPPET + html.slice(at);
  } else {
    const head = html.match(/<head[^>]*>[ \t]*\r?\n/i);
    if (!head) {
      failed.push(rel);
      continue;
    }
    const at = head.index + head[0].length;
    updated = html.slice(0, at) + SNIPPET + html.slice(at);
  }

  fs.writeFileSync(file, updated);
  added += 1;
}

console.log(`gtag ${GA_ID} → added: ${added}, already present: ${skipped}`);
if (failed.length) {
  console.log(`no <head> found in ${failed.length} file(s):`);
  failed.forEach((f) => console.log(`  ${f}`));
}
