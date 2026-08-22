import calendar from '../data/daily-sop.json';
import { blankData, slugFromTitle } from './templates';
import type { Collection, EntryData } from './types';

export const SOP_TIMEZONE = calendar.timezone;
export const SOP_TARGETS = calendar.targets;

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

export type SopDay = {
  weekday: string;
  theme: string;
  blog: SopSlot;
  news: SopSlot[];
  stories: SopSlot[];
};

export function todayPkt(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SOP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function weekdayPkt(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SOP_TIMEZONE,
    weekday: 'long',
  })
    .format(date)
    .toLowerCase();
}

export function planForDate(date = new Date()): SopDay {
  const weekday = weekdayPkt(date);
  const day = (calendar.week as Record<string, Omit<SopDay, 'weekday'>>)[weekday];
  return {
    weekday,
    theme: day?.theme || '',
    blog: day?.blog || { id: 'blog', title: '', angle: '', keyword: '', category: 'how-to' },
    news: day?.news || [],
    stories: day?.stories || [],
  };
}

export function findSlot(collection: Collection, slotId?: string | null): SopSlot | null {
  if (!slotId) return null;
  const plan = planForDate();
  if (collection === 'blog' && (slotId === 'blog' || slotId === plan.blog.id)) return plan.blog;
  if (collection === 'news') return plan.news.find((s) => s.id === slotId) || null;
  if (collection === 'web-stories') return plan.stories.find((s) => s.id === slotId) || null;
  return null;
}

const BANNED =
  /100%\s*visa|visa guaranteed|guaranteed visa|we guarantee your visa|guaranteed approval|confirmed visa|visa confirmed/i;

export function publishIssues(collection: Collection, data: EntryData, body: string, slug: string) {
  const issues: string[] = [];
  const title = (data.title || '').trim();
  const description = (data.description || '').trim();
  const text = `${title}\n${description}\n${body || ''}`;

  if (title.length < 12) issues.push('title too short');
  if (description.length < 40) issues.push('description too short');
  if (!slug.trim()) issues.push('slug required');
  if (BANNED.test(text)) issues.push('remove visa-guarantee language');

  if (collection === 'news') {
    const sources = data.sources || [];
    const official = sources.some((s) => /^https:\/\//i.test(s.url || '') && (s.name || '').trim());
    if (!official) issues.push('news needs an official source name + https URL');
    if ((body || '').trim().length < 280) issues.push('news body is too thin');
  }

  if (collection === 'blog') {
    const faqs = (data.faqs || []).filter((f) => f.question && f.answer);
    if (faqs.length < 3) issues.push('blog needs 3 FAQs');
    if ((body || '').trim().length < 600) issues.push('blog body is too thin');
  }

  if (collection === 'web-stories') {
    if (!(data.relatedBlog || '').trim()) issues.push('story needs relatedBlog');
    if (!(data.posterPortrait || '').trim()) issues.push('poster required');
    const slides = data.slides || [];
    if (slides.length < 4 || slides.length > 12) issues.push('need 4–12 slides');
    const last = slides[slides.length - 1] || { heading: '', text: '' };
    const href = last.ctaHref || '';
    if (!href.startsWith('/blog/') && !href.includes('/blog/')) {
      issues.push('last slide must open the related blog');
    }
  }

  return issues;
}

export function entryFromSlot(collection: Collection, slot: SopSlot): { data: EntryData; body: string } {
  const date = todayPkt();
  const plan = planForDate();
  const blogSlug = plan.blog.slug || slugFromTitle(plan.blog.title);
  const blogHref = `/blog/${blogSlug}/`;

  if (collection === 'news') {
    const data: EntryData = {
      ...blankData('news'),
      title: slot.title,
      description: `${slot.angle} Confirm the official page before anyone pays a fee or books VFS.`.slice(0, 220),
      publishDate: date,
      category: slot.category || 'study-visa',
      tags: [],
      keywords: slot.keyword ? [slot.keyword] : [],
      relatedBlog: blogSlug,
      sources: slot.officialHint
        ? [{ name: 'Official source (verify before publish)', url: slot.officialHint }]
        : [{ name: '', url: '' }],
    };
    const body = `${slot.angle}

Treat social posts as a rumour until you open the **official page**.

## What to do today

1. Confirm the live checklist or fee on the source linked in this brief.
2. Keep funds, appointment proof, and identity documents together.
3. Do not pay anyone who promises a visa.

SK Immigration Services (CUIN 0304985) reviews files from Rawalpindi. Embassies decide visas.

**Next:** read [${plan.blog.title}](${blogHref}) or WhatsApp [+92 304 5999859](https://wa.me/923045999859).
`;
    return { data, body };
  }

  if (collection === 'blog') {
    const data: EntryData = {
      ...blankData('blog'),
      title: slot.title,
      description: `${slot.angle} Embassies decide visas — SK Immigration never sells guarantees.`.slice(0, 220),
      publishDate: date,
      category: slot.category || 'how-to',
      keywords: slot.keyword ? [slot.keyword] : [],
      relatedService: slot.relatedService,
      faqs: [
        {
          question: 'Does SK Immigration guarantee this visa?',
          answer:
            'No. Embassies and consulates decide. CUIN 0304985. We prepare files and tell you honestly if a route is weak.',
        },
        {
          question: 'Where should I confirm fees and checklists?',
          answer:
            'On the official mission, VFS, or government page linked from this guide. Screenshots on WhatsApp go stale.',
        },
        {
          question: 'What should I bring to the first consult in Rawalpindi?',
          answer:
            'Passport bio page, last academic or work documents, a budget range, and any offer or refusal you already have. WhatsApp +92 304 5999859.',
        },
      ],
    };
    const body = `${slot.angle}

This is the **long guide** for today. Web Stories published today must open this URL.

## The honest map

Write the real routes, the real costs, and what still fails files from Rawalpindi. Never invent a fee.

## Documents

List the live embassy set. Link ${slot.relatedService || 'the matching lander'}.

## Tools

- [Eligibility quiz](/eligibility.html)
- [Document checklist](/checklist.html)
- [Official links](/official-links/)

## Next steps

WhatsApp [+92 304 5999859](https://wa.me/923045999859). Office: Alfazal Plaza 64C, Satellite Town, Rawalpindi.
`;
    return { data, body };
  }

  const data: EntryData = {
    ...blankData('web-stories'),
    title: slot.title,
    description: `${slot.angle} Last slide opens the related blog.`.slice(0, 220),
    publishDate: date,
    category: slot.category || 'tips',
    keywords: slot.keyword ? [slot.keyword] : [],
    relatedBlog: blogSlug,
    slides: [
      { heading: slot.title.slice(0, 80), text: slot.angle.padEnd(20, '.') },
      {
        heading: 'Admission is not a visa',
        text: 'A university letter, MOI, or job screenshot does not bind the embassy. Confirm the live official page.',
      },
      {
        heading: 'Who this fits',
        text: 'Be specific so the wrong applicant self-selects out. Marks, funds, and language still matter.',
      },
      {
        heading: 'Read the full guide',
        text: 'Tap through for checklists, FAQs, and the landers we use for files from Rawalpindi.',
        ctaLabel: 'Open the blog',
        ctaHref: blogHref,
      },
    ],
  };
  return {
    data,
    body: 'Producer note: last screen must open relatedBlog. Do not end on WhatsApp-only.',
  };
}
