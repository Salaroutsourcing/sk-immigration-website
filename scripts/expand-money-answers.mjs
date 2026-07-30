#!/usr/bin/env node
/** Append unique depth sections to Phase-3 answer pages (before <h2>FAQ). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const EXTRA = {
  'study-europe-without-ielts': `
        <h2>Admission language vs visa credibility</h2>
        <p>Universities decide admission language; missions decide whether your story is believable. An MOI waiver can get you an offer and still leave the visa weak if you cannot discuss the course in English (or the local language) at appointment. SK Immigration checks both layers before you pay deposits or book VFS.</p>
        <p>If your last English-medium schooling was years ago, or your marks in English were weak, plan a test even when a campus “accepts MOI.” A moderate IELTS score often strengthens credibility more than arguing about Facebook screenshots.</p>

        <h2>When we recommend sitting IELTS anyway</h2>
        <ul>
          <li>UK, Australia, many Canadian and Dutch English degrees with published score floors</li>
          <li>Competitive scholarships that shortlist on standardized scores</li>
          <li>Prior refusals that mentioned language or study purpose</li>
          <li>Career plans that need globally portable English proof later</li>
        </ul>

        <h2>Without-IELTS pathways that are often misunderstood</h2>
        <ul>
          <li><strong>Germany Ausbildung:</strong> usually needs German, not “no language”</li>
          <li><strong>France:</strong> Campus France + program language rules; French-taught ≠ IELTS waiver magic</li>
          <li><strong>Italy:</strong> Universitaly timing still applies when language is waived</li>
          <li><strong>Malaysia / Turkey:</strong> useful for some budgets, but they are not Schengen residence pathways</li>
        </ul>

        <h2>Document pack when IELTS is waived</h2>
        <ol>
          <li>Offer letter stating the accepted language evidence (MOI / internal test / prior degree)</li>
          <li>MOI on university letterhead with dates, medium, and registrar contacts — or the school’s own English test result</li>
          <li>Funds and attestation that match the destination checklist</li>
          <li>SOP that explains academic logic without copying a “Europe without IELTS” template</li>
        </ol>

        <h2>Cost reality (Pakistan applicants)</h2>
        <p>Skipping IELTS can save exam fees, but a wrong deposit to an unrecognized college costs far more. Budget for: application fees, attestation, living-funds proof, insurance, VFS/mission fees, and SK Immigration preparation (student packages from PKR 50,000). Authority fees are never “included” in a visa guarantee — we do not sell guarantees.</p>

        <h2>Week-one action plan</h2>
        <ol>
          <li>Take the <a href="../eligibility.html">eligibility quiz</a> and note language gaps</li>
          <li>Open two country landers (for example <a href="../study-visa/hungary-study-visa-pakistan/">Hungary</a> and <a href="../study-visa/poland-study-visa-pakistan/">Poland</a>) and compare published language lines</li>
          <li>Message WhatsApp +92 304 5999859 with marks, budget and whether you already hold MOI</li>
          <li>Do not pay a “seat” until the language clause is in writing</li>
        </ol>
`,
  'best-study-visa-consultant-rawalpindi': `
        <h2>What “best in Rawalpindi” should mean in practice</h2>
        <p>Rawalpindi and Islamabad students are flooded with Facebook ads. Rank consultants by process quality: do they open official links with you, refuse fake guarantees, and put fees in writing? A Satellite Town walk-in office matters when documents need in-person checks; WhatsApp matters when you study in another city.</p>

        <h2>Visit the office — what to bring</h2>
        <ul>
          <li>Recent marksheets / degree scans</li>
          <li>Passport bio page</li>
          <li>Rough budget (tuition + living + family support)</li>
          <li>IELTS/MOI status (or “not yet”)</li>
          <li>Any prior refusal letters (do not hide them)</li>
        </ul>
        <p>Address: Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi. Hours Mon–Sat 10:00–19:00. Map via <a href="../about.html">About / NAP</a>.</p>

        <h2>How a typical SK Immigration study file runs</h2>
        <ol>
          <li>Free consult — pathway realism (Europe vs UK/Canada vs “not yet”)</li>
          <li>Shortlist 2–4 programs that match marks and budget</li>
          <li>Checklist mapped to embassy-linked sources</li>
          <li>Attestation order so you do not pay stamps twice</li>
          <li>SOP / funds coaching; appointment only when ready</li>
        </ol>

        <h2>Fees transparency</h2>
        <p>Student preparation packages start from <strong>PKR 50,000</strong>. University deposits, blocked accounts, VFS and embassy fees are separate. Ask for a written scope before transferring money. See <a href="../pricing.html">pricing</a>.</p>

        <h2>Nearby cities we already support</h2>
        <p>Islamabad clients often visit the same office. Lahore and Karachi clients use WhatsApp + document courier patterns. Local pages: <a href="../local/islamabad-study-visa-consultant/">Islamabad</a> · <a href="../local/lahore-study-visa-consultant/">Lahore</a> · <a href="../local/karachi-study-visa-consultant/">Karachi</a>.</p>

        <h2>Trust links to verify before you hire anyone</h2>
        <ul>
          <li><a href="https://leap.secp.gov.pk/#/verify-company-info/0304985" target="_blank" rel="noopener">SECP CUIN 0304985</a></li>
          <li><a href="../about.html">Company details and Google Business checklist</a></li>
          <li><a href="no-visa-guarantee-why.html">Why we never sell visa guarantees</a></li>
        </ul>
`,
  'best-study-visa-consultant-pakistan': `
        <h2>Pakistan market reality in 2026</h2>
        <p>Search results for “best study visa consultant Pakistan” are noisy: sponsored posts, cloned websites, and overseas call centres. Treat every claim as unverified until you see registration details, a fee invoice pattern, and a sample checklist that matches a real embassy page.</p>

        <h2>City-by-city note</h2>
        <ul>
          <li><strong>Rawalpindi / Islamabad:</strong> walk-in possible at SK Immigration Satellite Town office</li>
          <li><strong>Lahore / Karachi / other cities:</strong> same consultants via WhatsApp with structured document uploads</li>
          <li><strong>Overseas Pakistanis:</strong> remote file prep still needs Pakistani attestation sequencing for many destinations</li>
        </ul>

        <h2>Questions to ask any consultant (including us)</h2>
        <ol>
          <li>What is your legal company name and registration number?</li>
          <li>What exactly is included in the service fee vs university/embassy fees?</li>
          <li>Will you put “no visa guarantee” in writing?</li>
          <li>Which official page are you using for this country’s funds rule?</li>
          <li>What happens if my profile is weak — refund policy and honest alternatives?</li>
        </ol>

        <h2>How SK Immigration differentiates</h2>
        <p>We publish long-form country landers under <a href="../study-visa/">/study-visa/</a>, visit and work hubs, an <a href="../answers.html">Answers hub</a> for AI-style questions, and tools (quiz, checklist, calculator). That public knowledge base is deliberate: clients and search engines can verify our process before paying.</p>

        <h2>Popular study destinations we file from Pakistan</h2>
        <p><a href="../study-visa/germany-study-visa-pakistan/">Germany</a> · <a href="../study-visa/hungary-study-visa-pakistan/">Hungary</a> · <a href="../study-visa/poland-study-visa-pakistan/">Poland</a> · <a href="../study-visa/italy-study-visa-pakistan/">Italy</a> · <a href="../study-visa/uk-study-visa-pakistan/">UK</a> · <a href="../study-visa/canada-study-visa-pakistan/">Canada</a> · plus wider Europe and Asia pages on the hub.</p>

        <h2>Start without pressure</h2>
        <p>Free first consultation. WhatsApp +92 304 5999859. If we believe a route is weak, we say so — even when that means no package sale this month.</p>
`,
  'blocked-account-germany': `
        <h2>Who needs a Sperrkonto — and who might not</h2>
        <ul>
          <li><strong>Usually yes:</strong> degree students and many language+study pathways showing living funds the classic way</li>
          <li><strong>Often different:</strong> Ausbildung trainees proving salary in a training contract</li>
          <li><strong>Sometimes alternative:</strong> formal obligation (Verpflichtungserklärung) or scholarship letters that missions accept — rare and document-heavy</li>
        </ul>
        <p>SK Immigration confirms the category <em>before</em> you wire life savings to a provider that does not match your visa type.</p>

        <h2>Timing relative to admission</h2>
        <p>Do not open a blocked account the day a random agent demands a deposit. Ideal sequence: realistic admission/contract → confirm current amount on official guidance → open provider → receive confirmation letter → book national-visa appointment. Opening too early locks money while your offer is still uncertain; opening too late misses appointment slots.</p>

        <h2>Transfer tips from Pakistan</h2>
        <ul>
          <li>Use banking channels that produce clear SWIFT / remittance evidence</li>
          <li>Name on the German account confirmation must align with passport naming</li>
          <li>Keep every receipt for the visa file and for activation after arrival</li>
          <li>Ask the provider how confirmation letters are issued for Islamabad / visa centre use</li>
        </ul>

        <h2>After you arrive in Germany</h2>
        <p>Activation rules differ by provider. Plan address registration and unblocking steps so you can withdraw the monthly living amount legally. Running out of accessible funds in month one is an avoidable crisis.</p>

        <h2>Related Germany cluster</h2>
        <p><a href="../study-visa/germany-study-visa-pakistan/">Germany study lander</a> · <a href="how-to-apply-germany-student-visa-pakistan.html">How to apply</a> · <a href="../ausbildung.html">Ausbildung</a> · <a href="../official-links/#de">Official DE links</a> · checklist <a href="../checklist.html?country=de&amp;type=study">here</a>.</p>
`,
  'schengen-student-visa-refusal-reasons': `
        <h2>Purpose and “immigration intention” wording</h2>
        <p>Missions refuse when the file looks like labour migration disguised as study: vague courses, no academic fit, or family already abroad with no study logic. Your SOP should explain modules, career path in Pakistan or a lawful post-study plan — not “I will settle in Europe.”</p>

        <h2>Funds refusals — deeper than “low balance”</h2>
        <ul>
          <li>Balance high but history empty</li>
          <li>Sponsor unaffordable relative to declared income</li>
          <li>Tuition unpaid with no loan/scholarship paper</li>
          <li>Currency conversion mistakes vs the checklist year’s requirement</li>
        </ul>

        <h2>Document integrity issues</h2>
        <p>Name mismatches across IBCC/HEC/passport, untranslated pages, or attestation from the wrong ministry trigger doubt. Fix the chain once with <a href="apostille-vs-mofa-vs-musadaqa.html">Apostille vs MOFA vs Musadaqa</a> guidance before reapplying.</p>

        <h2>After refusal — 30-day rebuild plan</h2>
        <ol>
          <li>Translate the refusal into a checklist of fixes</li>
          <li>Rebuild funds for 4–8+ weeks if history was the issue</li>
          <li>Re-verify the university recognition and language line</li>
          <li>Rewrite SOP against the actual program</li>
          <li>Only then book a new appointment</li>
        </ol>

        <h2>When to change country instead of reapplying</h2>
        <p>If the offer itself is weak or unaffordable, a cleaner Hungary/Poland/Germany path (or a delayed intake) beats three refusals on the same thin college. SK Immigration will say this directly in consult.</p>
`,
  'proof-of-funds-student-visa': `
        <h2>Building a clean 6-month trail from Pakistan</h2>
        <p>Start early. Salary credits, business deposits and documented gifts should appear as a pattern. If parents will sponsor, move money in visible steps with relationship proof (affidavit + IDs + their bank income) rather than a single ATM dump the week of appointment.</p>

        <h2>Education loans and scholarships</h2>
        <ul>
          <li>Loans: include sanction letter, disbursement conditions, and what remains payable as tuition</li>
          <li>Scholarships: official award letters with amounts and duration; partial awards still need remaining funds proof</li>
          <li>Never invent a scholarship PDF — missions verify</li>
        </ul>

        <h2>Currency and fee letters</h2>
        <p>Align your evidence to the currency and fee schedule on the offer letter for that intake. Outdated fee screenshots cause under-funding. Recalculate when the university issues a new invoice.</p>

        <h2>Dependants</h2>
        <p>Bringing spouse/children multiplies maintenance rules on routes that allow dependants (for example some UK student cases). Most first-time Schengen student filers from Pakistan apply alone first — confirm category rules before promising family travel.</p>

        <h2>SK Immigration funds review</h2>
        <p>Send 6 months of statements (password-removed PDF) on WhatsApp for a credibility read before you pay embassy fees. We would rather delay an appointment than watch a preventable refusal. Use <a href="../calculator.html">cost calculator</a> for rough planning, then verify official figures.</p>
`,
  'saudi-work-visa-processing-15000': `
        <h2>Why we emphasise “complete processing”</h2>
        <p>Many ads sell “E-Number only” cheaply, then surprise clients with protector and visa steps. Our PKR 15,000 package is scoped to walk eligible employment cases through the coordination steps clients actually need — with a written split between SK service fee and authority fees.</p>

        <h2>Typical client journey</h2>
        <ol>
          <li>WhatsApp / office triage — passport validity, prior Gulf history, contract papers</li>
          <li>Quote sheet — PKR 15,000 scope + estimated third-party costs</li>
          <li>Biometrics / E-Number scheduling support</li>
          <li>Protector pathway when overseas employment rules require it</li>
          <li>Visa processing support to stamping / issuance as applicable</li>
          <li>Travel readiness notes (still subject to authority timelines)</li>
        </ol>

        <h2>Documents commonly requested</h2>
        <ul>
          <li>Passport with required blank pages / validity</li>
          <li>Photos to Saudi specifications for your case</li>
          <li>Employment contract / visa authorisation papers from the Saudi side</li>
          <li>CNIC and any prior iqama/visa history details</li>
          <li>Medicals only through approved channels when instructed</li>
        </ul>

        <h2>Compliance note</h2>
        <p>Where Pakistani overseas employment law requires licensed OEP involvement, we align with partner licence processes (see <a href="oep-partner-licence-1061.html">OEP licence note</a>). Skipping protector because a broker is impatient is how people get stranded.</p>

        <h2>Book a fit-check</h2>
        <p>Free consult before payment: WhatsApp +92 304 5999859 · <a href="../saudi-visa/saudi-visa-processing-pakistan/">full processing page</a> · <a href="../pricing.html">pricing</a>.</p>
`,
  'how-to-apply-germany-student-visa-pakistan': `
        <h2>Choosing degree vs Ausbildung before forms</h2>
        <p>If your German is below the Ausbildung workplace level, forcing a nursing Ausbildung file wastes months. If your marks do not support a competitive English Master, a “any university admission” PDF will not save the visa. SK Immigration’s free consult exists to stop the wrong first payment.</p>

        <h2>APS and academics — plan early</h2>
        <p>Some pathways require APS or specific attestation orders for Pakistani credentials. Start document legalization while applications run — not after you receive an appointment SMS. Cross-check <a href="apostille-vs-mofa-vs-musadaqa.html">attestation types</a> and German embassy notices via <a href="../official-links/#de">official links</a>.</p>

        <h2>Motivation letter that survives reading</h2>
        <ul>
          <li>Name the university, city and program modules</li>
          <li>Connect prior subjects/work to the degree or training</li>
          <li>Explain funding source in one clear paragraph</li>
          <li>Avoid copy-paste “Germany is rich in culture” essays</li>
        </ul>

        <h2>Appointment day kit</h2>
        <ol>
          <li>Passport + copies as listed</li>
          <li>Admission/contract + funds confirmation</li>
          <li>Insurance evidence meeting rules</li>
          <li>Academic set + translations</li>
          <li>Forms signed consistently with online data</li>
        </ol>

        <h2>After refusal or delay</h2>
        <p>If refused, read <a href="schengen-student-visa-refusal-reasons.html">refusal reasons</a> and <a href="visa-refused-what-next.html">what next</a>. If delayed, do not open duplicate blocked accounts “just in case” without advice — you can freeze cash unnecessarily.</p>
`,
};

const LANDER_EXTRA = {
  'visit-visa/schengen-visit-visa-pakistan/index.html': `
        <h2>Sample 7-day tourism evidence set</h2>
        <ul>
          <li>Day-by-day city plan matching hotel bookings</li>
          <li>Return flight reservation (understand cancellation rules — do not buy non-refundable blindly)</li>
          <li>Travel insurance covering the full Schengen period</li>
          <li>Employer NOC / leave letter with joining date back at work</li>
          <li>6 months bank statements + salary slips</li>
        </ul>
        <h2>Multi-country itineraries</h2>
        <p>If you will visit France and Italy, apply where you spend the most nights (or main purpose country). Split itineraries that look engineered only to chase a “weaker” visa centre are a known risk pattern.</p>
        <h2>First-time travellers from Pakistan</h2>
        <p>No prior visas is not an automatic refusal, but ties and funds must be stronger and clearer. Prior Schengen/UK/USA visas used correctly help; unexplained gaps hurt.</p>
`,
  'visit-visa/dubai-visit-visa-pakistan/index.html': `
        <h2>Choosing a visit product without overpaying</h2>
        <p>Airline + hotel bundles, sponsor visas and different durations each have document quirks. SK Immigration maps the product to your passport history and trip purpose before you pay a package seller on Instagram.</p>
        <h2>Employment seekers — read this</h2>
        <p>Arriving on visit status to “find a job” can breach conditions and damage future filings. If recruitment is the goal, discuss <a href="../../work-permit/uae-work-visa-pakistan/">UAE work</a> or Saudi complete processing instead.</p>
        <h2>Family travel with children</h2>
        <p>Carry relationship evidence and align exit dates. Schools leave letters help show return intent for parents employed in Pakistan.</p>
`,
  'study-visa/canada-study-visa-pakistan/index.html': `
        <h2>Study plan / SOP structure IRCC readers expect</h2>
        <ol>
          <li>Past education and any gap explanation</li>
          <li>Why this program and DLI — not “Canada is great”</li>
          <li>How you afford year one</li>
          <li>Ties to Pakistan and post-study intent that stays lawful</li>
        </ol>
        <p>We edit SOPs against your real transcript — template essays are easy to spot.</p>
`,
  'study-visa/italy-study-visa-pakistan/index.html': `
        <h2>Intake calendar habits that save files</h2>
        <p>Italian intakes fill portal steps early. Build a reverse calendar from the embassy appointment backward through Universitaly, translations and funds. Missing one portal status can idle an otherwise complete paper file.</p>
`,
  'study-visa/poland-study-visa-pakistan/index.html': `
        <h2>Medical and other popular programs</h2>
        <p>Medicine and related fields attract aggressive agents. Demand recognition clarity, fee schedules on university domains, and refund rules in writing. SK Immigration will walk away from campuses we cannot document.</p>
`,
  'visit-visa/uk-visit-visa-pakistan/index.html': `
        <h2>Cover letter structure that helps UKVI</h2>
        <ul>
          <li>Who you are and what you do in Pakistan</li>
          <li>Exact travel dates and where you stay</li>
          <li>Who pays and how the bank trail shows it</li>
          <li>Why you will return (job, business, dependents)</li>
        </ul>
`,
  'visit-visa/usa-visit-visa-pakistan/index.html': `
        <h2>Practice interview — sample themes</h2>
        <ul>
          <li>What is your job and monthly income?</li>
          <li>Who is paying for this trip?</li>
          <li>How long will you stay and why that duration?</li>
          <li>What ties do you have in Pakistan?</li>
          <li>Have you been refused a visa before?</li>
        </ul>
        <p>Answer briefly and truthfully. Over-talking invented details is worse than a short honest answer.</p>
`,
  'saudi-visa/saudi-visa-processing-pakistan/index.html': `
        <h2>Timeline expectations</h2>
        <p>Complete Saudi processing time depends on medical slots, system queues and employer-side authorisations. We give ranges after seeing your papers — not fake “3-day guarantee” ads.</p>
`,
  'work-permit/germany-work-permit-pakistan/index.html': `
        <h2>CV and contract review before you pay recognition fees</h2>
        <p>Send the draft employment contract and your credential scans. We flag missing recognition steps and language gaps before you spend on translations you may not need yet.</p>
`,
};

function injectBeforeFaq(html, extra) {
  if (html.includes('<!-- money-extra -->')) {
    return html.replace(/<!-- money-extra -->[\s\S]*?<!-- \/money-extra -->/, `<!-- money-extra -->${extra}<!-- /money-extra -->`);
  }
  if (html.includes('<h2>FAQ</h2>')) {
    return html.replace('<h2>FAQ</h2>', `<!-- money-extra -->${extra}<!-- /money-extra -->\n        <h2>FAQ</h2>`);
  }
  return html;
}

function injectLander(html, extra) {
  if (html.includes('<!-- money-extra -->')) {
    return html.replace(/<!-- money-extra -->[\s\S]*?<!-- \/money-extra -->/, `<!-- money-extra -->${extra}<!-- /money-extra -->`);
  }
  return html.replace(
    '<!-- /lander-depth -->',
    `<!-- money-extra -->${extra}<!-- /money-extra -->\n<!-- /lander-depth -->`
  );
}

let n = 0;
for (const [slug, extra] of Object.entries(EXTRA)) {
  const file = path.join(ROOT, 'answers', `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  html = injectBeforeFaq(html, extra);
  fs.writeFileSync(file, html);
  console.log('expanded answer', slug);
  n++;
}
for (const [rel, extra] of Object.entries(LANDER_EXTRA)) {
  const file = path.join(ROOT, rel);
  let html = fs.readFileSync(file, 'utf8');
  html = injectLander(html, extra);
  fs.writeFileSync(file, html);
  console.log('expanded lander', rel);
  n++;
}
console.log('Expanded', n, 'files');
