/**
 * Shared SEO helpers — Organization + LocalBusiness JSON-LD + meta defaults
 * Call SalarSEO.inject() on each page (layout does this automatically).
 */
(function () {
  const ORG = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService', 'LocalBusiness'],
        '@id': 'https://www.salaroutsourcing.com/#organization',
        name: 'SK Immigration Services',
        alternateName: ['SK Immigration', 'SK Immigration by Salar Outsourcing'],
        url: 'https://www.salaroutsourcing.com',
        logo: 'https://www.salaroutsourcing.com/assets/img/logo.svg',
        image: 'https://www.salaroutsourcing.com/assets/img/hero-graduation.jpg',
        description:
          'SK Immigration Services helps students and professionals worldwide with student visas, Schengen work permits, Germany Ausbildung, visit visas, document attestation and job placements. A division of Salar Outsourcing. Free consultation. No visa guarantees.',
        email: 'Services@salaroutsourcing.com',
        telephone: '+923045999859',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Office No. 10, Alfazal Plaza 64C, Satellite Town',
          addressLocality: 'Rawalpindi',
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
          name: 'Worldwide',
        },
        sameAs: [
          'https://www.instagram.com/skimmigrationonservices/',
          'https://www.tiktok.com/@skimmigrationservices',
          'https://www.facebook.com/skimmigrationservice',
          'https://www.linkedin.com/company/sk-immigration-service/',
          'https://www.youtube.com/@SKImmigrationtips',
        ],
        parentOrganization: {
          '@type': 'Organization',
          name: 'Salar Outsourcing',
          url: 'https://www.salaroutsourcing.com',
        },
        knowsAbout: [
          'Student visa',
          'Germany Ausbildung',
          'Schengen work permit',
          'Visit visa',
          'Document attestation',
          'Study abroad without IELTS',
          'Low marks student visa Europe',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+923045999859',
          contactType: 'customer service',
          availableLanguage: ['English', 'Urdu'],
          areaServed: 'Worldwide',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.salaroutsourcing.com/#website',
        url: 'https://www.salaroutsourcing.com',
        name: 'SK Immigration Services',
        publisher: { '@id': 'https://www.salaroutsourcing.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.salaroutsourcing.com/blog.html?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  function inject() {
    if (document.getElementById('sk-org-schema')) return;
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'sk-org-schema';
    s.textContent = JSON.stringify(ORG);
    document.head.appendChild(s);

    /* AI-friendly meta if missing */
    if (!document.querySelector('meta[name="author"]')) {
      const m = document.createElement('meta');
      m.name = 'author';
      m.content = 'SK Immigration Services';
      document.head.appendChild(m);
    }
  }

  window.SalarSEO = { inject, ORG };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
