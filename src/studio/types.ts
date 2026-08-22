export type Collection = 'news' | 'blog' | 'web-stories';
export type EntryStatus = 'draft' | 'published' | 'scheduled';

export type StudioUser = {
  login: string;
  name: string;
  avatar: string;
  method: 'github' | 'password';
};

export type Source = { name: string; url: string };
export type Faq = { question: string; answer: string };
export type Affiliate = { title: string; url: string; blurb: string; rel?: 'sponsored nofollow' };
export type Slide = {
  heading: string;
  text: string;
  background?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type EntryData = {
  title: string;
  description: string;
  publishDate: string;
  updatedDate?: string;
  draft?: boolean;
  featured?: boolean;
  tags: string[];
  keywords: string[];
  heroImage?: string;
  heroAlt?: string;
  canonical?: string;
  noindex?: boolean;
  author?: string;
  category: string;
  dateline?: string;
  relatedBlog?: string;
  relatedStory?: string;
  relatedNews?: string | string[];
  relatedStories?: string[];
  relatedService?: string;
  country?: string;
  sources?: Source[];
  faqs?: Faq[];
  affiliates?: Affiliate[];
  readingTime?: number;
  posterPortrait?: string;
  slides?: Slide[];
  durationSeconds?: number;
  slug?: string;
};

export type StudioEntry = {
  id: string;
  collection: Collection;
  slug: string;
  title: string;
  status: EntryStatus;
  data: EntryData;
  body: string;
  github_path?: string | null;
  github_sha?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
};

export type StudioEntrySummary = Omit<StudioEntry, 'data' | 'body'>;

export type StudioMedia = {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  public_path: string;
  github_sha?: string | null;
  alt?: string | null;
  created_at: string;
  created_by?: string | null;
};

export type StudioKeyword = {
  id: string;
  keyword: string;
  intent?: string | null;
  cluster?: string | null;
  status: string;
  notes?: string | null;
  updated_at: string;
};

export type SopSlot = {
  id: string;
  title: string;
  slug?: string;
  angle: string;
  keyword: string;
  category: string;
  relatedService?: string;
  officialHint?: string;
};

export type DashboardPayload = {
  today: string;
  timezone: string;
  targets: { news: number; 'web-stories': number; blog: number };
  remaining: { news: number; 'web-stories': number; blog: number };
  complete: boolean;
  sop: {
    weekday: string;
    theme: string;
    blog: SopSlot | null;
    news: SopSlot[];
    stories: SopSlot[];
  };
  counts: Record<
    Collection,
    { today: number; published: number; drafts: number; total: number }
  >;
  todayEntries: StudioEntrySummary[];
  recent: StudioEntrySummary[];
  keywords: Pick<StudioKeyword, 'keyword' | 'cluster' | 'status'>[];
  activity: { action: string; collection?: string; actor?: string; detail?: string; created_at: string }[];
  user: StudioUser;
};
