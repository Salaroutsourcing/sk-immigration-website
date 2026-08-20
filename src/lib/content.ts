import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';

export type NewsEntry = CollectionEntry<'news'>;
export type BlogEntry = CollectionEntry<'blog'>;
export type StoryEntry = CollectionEntry<'web-stories'>;

export async function publishedNews(): Promise<NewsEntry[]> {
  const items = await getCollection('news', ({ data }) => !data.draft);
  return items.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export async function publishedBlogs(): Promise<BlogEntry[]> {
  const items = await getCollection('blog', ({ data }) => !data.draft);
  return items.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export async function publishedStories(): Promise<StoryEntry[]> {
  const items = await getCollection('web-stories', ({ data }) => !data.draft);
  return items.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export async function newsByCategory(category: string): Promise<NewsEntry[]> {
  const items = await publishedNews();
  return items.filter((item) => item.data.category === category);
}

export async function getRelatedBlog(id: string | undefined): Promise<BlogEntry | undefined> {
  if (!id) return undefined;
  try {
    const entry = await getEntry('blog', id);
    if (!entry || entry.data.draft) return undefined;
    return entry;
  } catch {
    return undefined;
  }
}

export async function getRelatedStory(id: string | undefined): Promise<StoryEntry | undefined> {
  if (!id) return undefined;
  try {
    const entry = await getEntry('web-stories', id);
    if (!entry || entry.data.draft) return undefined;
    return entry;
  } catch {
    return undefined;
  }
}

export { render };
