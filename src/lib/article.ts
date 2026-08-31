/**
 * Article reading helpers — TOC, reading time, related services, official sources.
 * Scoped to long-form layouts; does not change homepage typography.
 */

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type RelatedLink = {
  href: string;
  title: string;
  category?: string;
  description?: string;
};

export type OfficialSource = {
  label: string;
  url: string;
};

export const BLOG_TOPIC_LABELS: Record<string, string> = {
  'country-guides': 'Study',
  'how-to': 'Immigration Basics',
  costs: 'Immigration Basics',
  requirements: 'Immigration Basics',
  ausbildung: 'Work & Training',
  attestation: 'Documents',
  comparisons: 'Immigration Basics',
  study: 'Study',
  travel: 'Travel',
  'work-training': 'Work & Training',
  business: 'Business',
  documents: 'Documents',
  'immigration-basics': 'Immigration Basics',
};

export const BLOG_TOPICS = [
  { id: 'study', label: 'Study' },
  { id: 'travel', label: 'Travel' },
  { id: 'work-training', label: 'Work & Training' },
  { id: 'business', label: 'Business' },
  { id: 'documents', label: 'Documents' },
  { id: 'immigration-basics', label: 'Immigration Basics' },
] as const;

export function topicLabel(category?: string): string {
  if (!category) return 'Guide';
  return BLOG_TOPIC_LABELS[category] ?? category.replace(/-/g, ' ');
}

export function slugifyHeading(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/gi, 'and')
    .replace(/&nbsp;/gi, ' ')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function headingsFromHtml(html: string = ''): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();
  const re = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const text = stripTags(match[3]);
    if (!text) continue;
    const existingId = match[2].match(/\sid=["']([^"']+)["']/i)?.[1];
    let id = existingId || slugifyHeading(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;
    items.push({ level: Number(match[1]) as 2 | 3, text, id });
  }
  return items;
}

export function headingsFromMarkdown(markdown: string = ''): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();
  for (const line of markdown.split('\n')) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const text = match[2].replace(/[*_`#[\]]/g, '').trim();
    if (!text) continue;
    let id = slugifyHeading(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;
    items.push({ level: match[1].length as 2 | 3, text, id });
  }
  return items;
}

export function injectHeadingIds(html: string): string {
  const seen = new Map<string, number>();
  return html.replace(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (_full, level, attrs, inner) => {
    const text = stripTags(inner);
    const existingId = String(attrs).match(/\sid=["']([^"']+)["']/i)?.[1];
    let id = existingId || slugifyHeading(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (!existingId && count > 0) id = `${id}-${count + 1}`;
    if (existingId) return `<h${level}${attrs}>${inner}</h${level}>`;
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

export function wrapTables(html: string): string {
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    if (table.includes('table-scroll')) return table;
    return `<div class="table-scroll">${table}</div>`;
  });
}

export function prepareArticleHtml(html: string): string {
  return wrapTables(injectHeadingIds(html));
}

export function readingMinutesFromText(text: string = ''): number {
  const words = stripTags(text).split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 220));
}

export function relatedServicesFor(cluster?: string): { href: string; title: string }[] {
  const byCluster: Record<string, { href: string; title: string }[]> = {
    'study-visa': [
      { href: '/study-visa/', title: 'Study Visa & Admissions' },
      { href: '/document-services/', title: 'Document Attestation' },
      { href: '/visa-appointment/', title: 'Appointments & Interview Preparation' },
    ],
    'work-permit': [
      { href: '/work-permit/', title: 'Germany Ausbildung & EU Opportunity Card' },
      { href: '/study-visa/', title: 'Study Visa & Admissions' },
      { href: '/document-services/', title: 'Document Attestation' },
    ],
    'saudi-visa': [
      { href: '/saudi-visa/', title: 'Saudi Sponsor-Driven Processing' },
      { href: '/document-services/', title: 'Document Attestation' },
      { href: '/visa-appointment/', title: 'Appointments & Interview Preparation' },
    ],
    'visit-visa': [
      { href: '/visit-visa/', title: 'Visit & Tourist Visas' },
      { href: '/visa-appointment/', title: 'Appointments & Interview Preparation' },
      { href: '/document-services/', title: 'Document Attestation' },
    ],
    'document-services': [
      { href: '/document-services/', title: 'Document Attestation' },
      { href: '/study-visa/', title: 'Study Visa & Admissions' },
      { href: '/visit-visa/', title: 'Visit & Tourist Visas' },
    ],
    'visa-appointment': [
      { href: '/visa-appointment/', title: 'Appointments & Interview Preparation' },
      { href: '/study-visa/', title: 'Study Visa & Admissions' },
      { href: '/visit-visa/', title: 'Visit & Tourist Visas' },
    ],
    guides: [
      { href: '/study-visa/', title: 'Study Visa & Admissions' },
      { href: '/work-permit/', title: 'Germany Ausbildung & EU Opportunity Card' },
      { href: '/business-registration/', title: 'Company Registration' },
    ],
    answers: [
      { href: '/guides/', title: 'Guides' },
      { href: '/study-visa/', title: 'Study Visa & Admissions' },
      { href: '/work-permit/', title: 'Germany Ausbildung & EU Opportunity Card' },
    ],
    blog: [
      { href: '/study-visa/', title: 'Study Visa & Admissions' },
      { href: '/work-permit/', title: 'Germany Ausbildung & EU Opportunity Card' },
      { href: '/guides/', title: 'Country guides' },
    ],
    news: [
      { href: '/study-visa/', title: 'Study Visa & Admissions' },
      { href: '/guides/', title: 'Country guides' },
      { href: '/blog/', title: 'Guides & insights' },
    ],
  };
  return (
    byCluster[cluster || ''] ?? [
      { href: '/services/', title: 'All services' },
      { href: '/contact/', title: 'Start Assessment' },
    ]
  );
}

/** Conservative official links only — never unofficial “visa blogs”. */
export const CLUSTER_OFFICIAL_SOURCES: Record<string, OfficialSource[]> = {
  'study-visa': [
    { label: 'DAAD — Study in Germany', url: 'https://www.daad.de/en/' },
    { label: 'UK student visa (GOV.UK)', url: 'https://www.gov.uk/student-visa' },
    { label: 'IRCC — Study in Canada', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html' },
  ],
  'work-permit': [
    { label: 'Make it in Germany', url: 'https://www.make-it-in-germany.com/en/' },
    { label: 'German Missions in Pakistan', url: 'https://pakistan.diplo.de/pk-en' },
  ],
  'saudi-visa': [
    { label: 'Saudi Ministry of Foreign Affairs', url: 'https://www.mofa.gov.sa/en' },
    { label: 'Bureau of Emigration & Overseas Employment (Pakistan)', url: 'https://beoe.gov.pk/' },
  ],
  'visit-visa': [
    { label: 'VFS Global', url: 'https://www.vfsglobal.com/en/individuals/index.html' },
    { label: 'UK visit visa (GOV.UK)', url: 'https://www.gov.uk/standard-visitor' },
  ],
  'document-services': [
    { label: 'Pakistan Ministry of Foreign Affairs', url: 'https://mofa.gov.pk/' },
    { label: 'Higher Education Commission Pakistan', url: 'https://www.hec.gov.pk/' },
  ],
  'visa-appointment': [
    { label: 'VFS Global', url: 'https://www.vfsglobal.com/en/individuals/index.html' },
    { label: 'German Missions in Pakistan', url: 'https://pakistan.diplo.de/pk-en' },
  ],
  guides: [
    { label: 'Make it in Germany', url: 'https://www.make-it-in-germany.com/en/' },
    { label: 'DAAD — Study in Germany', url: 'https://www.daad.de/en/' },
    { label: 'German Missions in Pakistan', url: 'https://pakistan.diplo.de/pk-en' },
  ],
  answers: [
    { label: 'Official embassy & government links hub', url: '/official-links/' },
  ],
  blog: [
    { label: 'Study in Europe (European Commission)', url: 'https://education.ec.europa.eu/study-in-europe' },
    { label: 'DAAD — Study in Germany', url: 'https://www.daad.de/en/' },
    { label: 'Official embassy & government links hub', url: '/official-links/' },
  ],
  news: [
    { label: 'German Missions in Pakistan', url: 'https://pakistan.diplo.de/pk-en' },
    { label: 'Official embassy & government links hub', url: '/official-links/' },
  ],
};

export function officialSourcesFor(cluster?: string): OfficialSource[] {
  return CLUSTER_OFFICIAL_SOURCES[cluster || ''] ?? [
    { label: 'Official embassy & government links hub', url: '/official-links/' },
  ];
}
