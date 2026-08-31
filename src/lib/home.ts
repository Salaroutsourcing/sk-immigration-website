/**
 * Homepage and related conversion copy for SK Immigration.
 * Keep claims conservative: we prepare and guide; authorities decide.
 */
import { CONTACT } from './config';

export const ASSESSMENT_HREF = '/contact/';
export const FINDER_HREF = '/eligibility/';
export const WHATSAPP_HREF = CONTACT.whatsappLink;
export const SERVICES_HREF = '/services/';
export const BUSINESS_HREF = '/business-registration/';
export const HOW_IT_WORKS_HREF = '/how-it-works/';

export const TRUST_ITEMS = [
  {
    title: '100% Online',
    text: 'Remote support from wherever you are.',
    icon: 'globe',
  },
  {
    title: 'Clear Service Scope',
    text: 'Know what is included before payment.',
    icon: 'document',
  },
  {
    title: 'Transparent Fees',
    text: 'Understand our service fees and external costs.',
    icon: 'fees',
  },
  {
    title: 'No False Guarantees',
    text: 'Authorities make the final decisions.',
    icon: 'shield',
  },
  {
    title: 'Human Support',
    text: 'Real guidance for important decisions.',
    icon: 'people',
  },
] as const;

export const PATHWAYS = [
  {
    title: 'Study Abroad',
    description: 'University admissions, study pathway guidance and visa file preparation.',
    cta: 'Explore Study Services',
    href: '/study-visa/',
    image: '/assets/hubs/study-visa.svg',
  },
  {
    title: 'Travel Abroad',
    description: 'Visit and tourist visa preparation for legitimate temporary travel.',
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
  'Understand what we can help with',
  'Understand what remains outside our control',
] as const;

export const HOME_SERVICES = [
  {
    id: 'study',
    title: 'Study Visa & University Admissions',
    description:
      'Guidance for students preparing for international university applications and study visa processes.',
    benefits: [
      'University/program shortlisting',
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
      'Support with appointment processes where applicable and practical preparation before interviews.',
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
    badge: 'Sponsor-driven cases only',
    description:
      'We assist with Saudi visa processing when a legitimate sponsor in Saudi Arabia has already initiated the relevant visa process.',
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
  'Guaranteed business success',
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
  { title: 'Professionals', text: 'Training, career and international opportunity pathways.' },
  { title: 'Travelers', text: 'Legitimate temporary travel applications.' },
  { title: 'Entrepreneurs', text: 'International company formation and expansion.' },
  { title: 'Businesses', text: 'Cross-border documentation and support.' },
] as const;

export const REGIONS = ['Gulf', 'South Asia', 'Africa', 'Europe', 'Worldwide'] as const;

export const HOME_FAQS = [
  {
    q: 'Do you guarantee visa approval?',
    a: 'No. We prepare documentation and explain the process. Visa, immigration, university and regulatory decisions remain with the relevant authorities.',
  },
  {
    q: 'How does the online service work?',
    a: 'You start with a short assessment or a conversation. We review your situation, explain the likely pathway and scope, then support documentation and preparation remotely.',
  },
  {
    q: 'What fees do I pay?',
    a: 'You receive a written service scope and SK Immigration’s fee before payment. Government, embassy, university and other third-party charges are separate and paid to those providers.',
  },
  {
    q: 'Do you arrange jobs?',
    a: 'No. We do not offer, arrange or sell jobs. For Saudi processing we only assist when a legitimate sponsor in Saudi Arabia has already initiated the visa process.',
  },
  {
    q: 'Does company registration give me a visa?',
    a: 'No. Company registration does not automatically provide immigration status, residency, a visa, a work permit or the right to operate in a particular country.',
  },
  {
    q: 'Do I need to know my pathway before contacting you?',
    a: 'No. Tell us what you’re planning. We’ll help you understand the options and the next step.',
  },
] as const;

export const MORE_FAQS = [
  {
    q: 'Can you guarantee a visa appointment?',
    a: 'No. Appointment availability is controlled by visa centres and authorities. We can guide the process and help you prepare, but we cannot guarantee a slot.',
  },
  {
    q: 'Can you guarantee university admission?',
    a: 'No. Universities and colleges make their own admission decisions. We help with shortlisting, documentation and application preparation.',
  },
  {
    q: 'Do you prepare documents?',
    a: 'We provide documentation guidance and preparation support according to the selected service. You remain responsible for supplying accurate, genuine information and originals when required.',
  },
  {
    q: 'Are services available from outside Pakistan?',
    a: 'Yes. Support is remote by default. You can start an assessment or WhatsApp conversation from wherever you are.',
  },
] as const;

export const ALL_FAQS = [...HOME_FAQS, ...MORE_FAQS];

export const WE_HANDLE = [
  'Profile review',
  'Documentation guidance',
  'File preparation',
  'Application guidance',
  'Interview preparation',
  'Process communication',
] as const;

export const AUTHORITIES_DECIDE = [
  'Visa approval',
  'Immigration status',
  'University admission',
  'Government decisions',
  'Regulatory approvals',
  'Appointment availability',
] as const;

export const HOW_WE_WORK = [
  { title: 'Written scope', text: 'You know what is included before you pay.' },
  { title: 'Transparent pricing', text: 'Service fees are separated from government and third-party costs.' },
  { title: 'Clear communication', text: 'You stay informed throughout the agreed service.' },
  { title: 'Official-source guidance', text: 'We explain requirements using public, official information.' },
  { title: 'No guarantees', text: 'We prepare and guide. Authorities decide.' },
] as const;

export const BEFORE_YOU_PAY = [
  { q: 'What service are you buying?', a: 'A clearly defined documentation and guidance service, confirmed in writing before you pay.' },
  { q: 'What is included?', a: 'Specific deliverables for your case — such as file review, document guidance and application support.' },
  { q: 'What does it cost?', a: 'The SK Immigration service fee for the agreed work.' },
  { q: 'What other fees may apply?', a: 'Government, embassy, university, visa-centre and other third-party charges, paid to those providers.' },
  { q: 'What can we control?', a: 'Preparation, documentation quality and clear communication.' },
  { q: 'What can we not control?', a: 'Visa, immigration, university, appointment and regulatory decisions.' },
  { q: 'What happens next?', a: 'Assessment, written scope, then the agreed work. Authorities decide the outcome.' },
] as const;

export const PLANNING_CARDS = [
  {
    n: '01',
    title: 'Study',
    text: 'International university admissions and study visa preparation.',
    href: '/study-visa/',
    icon: 'study',
  },
  {
    n: '02',
    title: 'Visit',
    text: 'Temporary travel and visitor visa preparation.',
    href: '/visit-visa/',
    icon: 'visit',
  },
  {
    n: '03',
    title: 'Work & Training',
    text: 'Germany Ausbildung, EU opportunity pathways and related preparation.',
    href: '/work-permit/',
    icon: 'work',
  },
  {
    n: '04',
    title: 'Documents',
    text: 'Attestation, legalization and document preparation.',
    href: '/document-services/',
    icon: 'docs',
  },
  {
    n: '05',
    title: 'Business',
    text: 'International company registration and expansion support.',
    href: '/business-registration/',
    icon: 'business',
  },
] as const;

export const PATHWAY_STEPS = [
  { n: '01', title: 'Goal', text: 'Tell us what you are planning.', icon: 'goal' },
  { n: '02', title: 'Assessment', text: 'We review your profile and options.', icon: 'assessment' },
  { n: '03', title: 'Documents', text: 'Checklists and file organisation.', icon: 'documents' },
  { n: '04', title: 'Preparation', text: 'Guidance, review and interview prep.', icon: 'prep' },
  { n: '05', title: 'Application', text: 'Submit through the official channel.', icon: 'application' },
  { n: '06', title: 'Authority decision', text: 'Official bodies make the outcome.', icon: 'decision' },
] as const;

export const TRUST_CARDS = [
  {
    n: '01',
    title: 'Clear Scope',
    text: 'Know exactly what is included before you commit.',
  },
  {
    n: '02',
    title: 'Transparent Fees',
    text: 'Service fees are separated from external charges.',
  },
  {
    n: '03',
    title: 'Official-Source Guidance',
    text: 'Requirements are explained using reliable public information.',
  },
  {
    n: '04',
    title: 'Human Support',
    text: 'Real assistance when important decisions need to be made.',
  },
] as const;

export const WHY_ITEMS = [
  { n: '01', title: 'Understand your options' },
  { n: '02', title: 'Know the requirements' },
  { n: '03', title: 'Prepare properly' },
  { n: '04', title: 'Stay informed' },
  { n: '05', title: 'Take the next step' },
] as const;

export const HONESTY_NO = [
  'NO GUARANTEED VISAS',
  'NO GUARANTEED JOBS',
  'NO FAKE DOCUMENTS',
  'NO HIDDEN CHARGES',
] as const;

export const HONESTY_YES = [
  'CLEAR GUIDANCE',
  'CLEAR SCOPE',
  'CLEAR COMMUNICATION',
  'PROPER PREPARATION',
] as const;

export const JOURNEY_NODES = [
  { id: 'uk', label: 'UK', x: 41, y: 28 },
  { id: 'de', label: 'Germany', x: 48, y: 31 },
  { id: 'eu', label: 'Europe', x: 50, y: 24 },
  { id: 'us', label: 'USA', x: 18, y: 36 },
  { id: 'ca', label: 'Canada', x: 22, y: 24 },
  { id: 'ae', label: 'UAE', x: 60, y: 46 },
  { id: 'sa', label: 'Saudi Arabia', x: 56, y: 42 },
  { id: 'au', label: 'Australia', x: 82, y: 72 },
] as const;

export const COMPANY_NODES = [
  { id: 'us', label: 'USA', x: 16, y: 42 },
  { id: 'uk', label: 'UK', x: 38, y: 28 },
  { id: 'ca', label: 'Canada', x: 22, y: 22 },
  { id: 'au', label: 'Australia', x: 84, y: 68 },
  { id: 'eu', label: 'Europe', x: 48, y: 32 },
] as const;

export const COUNTRY_PATHWAYS = [
  { label: 'Study', href: '/study-visa/' },
  { label: 'Work & Training', href: '/work-permit/' },
  { label: 'Opportunity Card', href: '/work-permit/' },
  { label: 'Documents', href: '/document-services/' },
] as const;
