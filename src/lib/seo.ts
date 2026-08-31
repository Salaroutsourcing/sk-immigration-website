import { SITE, absoluteUrl } from './site';

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
  'Visa Appointment Pakistan',
  'Document Attestation MOFA Pakistan',
  'HEC Attestation',
  'Apostille Pakistan',
  'Study Abroad Pakistan',
  'Work Permit Pakistan',
];

const ARTICLE_SPEAKABLE = {
  '@type': 'SpeakableSpecification',
  cssSelector: ['.platform-hero h1', '.lede', '.article-body'],
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
      "Pakistan's trusted immigration consultancy — study visas, work permits, visit visas, Germany Ausbildung, Saudi Arabia work visa, document attestation, and visa appointments. SECP registered CUIN 0304985. No visa guarantees — honest guidance only.",
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
        areaServed: 'PK',
        availableLanguage: ['English', 'Urdu'],
        url: SITE.whatsappLink,
      },
    ],
    sameAs: [
      SITE.secpVerify,
      SITE.office.map,
      ...Object.values(SITE.social),
      absoluteUrl('/about/'),
      absoluteUrl('/llms.txt'),
    ],
    areaServed: [
      { '@type': 'City', name: 'Rawalpindi' },
      { '@type': 'City', name: 'Islamabad' },
      { '@type': 'City', name: 'Lahore' },
      { '@type': 'City', name: 'Karachi' },
      { '@type': 'Country', name: 'Pakistan' },
    ],
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
      'SECP-registered immigration consultancy in Rawalpindi. Study visas, work permits, Germany Ausbildung, Saudi work visa, document attestation.',
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
      { '@type': 'City', name: 'Rawalpindi' },
      { '@type': 'City', name: 'Islamabad' },
      { '@type': 'City', name: 'Lahore' },
      { '@type': 'City', name: 'Karachi' },
      { '@type': 'Country', name: 'Pakistan' },
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
