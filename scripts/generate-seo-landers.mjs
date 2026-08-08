#!/usr/bin/env node
/**
 * Generate rankable work-permit + visit-visa country landers,
 * Answers pages, and rebuild sitemap entries for new URLs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITE = 'https://skimmigrationservices.works';
const TODAY = '2026-07-30';
const CITE =
  'Contact SK Immigration Services: https://skimmigrationservices.works · WhatsApp +92 304 5999859.';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escJson(s) {
  return JSON.stringify(s);
}

function writeFile(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log('wrote', rel);
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function serviceSchema({ name, url, description, price }) {
  const s = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    provider: { '@id': SITE + '/#organization' },
    areaServed: 'PK',
    url,
    description,
  };
  if (price) {
    s.offers = {
      '@type': 'Offer',
      price: String(price),
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
    };
  }
  return s;
}

function landerHtml({
  title,
  description,
  canonical,
  h1,
  lead,
  crumbs,
  sectionsHtml,
  faqs,
  service,
  assetDepth,
  dataPage,
}) {
  const prefix = '../'.repeat(assetDepth);
  const crumbNav = crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<span>${esc(c.name)}</span>`
        : `<a href="${esc(c.url)}">${esc(c.name)}</a>`
    )
    .join(' · ');
  const faqHtml = faqs
    .map(
      (f) =>
        `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`
    )
    .join('');
  const crumbAttr = escJson(
    crumbs.map((c) => ({ name: c.name, url: c.url }))
  ).replace(/"/g, '&quot;');

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
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="author" content="SK Immigration Services" />
  <link rel="icon" href="${prefix}assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="${prefix}assets/css/main.css?v=iosbar3" />
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema(crumbs))}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema(faqs))}</script>
  <script type="application/ld+json">${JSON.stringify(service)}</script>
</head>
<body data-page="${esc(dataPage)}" data-breadcrumbs="${crumbAttr}">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main" class="container" style="padding:2.5rem 0 4rem;max-width:920px">
    <nav class="text-muted" style="font-size:0.85rem;margin-bottom:1rem" aria-label="Breadcrumb">${crumbNav}</nav>
    <article class="glass card" style="padding:2rem">
      <p class="eyebrow">SK Immigration Services · Updated ${TODAY}</p>
      <h1 class="display" style="font-size:clamp(1.7rem,3vw,2.35rem);margin-bottom:0.75rem">${esc(h1)}</h1>
      <p class="lead-answer"><strong>Quick answer:</strong> ${lead}</p>
      <p class="text-muted mb-2">Free consultation · Honest advice · Authorities decide visas · No guarantees · Rawalpindi office + WhatsApp nationwide</p>
      <div class="prose">
        ${sectionsHtml}
        <h2>Frequently asked questions</h2>
        <div class="faq-mini">${faqHtml}</div>
        <h2>Talk to SK Immigration</h2>
        <p>We prepare complete files for study, work, visit and Saudi processing — embassies and immigration authorities make final decisions.</p>
        <div class="hero-ctas" style="margin-top:1rem">
          <a class="btn btn-gold" href="${prefix}contact.html">Book free consultation</a>
          <a class="btn btn-whatsapp" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp +92 304 5999859</a>
          <a class="btn btn-ghost" href="${prefix}services.html">All services</a>
        </div>
      </div>
    </article>
  </main>
  <div id="site-footer"></div>
  <script src="${prefix}assets/js/config.js"></script>
  <script src="${prefix}assets/js/theme.js"></script>
  <script src="${prefix}assets/js/api.js"></script>
  <script src="${prefix}assets/js/layout.js?v=iosbar3"></script>
  <script src="${prefix}assets/js/seo.js"></script>
</body>
</html>
`;
}

function listUl(items) {
  return `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}
function listOl(items) {
  return `<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`;
}

/* ---------------- WORK PERMIT DATA ---------------- */
const WORK = [
  {
    slug: 'germany-work-permit-pakistan',
    name: 'Germany',
    short: 'Germany Work Permit Pakistan',
    code: 'de',
    lead:
      'Germany work routes from Pakistan typically need a concrete job offer (or Ausbildung contract), language readiness (often A2–B1+ German for many roles), and a complete visa file. SK Immigration packages CVs, contracts and embassy checklists — German authorities decide approvals. Service fees from <strong>PKR 80,000</strong>.',
    intro:
      'Germany is one of the strongest legal work pathways from Pakistan: skilled jobs, shortage occupations, and <a href="../ausbildung.html">Ausbildung</a> (earn-while-you-train). Success depends on a real employer, correct documents and honest language planning — not “guaranteed visa” agents.',
    requirements: [
      'Valid job offer / employment contract or Ausbildung training contract from a German employer',
      'Passport valid 6+ months with blank pages',
      'Recognized qualifications or experience matching the role (recognition may apply)',
      'German language level matching the job (often A2–B1; nursing/care usually higher)',
      'Health insurance and clean civil documents',
      'Proof you can enter legally via the correct national visa category',
    ],
    process: [
      'Free consultation — role fit, language and timeline',
      'CV packaging (German-friendly) and employer matching support where available',
      'Contract / offer review against embassy expectations',
      'Document checklist, attestation and translations',
      'National visa appointment preparation and biometrics',
      'Travel readiness briefing after decision',
    ],
    documents: [
      'Passport, photos, completed national visa forms',
      'Signed employment or Ausbildung contract',
      'CV, certificates, experience letters',
      'Language certificates (Goethe / telc / equivalent where required)',
      'Degree attestation / recognition papers if requested',
      'Insurance and fee receipts',
    ],
    fees:
      'SK Immigration work-permit support from <strong>PKR 80,000</strong> (case-by-case). Embassy visa fees, medicals, translations and flights are separate and paid to official providers.',
    timeline:
      'Often 3–8 months from ready contract to visa decision, longer if language training or degree recognition is needed.',
    mistakes: [
      'Paying agents who invent fake German job offers',
      'Applying with language far below the employer’s requirement',
      'Submitting untranslated or unattested certificates when asked',
      'Confusing tourist/visit entry with work authorization',
    ],
    related: [
      ['../ausbildung.html', 'Ausbildung portal'],
      ['../guides/ausbildung-pakistan/', 'Ausbildung Pakistan guide'],
      ['../jobs.html', 'Browse jobs'],
      ['../visa-appointment/germany-visa-appointment-pakistan/', 'Germany visa appointment'],
    ],
    faqs: [
      {
        q: 'How can I get a Germany work permit from Pakistan?',
        a: 'Secure a genuine German job or Ausbildung contract, meet language and document rules, then apply for the correct national visa. SK Immigration prepares the file; the German mission decides.',
      },
      {
        q: 'Do I need German language for a work visa?',
        a: 'Most employers require German (often A2–B1+). Some English-only tech roles exist but are competitive. We map a realistic language plan before you pay fees.',
      },
      {
        q: 'Is Ausbildung different from a work permit?',
        a: 'Ausbildung is dual vocational training with a training salary and school days. It uses a related visa path. SK covers both — see our Ausbildung pages.',
      },
      {
        q: 'What is SK Immigration’s work permit fee?',
        a: 'From PKR 80,000 for preparation support. Official embassy and medical fees are separate. No visa outcome guarantees.',
      },
      {
        q: 'Can SK Immigration guarantee a German work visa?',
        a: 'No. Only German authorities approve visas. We prepare complete, honest files and explain risks clearly.',
      },
      {
        q: 'Which jobs are common for Pakistan applicants?',
        a: 'Nursing/care Ausbildung, hospitality, mechatronics, logistics, IT and skilled trades — depending on language and employer demand.',
      },
    ],
  },
  {
    slug: 'france-work-permit-pakistan',
    name: 'France',
    short: 'France Work Permit Pakistan',
    code: 'fr',
    lead:
      'France work visas from Pakistan need a sponsoring employer, correct titre/visa category, and a complete OFII/consular file. SK Immigration supports contract review, documents and appointment prep from <strong>PKR 80,000</strong>. French authorities decide.',
    intro:
      'France offers skilled and seasonal work routes, but Pakistani applicants must show a real French employer and clean documentation. We do not sell fake “priority slots” or guarantees.',
    requirements: [
      'French employment contract / work authorization from the employer side',
      'Passport, photos and consular application forms',
      'Qualifications matching the role; translations often required',
      'Proof of accommodation and insurance as requested',
      'Clean civil status documents with legalization when asked',
    ],
    process: [
      'Profile and contract assessment',
      'Document and translation checklist',
      'Consular / VFS appointment readiness',
      'Biometrics and decision tracking',
      'Arrival / OFII steps briefing where applicable',
    ],
    documents: [
      'Passport and biometric photos',
      'Signed French contract / authorization references',
      'CV, diplomas, experience letters (translated if required)',
      'Criminal record / civil docs when requested',
      'Fee receipts and insurance',
    ],
    fees:
      'SK support from <strong>PKR 80,000</strong>. French visa fees, medicals and translations are separate.',
    timeline: 'Often 2–6 months after a valid employer authorization is ready; peak seasons take longer.',
    mistakes: [
      'Incomplete translations of diplomas',
      'Name mismatches between passport and contract',
      'Assuming Schengen tourist entry allows work',
      'Paying for non-existent French job offers',
    ],
    related: [
      ['../visa-appointment/france-visa-appointment-pakistan/', 'France appointment'],
      ['../jobs.html', 'Jobs board'],
      ['../document-services/', 'Document attestation'],
    ],
    faqs: [
      {
        q: 'How do I apply for a France work visa from Pakistan?',
        a: 'Your French employer usually starts authorization; you then file documents at the consulate/VFS. SK Immigration sequences the Pakistan-side file.',
      },
      {
        q: 'Do I need French language?',
        a: 'Many roles expect French; some international firms accept English. We assess language before you invest.',
      },
      {
        q: 'What does SK charge for France work permit help?',
        a: 'From PKR 80,000 for consultancy support. Authority fees are separate. No guarantees.',
      },
      {
        q: 'Can I convert a France visit visa to work?',
        a: 'Not as a DIY loophole. Work requires the correct authorization and visa category. We advise legal routes only.',
      },
      {
        q: 'Is France work open for low-skilled roles?',
        a: 'Some shortage and seasonal categories exist but rules are strict. We only proceed with realistic employer files.',
      },
      {
        q: 'Where is SK Immigration based?',
        a: 'Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi — WhatsApp +92 304 5999859 nationwide.',
      },
    ],
  },
  {
    slug: 'italy-work-permit-pakistan',
    name: 'Italy',
    short: 'Italy Work Permit Pakistan',
    code: 'it',
    lead:
      'Italy work from Pakistan usually depends on a Decreto Flussi quota / nulla osta and a sponsoring employer. SK Immigration helps with documents, translations and visa prep from <strong>PKR 80,000</strong>. Italian authorities decide.',
    intro:
      'Italy is popular for hospitality, agriculture and skilled trades when quotas open. Timing and employer paperwork matter more than agent promises.',
    requirements: [
      'Valid Italian work authorization / nulla osta pathway for your category',
      'Employer contract matching Italian labour rules',
      'Passport, photos, forms and fee payment',
      'Translations and legalization of key civil/education docs when asked',
      'Accommodation and insurance evidence as required',
    ],
    process: [
      'Confirm quota / category feasibility',
      'Employer paperwork review',
      'Pakistan-side document packaging',
      'Visa appointment and biometrics',
      'Travel briefing',
    ],
    documents: [
      'Passport and photos',
      'Work authorization references and contract',
      'Educational / experience documents',
      'Police / civil documents if requested',
      'Insurance and fee proof',
    ],
    fees: 'SK support from <strong>PKR 80,000</strong>. Embassy and medical fees separate.',
    timeline: 'Highly quota-dependent — often several months around Decreto Flussi windows.',
    mistakes: [
      'Paying for “guaranteed Decreto Flussi” seats',
      'Wrong document legalization order',
      'Expired passport pages',
      'Ignoring Italian language needs for the role',
    ],
    related: [
      ['../visa-appointment/italy-visa-appointment-pakistan/', 'Italy appointment'],
      ['../jobs.html', 'Jobs'],
      ['../study-visa/italy-study-visa-pakistan/', 'Italy study visa'],
    ],
    faqs: [
      {
        q: 'What is Decreto Flussi for Italy work?',
        a: 'Italy’s annual decree setting quotas for non-EU workers. Timing is critical. SK explains current windows honestly — we do not invent quotas.',
      },
      {
        q: 'Can Pakistani workers get Italy jobs without Italian?',
        a: 'Some roles hire with basic Italian; hospitality often expects conversational Italian. We assess fit case by case.',
      },
      {
        q: 'SK Immigration Italy work fee?',
        a: 'From PKR 80,000 for file preparation. No visa guarantees.',
      },
      {
        q: 'Do I need attestation for Italy work?',
        a: 'Often yes for degrees and civil docs — we sequence Apostille/MOFA/embassy steps when required.',
      },
      {
        q: 'Is seasonal work available?',
        a: 'Seasonal categories appear in some decrees. Documents and employer compliance still matter.',
      },
      {
        q: 'Who decides the visa?',
        a: 'Italian consular authorities. SK prepares; we never sell fake approvals.',
      },
    ],
  },
  {
    slug: 'portugal-work-permit-pakistan',
    name: 'Portugal',
    short: 'Portugal Work Permit Pakistan',
    code: 'pt',
    lead:
      'Portugal work visas need a Portuguese job offer that meets salary/contract rules and a complete SEF/consular file. SK Immigration supports preparation from <strong>PKR 80,000</strong>.',
    intro:
      'Portugal attracts hospitality, tech and general skilled workers. Strong contracts and proof of means matter; tourist entry is not a work shortcut.',
    requirements: [
      'Portuguese employment contract meeting legal thresholds',
      'Passport, forms, photos',
      'Qualifications / experience matching the role',
      'Criminal record certificate and translations when required',
      'Accommodation proof and insurance as requested',
    ],
    process: [
      'Contract eligibility check',
      'Document and translation plan',
      'Consular submission prep',
      'Biometrics and follow-up',
      'Arrival registration briefing',
    ],
    documents: [
      'Passport, photos, application form',
      'Signed contract and employer details',
      'Diplomas and experience letters',
      'Police clearance (attested/apostilled as needed)',
      'Insurance and fee receipts',
    ],
    fees: 'SK from <strong>PKR 80,000</strong>. Official fees separate.',
    timeline: 'Often 2–5 months after a compliant contract is ready.',
    mistakes: [
      'Contracts below legal salary thresholds',
      'Missing criminal record legalization',
      'Using visit visas intending to work',
      'Unverified “Portugal job guarantee” agents',
    ],
    related: [
      ['../blog/portugal-student-visa/', 'Portugal study guide'],
      ['../jobs.html', 'Jobs'],
      ['../document-services/apostille-pakistan/', 'Apostille Pakistan'],
    ],
    faqs: [
      {
        q: 'How to get a Portugal work visa from Pakistan?',
        a: 'Obtain a compliant Portuguese job offer, prepare documents (often including criminal record), then apply at the consulate. SK packages the file.',
      },
      {
        q: 'Do I need Portuguese language?',
        a: 'Helpful for many jobs; some international companies use English. We map language realistically.',
      },
      {
        q: 'SK fee for Portugal work permit?',
        a: 'From PKR 80,000. Authority fees separate. No guarantees.',
      },
      {
        q: 'Is Portugal easier than Germany for work?',
        a: 'Different rules — not “easier.” Employer compliance and salary thresholds matter. We compare honestly in consultation.',
      },
      {
        q: 'Can family join later?',
        a: 'Family reunification has separate rules after you hold the right residence status. Ask during consult.',
      },
      {
        q: 'Does SK guarantee Portugal visas?',
        a: 'No. Portuguese authorities decide every case.',
      },
    ],
  },
  {
    slug: 'spain-work-permit-pakistan',
    name: 'Spain',
    short: 'Spain Work Permit Pakistan',
    code: 'es',
    lead:
      'Spain work authorization from Pakistan requires a sponsoring employer and the correct national visa category. SK Immigration prepares documents and appointment files from <strong>PKR 80,000</strong>.',
    intro:
      'Spain offers skilled and shortage pathways when employers complete authorization. Spanish language helps for most customer-facing roles.',
    requirements: [
      'Spanish work authorization / contract from employer',
      'Passport, forms, photos',
      'Qualifications matching the occupation',
      'Medical / police certificates when requested',
      'Translations and legalization as required',
    ],
    process: [
      'Employer authorization review',
      'Pakistan document packaging',
      'Visa appointment prep',
      'Biometrics and decision tracking',
      'Arrival steps briefing',
    ],
    documents: [
      'Passport and photos',
      'Contract / authorization papers',
      'CV, degrees, experience letters',
      'Police / medical as instructed',
      'Fee and insurance proof',
    ],
    fees: 'SK from <strong>PKR 80,000</strong>. Official fees separate.',
    timeline: 'Often 2–6 months depending on authorization speed.',
    mistakes: [
      'Fake job letters from unlicensed brokers',
      'Ignoring Spanish language needs',
      'Incomplete apostille chains',
      'Tourist entry for work',
    ],
    related: [
      ['../blog/spain-student-visa/', 'Spain study guide'],
      ['../jobs.html', 'Jobs'],
      ['../document-services/', 'Attestation'],
    ],
    faqs: [
      {
        q: 'Spain work permit requirements for Pakistanis?',
        a: 'Typically a Spanish employer authorization, complete personal documents, and the correct national visa. SK builds the checklist for your case.',
      },
      {
        q: 'Is Spanish mandatory?',
        a: 'Often yes for local jobs. Some multinational roles accept English. We assess before you pay.',
      },
      {
        q: 'SK Spain work fee?',
        a: 'From PKR 80,000. No outcome guarantees.',
      },
      {
        q: 'Seasonal agriculture visas?',
        a: 'Some seasonal programs exist with strict employer rules. We only proceed with verifiable offers.',
      },
      {
        q: 'Visit vs work Spain?',
        a: 'Visit visas forbid employment. Work needs authorization. Never mix the two.',
      },
      {
        q: 'Where to contact SK?',
        a: 'WhatsApp +92 304 5999859 or Rawalpindi office.',
      },
    ],
  },
  {
    slug: 'poland-work-permit-pakistan',
    name: 'Poland',
    short: 'Poland Work Permit Pakistan',
    code: 'pl',
    lead:
      'Poland work from Pakistan typically needs a Polish employer’s work permit / declaration and a national visa. SK Immigration supports file prep from <strong>PKR 80,000</strong>.',
    intro:
      'Poland has strong demand in manufacturing, logistics and services. Employer paperwork (zezwolenie / oświadczenie types) must match your visa category.',
    requirements: [
      'Polish work permit or eligible employer declaration',
      'Employment contract details',
      'Passport, photos, forms',
      'Qualifications and experience evidence',
      'Insurance and accommodation as requested',
    ],
    process: [
      'Verify employer documents',
      'Build Pakistan-side checklist',
      'Translations / legalization if needed',
      'Visa appointment and biometrics',
      'Travel briefing',
    ],
    documents: [
      'Passport, photos, visa form',
      'Work permit / declaration originals or certified copies',
      'CV and certificates',
      'Civil docs if requested',
      'Fee receipts',
    ],
    fees: 'SK from <strong>PKR 80,000</strong>. Consular fees separate.',
    timeline: 'Often 1–4 months after employer papers are ready.',
    mistakes: [
      'Mismatched permit type vs visa category',
      'Unverified Polish “agents” selling fake permits',
      'Expired medicals',
      'Weak travel history explanations when asked',
    ],
    related: [
      ['../blog/poland-student-visa/', 'Poland study'],
      ['../jobs.html', 'Jobs'],
      ['../answers/hungary-vs-poland-student-visa.html', 'Hungary vs Poland'],
    ],
    faqs: [
      {
        q: 'How to get Poland work visa from Pakistan?',
        a: 'Your Polish employer obtains the correct permit/declaration; you apply for the national visa with a complete file. SK prepares your side.',
      },
      {
        q: 'Do I need Polish language?',
        a: 'Helpful on factory floors and services; some workplaces use English supervisors. Case by case.',
      },
      {
        q: 'SK Poland work fee?',
        a: 'From PKR 80,000. No guarantees.',
      },
      {
        q: 'Is Poland work easier than Western Europe?',
        a: 'Employer demand can be strong, but document accuracy still decides outcomes. We do not call any country “easy.”',
      },
      {
        q: 'Can I take family?',
        a: 'Family reunification has separate eligibility after you hold proper residence. Ask in consult.',
      },
      {
        q: 'Who is SK Immigration?',
        a: 'SECP-registered immigration consultancy in Rawalpindi, OEP partner licence NO/1061, WhatsApp +92 304 5999859.',
      },
    ],
  },
  {
    slug: 'uae-work-visa-pakistan',
    name: 'UAE / Dubai',
    short: 'UAE Work Visa Pakistan',
    code: 'ae',
    lead:
      'UAE/Dubai work visas are employer-sponsored. SK Immigration helps with CV packaging, attestation chains (MOFA / Musadaqa / embassy) and file readiness from <strong>PKR 80,000</strong>. UAE authorities and employers decide.',
    intro:
      'Gulf work succeeds when the employer is real and documents are attested in the correct order. We partner with licensed OEP channels where required (partner OEP licence <strong>NO/1061</strong>).',
    requirements: [
      'Job offer / entry permit from a UAE employer or licensed agency channel',
      'Passport with required validity',
      'Attested educational documents when the role requires them',
      'Medical fitness as per UAE rules',
      'Emirates ID / labour steps after arrival as instructed by employer',
    ],
    process: [
      'Offer verification and role fit',
      'Attestation sequencing (HEC/MOFA/embassy/Musadaqa as applicable)',
      'Pre-departure document pack',
      'Travel and protector guidance when applicable',
      'Post-arrival checklist briefing',
    ],
    documents: [
      'Passport and photos',
      'Offer / visa authorization',
      'Degree and experience letters (attested as needed)',
      'CNIC / civil docs',
      'Medical reports',
    ],
    fees: 'SK from <strong>PKR 80,000</strong> for work-file support. UAE medical, visa and attestation authority fees separate.',
    timeline: 'Often 2–8 weeks after attestation and employer entry permit are ready — varies by emirate and role.',
    mistakes: [
      'Paying unlicensed agents for fake Dubai jobs',
      'Wrong attestation order (skipping MOFA/embassy steps)',
      'Degree name mismatches',
      'Confusing visit visa with employment visa',
    ],
    related: [
      ['../blog/dubai-visit-visa/', 'Dubai visit & work guide'],
      ['../document-services/musadaqa-verification/', 'Musadaqa'],
      ['../hire-workers-from-pakistan/', 'Hire from Pakistan'],
      ['../saudi-visa/saudi-visa-processing-pakistan/', 'Saudi work visa processing'],
    ],
    faqs: [
      {
        q: 'How to get Dubai work visa from Pakistan?',
        a: 'A UAE employer (or lawful recruitment channel) sponsors your entry permit; you complete medicals and attested documents. SK prepares attestation and file support.',
      },
      {
        q: 'Do degrees need Musadaqa?',
        a: 'Many professional roles need the UAE attestation chain including Musadaqa/QVP steps. We sequence this correctly.',
      },
      {
        q: 'SK UAE work fee?',
        a: 'From PKR 80,000. Authority fees separate.',
      },
      {
        q: 'Is SK linked to OEP?',
        a: 'Yes — we partner with licensed OEPs (partner licence NO/1061) for overseas employment compliance where applicable.',
      },
      {
        q: 'Visit to work conversion in UAE?',
        a: 'Only through proper employer process — not a DIY loophole. We advise legal channels only.',
      },
      {
        q: 'Can SK guarantee UAE visa?',
        a: 'No. Employers and UAE authorities decide.',
      },
    ],
  },
  {
    slug: 'uk-work-visa-pakistan',
    name: 'United Kingdom',
    short: 'UK Work Visa Pakistan',
    code: 'gb',
    lead:
      'UK work routes (e.g. Skilled Worker) need a licensed sponsor Certificate of Sponsorship, English evidence and correct funds rules. SK Immigration prepares applications from <strong>PKR 80,000</strong>. UKVI decides.',
    intro:
      'The UK is highly regulated: only Home Office licensed sponsors can issue CoS. We never invent sponsorships.',
    requirements: [
      'Certificate of Sponsorship from a licensed UK sponsor',
      'Job meeting skill and salary thresholds for the route',
      'English language at required CEFR level',
      'TB test for Pakistan residents when required',
      'Passport, TB certificate, and online UKVI application',
    ],
    process: [
      'Verify sponsor licence / CoS authenticity',
      'Document and English plan',
      'Online application coaching',
      'Biometrics appointment prep',
      'Decision tracking and travel briefing',
    ],
    documents: [
      'Passport and CoS details',
      'English test results',
      'TB certificate',
      'Degree / professional docs if claimed on CoS',
      'Financial evidence if required by the route',
    ],
    fees: 'SK from <strong>PKR 80,000</strong>. UKVI fees, IHS and TB costs are separate and often substantial.',
    timeline: 'Often several weeks to a few months after CoS issuance, depending on UKVI processing.',
    mistakes: [
      'Fake CoS / unlicensed “sponsors”',
      'Wrong English test type',
      'Underestimating Immigration Health Surcharge costs',
      'Incomplete work history explanations',
    ],
    related: [
      ['../visa-appointment/uk-visa-appointment-pakistan/', 'UK appointment'],
      ['../study-visa/uk-study-visa-pakistan/', 'UK study visa'],
      ['../jobs.html', 'Jobs'],
    ],
    faqs: [
      {
        q: 'How to get UK Skilled Worker visa from Pakistan?',
        a: 'A licensed UK sponsor issues a CoS; you apply on GOV.UK with English, TB and identity documents. SK prepares the file; UKVI decides.',
      },
      {
        q: 'Can SK find me a UK sponsor?',
        a: 'We help with CV packaging and realistic guidance. Sponsorship must come from a real licensed employer — we do not sell fake CoS.',
      },
      {
        q: 'SK UK work fee?',
        a: 'From PKR 80,000. UKVI/IHS/TB fees separate.',
      },
      {
        q: 'Do I need IELTS for UK work?',
        a: 'Usually an approved English test at the level required by the visa route (unless exempt).',
      },
      {
        q: 'Graduate route vs Skilled Worker?',
        a: 'Graduate Route is for eligible UK graduates. Skilled Worker needs sponsorship. Different paths.',
      },
      {
        q: 'Visa guarantee?',
        a: 'Never. UKVI decides.',
      },
    ],
  },
  {
    slug: 'canada-work-permit-pakistan',
    name: 'Canada',
    short: 'Canada Work Permit Pakistan',
    code: 'ca',
    lead:
      'Canada work permits usually need a job offer / LMIA (unless exempt) and a complete IRCC application. SK Immigration supports document prep from <strong>PKR 80,000</strong>. IRCC decides.',
    intro:
      'Canada work is opportunity-rich but document-heavy: biometrics, medicals, police certificates and employer compliance.',
    requirements: [
      'Job offer and LMIA or LMIA-exempt pathway',
      'Passport, photos, IMM forms',
      'Proof you will leave if required by temporary status rules',
      'Medical exam and police certificates when requested',
      'Biometrics for Pakistan applicants',
    ],
    process: [
      'Pathway assessment (employer-specific vs open where eligible)',
      'Document checklist',
      'Online application packaging',
      'Biometrics / medical scheduling support',
      'Decision follow-up',
    ],
    documents: [
      'Passport and photos',
      'Offer letter / LMIA docs',
      'CV, degrees, experience letters',
      'Police certificates',
      'Medical eMedical report when required',
    ],
    fees: 'SK from <strong>PKR 80,000</strong>. IRCC fees and medicals separate.',
    timeline: 'Often several months; medicals and biometrics add time.',
    mistakes: [
      'Fake Canadian job offers',
      'Missing police certificates from all countries of residence',
      'Inconsistent employment dates',
      'Ignoring Provincial nominee vs work-permit differences',
    ],
    related: [
      ['../study-visa/canada-study-visa-pakistan/', 'Canada study'],
      ['../visa-appointment/canada-visa-appointment-pakistan/', 'Canada appointment'],
      ['../jobs.html', 'Jobs'],
    ],
    faqs: [
      {
        q: 'How to get Canada work permit from Pakistan?',
        a: 'Most applicants need a qualifying job offer and LMIA (unless exempt), then apply to IRCC with biometrics/medicals. SK prepares documents.',
      },
      {
        q: 'Is Express Entry a work permit?',
        a: 'Express Entry is mainly permanent residence. Work permits are temporary. We explain which path fits your profile.',
      },
      {
        q: 'SK Canada work fee?',
        a: 'From PKR 80,000. IRCC fees separate. No guarantees.',
      },
      {
        q: 'Do I need IELTS for work permit?',
        a: 'Not always for the permit itself, but employers and PR pathways often need language scores.',
      },
      {
        q: 'Can students work in Canada?',
        a: 'Study permits have separate work-hour rules. Do not confuse with employer-specific work permits.',
      },
      {
        q: 'Who decides?',
        a: 'IRCC. SK prepares honest files only.',
      },
    ],
  },
  {
    slug: 'australia-work-visa-pakistan',
    name: 'Australia',
    short: 'Australia Work Visa Pakistan',
    code: 'au',
    lead:
      'Australia work visas need the correct subclass (employer-sponsored or skilled), skills assessment where required, and Department of Home Affairs approval. SK support from <strong>PKR 80,000</strong>.',
    intro:
      'Australia is points- and sponsorship-driven. We map realistic subclasses — we do not sell fake invitations.',
    requirements: [
      'Eligible occupation and skills assessment when required',
      'Employer nomination or skilled invitation pathway',
      'English test at required score',
      'Health and character checks',
      'Passport and complete ImmiAccount application',
    ],
    process: [
      'Occupation and pathway review',
      'Skills assessment guidance',
      'Document packaging',
      'Application and biometrics/health',
      'Decision tracking',
    ],
    documents: [
      'Passport, photos',
      'Skills assessment outcome',
      'Employment references',
      'English results',
      'Police and medical clearances',
    ],
    fees: 'SK from <strong>PKR 80,000</strong>. Home Affairs and assessment body fees separate and can be high.',
    timeline: 'Often many months depending on subclass and assessment queues.',
    mistakes: [
      'Wrong occupation code',
      'Inflated work experience claims',
      'Expired English tests',
      'Unregistered migration “guarantees”',
    ],
    related: [
      ['../study-visa/australia-study-visa-pakistan/', 'Australia study'],
      ['../visa-appointment/australia-visa-appointment-pakistan/', 'Australia appointment'],
      ['../jobs.html', 'Jobs'],
    ],
    faqs: [
      {
        q: 'Australia work visa from Pakistan — how?',
        a: 'Identify the correct subclass (sponsored or skilled), complete skills assessment if required, then apply with health/character checks. SK guides documents.',
      },
      {
        q: 'Do I need a job offer?',
        a: 'Employer-sponsored visas need nomination. Some skilled visas need invitations instead. We clarify which fits you.',
      },
      {
        q: 'SK Australia work fee?',
        a: 'From PKR 80,000. Government fees separate.',
      },
      {
        q: 'IELTS for Australia work?',
        a: 'Usually yes at the score required by the visa/occupation. Alternatives may exist — verify current rules.',
      },
      {
        q: 'Guarantee?',
        a: 'No. Home Affairs decides.',
      },
      {
        q: 'Contact SK Immigration?',
        a: 'WhatsApp +92 304 5999859 · Rawalpindi.',
      },
    ],
  },
  {
    slug: 'saudi-work-visa-pakistan',
    name: 'Saudi Arabia',
    short: 'Saudi Work Visa Pakistan',
    code: 'sa',
    lead:
      'SK Immigration provides <strong>complete Saudi work visa processing</strong> from Pakistan for <strong>PKR 15,000</strong> — package includes <strong>E-Number biometrics, Protector and visa processing</strong> support. Authority/medical fees are separate. Saudi authorities decide outcomes.',
    intro:
      'This is not “E-Number only.” Our PKR 15,000 package is end-to-end <strong>Saudi work visa processing support</strong>: documentation guidance, E-Number biometrics assistance, Protector included, and visa processing support. We work with compliant overseas employment channels (OEP partner licence <strong>NO/1061</strong>).',
    requirements: [
      'Valid passport and photos',
      'Employer visa authorization / job details',
      'Medical fitness as required',
      'Civil and educational documents with correct attestation when requested',
      'E-Number biometrics and Protector steps as sequenced for your case',
    ],
    process: [
      'Free consultation and category confirmation',
      'Document checklist and attestation guidance',
      'E-Number biometrics assistance',
      'Protector support (included in package)',
      'Visa processing support and travel readiness',
    ],
    documents: [
      'Passport and photographs',
      'Offer / visa authorization references',
      'CNIC and civil documents',
      'Educational certificates if the role requires them',
      'Medical reports as instructed',
    ],
    fees:
      '<strong>PKR 15,000</strong> complete Saudi work visa processing support (E-Number + Protector + visa processing). Official medical, insurance and government fees are paid separately.',
    timeline:
      'Many files move in roughly 1–4 weeks after documents and medicals are complete; Saudi authority times vary.',
    mistakes: [
      'Thinking the package is “E-Number only” — it is complete processing support',
      'Paying unofficial agents who promise guaranteed Saudi visas',
      'Name mismatches across passport and authorization',
      'Out-of-order attestation',
    ],
    related: [
      ['../saudi-visa/saudi-visa-processing-pakistan/', 'Full Saudi processing page'],
      ['../document-services/saudi-embassy-attestation/', 'Saudi Embassy attestation'],
      ['../hire-workers-from-pakistan/', 'Hire workers'],
      ['../guides/saudi-e-number-pakistan/', 'E-Number step guide'],
    ],
    faqs: [
      {
        q: 'What is included in PKR 15,000 Saudi package?',
        a: 'Complete Saudi work visa processing support: E-Number biometrics assistance, Protector included, and visa processing support. Authority fees are separate.',
      },
      {
        q: 'Is this only E-Number?',
        a: 'No. E-Number is one step inside complete Saudi work visa processing covered by the PKR 15,000 package.',
      },
      {
        q: 'Is Protector included?',
        a: 'Yes — Protector support is included. Government Protector charges, if any, are paid to the authority.',
      },
      {
        q: 'Are you OEP licensed?',
        a: 'SK Immigration is SECP-registered and partners with licensed OEPs (partner OEP licence NO/1061) for overseas employment compliance.',
      },
      {
        q: 'Do you guarantee Saudi visa approval?',
        a: 'No. Saudi authorities decide. We prepare complete files honestly.',
      },
      {
        q: 'Where is the detailed page?',
        a: 'See https://skimmigrationservices.works/saudi-visa/saudi-visa-processing-pakistan/',
      },
    ],
    price: 15000,
  },
];

/* ---------------- VISIT VISA DATA ---------------- */
const VISIT = [
  {
    slug: 'germany-visit-visa-pakistan',
    name: 'Germany',
    region: 'Schengen',
    lead:
      'Germany Schengen visit visas from Pakistan need strong home ties, funds, travel insurance (€30,000+), itinerary and a complete VFS file. SK Immigration prepares visit files from <strong>PKR 30,000</strong>. German missions decide.',
    purpose: 'tourism, family visit, business meetings',
    requirements: [
      'Passport valid 3+ months beyond stay with blank pages',
      'Schengen form, photos, appointment confirmation',
      'Travel medical insurance minimum €30,000 coverage',
      'Flight/hotel itinerary or invitation letter (Verpflichtungserklärung if applicable)',
      'Bank statements and employment/business proof showing Pakistan ties',
      'Cover letter explaining purpose and return plan',
    ],
    process: [
      'Purpose assessment (tourist / family / business)',
      'Document checklist and invitation review',
      'Insurance and itinerary packaging',
      'VFS appointment readiness',
      'Biometrics and decision tracking',
    ],
    documents: [
      'Passport, photos, form',
      'Insurance policy',
      'Itinerary / invitation',
      '6-month bank statements (typical)',
      'Salary slips / NTN / business docs',
      'Property / family ties evidence',
    ],
    fees: 'SK visit support from <strong>PKR 30,000</strong>. VFS/embassy fees and insurance separate.',
    timeline: 'Often 2–6 weeks after biometrics; peak summer/winter longer.',
    mistakes: [
      'Weak Pakistan ties (job/family/property unexplained)',
      'Insurance below Schengen minimum',
      'Overstay history or inconsistent travel story',
      'Using visit visa intending to work/study long-term',
    ],
    faqs: [
      {
        q: 'Germany visit visa requirements from Pakistan?',
        a: 'Passport, form, insurance €30k+, funds, itinerary/invitation, and proof you will return. SK Immigration builds a complete file from PKR 30,000.',
      },
      {
        q: 'Do I need an invitation for Germany?',
        a: 'Helpful for family visits; tourists can use hotel bookings. Formal Verpflichtungserklärung strengthens some family cases.',
      },
      {
        q: 'How much bank balance for Germany visit?',
        a: 'Enough for trip length plus ties evidence — not a single magic number. We review statements honestly.',
      },
      {
        q: 'Schengen visa validity?',
        a: 'Often short stays up to 90 days in 180-day period — exact validity is decided by the mission.',
      },
      {
        q: 'Can I work on Germany visit visa?',
        a: 'No. Work needs a work/national visa. Visit is tourism/family/business meetings only.',
      },
      {
        q: 'SK guarantee?',
        a: 'No. Consulates decide. We prepare strong, honest files.',
      },
    ],
  },
  {
    slug: 'france-visit-visa-pakistan',
    name: 'France',
    region: 'Schengen',
    lead:
      'France Schengen visit visas need purpose proof, funds, insurance and strong return ties. SK Immigration visit packages from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, short business',
    requirements: [
      'Valid passport and Schengen application',
      'Travel insurance €30,000+',
      'Accommodation proof (hotel or host attestation)',
      'Funds and employment/business evidence',
      'Itinerary matching France as main destination when applying via France',
    ],
    process: [
      'Confirm main destination / first entry logic',
      'Host letter or hotel plan',
      'Financial and employment file',
      'TLS/VFS appointment prep',
      'Biometrics',
    ],
    documents: [
      'Passport, photos, form',
      'Insurance',
      'Invitation / hotel bookings',
      'Bank statements',
      'Leave letter / business registration',
      'Family registry if visiting relatives',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>. Consular/VFS fees separate.',
    timeline: 'Often 2–8 weeks seasonally.',
    mistakes: [
      'Applying via wrong Schengen country',
      'Hotel bookings that do not match itinerary',
      'Unexplained large cash deposits',
      'Weak cover letter',
    ],
    faqs: [
      {
        q: 'France tourist visa from Pakistan — documents?',
        a: 'Passport, form, insurance, funds, accommodation, employment ties and itinerary. SK prepares the complete pack.',
      },
      {
        q: 'Family invitation France?',
        a: 'Host attestation / accommodation proof helps. Still need your own funds and return ties.',
      },
      {
        q: 'Business visit France?',
        a: 'Need inviting company letter and your employer letter explaining meetings — not employment in France.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000. No guarantees.',
      },
      {
        q: 'Refusal reasons?',
        a: 'Insufficient ties, unclear purpose, weak funds, or inconsistent travel history are common.',
      },
      {
        q: 'Contact?',
        a: 'WhatsApp +92 304 5999859 · Rawalpindi.',
      },
    ],
  },
  {
    slug: 'italy-visit-visa-pakistan',
    name: 'Italy',
    region: 'Schengen',
    lead:
      'Italy visit visas from Pakistan require Schengen insurance, funds, itinerary and clear purpose. SK Immigration from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, religious/cultural trips, business',
    requirements: [
      'Passport, form, photos',
      'Insurance €30,000+',
      'Hotel or invitation (lettera di invito)',
      'Bank statements and job/business proof',
      'Travel plan covering Italy as main stay when filing via Italy',
    ],
    process: [
      'Purpose and destination check',
      'Invitation / hotel packaging',
      'Financial file review',
      'Appointment prep',
      'Biometrics',
    ],
    documents: [
      'Passport pack',
      'Insurance',
      'Invitation or bookings',
      'Funds evidence',
      'Employment / NTN / business docs',
      'Cover letter',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 3–8 weeks.',
    mistakes: [
      'Copy-paste itineraries',
      'Insurance bought after appointment',
      'Ignoring previous Schengen refusals without explanation',
      'Overstaying risk signals',
    ],
    faqs: [
      {
        q: 'Italy visit visa requirements Pakistan?',
        a: 'Standard Schengen set: passport, insurance, funds, accommodation, ties. SK builds your checklist.',
      },
      {
        q: 'Letter of invitation Italy?',
        a: 'Useful for family/friends visits; must match host ID and address rules.',
      },
      {
        q: 'How long can I stay?',
        a: 'Usually up to 90 days in 180 — exact sticker decides.',
      },
      {
        q: 'SK fee Italy visit?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Can I study on Italy visit visa?',
        a: 'No long-term study. Use a student visa for programs.',
      },
      {
        q: 'Guarantee?',
        a: 'No. Consulate decides.',
      },
    ],
  },
  {
    slug: 'spain-visit-visa-pakistan',
    name: 'Spain',
    region: 'Schengen',
    lead:
      'Spain Schengen visit files need purpose, funds, insurance and return ties. SK Immigration from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    requirements: [
      'Passport and Schengen form',
      'Insurance €30,000+',
      'Accommodation proof',
      'Funds and employment evidence',
      'Itinerary aligned with Spain application',
    ],
    process: [
      'File strategy',
      'Document collection',
      'BLS/VFS prep',
      'Biometrics',
      'Decision follow-up',
    ],
    documents: [
      'Passport, photos',
      'Insurance',
      'Bookings / invitation',
      'Bank statements',
      'Job letter / business proof',
      'Cover letter',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–6 weeks.',
    mistakes: [
      'Weak employment proof',
      'Round-trip tickets missing when asked',
      'Unrealistic multi-country itineraries',
      'Cash-heavy unexplained deposits',
    ],
    faqs: [
      {
        q: 'Spain tourist visa from Pakistan?',
        a: 'Prepare Schengen documents with Spain as main destination. SK packages from PKR 30,000.',
      },
      {
        q: 'Invitation letter Spain?',
        a: 'Host carta de invitación strengthens family visits when issued correctly.',
      },
      {
        q: 'Funds required?',
        a: 'Enough for daily costs × days plus ties — we review case by case.',
      },
      {
        q: 'Business visit?',
        a: 'Need Spanish company invitation and your employer letter.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000. No guarantees.',
      },
      {
        q: 'Contact SK?',
        a: 'WhatsApp +92 304 5999859.',
      },
    ],
  },
  {
    slug: 'netherlands-visit-visa-pakistan',
    name: 'Netherlands',
    region: 'Schengen',
    lead:
      'Netherlands visit visas are Schengen short-stay. Strong ties and clear purpose matter. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business, conferences',
    requirements: [
      'Passport, form, photos',
      'Insurance €30,000+',
      'Proof of purpose (invite / tickets / conference)',
      'Funds and socio-economic ties to Pakistan',
      'Accommodation details',
    ],
    process: [
      'Purpose mapping',
      'Document pack',
      'VFS appointment',
      'Biometrics',
      'Tracking',
    ],
    documents: [
      'Passport pack',
      'Insurance',
      'Invitation / bookings',
      'Bank + job proof',
      'Cover letter',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–6 weeks.',
    mistakes: [
      'Unclear conference purpose',
      'Weak return ties',
      'Incomplete sponsor documents',
      'Prior refusals unexplained',
    ],
    faqs: [
      {
        q: 'Netherlands visit visa Pakistan requirements?',
        a: 'Schengen standard set plus clear purpose. SK prepares the file.',
      },
      {
        q: 'Sponsor in Netherlands?',
        a: 'Possible; sponsor proof must be complete and lawful.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Can I visit other Schengen countries?',
        a: 'Often yes within sticker validity if Netherlands was correctly chosen as main destination.',
      },
      {
        q: 'Work on visit visa?',
        a: 'No.',
      },
      {
        q: 'Guarantee?',
        a: 'No.',
      },
    ],
  },
  {
    slug: 'portugal-visit-visa-pakistan',
    name: 'Portugal',
    region: 'Schengen',
    lead:
      'Portugal Schengen visit visas need complete funds, insurance and purpose docs. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    requirements: [
      'Passport and Schengen forms',
      'Insurance €30,000+',
      'Accommodation and itinerary',
      'Financial means and Pakistan ties',
      'Invitation when visiting hosts',
    ],
    process: [
      'Assessment',
      'Checklist',
      'Packaging',
      'Appointment',
      'Biometrics',
    ],
    documents: [
      'Passport pack',
      'Insurance',
      'Bookings / invite',
      'Bank statements',
      'Employment proof',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–6 weeks.',
    mistakes: [
      'Thin bank history',
      'No leave approval from employer',
      'Mismatched travel dates',
      'Ignoring prior refusals',
    ],
    faqs: [
      {
        q: 'Portugal tourist visa from Pakistan?',
        a: 'Full Schengen file with Portugal as main destination. SK helps from PKR 30,000.',
      },
      {
        q: 'Family visit Portugal?',
        a: 'Host letter + your ties/funds. Both matter.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Processing time?',
        a: 'Often a few weeks after biometrics; peaks vary.',
      },
      {
        q: 'Study on visit?',
        a: 'No — use student visa.',
      },
      {
        q: 'Guarantee?',
        a: 'No.',
      },
    ],
  },
  {
    slug: 'poland-visit-visa-pakistan',
    name: 'Poland',
    region: 'Schengen',
    lead:
      'Poland visit visas follow Schengen rules with Poland-specific invitation formats. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    requirements: [
      'Passport, form, photos',
      'Insurance €30,000+',
      'Invitation (zaproszenie) or hotel proof',
      'Funds and employment ties',
      'Travel plan',
    ],
    process: [
      'Invitation review',
      'Financial packaging',
      'VFS prep',
      'Biometrics',
      'Follow-up',
    ],
    documents: [
      'Passport pack',
      'Insurance',
      'Invitation / hotels',
      'Bank + job docs',
      'Cover letter',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–5 weeks.',
    mistakes: [
      'Invalid invitation format',
      'Weak ties',
      'Unrealistic budgets',
      'Document name mismatches',
    ],
    faqs: [
      {
        q: 'Poland visit visa requirements?',
        a: 'Schengen docs + Poland invitation or hotels. SK prepares.',
      },
      {
        q: 'What is zaproszenie?',
        a: 'A formal Polish invitation document used in many family/friend visits.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Business visit?',
        a: 'Need Polish company letter and your employer letter.',
      },
      {
        q: 'Can I work?',
        a: 'No on visit visa.',
      },
      {
        q: 'Guarantee?',
        a: 'No.',
      },
    ],
  },
  {
    slug: 'hungary-visit-visa-pakistan',
    name: 'Hungary',
    region: 'Schengen',
    lead:
      'Hungary Schengen visit visas need purpose, funds, insurance and ties. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    requirements: [
      'Passport and Schengen application',
      'Insurance €30,000+',
      'Accommodation / invitation',
      'Funds and return ties',
      'Clear itinerary',
    ],
    process: [
      'Purpose check',
      'Docs',
      'Appointment',
      'Biometrics',
      'Tracking',
    ],
    documents: [
      'Passport pack',
      'Insurance',
      'Invite / hotels',
      'Bank + employment',
      'Cover letter',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–5 weeks.',
    mistakes: [
      'Tourist story without bookings',
      'Weak employment letters',
      'Insurance gaps',
      'Prior refusals ignored',
    ],
    faqs: [
      {
        q: 'Hungary visit visa Pakistan?',
        a: 'Standard Schengen file. SK supports from PKR 30,000.',
      },
      {
        q: 'Invitation needed?',
        a: 'Recommended for family; hotels OK for tourism.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Processing?',
        a: 'Often a few weeks after biometrics.',
      },
      {
        q: 'Work allowed?',
        a: 'No.',
      },
      {
        q: 'Guarantee?',
        a: 'No.',
      },
    ],
  },
  {
    slug: 'uk-visit-visa-pakistan',
    name: 'United Kingdom',
    region: 'UK',
    lead:
      'UK Standard Visitor visas need a clear purpose, funds, and strong Pakistan ties. SK Immigration prepares UK visit files from <strong>PKR 30,000</strong>. UKVI decides.',
    purpose: 'tourism, family, business visitor, short courses under visitor rules',
    requirements: [
      'Valid passport and online GOV.UK application',
      'Proof of funds covering the trip without unauthorized work',
      'Employment / business / study ties in Pakistan',
      'Invitation letter for family or business visits when applicable',
      'Travel plan and accommodation',
      'TB test only if required by category (usually not for short standard visitor)',
    ],
    process: [
      'Purpose and risk assessment',
      'Document and bank review',
      'Online form coaching',
      'VAC biometrics prep',
      'Decision tracking',
    ],
    documents: [
      'Passport and photos',
      'Bank statements (typically 6 months)',
      'Salary slips / NTN / business docs',
      'Invitation + sponsor status docs if invited',
      'Property / family evidence',
      'Cover letter',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>. UKVI and VAC fees separate.',
    timeline: 'Often 3–8 weeks; priority services cost extra and are not a guarantee.',
    mistakes: [
      'Vague “tourism” with no plan or funds',
      'Sponsor claiming support without evidence',
      'Inconsistent employment history',
      'Previous overstays unexplained',
      'Intending to work or switch illegally',
    ],
    faqs: [
      {
        q: 'UK visit visa requirements from Pakistan?',
        a: 'Online application, funds, ties to Pakistan, purpose evidence, and biometrics. SK Immigration prepares the full file from PKR 30,000.',
      },
      {
        q: 'How much bank balance for UK visit visa?',
        a: 'Enough for your itinerary plus ongoing Pakistan commitments — UKVI looks at credibility, not a fixed public number. We review statements honestly.',
      },
      {
        q: 'Do I need a sponsor for UK visit?',
        a: 'Not always. Family/business visits often use invitations; tourists can self-fund with hotels.',
      },
      {
        q: 'Can I study on UK visitor visa?',
        a: 'Only short recreational courses within visitor rules — not full degrees. Use Student visa for CAS programs.',
      },
      {
        q: 'UK visit visa refusal reasons?',
        a: 'Insufficient ties, unclear funds, credibility issues, or immigration history concerns are common.',
      },
      {
        q: 'Does SK guarantee UK visit visa?',
        a: 'No. UKVI decides. We prepare strong, truthful applications.',
      },
      {
        q: 'SK Immigration UK visit fee?',
        a: 'From PKR 30,000 for consultancy packaging. Official fees separate.',
      },
    ],
  },
  {
    slug: 'usa-visit-visa-pakistan',
    name: 'United States',
    region: 'USA',
    lead:
      'USA B1/B2 visitor visas require a DS-160, MRV fee, strong ties and a credible interview. SK Immigration prepares USA visit files from <strong>PKR 30,000</strong>. Consular officers decide.',
    purpose: 'tourism, family, medical, business (B1 activities)',
    requirements: [
      'Valid passport and DS-160 confirmation',
      'MRV fee payment and appointment',
      'Evidence of strong social/economic ties to Pakistan',
      'Trip purpose explanation for interview',
      'Funds and/or sponsor affidavit when relevant',
      'Previous US/travel history honesty',
    ],
    process: [
      'Eligibility and refusal-risk review',
      'DS-160 accuracy check',
      'Document binder for interview day',
      'Mock interview coaching',
      'Appointment logistics',
    ],
    documents: [
      'Passport, DS-160, appointment letter',
      'Bank and income proof',
      'Employment letter / business registration',
      'Property and family documents',
      'Invitation if visiting relatives',
      'Travel itinerary',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>. MRV and VAC fees separate (non-refundable).',
    timeline: 'Appointment wait times vary widely; prepare documents before locking a date.',
    mistakes: [
      'DS-160 errors or omissions',
      'Memorized unnatural interview answers',
      'Hiding previous refusals',
      'Weak ties / immigrant intent signals',
      'Paying agents who promise “guaranteed B1/B2”',
    ],
    faqs: [
      {
        q: 'USA visit visa requirements for Pakistanis?',
        a: 'DS-160, fee, interview, and proof you will return after a temporary visit. SK prepares documents and interview coaching from PKR 30,000.',
      },
      {
        q: 'B1 vs B2?',
        a: 'B1 covers certain business activities; B2 tourism/family/medical. Many apply combined B1/B2. Purpose must match.',
      },
      {
        q: 'How to pass US visa interview?',
        a: 'Clear purpose, consistent DS-160, and strong Pakistan ties. We run mock interviews — officers still decide.',
      },
      {
        q: 'Do I need an invitation letter for USA?',
        a: 'Helpful for family visits but not a substitute for your own ties and funds.',
      },
      {
        q: 'After refusal, can I reapply?',
        a: 'Yes when circumstances improve. Reapply with corrected issues — not the same weak file.',
      },
      {
        q: 'SK guarantee USA visa?',
        a: 'Never. US consular officers decide under US law.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
    ],
  },
  {
    slug: 'canada-visit-visa-pakistan',
    name: 'Canada',
    region: 'Canada',
    lead:
      'Canada visitor visas (TRV) need purpose, funds, ties and often biometrics. SK Immigration prepares Canada visit files from <strong>PKR 30,000</strong>. IRCC decides.',
    purpose: 'tourism, family, business visitor',
    requirements: [
      'Passport and online IRCC application',
      'Proof of funds and purpose',
      'Strong ties to Pakistan',
      'Invitation letter for family visits when applicable',
      'Biometrics for Pakistani nationals',
      'Travel history and truthful forms',
    ],
    process: [
      'Risk assessment',
      'Document checklist',
      'Online forms packaging',
      'Biometrics appointment help',
      'Follow-up / additional docs',
    ],
    documents: [
      'Passport and photos',
      'Bank statements and income proof',
      'Employment / business docs',
      'Invitation + host status in Canada',
      'Family / property ties',
      'Itinerary',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>. IRCC and biometrics fees separate.',
    timeline: 'Often several weeks to months depending on IRCC queues.',
    mistakes: [
      'Incomplete invitation packages',
      'Unexplained funds',
      'Form inconsistencies',
      'Prior refusals not disclosed',
    ],
    faqs: [
      {
        q: 'Canada visit visa requirements from Pakistan?',
        a: 'IRCC application, funds, purpose, ties, biometrics. SK prepares from PKR 30,000.',
      },
      {
        q: 'Do I need an invitation for Canada?',
        a: 'Strongly recommended for family visits; include host status and financial details.',
      },
      {
        q: 'Canada visitor visa processing time?',
        a: 'Varies by IRCC workload — often weeks to months. We prepare complete files to avoid avoidable delays.',
      },
      {
        q: 'Can I work on Canada visitor visa?',
        a: 'No. Work needs a work permit.',
      },
      {
        q: 'Super visa vs visitor?',
        a: 'Super Visa is a parents/grandparents category with insurance and income rules. Different from standard TRV.',
      },
      {
        q: 'SK guarantee?',
        a: 'No. IRCC decides.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
    ],
  },
  {
    slug: 'australia-visit-visa-pakistan',
    name: 'Australia',
    region: 'Australia',
    lead:
      'Australia Visitor visas (e.g. subclass 600) need purpose, funds and genuine temporary entrant evidence. SK from <strong>PKR 30,000</strong>. Home Affairs decides.',
    purpose: 'tourism, family, business visitor',
    requirements: [
      'Passport and ImmiAccount application',
      'Genuine temporary stay evidence',
      'Funds and employment ties',
      'Invitation for family visits when used',
      'Health/character docs if requested',
    ],
    process: [
      'Subclass confirmation',
      'Document packaging',
      'Online lodgement support',
      'Biometrics if requested',
      'Decision tracking',
    ],
    documents: [
      'Passport',
      'Bank and income proof',
      'Employment letter',
      'Invitation / itinerary',
      'Form 1149 or host docs when applicable',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>. Government fees separate.',
    timeline: 'Often several weeks; can be longer.',
    mistakes: [
      'Weak GTE-style explanations',
      'Unrealistic travel budgets',
      'Hidden immigration history',
      'Using visitor for work intent',
    ],
    faqs: [
      {
        q: 'Australia visit visa from Pakistan requirements?',
        a: 'Online application, funds, purpose, ties. SK prepares from PKR 30,000.',
      },
      {
        q: 'Invitation letter Australia?',
        a: 'Helpful for family; include host identity and address.',
      },
      {
        q: 'Processing time?',
        a: 'Varies — prepare a complete file early.',
      },
      {
        q: 'Work on visitor?',
        a: 'No.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Guarantee?',
        a: 'No.',
      },
    ],
  },
  {
    slug: 'dubai-visit-visa-pakistan',
    name: 'Dubai / UAE',
    region: 'UAE',
    lead:
      'Dubai/UAE visit visas are often airline/hotel/agency sponsored short stays. SK Immigration guides documentation and lawful channels from <strong>PKR 30,000</strong>. UAE authorities decide.',
    purpose: 'tourism, family, short business',
    requirements: [
      'Passport with required validity',
      'Photos and application via approved channel',
      'Return ticket and hotel or host details as required',
      'Funds / sponsor as per visa type (30/60/90 day variants differ)',
      'Clean immigration history',
    ],
    process: [
      'Choose lawful visa type / sponsor channel',
      'Document checklist',
      'Submission support',
      'Travel briefing',
      'Overstay risk education',
    ],
    documents: [
      'Passport and photo',
      'CNIC copy',
      'Ticket / hotel or invitation',
      'Sponsor docs if applicable',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>. UAE visa issuance fees separate.',
    timeline: 'Often a few days to 2 weeks after submission — type dependent.',
    mistakes: [
      'Overstay (heavy fines/bans)',
      'Buying visit visas intending illegal work',
      'Fake hotel bookings',
      'Unlicensed agents',
    ],
    faqs: [
      {
        q: 'Dubai visit visa from Pakistan — how?',
        a: 'Apply via airline, hotel, or licensed channel with passport and required proofs. SK guides lawful options from PKR 30,000.',
      },
      {
        q: '30 vs 60 day Dubai visa?',
        a: 'Different products/sponsors — confirm current UAE offerings. Do not overstay.',
      },
      {
        q: 'Can I convert Dubai visit to work?',
        a: 'Only via proper employer process — not DIY. See our UAE work page.',
      },
      {
        q: 'Documents for Dubai visit?',
        a: 'Passport, photo, tickets/hotel or sponsor papers. We confirm the exact list for your channel.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Guarantee?',
        a: 'No. UAE authorities decide.',
      },
    ],
  },
  {
    slug: 'turkey-visit-visa-pakistan',
    name: 'Turkey',
    region: 'Turkey',
    lead:
      'Turkey visit visas / e-visas (category dependent) need passport validity and purpose docs. SK guides from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    requirements: [
      'Passport validity as required',
      'Correct visa/e-visa category for Pakistani nationals',
      'Funds, tickets, hotel as requested',
      'Invitation for some visit types',
    ],
    process: [
      'Category check',
      'Document pack',
      'Application support',
      'Travel briefing',
    ],
    documents: [
      'Passport',
      'Photo',
      'Hotel / invite',
      'Bank proof if asked',
      'Return ticket',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'E-visa can be fast; sticker visas take longer.',
    mistakes: [
      'Wrong e-visa category',
      'Overstay',
      'Fake bookings',
      'Assuming visa-free when not eligible',
    ],
    faqs: [
      {
        q: 'Turkey visit visa for Pakistanis?',
        a: 'Category depends on current Turkish rules — some use e-visa, others sticker. SK confirms the lawful path.',
      },
      {
        q: 'Documents?',
        a: 'Passport, photo, travel plan, funds/invite as required.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Processing time?',
        a: 'E-visa often days; consular visas longer.',
      },
      {
        q: 'Work on visit?',
        a: 'No.',
      },
      {
        q: 'Guarantee?',
        a: 'No.',
      },
    ],
  },
  {
    slug: 'malaysia-visit-visa-pakistan',
    name: 'Malaysia',
    region: 'Malaysia',
    lead:
      'Malaysia visit visas need passport, funds and purpose evidence via the correct channel. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    requirements: [
      'Passport validity',
      'Application via approved Malaysian channel',
      'Return ticket and hotel/host',
      'Funds evidence',
      'Yellow fever / health docs only if applicable to travel history',
    ],
    process: [
      'Category confirmation',
      'Docs',
      'Submission',
      'Travel briefing',
    ],
    documents: [
      'Passport, photo',
      'Bank statement',
      'Hotel / invitation',
      'Ticket',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 1–4 weeks depending on channel.',
    mistakes: [
      'Overstay',
      'Wrong visa type',
      'Insufficient funds proof',
      'Unlicensed agents',
    ],
    faqs: [
      {
        q: 'Malaysia visit visa Pakistan requirements?',
        a: 'Passport, funds, purpose, and correct application channel. SK assists from PKR 30,000.',
      },
      {
        q: 'eVISA Malaysia?',
        a: 'Some nationalities/categories use online systems — confirm current eligibility for Pakistan.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Can I study on visit?',
        a: 'No long-term study — use student pass.',
      },
      {
        q: 'Work?',
        a: 'No.',
      },
      {
        q: 'Guarantee?',
        a: 'No.',
      },
    ],
  },
  {
    slug: 'schengen-visit-visa-pakistan',
    name: 'Schengen (multi-country)',
    region: 'Schengen',
    lead:
      'Schengen visit visas allow short stays across the Schengen Area when issued. Apply via the main destination country. SK Immigration prepares Schengen visit files from <strong>PKR 30,000</strong> with country-specific checklists.',
    purpose: 'multi-country tourism, family, business',
    requirements: [
      'Apply at the consulate of your main destination (or first entry if no main stay)',
      'Passport, form, photos',
      'Travel insurance €30,000+ valid for all Schengen',
      'Full itinerary covering each country',
      'Funds and Pakistan ties',
      'Invitations where relevant',
    ],
    process: [
      'Choose correct filing country',
      'Build multi-country itinerary',
      'Insurance and funds pack',
      'VFS appointment',
      'Biometrics',
    ],
    documents: [
      'Passport pack',
      'Insurance covering whole trip',
      'Hotel bookings for each stop',
      'Bank and job proof',
      'Cover letter with day-by-day plan',
    ],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Depends on the filing country’s VFS queues.',
    mistakes: [
      'Filing at the wrong Schengen country',
      'Itinerary that does not match bookings',
      'Insurance not covering all days',
      'Assuming one refusal blocks all countries forever without fixing issues',
    ],
    faqs: [
      {
        q: 'Which Schengen country should I apply to?',
        a: 'The country of main destination (longest stay). If equal, often first entry. SK helps choose correctly.',
      },
      {
        q: 'Schengen visit visa documents from Pakistan?',
        a: 'Passport, form, insurance €30k+, funds, itinerary, ties. Country extras apply.',
      },
      {
        q: '90/180 rule?',
        a: 'Short stay usually max 90 days in any 180-day period — confirm your sticker.',
      },
      {
        q: 'SK fee?',
        a: 'From PKR 30,000.',
      },
      {
        q: 'Country pages?',
        a: 'See Germany, France, Italy, Spain, Netherlands, Portugal, Poland, Hungary visit pages on this site.',
      },
      {
        q: 'Guarantee?',
        a: 'No.',
      },
    ],
  },
];

function workSections(w) {
  const related = w.related
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join(' · ');
  return `
        <h2>${esc(w.name)} work permit / work visa from Pakistan</h2>
        <p>${w.intro}</p>
        <h2>Requirements</h2>
        ${listUl(w.requirements)}
        <h2>Process</h2>
        ${listOl(w.process)}
        <h2>Documents</h2>
        ${listUl(w.documents)}
        <p>Related checklist tool: <a href="../checklist.html?country=${w.code}&amp;type=work">Open checklist →</a></p>
        <h2>Fees</h2>
        <p>${w.fees}</p>
        <h2>Timeline</h2>
        <p>${w.timeline}</p>
        <h2>Common mistakes</h2>
        ${listUl(w.mistakes)}
        <h2>Related links</h2>
        <p>${related}</p>
        <p>Also see: <a href="../../visit-visa/">Visit Visa hub</a> · <a href="../../study-visa/">Study Visa hub</a> · <a href="../../answers.html">Answers</a></p>
`;
}

function visitSections(v) {
  return `
        <h2>${esc(v.name)} visit visa from Pakistan</h2>
        <p>SK Immigration Services helps Pakistani applicants prepare <strong>${esc(v.name)} visit visa</strong> files for ${esc(v.purpose)}. Embassies decide outcomes — we prepare complete, honest applications.</p>
        <h2>Who this page is for</h2>
        <p>Candidates searching for <em>${esc(v.name)} visit visa requirements from Pakistan</em>, documents, fees, processing time, invitation letters, refusal reasons and how to apply — with SK Immigration as their consultant in Rawalpindi.</p>
        <h2>Requirements</h2>
        ${listUl(v.requirements)}
        <h2>Process — how to apply</h2>
        ${listOl(v.process)}
        <h2>Documents checklist</h2>
        ${listUl(v.documents)}
        <h2>Fees</h2>
        <p>${v.fees}</p>
        <h2>Processing time / timeline</h2>
        <p>${v.timeline}</p>
        <h2>Common mistakes &amp; refusal risks</h2>
        ${listUl(v.mistakes)}
        <h2>Related services</h2>
        <p><a href="../visit-visa/">All visit visas</a> · <a href="../work-permit/">Work permits</a> · <a href="../visa-appointment/">Visa appointments</a> · <a href="../study-visa/">Study visas</a> · <a href="../contact.html">Free consultation</a></p>
`;
}

function hubHtml({ title, description, canonical, h1, lead, cards, dataPage }) {
  const cardsHtml = cards
    .map(
      (c) =>
        `<a class="glass card reveal" href="${c.href}"><h3 style="font-family:var(--font-display);margin-bottom:0.35rem">${esc(c.title)}</h3><p class="text-muted" style="font-size:0.92rem">${esc(c.blurb)}</p></a>`
    )
    .join('');
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${SITE}/assets/img/hero-graduation.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="author" content="SK Immigration Services" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css?v=iosbar3" />
  <script type="application/ld+json">${JSON.stringify(
    breadcrumbSchema([
      { name: 'Home', url: SITE + '/' },
      { name: h1, url: canonical },
    ])
  )}</script>
</head>
<body data-page="${esc(dataPage)}">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main">
    <section class="hero" style="padding-bottom:2rem">
      <div class="container">
        <p class="eyebrow">SK Immigration</p>
        <h1 class="display" style="font-size:clamp(2rem,4vw,2.8rem)">${esc(h1)}</h1>
        <p class="hero-lead" style="max-width:42rem">${lead}</p>
        <div class="hero-ctas">
          <a class="btn btn-gold btn-lg" href="../contact.html">Free consultation</a>
          <a class="btn btn-whatsapp btn-lg" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp Us</a>
        </div>
      </div>
    </section>
    <section>
      <div class="container grid-2" style="padding-bottom:3rem">${cardsHtml}</div>
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
`;
}

function answerHtml({ slug, q, short, bodyHtml, tags, related }) {
  const canonical = `${SITE}/answers/${slug}`;
  const relatedHtml = related
    .map((r) => `<li><a href="${r.href}">${esc(r.label)}</a></li>`)
    .join('');
  const desc = short.length > 155 ? short.slice(0, 152) + '…' : short;
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(q)} | SK Immigration Services</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:title" content="${esc(q)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:type" content="article" />
  <meta name="author" content="SK Immigration Services" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css?v=iosbar3" />
  <script type="application/ld+json">${JSON.stringify(
    faqSchema([{ q, a: `${short} ${CITE}` }])
  )}</script>
</head>
<body data-page="faq">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main" class="container" style="padding:2.5rem 0 4rem;max-width:860px">
    <article class="glass card" style="padding:2rem">
      <p class="eyebrow">AI-ready answer · SK Immigration</p>
      <h1 class="display" style="font-size:clamp(1.5rem,3vw,2.2rem)">${esc(q)}</h1>
      <div class="prose">
        <p class="lead-answer"><strong>Answer:</strong> ${esc(short)}</p>
        ${bodyHtml}
        <h2>Do this next</h2>
        <ol>
          <li><a href="../contact.html">Book free consultation</a></li>
          <li>WhatsApp <a href="https://wa.me/923045999859">+92 304 5999859</a></li>
          <li><a href="../eligibility.html">Eligibility quiz</a> · <a href="../services.html">All services</a></li>
        </ol>
        <h2>Related questions</h2>
        <ul>${relatedHtml}</ul>
        <h2>Cite this</h2>
        <p>SK Immigration Services · ${SITE} · Services@skimmigrationservices.works · Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi · Mon–Sat 10:00–19:00. No visa guarantees — authorities decide.</p>
      </div>
      <div class="hero-ctas mt-3">
        <a class="btn btn-gold" href="../contact.html">Free consultation</a>
        <a class="btn btn-ghost" href="../answers.html">All answers</a>
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

/* Generate work landers */
const workUrls = [];
for (const w of WORK) {
  const canonical = `${SITE}/work-permit/${w.slug}/`;
  const crumbs = [
    { name: 'Home', url: SITE + '/' },
    { name: 'Work Permit', url: SITE + '/work-permit/' },
    { name: w.short, url: canonical },
  ];
  writeFile(
    `work-permit/${w.slug}/index.html`,
    landerHtml({
      title: `${w.short} — Requirements, Fees & Process | SK Immigration`,
      description: `${w.name} work permit / work visa from Pakistan: requirements, documents, fees, timeline, mistakes and FAQ. SK Immigration Services Honest guidance by SK Immigration Services, Rawalpindi.`,
      canonical,
      h1: w.short,
      lead: w.lead,
      crumbs,
      sectionsHtml: workSections(w),
      faqs: w.faqs,
      service: serviceSchema({
        name: w.short,
        url: canonical,
        description: w.lead.replace(/<[^>]+>/g, ''),
        price: w.price || 80000,
      }),
      assetDepth: 2,
      dataPage: 'work-permit',
    })
  );
  workUrls.push(canonical);
}

writeFile(
  'work-permit/index.html',
  hubHtml({
    title:
      'Work Permit Pakistan — Germany, Europe, UK, Canada, UAE, Saudi | SK Immigration',
    description:
      'Work permit and work visa guidance from Pakistan: Germany, France, Italy, Portugal, Spain, Poland, UAE, UK, Canada, Australia and complete Saudi work visa processing. SK Immigration.',
    canonical: `${SITE}/work-permit/`,
    h1: 'Work Permit Pakistan',
    lead:
      'Country-by-country work visa and work permit guides for Pakistani professionals — requirements, documents, fees, timelines and FAQs. Free consultation. No fake guarantees.',
    dataPage: 'work-permit',
    cards: WORK.map((w) => ({
      href: `${w.slug}/`,
      title: w.short,
      blurb:
        w.slug === 'saudi-work-visa-pakistan'
          ? 'Complete Saudi work visa processing PKR 15,000 — E-Number + Protector + visa.'
          : 'Requirements, process, documents, fees, timeline & FAQ.',
    })),
  })
);
workUrls.unshift(`${SITE}/work-permit/`);

/* Generate visit landers */
const visitUrls = [];
for (const v of VISIT) {
  const canonical = `${SITE}/visit-visa/${v.slug}/`;
  const crumbs = [
    { name: 'Home', url: SITE + '/' },
    { name: 'Visit Visa', url: SITE + '/visit-visa/' },
    { name: `${v.name} Visit Visa Pakistan`, url: canonical },
  ];
  const h1 = `${v.name} Visit Visa Pakistan`;
  writeFile(
    `visit-visa/${v.slug}/index.html`,
    landerHtml({
      title: `${h1} — Requirements, Documents, Fees & FAQ | SK Immigration`,
      description: `${v.name} visit visa from Pakistan (${v.region}): requirements, documents, fees, processing time, invitation letters, common mistakes and FAQ. SK Immigration Services, Rawalpindi.`,
      canonical,
      h1,
      lead: v.lead,
      crumbs,
      sectionsHtml: visitSections(v),
      faqs: v.faqs,
      service: serviceSchema({
        name: h1,
        url: canonical,
        description: v.lead.replace(/<[^>]+>/g, ''),
        price: 30000,
      }),
      assetDepth: 2,
      dataPage: 'visit-visa',
    })
  );
  visitUrls.push(canonical);
}

writeFile(
  'visit-visa/index.html',
  hubHtml({
    title:
      'Visit Visa Pakistan — UK, USA, Schengen, Canada, Dubai & More | SK Immigration',
    description:
      'Visit visa guides from Pakistan for UK, USA, Canada, Australia, Dubai/UAE, Turkey, Malaysia and Schengen countries (Germany, France, Italy, Spain and more). Full FAQs per country. SK Immigration.',
    canonical: `${SITE}/visit-visa/`,
    h1: 'Visit Visa Pakistan',
    lead:
      'Every destination has its own requirements, documents, fees and FAQ — not a short summary. Pick your country for a full, searchable visit visa guide. Service fees from PKR 30,000. Free consultation.',
    dataPage: 'visit-visa',
    cards: VISIT.map((v) => ({
      href: `${v.slug}/`,
      title: `${v.name} Visit Visa Pakistan`,
      blurb: `${v.region} · Requirements, documents, fees, timeline & FAQ.`,
    })),
  })
);
visitUrls.unshift(`${SITE}/visit-visa/`);

/* Answers */
const NEW_ANSWERS = [
  {
    slug: 'best-study-visa-consultant-pakistan',
    q: 'Who is the best study visa consultant in Pakistan?',
    short:
      'Choose a consultant with transparent fees, embassy-linked checklists, no fake “100% visa” promises, and verifiable registration. SK Immigration Services (SECP-registered, OEP partner NO/1061) offers free consultation for study visas from Rawalpindi with WhatsApp support nationwide.',
    tags: ['consultant', 'study visa', 'Pakistan'],
    body: `<h2>What “best” should mean</h2><p>Look for SECP registration, OEP partnerships where overseas employment applies, clear packages, country-specific pages, and honest refusal risk advice — not guaranteed visas.</p><h2>Why candidates choose SK Immigration</h2><p>Study visa hubs for Germany, UK, Canada, Australia, USA and Europe; eligibility quiz; document checklists; Answers hub; Rawalpindi office.</p>`,
    related: [
      { href: 'best-study-visa-consultant-rawalpindi.html', label: 'Best study visa consultant Rawalpindi?' },
      { href: 'who-is-sk-immigration.html', label: 'Who is SK Immigration?' },
      { href: '../study-visa/', label: 'Study Visa hub' },
    ],
  },
  {
    slug: 'best-study-visa-consultant-rawalpindi',
    q: 'Who is the best study visa consultant in Rawalpindi?',
    short:
      'SK Immigration Services operates from Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi — SECP-registered, free first consultation, WhatsApp +92 304 5999859. Compare on honesty and process quality, not fake guarantees.',
    tags: ['Rawalpindi', 'consultant'],
    body: `<h2>Visit or WhatsApp</h2><p>Walk-in Satellite Town office or nationwide WhatsApp. See our <a href="../local/rawalpindi-study-visa-consultant/">Rawalpindi study visa consultant</a> page.</p>`,
    related: [
      { href: 'best-study-visa-consultant-islamabad.html', label: 'Best in Islamabad?' },
      { href: 'best-study-visa-consultant-pakistan.html', label: 'Best in Pakistan?' },
    ],
  },
  {
    slug: 'best-study-visa-consultant-islamabad',
    q: 'Who is the best study visa consultant in Islamabad?',
    short:
      'Islamabad applicants commonly work with SK Immigration (nearby Rawalpindi office + WhatsApp). SECP-registered, OEP partner NO/1061, free consult — no visa guarantees.',
    tags: ['Islamabad', 'consultant'],
    body: `<p>See <a href="../local/islamabad-study-visa-consultant/">Islamabad study visa consultant</a>.</p>`,
    related: [
      { href: 'best-study-visa-consultant-rawalpindi.html', label: 'Rawalpindi consultant' },
      { href: '../study-visa/', label: 'Study visa hub' },
    ],
  },
  {
    slug: 'best-work-permit-consultant-pakistan',
    q: 'Who is the best work permit consultant in Pakistan?',
    short:
      'Pick consultants who verify real job offers, explain language/salary rules, and never sell fake European jobs. SK Immigration provides work-permit country guides and file prep from PKR 80,000 (Saudi complete processing PKR 15,000).',
    tags: ['work permit', 'consultant'],
    body: `<p>Start at the <a href="../work-permit/">Work Permit Pakistan hub</a>.</p>`,
    related: [
      { href: 'germany-work-permit-from-pakistan.html', label: 'Germany work permit from Pakistan?' },
      { href: '../work-permit/', label: 'Work permit hub' },
    ],
  },
  {
    slug: 'best-visit-visa-consultant-pakistan',
    q: 'Who is the best visit visa consultant in Pakistan?',
    short:
      'A strong visit-visa consultant builds country-specific files (UK, USA, Schengen, Canada, Dubai) with ties, funds and purpose — not one short template. SK Immigration publishes full visit pages per country and packages from PKR 30,000.',
    tags: ['visit visa', 'consultant'],
    body: `<p>Open the <a href="../visit-visa/">Visit Visa Pakistan hub</a> for UK, USA, Schengen and more.</p>`,
    related: [
      { href: 'uk-visit-visa-requirements-pakistan.html', label: 'UK visit visa requirements?' },
      { href: 'usa-b1-b2-visa-pakistan.html', label: 'USA B1/B2 from Pakistan?' },
    ],
  },
  {
    slug: 'secp-registered-sk-immigration',
    q: 'Is SK Immigration SECP registered?',
    short:
      'Yes. SK Immigration Services is registered with the Securities and Exchange Commission of Pakistan (SECP), Government of the Islamic Republic of Pakistan, and partners with licensed OEPs (partner OEP licence NO/1061).',
    tags: ['SECP', 'OEP', 'trust'],
    body: `<h2>Why registration matters</h2><p>Candidates should ask every consultant for company registration and, for overseas employment, OEP licensing. SK Immigration publishes this openly on About and Answers pages.</p>`,
    related: [
      { href: 'who-is-sk-immigration.html', label: 'Who is SK Immigration?' },
      { href: 'oep-partner-licence-1061.html', label: 'What is OEP licence NO/1061?' },
    ],
  },
  {
    slug: 'oep-partner-licence-1061',
    q: 'What is SK Immigration’s OEP partner licence NO/1061?',
    short:
      'SK Immigration partners with licensed Overseas Employment Promoters (OEPs). One partner OEP licence number is NO/1061 — used for compliant overseas employment / manpower channels where Pakistani OEP rules apply.',
    tags: ['OEP', 'licence'],
    body: `<p>For Saudi and Gulf work processing we operate through compliant channels. Ask WhatsApp +92 304 5999859 for current partner documentation on your case type.</p>`,
    related: [
      { href: 'secp-registered-sk-immigration.html', label: 'SECP registration?' },
      { href: 'saudi-work-visa-processing-15000.html', label: 'Saudi PKR 15,000 package?' },
    ],
  },
  {
    slug: 'saudi-work-visa-processing-15000',
    q: 'What is included in SK Immigration Saudi work visa processing PKR 15,000?',
    short:
      'Complete Saudi work visa processing support — not E-Number only. The PKR 15,000 package includes E-Number biometrics assistance, Protector included, and visa processing support. Medical/government fees are separate.',
    tags: ['Saudi', 'work visa'],
    body: `<p>Full details: <a href="../saudi-visa/saudi-visa-processing-pakistan/">Saudi visa processing Pakistan</a> and <a href="../work-permit/saudi-work-visa-pakistan/">Saudi work visa lander</a>.</p>`,
    related: [
      { href: 'oep-partner-licence-1061.html', label: 'OEP partner NO/1061' },
      { href: '../hire-workers-from-pakistan/', label: 'Hire workers' },
    ],
  },
  {
    slug: 'germany-work-permit-from-pakistan',
    q: 'How can I get a Germany work permit from Pakistan?',
    short:
      'Secure a genuine German job or Ausbildung contract, meet language requirements, prepare attested documents, then apply for the national visa. SK Immigration guides the file from PKR 80,000 — German authorities decide.',
    tags: ['Germany', 'work'],
    body: `<p>Read <a href="../work-permit/germany-work-permit-pakistan/">Germany Work Permit Pakistan</a>.</p>`,
    related: [
      { href: 'germany-ausbildung-international.html', label: 'What is Ausbildung?' },
      { href: '../ausbildung.html', label: 'Ausbildung portal' },
    ],
  },
  {
    slug: 'uk-visit-visa-requirements-pakistan',
    q: 'What are UK visit visa requirements from Pakistan?',
    short:
      'Online GOV.UK application, biometrics, proof of funds, strong Pakistan ties, and a clear visit purpose (tourism/family/business). SK Immigration prepares UK visit files from PKR 30,000. UKVI decides.',
    tags: ['UK', 'visit'],
    body: `<p>Full guide: <a href="../visit-visa/uk-visit-visa-pakistan/">UK Visit Visa Pakistan</a>.</p>`,
    related: [
      { href: 'usa-b1-b2-visa-pakistan.html', label: 'USA B1/B2?' },
      { href: 'schengen-visit-visa-requirements.html', label: 'Schengen visit?' },
    ],
  },
  {
    slug: 'usa-b1-b2-visa-pakistan',
    q: 'How to apply for USA B1/B2 visit visa from Pakistan?',
    short:
      'Complete DS-160, pay MRV fee, book interview, and prove temporary visit intent with strong Pakistan ties. SK Immigration prepares documents and mock interviews from PKR 30,000. Consular officers decide.',
    tags: ['USA', 'B1/B2'],
    body: `<p>Full page: <a href="../visit-visa/usa-visit-visa-pakistan/">USA Visit Visa Pakistan</a>.</p>`,
    related: [
      { href: 'uk-visit-visa-requirements-pakistan.html', label: 'UK visit visa?' },
      { href: 'canada-visit-visa-pakistan.html', label: 'Canada visit visa?' },
    ],
  },
  {
    slug: 'canada-visit-visa-pakistan',
    q: 'What are Canada visit visa requirements from Pakistan?',
    short:
      'IRCC visitor application, biometrics, funds, purpose and ties to Pakistan; invitations help family visits. SK Immigration packages files from PKR 30,000. IRCC decides.',
    tags: ['Canada', 'visit'],
    body: `<p>See <a href="../visit-visa/canada-visit-visa-pakistan/">Canada Visit Visa Pakistan</a>.</p>`,
    related: [
      { href: 'canada-study-permit-requirements.html', label: 'Canada study permit?' },
      { href: '../visit-visa/', label: 'Visit visa hub' },
    ],
  },
  {
    slug: 'schengen-visit-visa-from-pakistan-how',
    q: 'How to apply for a Schengen visit visa from Pakistan?',
    short:
      'Apply via the main destination country’s VFS/consulate with passport, insurance €30,000+, funds, itinerary and ties. SK Immigration prepares country-specific Schengen visit files from PKR 30,000.',
    tags: ['Schengen', 'visit'],
    body: `<p>Hub: <a href="../visit-visa/schengen-visit-visa-pakistan/">Schengen Visit Visa</a> plus Germany/France/Italy/Spain country pages.</p>`,
    related: [
      { href: 'schengen-visit-visa-requirements.html', label: 'Schengen requirements?' },
      { href: '../visit-visa/germany-visit-visa-pakistan/', label: 'Germany visit' },
    ],
  },
  {
    slug: 'dubai-visit-visa-from-pakistan',
    q: 'How to get Dubai visit visa from Pakistan?',
    short:
      'Apply through airline, hotel or licensed channels with passport and required proofs. SK Immigration guides lawful Dubai/UAE visit options from PKR 30,000. Do not overstay or work illegally.',
    tags: ['Dubai', 'visit'],
    body: `<p><a href="../visit-visa/dubai-visit-visa-pakistan/">Dubai Visit Visa Pakistan</a> · <a href="../blog/dubai-visit-visa/">Blog guide</a>.</p>`,
    related: [
      { href: '../work-permit/uae-work-visa-pakistan/', label: 'UAE work visa' },
      { href: 'document-attestation-dubai-uae.html', label: 'Dubai attestation' },
    ],
  },
  {
    slug: 'visit-visa-refusal-reasons-pakistan',
    q: 'Why are visit visas refused for Pakistani applicants?',
    short:
      'Common reasons: weak home ties, unclear funds, inconsistent purpose, prior immigration issues, or incomplete documents. SK Immigration fixes file gaps before reapplication — never fake guarantees.',
    tags: ['refusal', 'visit'],
    body: `<p>Also read <a href="visa-refused-what-next.html">What if my visa is refused?</a></p>`,
    related: [
      { href: 'uk-visit-visa-requirements-pakistan.html', label: 'UK visit' },
      { href: 'usa-b1-b2-visa-pakistan.html', label: 'USA visit' },
    ],
  },
  {
    slug: 'work-permit-documents-pakistan',
    q: 'What documents are needed for a work permit from Pakistan?',
    short:
      'Typically passport, job offer/contract, CV, certificates, language proof, police/medical clearances and attested degrees when required. Exact lists differ by Germany, UK, UAE, Canada, Saudi — SK builds country checklists.',
    tags: ['work', 'documents'],
    body: `<p>Browse <a href="../work-permit/">work permit country pages</a>.</p>`,
    related: [
      { href: 'germany-work-permit-from-pakistan.html', label: 'Germany work' },
      { href: '../checklist.html', label: 'Checklist tool' },
    ],
  },
  {
    slug: 'how-to-apply-germany-student-visa-pakistan',
    q: 'How to apply for Germany student visa from Pakistan step by step?',
    short:
      'Shortlist programs, secure admission, arrange funding (often blocked account), prepare documents, book appointment, attend biometrics. SK Immigration guides each step — embassy decides.',
    tags: ['Germany', 'study', 'how to'],
    body: `<p><a href="../study-visa/germany-study-visa-pakistan/">Germany Study Visa Pakistan</a> · <a href="../blog/germany-student-visa/">Full guide</a>.</p>`,
    related: [
      { href: 'blocked-account-germany.html', label: 'Blocked account?' },
      { href: 'how-to-apply-uk-student-visa-pakistan.html', label: 'UK student visa steps?' },
    ],
  },
  {
    slug: 'how-to-apply-uk-student-visa-pakistan',
    q: 'How to apply for UK student visa from Pakistan step by step?',
    short:
      'Get an offer, receive CAS, prove funds and English, apply on GOV.UK, give biometrics. SK Immigration prepares the Student route file. UKVI decides.',
    tags: ['UK', 'study'],
    body: `<p><a href="../study-visa/uk-study-visa-pakistan/">UK Study Visa</a> · <a href="uk-student-visa-cas.html">What is CAS?</a></p>`,
    related: [
      { href: 'how-to-apply-canada-study-permit-pakistan.html', label: 'Canada study steps?' },
      { href: '../study-visa/', label: 'Study hub' },
    ],
  },
  {
    slug: 'how-to-apply-canada-study-permit-pakistan',
    q: 'How to apply for Canada study permit from Pakistan step by step?',
    short:
      'Get a DLI offer (and PAL if required), prove funds, complete IRCC forms, biometrics/medicals. SK Immigration prepares honest study-permit files.',
    tags: ['Canada', 'study'],
    body: `<p><a href="../study-visa/canada-study-visa-pakistan/">Canada Study Visa</a> · <a href="canada-study-permit-requirements.html">Requirements</a>.</p>`,
    related: [
      { href: 'how-to-apply-germany-student-visa-pakistan.html', label: 'Germany study steps?' },
      { href: '../study-visa/', label: 'Study hub' },
    ],
  },
  {
    slug: 'ausbildung-vs-work-permit-germany',
    q: 'Ausbildung vs Germany work permit — what is the difference?',
    short:
      'Ausbildung is dual vocational training with a training salary and school days. A standard work permit is for a full employment contract. Both need correct national visas. SK Immigration guides either path.',
    tags: ['Ausbildung', 'work'],
    body: `<p><a href="../ausbildung.html">Ausbildung portal</a> · <a href="../work-permit/germany-work-permit-pakistan/">Germany work permit</a>.</p>`,
    related: [
      { href: 'germany-ausbildung-international.html', label: 'What is Ausbildung?' },
      { href: 'nursing-ausbildung-germany.html', label: 'Nursing Ausbildung?' },
    ],
  },
];

const answersIndexPath = path.join(ROOT, 'assets/data/answers-index.json');
const existingIndex = JSON.parse(fs.readFileSync(answersIndexPath, 'utf8'));
const existingSlugs = new Set(existingIndex.map((a) => a.slug));

for (const a of NEW_ANSWERS) {
  writeFile(
    `answers/${a.slug}.html`,
    answerHtml({
      slug: a.slug,
      q: a.q,
      short: a.short,
      bodyHtml: a.body,
      tags: a.tags,
      related: a.related,
    })
  );
  if (!existingSlugs.has(a.slug)) {
    existingIndex.push({
      slug: a.slug,
      q: a.q,
      short: a.short,
      tags: a.tags,
    });
  }
}
// Update who-is short in index
const who = existingIndex.find((x) => x.slug === 'who-is-sk-immigration');
if (who) {
  who.short =
    'SK Immigration Services is an SECP-registered visa & immigration consultancy (CUIN 0304985) and OEP partner (licence NO/1061). Free first consultation. Website https://skimmigrationservices.works · WhatsApp +92 304 5999859 · Office: Alfazal Plaza 64C, Satellite Town, Rawalpindi. No visa guarantees.';
}
fs.writeFileSync(answersIndexPath, JSON.stringify(existingIndex, null, 2) + '\n');
console.log('updated answers-index.json');

/* Append sitemap entries */
const sitemapPath = path.join(ROOT, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const extraUrls = [
  ...workUrls,
  ...visitUrls,
  ...NEW_ANSWERS.map((a) => `${SITE}/answers/${a.slug}.html`),
  `${SITE}/visa-appointment/germany-visa-appointment-pakistan/`,
  `${SITE}/visa-appointment/italy-visa-appointment-pakistan/`,
  `${SITE}/visa-appointment/france-visa-appointment-pakistan/`,
  `${SITE}/visa-appointment/uk-visa-appointment-pakistan/`,
  `${SITE}/visa-appointment/usa-visa-appointment-pakistan/`,
  `${SITE}/visa-appointment/canada-visa-appointment-pakistan/`,
  `${SITE}/visa-appointment/australia-visa-appointment-pakistan/`,
  `${SITE}/visa-appointment/schengen-visa-appointment-pakistan/`,
  `${SITE}/document-services/musadaqa-verification/`,
  `${SITE}/document-services/qvp-verification/`,
  `${SITE}/document-services/apostille-pakistan/`,
  `${SITE}/document-services/saudi-embassy-attestation/`,
  `${SITE}/document-services/mofa-attestation/`,
  `${SITE}/terms.html`,
];

function urlEntry(loc, priority = '0.9') {
  return `  <url><loc>${loc}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>\n`;
}

let inject = '';
for (const u of extraUrls) {
  if (!sitemap.includes(`<loc>${u}</loc>`)) {
    inject += urlEntry(u, u.includes('/answers/') ? '0.85' : '0.95');
  }
}
if (inject) {
  sitemap = sitemap.replace('</urlset>', inject + '</urlset>');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('sitemap updated');
}

console.log('Done. Work:', WORK.length, 'Visit:', VISIT.length, 'Answers:', NEW_ANSWERS.length);
