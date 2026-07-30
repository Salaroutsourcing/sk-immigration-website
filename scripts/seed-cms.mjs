/**
 * Seed D1 blog_posts + jobs from assets/data/*.json
 * Usage: node scripts/seed-cms.mjs
 * Requires: wrangler auth, remote D1 sk-immigration-leads
 */
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

function esc(s) {
  return String(s ?? '').replace(/'/g, "''");
}

function seedBlog() {
  const posts = JSON.parse(readFileSync(join(root, 'assets/data/blog-posts.json'), 'utf8'));
  const stmts = ['DELETE FROM blog_posts;'];
  for (const p of posts) {
    stmts.push(
      `INSERT INTO blog_posts (id, slug, title, excerpt, category, tags, author, date, featured, published, content, url, created_at, updated_at) VALUES ('${esc(p.id)}', '${esc(p.slug)}', '${esc(p.title)}', '${esc(p.excerpt)}', '${esc(p.category)}', '${esc(JSON.stringify(p.tags || []))}', '${esc(p.author || 'SK Immigration')}', '${esc(p.date)}', ${p.featured ? 1 : 0}, 1, '${esc(p.content || '')}', '${esc(p.url || '')}', '${now}', '${now}');`
    );
  }
  return stmts;
}

function seedJobs() {
  const jobs = JSON.parse(readFileSync(join(root, 'assets/data/jobs.json'), 'utf8'));
  const stmts = ['DELETE FROM jobs;'];
  for (const j of jobs) {
    stmts.push(
      `INSERT INTO jobs (id, title, company, country, city, type, category, salary, language, featured, published, description, requirements, created_at, updated_at) VALUES ('${esc(j.id)}', '${esc(j.title)}', '${esc(j.company)}', '${esc(j.country)}', '${esc(j.city)}', '${esc(j.type)}', '${esc(j.category)}', '${esc(j.salary)}', '${esc(j.language)}', ${j.featured ? 1 : 0}, 1, '${esc(j.description || '')}', '${esc(JSON.stringify(j.requirements || []))}', '${now}', '${now}');`
    );
  }
  return stmts;
}

const sqlPath = join(root, 'migrations/_seed_tmp.sql');
const sql = [...seedBlog(), ...seedJobs()].join('\n');
writeFileSync(sqlPath, sql);
try {
  console.log('Seeding remote D1…');
  execSync(`npx wrangler d1 execute sk-immigration-leads --remote --file=${sqlPath}`, {
    cwd: root,
    stdio: 'inherit',
  });
  console.log('Seed complete.');
} finally {
  try {
    unlinkSync(sqlPath);
  } catch {
    /* ignore */
  }
}
