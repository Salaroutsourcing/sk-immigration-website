import { SITE, absoluteUrl } from './site';
import { REGIONAL_MARKETS } from './regions';

type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;
const LOCAL_ID = `${SITE.url}/#localbusiness`;

const KNOWS_ABOUT = [
  'Student Visa Pakistan',
  'Study Visa Germany Pakistan',
  'Study Visa UK Pakistan',
  'Study Visa Canada Pakistan',
  'Germany Ausbildung Pakistan',
  'Saudi Arabia Work Visa Pakistan',
  'Schengen Study Visa Pakistan',
  'Immigration Consultant Rawalpindi',
  'Immigration Consultant Dubai',
  'Immigration Consultant Saudi Arabia',
  'Study Visa Consultant Nepal',
  'Study Visa Consultant Bangladesh',
  'Digital immigration services',
  'Visa Appointment Pakistan',
  'Document Attestation MOFA Pakistan',
  'HEC Attestation',
  'Apostille Pakistan',
  'Study Abroad Pakistan',
  'Work Permit Pakistan',
];

const ARTICLE_SPEAKABLE = {
  '@type': 'SpeakableSpecification',
  cssSelector: ['.platform-hero h1', '.lede', '.article-body', '.article-prose'],
};

function postalAddress(): JsonLd {
  return {
    '@type': 'PostalAddress',
    streetAddress: SITE.office.street,
    addressLocality: SITE.office.city,
    postalCode: SITE.office.postalCode,
    addressRegion: SITE.office.region,
    addressCountry: SITE.office.country,
  };
}

function geoCoordinates(): JsonLd {
  return {
    '@type': 'GeoCoordinates',
    latitude: SITE.geo.latitude,
    longitude: SITE.geo.longitude,
  };
}

function logoObject(): JsonLd {
  return {
    '@type': 'ImageObject',
    url: absoluteUrl(SITE.logo),
    width: 200,
    height: 60,
  };
}

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService', 'LocalBusiness', 'LegalService'],
    '@id': ORG_ID,
    name: SITE.brandFull,
    alternateName: [...SITE.brandAliases],
    legalName: SITE.legalName,
    description:
      'Digital immigration and business-services desk with offices in Pakistan, Saudi Arabia, the UAE, Nepal and Bangladesh. Study visas, work-permit guidance, visit visas, Ausbildung, attestation and company documentation. SECP CUIN 0304985. No visa guarantees — authorities decide.',
    slogan: SITE.tagline,
    url: `${SITE.url}/`,
    logo: logoObject(),
    image: [absoluteUrl(SITE.defaultOg), absoluteUrl(SITE.logo)],
    email: SITE.email,
    telephone: SITE.phoneE164,
    foundingDate: SITE.foundingDate,
    identifier: {
      '@type': 'PropertyValue',
      name: 'SECP CUIN',
      value: SITE.cuin,
    },
    address: postalAddress(),
    geo: geoCoordinates(),
    hasMap: SITE.office.map,
    openingHours: 'Mo-Sa 10:00-19:00',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.phoneE164,
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Urdu'],
        url: SITE.whatsappLink,
      },
      ...REGIONAL_MARKETS.map((market) => ({
        '@type': 'ContactPoint',
        telephone: SITE.phoneE164,
        contactType: 'customer service',
        areaServed: market.countryCode,
        availableLanguage: ['English', 'Urdu'],
        url: SITE.whatsappLink,
      })),
    ],
    sameAs: [
      SITE.secpVerify,
      SITE.office.map,
      ...Object.values(SITE.social),
      absoluteUrl('/about/'),
      absoluteUrl('/llms.txt'),
    ],
    areaServed: [
      { '@type': 'Country', name: 'Pakistan' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Nepal' },
      { '@type': 'Country', name: 'Bangladesh' },
      { '@type': 'City', name: 'Rawalpindi' },
      { '@type': 'City', name: 'Islamabad' },
      { '@type': 'City', name: 'Lahore' },
      { '@type': 'City', name: 'Karachi' },
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'City', name: 'Riyadh' },
      { '@type': 'City', name: 'Kathmandu' },
      { '@type': 'City', name: 'Dhaka' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    department: REGIONAL_MARKETS.map((market) => ({
      '@type': market.kind === 'head-office' ? 'LocalBusiness' : 'Place',
      '@id': `${SITE.url}/#office-${market.id}`,
      name: `${SITE.brandFull} — ${market.city}`,
      url: absoluteUrl(market.href),
      address: {
        '@type': 'PostalAddress',
        ...(market.street ? { streetAddress: market.street } : {}),
        addressLocality: market.city,
        addressCountry: market.countryCode,
      },
    })),
    knowsAbout: KNOWS_ABOUT,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'SK Immigration Services — Service Packages',
      url: absoluteUrl('/pricing.html'),
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Study Visa File Preparation',
          url: absoluteUrl('/study-visa/'),
        },
        {
          '@type': 'Offer',
          name: 'Germany Ausbildung Application',
          url: absoluteUrl('/guides/germany-student-visa-ausbildung/'),
        },
        {
          '@type': 'Offer',
          name: 'Saudi Arabia Complete Work Visa Processing',
          url: absoluteUrl('/saudi-visa/saudi-visa-processing-pakistan/'),
        },
        {
          '@type': 'Offer',
          name: 'Document Attestation (MOFA/HEC/Apostille)',
          url: absoluteUrl('/document-services/'),
        },
        {
          '@type': 'Offer',
          name: 'Visa Appointment Booking',
          url: absoluteUrl('/visa-appointment/'),
        },
        {
          '@type': 'Offer',
          name: 'Company & Business Registration',
          url: absoluteUrl('/business-registration/'),
        },
      ],
    },
    priceRange: 'PKR',
    currenciesAccepted: 'PKR',
  };
}

export function localBusinessSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'LegalService'],
    '@id': LOCAL_ID,
    name: SITE.brandFull,
    alternateName: 'SK Consultant',
    description:
      'SECP-registered digital immigration desk. Head office in Rawalpindi, Pakistan, with appointment offices in Saudi Arabia, the UAE, Nepal and Bangladesh.',
    url: `${SITE.url}/`,
    telephone: SITE.phoneE164,
    email: SITE.email,
    address: postalAddress(),
    geo: geoCoordinates(),
    image: absoluteUrl(SITE.logo),
    priceRange: 'PKR',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash, Bank Transfer',
    openingHours: 'Mo-Sa 10:00-19:00',
    hasMap: SITE.office.map,
    parentOrganization: { '@id': ORG_ID },
    areaServed: [
      { '@type': 'Country', name: 'Pakistan' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Nepal' },
      { '@type': 'Country', name: 'Bangladesh' },
      { '@type': 'City', name: 'Rawalpindi' },
    ],
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.brandFull,
    alternateName: 'SK Consultant',
    url: `${SITE.url}/`,
    description:
      "Pakistan's trusted study visa, work permit, and immigration consultancy — SECP registered CUIN 0304985",
    publisher: { '@id': ORG_ID },
    inLanguage: ['en', 'ur'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/faq?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Homepage schema: global digital positioning, no city or office claims. */
export function digitalOrganizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${SITE.url}/#digital-organization`,
    name: 'SK Immigration',
    alternateName: ['SK Immigration Services', 'SK Consultant'],
    legalName: SITE.legalName,
    description:
      'Digital immigration and business services. One online desk for study visas, visit files, Ausbildung guidance, attestation and company documentation — with appointment offices in Pakistan, Saudi Arabia, the UAE, Nepal and Bangladesh. Authorities make the final decisions.',
    slogan: SITE.tagline,
    url: `${SITE.url}/`,
    logo: logoObject(),
    image: [absoluteUrl(SITE.defaultOg), absoluteUrl(SITE.logo)],
    email: SITE.email,
    telephone: SITE.phoneE164,
    areaServed: [
      { '@type': 'Country', name: 'Pakistan' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Nepal' },
      { '@type': 'Country', name: 'Bangladesh' },
      { '@type': 'AdministrativeArea', name: 'Gulf' },
      { '@type': 'AdministrativeArea', name: 'South Asia' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    knowsAbout: [
      'Study visa file preparation',
      'University admissions guidance',
      'Visit and tourist visa preparation',
      'Germany Ausbildung guidance',
      'EU Opportunity Card guidance',
      'Document attestation and legalization',
      'International company registration',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.phoneE164,
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Urdu'],
        url: SITE.whatsappLink,
      },
    ],
    sameAs: Object.values(SITE.social),
  };
}

export function digitalWebsiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website-digital`,
    name: 'SK Immigration',
    url: `${SITE.url}/`,
    description:
      'Digital immigration and business services — visa preparation, education pathways, and company registration, delivered online.',
    publisher: { '@id': `${SITE.url}/#digital-organization` },
    inLanguage: 'en',
  };
}

export function newsArticleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
  keywords?: string[];
  dateline?: string;
  articleSection?: string;
  sources?: { name: string; url: string }[];
  relatedBlog?: string;
}): JsonLd {
  const article: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    image: absoluteUrl(opts.image || SITE.defaultOg),
    thumbnailUrl: absoluteUrl(opts.image || SITE.defaultOg),
    keywords: opts.keywords?.join(', '),
    inLanguage: 'en',
    dateline: opts.dateline,
    articleSection: opts.articleSection,
    speakable: ARTICLE_SPEAKABLE,
    isAccessibleForFree: true,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    copyrightHolder: { '@id': ORG_ID },
  };

  if (opts.sources?.length) {
    article.citation = opts.sources.map((source) => ({
      '@type': 'CreativeWork',
      name: source.name,
      url: source.url,
    }));
    article.isBasedOn = opts.sources[0]?.url;
  }
  if (opts.relatedBlog) {
    article.mentions = {
      '@type': 'BlogPosting',
      url: absoluteUrl(`/blog/${opts.relatedBlog}/`),
    };
  }
  return article;
}

export function blogPostingSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
  keywords?: string[];
  articleSection?: string;
  faqs?: { question: string; answer: string }[];
  relatedStories?: string[];
  relatedService?: string;
}): JsonLd[] {
  const article: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    image: absoluteUrl(opts.image || SITE.defaultOg),
    thumbnailUrl: absoluteUrl(opts.image || SITE.defaultOg),
    keywords: opts.keywords?.join(', '),
    articleSection: opts.articleSection,
    inLanguage: 'en',
    speakable: ARTICLE_SPEAKABLE,
    isAccessibleForFree: true,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    copyrightHolder: { '@id': ORG_ID },
  };

  if (opts.relatedService) {
    article.about = { '@type': 'Service', url: absoluteUrl(opts.relatedService) };
  }
  if (opts.relatedStories?.length) {
    article.mentions = opts.relatedStories.map((slug) => ({
      '@type': 'Article',
      url: absoluteUrl(`/stories/${slug}/amp/`),
    }));
  }

  const graph: JsonLd[] = [article];
  if (opts.faqs?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: opts.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }
  return graph;
}

/** JSON-LD for AMP Web Stories. Canonical `url` must be the AMP document. */
export function webStoryArticleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
  keywords?: string[];
  relatedBlog?: string;
}): JsonLd {
  const article: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    image: absoluteUrl(opts.image || SITE.defaultOg),
    keywords: opts.keywords?.join(', '),
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
  if (opts.relatedBlog) {
    article.mentions = {
      '@type': 'BlogPosting',
      url: absoluteUrl(`/blog/${opts.relatedBlog}/`),
    };
  }
  return article;
}

export function landerArticleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
}): JsonLd {
  const canonical = absoluteUrl(opts.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: canonical,
    mainEntityOfPage: canonical,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    image: absoluteUrl(opts.image || SITE.defaultOg),
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    speakable: ARTICLE_SPEAKABLE,
    about: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageSchema(opts: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string }[];
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    isPartOf: { '@id': WEBSITE_ID },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.platform-hero h1', '.lede'],
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url.startsWith('http') ? item.url : absoluteUrl(item.url),
      })),
    },
  };
}

export function basePageGraph(crumbs: { name: string; path: string }[]): JsonLd[] {
  return [organizationSchema(), localBusinessSchema(), websiteSchema(), breadcrumbSchema(crumbs)];
}
