import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema, guideSchema, newsSchema, webStorySchema } from './lib/schemas';

const news = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/news',
  }),
  schema: newsSchema,
});

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: blogSchema,
});

const webStories = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/web-stories',
  }),
  schema: webStorySchema,
});

const guides = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/guides',
  }),
  schema: guideSchema,
});

export const collections = {
  news,
  blog,
  guides,
  'web-stories': webStories,
};
