#!/usr/bin/env node
/**
 * Ensure adsense-connect.js is loaded after config.js on public HTML pages.
 * Safe to re-run. Skips admin / scripts / node_modules.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.wrangler', '.wrangler-logs', 'admin', 'apps-script', 'blog-posts', 'scripts']);
const MARK = 'adsense-connect.js';

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

function adsenseSrcFor(file) {
  const rel = path.relative(ROOT, path.dirname(file)).replace(/\\/g, '/');
  if (!rel || rel === '.') return 'assets/js/adsense-connect.js?v=p9';
  const depth = rel.split('/').filter(Boolean).length;
  return `${'../'.repeat(depth)}assets/js/adsense-connect.js?v=p9`;
}

let added = 0;
let skipped = 0;
let noConfig = 0;

for (const file of htmlFiles(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(MARK)) {
    skipped += 1;
    continue;
  }
  if (!html.includes('assets/js/config.js') && !html.includes('/config.js')) {
    noConfig += 1;
    continue;
  }

  const src = adsenseSrcFor(file);
  const tag = `<script src="${src}"></script>`;
  let next = html;

  // Prefer after config.js
  if (/<script[^>]+config\.js[^>]*><\/script>/.test(html)) {
    next = html.replace(/(<script[^>]+config\.js[^>]*><\/script>)/, `$1\n  ${tag}`);
  } else {
    next = html.replace(/<\/body>/i, `  ${tag}\n</body>`);
  }

  if (next !== html) {
    fs.writeFileSync(file, next);
    added += 1;
  } else {
    noConfig += 1;
  }
}

console.log(JSON.stringify({ added, skipped, noConfig }, null, 2));
