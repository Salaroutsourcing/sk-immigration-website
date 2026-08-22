/**
 * After npm install, hook wrangler's bin so `npx wrangler versions upload
 * --preview-alias cursor/branch` still works. Workers Builds injects the
 * raw git branch and does not read our dashboard wrapper.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MARKER = 'SK_SANITIZE_PREVIEW_ALIAS';
const wranglerBin = join(root, 'node_modules/wrangler/bin/wrangler.js');
if (!existsSync(wranglerBin)) {
  console.warn('wrangler not installed; skip preview-alias patch');
  process.exit(0);
}

const src = readFileSync(wranglerBin, 'utf8');
if (src.includes(MARKER)) process.exit(0);

const inject = `
// ${MARKER}
try {
  require(require('path').join(process.cwd(), 'scripts/sanitize-preview-alias.cjs')).applyToArgv(process.argv);
} catch (err) {
  /* preview alias helper is optional when running wrangler outside this repo */
}
`;

let next = src;
if (src.startsWith('#!')) {
  const nl = src.indexOf('\n');
  next = src.slice(0, nl + 1) + inject + src.slice(nl + 1);
} else {
  next = inject + src;
}
writeFileSync(wranglerBin, next);
console.log('Patched wrangler to sanitize --preview-alias');
