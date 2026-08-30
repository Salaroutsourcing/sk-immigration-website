/**
 * Template-facing site config. Identity lives in site.ts — this file
 * shapes navigation, footer, and AstroWind-style imports.
 */
import { SITE as CORE } from './site';

export const SITE = {
  name: CORE.brandFull,
  legalName: CORE.legalName,
  tagline: CORE.tagline,
  description:
    "SK Immigration Services (SK Consultant) — Pakistan's trusted SECP-registered immigration consultancy for study visas, work permits, visit visas, Germany Ausbildung, Saudi Arabia work visa, and document attestation. Free consultation. CUIN 0304985.",
  url: CORE.url,
  ogImage: CORE.defaultOg,
  logo: CORE.logo,
};

export const CONTACT = {
  phone: CORE.phoneE164,
  phoneFormatted: CORE.phone,
  email: CORE.email,
  whatsappLink: CORE.whatsappLink,
  whatsappB2BLink: CORE.whatsappLink.replace(
    'I%20need%20guidance.',
    'we%20want%20to%20hire%20manpower%20from%20Pakistan.',
  ),
  address: {
    street: CORE.office.street,
    city: CORE.office.city,
    region: CORE.office.region,
    postalCode: CORE.office.postalCode,
    country: CORE.office.country,
    full: `${CORE.office.street}, ${CORE.office.city}, ${CORE.office.region}, Pakistan`,
  },
  geo: CORE.geo,
  hours: CORE.office.hours,
};

export const BUSINESS = {
  cuin: CORE.cuin,
  secpVerifyUrl: CORE.secpVerify,
  googleMapsUrl: CORE.office.map,
  googleReviewsUrl: CORE.office.map,
  googleKgUrl: 'https://www.google.com/search?kgmid=/g/11zfnqjfgx',
};

export const SOCIAL = CORE.social;

export const ANALYTICS = {
  gtmId: CORE.analytics.gtm,
  ga4Id: CORE.analytics.ga,
  adsenseId: CORE.analytics.adsense,
  clarityId: CORE.analytics.clarity,
};

/** Short header — service hubs live on the homepage as cards. */
export const NAVIGATION = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Guides', href: '/guides/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const FOOTER_LINKS = {
  services: [
    { label: 'Study Visa', href: '/study-visa/' },
    { label: 'Work Permit & Ausbildung', href: '/work-permit/' },
    { label: 'Saudi Work Visa', href: '/saudi-visa/saudi-visa-processing-pakistan/' },
    { label: 'Visit & Tourist Visa', href: '/visit-visa/' },
    { label: 'Document Attestation', href: '/document-services/' },
    { label: 'Visa Appointments', href: '/visa-appointment/' },
  ],
  resources: [
    { label: 'Country Guides', href: '/guides/' },
    { label: 'Blog & Insights', href: '/blog/' },
    { label: 'Newsroom', href: '/news/' },
    { label: 'About SK Immigration', href: '/about/' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms of Service', href: '/terms/' },
    { label: 'Contact Us', href: '/contact/' },
  ],
};

export const SERVICE_HUBS = [
  {
    title: 'Study Visa & Global Admissions',
    badge: 'Higher Education',
    image: '/assets/hubs/study-visa.svg',
    alt: 'Study visa admissions for Germany, UK, Canada, Italy, and Europe',
    description:
      'University shortlisting, SOP support, and visa file preparation for Germany, UK, Canada, Italy, Australia, and 15+ destinations.',
    tags: ['Germany', 'UK CAS', 'Canada SDS', 'Italy DSU'],
    href: '/study-visa/',
  },
  {
    title: 'Germany Ausbildung & Work Permits',
    badge: 'Paid Vocational Training',
    image: '/assets/hubs/ausbildung-work.svg',
    alt: 'Germany Ausbildung vocational training and work permits',
    description:
      'Paid dual vocational training (€600–€1,200/mo) in nursing, IT, and trades, plus EU Opportunity Card (Chancenkarte) guidance.',
    tags: ['Ausbildung', 'Goethe B1/B2', 'Work Permit'],
    href: '/work-permit/',
  },
  {
    title: 'Saudi Arabia Work Visa Processing',
    badge: 'Fixed Fee: PKR 15,000',
    image: '/assets/hubs/saudi-visa.svg',
    alt: 'Saudi Arabia work visa processing at a fixed fee',
    description:
      'GAMCA medical, Enjaz, visa stamping, Musaned, and BEOE Protector — one written fee, no hidden processing charges.',
    tags: ['Fixed PKR 15k', 'Enjaz', 'Musaned', 'BEOE'],
    href: '/saudi-visa/saudi-visa-processing-pakistan/',
  },
  {
    title: 'Visit & Tourist Visas',
    badge: 'Tourism & Business',
    image: '/assets/hubs/appointments.svg',
    alt: 'Visit and tourist visas for UK, USA, Schengen, and Dubai',
    description:
      'UK Standard Visitor, US B1/B2, Schengen, Dubai, and Malaysia files with ties-to-home and financial documentation.',
    tags: ['UK Visit', 'Schengen', 'Dubai', 'USA B1/B2'],
    href: '/visit-visa/',
  },
  {
    title: 'Document Attestation & Legalization',
    badge: 'MOFA · HEC · Apostille',
    image: '/assets/hubs/attestation-legal.svg',
    alt: 'Document attestation, MOFA, Apostille, Musadaqa, and QVP',
    description:
      'MOFA attestation, HEC degree verification, Apostille, Musadaqa, and QVP equivalence for study and work files.',
    tags: ['MOFA', 'Musadaqa', 'Apostille', 'IBCC / QVP'],
    href: '/document-services/',
  },
  {
    title: 'Visa Appointments Desk',
    badge: 'Embassy & Facilitator Support',
    image: '/assets/hubs/guides-insights.svg',
    alt: 'Visa appointment booking and interview coaching',
    description:
      'Slot monitoring for VFS Global, Gerry’s FMC, TLScontact, BLS, and embassy portals, plus mock interview prep.',
    tags: ['VFS Global', 'Gerry’s FMC', 'TLS', 'Mock Interview'],
    href: '/visa-appointment/',
  },
] as const;
