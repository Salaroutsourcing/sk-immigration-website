import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

const SITE = 'https://immigration.salaroutsourcing.com';

/**
 * Phase 0: static HTML ranking pages live in /public and are copied into dist.
 * @astrojs/sitemap only sees Astro-generated routes, so we keep public/sitemap.xml
 * as the ranking URL list and emit a second sitemap for new collection pages.
 */
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      filenameBase: 'sitemap-platform',
      changefreq: 'daily',
      lastmod: new Date(),
      filter: (page) =>
        !page.includes('/studio') &&
        !page.includes('/dashboard') &&
        !page.includes('/admin'),
      serialize(item) {
        if (item.url.includes('/news/')) {
          item.changefreq = ChangeFreqEnum.HOURLY;
          item.priority = 0.85;
        } else if (item.url.includes('/stories/') && item.url.includes('/amp')) {
          item.changefreq = ChangeFreqEnum.DAILY;
          item.priority = 0.9;
        } else if (item.url.includes('/stories/')) {
          item.changefreq = ChangeFreqEnum.DAILY;
          item.priority = 0.8;
        } else if (item.url.includes('/blog/')) {
          item.changefreq = ChangeFreqEnum.WEEKLY;
          item.priority = 0.9;
        }
        return item;
      },
    }),
  ],
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
