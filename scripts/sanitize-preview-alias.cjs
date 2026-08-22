/**
 * Cloudflare preview aliases cannot contain `/`. Workers Builds passes the
 * raw git branch as --preview-alias (API 10021).
 */
'use strict';

const { createHash } = require('node:crypto');

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

function applyToArgv(argv) {
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--preview-alias' || arg === '--previewAlias') {
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        const clean = sanitizePreviewAlias(next);
        if (clean !== next) {
          console.log(`Sanitized --preview-alias: ${next} -> ${clean}`);
          argv[i + 1] = clean;
        }
      }
      continue;
    }
    if (arg.startsWith('--preview-alias=')) {
      const raw = arg.slice('--preview-alias='.length);
      const clean = sanitizePreviewAlias(raw);
      if (clean !== raw) {
        console.log(`Sanitized --preview-alias: ${raw} -> ${clean}`);
        argv[i] = `--preview-alias=${clean}`;
      }
    }
  }
  return argv;
}

module.exports = {
  WORKER,
  MAX_DNS_LABEL,
  ALIAS_RE,
  sanitizePreviewAlias,
  applyToArgv,
};
