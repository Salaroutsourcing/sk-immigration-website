import type { APIRoute } from 'astro';
import { publishedStories, storyAmpPath } from '../lib/content';
import { SITE, absoluteUrl } from '../lib/site';
import { escapeXml } from '../lib/xml';

export const GET: APIRoute = async () => {
  const items = await publishedStories();
  const entries = items
    .map((entry) => {
      const link = absoluteUrl(storyAmpPath(entry.id));
      const image = absoluteUrl(entry.data.posterPortrait);
      return `    <item>
      <title>${escapeXml(entry.data.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <pubDate>${entry.data.publishDate.toUTCString()}</pubDate>
      <description>${escapeXml(entry.data.description)}</description>
      <content:encoded><![CDATA[<a href="${link}"><img src="${image}" alt="${escapeXml(entry.data.title)}" /></a>]]></content:encoded>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE.brandFull)} Web Stories</title>
    <link>${SITE.url}/stories/</link>
    <description>AMP Web Stories for Google Discover. Every story opens a long-form blog.</description>
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
