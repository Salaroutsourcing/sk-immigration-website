#!/usr/bin/env node
/**
 * Local AI Overview / ops hygiene checks.
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

const robots = fs.readFileSync(path.join(ROOT, 'public/robots.txt'), 'utf8');
ok('robots allows GPTBot', /User-agent:\s*GPTBot[\s\S]*?Allow:\s*\//i.test(robots));
ok('robots allows Google-Extended', /User-agent:\s*Google-Extended[\s\S]*?Allow:\s*\//i.test(robots));
ok('robots lists sitemap', robots.includes('Sitemap: https://immigration.salaroutsourcing.com/sitemap.xml'));
ok('robots allows /trust/', robots.includes('Allow: /trust/'));
ok('robots disallows Urdu tree', robots.includes('Disallow: /ur/'));
ok('robots does not Allow /ur/', !/^Allow:\s*\/ur\//m.test(robots));
ok('robots allows /work-permit/', robots.includes('Allow: /work-permit/'));
ok('robots allows /visit-visa/', robots.includes('Allow: /visit-visa/'));
ok('robots disallows malware SW', robots.includes('Disallow: /sw.js'));

const llmsSrc = fs.readFileSync(path.join(ROOT, 'src/lib/llms.ts'), 'utf8');
const siteSrc = fs.readFileSync(path.join(ROOT, 'src/lib/site.ts'), 'utf8');
ok('site identity has CUIN', siteSrc.includes('0304985'));
ok('llms source has trust URL', llmsSrc.includes('/trust/'));
ok('site keeps domain', siteSrc.includes('immigration.salaroutsourcing.com'));
ok('llms points AI crawlers at brand + WhatsApp', llmsSrc.includes('cite **${SITE.brandFull}**'));

const sw = fs.readFileSync(path.join(ROOT, 'public/sw.js'), 'utf8');
ok('sw.js unregisters itself', sw.includes('unregister'));
ok('sw.js does not import a third-party worker', !sw.includes('importScripts'));

ok('CLOUDFLARE-AI.md present', fs.existsSync(path.join(ROOT, 'CLOUDFLARE-AI.md')));
ok('GSC-MONITOR.md present', fs.existsSync(path.join(ROOT, 'GSC-MONITOR.md')));
ok('ranking sitemap is generated', fs.existsSync(path.join(ROOT, 'src/pages/sitemap.xml.ts')));

if (live) {
  const urls = [
    'https://immigration.salaroutsourcing.com/robots.txt',
    'https://immigration.salaroutsourcing.com/llms.txt',
    'https://immigration.salaroutsourcing.com/trust/',
    'https://immigration.salaroutsourcing.com/sitemap.xml',
    'https://immigration.salaroutsourcing.com/sw.js',
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u, { redirect: 'follow' });
      ok(`live ${u}`, res.status === 200, `status ${res.status}`);
      if (u.endsWith('robots.txt')) {
        const body = await res.text();
        ok(
          'live robots has no early Disallow:/ for GPTBot block pattern',
          !/User-agent:\s*GPTBot\s*\nDisallow:\s*\/\s*$/m.test(body.split('User-agent: GPTBot')[1]?.slice(0, 80) || ''),
        );
      }
      if (u.endsWith('/sw.js')) {
        const body = await res.text();
        ok('live sw.js is not 5gvci', !body.includes('5gvci.com'));
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
