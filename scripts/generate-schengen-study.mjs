#!/usr/bin/env node
/**
 * Schengen/EU (+ popular) study visa landers + student Answers Q&A coverage.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITE = 'https://www.skimmigrationservices.works';
const TODAY = '2026-07-30';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const write = (rel, c) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c);
  console.log('wrote', rel);
};
const ul = (a) => `<ul>${a.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const ol = (a) => `<ol>${a.map((i) => `<li>${i}</li>`).join('')}</ol>`;
const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});
const crumbsSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

/** Missing study landers (have blog or demand; not yet in /study-visa/) */
const STUDY = [
  {
    slug: 'hungary-study-visa-pakistan',
    name: 'Hungary',
    code: 'hu',
    region: 'Schengen / EU',
    blog: 'hungary-student-visa',
    lead:
      'Hungary is one of the most searched study options from Pakistan for flexible admissions, English-taught programmes and relatively lower total cost. SK Immigration helps with shortlists, documents and visa files — Hungarian missions decide.',
    why: 'Popular for medicine-related pathways, business, IT and foundation routes. Many universities accept moderate marks when documents and funds are clean. Living costs are usually lower than Western Europe.',
    req: [
      'University offer / admission letter from a recognized Hungarian institution',
      'Proof of funds covering tuition + living for the required period',
      'Passport, photos, completed visa forms',
      'Academic transcripts and certificates (attestation/translation when asked)',
      'Health insurance meeting embassy rules',
      'Language evidence (IELTS, MOI, or university test — depends on programme)',
    ],
    process: [
      'Profile review — marks, budget, field of study',
      'University shortlist and application support',
      'Admission + tuition/deposit planning',
      'Document packaging and VFS/consular appointment',
      'Biometrics and decision tracking',
    ],
    docs: [
      'Passport and biometric photos',
      'Admission / offer letter',
      'Academic certificates and mark sheets',
      'Bank statements / sponsor affidavit as required',
      'SOP / motivation letter and CV',
      'Insurance and fee receipts',
      'Accommodation proof when requested',
    ],
    fees: 'Embassy/VFS fees + tuition deposit + living proof; SK Immigration student packages from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–6 months from shortlist to visa decision, longer in peak intakes.',
    mistakes: [
      'Choosing a programme that does not match prior academics',
      'Weak or unexplained funds',
      'Assuming MOI is accepted without checking the university',
      'Booking appointment before documents are ready',
      'Paying agents who promise “100% Hungary visa”',
    ],
    work: 'Limited part-time work may be allowed under student residence rules — exact hours change; verify before relying on work income for funds.',
    ielts: 'Many Hungarian programmes accept IELTS, MOI letters or internal English tests. Confirm the exact 2026 intake rule for your university — UK-style SELT is not always required.',
    lowMarks: 'Hungary is frequently explored for ~50–65% profiles when the rest of the file is strong. Embassies still decide; low marks alone do not guarantee admission or visa.',
  },
  {
    slug: 'poland-study-visa-pakistan',
    name: 'Poland',
    code: 'pl',
    region: 'Schengen / EU',
    blog: 'poland-student-visa',
    lead:
      'Poland attracts Pakistani students with affordable tuition, English programmes and growing university options. SK Immigration prepares admission and national visa files — Polish authorities decide.',
    why: 'Strong search demand for engineering, IT, business and medical-related pathways at competitive cost versus UK/Canada.',
    req: [
      'Admission from a recognized Polish university',
      'Proof of funds / tuition payment evidence as required',
      'Passport, forms, photos',
      'Academic documents with translations when asked',
      'Insurance covering the stay',
      'Language evidence matching the programme',
    ],
    process: [
      'Eligibility and budget check',
      'University applications',
      'Offer + funds packaging',
      'National visa appointment prep',
      'Biometrics and follow-up',
    ],
    docs: [
      'Passport pack',
      'Acceptance letter',
      'Transcripts and certificates',
      'Bank / sponsor proof',
      'SOP and CV',
      'Insurance',
    ],
    fees: 'Consular fees + tuition; SK packages from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–6 months end-to-end.',
    mistakes: [
      'Incomplete translations',
      'Funds that look temporary or borrowed',
      'Wrong visa category',
      'Ignoring prior refusal explanations',
    ],
    work: 'Student work rights exist with limits — do not treat them as your only funding plan.',
    ielts: 'Many English programmes accept IELTS or alternatives (MOI / university test). Always confirm the school’s current list.',
    lowMarks: 'Poland is often considered for flexible admissions; universities still set their own cut-offs.',
  },
  {
    slug: 'portugal-study-visa-pakistan',
    name: 'Portugal',
    code: 'pt',
    region: 'Schengen / EU',
    blog: 'portugal-student-visa',
    lead:
      'Portugal study visas need a Portuguese university acceptance and a complete D-type / residence study file. SK Immigration guides documents from Pakistan — Portuguese missions decide.',
    why: 'English and Portuguese programmes, EU lifestyle, and growing interest from Pakistani students in business, tourism and tech.',
    req: [
      'Admission / enrolment proof from a Portuguese institution',
      'Proof of means / funds',
      'Passport and forms',
      'Criminal record certificate (often legalized/apostilled)',
      'Insurance and accommodation evidence',
      'Language requirements of the programme',
    ],
    process: [
      'Programme shortlist',
      'Admission support',
      'Police certificate + attestation sequencing',
      'Visa appointment packaging',
      'Biometrics and decision tracking',
    ],
    docs: [
      'Passport, photos',
      'Acceptance letter',
      'Academics',
      'Funds proof',
      'Police clearance (apostille/legalization as required)',
      'Insurance and housing proof',
    ],
    fees: 'Visa fees + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–6 months; police certificate timing matters.',
    mistakes: [
      'Late police certificate',
      'Missing apostille chain',
      'Weak accommodation proof',
      'Funds below required thresholds',
    ],
    work: 'Student residence may allow limited work — confirm current Portuguese rules for your permit type.',
    ielts: 'Depends on language of instruction. English programmes usually need IELTS or equivalent; Portuguese programmes need Portuguese proficiency.',
    lowMarks: 'Case by case — public universities can be selective; private options vary. We shortlist realistically.',
  },
  {
    slug: 'spain-study-visa-pakistan',
    name: 'Spain',
    code: 'es',
    region: 'Schengen / EU',
    blog: 'spain-student-visa',
    lead:
      'Spain student visas require university admission, funds, insurance and a complete national visa file from Pakistan. SK Immigration prepares the checklist — Spanish consulates decide.',
    why: 'Strong demand for business, hospitality, design and English/Spanish bilingual pathways.',
    req: [
      'Admission from a recognized Spanish university or school',
      'Proof of funds for living costs',
      'Health insurance without co-payments as typically required',
      'Passport, forms, photos',
      'Academic documents (legalization/apostille when asked)',
      'Criminal record when requested',
    ],
    process: [
      'Shortlist and admission',
      'Funds + insurance packaging',
      'Document legalization sequence',
      'Consular appointment',
      'Biometrics and follow-up',
    ],
    docs: [
      'Passport pack',
      'Acceptance letter',
      'Funds proof',
      'Insurance policy',
      'Academics',
      'Criminal record if asked',
    ],
    fees: 'Visa fees + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–7 months depending on legalization and slots.',
    mistakes: [
      'Insurance that does not meet consular wording',
      'Incomplete apostille',
      'Unclear study purpose',
      'Late appointment booking in peak season',
    ],
    work: 'Limited student work may be allowed after residence authorization — verify current hours.',
    ielts: 'English programmes usually need IELTS/TOEFL; Spanish-taught need DELE/SIELE or university proof.',
    lowMarks: 'Selective public unis vs more flexible private options — we map honestly.',
  },
  {
    slug: 'netherlands-study-visa-pakistan',
    name: 'Netherlands',
    code: 'nl',
    region: 'Schengen / EU',
    blog: 'netherlands-student-visa',
    lead:
      'Netherlands study usually needs admission, proof of means (often via university/IND process), and MVV/residence steps. SK Immigration coaches Pakistani applicants — Dutch authorities decide.',
    why: 'High-quality English programmes; higher cost than Central Europe — funds and academic fit must be strong.',
    req: [
      'Admission from a recognized Dutch higher education institution',
      'Proof of means meeting IND guidance',
      'Passport and identity docs',
      'Academic transcripts',
      'Insurance as required',
      'English evidence (often IELTS/TOEFL)',
    ],
    process: [
      'Budget reality check',
      'University applications',
      'Means of support packaging with school process',
      'MVV / visa steps as applicable',
      'Arrival / residence registration briefing',
    ],
    docs: [
      'Passport',
      'Offer / admission',
      'Funds / tuition payment proof',
      'English test',
      'Academics',
      'Insurance',
    ],
    fees: 'Higher tuition + IND/visa fees; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 4–7 months including admissions.',
    mistakes: [
      'Underestimating living cost proof',
      'Weak English scores for competitive programmes',
      'Late housing planning',
      'Assuming low-cost Europe rules apply 1:1',
    ],
    work: 'Students often have limited work hours — not a substitute for funds proof.',
    ielts: 'Most English Bachelor/Master programmes need IELTS or TOEFL at university-set bands.',
    lowMarks: 'Dutch research universities are selective; universities of applied sciences vary. We only shortlist realistic options.',
  },
  {
    slug: 'czech-republic-study-visa-pakistan',
    name: 'Czech Republic',
    code: 'cz',
    region: 'Schengen / EU',
    blog: 'czech-republic-student-visa',
    lead:
      'Czech study visas need acceptance, funds, insurance and a complete long-stay file. SK Immigration helps Pakistani students package documents — Czech missions decide.',
    why: 'Affordable EU option for engineering, IT, business and medical-related pathways; English and Czech programmes available.',
    req: [
      'University acceptance',
      'Proof of funds',
      'Travel/medical insurance',
      'Passport, forms, photos',
      'Academics with translations when required',
      'Accommodation proof',
    ],
    process: [
      'Profile and shortlist',
      'Admission',
      'Funds + insurance pack',
      'Visa appointment',
      'Biometrics / decision',
    ],
    docs: [
      'Passport pack',
      'Acceptance',
      'Bank proof',
      'Insurance',
      'Academics',
      'Housing confirmation',
    ],
    fees: 'Visa + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–6 months.',
    mistakes: [
      'Missing translations',
      'Insurance gaps',
      'Weak SOP',
      'Fake accommodation letters',
    ],
    work: 'Limited student work may be possible — confirm residence permit conditions.',
    ielts: 'English programmes often accept IELTS or MOI/university tests — confirm intake rules.',
    lowMarks: 'Frequently explored for flexible admissions alongside Hungary/Poland.',
  },
  {
    slug: 'malta-study-visa-pakistan',
    name: 'Malta',
    code: 'mt',
    region: 'Schengen / EU',
    blog: 'malta-student-visa',
    lead:
      'Malta study pathways need school/university acceptance, funds and a complete student visa/residence file. SK Immigration prepares Pakistan-side documents — Maltese authorities decide.',
    why: 'English-speaking EU destination popular for business, IT, hospitality and foundation programmes.',
    req: [
      'Acceptance from a recognized Maltese institution',
      'Proof of funds and tuition plan',
      'Passport and forms',
      'Insurance',
      'Academic documents',
      'Accommodation evidence',
    ],
    process: [
      'Shortlist',
      'Admission',
      'Document packaging',
      'Visa / residence steps',
      'Travel briefing',
    ],
    docs: [
      'Passport',
      'Acceptance letter',
      'Funds',
      'Academics',
      'Insurance',
      'Housing',
    ],
    fees: 'Visa + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–6 months.',
    mistakes: [
      'Choosing unaccredited schools',
      'Weak funds',
      'Late housing proof',
      'Confusing visit entry with study residence',
    ],
    work: 'Student work rights depend on permit type — verify before counting on wages.',
    ielts: 'English programmes commonly need IELTS or equivalent; some accept MOI.',
    lowMarks: 'Foundation and private pathways exist — we check recognition and visa risk honestly.',
  },
  {
    slug: 'slovakia-study-visa-pakistan',
    name: 'Slovakia',
    code: 'sk',
    region: 'Schengen / EU',
    blog: 'slovakia-student-visa',
    lead:
      'Slovakia study visas require admission, funds, insurance and national visa documents. SK Immigration guides Pakistani applicants — Slovak authorities decide.',
    why: 'Lower-cost EU option often compared with Hungary, Czech Republic and Poland.',
    req: [
      'University admission',
      'Proof of funds',
      'Insurance',
      'Passport, forms, photos',
      'Academics / translations',
      'Accommodation proof',
    ],
    process: [
      'Eligibility review',
      'Admission support',
      'File packaging',
      'Appointment',
      'Decision tracking',
    ],
    docs: [
      'Passport pack',
      'Acceptance',
      'Bank proof',
      'Insurance',
      'Academics',
      'Housing',
    ],
    fees: 'Visa + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–6 months.',
    mistakes: [
      'Incomplete translations',
      'Unexplained funds',
      'Wrong appointment timing',
      'Fake guarantees from agents',
    ],
    work: 'Limited work may be allowed under student residence — verify current rules.',
    ielts: 'Programme-dependent; English tracks often need IELTS or MOI/university test.',
    lowMarks: 'Often considered for flexible admissions; universities still decide offers.',
  },
  {
    slug: 'romania-study-visa-pakistan',
    name: 'Romania',
    code: 'ro',
    region: 'EU',
    blog: 'romania-student-visa',
    lead:
      'Romania is a budget-friendly EU study destination for many Pakistani students. SK Immigration helps with admission docs and long-stay student visa files — Romanian authorities decide.',
    why: 'Lower tuition/living costs; popular for medicine-related interest, engineering and business — always verify university recognition for your career goal.',
    req: [
      'Admission / letter of acceptance',
      'Proof of funds and tuition plan',
      'Passport and forms',
      'Medical / insurance as required',
      'Academic documents',
      'Accommodation evidence',
    ],
    process: [
      'Honest pathway review (especially for medicine claims)',
      'University applications',
      'Document packaging',
      'Visa appointment',
      'Travel readiness',
    ],
    docs: [
      'Passport',
      'Acceptance',
      'Funds',
      'Academics',
      'Insurance / medicals',
      'Housing',
    ],
    fees: 'Visa + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–6 months.',
    mistakes: [
      'Unverified “medical seat” agents',
      'Weak funds story',
      'Ignoring recognition requirements for future licensing',
      'Incomplete forms',
    ],
    work: 'Student work rules vary — do not rely on illegal work.',
    ielts: 'Many English programmes need IELTS or university English proof.',
    lowMarks: 'Flexible options exist; we still shortlist by recognition and visa credibility.',
  },
  {
    slug: 'ireland-study-visa-pakistan',
    name: 'Ireland',
    code: 'ie',
    region: 'EU (not Schengen)',
    blog: 'ireland-student-visa',
    lead:
      'Ireland study visas need an Irish college offer, funds, English evidence and a complete AVATS file. SK Immigration coaches Pakistani applicants — Irish immigration decides.',
    why: 'English-speaking Europe with strong IT/business appeal; costs are higher than Central Europe.',
    req: [
      'Offer from an eligible Irish education provider',
      'Proof of funds meeting Irish guidance',
      'English language evidence',
      'Passport and online application',
      'Medical insurance',
      'Academic documents',
    ],
    process: [
      'Budget check',
      'College shortlist',
      'Funds packaging',
      'Online visa application + biometrics',
      'Decision tracking',
    ],
    docs: [
      'Passport',
      'Offer letter',
      'Bank statements',
      'English test',
      'Academics',
      'Insurance',
    ],
    fees: 'Visa fees + higher tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 2–5 months after offer, depending on queues.',
    mistakes: [
      'Insufficient funds format',
      'Choosing non-eligible courses',
      'Weak English scores',
      'Confusing Ireland with Schengen free movement for entry',
    ],
    work: 'Student work hours are limited in term — funds proof cannot depend on illegal work.',
    ielts: 'Usually required at college-set bands (IELTS or accepted alternatives).',
    lowMarks: 'Selective for quality colleges; pathway programmes exist — we assess risk honestly.',
  },
  {
    slug: 'austria-study-visa-pakistan',
    name: 'Austria',
    code: 'at',
    region: 'Schengen / EU',
    blog: null,
    lead:
      'Austria student residence needs university admission, funds, insurance and a complete national visa file. SK Immigration prepares Pakistan-side documents — Austrian authorities decide.',
    why: 'High education quality; German language often matters for public universities; English Masters exist in some fields.',
    req: [
      'Admission from an Austrian university',
      'Proof of funds / means of subsistence',
      'Health insurance',
      'Passport, forms, photos',
      'Academics (legalization when asked)',
      'Language proof (German and/or English)',
    ],
    process: [
      'Language + programme fit review',
      'Admission support',
      'Funds and insurance packaging',
      'Visa appointment',
      'Decision tracking',
    ],
    docs: [
      'Passport pack',
      'Acceptance',
      'Funds',
      'Insurance',
      'Academics',
      'Language certificates',
    ],
    fees: 'Visa + living proof; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 4–7 months including language planning.',
    mistakes: [
      'Ignoring German requirements',
      'Underfunded living proof',
      'Late legalization',
      'Weak motivation letters',
    ],
    work: 'Limited student work may be allowed — confirm permit conditions.',
    ielts: 'English programmes need IELTS/TOEFL; many degree tracks need German (ÖSD/ÖIF etc.).',
    lowMarks: 'Public unis can be selective; we only recommend realistic pathways.',
  },
  {
    slug: 'belgium-study-visa-pakistan',
    name: 'Belgium',
    code: 'be',
    region: 'Schengen / EU',
    blog: null,
    lead:
      'Belgium study visas need admission, funds, insurance and a complete long-stay student file. SK Immigration guides Pakistani applicants — Belgian authorities decide.',
    why: 'EU capital region with English and local-language programmes; costs mid-to-high.',
    req: [
      'University admission',
      'Proof of funds',
      'Health insurance',
      'Passport and forms',
      'Academics',
      'Accommodation evidence',
    ],
    process: [
      'Shortlist',
      'Admission',
      'Document packaging',
      'Visa appointment',
      'Follow-up',
    ],
    docs: [
      'Passport',
      'Acceptance',
      'Funds',
      'Insurance',
      'Academics',
      'Housing',
    ],
    fees: 'Visa + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–6 months.',
    mistakes: [
      'Incomplete host/housing docs',
      'Weak funds',
      'Language mismatch',
      'Peak-season late filing',
    ],
    work: 'Limited student work may be possible under residence rules.',
    ielts: 'Depends on language of instruction (English / French / Dutch).',
    lowMarks: 'Case by case by university type.',
  },
  {
    slug: 'greece-study-visa-pakistan',
    name: 'Greece',
    code: 'gr',
    region: 'Schengen / EU',
    blog: null,
    lead:
      'Greece student visas require admission, funds, insurance and national visa documents from Pakistan. SK Immigration prepares files — Greek missions decide.',
    why: 'Growing interest for English programmes and EU access at varied cost levels.',
    req: [
      'Admission letter',
      'Proof of funds',
      'Insurance',
      'Passport, forms, photos',
      'Academics',
      'Accommodation proof',
    ],
    process: [
      'Profile review',
      'Admission support',
      'Packaging',
      'VFS appointment',
      'Biometrics',
    ],
    docs: [
      'Passport pack',
      'Acceptance',
      'Bank proof',
      'Insurance',
      'Academics',
      'Housing',
    ],
    fees: 'Visa + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 3–6 months.',
    mistakes: [
      'Incomplete insurance',
      'Weak SOP',
      'Unverified agents',
      'Late peak filing',
    ],
    work: 'Student work limits apply — verify residence conditions.',
    ielts: 'English programmes usually need IELTS or university English proof.',
    lowMarks: 'Varies widely by institution — we shortlist realistically.',
  },
  {
    slug: 'switzerland-study-visa-pakistan',
    name: 'Switzerland',
    code: 'ch',
    region: 'Schengen (not EU)',
    blog: null,
    lead:
      'Switzerland study is selective and expensive: admission, strong funds and a complete national visa file are essential. SK Immigration coaches honest pathways — Swiss authorities decide.',
    why: 'World-class universities; high living costs. Only suitable when academics and funds are genuinely strong.',
    req: [
      'Admission from a Swiss university / school',
      'Strong proof of financial means',
      'Passport and forms',
      'Health insurance',
      'Academic excellence evidence',
      'Language proof (English/German/French/Italian by canton/programme)',
    ],
    process: [
      'Strict eligibility screen',
      'Applications',
      'Funds packaging',
      'Visa appointment',
      'Decision tracking',
    ],
    docs: [
      'Passport',
      'Acceptance',
      'Funds',
      'Academics',
      'Language tests',
      'Insurance',
    ],
    fees: 'High living costs + visa fees; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 4–8 months including admissions.',
    mistakes: [
      'Underestimating cost of living',
      'Weak academics for competitive schools',
      'Wrong language for the canton',
      'Fake “easy Switzerland study” promises',
    ],
    work: 'Student work is restricted — funds must stand alone.',
    ielts: 'Programme/canton dependent; competitive English Masters often need strong IELTS/TOEFL.',
    lowMarks: 'Rarely a fit for low marks — we say so upfront.',
  },
  {
    slug: 'turkey-study-visa-pakistan',
    name: 'Turkey',
    code: 'tr',
    region: 'Turkey',
    blog: 'turkey-student-visa',
    lead:
      'Turkey study is popular for affordable programmes and cultural proximity. SK Immigration helps with admission and student visa docs from Pakistan — Turkish authorities decide.',
    why: 'Lower cost than Western Europe; English and Turkish programmes; strong search interest from Pakistan.',
    req: [
      'University acceptance',
      'Passport and student visa application',
      'Funds / tuition evidence',
      'Academic documents',
      'Health insurance as required',
      'Photos and forms',
    ],
    process: [
      'Shortlist',
      'Admission',
      'Document pack',
      'Visa application',
      'Travel briefing',
    ],
    docs: [
      'Passport',
      'Acceptance',
      'Academics',
      'Funds',
      'Insurance',
      'Photos',
    ],
    fees: 'Visa + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 1–4 months after admission, pathway dependent.',
    mistakes: [
      'Unaccredited universities',
      'Incomplete attestation when asked',
      'Overstay after arrival',
      'Fake agent guarantees',
    ],
    work: 'Student work rules differ — confirm legally before working.',
    ielts: 'English programmes may need IELTS or university English exam; Turkish programmes need Turkish proficiency.',
    lowMarks: 'Many flexible options — still verify recognition for your career.',
  },
  {
    slug: 'malaysia-study-visa-pakistan',
    name: 'Malaysia',
    code: 'my',
    region: 'Asia',
    blog: 'malaysia-student-visa',
    lead:
      'Malaysia student passes need a Malaysian university offer and EMGS / student pass steps. SK Immigration guides Pakistani applicants — Malaysian authorities decide.',
    why: 'English-medium, relatively affordable, popular alternative to Europe for some profiles.',
    req: [
      'Offer from a recognized Malaysian institution',
      'EMGS / student pass documentation',
      'Passport validity',
      'Academic documents',
      'Medicals as required',
      'Funds / tuition plan',
    ],
    process: [
      'University shortlist',
      'Offer and EMGS process support',
      'Medicals / docs',
      'Pass issuance steps',
      'Travel briefing',
    ],
    docs: [
      'Passport',
      'Offer letter',
      'Academics',
      'Photos',
      'Medical reports',
      'Payment proofs',
    ],
    fees: 'EMGS/pass fees + tuition; SK from <strong>PKR 50,000</strong>.',
    timeline: 'Often 1–3 months after complete EMGS file.',
    mistakes: [
      'Unverified colleges',
      'Incomplete medicals',
      'Late passport validity',
      'Working illegally on student pass',
    ],
    work: 'Student pass work rights are limited — follow official rules only.',
    ielts: 'Many programmes need IELTS or MUET/university English; some accept MOI.',
    lowMarks: 'Foundation pathways exist; we check recognition.',
  },
];

function studyFaqs(c) {
  return [
    { q: `What are ${c.name} study visa requirements from Pakistan?`, a: c.req.slice(0, 4).join('; ') + `. SK Immigration builds a full checklist for your case.` },
    { q: `How much does it cost to study in ${c.name} from Pakistan?`, a: `Budget tuition + living + visa/insurance. ${c.name} is generally ${/Netherlands|Ireland|Switzerland|Austria|Belgium/.test(c.name) ? 'mid-to-high cost' : 'more affordable than UK/Canada for many programmes'}. SK packages from PKR 50,000 cover preparation only — not tuition.` },
    { q: `Do I need IELTS for ${c.name} study visa?`, a: c.ielts },
    { q: `Can I study in ${c.name} with low marks?`, a: c.lowMarks },
    { q: `How long does ${c.name} student visa take from Pakistan?`, a: c.timeline },
    { q: `What documents are needed for ${c.name} student visa?`, a: c.docs.join('; ') + '.' },
    { q: `Can I work while studying in ${c.name}?`, a: c.work },
    { q: `How to apply for ${c.name} study visa from Pakistan?`, a: `Secure admission, prepare funds/insurance/docs, then file the correct national/student visa. SK Immigration sequences the file; authorities decide.` },
    { q: `What is SK Immigration’s fee for ${c.name} study?`, a: `Student packages from PKR 50,000 for preparation. Embassy and university fees are separate. No visa guarantees.` },
    { q: `Do you guarantee ${c.name} student visa approval?`, a: `No. Embassies and immigration authorities decide. We prepare complete, honest files.` },
  ];
}

function studyBody(c) {
  const blog = c.blog
    ? `<p>Deeper guide: <a href="../../blog/${c.blog}/">${esc(c.name)} student visa guide</a>.</p>`
    : '';
  return `
        <h2>Why students from Pakistan look at ${esc(c.name)}</h2>
        <p>${c.why}</p>
        <p><span class="text-muted">${esc(c.region)}</span></p>
        <h2>Requirements</h2>
        ${ul(c.req)}
        <h2>Process — how to apply from Pakistan</h2>
        ${ol(c.process)}
        <h2>Documents checklist</h2>
        ${ul(c.docs)}
        <p>Interactive checklist: <a href="../../checklist.html?country=${c.code}&amp;type=study">Open ${esc(c.name)} checklist →</a></p>
        <h2>Fees</h2>
        <p>${c.fees}</p>
        <h2>Timeline</h2>
        <p>${c.timeline}</p>
        <h2>IELTS / English</h2>
        <p>${c.ielts}</p>
        <h2>Low marks &amp; gaps</h2>
        <p>${c.lowMarks}</p>
        <h2>Work while studying</h2>
        <p>${c.work}</p>
        <h2>Common mistakes</h2>
        ${ul(c.mistakes)}
        <h2>Related</h2>
        ${blog}
        <p><a href="../">All study visas</a> · <a href="../../visit-visa/${c.code === 'ie' ? 'ireland' : c.slug.replace('-study-visa-pakistan', '')}-visit-visa-pakistan/">Visit visa (if available)</a> · <a href="../../answers.html">Answers hub</a> · <a href="../../eligibility.html">Eligibility quiz</a></p>
`;
}

function landerHtml(c) {
  const canonical = `${SITE}/study-visa/${c.slug}/`;
  const h1 = `${c.name} Study Visa Pakistan`;
  const faqs = studyFaqs(c);
  const crumbs = [
    { name: 'Home', url: SITE + '/' },
    { name: 'Study Visa', url: SITE + '/study-visa/' },
    { name: h1, url: canonical },
  ];
  const title = `${h1} — Requirements, Fees, IELTS & FAQ | SK Immigration`;
  const description = `${c.name} study visa from Pakistan (${c.region}): requirements, documents, fees, IELTS, low marks, timeline and FAQ. SK Immigration Services, Rawalpindi.`;
  const faqHtml = faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: h1,
    provider: { '@id': SITE + '/#organization' },
    areaServed: 'PK',
    url: canonical,
    description: c.lead.replace(/<[^>]+>/g, ''),
    offers: { '@type': 'Offer', price: '50000', priceCurrency: 'PKR', availability: 'https://schema.org/InStock' },
  };
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${SITE}/assets/img/hero-graduation.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="author" content="SK Immigration Services" />
  <link rel="icon" href="../../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../../assets/css/main.css?v=iosbar3" />
  <script type="application/ld+json">${JSON.stringify(crumbsSchema(crumbs))}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema(faqs))}</script>
  <script type="application/ld+json">${JSON.stringify(service)}</script>
</head>
<body data-page="study-visa" data-breadcrumbs="${JSON.stringify(crumbs).replace(/"/g, '&quot;')}">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main" class="container" style="padding:2.5rem 0 4rem;max-width:920px">
    <nav class="text-muted" style="font-size:0.85rem;margin-bottom:1rem" aria-label="Breadcrumb"><a href="${SITE}/">Home</a> · <a href="${SITE}/study-visa/">Study Visa</a> · <span>${esc(h1)}</span></nav>
    <article class="glass card" style="padding:2rem">
      <p class="eyebrow">SK Immigration Services · Updated ${TODAY}</p>
      <h1 class="display" style="font-size:clamp(1.7rem,3vw,2.35rem);margin-bottom:0.75rem">${esc(h1)}</h1>
      <p class="lead-answer"><strong>Quick answer:</strong> ${c.lead}</p>
      <p class="text-muted mb-2">Free consultation · Honest advice · Authorities decide · No guarantees</p>
      <div class="prose">
        ${studyBody(c)}
        <h2>Frequently asked questions</h2>
        <div class="faq-mini">${faqHtml}</div>
        <h2>Talk to SK Immigration</h2>
        <p>Rawalpindi office with WhatsApp support nationwide. We prepare complete study files — never fake visa guarantees.</p>
        <div class="hero-ctas" style="margin-top:1rem">
          <a class="btn btn-gold" href="../../contact.html">Book free consultation</a>
          <a class="btn btn-whatsapp" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp +92 304 5999859</a>
          <a class="btn btn-ghost" href="../../eligibility.html">Check eligibility</a>
        </div>
      </div>
    </article>
  </main>
  <div id="site-footer"></div>
  <script src="../../assets/js/config.js"></script>
  <script src="../../assets/js/theme.js"></script>
  <script src="../../assets/js/api.js"></script>
  <script src="../../assets/js/layout.js?v=iosbar3"></script>
  <script src="../../assets/js/seo.js"></script>
</body>
</html>
`;
}

const urls = [];
const cards = [];
for (const c of STUDY) {
  write(`study-visa/${c.slug}/index.html`, landerHtml(c));
  urls.push(`${SITE}/study-visa/${c.slug}/`);
  cards.push(
    `<a class="glass card reveal" href="${c.slug}/"><h3 style="font-family:var(--font-display);margin-bottom:0.35rem">${esc(c.name)} Study Visa Pakistan</h3><p class="text-muted" style="font-size:0.92rem">${esc(c.region)} · Requirements, IELTS, fees, timeline &amp; FAQ.</p></a>`
  );
}

/* Rebuild study hub completely with all countries */
const existing = [
  ['germany-study-visa-pakistan/', 'Germany Study Visa Pakistan', 'Schengen / EU'],
  ['italy-study-visa-pakistan/', 'Italy Study Visa Pakistan', 'Schengen / EU'],
  ['france-study-visa-pakistan/', 'France Study Visa Pakistan', 'Schengen / EU'],
  ['uk-study-visa-pakistan/', 'United Kingdom Study Visa Pakistan', 'UK'],
  ['canada-study-visa-pakistan/', 'Canada Study Visa Pakistan', 'Canada'],
  ['australia-study-visa-pakistan/', 'Australia Study Visa Pakistan', 'Australia'],
  ['usa-study-visa-pakistan/', 'United States Study Visa Pakistan', 'USA'],
  ['cyprus-study-visa-pakistan/', 'Cyprus Study Visa Pakistan', 'Cyprus / EU'],
];
const allCards = [
  ...existing.map(
    ([href, title, reg]) =>
      `<a class="glass card reveal" href="${href}"><h3 style="font-family:var(--font-display);margin-bottom:0.35rem">${esc(title)}</h3><p class="text-muted" style="font-size:0.92rem">${esc(reg)} · Requirements, process, documents, fees, timeline &amp; FAQ.</p></a>`
  ),
  ...cards,
].join('');

write(
  'study-visa/index.html',
  `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Study Visa Pakistan — Hungary, Poland, Schengen, UK, Canada &amp; More | SK Immigration</title>
  <meta name="description" content="Study visa guides from Pakistan for Hungary, Poland, Germany, Italy, France, Spain, Netherlands, Czech, Malta, Slovakia, Romania, Ireland, UK, Canada, Australia, USA, Cyprus, Turkey, Malaysia — requirements, IELTS, fees and FAQs." />
  <link rel="canonical" href="${SITE}/study-visa/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Study Visa Pakistan | SK Immigration Services" />
  <meta property="og:description" content="Country-by-country study visa guidance including Hungary and Schengen destinations — honest advice, clear FAQs." />
  <meta property="og:url" content="${SITE}/study-visa/" />
  <meta property="og:image" content="${SITE}/assets/img/service-study.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css?v=iosbar3" />
</head>
<body data-page="study-visa">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main">
    <section class="hero" style="padding-bottom:2rem">
      <div class="container">
        <p class="eyebrow">Primary service</p>
        <h1 class="display" style="font-size:clamp(2rem,4vw,2.8rem)">Study Visa Pakistan</h1>
        <p class="hero-lead" style="max-width:42rem">Every major destination students ask about — Hungary, Poland and Schengen included — with requirements, IELTS, fees, timelines and FAQs.</p>
        <div class="hero-ctas">
          <a class="btn btn-gold btn-lg" href="../eligibility.html">Check eligibility — free</a>
          <a class="btn btn-whatsapp btn-lg" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp Us</a>
        </div>
      </div>
    </section>
    <section>
      <div class="container grid-2" style="padding-bottom:3rem">${allCards}</div>
    </section>
  </main>
  <div id="site-footer"></div>
  <script src="../assets/js/config.js"></script>
  <script src="../assets/js/theme.js"></script>
  <script src="../assets/js/api.js"></script>
  <script src="../assets/js/layout.js?v=iosbar3"></script>
  <script src="../assets/js/seo.js"></script>
</body>
</html>
`
);

/* Answers — student questions per country + cross-cutting */
const ANSWERS = [];
for (const c of STUDY) {
  const base = c.slug.replace('-study-visa-pakistan', '');
  ANSWERS.push(
    {
      slug: `how-to-apply-${base}-student-visa-pakistan`,
      q: `How to apply for ${c.name} student visa from Pakistan?`,
      short: `Get university admission, prepare funds/insurance/documents, then file the correct student/national visa. SK Immigration sequences the ${c.name} file from Rawalpindi/WhatsApp — authorities decide. Details: ${SITE}/study-visa/${c.slug}/`,
      tags: [c.name, 'how to apply', 'student visa'],
    },
    {
      slug: `${base}-study-visa-requirements-pakistan`,
      q: `What are ${c.name} study visa requirements from Pakistan?`,
      short: studyFaqs(c)[0].a + ` Full page: ${SITE}/study-visa/${c.slug}/`,
      tags: [c.name, 'requirements'],
    },
    {
      slug: `${base}-study-visa-cost-pakistan`,
      q: `How much does ${c.name} study visa / study cost from Pakistan?`,
      short: studyFaqs(c)[1].a,
      tags: [c.name, 'cost'],
    },
    {
      slug: `ielts-for-${base}-study`,
      q: `Do I need IELTS for ${c.name} study visa?`,
      short: c.ielts,
      tags: [c.name, 'IELTS'],
    },
    {
      slug: `study-${base}-low-marks`,
      q: `Can I study in ${c.name} with low marks?`,
      short: c.lowMarks,
      tags: [c.name, 'low marks'],
    }
  );
}

// Cross-cutting Schengen student Qs
ANSWERS.push(
  {
    slug: 'best-schengen-country-study-pakistan',
    q: 'Which Schengen country is best to study from Pakistan?',
    short:
      'It depends on marks, budget and language. Hungary, Poland, Czech Republic, Slovakia, Romania and Malta are often explored for lower cost; Germany for low tuition + blocked account; Netherlands/Austria for stronger academics and higher cost. Take SK’s free eligibility quiz — no single “best” for everyone.',
    tags: ['Schengen', 'best country'],
  },
  {
    slug: 'schengen-study-visa-without-ielts',
    q: 'Can I get a Schengen student visa without IELTS?',
    short:
      'Sometimes — many Central European universities accept MOI letters or internal English tests. Germany Ausbildung needs German. Netherlands/Ireland English programmes usually need IELTS/TOEFL. Confirm the exact university rule.',
    tags: ['Schengen', 'IELTS'],
  },
  {
    slug: 'hungary-study-visa-documents',
    q: 'What documents are needed for Hungary student visa from Pakistan?',
    short:
      'Typically passport, admission letter, academics, funds proof, insurance, SOP/CV, photos and forms — translations/attestation when asked. See the full Hungary study page for the checklist.',
    tags: ['Hungary', 'documents'],
  },
  {
    slug: 'poland-vs-hungary-vs-czech-study',
    q: 'Poland vs Hungary vs Czech Republic for study — which is better?',
    short:
      'All three are affordable EU options. Compare programme quality, city costs, language and your career target. Use SK’s compare tool and free consultation — embassies decide visas either way.',
    tags: ['Poland', 'Hungary', 'Czech', 'compare'],
  },
  {
    slug: 'medical-study-europe-pakistan',
    q: 'Can I study medicine in Europe from Pakistan?',
    short:
      'Some EU universities offer English medical programmes, but recognition, entrance exams, cost and visa credibility vary widely. Avoid agents selling “guaranteed medical seats.” SK Immigration reviews recognition risk before you pay.',
    tags: ['medicine', 'Europe'],
  },
  {
    slug: 'schengen-student-visa-refusal-reasons',
    q: 'Why are Schengen student visas refused for Pakistani applicants?',
    short:
      'Common reasons: weak funds, unclear study purpose, programme mismatch, incomplete documents, or prior immigration issues. SK Immigration fixes file gaps before reapplication — never fake guarantees.',
    tags: ['refusal', 'Schengen', 'student'],
  },
  {
    slug: 'proof-of-funds-hungary-poland',
    q: 'How much proof of funds for Hungary or Poland student visa?',
    short:
      'Enough to cover tuition (or remaining balance) plus living costs for the period the mission asks — amounts change. We review bank statements case by case; round “magic numbers” from Facebook are unreliable.',
    tags: ['funds', 'Hungary', 'Poland'],
  },
  {
    slug: 'can-i-work-on-schengen-student-visa',
    q: 'Can I work on a Schengen student visa / residence permit?',
    short:
      'Usually limited part-time work is allowed under national student residence rules (hours differ by country). Never rely on illegal work or treat wages as your only funds proof.',
    tags: ['work', 'Schengen', 'student'],
  }
);

function answerPage(a) {
  const canonical = `${SITE}/answers/${a.slug}`;
  const related = STUDY.slice(0, 4)
    .map((c) => `<li><a href="../study-visa/${c.slug}/">${esc(c.name)} study visa</a></li>`)
    .join('');
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(a.q)} | SK Immigration Services</title>
  <meta name="description" content="${esc(a.short.slice(0, 155))}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:title" content="${esc(a.q)}" />
  <meta property="og:description" content="${esc(a.short.slice(0, 155))}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:type" content="article" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css?v=iosbar3" />
  <script type="application/ld+json">${JSON.stringify(
    faqSchema([{ q: a.q, a: a.short + ' Contact SK Immigration: https://www.skimmigrationservices.works · WhatsApp +92 304 5999859.' }])
  )}</script>
</head>
<body data-page="faq">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main" class="container" style="padding:2.5rem 0 4rem;max-width:860px">
    <article class="glass card" style="padding:2rem">
      <p class="eyebrow">AI-ready answer · SK Immigration</p>
      <h1 class="display" style="font-size:clamp(1.5rem,3vw,2.2rem)">${esc(a.q)}</h1>
      <div class="prose">
        <p class="lead-answer"><strong>Answer:</strong> ${esc(a.short)}</p>
        <h2>Do this next</h2>
        <ol>
          <li><a href="../eligibility.html">Free eligibility quiz</a></li>
          <li><a href="../study-visa/">Study Visa hub (all countries)</a></li>
          <li><a href="../contact.html">Free consultation</a> · WhatsApp +92 304 5999859</li>
        </ol>
        <h2>Related study pages</h2>
        <ul>${related}</ul>
      </div>
      <div class="hero-ctas mt-3">
        <a class="btn btn-gold" href="../contact.html">Free consultation</a>
        <a class="btn btn-whatsapp" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </article>
  </main>
  <div id="site-footer"></div>
  <script src="../assets/js/config.js"></script>
  <script src="../assets/js/theme.js"></script>
  <script src="../assets/js/api.js"></script>
  <script src="../assets/js/layout.js?v=iosbar3"></script>
</body>
</html>
`;
}

const idxPath = path.join(ROOT, 'assets/data/answers-index.json');
const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
const slugs = new Set(idx.map((x) => x.slug));

for (const a of ANSWERS) {
  write(`answers/${a.slug}.html`, answerPage(a));
  urls.push(`${SITE}/answers/${a.slug}.html`);
  if (!slugs.has(a.slug)) {
    idx.push({ slug: a.slug, q: a.q, short: a.short, tags: a.tags });
    slugs.add(a.slug);
  }
}
fs.writeFileSync(idxPath, JSON.stringify(idx, null, 2) + '\n');
console.log('answers index', idx.length);

/* Fix related visit links that may 404 — soften in body by post-check */
// austria/belgium/greece/switzerland visit exist; ireland visit exists; turkey/malaysia visit may not
const visitExists = new Set(
  fs.readdirSync(path.join(ROOT, 'visit-visa')).filter((d) => fs.statSync(path.join(ROOT, 'visit-visa', d)).isDirectory())
);
for (const c of STUDY) {
  const visitSlugGuess = c.slug.replace('-study-visa-pakistan', '-visit-visa-pakistan');
  const f = path.join(ROOT, `study-visa/${c.slug}/index.html`);
  let t = fs.readFileSync(f, 'utf8');
  if (!visitExists.has(visitSlugGuess.replace(/-visit.*/, '')) && !visitExists.has(visitSlugGuess)) {
    // try folder name
  }
  const folder = visitSlugGuess;
  if (!fs.existsSync(path.join(ROOT, 'visit-visa', folder))) {
    t = t.replace(
      / · <a href="..\/..\/visit-visa\/[^"]+">Visit visa \(if available\)<\/a>/,
      ''
    );
    fs.writeFileSync(f, t);
  }
}

/* Sitemap */
let sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
let inject = '';
for (const u of urls) {
  if (!sitemap.includes(`<loc>${u}</loc>`)) {
    inject += `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
  }
}
if (inject) {
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap.replace('</urlset>', inject + '</urlset>'));
  console.log('sitemap added', urls.length);
}

/* llms snippet */
let llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
const hubLine = '- Study Visa Pakistan hub: https://www.skimmigrationservices.works/study-visa/';
const extraHubs = STUDY.slice(0, 8)
  .map((c) => `- ${c.name} Study Visa Pakistan: ${SITE}/study-visa/${c.slug}/`)
  .join('\n');
if (!llms.includes('Hungary Study Visa Pakistan')) {
  llms = llms.replace(hubLine, `${hubLine}\n${extraHubs}`);
  fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms);
}

console.log('Done. Study landers:', STUDY.length, 'Answers batch:', ANSWERS.length);
