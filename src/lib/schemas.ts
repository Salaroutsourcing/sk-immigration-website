import { z } from 'astro/zod';
import { BLOG_CATEGORIES, NEWS_CATEGORIES, STORY_CATEGORIES } from './site';

export const faqSchema = z.object({
  question: z.string().min(8),
  answer: z.string().min(20),
});

export const affiliateCardSchema = z.object({
  title: z.string(),
  url: z.string().startsWith('https://'),
  blurb: z.string(),
  rel: z.literal('sponsored nofollow').default('sponsored nofollow'),
});

const seoBase = {
  title: z.string().min(12).max(110),
  description: z.string().min(40).max(220),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().default(false),
};

export const newsSchema = z.object({
  ...seoBase,
  category: z.enum(NEWS_CATEGORIES),
  author: z.string().default('SK Immigration Services'),
  dateline: z.string().default('Rawalpindi, Pakistan'),
  /** Optional deep-link into a long-form blog (news → blog funnel). */
  relatedBlog: z.string().optional(),
  relatedStory: z.string().optional(),
  sources: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
      }),
    )
    .default([]),
});

export const blogSchema = z.object({
  ...seoBase,
  category: z.enum(BLOG_CATEGORIES),
  author: z.string().default('SK Immigration Services'),
  readingTime: z.number().int().positive().optional(),
  /** Required for ranking + AI citation. Every blog should ship FAQs. */
  faqs: z.array(faqSchema).min(3),
  /** Web stories that should send traffic here. */
  relatedStories: z.array(z.string()).default([]),
  relatedNews: z.array(z.string()).default([]),
  relatedService: z.string().optional(),
  country: z.string().optional(),
  affiliates: z.array(affiliateCardSchema).default([]),
});

export const storySlideSchema = z.object({
  heading: z.string().min(4).max(80),
  text: z.string().min(20).max(280),
  background: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const webStorySchema = z.object({
  ...seoBase,
  category: z.enum(STORY_CATEGORIES),
  posterPortrait: z.string(),
  /** Mandatory funnel: every story lands on a long-form blog. */
  relatedBlog: z.string(),
  relatedNews: z.string().optional(),
  slides: z.array(storySlideSchema).min(4).max(12),
  durationSeconds: z.number().int().min(8).max(20).default(12),
});
