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
    cta: 'Explore service',
    href: '/study-visa/',
    image: '/assets/hubs/study-visa.svg',
  },
  {
    title: 'Travel Abroad',
    description: 'Visit and tourist visa preparation for legitimate temporary travel.',
    cta: 'Explore service',
    href: '/visit-visa/',
    image: '/assets/hubs/appointments.svg',
  },
  {
    title: 'Work or Training',
    description: 'Germany Ausbildung and EU Opportunity Card guidance.',
    cta: 'Explore service',
    href: '/work-permit/',
    image: '/assets/hubs/ausbildung-work.svg',
  },
  {
    title: 'Start a Company Abroad',
    description: 'Company formation and documentation support for international entrepreneurs.',
    cta: 'Explore service',
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

export const WHY_CHOOSE = [
  { n: '01', title: 'Clear Guidance', text: 'Understand your options before you commit.' },
  { n: '02', title: 'Transparent Scope', text: 'Know exactly what is included.' },
  { n: '03', title: 'No False Promises', text: 'Authorities make the final decisions.' },
  { n: '04', title: 'Digital Convenience', text: 'Manage your process remotely.' },
  { n: '05', title: 'Human Support', text: 'Get real assistance when it matters.' },
  { n: '06', title: 'International Focus', text: 'Support for multiple countries and pathways.' },
] as const;

export const HOME_SERVICES = [
  {
    id: 'study',
    category: 'Study abroad',
    title: 'Study Visa & University Admissions',
    description:
      'Guidance for students preparing international university applications and study visa files.',
    benefits: [
      'University and programme shortlisting',
      'Application and SOP guidance',
      'Financial-document preparation',
      'Visa file organization',
      'Interview preparation',
    ],
    cta: 'Explore service',
    href: '/study-visa/',
    image: '/assets/services/student-visa.svg',
  },
  {
    id: 'visit',
    category: 'Visit & tourist visas',
    title: 'Visit & Tourist Visas',
    description: 'Structured preparation for legitimate temporary travel applications.',
    destinations: ['UK', 'Schengen', 'USA', 'Dubai/UAE', 'Other supported destinations'],
    benefits: [
      'Document checklist',
      'Financial evidence organization',
      'Travel-purpose documentation',
      'Application preparation',
      'Interview preparation where applicable',
    ],
    cta: 'Explore service',
    href: '/visit-visa/',
    image: '/assets/services/visit-visa.svg',
  },
  {
    id: 'ausbildung',
    category: 'Work / training / opportunities',
    title: 'Germany Ausbildung & EU Opportunity Card',
    description:
      'Guidance for applicants exploring vocational training and European opportunity pathways.',
    note: 'We do not promise employment or placement.',
    benefits: [
      'Profile and pathway assessment',
      'CV and document preparation',
      'Application documentation',
      'Visa preparation',
      'Interview preparation',
    ],
    cta: 'Explore service',
    href: '/work-permit/',
    image: '/assets/services/ausbildung-work.svg',
  },
  {
    id: 'attestation',
    category: 'Document attestation',
    title: 'Document Attestation & Legalization',
    description:
      'Remote coordination for documents that require verification, attestation or legalization.',
    benefits: [
      'Document review',
      'Attestation pathway guidance',
      'Legalization sequence',
      'Apostille guidance where applicable',
      'Embassy-related document preparation',
    ],
    cta: 'Explore service',
    href: '/document-services/',
    image: '/assets/services/document-attestation.svg',
  },
  {
    id: 'appointments',
    category: 'Appointment & interview preparation',
    title: 'Visa Appointments & Interview Preparation',
    description:
      'Support with appointment processes where applicable, and practical preparation before interviews.',
    note: 'Appointment availability cannot be guaranteed.',
    benefits: [
      'Appointment and portal guidance',
      'Document readiness checks',
      'Mock interviews',
      'Interview preparation',
      'Final file review',
    ],
    cta: 'Explore service',
    href: '/visa-appointment/',
    image: '/assets/services/visa-appointments.svg',
  },
  {
    id: 'saudi',
    category: 'Saudi sponsor-driven processing',
    title: 'Saudi Visa Processing',
    badge: 'Sponsor-driven cases only',
    description:
      'Assistance with Saudi visa processing when a legitimate sponsor in Saudi Arabia has already initiated the process.',
    notice:
      'We only assist when a sponsor in Saudi Arabia has already initiated the process.',
    jobsDisclaimer: 'We do not offer, arrange or sell jobs in Saudi Arabia.',
    benefits: [
      'Document preparation',
      'Processing guidance',
      'Required-step coordination',
      'Application support',
    ],
    cta: 'Explore service',
    href: '/saudi-visa/saudi-visa-processing-pakistan/',
    image: '/assets/services/saudi-visa.svg',
  },
  {
    id: 'company',
    category: 'International company registration',
    title: 'Company & Business Registration',
    description:
      'Remote guidance and documentation support for entrepreneurs establishing or expanding a company internationally.',
    benefits: [
      'Company structure guidance',
      'Registration document preparation',
      'Founder and shareholder documentation',
      'Process coordination',
      'Basic post-registration guidance',
    ],
    note: 'Company registration does not provide a visa or residency.',
    cta: 'Explore service',
    href: BUSINESS_HREF,
    image: '/assets/hubs/company-registration.svg',
  },
] as const;

export const COMPANY_EXTRA =
  'We provide remote guidance and documentation support for entrepreneurs planning to establish or expand their businesses internationally.';

export const COMPANY_MARKETS = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Selected European jurisdictions',
] as const;

export const COMPANY_DISCLAIMERS = [
  'Company registration does not automatically provide immigration status, residency, a visa, a work permit or the right to operate in a particular country.',
  'Each jurisdiction has its own legal, tax and regulatory requirements. We explain the process and support documentation preparation; official authorities make the final decisions.',
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
  'Human support',
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
    q: 'Do you guarantee visa approval or immigration outcomes?',
    a: 'No. We help you understand your options, prepare documentation and navigate the process clearly. Government, embassy, university and regulatory authorities make the final decisions.',
  },
  {
    q: 'How does a fully online service work?',
    a: 'You start with a short assessment or a conversation. We review your situation, explain the likely pathway and scope, then support documentation and preparation remotely.',
  },
  {
    q: 'Do you arrange jobs in Saudi Arabia?',
    a: 'No. We do not offer, arrange or sell jobs in Saudi Arabia. We only assist with Saudi visa processing when a sponsor in Saudi Arabia has already initiated the process.',
  },
  {
    q: 'Does company registration give me a visa or residency?',
    a: 'No. Company registration does not automatically provide immigration status, residency, a visa or a work permit. Each jurisdiction has its own legal, tax and regulatory requirements.',
  },
  {
    q: 'Will I know the fees and scope before I pay?',
    a: 'Yes. You receive a written service scope and clear pricing before payment. Government and third-party charges are separate from our service fee.',
  },
  {
    q: 'Do I need to know the perfect pathway before I contact you?',
    a: 'No. Tell us what you’re planning, where you’re hoping to go, or what you’re trying to build — we’ll help you understand your options and the steps involved.',
  },
  {
    q: 'Can you guarantee a visa appointment or university admission?',
    a: 'No. Appointment availability is controlled by visa centres, and universities make their own admission decisions. We help you prepare; we cannot guarantee a slot or an offer.',
  },
  {
    q: 'Do you prepare documents?',
    a: 'We provide documentation guidance and preparation support according to the selected service. You remain responsible for supplying accurate, genuine information and originals when required.',
  },
] as const;

export const WE_HANDLE = [
  'Profile review',
  'Documentation guidance',
  'File preparation',
  'Application guidance',
  'File organization',
  'Interview preparation',
  'Process communication',
  'Company registration documentation support',
] as const;

export const AUTHORITIES_DECIDE = [
  'Visa approval',
  'Immigration status',
  'University admission',
  'Government decisions',
  'Regulatory approvals',
  'Appointment availability',
  'Registration approvals',
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
