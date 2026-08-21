/**
 * Canonical site identity — keep in sync with public/assets/js/config.js
 * and llms.txt. This is the TypeScript source of truth for Astro pages.
 */
export const SITE = {
  brand: 'SK Immigration',
  brandFull: 'SK Immigration Services',
  legalName: 'SK Immigration Services (SMC-Private) Limited',
  cuin: '0304985',
  secpVerify: 'https://leap.secp.gov.pk/#/verify-company-info/0304985',
  brandAliases: [
    'SK Immigration',
    'SK Immigration Services',
    'SK Consultant',
    'SK Immigration Consultant',
    'SK Visa Consultant',
    'SK Study Visa Consultant',
    'SK Work Permit Consultant',
    'SK Immigration Rawalpindi',
    'SK Consultant Rawalpindi',
  ],
  tagline: "Pakistan's Trusted Study Visa & Immigration Partner",
  url: 'https://immigration.salaroutsourcing.com',
  email: 'Services@salaroutsourcing.com',
  phone: '+92 304 5999859',
  phoneE164: '+923045999859',
  whatsapp: '923045999859',
  whatsappLink:
    'https://wa.me/923045999859?text=Hi%20SK%20Immigration%2C%20I%20need%20guidance.',
  foundingDate: '2020',
  geo: {
    latitude: 33.6149,
    longitude: 73.0643,
  },
  office: {
    name: 'Rawalpindi Office',
    street: 'Office No. 10, Alfazal Plaza 64C, Satellite Town',
    city: 'Rawalpindi',
    postalCode: '46000',
    region: 'Punjab',
    country: 'PK',
    hours: 'Monday–Saturday, 10:00 AM – 7:00 PM (PKT, UTC+5)',
    map: 'https://share.google/hQzlV2rZbYtUzYZ9n',
  },
  social: {
    instagram: 'https://www.instagram.com/skimmigrationonservices/',
    tiktok: 'https://www.tiktok.com/@skimmigrationservices',
    facebook: 'https://www.facebook.com/skimmigrationservice',
    linkedin: 'https://www.linkedin.com/company/sk-immigration-service/',
    youtube: 'https://www.youtube.com/@SKImmigrationtips',
  },
  analytics: {
    gtm: 'GTM-NFWDQ5XB',
    ga: 'G-D0559366D6',
    adsense: 'ca-pub-5113459275916426',
    adsensePub: 'pub-5113459275916426',
    clarity: 'y3u0myqn1l',
  },
  defaultOg: '/assets/img/og-share.jpg',
  logo: '/assets/img/logo.jpg',
  locale: 'en_PK',
} as const;

export const CONTENT_PATHS = {
  news: '/news',
  blog: '/blog',
  stories: '/stories',
  studio: '/studio',
} as const;

export const NEWS_CATEGORIES = [
  'study-visa',
  'work-permit',
  'visit-visa',
  'saudi',
  'appointments',
  'policy',
  'documents',
] as const;

export const BLOG_CATEGORIES = [
  'country-guides',
  'how-to',
  'costs',
  'requirements',
  'ausbildung',
  'attestation',
  'comparisons',
] as const;

export const STORY_CATEGORIES = [
  'study-visa',
  'work-permit',
  'visit-visa',
  'tips',
  'faq',
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type StoryCategory = (typeof STORY_CATEGORIES)[number];

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}
