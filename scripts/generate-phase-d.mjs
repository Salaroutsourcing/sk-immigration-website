#!/usr/bin/env node
/**
 * Phase D — more visit/work countries, Lahore/Karachi locals, deepen DE/UK/CA study.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITE = 'https://www.skimmigrationservices.works';
const TODAY = '2026-07-30';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escJson(s) {
  return JSON.stringify(s).replace(/"/g, '&quot;');
}
function write(rel, content) {
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
function crumbsSchema(items) {
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
function serviceSchema(name, url, description, price) {
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
function ul(items) {
  return `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}
function ol(items) {
  return `<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`;
}

function lander({
  title,
  description,
  canonical,
  h1,
  lead,
  crumbs,
  body,
  faqs,
  service,
  dataPage,
  assetDepth,
}) {
  const prefix = '../'.repeat(assetDepth);
  const crumbNav = crumbs
    .map((c, i) =>
      i === crumbs.length - 1 ? `<span>${esc(c.name)}</span>` : `<a href="${esc(c.url)}">${esc(c.name)}</a>`
    )
    .join(' · ');
  const faqHtml = faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
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
  <link rel="icon" href="${prefix}assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="${prefix}assets/css/main.css?v=iosbar3" />
  <script type="application/ld+json">${JSON.stringify(crumbsSchema(crumbs))}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema(faqs))}</script>
  <script type="application/ld+json">${JSON.stringify(service)}</script>
</head>
<body data-page="${esc(dataPage)}" data-breadcrumbs="${escJson(crumbs)}">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main" class="container" style="padding:2.5rem 0 4rem;max-width:920px">
    <nav class="text-muted" style="font-size:0.85rem;margin-bottom:1rem" aria-label="Breadcrumb">${crumbNav}</nav>
    <article class="glass card" style="padding:2rem">
      <p class="eyebrow">SK Immigration Services · Updated ${TODAY}</p>
      <h1 class="display" style="font-size:clamp(1.7rem,3vw,2.35rem);margin-bottom:0.75rem">${esc(h1)}</h1>
      <p class="lead-answer"><strong>Quick answer:</strong> ${lead}</p>
      <p class="text-muted mb-2">Free consultation · Honest advice · Authorities decide visas · No guarantees</p>
      <div class="prose">
        ${body}
        <h2>Frequently asked questions</h2>
        <div class="faq-mini">${faqHtml}</div>
        <h2>Talk to SK Immigration</h2>
        <p>Rawalpindi office with WhatsApp support nationwide. We prepare complete files and explain risks clearly — we never sell fake visa guarantees.</p>
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

/* ---------- VISIT (new) ---------- */
const VISIT_NEW = [
  {
    slug: 'ireland-visit-visa-pakistan',
    name: 'Ireland',
    region: 'Ireland',
    lead: 'Ireland short-stay visit visas need purpose, funds and strong Pakistan ties. SK Immigration prepares Ireland visit files from <strong>PKR 30,000</strong>. Irish authorities decide.',
    purpose: 'tourism, family, business visitor',
    req: ['Passport and online/application forms as required', 'Funds covering the trip', 'Employment or study ties in Pakistan', 'Invitation for family visits when used', 'Travel medical insurance as requested', 'Clear itinerary and accommodation'],
    process: ['Purpose assessment', 'Document packaging', 'Application / VAC prep', 'Biometrics if required', 'Decision tracking'],
    docs: ['Passport, photos', 'Bank statements', 'Job / business proof', 'Invitation or hotels', 'Cover letter'],
    fees: 'SK from <strong>PKR 30,000</strong>. Official fees separate.',
    timeline: 'Often several weeks depending on VAC queues.',
    mistakes: ['Weak ties', 'Unclear purpose', 'Insufficient funds explanation', 'Using visit for unauthorized work'],
  },
  {
    slug: 'greece-visit-visa-pakistan',
    name: 'Greece',
    region: 'Schengen',
    lead: 'Greece Schengen visit visas need insurance €30,000+, funds, itinerary and ties. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    req: ['Passport, Schengen form, photos', 'Travel insurance €30,000+', 'Hotel or invitation', 'Funds and employment proof', 'Itinerary with Greece as main stay when filing via Greece'],
    process: ['Destination check', 'Insurance + bookings', 'Financial file', 'VFS appointment', 'Biometrics'],
    docs: ['Passport pack', 'Insurance', 'Hotels / invite', 'Bank + job docs', 'Cover letter'],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–6 weeks seasonally.',
    mistakes: ['Peak-summer incomplete files', 'Insurance gaps', 'Copy-paste itineraries', 'Wrong filing country'],
  },
  {
    slug: 'austria-visit-visa-pakistan',
    name: 'Austria',
    region: 'Schengen',
    lead: 'Austria Schengen visit files need purpose proof, funds, insurance and return ties. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business, conferences',
    req: ['Passport and Schengen application', 'Insurance €30,000+', 'Accommodation / invitation', 'Funds and Pakistan ties', 'Conference or business letters when applicable'],
    process: ['Purpose mapping', 'Document pack', 'Appointment prep', 'Biometrics', 'Follow-up'],
    docs: ['Passport pack', 'Insurance', 'Invite / hotels', 'Bank + employment', 'Cover letter'],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–6 weeks.',
    mistakes: ['Weak sponsor docs', 'Unexplained deposits', 'Prior refusals ignored', 'Mismatched travel dates'],
  },
  {
    slug: 'belgium-visit-visa-pakistan',
    name: 'Belgium',
    region: 'Schengen',
    lead: 'Belgium Schengen visit visas require complete funds, insurance and purpose documents. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    req: ['Passport, form, photos', 'Insurance €30,000+', 'Accommodation proof', 'Funds and ties', 'Invitation when visiting hosts'],
    process: ['Assessment', 'Checklist', 'TLS/VFS prep', 'Biometrics', 'Tracking'],
    docs: ['Passport pack', 'Insurance', 'Invite / hotels', 'Bank statements', 'Employment proof'],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–6 weeks.',
    mistakes: ['Incomplete host attestation', 'Thin employment letters', 'Insurance not covering full trip', 'Unrealistic multi-country plans'],
  },
  {
    slug: 'romania-visit-visa-pakistan',
    name: 'Romania',
    region: 'Romania',
    lead: 'Romania visit visas need purpose, funds and complete personal docs. SK Immigration from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    req: ['Passport validity as required', 'Application forms and photos', 'Funds and accommodation', 'Invitation when applicable', 'Travel insurance as requested'],
    process: ['Category check', 'Document packaging', 'Submission / appointment', 'Decision tracking'],
    docs: ['Passport, photo', 'Bank proof', 'Hotels / invite', 'Job letter', 'Cover letter'],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–5 weeks.',
    mistakes: ['Wrong visa type', 'Weak ties', 'Fake bookings', 'Overstay risk'],
  },
  {
    slug: 'slovakia-visit-visa-pakistan',
    name: 'Slovakia',
    region: 'Schengen',
    lead: 'Slovakia Schengen visit visas follow standard short-stay rules with country-specific invitation formats. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    req: ['Passport, Schengen form', 'Insurance €30,000+', 'Invitation or hotels', 'Funds and ties', 'Clear travel plan'],
    process: ['Invitation review', 'Financial packaging', 'VFS prep', 'Biometrics'],
    docs: ['Passport pack', 'Insurance', 'Invite / hotels', 'Bank + job', 'Cover letter'],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–5 weeks.',
    mistakes: ['Invalid invitation format', 'Weak funds story', 'Name mismatches', 'Prior refusals unexplained'],
  },
  {
    slug: 'czech-republic-visit-visa-pakistan',
    name: 'Czech Republic',
    region: 'Schengen',
    lead: 'Czech Schengen visit visas need insurance, funds, purpose and ties. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    req: ['Passport and Schengen application', 'Insurance €30,000+', 'Accommodation / invitation', 'Funds and employment proof', 'Itinerary'],
    process: ['Purpose check', 'Docs', 'Appointment', 'Biometrics'],
    docs: ['Passport pack', 'Insurance', 'Invite / hotels', 'Bank + job', 'Cover letter'],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–5 weeks.',
    mistakes: ['Tourist story without bookings', 'Weak employment letters', 'Insurance gaps', 'Wrong main destination'],
  },
  {
    slug: 'cyprus-visit-visa-pakistan',
    name: 'Cyprus',
    region: 'Cyprus',
    lead: 'Cyprus visit visas (category dependent) need passport, funds and purpose evidence. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    req: ['Passport validity', 'Correct Cyprus visa category', 'Hotels or invitation', 'Funds evidence', 'Return plan'],
    process: ['Category confirmation', 'Document pack', 'Submission support', 'Travel briefing'],
    docs: ['Passport, photo', 'Bank statement', 'Hotel / invite', 'Ticket plan'],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 1–4 weeks depending on channel.',
    mistakes: ['Wrong category', 'Overstay', 'Confusing north/south entry rules', 'Unlicensed agents'],
  },
  {
    slug: 'malta-visit-visa-pakistan',
    name: 'Malta',
    region: 'Schengen',
    lead: 'Malta Schengen visit visas need complete short-stay documents and clear purpose. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    req: ['Passport, form, photos', 'Insurance €30,000+', 'Accommodation', 'Funds and ties', 'Invitation when relevant'],
    process: ['Assessment', 'Packaging', 'VFS prep', 'Biometrics'],
    docs: ['Passport pack', 'Insurance', 'Hotels / invite', 'Bank + employment', 'Cover letter'],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–6 weeks.',
    mistakes: ['Peak season incomplete files', 'Weak ties', 'Insurance not Schengen-valid', 'Using visit intending long study'],
  },
  {
    slug: 'switzerland-visit-visa-pakistan',
    name: 'Switzerland',
    region: 'Schengen',
    lead: 'Switzerland Schengen visit visas are document-strict: funds, insurance, purpose and ties must be clear. SK from <strong>PKR 30,000</strong>.',
    purpose: 'tourism, family, business',
    req: ['Passport and Schengen application', 'Insurance €30,000+', 'Hotel or invitation', 'Strong funds evidence', 'Employment / business ties in Pakistan'],
    process: ['Risk review', 'Document packaging', 'Appointment prep', 'Biometrics', 'Follow-up'],
    docs: ['Passport pack', 'Insurance', 'Invite / hotels', 'Bank statements', 'Job / business docs', 'Cover letter'],
    fees: 'SK from <strong>PKR 30,000</strong>.',
    timeline: 'Often 2–6 weeks.',
    mistakes: ['Underfunded itineraries', 'Vague tourism plans', 'Sponsor letters without proof', 'Prior refusals unexplained'],
  },
];

function visitFaqs(v) {
  return [
    { q: `${v.name} visit visa requirements from Pakistan?`, a: `Typically passport, purpose proof, funds, accommodation/invitation, and insurance where required. SK Immigration builds a ${v.name}-specific checklist from PKR 30,000.` },
    { q: `Do I need an invitation for ${v.name}?`, a: 'Helpful for family visits; tourists can often use hotel bookings. Host documents must be complete and lawful.' },
    { q: `SK Immigration ${v.name} visit fee?`, a: 'From PKR 30,000 for file preparation. Official fees are separate. No visa guarantees.' },
    { q: `Processing time for ${v.name} visit visa?`, a: v.timeline.replace(/<\/?strong>/g, '') },
    { q: `Can I work on a ${v.name} visit visa?`, a: 'No. Work needs the correct work/national authorization.' },
    { q: 'Do you guarantee approval?', a: 'No. Missions and immigration authorities decide. We prepare honest, complete files.' },
  ];
}

function visitBody(v) {
  return `
        <h2>${esc(v.name)} visit visa from Pakistan</h2>
        <p>SK Immigration helps Pakistani applicants prepare <strong>${esc(v.name)} visit visa</strong> files for ${esc(v.purpose)}. Embassies decide outcomes — we prepare complete, honest applications.</p>
        <h2>Requirements</h2>
        ${ul(v.req)}
        <h2>Process — how to apply</h2>
        ${ol(v.process)}
        <h2>Documents checklist</h2>
        ${ul(v.docs)}
        <h2>Fees</h2>
        <p>${v.fees}</p>
        <h2>Processing time</h2>
        <p>${v.timeline}</p>
        <h2>Common mistakes</h2>
        ${ul(v.mistakes)}
        <h2>Related</h2>
        <p><a href="../">All visit visas</a> · <a href="../../work-permit/">Work permits</a> · <a href="../../visa-appointment/">Appointments</a> · <a href="../../study-visa/">Study visas</a></p>
`;
}

/* ---------- WORK (new) ---------- */
const WORK_NEW = [
  {
    slug: 'netherlands-work-permit-pakistan',
    name: 'Netherlands',
    code: 'nl',
    lead: 'Netherlands work routes need a Dutch employer and the correct residence/work authorization. SK Immigration supports file prep from <strong>PKR 80,000</strong>.',
    intro: 'The Netherlands is popular for skilled and highly skilled migrant routes when employers meet salary thresholds. Tourist entry is not a work shortcut.',
    req: ['Dutch employment contract / sponsorship as required', 'Passport and forms', 'Qualifications matching the role', 'Salary meeting route thresholds where applicable', 'Insurance and civil docs as requested'],
    process: ['Contract eligibility check', 'Document packaging', 'MVV / visa prep as applicable', 'Biometrics', 'Arrival registration briefing'],
    docs: ['Passport, photos', 'Signed contract', 'CV and degrees', 'Translations if required', 'Fee receipts'],
    fees: 'SK from <strong>PKR 80,000</strong>. Authority fees separate.',
    timeline: 'Often 2–5 months after a compliant offer.',
    mistakes: ['Salary below legal thresholds', 'Fake job offers', 'Missing translations', 'Visit visa for work intent'],
  },
  {
    slug: 'romania-work-permit-pakistan',
    name: 'Romania',
    code: 'ro',
    lead: 'Romania work visas typically need a Romanian employer work authorization and national visa. SK from <strong>PKR 80,000</strong>.',
    intro: 'Romania has demand in manufacturing, construction and services when employer papers are correct.',
    req: ['Romanian work authorization / contract', 'Passport, photos, forms', 'Qualifications / experience', 'Medical / police docs when requested', 'Insurance as required'],
    process: ['Verify employer papers', 'Pakistan-side checklist', 'Visa appointment prep', 'Biometrics', 'Travel briefing'],
    docs: ['Passport pack', 'Work authorization', 'CV and certificates', 'Civil docs if asked', 'Fee receipts'],
    fees: 'SK from <strong>PKR 80,000</strong>.',
    timeline: 'Often 1–4 months after employer authorization.',
    mistakes: ['Unverified agents', 'Mismatched permit vs visa category', 'Expired medicals', 'Name mismatches'],
  },
  {
    slug: 'hungary-work-permit-pakistan',
    name: 'Hungary',
    code: 'hu',
    lead: 'Hungary work permits need a sponsoring Hungarian employer and complete national visa documents. SK from <strong>PKR 80,000</strong>.',
    intro: 'Hungary is explored for hospitality, manufacturing and skilled roles. Language and contract compliance matter.',
    req: ['Hungarian work permit / employer authorization', 'Employment contract', 'Passport and forms', 'Qualifications evidence', 'Accommodation proof when requested'],
    process: ['Employer document review', 'File packaging', 'Appointment prep', 'Biometrics', 'Travel briefing'],
    docs: ['Passport, photos', 'Permit / contract', 'CV and certificates', 'Civil docs if asked'],
    fees: 'SK from <strong>PKR 80,000</strong>.',
    timeline: 'Often 1–4 months after employer papers.',
    mistakes: ['Fake Hungarian job letters', 'Incomplete translations', 'Tourist entry for work', 'Ignoring language needs'],
  },
  {
    slug: 'ireland-work-permit-pakistan',
    name: 'Ireland',
    code: 'ie',
    lead: 'Ireland employment permits (e.g. Critical Skills / General) need an eligible job offer and complete Department of Enterprise / immigration steps. SK from <strong>PKR 80,000</strong>.',
    intro: 'Ireland work is regulated: the permit type must match the occupation and salary. We do not invent sponsorships.',
    req: ['Eligible Irish job offer', 'Correct employment permit category', 'Passport and identity docs', 'Qualifications matching the role', 'English evidence where required'],
    process: ['Permit pathway review', 'Document packaging', 'Application sequencing', 'Entry / residence steps briefing'],
    docs: ['Passport', 'Offer / permit docs', 'Degrees and experience letters', 'Police / medical if requested'],
    fees: 'SK from <strong>PKR 80,000</strong>. Government fees separate.',
    timeline: 'Often several months depending on permit type.',
    mistakes: ['Wrong permit category', 'Salary below thresholds', 'Inflated experience claims', 'Fake “guaranteed Ireland jobs”'],
  },
  {
    slug: 'malta-work-permit-pakistan',
    name: 'Malta',
    code: 'mt',
    lead: 'Malta work authorizations need a Maltese employer and complete Identity Malta / visa steps. SK from <strong>PKR 80,000</strong>.',
    intro: 'Malta attracts hospitality, gaming/support and skilled services when employers file correctly.',
    req: ['Maltese employment contract / authorization', 'Passport and forms', 'Qualifications', 'Health insurance as required', 'Accommodation evidence when asked'],
    process: ['Contract review', 'Document pack', 'Visa / residence prep', 'Biometrics', 'Arrival briefing'],
    docs: ['Passport, photos', 'Contract', 'CV and certificates', 'Insurance', 'Fee receipts'],
    fees: 'SK from <strong>PKR 80,000</strong>.',
    timeline: 'Often 2–5 months.',
    mistakes: ['Unlicensed recruiters', 'Incomplete health insurance', 'Name mismatches', 'Visit for work intent'],
  },
  {
    slug: 'cyprus-work-permit-pakistan',
    name: 'Cyprus',
    code: 'cy',
    lead: 'Cyprus work visas need a lawful employer authorization and complete entry documents. SK from <strong>PKR 80,000</strong>.',
    intro: 'Cyprus work is common in hospitality and services when contracts and civil docs are in order.',
    req: ['Employer work authorization', 'Passport and photos', 'Contract details', 'Medicals when required', 'Civil / educational docs as requested'],
    process: ['Offer verification', 'Document packaging', 'Visa prep', 'Travel briefing'],
    docs: ['Passport pack', 'Authorization / contract', 'Certificates', 'Medical reports if instructed'],
    fees: 'SK from <strong>PKR 80,000</strong>.',
    timeline: 'Often 1–4 months.',
    mistakes: ['Fake job offers', 'Wrong entry category', 'Attestation out of order', 'Overstay history'],
  },
];

function workFaqs(w) {
  return [
    { q: `How to get a ${w.name} work permit from Pakistan?`, a: `You typically need a genuine ${w.name} job offer/authorization, then a complete national visa file. SK Immigration prepares the Pakistan-side documents from PKR 80,000; authorities decide.` },
    { q: `What documents are needed for ${w.name} work visa?`, a: 'Passport, contract/authorization, CV, certificates, and any medical/police documents requested. Exact lists vary — we build a checklist for your case.' },
    { q: `SK Immigration ${w.name} work fee?`, a: 'From PKR 80,000 for preparation support. Official fees are separate. No guarantees.' },
    { q: `Do I need local language for ${w.name}?`, a: 'Often helpful; some international roles use English. We assess language before you invest.' },
    { q: `Can I convert a visit visa to work in ${w.name}?`, a: 'Not as a DIY loophole. Work needs the correct authorization. We advise legal routes only.' },
    { q: 'Do you guarantee the visa?', a: 'No. Immigration authorities decide every application.' },
  ];
}

function workBody(w) {
  return `
        <h2>${esc(w.name)} work permit / work visa from Pakistan</h2>
        <p>${w.intro}</p>
        <h2>Requirements</h2>
        ${ul(w.req)}
        <h2>Process</h2>
        ${ol(w.process)}
        <h2>Documents</h2>
        ${ul(w.docs)}
        <p>Checklist tool: <a href="../../checklist.html?country=${w.code}&amp;type=work">Open checklist →</a></p>
        <h2>Fees</h2>
        <p>${w.fees}</p>
        <h2>Timeline</h2>
        <p>${w.timeline}</p>
        <h2>Common mistakes</h2>
        ${ul(w.mistakes)}
        <h2>Related</h2>
        <p><a href="../">All work permits</a> · <a href="../../visit-visa/">Visit visas</a> · <a href="../../jobs.html">Jobs board</a> · <a href="../../ausbildung.html">Ausbildung</a></p>
`;
}

const newUrls = [];

for (const v of VISIT_NEW) {
  const canonical = `${SITE}/visit-visa/${v.slug}/`;
  const h1 = `${v.name} Visit Visa Pakistan`;
  const crumbs = [
    { name: 'Home', url: SITE + '/' },
    { name: 'Visit Visa', url: SITE + '/visit-visa/' },
    { name: h1, url: canonical },
  ];
  write(
    `visit-visa/${v.slug}/index.html`,
    lander({
      title: `${h1} — Requirements, Documents, Fees & FAQ | SK Immigration`,
      description: `${v.name} visit visa from Pakistan (${v.region}): requirements, documents, fees, processing time, mistakes and FAQ. SK Immigration Services, Rawalpindi.`,
      canonical,
      h1,
      lead: v.lead,
      crumbs,
      body: visitBody(v),
      faqs: visitFaqs(v),
      service: serviceSchema(h1, canonical, v.lead.replace(/<[^>]+>/g, ''), 30000),
      dataPage: 'visit-visa',
      assetDepth: 2,
    })
  );
  newUrls.push(canonical);
}

for (const w of WORK_NEW) {
  const canonical = `${SITE}/work-permit/${w.slug}/`;
  const h1 = `${w.name} Work Permit Pakistan`;
  const crumbs = [
    { name: 'Home', url: SITE + '/' },
    { name: 'Work Permit', url: SITE + '/work-permit/' },
    { name: h1, url: canonical },
  ];
  write(
    `work-permit/${w.slug}/index.html`,
    lander({
      title: `${h1} — Requirements, Fees & Process | SK Immigration`,
      description: `${w.name} work permit / work visa from Pakistan: requirements, documents, fees, timeline, mistakes and FAQ. SK Immigration Services, Rawalpindi.`,
      canonical,
      h1,
      lead: w.lead,
      crumbs,
      body: workBody(w),
      faqs: workFaqs(w),
      service: serviceSchema(h1, canonical, w.lead.replace(/<[^>]+>/g, ''), 80000),
      dataPage: 'work-permit',
      assetDepth: 2,
    })
  );
  newUrls.push(canonical);
}

/* ---------- LOCAL cities ---------- */
function localPage({ city, slug, title, description, h1, intro, travelNote }) {
  const canonical = `${SITE}/local/${slug}/`;
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta name="author" content="SK Immigration Services" />
  <link rel="icon" href="../../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../../assets/css/main.css?v=iosbar3" />
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `SK Immigration Services — ${city}`,
    url: canonical,
    telephone: '+923045999859',
    areaServed: city,
    parentOrganization: { '@id': SITE + '/#organization' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Office No. 10, Alfazal Plaza 64C, Satellite Town',
      addressLocality: 'Rawalpindi',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
  })}</script>
  <script type="application/ld+json">${JSON.stringify(
    faqSchema([
      {
        q: `Is there a study visa consultant for ${city}?`,
        a: `Yes. SK Immigration Services supports ${city} applicants by WhatsApp and in-person at our Rawalpindi office. Free consultation. No visa guarantees.`,
      },
      {
        q: `Do I need to visit Rawalpindi from ${city}?`,
        a: travelNote,
      },
      {
        q: `What services can ${city} clients get?`,
        a: 'Study visas, work permits, visit visas, Saudi work visa processing, appointments and attestation — with country-specific checklists.',
      },
    ])
  )}</script>
</head>
<body data-page="services">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main">
    <div class="page-hero container">
      <p class="eyebrow">Local · ${esc(city)}</p>
      <h1 class="display">${esc(h1)}</h1>
      <p class="section-sub">${esc(intro)}</p>
    </div>
    <section><div class="container grid-2">
      <article class="glass card prose">
        <h2>How ${esc(city)} clients work with us</h2>
        <p>${esc(travelNote)}</p>
        <p><strong>Office (walk-in):</strong> Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi</p>
        <p><strong>Hours:</strong> Mon–Sat, 10:00 AM – 7:00 PM</p>
        <p><strong>WhatsApp:</strong> <a href="https://wa.me/923045999859">+92 304 5999859</a></p>
        <p><a class="btn btn-gold" href="../../contact.html">Book free consultation</a>
        <a class="btn btn-whatsapp" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp</a></p>
      </article>
      <article class="glass card prose">
        <h2>Popular paths from ${esc(city)}</h2>
        <ul>
          <li><a href="../../study-visa/">Study Visa hub</a></li>
          <li><a href="../../work-permit/">Work Permit hub</a></li>
          <li><a href="../../visit-visa/">Visit Visa hub</a></li>
          <li><a href="../../saudi-visa/saudi-visa-processing-pakistan/">Saudi work visa processing</a></li>
          <li><a href="../../study-visa/germany-study-visa-pakistan/">Germany study visa</a></li>
          <li><a href="../../visit-visa/uk-visit-visa-pakistan/">UK visit visa</a></li>
        </ul>
        <p>Also: <a href="../rawalpindi-study-visa-consultant/">Rawalpindi</a> · <a href="../islamabad-study-visa-consultant/">Islamabad</a></p>
      </article>
    </div></section>
    <section><div class="container">
      <article class="glass card prose" style="padding:1.5rem">
        <h2>FAQs for ${esc(city)} applicants</h2>
        <div class="faq-mini">
          <details><summary>Is there a study visa consultant for ${esc(city)}?</summary><p>Yes. SK Immigration Services supports ${esc(city)} applicants by WhatsApp and in-person at our Rawalpindi office. Free consultation. No visa guarantees.</p></details>
          <details><summary>Do I need to visit Rawalpindi from ${esc(city)}?</summary><p>${esc(travelNote)}</p></details>
          <details><summary>What services can ${esc(city)} clients get?</summary><p>Study visas, work permits, visit visas, Saudi work visa processing, appointments and attestation — with country-specific checklists.</p></details>
        </div>
      </article>
    </div></section>
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
  write(`local/${slug}/index.html`, html);
  newUrls.push(canonical);
}

localPage({
  city: 'Lahore',
  slug: 'lahore-study-visa-consultant',
  title: 'Study Visa Consultant Lahore | SK Immigration Services',
  description:
    'Study visa, work permit and visit visa help for Lahore applicants — WhatsApp nationwide and Rawalpindi walk-in office. SK Immigration Services. Free consultation.',
  h1: 'Study Visa Consultant Lahore',
  intro:
    'Lahore students and families get the same country checklists and honest counselling — many files start on WhatsApp; walk-ins welcome at our Satellite Town Rawalpindi office.',
  travelNote:
    'Most Lahore clients begin on WhatsApp with document review. An in-person visit to Rawalpindi is optional when you prefer face-to-face file checks.',
});

localPage({
  city: 'Karachi',
  slug: 'karachi-study-visa-consultant',
  title: 'Study Visa Consultant Karachi | SK Immigration Services',
  description:
    'Study visa, work permit and visit visa guidance for Karachi applicants via WhatsApp, with optional Rawalpindi office visits. SK Immigration Services. Free consultation.',
  h1: 'Study Visa Consultant Karachi',
  intro:
    'Karachi applicants use SK Immigration for study, work, visit and Saudi processing support — remote-first with clear checklists, then Rawalpindi walk-in if needed.',
  travelNote:
    'Karachi clients usually complete consultations and document reviews on WhatsApp. Travel to the Rawalpindi office is optional for final file packaging.',
});

/* ---------- Enrich existing local Rawalpindi services list slightly via answers ---------- */
const ANSWERS = [
  {
    slug: 'study-visa-consultant-lahore',
    q: 'Is there a study visa consultant for Lahore?',
    short:
      'Yes. SK Immigration Services supports Lahore applicants by WhatsApp and at our Rawalpindi office. Free consultation for study, work and visit files — no visa guarantees.',
  },
  {
    slug: 'study-visa-consultant-karachi',
    q: 'Is there a study visa consultant for Karachi?',
    short:
      'Yes. SK Immigration helps Karachi students and families remotely via WhatsApp, with optional Rawalpindi walk-in. Free consultation. Authorities decide visas.',
  },
];

for (const a of ANSWERS) {
  const canonical = `${SITE}/answers/${a.slug}`;
  write(
    `answers/${a.slug}.html`,
    `<!DOCTYPE html>
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
  <script type="application/ld+json">${JSON.stringify(faqSchema([{ q: a.q, a: a.short + ' Contact: https://www.skimmigrationservices.works · WhatsApp +92 304 5999859.' }]))}</script>
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
        <p>Local pages: <a href="../local/lahore-study-visa-consultant/">Lahore</a> · <a href="../local/karachi-study-visa-consultant/">Karachi</a> · <a href="../local/rawalpindi-study-visa-consultant/">Rawalpindi</a></p>
        <h2>Do this next</h2>
        <ol>
          <li><a href="../contact.html">Free consultation</a></li>
          <li>WhatsApp <a href="https://wa.me/923045999859">+92 304 5999859</a></li>
          <li><a href="../study-visa/">Study Visa hub</a></li>
        </ol>
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
`
  );
  newUrls.push(canonical + '.html');
  const idxPath = path.join(ROOT, 'assets/data/answers-index.json');
  const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
  if (!idx.find((x) => x.slug === a.slug)) {
    idx.push({ slug: a.slug, q: a.q, short: a.short, tags: ['local', 'consultant'] });
    fs.writeFileSync(idxPath, JSON.stringify(idx, null, 2) + '\n');
  }
}

/* ---------- Update hubs: append cards for new pages ---------- */
function appendHubCards(hubRel, cardsHtml) {
  const full = path.join(ROOT, hubRel);
  let t = fs.readFileSync(full, 'utf8');
  const marker = '</div>\n    </section>\n  </main>';
  if (!t.includes(marker)) {
    console.warn('hub marker missing', hubRel);
    return;
  }
  // insert before closing grid
  t = t.replace(
    /(<div class="container grid-2"[^>]*>)([\s\S]*?)(<\/div>\n    <\/section>\n  <\/main>)/,
    (_, open, inner, close) => {
      if (inner.includes(cardsHtml.slice(0, 40))) return open + inner + close;
      return open + inner + cardsHtml + close;
    }
  );
  fs.writeFileSync(full, t);
  console.log('hub updated', hubRel);
}

const visitCards = VISIT_NEW.map(
  (v) =>
    `<a class="glass card reveal" href="${v.slug}/"><h3 style="font-family:var(--font-display);margin-bottom:0.35rem">${esc(v.name)} Visit Visa Pakistan</h3><p class="text-muted" style="font-size:0.92rem">${esc(v.region)} · Requirements, documents, fees, timeline &amp; FAQ.</p></a>`
).join('');

const workCards = WORK_NEW.map(
  (w) =>
    `<a class="glass card reveal" href="${w.slug}/"><h3 style="font-family:var(--font-display);margin-bottom:0.35rem">${esc(w.name)} Work Permit Pakistan</h3><p class="text-muted" style="font-size:0.92rem">Requirements, process, documents, fees, timeline &amp; FAQ.</p></a>`
).join('');

appendHubCards('visit-visa/index.html', visitCards);
appendHubCards('work-permit/index.html', workCards);

/* ---------- Sitemap ---------- */
let sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
let inject = '';
for (const u of newUrls) {
  const loc = u.endsWith('.html') ? u : u;
  if (!sitemap.includes(`<loc>${loc}</loc>`)) {
    inject += `  <url><loc>${loc}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
  }
}
if (inject) {
  sitemap = sitemap.replace('</urlset>', inject + '</urlset>');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
  console.log('sitemap +', newUrls.length);
}

console.log('Phase D landers done. visit', VISIT_NEW.length, 'work', WORK_NEW.length);
