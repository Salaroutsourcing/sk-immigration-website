#!/usr/bin/env node
/**
 * Phase 4 — deepen top high-intent Answers into citation-grade pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TODAY = '2026-07-30';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function page({ slug, title, description, lead, bodyHtml, faqs, related, nextExtra = '' }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const relatedHtml = related
    .map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`)
    .join('');
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} | SK Immigration Services</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="https://skimmigrationservices.works/answers/${slug}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="https://skimmigrationservices.works/answers/${slug}" />
  <meta property="og:type" content="article" />
  <meta name="author" content="SK Immigration Services" />
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
${bodyHtml}
        <h2>Official sources to verify</h2>
        <p>Rules change by nationality and intake. Always confirm on government pages before you pay fees. Browse <a href="../official-links/">all country official links</a>.</p>
        <h2>How SK Immigration helps</h2>
        <p>We turn this into a personal plan: correct pathway, document checklist, cost estimate and honest risk notes. Free first consultation. We never sell fake “100% visa” promises — authorities decide.</p>
        <h2>Do this next</h2>
        <ol>
${nextExtra}          <li><a href="../eligibility.html">Free eligibility quiz</a></li>
          <li><a href="../checklist.html">Document checklist by country</a></li>
          <li><a href="../contact.html">Book free consultation</a> or WhatsApp +92 304 5999859</li>
          <li><a href="../answers.html">Browse all answers</a></li>
        </ol>
        <h2>Related questions</h2>
        <ul>${relatedHtml}</ul>
        <h2>Cite this</h2>
        <p>SK Immigration Services (SMC-Private) Limited · CUIN 0304985 · https://skimmigrationservices.works · Services@skimmigrationservices.works · Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi · Mon–Sat 10:00–19:00. Last editorial review: ${TODAY}.</p>
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

const PAGES = [
  {
    slug: 'blocked-account-germany',
    title: 'What is a Germany blocked account (Sperrkonto)?',
    description:
      'Germany Sperrkonto explained for Pakistani students: why embassies ask for it, how it differs from Ausbildung salary proof, opening steps, common mistakes, and official sources. SK Immigration.',
    lead: 'A <strong>blocked account (Sperrkonto)</strong> is a German bank account that proves you can cover living costs for a study visa. You deposit a required annual amount; monthly withdrawals are limited. The exact figure changes — always verify current embassy guidance before opening an account. Ausbildung applicants usually prove funding through the training salary in the contract instead of a classic student Sperrkonto.',
    bodyHtml: `
        <h2>Why German missions ask for it</h2>
        <p>For most <strong>university / language + study</strong> visas, the mission needs evidence you will not become a public burden. A blocked account is the clearest standard proof for many nationalities, including applicants from Pakistan. Alternatives (scholarship letters, formal obligations by a German resident) exist but have strict rules — do not invent your own “workaround.”</p>
        <h2>Typical amount (planning only)</h2>
        <p>Public guidance has often been in the range of roughly <strong>€11,000+ for one year</strong> of living costs, with a monthly release limit (often around €900+). Treat any number you see on blogs as outdated until you confirm on Make it in Germany / German mission pages for your intake. Currency conversion and bank opening fees are extra.</p>
        <h2>Study visa vs Ausbildung</h2>
        <ul>
          <li><strong>Degree / language pathway:</strong> Sperrkonto (or accepted alternative) is commonly required.</li>
          <li><strong>Ausbildung:</strong> The training contract usually shows a monthly training salary. Missions still check that the salary covers living costs; top-ups or additional proof may still be needed depending on the case.</li>
        </ul>
        <p>See <a href="../study-visa/germany-study-visa-pakistan/">Germany Study Visa Pakistan</a> and <a href="../guides/ausbildung-pakistan/">Ausbildung Pakistan guide</a>.</p>
        <h2>How Pakistani applicants usually open one</h2>
        <ol>
          <li>Confirm the <strong>current required amount</strong> for your visa type and nationality.</li>
          <li>Choose a provider that German missions accept (options change — ask before paying).</li>
          <li>Prepare passport, admission/offer (or language booking where required), and identity docs.</li>
          <li>Transfer funds through documented banking channels; keep SWIFT/transfer receipts.</li>
          <li>Receive the <strong>blocking confirmation</strong> letter for the visa file.</li>
          <li>After arrival and residence steps, activate monthly withdrawals as instructed.</li>
        </ol>
        <h2>Common mistakes that delay visas</h2>
        <ul>
          <li>Opening the account with the <strong>wrong amount</strong> for the current year</li>
          <li>Name mismatch vs passport / admission letter</li>
          <li>Paying unofficial “agents” who never deliver a valid confirmation</li>
          <li>Assuming Ausbildung never needs extra funds proof</li>
          <li>Leaving transfer timing too late for the embassy appointment</li>
        </ul>
        <h2>SK Immigration checklist tip</h2>
        <p>Use our <a href="../checklist.html?country=de&amp;type=study">Germany study checklist</a> and verify links on <a href="../official-links/#de">official Germany sources</a>. We sequence admission → funds → appointment so you do not open (and pay for) an account before the pathway is clear.</p>
`,
    faqs: [
      [
        'What is a Germany blocked account (Sperrkonto)?',
        'A blocked bank account proving you can fund living costs for a German study visa. Required amounts change — verify embassy guidance. Ausbildung applicants usually show salary via training contract instead.',
      ],
      [
        'Do Ausbildung applicants need a Sperrkonto?',
        'Often not in the classic student form — the training contract salary is the main funding proof. Missions can still ask for extra evidence if the salary is low for living costs.',
      ],
      [
        'How much money do I need in a German blocked account?',
        'The required annual amount changes. Confirm the current figure on Make it in Germany / German mission guidance for your intake before transferring funds.',
      ],
    ],
    related: [
      ['proof-of-funds-student-visa.html', 'How much proof of funds do I need for a student visa?'],
      ['how-to-apply-germany-student-visa-pakistan.html', 'How to apply for Germany student visa from Pakistan'],
      ['germany-ausbildung-international.html', 'What is Germany Ausbildung?'],
      ['../study-visa/germany-study-visa-pakistan/', 'Germany Study Visa Pakistan'],
    ],
    nextExtra: `          <li><a href="../study-visa/germany-study-visa-pakistan/">Germany Study Visa Pakistan</a></li>\n`,
  },
  {
    slug: 'proof-of-funds-student-visa',
    title: 'How much proof of funds do I need for a student visa?',
    description:
      'Student visa proof of funds from Pakistan: Germany Sperrkonto, UK maintenance, Canada GIC/bank, Schengen living costs, what statements must show, and refusal risks. SK Immigration.',
    lead: 'There is <strong>no single global amount</strong>. Each country sets its own living-cost and tuition proof rules. Germany often uses a blocked account; the UK uses CAS-linked maintenance; Canada often expects GIC plus tuition; Schengen study visas need country-specific monthly living proof. Always verify the destination’s official figure for your intake.',
    bodyHtml: `
        <h2>What “proof of funds” means</h2>
        <p>Embassies want evidence you can pay <strong>tuition (if any)</strong> and <strong>living costs</strong> for the required period without illegal work. Weak, sudden, or unexplained deposits are a top refusal reason for Pakistani applicants.</p>
        <h2>By destination (planning overview)</h2>
        <ul>
          <li><strong>Germany:</strong> Often Sperrkonto / blocked account (or Ausbildung salary). See <a href="blocked-account-germany.html">blocked account answer</a>.</li>
          <li><strong>United Kingdom:</strong> Maintenance funds for a set number of days plus unpaid tuition — timing and account history matter. Linked to <a href="uk-student-visa-cas.html">CAS</a>.</li>
          <li><strong>Canada:</strong> Tuition + living costs; many students use a GIC with a Canadian bank plus other funds as required by IRCC.</li>
          <li><strong>Schengen study (Hungary, Poland, etc.):</strong> Monthly living cost × months + tuition receipts/invoices as the mission checklist states.</li>
          <li><strong>Australia / USA:</strong> Strong bank evidence, sponsor affidavits where allowed, and honest explanation of income sources.</li>
        </ul>
        <h2>What good bank evidence looks like</h2>
        <ul>
          <li>Statements usually covering <strong>3–6 months</strong> (follow the exact embassy rule)</li>
          <li>Stable balance history — not a one-day spike before the appointment</li>
          <li>Name matching passport / sponsor rules</li>
          <li>Clear sponsor letter + relationship proof if someone else pays</li>
          <li>Tuition payment receipts or scholarship letters where relevant</li>
        </ul>
        <h2>Sponsor vs self-funded</h2>
        <p>Parents or relatives can often sponsor, but you must show <strong>source of funds</strong> (salary, business, sale of assets) with documents. Vague “family support” with empty explanations fails interviews and paper checks.</p>
        <h2>Mistakes that trigger refusals</h2>
        <ul>
          <li>Borrowed money parked for one week</li>
          <li>Using someone else’s account without a proper sponsor file</li>
          <li>Ignoring currency / minimum day-count rules (especially UK)</li>
          <li>Copying amounts from outdated Facebook posts</li>
        </ul>
        <p>Build your list with <a href="../checklist.html">checklist by country</a>, then confirm on <a href="../official-links/">official embassy links</a>.</p>
`,
    faqs: [
      [
        'How much proof of funds do I need for a student visa?',
        'It depends on the country. Germany often needs a blocked account; UK has CAS-linked maintenance; Canada often uses GIC plus tuition; Schengen countries set monthly living amounts. Verify official figures for your intake.',
      ],
      [
        'Can my parents sponsor my student visa funds?',
        'Often yes, with a sponsor letter, relationship proof and clear source-of-funds documents. Sudden unexplained deposits still hurt the case.',
      ],
      [
        'Is a one-month bank statement enough?',
        'Usually no. Most missions want several months of history plus the required balance. Follow the destination checklist exactly.',
      ],
    ],
    related: [
      ['blocked-account-germany.html', 'Germany blocked account (Sperrkonto)'],
      ['uk-student-visa-cas.html', 'What is a UK CAS?'],
      ['canada-study-permit-requirements.html', 'Canada study permit requirements'],
      ['visa-refused-what-next.html', 'What if my student visa is refused?'],
    ],
  },
  {
    slug: 'visa-refused-what-next',
    title: 'What if my student visa is refused?',
    description:
      'Student visa refused from Pakistan: how to read the refusal letter, when to reapply, administrative review options, fixing funds/IELTS/gaps, and honest next steps with SK Immigration.',
    lead: 'A refusal is not the end — but <strong>reapplying with the same weak file usually fails again</strong>. Read the refusal reasons carefully, fix the exact gaps (funds, ties, program fit, documents, interview answers), then decide whether to reapply, change country/pathway, or pause. SK Immigration does not guarantee visas; embassy fees are usually non-refundable.',
    bodyHtml: `
        <h2>Step 1 — Read the refusal letter like a checklist</h2>
        <p>Highlight every reason: insufficient funds, unclear study plan, weak home ties, language, document authenticity, credibility at interview, travel history, etc. Your new file must <strong>answer each line</strong> with evidence, not longer emotional essays.</p>
        <h2>Step 2 — Decide: reapply, review, or change path</h2>
        <ul>
          <li><strong>Reapply:</strong> When the fix is clear (wrong amount, missing attestation, weak SOP) and you can wait for a stronger file.</li>
          <li><strong>Administrative review / appeal:</strong> Only where the destination officially offers it (e.g. some UK cases). Deadlines are short — get advice fast.</li>
          <li><strong>Change pathway:</strong> Different country, Ausbildung vs degree, later intake, or stronger university/program fit.</li>
        </ul>
        <h2>Step 3 — Rebuild the weak points</h2>
        <ul>
          <li><strong>Funds:</strong> See <a href="proof-of-funds-student-visa.html">proof of funds</a> and country landers.</li>
          <li><strong>Study plan:</strong> Honest why-this-program / why-this-country / career return or post-study plan matching the visa type.</li>
          <li><strong>Documents:</strong> Attestation order, translations, consistent names and dates.</li>
          <li><strong>Language:</strong> IELTS/MOI/German level that matches the real offer.</li>
        </ul>
        <h2>What SK Immigration will (and will not) do</h2>
        <p><strong>We will:</strong> review the refusal letter, map fixes, rebuild checklists, and advise if reapplication is realistic.</p>
        <p><strong>We will not:</strong> promise approval, invent documents, or blame the embassy for a thin file.</p>
        <h2>Timing</h2>
        <p>Rushing a reapplication in days often wastes another fee. A clean rebuild may take weeks. Meanwhile use <a href="../compare.html">country compare</a> and <a href="../study-visa/">study hubs</a> if a different destination fits better.</p>
`,
    faqs: [
      [
        'What if my student visa is refused?',
        'Review the refusal letter, fix the exact gaps, then reapply, seek review where available, or change pathway. SK Immigration does not guarantee visas; embassy fees are usually non-refundable.',
      ],
      [
        'Can I reapply immediately after a student visa refusal?',
        'You usually can, but only after you fix the stated reasons. Same documents with a new application date rarely works.',
      ],
      [
        'Does SK Immigration refund if the visa is refused?',
        'Service fees cover preparation work, not the visa stamp. Embassy/VFS fees are paid to authorities and are typically non-refundable. Ask us for written package terms before you pay.',
      ],
    ],
    related: [
      ['schengen-student-visa-refusal-reasons.html', 'Schengen student visa refusal reasons'],
      ['visit-visa-refusal-reasons-pakistan.html', 'Visit visa refusal reasons'],
      ['proof-of-funds-student-visa.html', 'Proof of funds for student visas'],
      ['no-visa-guarantee-why.html', 'Why SK does not guarantee visas'],
    ],
  },
  {
    slug: 'uk-student-visa-cas',
    title: 'What is a CAS for UK student visa?',
    description:
      'UK CAS (Confirmation of Acceptance for Studies) explained for Pakistani students: when you get it, what it includes, funds timing, CAS-first process, and SK Immigration support.',
    lead: 'A <strong>CAS (Confirmation of Acceptance for Studies)</strong> is an electronic reference from a UK Student sponsor (usually your university or college). You need a CAS before you can apply for the UK Student visa on GOV.UK. No valid CAS = no student visa application.',
    bodyHtml: `
        <h2>CAS-first sequence (Pakistan)</h2>
        <ol>
          <li>Choose a licensed Student sponsor and get an offer.</li>
          <li>Meet offer conditions (deposit, documents, English as required).</li>
          <li>University issues <strong>CAS</strong> with a unique number.</li>
          <li>Prepare funds / TB test / documents as GOV.UK requires.</li>
          <li>Apply online, pay fees/IHS, book biometrics (often via VFS in Pakistan).</li>
          <li>UKVI decides — SK Immigration prepares the file; we do not issue visas.</li>
        </ol>
        <p>Full pathway: <a href="../study-visa/uk-study-visa-pakistan/">UK Study Visa Pakistan</a> · appointment help: <a href="../visa-appointment/uk-visa-appointment-pakistan/">UK visa appointment</a>.</p>
        <h2>What a CAS typically contains</h2>
        <ul>
          <li>Course title, start/end dates, tuition fees and what you already paid</li>
          <li>Sponsor licence details and your personal details</li>
          <li>ATAS requirement flag where relevant</li>
          <li>Work limits / course level information used by UKVI</li>
        </ul>
        <h2>Funds and CAS timing</h2>
        <p>UK maintenance rules are strict about <strong>how long money must sit</strong> in accounts and how tuition paid on CAS reduces the amount you show. Do not move funds randomly after CAS if it breaks the day-count rules. Confirm current GOV.UK Student visa guidance.</p>
        <h2>Common CAS problems</h2>
        <ul>
          <li>Applying for visa before CAS is issued</li>
          <li>Name/passport mismatches on CAS vs application</li>
          <li>Expired CAS (they have limited validity)</li>
          <li>Wrong course dates vs travel plan</li>
        </ul>
        <h2>Official sources</h2>
        <ul>
          <li><a href="https://www.gov.uk/student-visa" target="_blank" rel="noopener noreferrer">GOV.UK Student visa</a></li>
          <li><a href="https://www.gov.uk/browse/visas-immigration" target="_blank" rel="noopener noreferrer">UK Visas and Immigration</a></li>
          <li><a href="../official-links/#gb">UK official links hub</a></li>
        </ul>
`,
    faqs: [
      [
        'What is a CAS for UK student visa?',
        'Confirmation of Acceptance for Studies — an electronic reference from a licensed UK Student sponsor. You need it before applying for the Student visa on GOV.UK.',
      ],
      [
        'Can I apply for a UK student visa without CAS?',
        'No. The Student visa route requires a valid CAS from a licensed sponsor.',
      ],
      [
        'How long is a CAS valid?',
        'CAS numbers have limited validity windows. Apply within the period your sponsor and GOV.UK guidance allow — do not wait until it expires.',
      ],
    ],
    related: [
      ['how-to-apply-uk-student-visa-pakistan.html', 'UK student visa step by step'],
      ['proof-of-funds-student-visa.html', 'Proof of funds'],
      ['../study-visa/uk-study-visa-pakistan/', 'UK Study Visa Pakistan'],
      ['../blog/uk-student-visa/', 'UK student visa guide'],
    ],
    nextExtra: `          <li><a href="../study-visa/uk-study-visa-pakistan/">UK Study Visa Pakistan</a></li>\n`,
  },
  {
    slug: 'schengen-visit-visa-requirements',
    title: 'What are Schengen visit visa requirements?',
    description:
      'Schengen short-stay (Type C) visit visa requirements from Pakistan: documents, funds, itinerary, insurance, which country to apply through, and common refusals. SK Immigration.',
    lead: 'A <strong>Schengen visit visa (usually Type C)</strong> lets you visit the Schengen Area for short stays (tourism, family, business) — typically up to 90 days in 180 days. From Pakistan you normally apply via VFS/the mission of the country that is your main destination (or first entry if unclear). Requirements include passport, forms, photos, travel medical insurance, funds, itinerary/accommodation, and strong home ties.',
    bodyHtml: `
        <h2>Core document set (typical)</h2>
        <ul>
          <li>Valid passport with blank pages and recent photos</li>
          <li>Completed application + appointment/biometrics</li>
          <li>Travel medical insurance meeting Schengen minimums</li>
          <li>Flight reservation / travel plan (follow mission rules on tickets)</li>
          <li>Hotel bookings or host invitation + host ID/status docs</li>
          <li>Bank statements and employment/business proof</li>
          <li>Evidence you will return (job, family, property, studies)</li>
        </ul>
        <p>Country pages: <a href="../visit-visa/schengen-visit-visa-pakistan/">Schengen Visit Visa Pakistan</a> · Germany/France/Italy/Spain/Netherlands hubs under <a href="../visit-visa/">Visit Visa</a>.</p>
        <h2>Which country processes your file?</h2>
        <p>Apply to the country of <strong>main destination</strong> (where you spend most nights). If equal, the country of first entry often applies. Applying to the “easiest” mission while clearly travelling elsewhere is a credibility risk.</p>
        <h2>Funds and ties (why Pakistanis get refused)</h2>
        <p>Visit visas are refused when officers doubt return intent or financing. Thin bank history, unpaid leave stories without proof, or tourist plans that look like immigration attempts fail. See <a href="visit-visa-refusal-reasons-pakistan.html">visit refusal reasons</a>.</p>
        <h2>Visit vs study</h2>
        <p>Do not use a visit visa as a shortcut to study or work. Wrong purpose is a serious credibility hit for future applications. Compare <a href="visit-visa-vs-student-visa.html">visit vs student visa</a>.</p>
        <h2>Official EU reference</h2>
        <ul>
          <li><a href="https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en" target="_blank" rel="noopener noreferrer">EU Schengen visa policy</a></li>
          <li><a href="../official-links/#schengen">Schengen official links</a></li>
        </ul>
`,
    faqs: [
      [
        'What are Schengen visit visa requirements?',
        'Typically passport, form, photos, Schengen travel insurance, funds, itinerary/accommodation, employment proof and strong home ties. Apply via the main destination country mission/VFS from Pakistan.',
      ],
      [
        'How long can I stay on a Schengen visit visa?',
        'Short-stay rules are commonly up to 90 days in any 180-day period, but your visa sticker may show shorter dates. Always follow the sticker and entry rules.',
      ],
      [
        'Can I work on a Schengen visit visa?',
        'No. Visit visas are not work authorisations. Working illegally can ban future travel.',
      ],
    ],
    related: [
      ['schengen-visit-visa-from-pakistan-how.html', 'How to apply for Schengen visit from Pakistan'],
      ['visit-visa-refusal-reasons-pakistan.html', 'Why visit visas are refused'],
      ['../visit-visa/schengen-visit-visa-pakistan/', 'Schengen Visit Visa Pakistan'],
      ['../checklist.html?country=schengen', 'Schengen checklist'],
    ],
    nextExtra: `          <li><a href="../visit-visa/schengen-visit-visa-pakistan/">Schengen Visit Visa Pakistan</a></li>\n`,
  },
  {
    slug: 'saudi-work-visa-processing-15000',
    title: 'What is included in SK Immigration Saudi work visa processing PKR 15,000?',
    description:
      'SK Immigration Saudi work visa PKR 15,000 includes E-Number + Protector + visa processing support — not E-Number only. Medical/government fees separate. Honest package details.',
    lead: 'The <strong>PKR 15,000</strong> package is <strong>complete Saudi work visa processing support</strong> — not E-Number only. It includes assistance with <strong>E-Number biometrics</strong>, <strong>Protector</strong>, and <strong>visa processing</strong> steps for eligible employment cases. Medical checks, embassy/government fees and any third-party charges are separate. Saudi authorities and employers decide outcomes; SK does not guarantee visas.',
    bodyHtml: `
        <h2>What is included</h2>
        <ul>
          <li><strong>E-Number / biometrics assistance</strong> — guidance and processing support for the required biometric step</li>
          <li><strong>Protector</strong> — included in this package (as applicable to the case)</li>
          <li><strong>Visa processing support</strong> — file preparation and coordination for the Saudi work visa pathway you qualify for</li>
          <li>Clear checklist of what <em>you</em> must still pay to medical centres / government portals</li>
        </ul>
        <h2>What is not included</h2>
        <ul>
          <li>Medical examination fees</li>
          <li>Official Saudi / embassy / portal fees</li>
          <li>Attestation of degrees or personal documents (quoted separately if needed)</li>
          <li>Any promise of job placement disguised as a visa fee</li>
        </ul>
        <h2>Who this is for</h2>
        <p>Candidates with a genuine Saudi employment track (employer / contract context) who need end-to-end processing help from Pakistan. If you only need a fragment of the process, ask us for an itemised quote — do not assume every Facebook “E-Number only” offer matches this package.</p>
        <h2>Process overview</h2>
        <ol>
          <li>Free consult — documents, job context, timeline</li>
          <li>Checklist and fee map (SK fee vs authority fees)</li>
          <li>E-Number / biometrics support</li>
          <li>Protector and visa processing steps</li>
          <li>Travel readiness notes after decision</li>
        </ol>
        <p>Service pages: <a href="../saudi-visa/saudi-visa-processing-pakistan/">Saudi visa processing Pakistan</a> · <a href="../work-permit/saudi-work-visa-pakistan/">Saudi work visa lander</a> · verify portals on <a href="../official-links/#sa">Saudi official links</a>.</p>
        <h2>Compliance note</h2>
        <p>Where overseas employment rules apply, SK works with appropriate licensing partners (including OEP partner arrangements such as licence <strong>NO/1061</strong> where relevant). Ask in consult which steps apply to your contract type.</p>
`,
    faqs: [
      [
        'What is included in SK Immigration Saudi work visa processing PKR 15,000?',
        'Complete Saudi work visa processing support — E-Number biometrics assistance, Protector included, and visa processing support. Medical and government fees are separate. Not E-Number only.',
      ],
      [
        'Is the PKR 15,000 Saudi package only for E-Number?',
        'No. It is complete processing support: E-Number + Protector + visa processing assistance. Authority/medical fees are extra.',
      ],
      [
        'Does SK Immigration guarantee a Saudi work visa?',
        'No. Employers and Saudi authorities decide. We prepare and coordinate the file honestly.',
      ],
    ],
    related: [
      ['oep-partner-licence-1061.html', 'OEP partner licence NO/1061'],
      ['work-permit-documents-pakistan.html', 'Work permit documents'],
      ['../saudi-visa/saudi-visa-processing-pakistan/', 'Saudi visa processing page'],
      ['../hire-workers-from-pakistan/', 'Hire workers from Pakistan'],
    ],
    nextExtra: `          <li><a href="../saudi-visa/saudi-visa-processing-pakistan/">Saudi visa processing Pakistan</a></li>\n`,
  },
  {
    slug: 'canada-study-permit-requirements',
    title: 'What are Canada study permit requirements?',
    description:
      'Canada study permit from Pakistan: acceptance letter, funds/GIC, PAL where required, biometrics, SOP, common refusals, and SK Immigration process. Verify on IRCC.',
    lead: 'To study in Canada you generally need a <strong>letter of acceptance</strong> from a designated learning institution, proof you can pay <strong>tuition and living costs</strong>, identity documents, and a study permit application that satisfies IRCC (including biometrics). Some intakes also need a provincial attestation letter (PAL) — rules change, so verify on IRCC before you pay agents.',
    bodyHtml: `
        <h2>Core requirements (typical)</h2>
        <ul>
          <li>Acceptance from a DLI (program and conditions clear)</li>
          <li>Proof of funds (tuition + living; GIC often used by students from Pakistan)</li>
          <li>Valid passport and photos</li>
          <li>Immigration medical exam if required for your case</li>
          <li>SOP / study plan that matches the program</li>
          <li>Biometrics and online IRCC application</li>
          <li>PAL / other provincial letters when IRCC requires them for your intake</li>
        </ul>
        <p>Service page: <a href="../study-visa/canada-study-visa-pakistan/">Canada Study Visa Pakistan</a> · step-by-step: <a href="how-to-apply-canada-study-permit-pakistan.html">how to apply</a>.</p>
        <h2>Funds — what officers look for</h2>
        <p>Enough money for first-year tuition and living costs, with a believable source. Sudden large deposits without explanation are a classic refusal pattern. See <a href="proof-of-funds-student-visa.html">proof of funds</a>.</p>
        <h2>Credibility and refusals</h2>
        <ul>
          <li>Program that does not match your academics/work history</li>
          <li>Weak ties / unclear return or career logic</li>
          <li>Incomplete forms or missing PAL when required</li>
          <li>Using unlicensed “guaranteed visa” agents</li>
        </ul>
        <p>If refused: <a href="visa-refused-what-next.html">what to do next</a>.</p>
        <h2>Official IRCC sources</h2>
        <ul>
          <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html" target="_blank" rel="noopener noreferrer">IRCC — Study in Canada</a></li>
          <li><a href="../official-links/#ca">Canada official links</a></li>
          <li><a href="../checklist.html?country=ca&amp;type=study">Canada study checklist</a></li>
        </ul>
`,
    faqs: [
      [
        'What are Canada study permit requirements?',
        'Typically a DLI acceptance letter, proof of funds, passport, biometrics, and a complete IRCC application. Some intakes need a provincial attestation letter — verify current IRCC rules.',
      ],
      [
        'Do Pakistani students need a GIC for Canada?',
        'Many use a GIC as part of funds proof, but follow the exact IRCC and school guidance for your program and intake.',
      ],
      [
        'How long does a Canada study permit take from Pakistan?',
        'Processing times change. Plan months, not weeks, and check IRCC’s published times for your visa office.',
      ],
    ],
    related: [
      ['how-to-apply-canada-study-permit-pakistan.html', 'Canada study permit step by step'],
      ['proof-of-funds-student-visa.html', 'Proof of funds'],
      ['../study-visa/canada-study-visa-pakistan/', 'Canada Study Visa Pakistan'],
      ['../blog/canada-student-visa/', 'Canada student visa guide'],
    ],
    nextExtra: `          <li><a href="../study-visa/canada-study-visa-pakistan/">Canada Study Visa Pakistan</a></li>\n`,
  },
  {
    slug: 'how-to-apply-germany-student-visa-pakistan',
    title: 'How to apply for Germany student visa from Pakistan step by step?',
    description:
      'Germany student visa from Pakistan step by step: shortlist, admission or Ausbildung, blocked account, documents, VFS/embassy appointment, timeline and SK Immigration help.',
    lead: 'From Pakistan, the Germany student path is usually: <strong>profile → university or Ausbildung contract → funds proof (often Sperrkonto) → complete document file → national visa appointment → decision</strong>. Timelines often run several months. German missions decide; SK Immigration prepares honest files.',
    bodyHtml: `
        <h2>Step-by-step</h2>
        <ol>
          <li><strong>Profile & pathway:</strong> Degree vs language + degree vs Ausbildung. Take our <a href="../eligibility.html">eligibility quiz</a>.</li>
          <li><strong>Shortlist:</strong> Programs or employers that match marks, language and budget.</li>
          <li><strong>Admission or training contract:</strong> Collect offer / contract letters that missions accept.</li>
          <li><strong>Funds:</strong> Open blocked account if required — <a href="blocked-account-germany.html">Sperrkonto guide</a>.</li>
          <li><strong>Documents:</strong> Academics, translations, insurance, forms — use <a href="../checklist.html?country=de&amp;type=study">Germany checklist</a>.</li>
          <li><strong>Appointment:</strong> Book via the channel your mission uses (often VFS). See <a href="../visa-appointment/germany-visa-appointment-pakistan/">Germany appointment</a>.</li>
          <li><strong>Interview / biometrics & wait:</strong> Answer consistently with your SOP and funds story.</li>
          <li><strong>After decision:</strong> Travel and residence registration steps as instructed.</li>
        </ol>
        <h2>Documents you should expect</h2>
        <p>Passport, photos, admission/contract, academics, funds proof, insurance, motivation letter/CV, application forms, and any APS or attestation steps that apply to your nationality/case. Confirm on <a href="../official-links/#de">German official links</a>.</p>
        <h2>Realistic timeline</h2>
        <p>Many complete files still take <strong>about 4–7 months</strong> end-to-end when you include language, admission and appointment queues. Peak seasons run longer.</p>
        <h2>SK Immigration role</h2>
        <p>Consultation, shortlist, CV/SOP coaching, checklist, attestation sequencing and appointment prep. Details: <a href="../study-visa/germany-study-visa-pakistan/">Germany Study Visa Pakistan</a> · deeper guide: <a href="../blog/germany-student-visa/">blog guide</a>.</p>
`,
    faqs: [
      [
        'How to apply for Germany student visa from Pakistan step by step?',
        'Shortlist and get admission or Ausbildung contract, arrange funds (often blocked account), complete documents, book the national visa appointment, attend biometrics/interview, then wait for the mission decision.',
      ],
      [
        'Do I need German language for a Germany student visa?',
        'For German-taught programs and most Ausbildung roles, yes (often A2–B1+). English-taught degrees may accept IELTS/TOEFL instead — follow the offer letter.',
      ],
      [
        'How much does SK Immigration charge for Germany study support?',
        'Student packages start from published pricing (often from PKR 50,000 for preparation). Embassy and blocked-account fees are separate. No outcome guarantees.',
      ],
    ],
    related: [
      ['blocked-account-germany.html', 'Germany blocked account'],
      ['germany-ausbildung-international.html', 'What is Ausbildung?'],
      ['../study-visa/germany-study-visa-pakistan/', 'Germany Study Visa Pakistan'],
      ['visa-refused-what-next.html', 'If your visa is refused'],
    ],
    nextExtra: `          <li><a href="../study-visa/germany-study-visa-pakistan/">Germany Study Visa Pakistan</a></li>\n`,
  },
  {
    slug: 'how-to-apply-uk-student-visa-pakistan',
    title: 'How to apply for UK student visa from Pakistan step by step?',
    description:
      'UK Student visa from Pakistan step by step: offer, CAS, funds, TB test, GOV.UK application, VFS biometrics, timeline and SK Immigration support.',
    lead: 'The UK route is <strong>CAS-first</strong>: get an offer from a licensed Student sponsor, receive a <a href="uk-student-visa-cas.html">CAS</a>, meet funds and English/TB rules, apply on GOV.UK, then complete biometrics (usually via VFS in Pakistan). UKVI decides the visa.',
    bodyHtml: `
        <h2>Step-by-step</h2>
        <ol>
          <li><strong>Choose a licensed sponsor</strong> and secure an offer.</li>
          <li><strong>Meet conditions</strong> (deposit, documents, English as required).</li>
          <li><strong>Receive CAS</strong> — do not apply before it is issued.</li>
          <li><strong>Arrange funds</strong> to match GOV.UK maintenance rules and CAS tuition figures.</li>
          <li><strong>TB test</strong> from an approved clinic if required for your case.</li>
          <li><strong>Online application + IHS/fees</strong> on GOV.UK.</li>
          <li><strong>Biometrics appointment</strong> — <a href="../visa-appointment/uk-visa-appointment-pakistan/">UK appointment guide</a>.</li>
          <li><strong>Decision & travel</strong> per vignette/eVisa instructions.</li>
        </ol>
        <p>Primary page: <a href="../study-visa/uk-study-visa-pakistan/">UK Study Visa Pakistan</a> · educational guide: <a href="../blog/uk-student-visa/">UK blog guide</a>.</p>
        <h2>Documents checklist (high level)</h2>
        <ul>
          <li>Passport, CAS, offer letter</li>
          <li>Funds evidence with correct day-count</li>
          <li>English evidence if not exempt</li>
          <li>TB certificate when required</li>
          <li>Academic transcripts as the sponsor/UKVI expect</li>
        </ul>
        <p>Interactive list: <a href="../checklist.html?country=gb&amp;type=study">UK study checklist</a> · official: <a href="../official-links/#gb">UK government links</a>.</p>
        <h2>Timeline</h2>
        <p>Plan for offer + CAS first (weeks to months), then visa processing per published UKVI times. Peak intakes fill fast — do not leave funds or TB to the last week.</p>
`,
    faqs: [
      [
        'How to apply for UK student visa from Pakistan step by step?',
        'Get an offer from a licensed sponsor, receive CAS, prepare funds/TB/English evidence, apply on GOV.UK, attend biometrics, then wait for UKVI’s decision.',
      ],
      [
        'Do I need IELTS for a UK student visa?',
        'Many applicants need a Secure English Language Test unless exempt under GOV.UK or sponsor rules. Follow your offer and current guidance.',
      ],
      [
        'What is the biggest UK student visa mistake from Pakistan?',
        'Applying without a valid CAS, or showing funds that fail the maintenance day-count rules.',
      ],
    ],
    related: [
      ['uk-student-visa-cas.html', 'What is CAS?'],
      ['proof-of-funds-student-visa.html', 'Proof of funds'],
      ['../study-visa/uk-study-visa-pakistan/', 'UK Study Visa Pakistan'],
      ['visa-refused-what-next.html', 'If refused'],
    ],
    nextExtra: `          <li><a href="../study-visa/uk-study-visa-pakistan/">UK Study Visa Pakistan</a></li>\n`,
  },
  {
    slug: 'how-to-apply-canada-study-permit-pakistan',
    title: 'How to apply for Canada study permit from Pakistan step by step?',
    description:
      'Canada study permit from Pakistan step by step: DLI offer, funds/GIC, PAL if required, IRCC application, biometrics, medicals, timeline and SK Immigration help.',
    lead: 'From Pakistan: <strong>get a DLI acceptance → arrange funds (often including GIC) → complete IRCC study permit forms → biometrics/medicals as required → wait for a decision</strong>. Confirm whether your intake needs a provincial attestation letter (PAL). IRCC decides; SK Immigration prepares the file.',
    bodyHtml: `
        <h2>Step-by-step</h2>
        <ol>
          <li><strong>Shortlist DLIs</strong> that fit your marks, budget and career goal.</li>
          <li><strong>Receive acceptance</strong> and note conditions (deposit, start date).</li>
          <li><strong>Check PAL / provincial rules</strong> for your intake on IRCC.</li>
          <li><strong>Arrange proof of funds</strong> — see <a href="proof-of-funds-student-visa.html">funds guide</a> and <a href="canada-study-permit-requirements.html">requirements</a>.</li>
          <li><strong>Create IRCC account</strong> and complete the study permit application accurately.</li>
          <li><strong>Biometrics</strong> and medical exam if requested.</li>
          <li><strong>Submit & track</strong>; respond to any additional document requests quickly.</li>
          <li><strong>Travel</strong> only after you have the required approvals/port-of-entry documents.</li>
        </ol>
        <p>Primary page: <a href="../study-visa/canada-study-visa-pakistan/">Canada Study Visa Pakistan</a> · guide: <a href="../blog/canada-student-visa/">Canada blog</a> · appointments: <a href="../visa-appointment/canada-visa-appointment-pakistan/">Canada appointment</a>.</p>
        <h2>Documents to prepare early</h2>
        <ul>
          <li>Passport, photos, acceptance letter</li>
          <li>Tuition payment / deposit receipts</li>
          <li>Bank / GIC evidence and sponsor docs if used</li>
          <li>SOP explaining program choice</li>
          <li>Academics and any required translations/attestations</li>
        </ul>
        <p><a href="../checklist.html?country=ca&amp;type=study">Canada checklist</a> · <a href="../official-links/#ca">IRCC official links</a>.</p>
        <h2>If refused</h2>
        <p>Do not reapply blindly. Follow <a href="visa-refused-what-next.html">refusal next steps</a> and fix the exact IRCC reasons.</p>
`,
    faqs: [
      [
        'How to apply for Canada study permit from Pakistan step by step?',
        'Secure DLI acceptance, arrange funds and any PAL required for your intake, submit the IRCC study permit application, complete biometrics/medicals, then wait for IRCC’s decision.',
      ],
      [
        'How long does Canada study permit take from Pakistan?',
        'Published IRCC times change. Build a buffer of several months around your program start date.',
      ],
      [
        'Can SK Immigration guarantee a Canada study permit?',
        'No. IRCC decides. We help with honest eligibility, documents and application readiness.',
      ],
    ],
    related: [
      ['canada-study-permit-requirements.html', 'Canada study permit requirements'],
      ['proof-of-funds-student-visa.html', 'Proof of funds'],
      ['../study-visa/canada-study-visa-pakistan/', 'Canada Study Visa Pakistan'],
      ['visa-refused-what-next.html', 'If refused'],
    ],
    nextExtra: `          <li><a href="../study-visa/canada-study-visa-pakistan/">Canada Study Visa Pakistan</a></li>\n`,
  },
];

const indexPath = path.join(ROOT, 'assets/data/answers-index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

for (const p of PAGES) {
  const html = page(p);
  fs.writeFileSync(path.join(ROOT, 'answers', `${p.slug}.html`), html);
  const words = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  console.log(words, p.slug);

  const entry = index.find((x) => x.slug === p.slug);
  if (entry) {
    // Keep short for hub cards — first ~220 chars of lead plain text
    const plain = p.lead.replace(/<[^>]+>/g, '');
    entry.short = plain.length > 220 ? plain.slice(0, 217) + '…' : plain;
  }
}

fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
console.log('Updated answers-index.json shorts');
console.log('Done', PAGES.length, 'pages');
