#!/usr/bin/env node
/**
 * Phase E — local AI Overview / ops hygiene checks.
 * Usage: node scripts/check-ai-ops.mjs [--live]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const live = process.argv.includes('--live');
let fails = 0;

function ok(label, pass, detail = '') {
  console.log(`${pass ? 'OK' : 'FAIL'}  ${label}${detail ? ' — ' + detail : ''}`);
  if (!pass) fails++;
}

const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
ok('robots allows GPTBot', /User-agent:\s*GPTBot[\s\S]*?Allow:\s*\//i.test(robots));
ok('robots allows Google-Extended', /User-agent:\s*Google-Extended[\s\S]*?Allow:\s*\//i.test(robots));
ok('robots lists sitemap', robots.includes('Sitemap: https://immigration.salaroutsourcing.com/sitemap.xml'));
ok('robots allows /trust.html', robots.includes('Allow: /trust.html'));
ok('robots allows /work-permit/', robots.includes('Allow: /work-permit/'));
ok('robots allows /visit-visa/', robots.includes('Allow: /visit-visa/'));

const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok('llms has CUIN', llms.includes('0304985'));
ok('llms has trust URL', llms.includes('/trust.html'));
ok('llms keeps domain', llms.includes('immigration.salaroutsourcing.com'));

const ai = fs.readFileSync(path.join(ROOT, 'ai.txt'), 'utf8');
ok('ai.txt points to llms + trust', ai.includes('llms.txt') && ai.includes('trust.html'));

const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok('sitemap has trust.html', sm.includes('/trust.html'));
ok('sitemap has llms.txt', sm.includes('/llms.txt'));
ok('sitemap no duplicate home', (sm.match(/immigration\.salaroutsourcing\.com\/<\/loc>/g) || []).length === 1);

const trust = fs.readFileSync(path.join(ROOT, 'trust.html'), 'utf8');
ok('trust page FAQ schema', trust.includes('FAQPage') && trust.includes('0304985'));
ok('trust page no AggregateRating', !trust.includes('AggregateRating'));

ok('CLOUDFLARE-AI.md present', fs.existsSync(path.join(ROOT, 'CLOUDFLARE-AI.md')));
ok('GSC-MONITOR.md present', fs.existsSync(path.join(ROOT, 'GSC-MONITOR.md')));

if (live) {
  const urls = [
    'https://immigration.salaroutsourcing.com/robots.txt',
    'https://immigration.salaroutsourcing.com/llms.txt',
    'https://immigration.salaroutsourcing.com/trust.html',
    'https://immigration.salaroutsourcing.com/sitemap.xml',
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u, { redirect: 'follow' });
      ok(`live ${u}`, res.status === 200, `status ${res.status}`);
      if (u.endsWith('robots.txt')) {
        const body = await res.text();
        ok('live robots has no early Disallow:/ for GPTBot block pattern', !/User-agent:\s*GPTBot\s*\nDisallow:\s*\/\s*$/m.test(body.split('User-agent: GPTBot')[1]?.slice(0, 80) || ''));
      }
    } catch (e) {
      ok(`live ${u}`, false, String(e.message || e));
    }
  }
}

if (fails) {
  console.error(`\n${fails} check(s) failed`);
  process.exit(1);
}
console.log('\nAll AI ops checks passed.');
