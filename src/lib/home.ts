/**
 * Homepage and related conversion copy for SK Immigration.
 * Keep claims conservative: we prepare and guide; authorities decide.
 */
import { CONTACT } from './config';

export const ASSESSMENT_HREF = '/eligibility/';
export const WHATSAPP_HREF = CONTACT.whatsappLink;
export const SERVICES_HREF = '/services/';
export const BUSINESS_HREF = '/business-registration/';
export const HOW_IT_WORKS_HREF = '/how-it-works/';

export const TRUST_ITEMS = [
  {
    title: '100% Online',
    text: 'Remote support from anywhere.',
    icon: 'globe',
  },
  {
    title: 'Written Scope',
    text: 'Know what is included before payment.',
    icon: 'document',
  },
  {
    title: 'Transparent Fees',
    text: 'Clear pricing with no surprise charges.',
    icon: 'fees',
  },
  {
    title: 'No False Guarantees',
    text: 'We prepare and guide. Authorities decide.',
    icon: 'shield',
  },
  {
    title: 'Human Support',
    text: 'Real people for important decisions.',
    icon: 'people',
  },
] as const;

export const PATHWAYS = [
  {
    title: 'Study Abroad',
    description: 'University admissions, study pathways and visa file preparation.',
    cta: 'Explore Study Services',
    href: '/study-visa/',
    image: '/assets/hubs/study-visa.svg',
  },
  {
    title: 'Travel Abroad',
    description: 'Visit and tourist visa preparation for selected destinations.',
    cta: 'Explore Visit Visas',
    href: '/visit-visa/',
    image: '/assets/hubs/appointments.svg',
  },
  {
    title: 'Work or Training',
    description: 'Germany Ausbildung and EU Opportunity Card guidance.',
    cta: 'Explore Opportunities',
    href: '/work-permit/',
    image: '/assets/hubs/ausbildung-work.svg',
  },
  {
    title: 'Start a Company Abroad',
    description: 'Company formation and documentation support for international entrepreneurs.',
    cta: 'Explore Business Services',
    href: BUSINESS_HREF,
    image: '/assets/hubs/company-registration.svg',
  },
] as const;

export const TRUST_BENEFITS = [
  'Understand which pathway fits your situation',
  'Know which documents are required',
  'Understand the process before you commit',
  'Receive a clear service scope',
  'Know what is within our responsibility',
  "Know what remains the authority's decision",
] as const;

export const HOME_SERVICES = [
  {
    id: 'study',
    title: 'Study Visa & University Admissions',
    description:
      'University shortlisting, pathway guidance, SOP support and complete visa file preparation.',
    benefits: [
      'University/program selection guidance',
      'Application documentation',
      'SOP and motivation guidance',
      'Financial-document preparation guidance',
      'Visa file organization',
      'Interview preparation',
    ],
    cta: 'Explore Study Services',
    href: '/study-visa/',
    image: '/assets/services/student-visa.svg',
    featured: false,
  },
  {
    id: 'ausbildung',
    title: 'Germany Ausbildung & EU Opportunity Card',
    description:
      'Guidance for applicants exploring vocational training and European opportunity pathways.',
    note: 'We do not promise employment or placement.',
    benefits: [
      'Profile assessment',
      'Pathway guidance',
      'CV/document preparation',
      'Application documentation',
      'Visa preparation',
      'Interview preparation',
    ],
    cta: 'Explore Opportunities',
    href: '/work-permit/',
    image: '/assets/services/ausbildung-work.svg',
    featured: false,
  },
  {
    id: 'visit',
    title: 'Visit & Tourist Visas',
    description: 'Structured preparation for legitimate temporary travel applications.',
    destinations: ['UK', 'Schengen', 'USA', 'Dubai/UAE', 'Other supported destinations'],
    benefits: [
      'Document checklist',
      'Financial evidence organization',
      'Travel-purpose documentation',
      'Itinerary guidance',
      'Application preparation',
      'Interview preparation where applicable',
    ],
    cta: 'Explore Visit Visas',
    href: '/visit-visa/',
    image: '/assets/services/visit-visa.svg',
    featured: false,
  },
  {
    id: 'attestation',
    title: 'Document Attestation & Legalization',
    description:
      'Remote coordination and guidance for documents that require verification, attestation or legalization.',
    benefits: [
      'Document review',
      'Attestation pathway guidance',
      'Legalization sequence',
      'Apostille guidance where applicable',
      'Embassy-related document preparation',
    ],
    cta: 'Explore Document Services',
    href: '/document-services/',
    image: '/assets/services/document-attestation.svg',
    featured: false,
  },
  {
    id: 'appointments',
    title: 'Visa Appointment Monitoring & Interview Preparation',
    description:
      'Support with appointment monitoring where applicable and preparation before interviews.',
    note: 'Appointment availability cannot be guaranteed.',
    benefits: [
      'Appointment guidance',
      'Portal/process guidance',
      'Document readiness checks',
      'Mock interviews',
      'Interview preparation',
      'Final file review',
    ],
    cta: 'Explore Appointment Support',
    href: '/visa-appointment/',
    image: '/assets/services/visa-appointments.svg',
    featured: false,
  },
  {
    id: 'saudi',
    title: 'Saudi Visa Processing',
    description: 'Sponsor-driven cases only.',
    notice:
      'We only assist with Saudi visa processing when a sponsor in Saudi Arabia has already initiated the process.',
    jobsDisclaimer: 'We do not offer, arrange or sell jobs in Saudi Arabia.',
    benefits: [
      'Document preparation',
      'Processing guidance',
      'Required-step coordination',
      'Application support',
    ],
    cta: 'Learn About Saudi Processing',
    href: '/saudi-visa/saudi-visa-processing-pakistan/',
    image: '/assets/services/saudi-visa.svg',
    featured: false,
  },
  {
    id: 'company',
    title: 'Company & Business Registration',
    headline: 'Build your business internationally.',
    description:
      'Starting a company in another country can feel complicated. Different jurisdictions, documents, registration procedures and compliance requirements can quickly become overwhelming.',
    extra:
      'We provide remote guidance and documentation support for entrepreneurs planning to establish or expand their businesses internationally.',
    markets: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Selected European jurisdictions'],
    benefits: [
      'Company structure guidance',
      'Registration/document preparation',
      'Founder/shareholder documentation',
      'Government-form preparation',
      'Registration process coordination',
      'Basic post-registration guidance',
      'International expansion documentation support',
    ],
    disclaimers: [
      'Company registration does not automatically provide immigration status, residency, a visa, a work permit or the right to operate in a particular country.',
      'Each jurisdiction has its own legal, tax and regulatory requirements. We explain the process and support documentation preparation; official authorities make the final decisions.',
    ],
    cta: 'Explore Company Registration',
    href: BUSINESS_HREF,
    image: '/assets/hubs/company-registration.svg',
    featured: true,
  },
] as const;

export const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Tell us your goal',
    text: 'Complete a short assessment or contact us online.',
  },
  {
    n: '02',
    title: 'We assess your situation',
    text: 'We review your profile, documents and intended pathway.',
  },
  {
    n: '03',
    title: 'Receive your roadmap',
    text: 'You receive a clear explanation of requirements, scope and next steps.',
  },
  {
    n: '04',
    title: 'We prepare & support',
    text: 'We assist with the agreed documentation, applications, registrations or preparation.',
  },
  {
    n: '05',
    title: 'Stay informed',
    text: 'You receive clear communication throughout the agreed service scope.',
  },
] as const;

export const NEVER_PROMISE = [
  'Guaranteed visa approval',
  'Guaranteed immigration outcomes',
  'Guaranteed university admission',
  'Guaranteed employment',
  'Fake documents',
  'Misleading information',
  'Hidden charges',
] as const;

export const WE_PROMISE = [
  'Honest guidance',
  'Clear service scope',
  'Transparent communication',
  'Proper documentation support',
  'Realistic expectations',
  'Respect for your information',
  'Remote accessibility',
  'Human support when it matters',
] as const;

export const AUDIENCES = [
  { title: 'Students', text: 'Education and international study pathways.' },
  { title: 'Professionals', text: 'Training, career and opportunity pathways.' },
  { title: 'Travelers', text: 'Legitimate temporary travel applications.' },
  { title: 'Entrepreneurs', text: 'International company formation and expansion.' },
  { title: 'Businesses', text: 'Cross-border documentation and support.' },
] as const;

export const REGIONS = ['Gulf', 'South Asia', 'Africa', 'Europe', 'Worldwide'] as const;

export const HOME_FAQS = [
  {
    q: 'Do you guarantee visa approval or immigration outcomes?',
    a: 'No. We help you understand your options, prepare documentation and navigate the process clearly. Government, embassy, university and regulatory authorities make the final decisions. We will never tell you something is guaranteed when it isn’t.',
  },
  {
    q: 'How does a fully online service work?',
    a: 'You start with a short assessment or a conversation. We review your situation, explain the likely pathway and scope, then support documentation and preparation remotely. You stay informed at every step of the agreed service.',
  },
  {
    q: 'Do you arrange jobs in Saudi Arabia?',
    a: 'No. We do not offer, arrange or sell jobs in Saudi Arabia. We only assist with Saudi visa processing when a sponsor in Saudi Arabia has already initiated the process.',
  },
  {
    q: 'Does company registration give me a visa or residency?',
    a: 'No. Company registration does not automatically provide immigration status, residency, a visa, a work permit or the right to operate in a particular country. Each jurisdiction has its own legal, tax and regulatory requirements.',
  },
  {
    q: 'Will I know the fees and scope before I pay?',
    a: 'Yes. You receive a written service scope and clear pricing before payment. There are no surprise charges for work that was not agreed.',
  },
  {
    q: 'Do I need to know the perfect pathway before I contact you?',
    a: 'No. You don’t need to have everything figured out. Tell us what you’re planning, where you’re hoping to go, or what you’re trying to build — we’ll help you understand your options and the steps involved.',
  },
] as const;
