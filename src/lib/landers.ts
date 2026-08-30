import { getCollection, type CollectionEntry } from 'astro:content';

export type LanderEntry = CollectionEntry<'landers'>;

export const HUB_META: Record<
  string,
  { title: string; description: string; kicker: string }
> = {
  'study-visa': {
    kicker: 'Study visa',
    title: 'Study Visa Pakistan',
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
    kicker: 'Work permit',
    title: 'Work Permit & Ausbildung Pakistan',
    description:
      'Germany Ausbildung, EU work permits, and skilled-worker pathways from Pakistan. Honest eligibility, language, and document guidance.',
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
    kicker: 'Saudi work visa',
    title: 'Saudi Arabia Work Visa Pakistan',
    description:
      'Saudi work visa processing at a fixed consultancy fee of PKR 15,000 — medical, Enjaz, Musaned, and BEOE protector. Authority fees are separate.',
  },
  local: {
    kicker: 'Local offices',
    title: 'Study Visa Consultants — Pakistan Cities',
    description:
      'SK Immigration Services serves Rawalpindi, Islamabad, Lahore, and Karachi from our Satellite Town walk-in office.',
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
