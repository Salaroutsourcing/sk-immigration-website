/**
 * Workers Builds preview deploy. Cloudflare rejects branch names with `/`
 * as --preview-alias (API 10021), e.g. cursor/adsense-track-b-ad8e.
 *
 * Dashboard (non-production deploy command): node scripts/wrangler-preview.mjs
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORKER = 'sk-immigration-website';
const MAX_DNS_LABEL = 63;
const HASH_LENGTH = 4;
const ALIAS_RE = /^[a-z](?:[a-z0-9-]*[a-z0-9])?$/;

function sanitizePreviewAlias(raw, workerName = WORKER) {
  const branchName = String(raw || '').trim() || 'preview';
  let alias = branchName
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  if (!alias) alias = 'preview';
  if (!/^[a-z]/.test(alias)) alias = `p-${alias}`;

  const available = MAX_DNS_LABEL - workerName.length - 1;
  if (available < 1) return 'preview';

  if (alias.length > available) {
    const spaceForHash = HASH_LENGTH + 1;
    const maxPrefix = available - spaceForHash;
    if (maxPrefix < 1) return 'preview';
    const hash = createHash('sha256').update(branchName).digest('hex').slice(0, HASH_LENGTH);
    alias = `${alias.slice(0, maxPrefix).replace(/-+$/g, '')}-${hash}`;
  }

  alias = alias.replace(/-+$/g, '');
  if (!ALIAS_RE.test(alias)) return 'preview';
  return alias;
}

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
