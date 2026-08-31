/**
 * Primary chrome navigation — keep the header short.
 * Service detail lives in the mega-menu and on /services/.
 */

export const SERVICES_MENU = [
  {
    label: 'Study & Admissions',
    href: '/study-visa/',
    text: 'University pathways and study visa preparation.',
  },
  {
    label: 'Visit & Tourist Visas',
    href: '/visit-visa/',
    text: 'Temporary travel and visitor visa preparation.',
  },
  {
    label: 'Work & Training',
    href: '/work-permit/',
    text: 'Germany Ausbildung and EU opportunity pathways.',
  },
  {
    label: 'Document Services',
    href: '/document-services/',
    text: 'Attestation, legalization and file preparation.',
  },
  {
    label: 'Appointments',
    href: '/visa-appointment/',
    text: 'Process guidance and interview preparation.',
  },
  {
    label: 'Saudi Processing',
    href: '/saudi-visa/saudi-visa-processing-pakistan/',
    text: 'Sponsor-driven cases only. No job offers.',
  },
  {
    label: 'Company Registration',
    href: '/business-registration/',
    text: 'International formation and documentation support.',
  },
] as const;

export const GUIDES_MENU = [
  { label: 'Guides', href: '/guides/', text: 'Practical country and visa explainers.' },
  { label: 'Country Information', href: '/study-visa/', text: 'Destinations, requirements and process notes.' },
  { label: 'FAQs', href: '/faq/', text: 'Clear answers about scope, fees and outcomes.' },
  { label: 'Official Links', href: '/official-links/', text: 'Embassy, VFS and government sources.' },
] as const;

export const HEADER_LINKS = [
  { label: 'Services', href: '/services/', menu: 'services' as const },
  { label: 'How It Works', href: '/how-it-works/' },
  { label: 'Guides', href: '/guides/', menu: 'guides' as const },
  { label: 'About', href: '/about/' },
] as const;
