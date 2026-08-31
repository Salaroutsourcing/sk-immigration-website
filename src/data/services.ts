/**
 * Services page structured data.
 * Meanings and disclaimers stay aligned with HOME_SERVICES — no invented outcomes.
 */
import { HOME_SERVICES } from '../lib/home';

export type ServiceAccent = 'blue' | 'teal' | 'purple' | 'orange' | 'violet' | 'emerald' | 'indigo';

export const SERVICE_ACCENTS: Record<
  ServiceAccent,
  { hex: string; soft: string; border: string; glow: string }
> = {
  blue: {
    hex: '#0161ef',
    soft: 'rgba(1, 97, 239, 0.12)',
    border: 'rgba(1, 97, 239, 0.28)',
    glow: 'rgba(37, 99, 235, 0.22)',
  },
  teal: {
    hex: '#0d9488',
    soft: 'rgba(13, 148, 136, 0.12)',
    border: 'rgba(13, 148, 136, 0.28)',
    glow: 'rgba(16, 185, 129, 0.2)',
  },
  purple: {
    hex: '#7c3aed',
    soft: 'rgba(124, 58, 237, 0.12)',
    border: 'rgba(124, 58, 237, 0.28)',
    glow: 'rgba(139, 92, 246, 0.22)',
  },
  orange: {
    hex: '#ea580c',
    soft: 'rgba(234, 88, 12, 0.12)',
    border: 'rgba(234, 88, 12, 0.28)',
    glow: 'rgba(249, 115, 22, 0.2)',
  },
  violet: {
    hex: '#8b5cf6',
    soft: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.28)',
    glow: 'rgba(99, 102, 241, 0.22)',
  },
  emerald: {
    hex: '#10b981',
    soft: 'rgba(16, 185, 129, 0.14)',
    border: 'rgba(16, 185, 129, 0.3)',
    glow: 'rgba(13, 148, 136, 0.22)',
  },
  indigo: {
    hex: '#6366f1',
    soft: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.28)',
    glow: 'rgba(99, 102, 241, 0.22)',
  },
};

type HomeService = (typeof HOME_SERVICES)[number];

function byId(id: string): HomeService {
  const found = HOME_SERVICES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown service id: ${id}`);
  return found;
}

export interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  features: readonly string[];
  href: string;
  cta: string;
  accent: ServiceAccent;
  category: string;
  icon: 'graduation' | 'briefcase' | 'passport' | 'document' | 'calendar' | 'shield';
  notice?: string;
}

const study = byId('study');
const work = byId('ausbildung');
const visit = byId('visit');
const docs = byId('attestation');
const appointments = byId('appointments');
const saudi = byId('saudi');

export const SERVICE_CARDS: ServiceCardData[] = [
  {
    id: study.id,
    title: study.title,
    description: study.description,
    features: study.benefits,
    href: study.href,
    cta: study.cta,
    accent: 'blue',
    category: 'Education',
    icon: 'graduation',
  },
  {
    id: work.id,
    title: work.title,
    description: work.description,
    features: work.benefits,
    href: work.href,
    cta: work.cta,
    accent: 'teal',
    category: 'Career pathways',
    icon: 'briefcase',
    notice: 'We do not promise employment or placement.',
  },
  {
    id: visit.id,
    title: visit.title,
    description: visit.description,
    features: visit.benefits,
    href: visit.href,
    cta: visit.cta,
    accent: 'purple',
    category: 'Travel',
    icon: 'passport',
  },
  {
    id: docs.id,
    title: docs.title,
    description: docs.description,
    features: docs.benefits,
    href: docs.href,
    cta: docs.cta,
    accent: 'orange',
    category: 'Legalization',
    icon: 'document',
  },
  {
    id: appointments.id,
    title: appointments.title,
    description: appointments.description,
    features: appointments.benefits,
    href: appointments.href,
    cta: appointments.cta,
    accent: 'violet',
    category: 'Process support',
    icon: 'calendar',
    notice: 'Appointment availability cannot be guaranteed.',
  },
  {
    id: saudi.id,
    title: saudi.title,
    description: saudi.description,
    features: saudi.benefits,
    href: saudi.href,
    cta: saudi.cta,
    accent: 'emerald',
    category: 'Sponsor-driven',
    icon: 'shield',
    notice:
      'We only assist when a sponsor in Saudi Arabia has already initiated the process. We do not offer, arrange or sell jobs in Saudi Arabia.',
  },
];

export interface OrbitNode {
  id: string;
  title: string;
  sub: string;
  em: string;
  href: string;
  accent: ServiceAccent;
  icon: ServiceCardData['icon'] | 'home';
  position: 'study' | 'work' | 'settle' | 'saudi' | 'visit';
}

export const ORBIT_NODES: OrbitNode[] = [
  {
    id: 'study',
    title: 'Study',
    sub: 'Visa & Admissions',
    em: 'Achieve your academic goals with the right guidance.',
    href: '/study-visa/',
    accent: 'blue',
    icon: 'graduation',
    position: 'study',
  },
  {
    id: 'work',
    title: 'Work',
    sub: 'Visa & Employment',
    em: 'Explore global career opportunities and build your future.',
    href: '/work-permit/',
    accent: 'teal',
    icon: 'briefcase',
    position: 'work',
  },
  {
    id: 'settle',
    title: 'Settle',
    sub: 'PR & Immigration',
    em: 'Permanent residency and settlement solutions made easy.',
    href: '/contact/',
    accent: 'indigo',
    icon: 'home',
    position: 'settle',
  },
  {
    id: 'saudi',
    title: 'Saudi',
    sub: 'Visa Services',
    em: 'Specialized support for Saudi visa applications.',
    href: '/saudi-visa/saudi-visa-processing-pakistan/',
    accent: 'teal',
    icon: 'shield',
    position: 'saudi',
  },
  {
    id: 'visit',
    title: 'Visit',
    sub: 'Visa & Travel',
    em: 'Visit family and explore new destinations with ease.',
    href: '/visit-visa/',
    accent: 'purple',
    icon: 'passport',
    position: 'visit',
  },
];

export const TRUST_PILLARS = [
  {
    title: 'Trusted & Secure',
    text: 'Clear scope, written fees, and careful handling of your documents.',
    icon: 'lock' as const,
  },
  {
    title: 'Expert Guidance',
    text: 'Professional pathway advice tailored to your goal and file.',
    icon: 'guidance' as const,
  },
  {
    title: 'Fast & Reliable',
    text: 'Organized remote support with prompt, structured communication.',
    icon: 'bolt' as const,
  },
  {
    title: 'Global Reach',
    text: 'Study, work, visit, and sponsor-driven Saudi processing — online.',
    icon: 'globe' as const,
  },
];
