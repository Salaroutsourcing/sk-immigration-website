import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { publishedBlogs, publishedNews, publishedStories, storyAmpPath } from '../lib/content';
import { landerPath } from '../lib/landers';
import { absoluteUrl } from '../lib/site';
import { escapeXml } from '../lib/xml';

const STATIC_PATHS = [
  '/',
  '/about/',
  '/trust/',
  '/services/',
  '/how-it-works/',
  '/contact/',
  '/faq/',
  '/privacy/',
  '/terms/',
  '/disclaimer/',
  '/cookies.html',
  '/editorial-policy.html',
  '/pricing.html',
  '/study-visa/',
  '/work-permit/',
  '/visit-visa/',
  '/visa-appointment/',
  '/document-services/',
  '/saudi-visa/',
  '/guides/',
  '/answers/',
  '/official-links/',
  '/local/',
  '/hire-workers-from-pakistan/',
  '/business-registration/',
  '/eligibility/',
  '/checklist/',
  '/calculator/',
  '/compare/',
  '/cv-builder/',
  '/blog/',
  '/news/',
  '/stories/',
  '/llms.txt',
  '/llms-full.txt',
  '/ai.txt',
];

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string) {
  return `  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  const rows: string[] = [];

  function add(path: string, lastmod = today, changefreq = 'weekly', priority = '0.8') {
    const loc = path.startsWith('http') ? path : absoluteUrl(path);
    if (seen.has(loc)) return;
    seen.add(loc);
    rows.push(urlEntry(loc, lastmod, changefreq, priority));
  }

  add('/', today, 'daily', '1.0');
  for (const path of STATIC_PATHS) {
    if (path === '/') continue;
    add(path, today, path === '/news/' ? 'hourly' : 'weekly', path.includes('study-visa') ? '0.9' : '0.8');
  }

  const [landers, news, blogs, stories] = await Promise.all([
    getCollection('landers'),
    publishedNews(),
    publishedBlogs(),
    publishedStories(),
  ]);

  for (const entry of landers) {
    add(landerPath(entry), today, 'weekly', '0.9');
  }
  for (const entry of news) {
    add(`/news/${entry.id}/`, entry.data.publishDate.toISOString().slice(0, 10), 'hourly', '0.85');
  }
  for (const entry of blogs) {
    add(`/blog/${entry.id}/`, entry.data.publishDate.toISOString().slice(0, 10), 'weekly', '0.9');
  }
  for (const entry of stories) {
    add(storyAmpPath(entry.id), entry.data.publishDate.toISOString().slice(0, 10), 'daily', '0.9');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
