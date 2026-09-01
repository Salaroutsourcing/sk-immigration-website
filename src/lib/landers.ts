import { getCollection, type CollectionEntry } from 'astro:content';

export type LanderEntry = CollectionEntry<'landers'>;

export const HUB_META: Record<
  string,
  { title: string; description: string; kicker: string }
> = {
  'study-visa': {
    kicker: 'Study visa Pakistan',
    title: 'Study Visa Pakistan — Germany, UK, Canada & Europe',
    description:
      'Country-by-country study visa guidance from Pakistan — Germany, UK, Canada, Italy, Hungary and more. Honest requirements, fees, and FAQs. Embassies decide visas.',
  },
  'visit-visa': {
    kicker: 'Visit visa',
    title: 'Visit & Tourist Visa Pakistan',
    description:
      'UK, USA, Schengen, Dubai, and Malaysia visit visa file preparation from Rawalpindi. Ties-to-home and financial documentation — no fake guarantees.',
  },
  'work-permit': {
    kicker: 'Work & training guidance',
    title: 'Germany Ausbildung & EU Opportunity Card',
    description:
      'Guidance for applicants exploring vocational training, the EU Opportunity Card and related documentation. We do not promise employment, placement or visa outcomes.',
  },
  'visa-appointment': {
    kicker: 'Appointments',
    title: 'Visa Appointments Pakistan',
    description:
      'VFS Global, Gerry’s FMC, TLScontact, BLS, and embassy appointment support from SK Immigration Services, Rawalpindi.',
  },
  'document-services': {
    kicker: 'Attestation',
    title: 'Document Attestation Pakistan',
    description:
      'MOFA, HEC, Apostille, Musadaqa, and QVP document attestation coordination from Rawalpindi.',
  },
  'saudi-visa': {
    kicker: 'Sponsor-driven cases only',
    title: 'Saudi Visa Processing',
    description:
      'We assist with Saudi visa processing only when a legitimate sponsor in Saudi Arabia has already initiated the process. We do not offer, arrange or sell jobs. Authority fees are separate.',
  },
  local: {
    kicker: 'Offices & cities',
    title: 'SK Immigration offices — Pakistan, UAE, Saudi, Nepal, Bangladesh',
    description:
      'Digital immigration desk with a Rawalpindi head office and appointment offices in Dubai, Saudi Arabia, Kathmandu and Dhaka. Same written fees. Embassies decide.',
  },
  answers: {
    kicker: 'Answers',
    title: 'Immigration Answers',
    description:
      'Short, citable answers on study visas, work permits, attestation, and SK Immigration trust facts for Pakistani applicants.',
  },
  'hire-workers-from-pakistan': {
    kicker: 'Employers',
    title: 'Hire Workers from Pakistan',
    description:
      'B2B manpower and hiring support from SK Immigration Services for overseas employers.',
  },
  'official-links': {
    kicker: 'Official sources',
    title: 'Official Embassy & Government Links',
    description:
      'Embassy, VFS, and government links we use when preparing files. Always verify requirements on official sites.',
  },
  guides: {
    kicker: 'Guides',
    title: 'Immigration Guides',
    description:
      'How-to guides for Pakistani applicants: without IELTS, low marks, Ausbildung, and Saudi E-Number.',
  },
};

export const LANDER_CLUSTERS = Object.keys(HUB_META);

/** Hubs rendered by src/pages/[hub] — not guides (markdown+JSON mix) or index-only pages. */
export const HUB_INDEX_CLUSTERS = [
  'study-visa',
  'visit-visa',
  'work-permit',
  'visa-appointment',
  'document-services',
  'saudi-visa',
  'local',
  'answers',
] as const;

export function landerPath(entry: LanderEntry): string {
  const { cluster, slug } = entry.data;
  if (cluster === 'guides') return `/guides/${slug}/`;
  if (slug === 'index' || slug === 'hub') return `/${cluster}/`;
  return `/${cluster}/${slug}/`;
}

export async function landersIn(cluster: string): Promise<LanderEntry[]> {
  const items = await getCollection('landers', (entry) => entry.data.cluster === cluster);
  return items.sort((a, b) => a.data.h1.localeCompare(b.data.h1));
}

export async function landerByPath(cluster: string, slug: string): Promise<LanderEntry | undefined> {
  const items = await landersIn(cluster);
  return items.find((entry) => entry.data.slug === slug);
}

export async function relatedLanders(entry: LanderEntry, limit = 3): Promise<LanderEntry[]> {
  const items = await landersIn(entry.data.cluster);
  return items
    .filter(
      (item) =>
        item.id !== entry.id &&
        item.data.slug !== 'index' &&
        item.data.slug !== 'hub' &&
        item.data.slug !== entry.data.slug,
    )
    .slice(0, limit);
}
