#!/usr/bin/env node
/**
 * Batch-deepen thin Answers (<400 words) with country-aware unique content.
 * Skips already-deep pages. Rebuild hub via build-answers-hub.mjs after.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TODAY = '2026-07-30';
const MIN_KEEP = 400;

const COUNTRIES = {
  germany: {
    name: 'Germany',
    code: 'de',
    region: 'Schengen / EU',
    lang: 'German A2–B1+ for many programs/Ausbildung; English degrees may use IELTS/TOEFL',
    funds: 'Often Sperrkonto / blocked account (amount changes — verify embassy)',
    notes: 'Ausbildung is a parallel earn-while-you-train path.',
    lander: '../study-visa/germany-study-visa-pakistan/',
    official: '../official-links/#de',
  },
  france: {
    name: 'France',
    code: 'fr',
    region: 'Schengen / EU',
    lang: 'English programs usually IELTS/TOEFL; French-taught need French proof; Campus France often applies',
    funds: 'Tuition + living proof per France-Visas / Campus France guidance',
    notes: 'Campus France steps matter for many Pakistani applicants.',
    lander: '../study-visa/france-study-visa-pakistan/',
    official: '../official-links/#fr',
  },
  italy: {
    name: 'Italy',
    code: 'it',
    region: 'Schengen / EU',
    lang: 'English programs may ask IELTS; Italian-taught need Italian; Universitaly pre-enrolment common',
    funds: 'Living + tuition proof per Italian mission checklist',
    notes: 'Universitaly / pre-enrolment timing is critical.',
    lander: '../study-visa/italy-study-visa-pakistan/',
    official: '../official-links/#it',
  },
  spain: {
    name: 'Spain',
    code: 'es',
    region: 'Schengen / EU',
    lang: 'English/Spanish program dependent; IELTS or DELE/SIELE as required',
    funds: 'Monthly living minimums × months + tuition as mission requires',
    notes: 'Long-stay student visas differ from short Schengen visits.',
    lander: '../study-visa/spain-study-visa-pakistan/',
    official: '../official-links/#es',
  },
  netherlands: {
    name: 'Netherlands',
    code: 'nl',
    region: 'Schengen / EU',
    lang: 'Many English degrees; IELTS/TOEFL common; Dutch programs need Dutch',
    funds: 'IND living-cost figures + tuition; often paid via university process',
    notes: 'Highly competitive English programs — marks and motivation matter.',
    lander: '../study-visa/netherlands-study-visa-pakistan/',
    official: '../official-links/#nl',
  },
  portugal: {
    name: 'Portugal',
    code: 'pt',
    region: 'Schengen / EU',
    lang: 'English or Portuguese depending on program; IELTS or Portuguese proof',
    funds: 'Living + tuition per Portuguese consular checklist',
    notes: 'Popular budget-conscious EU option when offers are genuine.',
    lander: '../study-visa/portugal-study-visa-pakistan/',
    official: '../official-links/#pt',
  },
  poland: {
    name: 'Poland',
    code: 'pl',
    region: 'Schengen / EU',
    lang: 'Many English programs; IELTS or university English test / MOI sometimes',
    funds: 'Tuition + living for the requested period',
    notes: 'Often explored for mid-budget profiles with solid documents.',
    lander: '../study-visa/poland-study-visa-pakistan/',
    official: '../official-links/#pl',
  },
  hungary: {
    name: 'Hungary',
    code: 'hu',
    region: 'Schengen / EU',
    lang: 'English programs widespread; IELTS or institutional English evidence',
    funds: 'Tuition + living; keep bank history clean',
    notes: 'High Pakistani interest — embassies still check credibility closely.',
    lander: '../study-visa/hungary-study-visa-pakistan/',
    official: '../official-links/#hu',
  },
  'czech-republic': {
    name: 'Czech Republic',
    code: 'cz',
    region: 'Schengen / EU',
    lang: 'English or Czech; IELTS or Czech language as program requires',
    funds: 'Living + tuition per Czech mission rules',
    notes: 'Also written as Czechia on some portals.',
    lander: '../study-visa/czech-republic-study-visa-pakistan/',
    official: '../official-links/#cz',
  },
  malta: {
    name: 'Malta',
    code: 'mt',
    region: 'Schengen / EU',
    lang: 'English-medium common; IELTS often expected',
    funds: 'Tuition + living; smaller market — choose recognized schools carefully',
    notes: 'Verify the institution is recognized before paying deposits.',
    lander: '../study-visa/malta-study-visa-pakistan/',
    official: '../official-links/#mt',
  },
  cyprus: {
    name: 'Cyprus',
    code: 'cy',
    region: 'EU (note North/South context in counseling)',
    lang: 'English programs common; IELTS or university test',
    funds: 'Tuition + living per Republic of Cyprus student rules when applying that route',
    notes: 'Confirm which administration/university you are dealing with before paying.',
    lander: '../study-visa/cyprus-study-visa-pakistan/',
    official: '../official-links/#cy',
  },
  slovakia: {
    name: 'Slovakia',
    code: 'sk',
    region: 'Schengen / EU',
    lang: 'English or Slovak; IELTS / university English as required',
    funds: 'Living + tuition per Slovak mission checklist',
    notes: 'Often compared with Hungary/Czech for mid-budget plans.',
    lander: '../study-visa/slovakia-study-visa-pakistan/',
    official: '../official-links/#sk',
  },
  romania: {
    name: 'Romania',
    code: 'ro',
    region: 'EU',
    lang: 'English/Romanian programs; IELTS or institutional English',
    funds: 'Tuition + living proof as mission requires',
    notes: 'Not Schengen (yet) — travel rules differ from HU/PL.',
    lander: '../study-visa/romania-study-visa-pakistan/',
    official: '../official-links/#ro',
  },
  ireland: {
    name: 'Ireland',
    code: 'ie',
    region: 'EU (not Schengen)',
    lang: 'IELTS/PTE usually expected for English programs',
    funds: 'Tuition + living per Irish Immigration guidance',
    notes: 'Separate from UK rules after Brexit.',
    lander: '../study-visa/ireland-study-visa-pakistan/',
    official: '../official-links/#ie',
  },
  austria: {
    name: 'Austria',
    code: 'at',
    region: 'Schengen / EU',
    lang: 'German often needed; English programs may ask IELTS',
    funds: 'Living + tuition; blocked-style proofs may apply depending on case',
    notes: 'Language planning is usually the bottleneck.',
    lander: '../study-visa/austria-study-visa-pakistan/',
    official: '../official-links/#at',
  },
  belgium: {
    name: 'Belgium',
    code: 'be',
    region: 'Schengen / EU',
    lang: 'English/French/Dutch by region and program; IELTS or local language',
    funds: 'Living + tuition per Belgian immigration/mission rules',
    notes: 'University type (community) affects admissions flexibility.',
    lander: '../study-visa/belgium-study-visa-pakistan/',
    official: '../official-links/#be',
  },
  greece: {
    name: 'Greece',
    code: 'gr',
    region: 'Schengen / EU',
    lang: 'English or Greek; IELTS or Greek language as required',
    funds: 'Living + tuition per Greek mission checklist',
    notes: 'Document completeness matters as much as marks.',
    lander: '../study-visa/greece-study-visa-pakistan/',
    official: '../official-links/#gr',
  },
  switzerland: {
    name: 'Switzerland',
    code: 'ch',
    region: 'Schengen (not EU)',
    lang: 'English/German/French/Italian by canton; IELTS or local language',
    funds: 'High living costs — funds proof must be realistic',
    notes: 'Competitive and expensive; honesty on budget is essential.',
    lander: '../study-visa/switzerland-study-visa-pakistan/',
    official: '../official-links/#ch',
  },
  turkey: {
    name: 'Turkey',
    code: 'tr',
    region: 'Türkiye',
    lang: 'English or Turkish; IELTS or university English / TÖMER',
    funds: 'Tuition + living; not a Schengen visa',
    notes: 'Different from EU Schengen process entirely.',
    lander: '../study-visa/turkey-study-visa-pakistan/',
    official: '../official-links/#tr',
  },
  malaysia: {
    name: 'Malaysia',
    code: 'my',
    region: 'Asia',
    lang: 'English-medium common; IELTS or institutional English / MOI sometimes',
    funds: 'Tuition + living; EMGS processes often involved',
    notes: 'Verify EMGS / immigration steps before deposits.',
    lander: '../study-visa/malaysia-study-visa-pakistan/',
    official: '../official-links/#my',
  },
  uk: {
    name: 'United Kingdom',
    code: 'gb',
    region: 'UK',
    lang: 'Secure English tests commonly required unless exempt',
    funds: 'CAS-linked maintenance + unpaid tuition; day-count rules matter',
    notes: 'CAS-first process on GOV.UK.',
    lander: '../study-visa/uk-study-visa-pakistan/',
    official: '../official-links/#gb',
  },
  canada: {
    name: 'Canada',
    code: 'ca',
    region: 'Canada',
    lang: 'IELTS/PTE/TOEFL commonly needed for admission',
    funds: 'Tuition + living; GIC often used by Pakistani students',
    notes: 'PAL rules can apply by intake — verify IRCC.',
    lander: '../study-visa/canada-study-visa-pakistan/',
    official: '../official-links/#ca',
  },
  australia: {
    name: 'Australia',
    code: 'au',
    region: 'Australia',
    lang: 'IELTS/PTE/TOEFL commonly required',
    funds: 'Tuition + living evidence for subclass 500',
    notes: 'Genuine Student / GS assessments apply.',
    lander: '../study-visa/australia-study-visa-pakistan/',
    official: '../official-links/#au',
  },
  usa: {
    name: 'United States',
    code: 'us',
    region: 'USA',
    lang: 'TOEFL/IELTS/Duolingo as school requires; SEVIS/I-20 process',
    funds: 'Strong liquid funds + sponsor docs for F-1',
    notes: 'Interview credibility is decisive.',
    lander: '../study-visa/usa-study-visa-pakistan/',
    official: '../official-links/#us',
  },
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wordCount(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function detect(slug) {
  if (slug.startsWith('ielts-for-') && slug.endsWith('-study')) {
    const key = slug.slice('ielts-for-'.length, -'-study'.length);
    return { type: 'ielts', key };
  }
  if (slug.startsWith('study-') && slug.endsWith('-low-marks')) {
    const key = slug.slice('study-'.length, -'-low-marks'.length);
    return { type: 'lowmarks', key };
  }
  if (slug.startsWith('how-to-apply-') && slug.endsWith('-student-visa-pakistan')) {
    const key = slug.slice('how-to-apply-'.length, -'-student-visa-pakistan'.length);
    return { type: 'howto', key };
  }
  if (slug.endsWith('-study-visa-requirements-pakistan')) {
    const key = slug.slice(0, -'-study-visa-requirements-pakistan'.length);
    return { type: 'requirements', key };
  }
  if (slug.endsWith('-study-visa-cost-pakistan')) {
    const key = slug.slice(0, -'-study-visa-cost-pakistan'.length);
    return { type: 'cost', key };
  }
  return { type: 'generic', key: null };
}

function contentFor(type, c, slug) {
  if (type === 'ielts') {
    return {
      title: `Do I need IELTS for ${c.name} study visa?`,
      description: `IELTS and English rules for ${c.name} study from Pakistan: when IELTS is required, MOI alternatives, French/German/local language paths, and SK Immigration guidance.`,
      lead: `It depends on the <strong>language of instruction</strong> and the university’s offer letter. For ${c.name}, typical pattern: ${esc(c.lang)}. The visa mission usually follows what the school requires — not a single global IELTS score.`,
      body: `
        <h2>When IELTS is usually required</h2>
        <p>If your ${c.name} program is taught in English and the university lists IELTS/TOEFL/PTE as a condition, you should plan the test early. Conditional offers that still need English must be cleared before you treat the file as “visa ready.”</p>
        <h2>When IELTS may not be required</h2>
        <ul>
          <li>Program taught in the local language with accepted local-language certificates</li>
          <li>University internal English test or interview (only if the offer says so)</li>
          <li>Medium-of-instruction (MOI) letter — only where the school and mission accept it</li>
          <li>Exemptions listed by the institution (prior English-medium degrees, etc.)</li>
        </ul>
        <p>${c.name} note: ${esc(c.notes)}</p>
        <h2>Visa vs admission language rules</h2>
        <p>Admission language and visa credibility are related but not identical. Weak English with an English-taught offer is a common refusal risk. SK Immigration aligns your test plan with the real offer before you pay embassy fees.</p>
        <h2>What to do next</h2>
        <ol>
          <li>Open <a href="${c.lander}">${c.name} Study Visa Pakistan</a></li>
          <li>Confirm English/local language line on your offer</li>
          <li>Use <a href="../checklist.html?country=${c.code}&amp;type=study">${c.name} checklist</a></li>
          <li>Verify portals on <a href="${c.official}">official ${c.name} links</a></li>
        </ol>
        <h2>Related</h2>
        <p><a href="moi-letter-instead-of-ielts.html">MOI instead of IELTS</a> · <a href="study-europe-without-ielts.html">Study in Europe without IELTS</a> · <a href="../guides/study-abroad-without-ielts-pakistan/">Without IELTS guide</a></p>
      `,
      faqs: [
        [`Do I need IELTS for ${c.name} study visa?`, `Depends on program language and the offer. ${c.lang}`],
        [`Can MOI replace IELTS for ${c.name}?`, `Only if the university and mission accept MOI for your case. Never assume Facebook advice equals policy.`],
        [`What score do I need?`, `Follow the university’s published minimum for your program. Visa officers also assess whether you can study in that language.`],
      ],
    };
  }
  if (type === 'lowmarks') {
    return {
      title: `Can I study in ${c.name} with low marks?`,
      description: `Low marks study options in ${c.name} from Pakistan: realistic pathways, foundation/pathway ideas, documents that still matter, and honest SK Immigration advice.`,
      lead: `Sometimes — but <strong>“low marks + guaranteed visa”</strong> offers are a red flag. For ${c.name} (${c.region}), universities set academic bars; embassies check funds, intent and documents. SK Immigration maps realistic schools/pathways for ~50–65% profiles when the rest of the file is strong.`,
      body: `
        <h2>What “low marks” usually means in practice</h2>
        <p>Below ~60% intermediate/bachelor averages limit elite public universities, but some private institutions, pathway/foundation routes, or applied programs in ${c.name} may still review your file — case by case.</p>
        <h2>${c.name}-specific reality check</h2>
        <p>${esc(c.notes)} Language: ${esc(c.lang)}. Funds: ${esc(c.funds)}.</p>
        <h2>What still must be strong</h2>
        <ul>
          <li>Genuine admission / pathway offer</li>
          <li>Clean proof of funds and sponsor story</li>
          <li>Honest SOP explaining academics and career goal</li>
          <li>Consistent documents (names, dates, attestation)</li>
        </ul>
        <h2>What will not work</h2>
        <ul>
          <li>Buying fake grades or fake offers</li>
          <li>Visit-visa shortcuts to “convert” later</li>
          <li>Ignoring language requirements</li>
        </ul>
        <p>Primary page: <a href="${c.lander}">${c.name} Study Visa Pakistan</a> · compare options: <a href="../compare.html">country compare</a> · <a href="study-europe-low-marks.html">Europe low marks overview</a>.</p>
      `,
      faqs: [
        [`Can I study in ${c.name} with low marks?`, `Possibly via realistic institutions or pathway programs, not guarantees. Funds, language and documents still decide outcomes.`],
        [`Will SK Immigration guarantee a ${c.name} visa with low marks?`, `No. We shortlist honest options and prepare files; authorities decide.`],
        [`Should I pick ${c.name} only because it is “easy”?`, `No. Pick a program you can finish and fund. “Easy country” marketing causes refusals.`],
      ],
    };
  }
  if (type === 'howto') {
    return {
      title: `How to apply for ${c.name} student visa from Pakistan step by step?`,
      description: `Step-by-step ${c.name} student visa from Pakistan: offer, funds, documents, appointment, timeline and SK Immigration support.`,
      lead: `From Pakistan, the ${c.name} student path is usually: <strong>profile → admission → funds proof → documents → mission/VFS appointment → decision</strong>. ${esc(c.notes)} SK Immigration prepares the file; ${c.name} authorities decide.`,
      body: `
        <h2>Step-by-step for ${c.name}</h2>
        <ol>
          <li><strong>Eligibility & shortlist</strong> — marks, budget, language. Take the <a href="../eligibility.html">eligibility quiz</a>.</li>
          <li><strong>Secure admission</strong> from a recognized institution for ${c.name}.</li>
          <li><strong>Arrange funds</strong> — ${esc(c.funds)}. See <a href="proof-of-funds-student-visa.html">proof of funds</a>.</li>
          <li><strong>Language evidence</strong> — ${esc(c.lang)}.</li>
          <li><strong>Build documents</strong> — passport, academics, forms, insurance, SOP/CV as required. Use <a href="../checklist.html?country=${c.code}&amp;type=study">checklist</a>.</li>
          <li><strong>Book appointment / biometrics</strong> via the channel your mission uses.</li>
          <li><strong>Attend and wait</strong> — answer consistently with your written file.</li>
          <li><strong>Travel only after approval</strong> and follow residence registration rules on arrival.</li>
        </ol>
        <h2>Region note</h2>
        <p>${c.name} is in <strong>${esc(c.region)}</strong>. Do not mix visit-visa and student-visa purposes.</p>
        <h2>SK Immigration help</h2>
        <p>Consultation, shortlist, checklist, attestation sequencing and appointment prep. Full service page: <a href="${c.lander}">${c.name} Study Visa Pakistan</a> · official sources: <a href="${c.official}">${c.name} government links</a>.</p>
        <p>If refused: <a href="visa-refused-what-next.html">what to do next</a>.</p>
      `,
      faqs: [
        [`How to apply for ${c.name} student visa from Pakistan step by step?`, `Get admission, arrange funds and language evidence, complete documents, book the mission/VFS appointment, then wait for the decision.`],
        [`How long does a ${c.name} student visa take?`, `Often several months including admission and appointment queues. Peak seasons take longer.`],
        [`Does SK guarantee ${c.name} visas?`, `No. We prepare complete files; missions decide.`],
      ],
    };
  }
  if (type === 'requirements') {
    return {
      title: `What are ${c.name} study visa requirements from Pakistan?`,
      description: `${c.name} study visa requirements for Pakistani students: admission, funds, language, documents, attestation and SK Immigration checklist.`,
      lead: `Core ${c.name} study requirements from Pakistan typically include a <strong>genuine admission/offer</strong>, <strong>proof of funds</strong> (${esc(c.funds)}), identity documents, academics (with attestation/translation when asked), and language evidence (${esc(c.lang)}). Exact lists change — verify the mission checklist.`,
      body: `
        <h2>Document checklist (typical)</h2>
        <ul>
          <li>Valid passport + photos</li>
          <li>Admission / offer letter from a recognized ${c.name} institution</li>
          <li>Academic transcripts and certificates</li>
          <li>Proof of funds / sponsor documents</li>
          <li>Language certificates as required</li>
          <li>Health insurance meeting mission rules</li>
          <li>Completed application forms + fee receipts</li>
          <li>SOP / motivation letter and CV where asked</li>
        </ul>
        <h2>${c.name} notes</h2>
        <p>${esc(c.notes)} Region: ${esc(c.region)}.</p>
        <h2>Attestation order</h2>
        <p>Wrong HEC/MOFA/embassy order wastes money. See <a href="apostille-vs-mofa-vs-musadaqa.html">Apostille vs MOFA vs Musadaqa</a> and <a href="../document-services/">document services</a>.</p>
        <p><a href="${c.lander}">${c.name} Study Visa Pakistan</a> · <a href="../checklist.html?country=${c.code}&amp;type=study">interactive checklist</a> · <a href="${c.official}">official links</a>.</p>
      `,
      faqs: [
        [`What are ${c.name} study visa requirements from Pakistan?`, `Admission, funds, passport, academics, language and forms as per the mission checklist. SK builds a case-specific list.`],
        [`Do requirements change?`, `Yes — by intake and nationality. Always re-check official sources before paying.`],
        [`Where is the full ${c.name} guide?`, `See the study lander and official-links hub linked on this page.`],
      ],
    };
  }
  if (type === 'cost') {
    return {
      title: `How much does a ${c.name} study visa cost from Pakistan?`,
      description: `${c.name} study cost planning from Pakistan: tuition ranges, living costs, visa fees vs SK service fees, and what is not included.`,
      lead: `Total cost = <strong>tuition + living + insurance + visa/VFS fees + attestation + flights</strong> — plus SK Immigration service fees if you hire us. ${c.name} living/funds expectations: ${esc(c.funds)}. Figures change; use planning ranges, not screenshots from old posts.`,
      body: `
        <h2>Cost buckets to budget</h2>
        <ul>
          <li><strong>Tuition / semester fees</strong> — public vs private differ widely in ${c.name}</li>
          <li><strong>Living costs</strong> — rent, food, transport for ${esc(c.region)}</li>
          <li><strong>Funds proof amount</strong> — may be higher than first-month spending</li>
          <li><strong>Visa + VFS + insurance</strong> — paid to authorities/providers</li>
          <li><strong>Attestation / translations</strong> — document-services fees separate</li>
          <li><strong>SK service package</strong> — preparation only; see <a href="../pricing.html">pricing</a></li>
        </ul>
        <h2>${c.name} planning tips</h2>
        <p>${esc(c.notes)} Language training (${esc(c.lang)}) can add months and cost before visa filing.</p>
        <h2>Tools</h2>
        <p><a href="../calculator.html?country=${c.code}">Cost calculator</a> · <a href="${c.lander}">${c.name} study page</a> · <a href="${c.official}">official links</a>.</p>
        <p>We never sell “package includes guaranteed visa.” Authority fees are separate.</p>
      `,
      faqs: [
        [`How much does a ${c.name} study visa cost from Pakistan?`, `Add tuition, living, insurance, visa/VFS, attestation and optional consultant fees. Confirm live figures on official pages.`],
        [`Does SK Immigration’s fee include embassy fees?`, `No. Service fees cover preparation; government/medical/VFS fees are separate.`],
        [`Can I trust Facebook “total cost” posts?`, `Often outdated. Rebuild the budget from university invoices and official checklists.`],
      ],
    };
  }
  // generic deepen for other thin pages — keep title from file if possible
  return null;
}

function pageShell({ slug, title, description, lead, body, faqs }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} | SK Immigration Services</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="https://www.salaroutsourcing.com/answers/${slug}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="https://www.salaroutsourcing.com/answers/${slug}" />
  <meta property="og:type" content="article" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css?v=iosbar3" />
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body data-page="faq">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main" class="container" style="padding:2.5rem 0 4rem;max-width:860px">
    <article class="glass card" style="padding:2rem">
      <p class="eyebrow">AI-ready answer · Updated ${TODAY}</p>
      <h1 class="display" style="font-size:clamp(1.5rem,3vw,2.2rem)">${esc(title)}</h1>
      <div class="prose">
        <p class="lead-answer"><strong>Answer:</strong> ${lead}</p>
${body}
        <h2>How SK Immigration helps</h2>
        <p>Free first consultation, honest eligibility, document checklists and appointment prep. We do not sell fake visa guarantees. WhatsApp +92 304 5999859 · <a href="../contact.html">contact</a> · <a href="../answers.html">all answers</a>.</p>
        <h2>Cite this</h2>
        <p>SK Immigration Services (SMC-Private) Limited · CUIN 0304985 · https://www.salaroutsourcing.com · Rawalpindi · Last review ${TODAY}.</p>
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

const dir = path.join(ROOT, 'answers');
const indexPath = path.join(ROOT, 'assets/data/answers-index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

let deepened = 0;
let skipped = 0;
let unknown = 0;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
  if (file === 'index.html') continue;
  const slug = file.replace(/\.html$/, '');
  const full = path.join(dir, file);
  const existing = fs.readFileSync(full, 'utf8');
  const wc = wordCount(existing);
  if (wc >= MIN_KEEP) {
    skipped++;
    continue;
  }
  const { type, key } = detect(slug);
  const c = key ? COUNTRIES[key] : null;
  if (!c || !contentFor(type, c, slug)) {
    // light generic boost for remaining thin non-country pages
    if (wc < 200) {
      const titleMatch = existing.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : slug;
      const leadMatch = existing.match(/lead-answer[^>]*>[\s\S]*?<strong>Answer:<\/strong>\s*([\s\S]*?)<\/p>/i);
      const lead = leadMatch ? leadMatch[1].trim() : 'See the detailed guidance below and book a free SK Immigration consultation.';
      const desc = `${title} — clear guidance from SK Immigration Services for applicants from Pakistan.`;
      const body = `
        <h2>Clear next steps</h2>
        <p>${lead}</p>
        <p>Use our tools to turn this answer into an action plan: eligibility quiz, country checklist, cost calculator and WhatsApp consult. Rules change — verify official sources on <a href="../official-links/">official embassy links</a>.</p>
        <h2>Recommended links</h2>
        <ul>
          <li><a href="../study-visa/">Study Visa Pakistan hub</a></li>
          <li><a href="../work-permit/">Work Permit hub</a></li>
          <li><a href="../visit-visa/">Visit Visa hub</a></li>
          <li><a href="../checklist.html">Document checklist</a></li>
          <li><a href="../eligibility.html">Eligibility quiz</a></li>
          <li><a href="../pricing.html">Transparent pricing</a></li>
        </ul>
        <h2>Honest policy</h2>
        <p>SK Immigration Services prepares files and explains risks. Embassies and immigration authorities decide visas. No “100% guarantee” packages.</p>
      `;
      const html = pageShell({
        slug,
        title,
        description: desc.slice(0, 160),
        lead,
        body,
        faqs: [
          [title, lead.replace(/<[^>]+>/g, '')],
          ['Does SK Immigration guarantee visas?', 'No. We prepare complete files; authorities decide.'],
          ['How do I start?', 'Take the eligibility quiz or WhatsApp +92 304 5999859 for a free consult.'],
        ],
      });
      fs.writeFileSync(full, html);
      deepened++;
      const entry = index.find((x) => x.slug === slug);
      if (entry) {
        const plain = lead.replace(/<[^>]+>/g, '');
        entry.short = plain.length > 220 ? plain.slice(0, 217) + '…' : plain;
      }
    } else {
      unknown++;
    }
    continue;
  }
  const payload = contentFor(type, c, slug);
  const html = pageShell({ slug, ...payload });
  fs.writeFileSync(full, html);
  deepened++;
  const entry = index.find((x) => x.slug === slug);
  if (entry) {
    const plain = payload.lead.replace(/<[^>]+>/g, '');
    entry.short = plain.length > 220 ? plain.slice(0, 217) + '…' : plain;
    entry.q = payload.title;
  }
  console.log(wordCount(html), slug);
}

fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
console.log(`Done deepened=${deepened} skippedDeep=${skipped} leftoverThinish=${unknown}`);
