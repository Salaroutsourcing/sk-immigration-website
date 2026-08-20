import type { APIRoute } from 'astro';
import { publishedNews } from '../lib/content';
import { SITE } from '../lib/site';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export const GET: APIRoute = async () => {
  const items = await publishedNews();
  const entries = items
    .map((entry) => {
      const link = `${SITE.url}/news/${entry.id}/`;
      return `    <item>
      <title>${escapeXml(entry.data.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${entry.data.publishDate.toUTCString()}</pubDate>
      <description>${escapeXml(entry.data.description)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE.brandFull)} news</title>
    <link>${SITE.url}/news/</link>
    <description>Visa and study-abroad updates for applicants in Pakistan.</description>
    <language>en</language>
${entries}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
