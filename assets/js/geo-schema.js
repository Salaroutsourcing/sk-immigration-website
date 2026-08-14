/**
 * geo-schema.js — Global GEO (Generative Engine Optimization) Schema Injector
 * SK Immigration Services — immigration.salaroutsourcing.com
 *
 * Injects globally on every page:
 * - Organization schema (E-E-A-T, entity signals)
 * - LocalBusiness schema (NAP consistency)
 * - WebSite schema (SearchAction for Sitelinks Searchbox)
 * - Speakable schema (Google AI / voice assistants)
 * - BreadcrumbList (from data attr or URL path)
 */
(function () {
  'use strict';

  const SITE = 'https://immigration.salaroutsourcing.com';
  const LOGO = SITE + '/assets/img/logo.svg';
  const PHONE = '+923045999859';
  const WHATSAPP = 'https://wa.me/923045999859';
  const EMAIL = 'Services@salaroutsourcing.com';
  const ADDRESS = {
    "@type": "PostalAddress",
    "streetAddress": "Office No. 10, Alfazal Plaza 64C, Satellite Town",
    "addressLocality": "Rawalpindi",
    "addressRegion": "Punjab",
    "postalCode": "46000",
    "addressCountry": "PK"
  };
  const GEO = {
    "@type": "GeoCoordinates",
    "latitude": "33.6149",
    "longitude": "73.0643"
  };

  // --- 1. Organization Schema ---
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LegalService"],
    "@id": SITE + "/#organization",
    "name": "SK Immigration Services",
    "alternateName": ["SK Consultant", "SK Immigration Consultant", "SK Visa Consultant", "SK Study Visa Consultant"],
    "legalName": "SK Immigration Services (SMC-Private) Limited",
    "description": "Pakistan's trusted immigration consultancy — study visas, work permits, visit visas, Germany Ausbildung, Saudi Arabia work visa, document attestation, and visa appointments. SECP registered CUIN 0304985. No visa guarantees — honest guidance only.",
    "url": SITE,
    "logo": {
      "@type": "ImageObject",
      "url": LOGO,
      "width": 200,
      "height": 60
    },
    "image": LOGO,
    "telephone": PHONE,
    "email": EMAIL,
    "foundingDate": "2020",
    "identifier": {
      "@type": "PropertyValue",
      "name": "SECP CUIN",
      "value": "0304985"
    },
    "address": ADDRESS,
    "geo": GEO,
    "hasMap": "https://share.google/hQzlV2rZbYtUzYZ9n",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "10:00",
        "closes": "19:00"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": PHONE,
        "contactType": "customer service",
        "areaServed": ["PK","DE","GB","CA","IT","AU","FR","HU","PL","RO","ES","MY","TR","AE","IE","NL","CY","MT","SK","CZ","PT","SA"],
        "availableLanguage": ["English","Urdu"],
        "contactOption": "TollFree"
      }
    ],
    "sameAs": [
      "https://leap.secp.gov.pk/#/verify-company-info/0304985",
      "https://share.google/hQzlV2rZbYtUzYZ9n",
      "https://www.facebook.com/skimmigrationservice",
      "https://www.instagram.com/skimmigrationonservices/",
      "https://www.linkedin.com/company/sk-immigration-service/",
      "https://www.youtube.com/@SKImmigrationtips",
      "https://www.tiktok.com/@skimmigrationservices/",
      "https://www.google.com/search?kgmid=/g/11zfnqjfgx",
      SITE + "/about.html",
      SITE + "/trust.html",
      SITE + "/llms.txt"
    ],
    "knowsAbout": [
      "Student Visa Pakistan",
      "Study Visa Germany Pakistan",
      "Study Visa UK Pakistan",
      "Study Visa Canada Pakistan",
      "Germany Ausbildung Pakistan",
      "Saudi Arabia Work Visa Pakistan",
      "Schengen Study Visa Pakistan",
      "Immigration Consultant Rawalpindi",
      "Visa Appointment Pakistan",
      "Document Attestation MOFA Pakistan",
      "HEC Attestation",
      "Apostille Pakistan",
      "Study Abroad Pakistan",
      "Work Permit Pakistan"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "SK Immigration Services — Service Packages",
      "url": SITE + "/pricing.html",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Study Visa File Preparation",
          "description": "Complete university shortlisting, document preparation, SOP, CV, and end-to-end support for study visa applications",
          "url": SITE + "/study-visa/"
        },
        {
          "@type": "Offer",
          "name": "Germany Ausbildung Application",
          "description": "Ausbildung company search, application, and visa file preparation for Pakistani students",
          "url": SITE + "/ausbildung.html"
        },
        {
          "@type": "Offer",
          "name": "Saudi Arabia Complete Work Visa Processing",
          "description": "E-Number + Protector registration + visa processing for PKR 15,000 (authority fees separate)",
          "url": SITE + "/saudi-visa/saudi-visa-processing-pakistan/"
        },
        {
          "@type": "Offer",
          "name": "Document Attestation (MOFA/HEC/Apostille)",
          "description": "Complete document attestation chains for use abroad — MOFA, HEC, Apostille, NADRA",
          "url": SITE + "/document-services/"
        },
        {
          "@type": "Offer",
          "name": "Visa Appointment Booking",
          "description": "VFS and embassy visa appointment assistance for all major countries",
          "url": SITE + "/visa-appointment/"
        }
      ]
    }
  };

  // --- 2. LocalBusiness Schema ---
  const localSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "LegalService"],
    "@id": SITE + "/#localbusiness",
    "name": "SK Immigration Services",
    "alternateName": "SK Consultant",
    "description": "SECP-registered immigration consultancy in Rawalpindi. Study visas, work permits, Germany Ausbildung, Saudi work visa, document attestation.",
    "url": SITE,
    "telephone": PHONE,
    "email": EMAIL,
    "address": ADDRESS,
    "geo": GEO,
    "image": LOGO,
    "priceRange": "PKR",
    "currenciesAccepted": "PKR",
    "paymentAccepted": "Cash, Bank Transfer",
    "openingHours": "Mo-Sa 10:00-19:00",
    "hasMap": "https://share.google/hQzlV2rZbYtUzYZ9n",
    "areaServed": [
      {"@type":"City","name":"Rawalpindi"},
      {"@type":"City","name":"Islamabad"},
      {"@type":"City","name":"Lahore"},
      {"@type":"City","name":"Karachi"},
      {"@type":"Country","name":"Pakistan"}
    ],
    "sameAs": [
      "https://leap.secp.gov.pk/#/verify-company-info/0304985",
      "https://share.google/hQzlV2rZbYtUzYZ9n"
    ]
  };

  // --- 3. WebSite Schema with Sitelinks Searchbox ---
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE + "/#website",
    "name": "SK Immigration Services",
    "alternateName": "SK Consultant",
    "url": SITE,
    "description": "Pakistan's trusted study visa, work permit, and immigration consultancy — SECP registered CUIN 0304985",
    "publisher": {"@id": SITE + "/#organization"},
    "inLanguage": ["en","ur"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": SITE + "/faq?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // --- 4. Speakable Schema (marks key answer text for AI/voice) ---
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": window.location.href,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".lead-answer", ".quick-answer", "h1", ".eyebrow", ".viz-pill strong", ".hero__sub", ".hl-hero__sub"]
    },
    "publisher": {"@id": SITE + "/#organization"}
  };

  // --- 5. Inject all schemas ---
  function injectSchema(schema, id) {
    var existing = document.getElementById(id);
    if (existing) existing.remove();
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // --- 6. Breadcrumb from URL ---
  function buildBreadcrumb() {
    var parts = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    if (parts.length === 0) return null;
    var items = [{"@type":"ListItem","position":1,"name":"Home","item":SITE+"/"}];
    var path = SITE;
    parts.forEach(function(part, i) {
      path += '/' + part;
      var name = part.replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
      items.push({"@type":"ListItem","position":i+2,"name":name,"item":path+"/"});
    });
    return {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":items};
  }

  // --- 7. GEO Meta Tags ---
  function injectMeta(name, content, isProperty) {
    var existing = document.querySelector((isProperty?'meta[property="':'meta[name="') + name + '"]');
    if (existing) return;
    var meta = document.createElement('meta');
    meta[isProperty ? 'property' : 'name'] = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectSchema(orgSchema, 'geo-org-schema');
    injectSchema(localSchema, 'geo-local-schema');
    injectSchema(websiteSchema, 'geo-website-schema');
    injectSchema(speakableSchema, 'geo-speakable-schema');

    var crumb = buildBreadcrumb();
    if (crumb && crumb.itemListElement.length > 1) {
      injectSchema(crumb, 'geo-breadcrumb-schema');
    }

    // Citation / GEO meta signals
    injectMeta('citation_author', 'SK Immigration Services');
    injectMeta('DC.publisher', 'SK Immigration Services');
    injectMeta('DC.rights', 'SK Immigration Services (SMC-Private) Limited · SECP CUIN 0304985');
    injectMeta('geo.region', 'PK-PB');
    injectMeta('geo.placename', 'Rawalpindi, Punjab, Pakistan');
    injectMeta('geo.position', '33.6149;73.0643');
    injectMeta('ICBM', '33.6149, 73.0643');
    injectMeta('og:site_name', 'SK Immigration Services', true);
  });

})();
