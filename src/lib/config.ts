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
    'SK Immigration — digital immigration and business services. We help people prepare strong visa files, understand international pathways, and register companies with honesty, clarity, and care — completely online. Authorities make the final decisions.',
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

/** Short header — service hubs live in the mega-menu and on /services/. */
export const NAVIGATION = [
  { label: 'Services', href: '/services/' },
  { label: 'How It Works', href: '/how-it-works/' },
  { label: 'Guides', href: '/guides/' },
  { label: 'About', href: '/about/' },
];

export const FOOTER_LINKS = {
  explore: [
    { label: 'Services', href: '/services/' },
    { label: 'Business Registration', href: '/business-registration/' },
    { label: 'How It Works', href: '/how-it-works/' },
    { label: 'About', href: '/about/' },
    { label: 'FAQ', href: '/faq/' },
    { label: 'Contact', href: '/contact/' },
  ],
  services: [
    { label: 'Study Visa', href: '/study-visa/' },
    { label: 'Germany Ausbildung & EU Opportunity Card', href: '/work-permit/' },
    { label: 'Visit & Tourist Visa', href: '/visit-visa/' },
    { label: 'Company Registration', href: '/business-registration/' },
    { label: 'Document Attestation', href: '/document-services/' },
    { label: 'Visa Appointments', href: '/visa-appointment/' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms', href: '/terms/' },
    { label: 'Disclaimer', href: '/disclaimer/' },
    { label: 'Contact', href: '/contact/' },
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
    title: 'Germany Ausbildung & Opportunity Card',
    badge: 'Guidance, not placement',
    image: '/assets/hubs/ausbildung-work.svg',
    alt: 'Germany Ausbildung vocational training guidance',
    description:
      'Pathway guidance, CV/document preparation and visa-file support for vocational training and European opportunity routes. We do not promise employment or placement.',
    tags: ['Ausbildung', 'Goethe B1/B2', 'Work Permit'],
    href: '/work-permit/',
  },
  {
    title: 'Saudi Visa Processing',
    badge: 'Sponsor-driven cases only',
    image: '/assets/hubs/saudi-visa.svg',
    alt: 'Saudi visa processing for sponsor-driven cases',
    description:
      'Document and processing support when a legitimate sponsor in Saudi Arabia has already initiated the visa process. We do not offer, arrange or sell jobs.',
    tags: ['Sponsor-driven', 'Enjaz', 'Musaned', 'BEOE'],
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
  {
    title: 'Company & Business Registration',
    badge: 'New · International',
    image: '/assets/hubs/company-registration.svg',
    alt: 'International company formation and documentation support',
    description:
      'Remote company formation and documentation support for entrepreneurs in the United States, United Kingdom, Canada, Australia, and selected European jurisdictions.',
    tags: ['Company Formation', 'Documentation', 'Expansion'],
    href: '/business-registration/',
  },
] as const;
