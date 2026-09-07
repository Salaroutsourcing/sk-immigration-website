/**
 * SK Live — free immigration tools. Catalog is the source of truth for the
 * hub, nav, sitemap, and llms.txt. Tools are planning aids; authorities decide.
 */
export type ToolKind =
  | 'match'
  | 'search'
  | 'money'
  | 'docs'
  | 'language'
  | 'write'
  | 'coach'
  | 'track';

export interface SkTool {
  slug: string;
  href: string;
  title: string;
  short: string;
  description: string;
  kind: ToolKind;
  badge: string;
  featured?: boolean;
  advanced?: boolean;
}

export const SK_LIVE = {
  name: 'SK Live',
  tagline: 'Search, match, budget, track — then we prepare the file.',
  href: '/tools/',
} as const;

export const SK_TOOLS: SkTool[] = [
  {
    slug: 'fasttrack',
    href: '/fasttrack/',
    title: 'SK FastTrack',
    short: 'Instant pathway fit in under a minute',
    description:
      'Profile-based match across study, Ausbildung and visit routes with a visa-file score — an in-principle counselling assessment, not a university offer.',
    kind: 'match',
    badge: 'Instant',
    featured: true,
    advanced: true,
  },
  {
    slug: 'course-finder',
    href: '/course-finder/',
    title: 'Course & pathway finder',
    short: 'Search and shortlist programmes by visa reality',
    description:
      'Filter 40+ representative programmes by country, field, budget, IELTS and German. Shortlist and compare with work-rights and post-study notes.',
    kind: 'search',
    badge: 'Search',
    featured: true,
    advanced: true,
  },
  {
    slug: 'scholarships',
    href: '/scholarships/',
    title: 'Scholarship finder',
    short: 'Government and university funding that Pakistanis actually use',
    description:
      'DAAD, Stipendium Hungaricum, Chevening, Erasmus Mundus, Türkiye Bursları and more — with official links and Pakistan-specific notes.',
    kind: 'money',
    badge: 'Funding',
    featured: true,
    advanced: true,
  },
  {
    slug: 'calculator',
    href: '/calculator/',
    title: 'Study cost calculator',
    short: 'Yearly tuition + living bands for 20 destinations',
    description: 'Low / typical / high yearly cost bands, then jump to the matching document checklist.',
    kind: 'money',
    badge: 'Budget',
  },
  {
    slug: 'compare',
    href: '/compare/',
    title: 'Country compare',
    short: 'Side-by-side cost, language, work rights',
    description: 'Compare two destinations on cost, IELTS, low-marks fit, timeline and post-study options.',
    kind: 'search',
    badge: 'Compare',
  },
  {
    slug: 'eligibility',
    href: '/eligibility/',
    title: 'Starting-point quiz',
    short: '60-second destination shortlist',
    description: 'Answer six questions and get a realistic first shortlist before a conversation.',
    kind: 'match',
    badge: '60 sec',
  },
  {
    slug: 'english',
    href: '/english/',
    title: 'English & German pathway',
    short: 'IELTS, MOI or Goethe — what you actually need',
    description:
      'Map your current score to destination rules, weeks of prep, and when MOI or German is the smarter route than sitting IELTS again.',
    kind: 'language',
    badge: 'Language',
    featured: true,
    advanced: true,
  },
  {
    slug: 'checklist',
    href: '/checklist/',
    title: 'Document checklist',
    short: 'Tick embassy-linked lists by country',
    description: 'Interactive tick list for 20 countries with official source links. Progress saves in your browser.',
    kind: 'docs',
    badge: 'Docs',
  },
  {
    slug: 'cv-builder',
    href: '/cv-builder/',
    title: 'CV builder',
    short: 'Europass-style CV for study and Ausbildung',
    description: 'Build a clean chronological CV in the browser. Sending it to our desk is optional.',
    kind: 'write',
    badge: 'CV',
  },
  {
    slug: 'sop-builder',
    href: '/sop-builder/',
    title: 'SOP studio',
    short: 'Structured statement of purpose draft',
    description:
      'Answer prompts and generate a study-purpose draft you can copy, edit, and send to SK for a human review.',
    kind: 'write',
    badge: 'SOP',
    featured: true,
    advanced: true,
  },
  {
    slug: 'interview',
    href: '/interview/',
    title: 'Visa interview coach',
    short: 'Mission-style questions with red-flag hints',
    description:
      'Practise study, visit and Ausbildung interview questions. Score your answers against common refusal patterns.',
    kind: 'coach',
    badge: 'Coach',
    featured: true,
    advanced: true,
  },
  {
    slug: 'tracker',
    href: '/tracker/',
    title: 'Application tracker',
    short: 'One file, from profile to pre-departure',
    description:
      'Create a private browser file and tick stages: profile, documents, offer, funds, appointment, decision, travel.',
    kind: 'track',
    badge: 'Track',
    featured: true,
    advanced: true,
  },
  {
    slug: 'pre-departure',
    href: '/pre-departure/',
    title: 'Pre-departure briefing',
    short: 'Packing, banking, insurance, arrival',
    description:
      'Country-specific tick list for blocked accounts, insurance, SIM, housing and first-week embassy rules.',
    kind: 'docs',
    badge: 'Travel',
    advanced: true,
  },
  {
    slug: 'official-links',
    href: '/official-links/',
    title: 'Official embassy links',
    short: 'Verify every rule at the source',
    description: 'Mission, VFS and government pages we use when we write checklists.',
    kind: 'docs',
    badge: 'Sources',
  },
];

export const FEATURED_TOOLS = SK_TOOLS.filter((t) => t.featured);
export const ADVANCED_TOOLS = SK_TOOLS.filter((t) => t.advanced);

export function toolWebAppSchema(tool: Pick<SkTool, 'title' | 'href' | 'description'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `SK Immigration ${tool.title}`,
    url: `https://immigration.salaroutsourcing.com${tool.href}`,
    applicationCategory: 'BusinessApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
    description: tool.description,
  };
}
