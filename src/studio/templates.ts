import type { Collection, EntryData } from './types';

const today = () => new Date().toISOString().slice(0, 10);

export function blankData(collection: Collection): EntryData {
  const publishDate = today();
  const base: EntryData = {
    title: '',
    description: '',
    publishDate,
    author: 'SK Immigration Services',
    tags: [],
    keywords: [],
    featured: false,
    draft: true,
    category: collection === 'blog' ? 'how-to' : 'study-visa',
  };
  if (collection === 'news') {
    return {
      ...base,
      dateline: 'Rawalpindi, Pakistan',
      sources: [{ name: '', url: '' }],
    };
  }
  if (collection === 'blog') {
    return {
      ...base,
      faqs: [
        { question: '', answer: '' },
        { question: '', answer: '' },
        { question: '', answer: '' },
      ],
      relatedStories: [],
      relatedNews: [],
      affiliates: [],
    };
  }
  return {
    ...base,
    posterPortrait: '/assets/img/og-share.jpg',
    relatedBlog: '',
    durationSeconds: 12,
    slides: [
      { heading: '', text: '' },
      { heading: '', text: '' },
      { heading: '', text: '' },
      { heading: '', text: '' },
    ],
  };
}

export function dailyTemplates(collection: Collection): { name: string; data: EntryData; body: string }[] {
  const date = today();
  if (collection === 'news') {
    return [
      {
        name: 'Visa update brief',
        data: {
          ...blankData('news'),
          title: 'Visa update: what Pakistani applicants should verify this week',
          description:
            'A short news brief on a rule, fee, or appointment change. Confirm the official page before you book VFS or move funds.',
          publishDate: date,
          category: 'study-visa',
          tags: ['process'],
          keywords: ['study visa from Pakistan'],
        },
        body: `A rule, fee, or appointment window just moved. Treat social posts as a rumour until you open the **official mission page**.

## What to do today

1. Confirm the live checklist, not a screenshot from last year.
2. Keep funds, insurance, and appointment proof together.
3. Do not pay anyone who promises a visa.

SK Immigration Services (CUIN 0304985) reviews files. Embassies decide visas.

**Next:** pair this brief with a long guide and a Web Story.`,
      },
    ];
  }
  if (collection === 'blog') {
    return [
      {
        name: 'Country how-to (3 FAQs)',
        data: {
          ...blankData('blog'),
          title: 'How to apply from Pakistan — realistic 2026 checklist',
          description:
            'A practical how-to for Pakistani applicants: documents, funds, language, and the difference between a university offer and a visa.',
          category: 'how-to',
          tags: ['process'],
          keywords: ['study visa from Pakistan'],
          faqs: [
            {
              question: 'Does SK Immigration guarantee this visa?',
              answer:
                'No. Embassies and consulates decide. CUIN 0304985. We prepare files and tell you honestly if a route is weak.',
            },
            {
              question: 'Is IELTS always required?',
              answer:
                'Not always. Some EU routes accept MOI letters or local-language programmes. UK/Canada still usually want a SELT. Confirm the current intake page.',
            },
            {
              question: 'What should I bring to the first consult?',
              answer:
                'Passport bio page, last academic documents, a budget range, and any offer or refusal you already have. WhatsApp +92 304 5999859.',
            },
          ],
        },
        body: `This is a **long guide**, not a news ping. Use it as the landing page a Web Story should open.

## The honest map

Write the real routes, the real costs, and what still fails files from Rawalpindi.

## Documents

List the live embassy set. Link the lander. Never invent a fee.

## Next steps

- [Eligibility quiz](/eligibility.html)
- [Document checklist](/checklist.html)
- WhatsApp [+92 304 5999859](https://wa.me/923045999859)
`,
      },
    ];
  }
  return [
    {
      name: 'Story → blog funnel',
      data: {
        ...blankData('web-stories'),
        title: '15-second recap — tap through to the guide',
        description:
          'A short Web Story for Pakistani students. Last slide must open the related blog so Discover and WhatsApp traffic can convert.',
        tags: ['process'],
        relatedBlog: 'study-europe-without-ielts-from-pakistan',
        slides: [
          { heading: 'The hook', text: 'State the search query in plain English. No visa promises.' },
          { heading: 'The catch', text: 'Admission and the embassy are different. A waiver on paper can still fail at VFS.' },
          { heading: 'Who it fits', text: 'Marks, funds, and language — be specific so the wrong applicant self-selects out.' },
          {
            heading: 'Read the full guide',
            text: 'Tap through for checklists, FAQs, and the landers we use for files from Rawalpindi.',
            ctaLabel: 'Open the blog',
            ctaHref: '/blog/study-europe-without-ielts-from-pakistan/',
          },
        ],
      },
      body: 'Producer note: last screen must open relatedBlog. Do not end on WhatsApp-only.',
    },
  ];
}

export function slugFromTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || 'untitled'
  );
}
