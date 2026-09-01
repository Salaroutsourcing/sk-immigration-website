import { SITE } from './site';

export type RegionalKind = 'head-office' | 'appointment-office';

export type RegionalMarket = {
  id: string;
  country: string;
  city: string;
  countryCode: string;
  href: string;
  kind: RegionalKind;
  street?: string;
  hours?: string;
  map?: string;
  audience: string;
  blurb: string;
};

/**
 * Digital-first brand with regional walk-in desks.
 * Only Rawalpindi has a public street address until other offices publish NAP
 * that matches Google Business Profile — city-level presence is still honest.
 */
export const REGIONAL_MARKETS: RegionalMarket[] = [
  {
    id: 'pakistan',
    country: 'Pakistan',
    city: 'Rawalpindi',
    countryCode: 'PK',
    href: '/local/rawalpindi-study-visa-consultant/',
    kind: 'head-office',
    street: SITE.office.street,
    hours: SITE.office.hours,
    map: SITE.office.map,
    audience: 'Applicants across Pakistan, plus walk-ins in Satellite Town.',
    blurb: 'Head office. Same digital file process as every other market.',
  },
  {
    id: 'uae',
    country: 'United Arab Emirates',
    city: 'Dubai',
    countryCode: 'AE',
    href: '/local/dubai-immigration-consultant/',
    kind: 'appointment-office',
    audience: 'Residents and visitors in Dubai and the wider UAE.',
    blurb: 'Digital desk first. Meet in Dubai by appointment when you want a face-to-face review.',
  },
  {
    id: 'saudi',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    countryCode: 'SA',
    href: '/local/saudi-arabia-immigration-consultant/',
    kind: 'appointment-office',
    audience: 'Residents in Saudi Arabia who need documentation — not job selling.',
    blurb: 'Digital processing with a Saudi meeting option. Sponsor-driven work cases only.',
  },
  {
    id: 'nepal',
    country: 'Nepal',
    city: 'Kathmandu',
    countryCode: 'NP',
    href: '/local/nepal-study-visa-consultant/',
    kind: 'appointment-office',
    audience: 'Students and families in Nepal preparing Europe, UK, Canada and Gulf files.',
    blurb: 'Digital file prep for Nepali applicants, with a Kathmandu appointment desk.',
  },
  {
    id: 'bangladesh',
    country: 'Bangladesh',
    city: 'Dhaka',
    countryCode: 'BD',
    href: '/local/bangladesh-study-visa-consultant/',
    kind: 'appointment-office',
    audience: 'Students and families in Bangladesh preparing study, visit and attestation files.',
    blurb: 'Digital file prep for Bangladeshi applicants, with a Dhaka appointment desk.',
  },
];

export const DIGITAL_POSITIONING =
  'SK Immigration is a digital immigration desk. Files move online with a written scope. Offices in Pakistan, Saudi Arabia, the UAE, Nepal and Bangladesh are for people who want a meeting — not a different product.';
