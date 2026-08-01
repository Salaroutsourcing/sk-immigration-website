/**
 * SK Immigration Services — Site Configuration
 * Public brand: SK Immigration Services
 * Legal: SK Immigration Services (SMC-Private) Limited (CUIN 0304985)
 * Domain stays salaroutsourcing.com (website + email host — not a separate consultancy brand)
 */
window.SALAR_CONFIG = {
  brand: 'SK Immigration',
  brandFull: 'SK Immigration Services',
  legalName: 'SK Immigration Services (SMC-Private) Limited',
  cuin: '0304985',
  /* Search / AI aliases people type (keep in sync with seo.js + llms.txt) */
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
  parentLine: 'SK Immigration Services · CUIN 0304985 · salaroutsourcing.com',
  brandClarity:
    'SK Immigration Services (also searched as SK Consultant) is the public brand of SK Immigration Services (SMC-Private) Limited (CUIN 0304985). The website and email use salaroutsourcing.com — same company, same Rawalpindi office. Official WhatsApp/phone: +92 304 5999859 only.',
  tagline: "Pakistan's Trusted Study Visa & Immigration Partner",
  domain: 'https://www.salaroutsourcing.com',
  email: 'Services@salaroutsourcing.com',
  phone: '+92 304 5999859',
  phoneDisplay: '+92 304 5999859',
  phoneE164: '+923045999859',
  whatsapp: '923045999859',
  whatsappLink: 'https://wa.me/923045999859?text=Hi%20SK%20Immigration%2C%20I%20need%20guidance.',
  officialPhoneNote:
    'Official phone and WhatsApp is +92 304 5999859 only. Match Google Business to this number.',

  legacyPortalUrl:
    'https://script.google.com/macros/s/AKfycbz_Xy6fTRi1ompDQxHIYk-aRzBhzMS3PylHAlmJ98Dao1MA2GVWUpGoeGb4V8HvD752dQ/exec',

  /* Optional Sheets mirror — set LEAD_WEBHOOK_URL on the Worker instead for production */
  appsScriptUrl: '',

  offices: [
    {
      name: 'Rawalpindi Office',
      address: 'Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi',
      hours: 'Mon–Sat: 10:00 AM – 7:00 PM',
      map: 'https://maps.google.com/?q=Alfazal+Plaza+Satellite+Town+Rawalpindi',
    },
  ],

  social: {
    instagram: 'https://www.instagram.com/skimmigrationonservices/',
    tiktok: 'https://www.tiktok.com/@skimmigrationservices',
    facebook: 'https://www.facebook.com/skimmigrationservice',
    linkedin: 'https://www.linkedin.com/company/sk-immigration-service/',
    youtube: 'https://www.youtube.com/@SKImmigrationtips',
  },

  googleBusinessShare: 'https://share.google/hQzlV2rZbYtUzYZ9n',
  googleKnowledgeGraphId: '/g/11zfnqjfgx',
  googleMapsSearch:
    'https://www.google.com/maps/search/?api=1&query=SK+Immigration+Services+Alfazal+Plaza+Satellite+Town+Rawalpindi',

  /* Professional imagery */
  images: {
    hero: 'assets/img/hero-library.jpg',
    study: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    europe: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
    airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cab0?auto=format&fit=crop&w=1200&q=80',
    office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    germany: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
    docs: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    handshake: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
  },
};
