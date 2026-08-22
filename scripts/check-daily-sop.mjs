/**
 * Guard the weekly 5+5+1 calendar so Studio cannot ship a thin day plan.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const calendar = JSON.parse(readFileSync(join(root, 'src/data/daily-sop.json'), 'utf8'));

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const errors = [];

if (calendar.timezone !== 'Asia/Karachi') errors.push('timezone must be Asia/Karachi');
if (calendar.targets?.news !== 5 || calendar.targets?.['web-stories'] !== 5 || calendar.targets?.blog !== 1) {
  errors.push('targets must be 5 news, 5 stories, 1 blog');
}

for (const day of days) {
  const block = calendar.week?.[day];
  if (!block) {
    errors.push(`missing ${day}`);
    continue;
  }
  if (!block.theme) errors.push(`${day} missing theme`);
  if (!block.blog?.title || !block.blog?.slug) errors.push(`${day} blog needs title + slug`);
  if (!Array.isArray(block.news) || block.news.length !== 5) errors.push(`${day} needs 5 news slots`);
  if (!Array.isArray(block.stories) || block.stories.length !== 5) errors.push(`${day} needs 5 story slots`);
  for (const item of block.news || []) {
    if (!item.officialHint?.startsWith('https://')) errors.push(`${day} ${item.id} needs https officialHint`);
  }
}

const slugs = days.map((d) => calendar.week[d].blog.slug);
const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dup.length) errors.push(`duplicate blog slugs: ${dup.join(', ')}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('daily SOP calendar ok — 7 days × 5 news × 5 stories × 1 blog');
