#!/usr/bin/env node
/**
 * Phase 3 — deepen top 20 money pages into citation-grade guides.
 * Landers: replace <!-- lander-depth -->…<!-- /lander-depth -->
 * Answers: rewrite full HTML with unique depth (no shared boilerplate lists).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TODAY = '2026-07-30';
const CSS = 'brandpolish1';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function answerPage({ slug, title, description, lead, bodyHtml, faqs, related }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const relatedHtml = related.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('');
  const faqHtml = faqs
    .map(
      ([q, a]) =>
        `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`
    )
    .join('');
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} | SK Immigration Services</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="https://immigration.salaroutsourcing.com/answers/${slug}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="https://immigration.salaroutsourcing.com/answers/${slug}" />
  <meta property="og:type" content="article" />
  <meta name="author" content="SK Immigration Services" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css?v=${CSS}" />
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body data-page="faq">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main" class="container" style="padding:2.5rem 0 4rem;max-width:860px">
    <article class="glass card" style="padding:2rem">
      <p class="eyebrow">Citation guide · Updated ${TODAY} · SK Immigration Services</p>
      <h1 class="display" style="font-size:clamp(1.5rem,3vw,2.2rem)">${esc(title)}</h1>
      <p class="text-muted" style="font-size:0.9rem;margin:0.35rem 0 1rem">Prepared by SK Immigration Services (SMC-Private) Limited · CUIN 0304985 · Rawalpindi · Last review ${TODAY}</p>
      <div class="prose">
        <p class="lead-answer"><strong>Answer:</strong> ${lead}</p>
${bodyHtml}
        <h2>FAQ</h2>
        <div class="faq-mini">${faqHtml}</div>
        <h2>Related guides</h2>
        <ul>${relatedHtml}</ul>
        <h2>Cite this page</h2>
        <p>SK Immigration Services (SMC-Private) Limited · CUIN 0304985 · https://immigration.salaroutsourcing.com · Services@salaroutsourcing.com · Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi · Mon–Sat 10:00–19:00. Last editorial review: ${TODAY}. Embassies decide visas — we prepare files only.</p>
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
  <script src="../assets/js/layout.js?v=${CSS}"></script>
</body>
</html>
`;
}

function wrapDepth(html) {
  return `
<!-- lander-depth -->
${html}
<!-- /lander-depth -->
`;
}

function patchLander(relPath, depthHtml) {
  const file = path.join(ROOT, relPath);
  let html = fs.readFileSync(file, 'utf8');
  const block = wrapDepth(depthHtml);
  if (html.includes('<!-- lander-depth -->')) {
    html = html.replace(/<!-- lander-depth -->[\s\S]*?<!-- \/lander-depth -->/, block.trim());
  } else if (html.includes('Official government')) {
    html = html.replace(
      /(\s*)(<h2>Official government)/,
      `\n${block}$1$2`
    );
  } else {
    html = html.replace(
      /(\s*)(<h2>Frequently asked questions)/,
      `\n${block}$1$2`
    );
  }
  html = html.replace(/Updated 2026-\d{2}-\d{2}/g, `Updated ${TODAY}`);
  html = html.replace(/\?v=brandpolish1|\?v=navlabels1|\?v=iosbar3/g, `?v=${CSS}`);
  fs.writeFileSync(file, html);
  return file;
}

/* ─── LANDER DEPTH BLOCKS (unique per page) ─── */

const LANDERS = {
  'study-visa/germany-study-visa-pakistan/index.html': `
        <h2>Germany study vs Ausbildung — decision table for Pakistan</h2>
        <table>
          <thead><tr><th>Path</th><th>You usually need</th><th>Funding proof</th><th>Language</th><th>Best if…</th></tr></thead>
          <tbody>
            <tr><td>Bachelor / Master</td><td>University admission</td><td>Blocked account (Sperrkonto) or accepted alternative</td><td>English and/or German per program</td><td>Marks + language fit a degree plan</td></tr>
            <tr><td>Studienkolleg / prep</td><td>Conditional pathway into German higher ed</td><td>Often still living-cost proof</td><td>Usually German</td><td>School credentials need bridging</td></tr>
            <tr><td>Ausbildung</td><td>Training contract with a German employer/school</td><td>Salary in contract (not classic Sperrkonto)</td><td>Typically A2–B1+ (higher for nursing)</td><td>You want earn-while-you-train</td></tr>
          </tbody>
        </table>
        <p>Pick the path that matches your documents — not the path a viral reel promised. SK Immigration reviews marks, age, language and budget in a free consult before you pay deposits.</p>

        <h2>Realistic timeline from Rawalpindi / WhatsApp clients</h2>
        <ol>
          <li><strong>Week 1–2:</strong> Profile review — degree vs Ausbildung; APS / attestation needs; language gap</li>
          <li><strong>Month 1–3:</strong> Shortlist + applications / employer outreach; CV and motivation letters that match the program</li>
          <li><strong>Month 2–4:</strong> Admission or contract; open blocked account only after the pathway is clear</li>
          <li><strong>Month 3–6+:</strong> National visa appointment (VFS / mission queues vary); biometrics and decision wait</li>
        </ol>
        <p>Peak winter intakes and incomplete funding proofs add months. Booking a slot with half-ready papers is one of the costliest mistakes we see.</p>

        <h2>Pakistan-specific document traps (Germany)</h2>
        <ul>
          <li><strong>Wrong Sperrkonto amount or provider</strong> for the visa category you actually filed</li>
          <li><strong>APS / attestation order</strong> ignored until the appointment week</li>
          <li><strong>English-taught offer + weak English</strong> — admission and visa credibility are related</li>
          <li><strong>Ausbildung “guarantees”</strong> without a real training contract</li>
          <li><strong>Motivation letter templates</strong> that do not mention the city, module or career logic</li>
          <li><strong>Bank spikes</strong> one week before statements — missions read history, not just the last balance</li>
        </ul>

        <h2>Budget lines to plan (separate from SK fee)</h2>
        <ul>
          <li>German national visa / VFS fees (pay authorities)</li>
          <li>Blocked-account living funds (amount changes — verify embassy)</li>
          <li>Health insurance meeting entry rules</li>
          <li>Translations, HEC/MOFA/APS where your case needs them</li>
          <li>SK Immigration student preparation from <strong>PKR 50,000</strong> — packaging only, no outcome guarantee</li>
        </ul>

        <h2>What to do this week</h2>
        <ol>
          <li>Open <a href="../../answers/blocked-account-germany.html">blocked account guide</a> and <a href="../../ausbildung.html">Ausbildung portal</a> if relevant</li>
          <li>Tick the <a href="../../checklist.html?country=de&amp;type=study">Germany study checklist</a></li>
          <li>Verify portals on <a href="../../official-links/#de">official Germany links</a> (DAAD, German Embassy, VFS)</li>
          <li>WhatsApp +92 304 5999859 or <a href="../../eligibility.html">eligibility quiz</a></li>
        </ol>
`,

  'study-visa/hungary-study-visa-pakistan/index.html': `
        <h2>Why Pakistani students shortlist Hungary</h2>
        <p>Hungary is often compared with Poland and Czech Republic for English-taught programs, medical/related pathways, and a Schengen student residence process that is more approachable than UK/USA budgets — <em>when</em> the university is recognized and the funds story is clean.</p>
        <table>
          <thead><tr><th>Topic</th><th>What to check before you pay</th></tr></thead>
          <tbody>
            <tr><td>University recognition</td><td>Program is real, fee letter matches website, and the school appears in official/trusted lists — not a broker PDF only</td></tr>
            <tr><td>IELTS / MOI</td><td>English programs may accept IELTS, university test, or MOI — confirm on the offer, not Facebook</td></tr>
            <tr><td>Funds</td><td>Tuition + living for the period the mission asks; sponsor trail must be explainable</td></tr>
            <tr><td>Attestation</td><td>HEC / MOFA / embassy order for your document type — wrong order wastes money</td></tr>
            <tr><td>Appointment</td><td>Complete file first; Hungary/VFS queues move — do not book empty-handed</td></tr>
          </tbody>
        </table>

        <h2>Hungary vs Poland vs Czech (quick compare)</h2>
        <ul>
          <li><strong>Hungary:</strong> Strong interest in medicine/related and English degrees; watch recognition and fee deposits</li>
          <li><strong>Poland:</strong> Broad English program market; funds + purpose consistency still decide visas</li>
          <li><strong>Czech Republic:</strong> Often language + recognition planning; not “easier” if documents are weak</li>
        </ul>
        <p>Read <a href="../../answers/poland-vs-hungary-vs-czech-study.html">Poland vs Hungary vs Czech</a> and <a href="../../answers/hungary-study-visa-requirements-pakistan.html">Hungary requirements answer</a>.</p>

        <h2>Mistakes we see on Hungary files from Pakistan</h2>
        <ul>
          <li>Paying large deposits to unknown agents before verifying the university</li>
          <li>Assuming “no IELTS” without a written university acceptance of MOI</li>
          <li>Borrowing bank balance for one month of statements</li>
          <li>Copy-paste SOPs that never mention Hungary or the faculty</li>
          <li>Confusing a short Schengen visit with a long-stay student residence</li>
        </ul>

        <h2>SK Immigration sequencing for Hungary</h2>
        <ol>
          <li>Free consult — marks, budget, language, medical vs general degree</li>
          <li>Shortlist only programs we can document honestly</li>
          <li>Attestation + funds plan before mission fees</li>
          <li>Appointment prep and Q&amp;A consistency check</li>
        </ol>
        <p>Student packages from <strong>PKR 50,000</strong> for preparation. Use <a href="../../checklist.html?country=hu&amp;type=study">Hungary checklist</a> · <a href="../../official-links/#hu">official Hungary links</a>.</p>
`,

  'study-visa/uk-study-visa-pakistan/index.html': `
        <h2>UK Student visa — what actually decides the file</h2>
        <p>From Pakistan, a UK Student visa is driven by a valid <strong>CAS</strong> from a licensed sponsor, maintenance funds that meet GOV.UK rules for your case, tuberculosis testing where required, and a credible study intention. Marketing “cheap UK study” without a real CAS is a refusal factory.</p>
        <table>
          <thead><tr><th>Stage</th><th>You prove</th><th>Common Pakistan pitfall</th></tr></thead>
          <tbody>
            <tr><td>Offer → CAS</td><td>Unconditional/required conditions met</td><td>Paying agents before conditions clear</td></tr>
            <tr><td>Funds</td><td>Maintenance + any unpaid tuition rules</td><td>28-day history gaps / unexplained deposits</td></tr>
            <tr><td>TB</td><td>Approved clinic certificate when required</td><td>Wrong clinic or expired certificate</td></tr>
            <tr><td>Online + biometrics</td><td>Consistent answers vs documents</td><td>Form answers that contradict bank/job letters</td></tr>
          </tbody>
        </table>

        <h2>CAS, funds and credibility — plain language</h2>
        <ul>
          <li><strong>CAS</strong> is not a tourist invitation — it is a sponsor confirmation for study</li>
          <li><strong>Maintenance</strong> must meet the published GOV.UK method for your situation (London vs outside, dependants, etc.)</li>
          <li><strong>Credibility</strong> means you can explain why this course, this university, and how it fits your past marks</li>
        </ul>
        <p>Deep dives: <a href="../../answers/uk-student-visa-cas.html">CAS explained</a> · <a href="../../answers/proof-of-funds-student-visa.html">proof of funds</a>.</p>

        <h2>Timeline many Pakistani applicants should expect</h2>
        <ol>
          <li>Shortlist + applications (weeks to months)</li>
          <li>Offer conditions → CAS release</li>
          <li>Funds hold period + TB</li>
          <li>UKVI application + VAC biometrics</li>
          <li>Decision — priority products cost more and still are not guarantees</li>
        </ol>

        <h2>SK fee vs UKVI fees</h2>
        <p>SK Immigration student preparation from <strong>PKR 50,000</strong>. University deposits, IHS, visa fees and TB are paid to universities/authorities. We do not sell outcome guarantees.</p>
        <p><a href="../../checklist.html?country=gb&amp;type=study">UK study checklist</a> · <a href="../../official-links/#gb">official UK links</a> · WhatsApp +92 304 5999859</p>
`,

  'study-visa/canada-study-visa-pakistan/index.html': `
        <h2>Canada study permit — Pakistan checklist that matters</h2>
        <p>IRCC looks for a genuine student: acceptance from a designated learning institution (DLI), enough money for first-year tuition + living, ties/purpose that make sense, and a complete online file. A letter of acceptance alone is not a visa.</p>
        <table>
          <thead><tr><th>Piece</th><th>Why IRCC cares</th><th>Pakistan tip</th></tr></thead>
          <tbody>
            <tr><td>DLI acceptance</td><td>Confirms a real program seat</td><td>Verify DLI number on the offer</td></tr>
            <tr><td>Funds / GIC where used</td><td>Shows you can study without unauthorized work dependence</td><td>Keep a clean paper trail from sponsor to account</td></tr>
            <tr><td>SOP / study plan</td><td>Tests whether the path is logical</td><td>Explain gaps, marks and why Canada — not copy templates</td></tr>
            <tr><td>Biometrics / medical</td><td>Identity and health rules</td><td>Follow the instruction letter; do not invent shortcuts</td></tr>
          </tbody>
        </table>

        <h2>Study permit vs “visit then study”</h2>
        <p>Entering Canada as a visitor to “figure out college later” is not a strategy we recommend. If your intent is study, build a study permit file. Mixing stories is a classic refusal reason.</p>

        <h2>Common refusal patterns we coach against</h2>
        <ul>
          <li>Funds that appear overnight without a sponsor story</li>
          <li>Programs that do not match prior education or age profile without explanation</li>
          <li>Weak home ties narrative when the rest of the file is thin</li>
          <li>Agents promising “guaranteed Canada” after a deposit</li>
        </ul>

        <h2>Next steps with SK Immigration</h2>
        <ol>
          <li>Free profile review — budget realism for Canada vs Europe alternatives</li>
          <li>Document map + <a href="../../checklist.html?country=ca&amp;type=study">Canada checklist</a></li>
          <li>SOP coaching that matches your actual marks and work history</li>
          <li>Application packaging — IRCC decides</li>
        </ol>
        <p>Student packages from <strong>PKR 50,000</strong>. Official links: <a href="../../official-links/#ca">Canada / IRCC</a>. Related: <a href="../../answers/canada-study-permit-requirements.html">Canada study permit requirements</a>.</p>
`,

  'study-visa/italy-study-visa-pakistan/index.html': `
        <h2>Italy student visa — Universitaly and pre-enrolment reality</h2>
        <p>Many Pakistani applicants underestimate <strong>Universitaly / pre-enrolment</strong> timing. An admission letter without the portal steps the Italian system expects can stall the embassy file. Plan language, pre-enrolment and attestation in parallel — not the week of the appointment.</p>
        <table>
          <thead><tr><th>Track</th><th>Watch-outs</th></tr></thead>
          <tbody>
            <tr><td>English-taught degree</td><td>IELTS/TOEFL or university English proof as written on the offer</td></tr>
            <tr><td>Italian-taught</td><td>Italian language certificates; do not assume English MOI is enough</td></tr>
            <tr><td>Funds</td><td>Living + tuition evidence per Italian mission checklist for your year</td></tr>
            <tr><td>Documents</td><td>Translations and legalization order — names must match passport</td></tr>
          </tbody>
        </table>

        <h2>Process map from Pakistan</h2>
        <ol>
          <li>Choose a recognized program; confirm language line on the offer</li>
          <li>Complete Universitaly / pre-enrolment steps that apply to you</li>
          <li>Assemble academics, funds, insurance and forms</li>
          <li>Book VFS/mission only when the file is appointment-ready</li>
          <li>Attend biometrics; track decision</li>
        </ol>

        <h2>Italy-specific mistakes</h2>
        <ul>
          <li>Ignoring pre-enrolment deadlines for the intake</li>
          <li>Paying “priority Italy slots” brokers with no document audit</li>
          <li>Using a visit-visa story for a multi-year degree intent</li>
          <li>Incomplete translation/legalization chains</li>
        </ul>
        <p><a href="../../checklist.html?country=it&amp;type=study">Italy checklist</a> · <a href="../../official-links/#it">official Italy links</a> · <a href="../../answers/ielts-for-italy-study.html">IELTS for Italy</a> · SK student prep from PKR 50,000</p>
`,

  'study-visa/poland-study-visa-pakistan/index.html': `
        <h2>Poland study visa — English programs without fairy tales</h2>
        <p>Poland attracts Pakistani students with English-taught degrees and relatively lower living costs than Western Europe. Visas still fail when the university is dubious, funds are borrowed for show, or the SOP is a generic Europe template.</p>
        <table>
          <thead><tr><th>Check</th><th>Pass signal</th><th>Fail signal</th></tr></thead>
          <tbody>
            <tr><td>University</td><td>Clear fee letter + recognizable institution</td><td>Only a WhatsApp “admission” screenshot</td></tr>
            <tr><td>Language</td><td>IELTS / university test / accepted MOI in writing</td><td>“Agent said no IELTS” with no offer clause</td></tr>
            <tr><td>Funds</td><td>Stable history covering tuition + living</td><td>Last-minute cash deposits</td></tr>
            <tr><td>Purpose</td><td>Why Poland + this faculty</td><td>“Any Schengen stamp”</td></tr>
          </tbody>
        </table>

        <h2>Poland vs Hungary for the same profile</h2>
        <p>Both can work for mid-budget English study. Choose based on program quality, recognition for your career, and the strength of the offer — not which country a Facebook group voted “easy.” See <a href="../../answers/hungary-vs-poland-student-visa.html">Hungary vs Poland</a>.</p>

        <h2>Document and attestation order</h2>
        <p>Wrong HEC/MOFA/embassy sequencing wastes months. Read <a href="../../answers/apostille-vs-mofa-vs-musadaqa.html">Apostille vs MOFA vs Musadaqa</a> before you stamp anything.</p>

        <h2>SK Immigration next steps</h2>
        <ol>
          <li>Free consult — marks, gap years, budget</li>
          <li><a href="../../checklist.html?country=pl&amp;type=study">Poland checklist</a></li>
          <li>Honest shortlist (or “not yet” advice)</li>
          <li>File packaging — mission decides</li>
        </ol>
        <p><a href="../../official-links/#pl">Official Poland links</a> · student packages from PKR 50,000</p>
`,

  'visit-visa/uk-visit-visa-pakistan/index.html': `
        <h2>UK Standard Visitor — credibility framework UKVI actually uses</h2>
        <p>UKVI does not publish a magic bank-balance number for every Pakistani tourist. Officers weigh <strong>purpose + funds + ties to Pakistan + immigration history</strong>. A large balance with no job, no family anchors and a vague itinerary still fails.</p>
        <table>
          <thead><tr><th>Pillar</th><th>Evidence examples</th><th>Weak version</th></tr></thead>
          <tbody>
            <tr><td>Purpose</td><td>Family invite, business meetings, tourist day plan</td><td>“Tourism” with blank calendar</td></tr>
            <tr><td>Funds</td><td>6-month statements matching trip cost + ongoing life in PK</td><td>Borrowed lump sum week before apply</td></tr>
            <tr><td>Ties</td><td>Job letter + leave, business NTN, dependents, property</td><td>Unemployed with no return story</td></tr>
            <tr><td>History</td><td>Prior visas used correctly</td><td>Unexplained refusals / overstays</td></tr>
          </tbody>
        </table>

        <h2>Invitation letters — help, not a stamp</h2>
        <p>An invitation from a UK resident helps family/business visits when the sponsor’s status and address are documented. It does <strong>not</strong> replace your own funds/ties analysis. Tourists can self-fund with hotels — honesty beats fake sponsors.</p>

        <h2>Visitor vs Student — do not mix</h2>
        <p>Short recreational courses may fit visitor rules; full degrees need a Student visa + CAS. Using a visit application to “enter and switch” is a refusal and ban risk. See <a href="../../answers/visit-visa-vs-student-visa.html">visit vs student</a>.</p>

        <h2>Fees and timing</h2>
        <ul>
          <li>SK Immigration visit packaging from <strong>PKR 30,000</strong></li>
          <li>UKVI + VAC fees separate</li>
          <li>Often 3–8 weeks; priority is paid speed, not approval</li>
        </ul>
        <p><a href="../../answers/uk-visit-visa-requirements-pakistan.html">UK visit requirements answer</a> · <a href="../../official-links/#gb">GOV.UK / VFS links</a> · <a href="../../checklist.html?country=gb&amp;type=visit">visit checklist</a></p>
`,

  'visit-visa/usa-visit-visa-pakistan/index.html': `
        <h2>USA B1/B2 from Pakistan — interview logic</h2>
        <p>US visitor visas are decided largely at the <strong>interview</strong>. Consular officers test whether you are a genuine temporary visitor with a residence abroad you will not abandon. Documents support the story; they do not replace it.</p>
        <table>
          <thead><tr><th>Officer focus</th><th>Strong answers show</th><th>Red flags</th></tr></thead>
          <tbody>
            <tr><td>Why USA / how long</td><td>Specific trip purpose and return date logic</td><td>“See / settle / find work”</td></tr>
            <tr><td>Who pays</td><td>Clear self or sponsor funding</td><td>Confused money story</td></tr>
            <tr><td>Job / family in PK</td><td>Stable employment or business + dependents</td><td>No anchors in Pakistan</td></tr>
            <tr><td>Prior visas / US intent</td><td>Consistent history</td><td>Prior refusals unexplained</td></tr>
          </tbody>
        </table>

        <h2>DS-160 consistency checklist</h2>
        <ul>
          <li>Names, employers and travel history match passport and CV</li>
          <li>Social media / contact fields filled carefully (as required)</li>
          <li>Do not memorize scripts — understand your own file</li>
          <li>Never coach false answers; refusals under immigration law are serious</li>
        </ul>

        <h2>B1 vs B2 vs study/work</h2>
        <p>B1 is business visitor activity; B2 is tourism/family. Neither is a work permit or student visa. If your real goal is study or employment, use the correct category — see <a href="../../study-visa/usa-study-visa-pakistan/">USA study</a> or work guidance.</p>

        <h2>SK Immigration support</h2>
        <p>Visit packaging from <strong>PKR 30,000</strong>: document review, DS-160 coaching, interview prep. Consulate decides. <a href="../../answers/usa-b1-b2-visa-pakistan.html">B1/B2 answer</a> · <a href="../../official-links/#us">official US links</a>.</p>
`,

  'visit-visa/schengen-visit-visa-pakistan/index.html': `
        <h2>Schengen visit from Pakistan — main destination rule</h2>
        <p>Apply to the country that is your <strong>main destination</strong> (longest stay or main purpose). Shopping for the “easiest embassy” while planning most nights elsewhere is a classic refusal reason.</p>
        <table>
          <thead><tr><th>File part</th><th>Must show</th></tr></thead>
          <tbody>
            <tr><td>Itinerary</td><td>Days, cities, transport that match hotel/invite</td></tr>
            <tr><td>Insurance</td><td>Schengen-compliant medical cover for full trip</td></tr>
            <tr><td>Funds</td><td>Trip cost + life continuing in Pakistan</td></tr>
            <tr><td>Ties</td><td>Job leave, business, family — return intent</td></tr>
            <tr><td>Biometrics</td><td>VFS/TLS appointment with complete set</td></tr>
          </tbody>
        </table>

        <h2>Tourism vs family vs business visit</h2>
        <ul>
          <li><strong>Tourism:</strong> hotels + day plan; no fake “uncle” sponsors</li>
          <li><strong>Family:</strong> invitation + host status docs + your ties still matter</li>
          <li><strong>Business:</strong> company letters both sides; meetings that look real</li>
        </ul>

        <h2>Schengen visit is not a work or study visa</h2>
        <p>Short stays cannot be used to start a job or a degree. For study see <a href="../../study-visa/">study visa hub</a>; for work see <a href="../../work-permit/">work permit hub</a>.</p>

        <h2>SK Immigration</h2>
        <p>Visit files from <strong>PKR 30,000</strong>. We refuse to sell fake “priority slots.” <a href="../../answers/schengen-visit-visa-from-pakistan-how.html">How to apply</a> · <a href="../../answers/schengen-visit-visa-requirements.html">requirements</a> · <a href="../../visa-appointment/schengen-visa-appointment-pakistan/">appointments</a>.</p>
`,

  'visit-visa/dubai-visit-visa-pakistan/index.html': `
        <h2>Dubai / UAE visit from Pakistan — tourism vs status confusion</h2>
        <p>UAE visit products change by airline, hotel packages and sponsor types. Your job is to match the <strong>correct visit product</strong> to a real trip — not to treat a visit entry as a hidden work visa.</p>
        <table>
          <thead><tr><th>Scenario</th><th>Usually need</th><th>Do not</th></tr></thead>
          <tbody>
            <tr><td>Short tourism</td><td>Valid passport, funds/hotel or package rules for that product</td><td>Expect to work on visit status</td></tr>
            <tr><td>Family visit</td><td>Host/sponsor documents as required</td><td>Fake relationship letters</td></tr>
            <tr><td>Business meetings</td><td>Invite + company paperwork</td><td>Use visit to start employment</td></tr>
          </tbody>
        </table>

        <h2>Overstay and status risks</h2>
        <p>Overstaying UAE visit status creates fines and future refusal risk across destinations that share data. Exit on time. If you want employment, use proper work authorization — see <a href="../../work-permit/uae-work-visa-pakistan/">UAE work visa</a>.</p>

        <h2>Attestation note</h2>
        <p>Some employment or long-stay paths later need Musadaqa/MOFA chains. Visit tourism usually does not — do not overpay for stamps you do not need yet. <a href="../../answers/document-attestation-dubai-uae.html">Dubai attestation answer</a>.</p>

        <h2>SK Immigration</h2>
        <p>Visit packaging from <strong>PKR 30,000</strong> where consultancy applies; we map the product honestly. <a href="../../answers/dubai-visit-visa-from-pakistan.html">Dubai visit answer</a> · WhatsApp +92 304 5999859</p>
`,

  'saudi-visa/saudi-visa-processing-pakistan/index.html': `
        <h2>Complete Saudi work visa processing — what PKR 15,000 covers</h2>
        <p><strong>Not E-Number only.</strong> SK Immigration’s complete processing package for eligible cases is priced at <strong>PKR 15,000</strong> and covers coordination for <strong>E-Number / biometrics + Protector + visa processing support</strong>. Medical, insurance, government/authority fees and third-party charges are <em>separate</em> — we itemize before you pay.</p>
        <table>
          <thead><tr><th>Step</th><th>What happens</th><th>Your responsibility</th></tr></thead>
          <tbody>
            <tr><td>Document triage</td><td>We map passport, photos, contracts, prior stamps</td><td>Bring clear scans + originals when asked</td></tr>
            <tr><td>E-Number / biometrics</td><td>Scheduling and file readiness support</td><td>Attend on time with correct set</td></tr>
            <tr><td>Protector</td><td>Guidance through protector requirements for overseas employment cases</td><td>Licensed OEP partner rules where applicable</td></tr>
            <tr><td>Visa processing</td><td>Support through the remaining visa steps in scope</td><td>Authority fees paid to the correct channels</td></tr>
          </tbody>
        </table>

        <h2>OEP / licence reality</h2>
        <p>Overseas employment from Pakistan can require licensed OEP pathways. Where applicable we work with partners (e.g. licence references such as NO/1061). Ask us which steps apply to <em>your</em> contract — do not skip protector rules because a broker said so.</p>

        <h2>Who should not buy “complete processing”</h2>
        <ul>
          <li>Anyone promised a Saudi visa with no employer/contract trail</li>
          <li>Visit-visa seekers (different product)</li>
          <li>Clients wanting a fake medical or fake experience letter — we refuse</li>
        </ul>

        <h2>Related pages</h2>
        <p><a href="../../answers/saudi-work-visa-processing-15000.html">PKR 15,000 package answer</a> · <a href="../../work-permit/saudi-work-visa-pakistan/">Saudi work hub</a> · <a href="../../answers/oep-partner-licence-1061.html">OEP licence</a> · <a href="../../document-services/">attestation</a></p>
`,

  'work-permit/germany-work-permit-pakistan/index.html': `
        <h2>Germany work routes from Pakistan — pick the right door</h2>
        <p>“Germany work visa” is not one form. Pakistani applicants usually fall into skilled employment with a recognized qualification, EU Blue Card-type profiles, shortage/occupation-specific routes, or the <strong>Ausbildung</strong> training path (not the same as a full skilled work permit).</p>
        <table>
          <thead><tr><th>Route type</th><th>Core proof</th><th>Language</th></tr></thead>
          <tbody>
            <tr><td>Skilled job + recognition</td><td>Job contract + qualification recognition where required</td><td>Often German for workplace</td></tr>
            <tr><td>Blue Card-style highly skilled</td><td>Salary/qualification thresholds (verify current law)</td><td>Job-dependent</td></tr>
            <tr><td>Ausbildung</td><td>Training contract</td><td>Usually A2–B1+</td></tr>
            <tr><td>Job seeker style products</td><td>Strict eligibility — not a tourist entry</td><td>Plan before you fly</td></tr>
          </tbody>
        </table>

        <h2>Recognition and Make-it-in-Germany</h2>
        <p>Many occupations need credential recognition before the mission will treat the file as skilled employment. Start with official guidance on <a href="../../official-links/#de">Make it in Germany / German missions</a> — not a Facebook “guarantee employer.”</p>

        <h2>Work vs study vs visit</h2>
        <ul>
          <li>Study/Ausbildung → <a href="../../study-visa/germany-study-visa-pakistan/">Germany study page</a></li>
          <li>Short tourism → visit visa (cannot work)</li>
          <li>Real job contract → this work-permit track</li>
        </ul>

        <h2>SK Immigration</h2>
        <p>Work-permit preparation from <strong>PKR 80,000</strong> (case-by-case). We review contracts and document gaps honestly. <a href="../../answers/germany-work-permit-from-pakistan.html">Germany work answer</a> · <a href="../../jobs.html">jobs board</a> · <a href="../../ausbildung.html">Ausbildung</a></p>
`,
};

/* ─── ANSWER PAGES ─── */

const ANSWERS = [
  {
    slug: 'study-europe-without-ielts',
    title: 'Can I study in Europe without IELTS from Pakistan?',
    description:
      'Study in Europe without IELTS from Pakistan: when MOI or local language works, country patterns (Hungary, Poland, Germany, Italy, France), risks, and how SK Immigration verifies offers before you pay.',
    lead: 'Yes — <strong>sometimes</strong>. Many European universities accept alternatives to IELTS (MOI letters, university English tests, or local-language certificates) when the program and mission allow it. There is no single “Europe without IELTS visa.” Always confirm the <em>written offer</em> and current embassy practice for your nationality.',
    bodyHtml: `
        <h2>What “without IELTS” actually means</h2>
        <p>It means the <strong>university</strong> waived IELTS for admission — not that every Schengen mission ignores language. Visa officers still ask whether you can succeed in the language of instruction. Weak English with an English-taught offer is a credibility risk.</p>

        <h2>Country patterns Pakistani students explore (2026)</h2>
        <table>
          <thead><tr><th>Country</th><th>Often seen alternatives</th><th>Still verify</th></tr></thead>
          <tbody>
            <tr><td>Hungary / Poland / Czech / Romania</td><td>MOI, internal tests, IELTS optional on some programs</td><td>Offer letter clause + recognition</td></tr>
            <tr><td>Germany</td><td>English programs may want IELTS/TOEFL; German programs need German; Ausbildung needs German</td><td>Pathway type (degree vs Ausbildung)</td></tr>
            <tr><td>Italy / France / Spain</td><td>Program language rules; Campus France / Universitaly steps</td><td>Portal + language certificates</td></tr>
            <tr><td>Malaysia / Turkey</td><td>Wider MOI/internal test culture on some campuses</td><td>Not Schengen — different visa systems</td></tr>
          </tbody>
        </table>

        <h2>MOI letter — when it helps and when it fails</h2>
        <ul>
          <li><strong>Helps</strong> when the university explicitly accepts MOI for your intake and the mission does not demand a standardized test for your case</li>
          <li><strong>Fails</strong> when MOI is homemade, from an unrecognized school, or contradicts an English-taught offer that still lists IELTS as mandatory</li>
        </ul>
        <p>Read <a href="moi-letter-instead-of-ielts.html">MOI instead of IELTS</a>.</p>

        <h2>Safer decision process</h2>
        <ol>
          <li>Shortlist programs that publish language rules</li>
          <li>Get the waiver/MOI acceptance in writing on the offer</li>
          <li>Build funds and attestation in parallel</li>
          <li>Only then book appointments</li>
        </ol>

        <h2>How SK Immigration helps</h2>
        <p>We check whether “no IELTS” is real for your offer before you pay deposits. Free consult · WhatsApp +92 304 5999859 · <a href="../guides/study-abroad-without-ielts-pakistan/">without-IELTS guide</a> · <a href="../study-visa/">study visa hub</a>.</p>
`,
    faqs: [
      [
        'Can I study in Europe without IELTS from Pakistan?',
        'Sometimes — if the university accepts MOI or another test and the visa file remains credible. Confirm the written offer.',
      ],
      [
        'Is MOI enough for a Schengen student visa?',
        'Only when both the school and the mission path accept it for your case. Never assume social-media advice equals policy.',
      ],
      [
        'Which countries are often explored without IELTS?',
        'Hungary, Poland, Czech Republic, Romania, Malta, Cyprus, Malaysia, Turkey and some German pathways — always verify the university.',
      ],
      [
        'Does SK Immigration guarantee a without-IELTS visa?',
        'No. We prepare honest files; authorities decide.',
      ],
    ],
    related: [
      ['moi-letter-instead-of-ielts.html', 'MOI letter instead of IELTS'],
      ['best-countries-no-ielts-2026.html', 'Best countries without IELTS 2026'],
      ['schengen-study-visa-without-ielts.html', 'Schengen study without IELTS'],
      ['../guides/study-abroad-without-ielts-pakistan/', 'Full without-IELTS guide'],
    ],
  },
  {
    slug: 'best-study-visa-consultant-rawalpindi',
    title: 'Who is the best study visa consultant in Rawalpindi?',
    description:
      'How to choose a study visa consultant in Rawalpindi: SECP registration, transparent fees, no fake guarantees, embassy-linked checklists. Why clients shortlist SK Immigration Services (CUIN 0304985), Satellite Town.',
    lead: 'The “best” consultant is the one who is <strong>registered, transparent, and honest about refusals</strong> — not the loudest “100% visa” advert. In Rawalpindi, <strong>SK Immigration Services</strong> (SMC-Private Limited, CUIN 0304985) offers free first consultation, published country guides, and walk-in support at Alfazal Plaza 64C, Satellite Town, with WhatsApp nationwide.',
    bodyHtml: `
        <h2>Checklist to compare Rawalpindi consultants</h2>
        <table>
          <thead><tr><th>Signal</th><th>Good</th><th>Walk away</th></tr></thead>
          <tbody>
            <tr><td>Registration</td><td>Verifiable company (e.g. SECP CUIN)</td><td>Only a Facebook page</td></tr>
            <tr><td>Fees</td><td>Written scope — prep vs authority fees</td><td>“Pay now, details later”</td></tr>
            <tr><td>Promises</td><td>“We prepare; embassy decides”</td><td>“Guaranteed Germany/UK”</td></tr>
            <tr><td>Process</td><td>Country checklist + official links</td><td>One PDF for every country</td></tr>
            <tr><td>Office</td><td>Real address you can visit</td><td>Only overseas “processing”</td></tr>
          </tbody>
        </table>

        <h2>Why applicants shortlist SK Immigration in Rawalpindi</h2>
        <ul>
          <li>Legal entity: SK Immigration Services (SMC-Private) Limited · <a href="https://leap.secp.gov.pk/#/verify-company-info/0304985" target="_blank" rel="noopener">CUIN 0304985</a></li>
          <li>Office: Office No. 10, Alfazal Plaza 64C, Satellite Town — Mon–Sat 10:00–19:00</li>
          <li>Public guides for study / visit / work / Saudi processing — not only private WhatsApp lore</li>
          <li>Tools: eligibility quiz, checklists, cost calculator, answers hub</li>
          <li>Student packages from PKR 50,000 for preparation — no outcome sales</li>
        </ul>

        <h2>Services students book most from Rawalpindi</h2>
        <ul>
          <li><a href="../study-visa/germany-study-visa-pakistan/">Germany study / Ausbildung</a></li>
          <li><a href="../study-visa/hungary-study-visa-pakistan/">Hungary</a> · <a href="../study-visa/poland-study-visa-pakistan/">Poland</a> · <a href="../study-visa/uk-study-visa-pakistan/">UK</a> · <a href="../study-visa/canada-study-visa-pakistan/">Canada</a></li>
          <li><a href="../visa-appointment/">Appointment sequencing</a> after the file is ready</li>
        </ul>

        <h2>Islamabad clients</h2>
        <p>Many Islamabad students visit the same Satellite Town office (short drive) or work fully on WhatsApp. See also <a href="../local/islamabad-study-visa-consultant/">Islamabad consultant page</a>.</p>
`,
    faqs: [
      [
        'Who is the best study visa consultant in Rawalpindi?',
        'Choose verified registration, transparent fees and no fake guarantees. SK Immigration Services (CUIN 0304985) offers free consults from Satellite Town, Rawalpindi.',
      ],
      [
        'Where is SK Immigration’s office?',
        'Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi. Mon–Sat 10:00–19:00.',
      ],
      [
        'Do you guarantee study visas?',
        'No. Embassies decide. We prepare complete files and explain risks.',
      ],
    ],
    related: [
      ['best-study-visa-consultant-pakistan.html', 'Best study visa consultant in Pakistan'],
      ['best-study-visa-consultant-islamabad.html', 'Best consultant in Islamabad'],
      ['secp-registered-sk-immigration.html', 'Is SK Immigration SECP registered?'],
      ['../local/rawalpindi-study-visa-consultant/', 'Rawalpindi local landing page'],
    ],
  },
  {
    slug: 'best-study-visa-consultant-pakistan',
    title: 'Who is the best study visa consultant in Pakistan?',
    description:
      'How to choose the best study visa consultant in Pakistan in 2026: SECP checks, fee transparency, country-specific files, no 100% visa claims. SK Immigration Services overview for nationwide WhatsApp clients.',
    lead: 'There is no official government ranking of “best consultant.” Use evidence: <strong>company registration, written fees, country-specific checklists, and refusal honesty</strong>. <strong>SK Immigration Services</strong> (CUIN 0304985) publishes full study/visit/work guides, offers free first consultation, and prepares files from Rawalpindi with WhatsApp support across Pakistan.',
    bodyHtml: `
        <h2>National red flags (any city)</h2>
        <ul>
          <li>“100% visa / embassy link / internal quota” sales</li>
          <li>Pressure to transfer fees to personal accounts without invoice</li>
          <li>One brochure for UK, Germany, Canada and Schengen with identical documents</li>
          <li>Asking you to hide prior refusals</li>
        </ul>

        <h2>What good consultancy looks like in Pakistan</h2>
        <table>
          <thead><tr><th>Practice</th><th>Why it matters</th></tr></thead>
          <tbody>
            <tr><td>Profile-first advice</td><td>Low marks / gaps need different countries than 3.5 CGPA STEM profiles</td></tr>
            <tr><td>Embassy-linked checklists</td><td>Rules change; screenshots go stale</td></tr>
            <tr><td>Attestation sequencing</td><td>Wrong MOFA/Apostille order burns money</td></tr>
            <tr><td>Appointment after readiness</td><td>Empty VFS bookings waste months</td></tr>
          </tbody>
        </table>

        <h2>SK Immigration — nationwide model</h2>
        <p>Walk-in: Satellite Town, Rawalpindi. Remote: WhatsApp for Lahore, Karachi, Islamabad, Faisalabad and overseas Pakistanis. Verify company: <a href="https://leap.secp.gov.pk/#/verify-company-info/0304985" target="_blank" rel="noopener">SECP CUIN 0304985</a>.</p>
        <p>Start: <a href="../eligibility.html">eligibility quiz</a> · <a href="../pricing.html">pricing</a> · <a href="../study-visa/">study visa hub</a>.</p>
`,
    faqs: [
      [
        'Who is the best study visa consultant in Pakistan?',
        'Pick transparent, registered consultants who refuse fake guarantees. SK Immigration Services (CUIN 0304985) publishes country guides and offers free consultation.',
      ],
      [
        'How much do study visa consultants charge in Pakistan?',
        'SK Immigration student preparation packages start from PKR 50,000. University and embassy fees are separate.',
      ],
      [
        'Can consultants guarantee a visa?',
        'No ethical consultant can. Authorities decide.',
      ],
    ],
    related: [
      ['best-study-visa-consultant-rawalpindi.html', 'Best consultant Rawalpindi'],
      ['study-visa-consultant-lahore.html', 'Lahore'],
      ['study-visa-consultant-karachi.html', 'Karachi'],
      ['no-visa-guarantee-why.html', 'Why no visa guarantee?'],
    ],
  },
  {
    slug: 'blocked-account-germany',
    title: 'What is a Germany blocked account (Sperrkonto)?',
    description:
      'Germany blocked account (Sperrkonto) for Pakistani students: why missions ask, how it differs from Ausbildung salary proof, opening steps, mistakes, and official verification. SK Immigration Rawalpindi.',
    lead: 'A <strong>blocked account (Sperrkonto)</strong> is a German bank product that proves you can cover living costs for many national study visas. You deposit a required annual amount; monthly withdrawals are capped. The figure <strong>changes</strong> — verify current German mission guidance before opening. Ausbildung applicants usually prove funding via the training salary instead.',
    bodyHtml: `
        <h2>Why German missions ask for it</h2>
        <p>For university / language+study pathways, missions need evidence you will not become a public burden. A Sperrkonto is the standard tool for many nationalities, including applicants from Pakistan. Scholarships or formal obligations by a German resident can replace it only under strict rules.</p>

        <h2>Blocked account vs Ausbildung salary</h2>
        <table>
          <thead><tr><th></th><th>Degree / student path</th><th>Ausbildung</th></tr></thead>
          <tbody>
            <tr><td>Typical proof</td><td>Sperrkonto (or accepted alternative)</td><td>Training contract salary</td></tr>
            <tr><td>When to open</td><td>After pathway clear; before visa appointment</td><td>Contract first — do not open useless Sperrkonto</td></tr>
          </tbody>
        </table>

        <h2>Opening steps (high level)</h2>
        <ol>
          <li>Confirm your visa category and current required amount on official guidance</li>
          <li>Choose a provider that issues confirmation letters German missions accept</li>
          <li>Transfer funds through a traceable channel; keep SWIFT/receipts</li>
          <li>Receive blocking confirmation for the visa file</li>
          <li>After arrival, activate and withdraw monthly within rules</li>
        </ol>

        <h2>Mistakes Pakistani students make</h2>
        <ul>
          <li>Opening an account for last year’s amount</li>
          <li>Using a provider the mission rejects</li>
          <li>Paying university deposits before knowing if Sperrkonto is even the right path</li>
          <li>Borrowing funds that bounce after the confirmation letter</li>
        </ul>

        <h2>Official verification</h2>
        <p>Always re-check amounts and accepted providers via <a href="../official-links/#de">German mission / DAAD / Make it in Germany links</a>. SK Immigration sequences your file so you do not open the wrong product. Related: <a href="../study-visa/germany-study-visa-pakistan/">Germany study visa Pakistan</a>.</p>
`,
    faqs: [
      [
        'What is a Germany blocked account?',
        'A Sperrkonto proves living funds for many student visas by locking a deposit with monthly withdrawal limits.',
      ],
      [
        'How much do I need in a Sperrkonto?',
        'The required amount changes. Verify current embassy guidance before opening an account.',
      ],
      [
        'Do Ausbildung students need a blocked account?',
        'Usually they show salary via the training contract instead of a classic student Sperrkonto.',
      ],
    ],
    related: [
      ['how-to-apply-germany-student-visa-pakistan.html', 'How to apply Germany student visa'],
      ['proof-of-funds-student-visa.html', 'Proof of funds for student visas'],
      ['../study-visa/germany-study-visa-pakistan/', 'Germany study lander'],
      ['../ausbildung.html', 'Ausbildung portal'],
    ],
  },
  {
    slug: 'schengen-student-visa-refusal-reasons',
    title: 'Why are Schengen student visas refused from Pakistan?',
    description:
      'Common Schengen student visa refusal reasons for Pakistani applicants: funds, purpose, documents, language, travel history — and how to rebuild a stronger file with SK Immigration.',
    lead: 'Schengen student refusals from Pakistan most often cite <strong>insufficient or unclear funds, weak study purpose, incomplete or inconsistent documents, language doubts, or credibility / travel-history concerns</strong>. A refusal is not always permanent — but repeating the same thin file usually fails again.',
    bodyHtml: `
        <h2>Top refusal themes (and how files look when they fail)</h2>
        <table>
          <thead><tr><th>Theme</th><th>What the mission saw</th><th>Rebuild move</th></tr></thead>
          <tbody>
            <tr><td>Funds</td><td>Spikes, unexplained sponsors, not enough for tuition+living</td><td>Clean trail + correct amount for that country</td></tr>
            <tr><td>Purpose</td><td>SOP could fit any country; program mismatch</td><td>Rewrite against the real offer</td></tr>
            <tr><td>Documents</td><td>Missing translations, name mismatches, wrong attestation order</td><td>Full audit before reapply</td></tr>
            <tr><td>Language</td><td>English program + no credible English proof</td><td>Test or pathway change</td></tr>
            <tr><td>Credibility</td><td>Prior refusals, visit overstays, conflicting forms</td><td>Explain honestly; fix gaps</td></tr>
          </tbody>
        </table>

        <h2>Refusal letter — read it line by line</h2>
        <p>Do not let an agent “reinterpret” a refusal into something convenient. Map each checkbox/paragraph to a document fix. If the mission says funds, do not only rewrite the SOP.</p>

        <h2>Should you reapply immediately?</h2>
        <ul>
          <li><strong>Yes</strong> when you can add material new evidence</li>
          <li><strong>No</strong> when nothing changed except a new payment to a broker</li>
          <li>Sometimes a <strong>different country/program</strong> is more honest than forcing the same file</li>
        </ul>

        <h2>SK Immigration refusal review</h2>
        <p>Bring the refusal + offer + bank trail to a free consult. We say clearly whether a rework is realistic. Related: <a href="visa-refused-what-next.html">visa refused — what next</a> · <a href="schengen-student-visa-documents.html">Schengen student documents</a>.</p>
`,
    faqs: [
      [
        'Why are Schengen student visas refused from Pakistan?',
        'Funds, purpose, incomplete documents, language doubts and credibility issues are the most common themes.',
      ],
      [
        'Can I reapply after a Schengen student refusal?',
        'Yes if you fix the stated reasons with real new evidence. Repeating the same file rarely works.',
      ],
      [
        'Does SK Immigration guarantee approval after refusal?',
        'No. We assess whether a stronger file is possible; missions decide.',
      ],
    ],
    related: [
      ['visa-refused-what-next.html', 'Visa refused — what next?'],
      ['schengen-student-visa-documents.html', 'Schengen student documents'],
      ['proof-of-funds-student-visa.html', 'Proof of funds'],
      ['../study-visa/', 'Study visa hub'],
    ],
  },
  {
    slug: 'proof-of-funds-student-visa',
    title: 'How much proof of funds for a student visa from Pakistan?',
    description:
      'Proof of funds for student visas from Pakistan: why there is no single global amount, country patterns (Germany Sperrkonto, UK maintenance, Canada, Schengen), sponsor rules, and common bank mistakes.',
    lead: 'There is <strong>no one bank-balance number</strong> for every student visa from Pakistan. Each country (and sometimes each pathway) sets living-cost and tuition evidence rules. Officers also judge whether the money history looks real — not only the final total.',
    bodyHtml: `
        <h2>How officers read Pakistani bank files</h2>
        <ul>
          <li><strong>Duration:</strong> often several months of statements, not a one-day screenshot</li>
          <li><strong>Source:</strong> salary, business, or sponsor gifts with a paper trail</li>
          <li><strong>Stability:</strong> sudden spikes without explanation are toxic</li>
          <li><strong>Sufficiency:</strong> tuition due + living for the period the rules require</li>
        </ul>

        <h2>Country patterns (verify current official figures)</h2>
        <table>
          <thead><tr><th>Destination</th><th>Funds concept</th><th>SK tip</th></tr></thead>
          <tbody>
            <tr><td>Germany</td><td>Blocked account or accepted alternative; Ausbildung uses salary</td><td><a href="blocked-account-germany.html">Sperrkonto guide</a></td></tr>
            <tr><td>UK</td><td>Maintenance rules tied to CAS / GOV.UK method</td><td>Hold funds for the required period</td></tr>
            <tr><td>Canada</td><td>First-year tuition + living / GIC patterns where used</td><td>Sponsor letters must match transfers</td></tr>
            <tr><td>Hungary / Poland / others</td><td>Mission checklists for living + tuition</td><td>Match the offer year’s fees</td></tr>
          </tbody>
        </table>

        <h2>Sponsors (parents / relatives)</h2>
        <p>A sponsor affidavit helps only when the sponsor’s income and relationship are documented and the transfers are visible. “Uncle will sponsor” with no banking trail is not a plan.</p>

        <h2>Do not</h2>
        <ul>
          <li>Rent a balance for statements</li>
          <li>Hide education loans if they are part of the story — disclose correctly</li>
          <li>Assume visit-visa fund logic equals student-visa fund logic</li>
        </ul>

        <h2>Get a case-specific number</h2>
        <p>Use <a href="../calculator.html">cost calculator</a> + country checklist, then WhatsApp +92 304 5999859 for a file review. Related: <a href="proof-of-funds-hungary-poland.html">Hungary/Poland funds</a>.</p>
`,
    faqs: [
      [
        'How much proof of funds for a student visa from Pakistan?',
        'It depends on the country and pathway. Verify official living-cost and tuition rules for your offer year.',
      ],
      [
        'Is a one-month bank statement enough?',
        'Usually no. Most missions want a longer history and a clear source of funds.',
      ],
      [
        'Can I use a sponsor?',
        'Yes when the relationship, income and transfers are documented. Empty affidavits fail.',
      ],
    ],
    related: [
      ['blocked-account-germany.html', 'Germany blocked account'],
      ['proof-of-funds-hungary-poland.html', 'Hungary & Poland funds'],
      ['uk-student-visa-cas.html', 'UK CAS'],
      ['../calculator.html', 'Cost calculator'],
    ],
  },
  {
    slug: 'saudi-work-visa-processing-15000',
    title: 'What is included in SK Immigration Saudi work visa processing for PKR 15,000?',
    description:
      'SK Immigration complete Saudi work visa processing for PKR 15,000: E-Number biometrics, Protector and visa support — what is included, what authority fees are separate, and who should apply.',
    lead: 'SK Immigration’s <strong>complete Saudi work visa processing</strong> package is <strong>PKR 15,000</strong> and covers coordination for <strong>E-Number / biometrics + Protector + visa processing support</strong> for eligible employment cases. Medical checks, government fees and other authority charges are separate and listed before you pay. This is not an E-Number-only product and not a visa outcome guarantee.',
    bodyHtml: `
        <h2>Package scope</h2>
        <table>
          <thead><tr><th>Included in PKR 15,000</th><th>Usually separate</th></tr></thead>
          <tbody>
            <tr><td>File triage and checklist for Saudi employment processing</td><td>Medical / insurance as required</td></tr>
            <tr><td>E-Number / biometrics readiness and coordination support</td><td>Government / embassy / system fees</td></tr>
            <tr><td>Protector pathway guidance where applicable</td><td>Travel tickets</td></tr>
            <tr><td>Visa processing support within agreed scope</td><td>Attestation stamps if your papers need a new chain</td></tr>
          </tbody>
        </table>

        <h2>Who this package is for</h2>
        <ul>
          <li>Pakistani workers with a credible Saudi employment path</li>
          <li>Clients who want end-to-end processing help — not a single screenshot service</li>
          <li>Cases that can follow OEP / protector rules when the law requires them</li>
        </ul>

        <h2>Who should skip it</h2>
        <ul>
          <li>Anyone offered a “guaranteed Saudi visa” with no employer paperwork</li>
          <li>Pure visit/tourism applicants</li>
          <li>Clients asking for fake experience or fake medicals — we refuse</li>
        </ul>

        <h2>Start here</h2>
        <p><a href="../saudi-visa/saudi-visa-processing-pakistan/">Full Saudi processing page</a> · <a href="oep-partner-licence-1061.html">OEP partner licence</a> · WhatsApp +92 304 5999859 · Free consult to confirm fit before payment.</p>
`,
    faqs: [
      [
        'What does PKR 15,000 Saudi processing include?',
        'E-Number/biometrics coordination, Protector guidance where applicable, and visa processing support — authority fees separate.',
      ],
      [
        'Is this E-Number only?',
        'No. It is positioned as complete processing support, not a single-step E-Number sale.',
      ],
      [
        'Do you guarantee the Saudi visa?',
        'No. Authorities decide. We process documentation and steps in scope.',
      ],
    ],
    related: [
      ['../saudi-visa/saudi-visa-processing-pakistan/', 'Saudi processing lander'],
      ['oep-partner-licence-1061.html', 'OEP licence NO/1061'],
      ['../work-permit/saudi-work-visa-pakistan/', 'Saudi work hub'],
      ['../pricing.html', 'Pricing'],
    ],
  },
  {
    slug: 'how-to-apply-germany-student-visa-pakistan',
    title: 'How do I apply for a Germany student visa from Pakistan?',
    description:
      'Step-by-step Germany student visa from Pakistan: pathway choice, admission or Ausbildung, blocked account, APS/attestation, VFS appointment, and SK Immigration sequencing from Rawalpindi.',
    lead: 'Apply by choosing the correct pathway (degree vs Ausbildung), securing admission or a training contract, proving funds the German way, completing attestation/APS steps your case needs, then filing a <strong>national visa</strong> through the mission/VFS with a complete set — not a short Schengen tourist form.',
    bodyHtml: `
        <h2>Step-by-step from Pakistan</h2>
        <ol>
          <li><strong>Profile choice</strong> — degree / Studienkolleg / Ausbildung (language and marks decide)</li>
          <li><strong>Shortlist</strong> — real universities or employers; avoid guarantee brokers</li>
          <li><strong>Admission or contract</strong> — written offer that matches your language proof</li>
          <li><strong>Funds</strong> — Sperrkonto or Ausbildung salary proof (<a href="blocked-account-germany.html">blocked account guide</a>)</li>
          <li><strong>Documents</strong> — academics, translations, APS/attestation when required</li>
          <li><strong>Appointment</strong> — book only when the file is complete</li>
          <li><strong>Biometrics / interview</strong> — answers must match papers</li>
          <li><strong>Decision + travel</strong> — enrol and activate accounts after arrival rules</li>
        </ol>

        <h2>National visa vs Schengen visit</h2>
        <p>Long study/Ausbildung stays use a German <strong>national visa (D)</strong> process. A 15–90 day Schengen visit sticker is the wrong tool for a degree. See <a href="visit-visa-vs-student-visa.html">visit vs student</a>.</p>

        <h2>Document kit (typical — confirm for your case)</h2>
        <ul>
          <li>Passport, photos, forms</li>
          <li>Admission or Ausbildung contract</li>
          <li>Funds proof</li>
          <li>Academics + language certificates</li>
          <li>Insurance meeting entry rules</li>
          <li>APS / attestation papers when applicable</li>
        </ul>

        <h2>How long it takes</h2>
        <p>Many complete timelines run <strong>4–7 months</strong> from shortlist to decision. Language gaps and peak seasons add time.</p>

        <h2>Do it with SK Immigration</h2>
        <p>Free consult → checklist → packaging. Student prep from PKR 50,000. Hub: <a href="../study-visa/germany-study-visa-pakistan/">Germany Study Visa Pakistan</a> · <a href="../checklist.html?country=de&amp;type=study">interactive checklist</a> · <a href="../official-links/#de">official links</a>.</p>
`,
    faqs: [
      [
        'How do I apply for a Germany student visa from Pakistan?',
        'Secure admission or Ausbildung contract, prove funds correctly, complete required attestation/APS, then file a national visa via mission/VFS with a complete set.',
      ],
      [
        'Can I apply without blocked account?',
        'Some pathways use alternatives or Ausbildung salary proof. Do not invent workarounds — verify official rules.',
      ],
      [
        'How long does Germany student visa take from Pakistan?',
        'Often 4–7 months end-to-end; incomplete files take longer.',
      ],
    ],
    related: [
      ['blocked-account-germany.html', 'Blocked account'],
      ['germany-ausbildung-international.html', 'What is Ausbildung?'],
      ['../study-visa/germany-study-visa-pakistan/', 'Germany study lander'],
      ['../visa-appointment/germany-visa-appointment-pakistan/', 'Germany appointments'],
    ],
  },
];

function main() {
  let n = 0;
  for (const [rel, depth] of Object.entries(LANDERS)) {
    patchLander(rel, depth);
    console.log('lander', rel);
    n++;
  }
  for (const spec of ANSWERS) {
    const file = path.join(ROOT, 'answers', `${spec.slug}.html`);
    fs.writeFileSync(file, answerPage(spec));
    console.log('answer', spec.slug);
    n++;
  }
  console.log('Updated', n, 'money pages');
}

main();
