/**
 * Workers Builds preview deploy. Cloudflare rejects branch names with `/`
 * as --preview-alias (API 10021), e.g. cursor/adsense-track-b-ad8e.
 *
 * Optional dashboard command: node scripts/wrangler-preview.mjs
 * Default `npx wrangler versions upload` is patched in postinstall.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { ALIAS_RE, MAX_DNS_LABEL, WORKER, applyToArgv, sanitizePreviewAlias } = require('./sanitize-preview-alias.cjs');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const rest = [];
  const incoming = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--self-test') continue;
    if (arg === '--preview-alias' || arg === '--previewAlias') {
      const val = argv[i + 1];
      if (val && !val.startsWith('-')) {
        incoming.push(val);
        i += 1;
      }
      continue;
    }
    if (arg.startsWith('--preview-alias=')) {
      incoming.push(arg.slice('--preview-alias='.length));
      continue;
    }
    rest.push(arg);
  }
  return { rest, incoming };
}

function selfTest() {
  const cases = [
    ['cursor/adsense-track-b-ad8e', 'cursor-adsense-track-b-ad8e'],
    ['chore/simplify-wrangler-deploy', 'chore-simplify-wrangler-deploy'],
    ['main', 'main'],
    ['', 'preview'],
    ['123-branch', 'p-123-branch'],
  ];
  const errors = [];
  for (const [input, expected] of cases) {
    const got = sanitizePreviewAlias(input);
    if (got !== expected) errors.push(`sanitize(${JSON.stringify(input)}) => ${got}, expected ${expected}`);
    if (!ALIAS_RE.test(got)) errors.push(`sanitize(${JSON.stringify(input)}) is not a valid alias: ${got}`);
  }
  const long = `cursor/${'adsense-track-b-ad8e-plus-extra-words-here'}`;
  const truncated = sanitizePreviewAlias(long);
  const maxAlias = MAX_DNS_LABEL - WORKER.length - 1;
  if (truncated.length > maxAlias) errors.push(`truncated alias too long: ${truncated.length}`);
  if (!ALIAS_RE.test(truncated)) errors.push(`truncated alias invalid: ${truncated}`);

  const argv = ['node', 'wrangler', 'versions', 'upload', '--preview-alias', 'cursor/adsense-track-b-ad8e'];
  applyToArgv(argv);
  if (argv[5] !== 'cursor-adsense-track-b-ad8e') {
    errors.push(`applyToArgv failed: ${argv[5]}`);
  }

  const patch = spawnSync(process.execPath, [join(root, 'scripts/patch-wrangler-alias.mjs')], {
    cwd: root,
    encoding: 'utf8',
  });
  if (patch.status !== 0) errors.push(`patch-wrangler-alias failed: ${patch.stderr}`);
  const wranglerBin = join(root, 'node_modules/wrangler/bin/wrangler.js');
  if (existsSync(wranglerBin) && !readFileSync(wranglerBin, 'utf8').includes('SK_SANITIZE_PREVIEW_ALIAS')) {
    errors.push('wrangler bin was not patched with SK_SANITIZE_PREVIEW_ALIAS');
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log('preview alias checks ok');
}

function isCli() {
  const entry = process.argv[1];
  if (!entry) return false;
  return resolve(entry) === fileURLToPath(import.meta.url);
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) {
    selfTest();
    return;
  }

  const { rest, incoming } = parseArgs(argv);
  const branch =
    incoming[0] || process.env.WORKERS_CI_BRANCH || process.env.GITHUB_REF_NAME || '';
  const onWorkersCi = process.env.WORKERS_CI === '1';
  const production = onWorkersCi && (branch === 'main' || branch === 'refs/heads/main');

  const wranglerJs = join(root, 'node_modules/wrangler/bin/wrangler.js');
  if (!existsSync(wranglerJs)) {
    console.error('wrangler is not installed. npm ci must include wrangler (it is in dependencies).');
    process.exit(1);
  }

  process.env.WRANGLER_CI_GENERATE_PREVIEW_ALIAS = 'false';

  const alias = sanitizePreviewAlias(branch);
  const wranglerArgs = production
    ? ['deploy', ...rest]
    : ['versions', 'upload', '--keep-vars', '--preview-alias', alias, ...rest];

  if (!production) {
    console.log(`Preview alias: ${alias} (branch ${branch || 'preview'})`);
  }

  const result = spawnSync(process.execPath, [wranglerJs, ...wranglerArgs], {
    stdio: 'inherit',
    cwd: root,
    env: process.env,
  });
  process.exit(result.status ?? 1);
}

if (isCli()) main();
