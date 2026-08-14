/**
 * SK Immigration Services — Global GEO & AI Structured Data
 * Legal: SK Immigration Services (SMC-Private) Limited (SECP CUIN 0304985)
 * Official domain: https://immigration.salaroutsourcing.com
 */
(function() {
  if (document.getElementById('sk-geo-schema')) return;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://immigration.salaroutsourcing.com/#organization",
        "name": "SK Immigration Services",
        "alternateName": [
          "SK Immigration",
          "SK Consultant",
          "SK Immigration Consultant",
          "SK Visa Consultant",
          "SK Study Visa Consultant",
          "SK Work Permit Consultant",
          "SK Immigration Rawalpindi",
          "SK Consultant Rawalpindi"
        ],
        "legalName": "SK Immigration Services (SMC-Private) Limited",
        "url": "https://immigration.salaroutsourcing.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://immigration.salaroutsourcing.com/assets/img/logo.svg",
          "caption": "SK Immigration Services Logo"
        },
        "image": "https://immigration.salaroutsourcing.com/assets/img/og-share.jpg",
        "description": "Pakistan's trusted immigration & study visa consultancy for Europe, UK, Canada, Australia, and Gulf work permits. SECP registered CUIN 0304985.",
        "email": "Services@salaroutsourcing.com",
        "telephone": "+923045999859",
        "sameAs": [
          "https://www.facebook.com/skimmigrationservice",
          "https://www.instagram.com/skimmigrationonservices/",
          "https://www.tiktok.com/@skimmigrationservices",
          "https://www.linkedin.com/company/sk-immigration-service/",
          "https://www.youtube.com/@SKImmigrationtips",
          "https://share.google/hQzlV2rZbYtUzYZ9n",
          "https://leap.secp.gov.pk/#/verify-company-info/0304985"
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+923045999859",
            "contactType": "customer support",
            "areaServed": "PK",
            "availableLanguage": ["English", "Urdu", "Punjabi"]
          }
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://immigration.salaroutsourcing.com/#localbusiness",
        "name": "SK Immigration Services — Rawalpindi Office",
        "image": "https://immigration.salaroutsourcing.com/assets/img/og-share.jpg",
        "url": "https://immigration.salaroutsourcing.com",
        "telephone": "+923045999859",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Office No. 10, Alfazal Plaza 64C, Satellite Town",
          "addressLocality": "Rawalpindi",
          "addressRegion": "Punjab",
          "postalCode": "46000",
          "addressCountry": "PK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 33.6149,
          "longitude": 73.0643
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "10:00",
            "closes": "19:00"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://immigration.salaroutsourcing.com/#website",
        "url": "https://immigration.salaroutsourcing.com",
        "name": "SK Immigration Services",
        "publisher": {
          "@id": "https://immigration.salaroutsourcing.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://immigration.salaroutsourcing.com/answers?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  const script = document.createElement('script');
  script.id = 'sk-geo-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schemaData);
  document.head.appendChild(script);
})();
