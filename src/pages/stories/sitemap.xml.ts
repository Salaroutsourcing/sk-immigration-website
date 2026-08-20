import type { APIRoute } from 'astro';
import { publishedStories, storyAmpPath } from '../../lib/content';
import { SITE, absoluteUrl } from '../../lib/site';
import { escapeXml } from '../../lib/xml';

export const GET: APIRoute = async () => {
  const items = await publishedStories();
  const urls = items
    .map((entry) => {
      const loc = absoluteUrl(storyAmpPath(entry.id));
      const image = absoluteUrl(entry.data.posterPortrait);
      const lastmod = (entry.data.updatedDate ?? entry.data.publishDate).toISOString();
      const published = entry.data.publishDate.toISOString();
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE.brandFull)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${published}</news:publication_date>
      <news:title>${escapeXml(entry.data.title)}</news:title>
    </news:news>
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
    </image:image>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
