import { SITE, absoluteUrl } from './site';

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService', 'LocalBusiness'],
    '@id': `${SITE.url}/#organization`,
    name: SITE.brandFull,
    alternateName: [...SITE.brandAliases],
    legalName: SITE.legalName,
    url: `${SITE.url}/`,
    logo: absoluteUrl(SITE.logo),
    image: [absoluteUrl(SITE.defaultOg), absoluteUrl(SITE.logo)],
    email: SITE.email,
    telephone: SITE.phone,
    identifier: {
      '@type': 'PropertyValue',
      name: 'SECP CUIN',
      value: SITE.cuin,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.office.street,
      addressLocality: SITE.office.city,
      postalCode: SITE.office.postalCode,
      addressRegion: SITE.office.region,
      addressCountry: SITE.office.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.6261,
      longitude: 73.0714,
    },
    openingHours: 'Mo-Sa 10:00-19:00',
    sameAs: Object.values(SITE.social),
    areaServed: 'PK',
    priceRange: 'PKR',
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
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    image: absoluteUrl(opts.image || SITE.defaultOg),
    keywords: opts.keywords?.join(', '),
    inLanguage: 'en',
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    isAccessibleForFree: true,
  };
}

export function blogPostingSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
  keywords?: string[];
  faqs?: { question: string; answer: string }[];
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
    keywords: opts.keywords?.join(', '),
    inLanguage: 'en',
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    isAccessibleForFree: true,
  };

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
}): JsonLd {
  return {
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
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    isAccessibleForFree: true,
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
