#!/usr/bin/env node
/**
 * Remove AdSense <ins> slots from legal / trust pages (AdSense reviewers
 * expect clean Privacy, Cookies, Terms, About, Contact pages).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = [
  'privacy.html',
  'cookies.html',
  'terms.html',
  'editorial-policy.html',
  'about.html',
  'contact.html',
  'trust.html',
];

const AD_BLOCK =
  /\n?\s*<!--\s*═+[\s\S]*?Google AdSense Monetization Slot[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*/g;

const AD_BLOCK2 =
  /\n?\s*<div class="hl-wrap"[^>]*>\s*<div class="sk-ad-container"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*/g;

let n = 0;
for (const rel of FILES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = html.replace(AD_BLOCK, '\n');
  html = html.replace(AD_BLOCK2, '\n');
  // Also strip standalone sk-ad-container blocks on these pages
  html = html.replace(
    /\n?\s*<div class="sk-ad-container"[\s\S]*?<\/ins>\s*<\/div>\s*<\/div>\s*/g,
    '\n'
  );
  if (html !== before) {
    fs.writeFileSync(file, html);
    n += 1;
    console.log('cleaned', rel);
  } else {
    console.log('no ad block matched', rel);
  }
}
console.log('files cleaned:', n);
