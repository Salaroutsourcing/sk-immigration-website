import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema, newsSchema, webStorySchema } from './lib/schemas';

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

export const collections = {
  news,
  blog,
  'web-stories': webStories,
};
