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
        legalName: 'SK Immigration Services (SMC-Private) Limited',
        alternateName: [
          'SK Immigration',
          'SK Consultant',
          'SK Immigration Consultant',
          'SK Visa Consultant',
          'SK Study Visa Consultant',
          'SK Work Permit Consultant',
          'SK Immigration Services SMC',
          'SK Immigration Rawalpindi',
          'SK Consultant Rawalpindi',
          'SK Immigration Satellite Town',
        ],
        url: SITE,
        logo: SITE + '/assets/img/logo.svg',
        image: [SITE + '/assets/img/hero-consult.jpg', SITE + '/assets/img/hero-library.jpg'],
        description:
          "SK Immigration Services (SK Consultant) — Pakistan study visa, work permit, visit visa, Saudi work visa processing and document attestation consultant in Satellite Town, Rawalpindi. Free consultation. Official WhatsApp +92 304 5999859. No visa guarantees.",
        email: 'Services@salaroutsourcing.com',
        telephone: '+923045999859',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Office No. 10, Alfazal Plaza 64C, Satellite Town',
          addressLocality: 'Rawalpindi',
          addressRegion: 'Punjab',
          postalCode: '46000',
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
        areaServed: [
          { '@type': 'Country', name: 'Pakistan' },
          { '@type': 'City', name: 'Rawalpindi' },
          { '@type': 'City', name: 'Islamabad' },
          { '@type': 'City', name: 'Lahore' },
          { '@type': 'City', name: 'Karachi' },
        ],
        sameAs: [
          'https://www.instagram.com/skimmigrationonservices/',
          'https://www.tiktok.com/@skimmigrationservices/',
          'https://www.facebook.com/skimmigrationservice',
          'https://www.linkedin.com/company/sk-immigration-service/',
          'https://www.youtube.com/@SKImmigrationtips',
          'https://share.google/hQzlV2rZbYtUzYZ9n',
          'https://leap.secp.gov.pk/#/verify-company-info/0304985',
          SITE + '/trust.html',
          SITE + '/about.html',
          SITE + '/answers/sk-consultant',
          SITE + '/answers/who-is-sk-immigration',
          SITE + '/llms.txt',
        ],
        hasMap:
          'https://www.google.com/maps/search/?api=1&query=SK+Immigration+Services+Alfazal+Plaza+Satellite+Town+Rawalpindi',
        identifier: [
          { '@type': 'PropertyValue', name: 'SECP CUIN', value: '0304985' },
          { '@type': 'PropertyValue', name: 'OEP partner licence', value: 'NO/1061' },
        ],
        knowsAbout: [
          'SK Consultant',
          'SK Immigration Consultant',
          'Study visa consultant Pakistan',
          'Study visa consultant Rawalpindi',
          'Work permit consultant Pakistan',
          'Visit visa consultant Pakistan',
          'Study visa Pakistan',
          'Germany study visa Pakistan',
          'Italy study visa Pakistan',
          'France study visa Pakistan',
          'UK study visa Pakistan',
          'Canada study visa Pakistan',
          'Australia study visa Pakistan',
          'USA study visa Pakistan',
          'Hungary study visa Pakistan',
          'Poland study visa Pakistan',
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
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+923045999859',
            contactType: 'customer service',
            availableLanguage: ['English', 'Urdu'],
            areaServed: 'PK',
            url: SITE + '/contact.html',
          },
          {
            '@type': 'ContactPoint',
            telephone: '+923045999859',
            contactType: 'sales',
            availableLanguage: ['English', 'Urdu'],
            areaServed: 'PK',
            name: 'WhatsApp consult desk',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': SITE + '/#website',
        url: SITE,
        name: 'SK Immigration Services',
        alternateName: ['SK Consultant', 'SK Immigration', 'salaroutsourcing.com'],
        publisher: { '@id': SITE + '/#organization' },
        inLanguage: ['en', 'ur'],
        potentialAction: {
          '@type': 'SearchAction',
          target: SITE + '/answers?q={search_term_string}',
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

    if (!document.querySelector('meta[property="og:image"]')) {
      const og = document.createElement('meta');
      og.setAttribute('property', 'og:image');
      og.content = SITE + '/assets/img/hero-library.jpg';
      document.head.appendChild(og);
    }
    if (!document.querySelector('meta[property="og:site_name"]')) {
      const sn = document.createElement('meta');
      sn.setAttribute('property', 'og:site_name');
      sn.content = 'SK Immigration Services';
      document.head.appendChild(sn);
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
