/**
 * Shared SEO helpers — Organization + LocalBusiness JSON-LD + breadcrumbs
 * Call SalarSEO.inject() on each page (layout does this automatically).
 */
(function () {
  const SITE = 'https://www.salaroutsourcing.com';

  const ORG = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService', 'LocalBusiness'],
        '@id': SITE + '/#organization',
        name: 'SK Immigration Services',
        alternateName: ['SK Immigration', 'SK Immigration by Salar Outsourcing'],
        url: SITE,
        logo: SITE + '/assets/img/logo.svg',
        image: SITE + '/assets/img/hero-library.jpg',
        description:
          "Pakistan's trusted study visa and immigration partner. SECP-registered. OEP partner licence NO/1061. Student visas, work permits, visit visas, complete Saudi work visa processing (E-Number + Protector + visa), document attestation and manpower recruitment. Division of Salar Outsourcing. Free consultation. No visa guarantees.",
        email: 'Services@salaroutsourcing.com',
        telephone: '+923045999859',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Office No. 10, Alfazal Plaza 64C, Satellite Town',
          addressLocality: 'Rawalpindi',
          addressRegion: 'Punjab',
          addressCountry: 'PK',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 33.6261,
          longitude: 73.0713,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '19:00',
        },
        areaServed: {
          '@type': 'Place',
          name: 'Pakistan and Worldwide',
        },
        sameAs: [
          'https://www.instagram.com/skimmigrationonservices/',
          'https://www.tiktok.com/@skimmigrationservices/',
          'https://www.facebook.com/skimmigrationservice',
          'https://www.linkedin.com/company/sk-immigration-service/',
          'https://www.youtube.com/@SKImmigrationtips',
          'https://share.google/hQzlV2rZbYtUzYZ9n',
        ],
        parentOrganization: {
          '@type': 'Organization',
          name: 'Salar Outsourcing',
          url: SITE,
        },
        knowsAbout: [
          'Study visa Pakistan',
          'Germany study visa Pakistan',
          'Italy study visa Pakistan',
          'France study visa Pakistan',
          'UK study visa Pakistan',
          'Canada study visa Pakistan',
          'Australia study visa Pakistan',
          'USA study visa Pakistan',
          'Cyprus study visa Pakistan',
          'Work permit Pakistan',
          'Germany work permit Pakistan',
          'Visit visa Pakistan',
          'UK visit visa Pakistan',
          'USA B1 B2 visa Pakistan',
          'Schengen visit visa Pakistan',
          'Canada visit visa Pakistan',
          'Dubai visit visa Pakistan',
          'Schengen visa appointment Pakistan',
          'Visa appointment assistance',
          'Saudi work visa processing Pakistan',
          'Complete Saudi visa processing E-Number Protector',
          'Work visa Pakistan',
          'Document attestation',
          'Musadaqa verification',
          'QVP verification',
          'Apostille Pakistan',
          'MOFA attestation',
          'Saudi Embassy attestation',
          'Hire workers from Pakistan',
          'Manpower recruitment agency Pakistan',
          'Germany Ausbildung',
          'Schengen work permit',
          'SECP registered immigration consultant Pakistan',
          'OEP partner licence NO/1061',
        ],
        identifier: [
          { '@type': 'PropertyValue', name: 'OEP partner licence', value: 'NO/1061' },
          { '@type': 'PropertyValue', name: 'Registration', value: 'SECP — Securities and Exchange Commission of Pakistan' },
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+923045999859',
          contactType: 'customer service',
          availableLanguage: ['English', 'Urdu'],
          areaServed: 'PK',
        },
      },
      {
        '@type': 'WebSite',
        '@id': SITE + '/#website',
        url: SITE,
        name: 'SK Immigration Services',
        publisher: { '@id': SITE + '/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: SITE + '/blog.html?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  function breadcrumbSchema(items) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : SITE + item.url,
      })),
    };
  }

  function faqSchema(faqs) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
  }

  function serviceSchema({ name, description, url, price }) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name,
      description,
      provider: { '@id': SITE + '/#organization' },
      areaServed: 'PK',
      url: url.startsWith('http') ? url : SITE + url,
    };
    if (price) {
      schema.offers = {
        '@type': 'Offer',
        priceCurrency: 'PKR',
        price: String(price).replace(/[^\d]/g, ''),
        availability: 'https://schema.org/InStock',
      };
    }
    return schema;
  }

  function injectJsonLd(id, data) {
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = id;
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  function inject() {
    injectJsonLd('sk-org-schema', ORG);

    if (!document.querySelector('meta[name="author"]')) {
      const m = document.createElement('meta');
      m.name = 'author';
      m.content = 'SK Immigration Services';
      document.head.appendChild(m);
    }

    /* Auto-breadcrumb from data-breadcrumbs JSON on <body> */
    const raw = document.body?.dataset?.breadcrumbs;
    if (raw) {
      try {
        const items = JSON.parse(raw);
        if (Array.isArray(items) && items.length) {
          injectJsonLd('sk-breadcrumb-schema', breadcrumbSchema(items));
        }
      } catch {
        /* ignore malformed breadcrumbs */
      }
    }
  }

  window.SalarSEO = {
    inject,
    ORG,
    SITE,
    breadcrumbSchema,
    faqSchema,
    serviceSchema,
    injectJsonLd,
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
