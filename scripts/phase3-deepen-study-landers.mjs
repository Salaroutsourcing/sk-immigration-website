#!/usr/bin/env node
/**
 * Phase 3 — deepen priority study-visa landers with unique, hedged content.
 * Does NOT invent exact embassy fees or fixed approval rates.
 * Replaces <!-- lander-depth --> ... <!-- /lander-depth --> blocks.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'public');
const TODAY = '2026-08-22';

const BLOCKS = {
  'germany-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>APS, blocked account and language — the three decisions</h2>
        <p>Most Pakistan degree files stall on sequencing, not on “luck.” Confirm whether your pathway needs <strong>APS</strong>, which funding proof the mission currently accepts (often a blocked account / Sperrkonto for classic study), and whether your programme needs German, English, or both. Ausbildung files usually rest on a training contract + German level — not a student blocked account.</p>
        <table>
          <thead><tr><th>Checkpoint</th><th>What to verify this week</th></tr></thead>
          <tbody>
            <tr><td>APS Pakistan</td><td>Whether your degree pathway requires APS before or with admission — queues change; do not book VFS empty-handed</td></tr>
            <tr><td>Funds</td><td>Current blocked-account amount / accepted alternatives on official embassy / Make-it-in-Germany guidance</td></tr>
            <tr><td>Language</td><td>Offer letter language clause vs Ausbildung employer German level (often A2–B1+, higher for nursing)</td></tr>
            <tr><td>Documents</td><td>Name consistency, translations, attestation order</td></tr>
          </tbody>
        </table>
        <p>Related: <a href="../../answers/blocked-account-germany.html">Blocked account guide</a> · <a href="../../ausbildung.html">Ausbildung</a> · <a href="../../official-links/#de">Official Germany links</a>. Amounts and forms change — always re-check official pages before paying.</p>
<!-- /lander-depth -->`,

  'hungary-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Why Pakistani students shortlist Hungary</h2>
        <p>Hungary is often compared with Poland and Czech Republic for English-taught programmes and a Schengen long-stay student process that can fit mid-range budgets — <em>when</em> the university is real, fees are paid to the school (not only an agent), and funds are explainable.</p>
        <table>
          <thead><tr><th>Topic</th><th>What to check before you pay</th></tr></thead>
          <tbody>
            <tr><td>University recognition</td><td>Program appears on the university site; fee letter matches; avoid broker-only PDFs</td></tr>
            <tr><td>IELTS / MOI</td><td>Confirm the written language rule on the offer (IELTS, university test, or MOI)</td></tr>
            <tr><td>Funds</td><td>Tuition + living for the period the mission asks; sponsor trail must be clear</td></tr>
            <tr><td>Attestation</td><td>HEC / MOFA / legalization order for your document type</td></tr>
            <tr><td>Appointment</td><td>Complete file first — VFS Hungary Pakistan queues reward preparation</td></tr>
          </tbody>
        </table>
        <h2>Hungary vs Poland vs Czech (planning compare)</h2>
        <ul>
          <li><strong>Hungary:</strong> Strong interest in medicine-related and English degrees; watch recognition and deposits</li>
          <li><strong>Poland:</strong> Broad English-program market; purpose + funds still decide visas</li>
          <li><strong>Czech Republic:</strong> Language and recognition planning matter; not automatically “easier”</li>
        </ul>
        <p>Read <a href="../../answers/hungary-vs-poland-student-visa.html">Hungary vs Poland</a> · <a href="../../official-links/#hu">Official Hungary links</a> · <a href="https://studyinhungary.hu/" target="_blank" rel="noopener noreferrer">Study in Hungary</a>.</p>
        <h2>Mistakes we see on Hungary files</h2>
        <ul>
          <li>Large deposits to unverified agents before confirming the university</li>
          <li>Assuming “no IELTS” without written university acceptance of MOI</li>
          <li>One-month bank spikes that cannot be explained</li>
          <li>SOPs that never mention Hungary or the faculty</li>
          <li>Confusing a short Schengen visit with a long-stay student residence</li>
        </ul>
<!-- /lander-depth -->`,

  'italy-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Italy study pathway from Pakistan — Universitaly first</h2>
        <p>Italy is not a “print offer and run to VFS” destination. Many non-EU degree applicants need the correct pre-enrolment / <strong>Universitaly</strong> (or university-portal) steps before a national study visa file is credible. SK Immigration sequences admission paperwork, attestation and appointment timing; the Italian mission decides.</p>
        <h2>Who Italy suits</h2>
        <ul>
          <li>Students targeting public or private Italian universities with a clear programme match</li>
          <li>Applicants ready to follow portal steps and document legalization carefully</li>
          <li>Profiles that can show tuition + living funds without relying on illegal work stories</li>
        </ul>
        <h2>Process map (high level — verify current portals)</h2>
        <ol>
          <li>Programme shortlist and academic fit check</li>
          <li>University application / admission evidence</li>
          <li>Pre-enrolment or portal steps required for your nationality and intake</li>
          <li>Funds, insurance, housing evidence as listed by the mission</li>
          <li>Visa appointment / biometrics — complete file first</li>
        </ol>
        <h2>Language &amp; IELTS</h2>
        <p>Italian-taught programmes usually need Italian language evidence; English-taught programmes may ask IELTS/TOEFL or university English proof. Do not assume MOI is enough unless the university states it in writing.</p>
        <h2>Pakistan-specific pitfalls</h2>
        <ul>
          <li>Skipping Universitaly / pre-enrolment when your case type requires it</li>
          <li>Unattested or inconsistently named academics</li>
          <li>Funds that cover only tuition screenshots, not living</li>
          <li>Booking VFS before portal status is clear</li>
        </ul>
        <p>Official starting points: <a href="../../official-links/#it">Italy official links</a> · checklist <a href="../../checklist.html?country=it&amp;type=study">Italy study checklist</a>.</p>
<!-- /lander-depth -->`,

  'poland-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Poland study visa from Pakistan — purpose, funds, recognition</h2>
        <p>Poland attracts Pakistani students with English-taught programmes and mid-range living costs compared with UK/Canada. Visas still fail when the university is weak, the study purpose is unclear, or funds look borrowed for one month.</p>
        <h2>Eligibility reality check</h2>
        <ul>
          <li>Admission / acceptance from a recognized Polish institution</li>
          <li>Proof of funds and tuition plan matching mission guidance</li>
          <li>Health insurance and accommodation evidence when requested</li>
          <li>Language evidence matching the programme (IELTS, MOI, or university test — only if accepted in writing)</li>
        </ul>
        <h2>How files usually move</h2>
        <ol>
          <li>Honest shortlist (field + city + fee reality)</li>
          <li>University applications and fee letters</li>
          <li>Attestation / translations as required</li>
          <li>National student visa / residence documentation package</li>
          <li>Appointment and decision — authorities decide</li>
        </ol>
        <h2>Work while studying</h2>
        <p>Student work rights exist under Polish rules but change and are not a substitute for proof of funds. Plan finances as if work income is zero until you verify current limits on official pages.</p>
        <h2>Common refusal risks</h2>
        <ul>
          <li>Unrecognized or unclear colleges</li>
          <li>SOP that could be written for any country</li>
          <li>Unexplained sponsor money</li>
          <li>Assuming “Europe no IELTS” without a written language clause</li>
        </ul>
        <p>Compare with <a href="../../study-visa/hungary-study-visa-pakistan/">Hungary</a> · <a href="../../official-links/#pl">Official Poland links</a>.</p>
<!-- /lander-depth -->`,

  'france-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>France study from Pakistan — Campus France logic</h2>
        <p>France is attractive for public-university tuition structures and English-taught master’s options, but Pakistani applicants usually need to respect <strong>Campus France / Études en France</strong> procedures (where applicable) before a long-stay student visa file is strong. SK Immigration helps with sequencing; French authorities decide.</p>
        <h2>Who should consider France</h2>
        <ul>
          <li>Students with a coherent academic progression into a French programme</li>
          <li>Applicants ready for portal interviews / procedures when required</li>
          <li>Budgets that include living costs (Paris is materially higher than many other cities)</li>
        </ul>
        <h2>Language reality</h2>
        <p>French-taught programmes typically need French tests (e.g. TCF/TEF/DELF pathways — confirm current university rules). English-taught programmes may ask IELTS/TOEFL or equivalent. “No IELTS” marketing is meaningless without the programme’s written rule.</p>
        <h2>Process outline</h2>
        <ol>
          <li>Programme shortlist + academic fit</li>
          <li>Campus France / university application steps for your intake</li>
          <li>Acceptance / registration evidence</li>
          <li>Funds, insurance, housing proofs as listed</li>
          <li>Visa appointment — complete file first</li>
        </ol>
        <h2>Mistakes to avoid</h2>
        <ul>
          <li>Ignoring Campus France when your case requires it</li>
          <li>Underestimating living costs outside tuition</li>
          <li>Weak ties between past studies and the chosen master’s</li>
          <li>Paying unofficial “guaranteed visa” sellers</li>
        </ul>
        <p>Start here: <a href="../../official-links/#fr">Official France links</a> · <a href="../../checklist.html?country=fr&amp;type=study">France checklist</a> · <a href="../../blog/france-student-visa/">France guide</a>.</p>
<!-- /lander-depth -->`,

  'uk-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>UK Student visa from Pakistan — CAS, maintenance, credibility</h2>
        <p>A UK Student visa file is built around a Confirmation of Acceptance for Studies (<strong>CAS</strong>) from a licensed sponsor, maintenance funds rules, and a credible study story. SK Immigration prepares packaging and interview readiness; <strong>UKVI</strong> decides.</p>
        <h2>Core building blocks</h2>
        <ul>
          <li>Offer + CAS from a licensed student sponsor</li>
          <li>Tuition and maintenance funds held correctly for the required period (verify current UKVI guidance — do not rely on WhatsApp screenshots)</li>
          <li>English language evidence meeting the course / UKVI route rules</li>
          <li>TB test and other biometrics / identity steps when required for Pakistan applicants</li>
        </ul>
        <h2>Process map</h2>
        <ol>
          <li>University shortlist and application</li>
          <li>Offer conditions cleared → CAS</li>
          <li>Funds timing and document packaging</li>
          <li>Online application + biometrics</li>
          <li>Decision and travel readiness</li>
        </ol>
        <h2>IELTS / English</h2>
        <p>Many courses require Secure English Language Tests at stated levels. Some applicants may meet English another way under UKVI/university rules — confirm on the CAS/offer, not from generic blogs.</p>
        <h2>High-risk mistakes</h2>
        <ul>
          <li>Depositing funds too late or moving money in unexplained lumps</li>
          <li>Course hopping without academic logic</li>
          <li>Using an unlicensed “sponsor” story</li>
          <li>Treating visit visas as a backdoor to study a full degree</li>
        </ul>
        <p>Official: <a href="../../official-links/#uk">UK official links</a> · <a href="../../answers/uk-student-visa-cas.html">CAS answer</a> · <a href="../../checklist.html?country=uk&amp;type=study">UK checklist</a>.</p>
<!-- /lander-depth -->`,

  'canada-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Canada study permit from Pakistan — DLI, funds, intent</h2>
        <p>Canada study files succeed when the school is a designated learning institution (<strong>DLI</strong>), the programme makes sense for your history, and funds/intent are consistent. IRCC decides every study permit; SK Immigration prepares documents and honest risk review.</p>
        <h2>What you typically need</h2>
        <ul>
          <li>Letter of acceptance from a DLI</li>
          <li>Proof of funds for tuition + living (and GIC where your pathway uses one — verify current programme rules)</li>
          <li>Language results if the school/IRCC pathway requires them</li>
          <li>SOP / study plan that explains Canada specifically</li>
          <li>Biometrics and medicals when requested</li>
        </ul>
        <h2>Process outline</h2>
        <ol>
          <li>DLI shortlist and applications</li>
          <li>Acceptance + deposit planning</li>
          <li>Funds packaging (history matters more than a one-day balance)</li>
          <li>Study permit application + biometrics</li>
          <li>Decision and travel / PAL or province-specific steps when applicable — verify current IRCC pages</li>
        </ol>
        <h2>Common refusal themes we coach against</h2>
        <ul>
          <li>Programme mismatch with prior academics or career story</li>
          <li>Funds that appear borrowed or unexplained</li>
          <li>Weak home ties / unclear post-study intent narrative</li>
          <li>Agents promising “guaranteed Canada visa”</li>
        </ul>
        <p>Verify on <a href="../../official-links/#ca">official Canada links</a> · <a href="../../answers/canada-study-permit-requirements.html">study permit answer</a> · <a href="../../checklist.html?country=ca&amp;type=study">Canada checklist</a>.</p>
<!-- /lander-depth -->`,

  'australia-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Australia Student visa (subclass 500) from Pakistan</h2>
        <p>Australia’s student pathway centres on a Confirmation of Enrolment (<strong>CoE</strong>), Genuine Student (GS) evidence, English, Overseas Student Health Cover (<strong>OSHC</strong>), and financial capacity. The Department of Home Affairs decides; SK Immigration builds structured evidence — not guarantees.</p>
        <h2>Who can apply (practical view)</h2>
        <ul>
          <li>Applicants with a CoE from a CRICOS-registered provider for the intended course</li>
          <li>Students who can explain why this course and Australia fit their background</li>
          <li>Applicants who can show funds and OSHC as currently required</li>
        </ul>
        <h2>Document &amp; evidence focus</h2>
        <ul>
          <li>Offer letter → CoE</li>
          <li>GS statement tied to real academics and career logic</li>
          <li>English test results meeting the course / visa settings for your case</li>
          <li>Financial evidence that can be traced and explained</li>
          <li>OSHC certificate and health examinations when required</li>
        </ul>
        <h2>Process from Pakistan</h2>
        <ol>
          <li>Provider/course shortlist (avoid random course hopping)</li>
          <li>Offer and CoE</li>
          <li>GS + funds packaging</li>
          <li>ImmiAccount lodgement, biometrics/health as requested</li>
          <li>Decision and pre-departure</li>
        </ol>
        <h2>Mistakes that damage GS credibility</h2>
        <ul>
          <li>Generic statements copied from the internet</li>
          <li>Unexplained large deposits</li>
          <li>Changing courses without a clear reason</li>
          <li>Ignoring health exam timing</li>
        </ul>
        <p>Official: <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500" target="_blank" rel="noopener noreferrer">Student visa (500)</a> · <a href="../../official-links/#au">All Australia links</a> · <a href="../../checklist.html?country=au&amp;type=study">Australia checklist</a>.</p>
<!-- /lander-depth -->`,

  'usa-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>USA F-1 study pathway from Pakistan</h2>
        <p>A typical US degree pathway uses an I-20 from a SEVP-certified school, SEVIS fee payment, DS-160, and a consular interview. Consular officers decide every F-1 case; SK Immigration prepares documents and interview consistency — never outcome guarantees.</p>
        <h2>Building blocks</h2>
        <ul>
          <li>Admission and Form I-20</li>
          <li>SEVIS (I-901) fee payment evidence</li>
          <li>Proof of funds covering tuition and living as shown on the I-20</li>
          <li>Academic records and test scores required by the school (TOEFL/IELTS/Duolingo — whatever the university states)</li>
          <li>DS-160 + interview appointment</li>
        </ul>
        <h2>Process map</h2>
        <ol>
          <li>University applications and scholarships/assistantships where relevant</li>
          <li>I-20 issuance after deposits/conditions</li>
          <li>SEVIS fee + DS-160</li>
          <li>Interview prep (ties, programme fit, funding clarity)</li>
          <li>Decision and travel / SEVIS registration planning</li>
        </ol>
        <h2>Interview focus areas</h2>
        <ul>
          <li>Why this university and major</li>
          <li>Who pays and how funds were earned</li>
          <li>Plans after graduation (honest temporary-intent framing under F-1 rules)</li>
          <li>Consistency with documents — no coached lies</li>
        </ul>
        <p>Verify on <a href="../../official-links/#us">official USA links</a> · <a href="../../checklist.html?country=us&amp;type=study">USA checklist</a>. Fee amounts (MRV, SEVIS) change — check official pages before paying.</p>
<!-- /lander-depth -->`,

  'portugal-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Portugal study visa from Pakistan — national student residence logic</h2>
        <p>Portugal is searched for comparatively approachable tuition in some programmes and an EU study base. Success still depends on a real admission, funds, insurance and a complete national visa file. Portuguese authorities decide; SK Immigration prepares.</p>
        <h2>What to prepare</h2>
        <ul>
          <li>Admission / enrolment evidence from a recognized institution</li>
          <li>Proof of means and tuition plan</li>
          <li>Accommodation evidence when requested</li>
          <li>Insurance and criminal-record / civil documents as listed for your appointment centre</li>
          <li>Language evidence if the programme requires Portuguese or English tests</li>
        </ul>
        <h2>Process outline</h2>
        <ol>
          <li>Programme shortlist and applications</li>
          <li>Admission documents and fee planning</li>
          <li>Attestation / translations as required</li>
          <li>Visa appointment with a complete set</li>
          <li>Travel only after a positive decision</li>
        </ol>
        <h2>Rejection risks</h2>
        <ul>
          <li>Unclear study purpose or mismatched academics</li>
          <li>Weak funds story</li>
          <li>Missing civil documents that the checklist clearly asks for</li>
          <li>“Any EU visa” agents with no university trail</li>
        </ul>
        <p>Official hub: <a href="../../official-links/#pt">Portugal links</a> · <a href="../../checklist.html?country=pt&amp;type=study">Portugal checklist</a>.</p>
<!-- /lander-depth -->`,

  'spain-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Spain student visa from Pakistan</h2>
        <p>Spain appeals for Spanish- and English-taught options and EU living experience. Long-stay student visas need admission, funds, insurance and a mission-ready document set. Spanish consular posts decide; SK Immigration sequences the file.</p>
        <h2>Eligibility checklist (verify current mission list)</h2>
        <ul>
          <li>Acceptance from a recognized Spanish school / university</li>
          <li>Funds and tuition evidence</li>
          <li>Medical insurance meeting stated coverage rules</li>
          <li>Accommodation proof when required</li>
          <li>Language evidence matching the programme (Spanish DELE/SIELE pathways or English tests — only as required)</li>
        </ul>
        <h2>Application flow</h2>
        <ol>
          <li>Shortlist and apply</li>
          <li>Secure admission / enrolment letter</li>
          <li>Compile civil + academic + financial set</li>
          <li>Book appointment only when documents are complete</li>
          <li>Await decision — do not travel on assumptions</li>
        </ol>
        <h2>Pakistan-file mistakes</h2>
        <ul>
          <li>Assuming tourist entry can convert casually into study residence</li>
          <li>Insurance that does not meet stated minimums</li>
          <li>Incomplete apostille/attestation chains</li>
          <li>Generic SOPs with no Spain-specific programme logic</li>
        </ul>
        <p>See <a href="../../official-links/#es">Spain official links</a> · <a href="../../checklist.html?country=es&amp;type=study">Spain checklist</a>.</p>
<!-- /lander-depth -->`,

  'romania-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Romania study from Pakistan — EU, not automatic Schengen residence</h2>
        <p>Romania is often explored for lower tuition/living bands and English-taught programmes (including medicine-related interest). It is an EU destination, but travel expectations differ from Hungary/Poland Schengen residence files — verify current rules. Romanian authorities decide visas; SK Immigration prepares documentation.</p>
        <h2>Who should look at Romania</h2>
        <ul>
          <li>Budget-conscious students with realistic programme goals</li>
          <li>Applicants willing to verify university recognition for future licensing (especially medicine-related paths)</li>
          <li>Profiles that can show funds without illegal work assumptions</li>
        </ul>
        <h2>Requirements &amp; documents (high level)</h2>
        <ul>
          <li>Letter of acceptance / admission</li>
          <li>Proof of funds and tuition plan</li>
          <li>Academics with required legalization</li>
          <li>Insurance / medicals as listed</li>
          <li>Housing evidence when requested</li>
        </ul>
        <h2>Process</h2>
        <ol>
          <li>Honest pathway review (especially for medicine claims)</li>
          <li>University applications</li>
          <li>Document packaging and attestation order</li>
          <li>Visa appointment</li>
          <li>Travel readiness after decision</li>
        </ol>
        <h2>High-risk mistakes</h2>
        <ul>
          <li>Unverified “medical seat” sellers</li>
          <li>Ignoring recognition/licensing implications for your career</li>
          <li>Weak funds narrative</li>
          <li>Incomplete forms and name mismatches</li>
        </ul>
        <p>Official: <a href="https://www.studyinromania.gov.ro/" target="_blank" rel="noopener noreferrer">Study in Romania</a> · <a href="../../official-links/#ro">Romania links hub</a> · <a href="../../checklist.html?country=ro&amp;type=study">Romania checklist</a>.</p>
<!-- /lander-depth -->`,

  'austria-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Austria study from Pakistan — admission before VFS</h2>
        <p>Austria offers English and German-taught programmes in Vienna, Salzburg and regional universities. Pakistani files need credible admission, funds and often German language evidence — not broker-only PDFs.</p>
        <h2>Checklist focus</h2>
        <ul>
          <li>University admission with fee letter on official domain</li>
          <li>Funds for tuition + living per mission guidance</li>
          <li>German or English proof matching the programme clause</li>
          <li>Attestation / legalization order for academics</li>
        </ul>
        <h2>Process</h2>
        <ol>
          <li>Shortlist with realistic language timeline</li>
          <li>Apply and secure admission</li>
          <li>Compile financial and insurance evidence</li>
          <li>Book VFS Austria only when file complete</li>
        </ol>
        <h2>Mistakes</h2>
        <ul>
          <li>Assuming MOI without written university acceptance</li>
          <li>One-month bank spikes</li>
          <li>Visit visa used to scout universities</li>
        </ul>
        <p><a href="../../official-links/#at">Austria links</a> · <a href="../../checklist.html?country=at&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'belgium-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Belgium study visa from Pakistan</h2>
        <p>Belgium suits EU-focused students targeting Brussels institutions and regional universities. Files need admission, funds and clear study purpose — Belgian missions decide.</p>
        <h2>Requirements (verify live list)</h2>
        <ul>
          <li>Admission / enrolment from recognized institution</li>
          <li>Proof of means and accommodation</li>
          <li>Language evidence per programme</li>
          <li>Medical insurance meeting stated rules</li>
        </ul>
        <h2>Refusal risks</h2>
        <ul>
          <li>Weak academic progression story</li>
          <li>Unexplained sponsor transfers</li>
          <li>Incomplete translations</li>
        </ul>
        <p><a href="../../official-links/#be">Belgium links</a> · <a href="../../checklist.html?country=be&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'cyprus-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Cyprus study from Pakistan — verify pathway</h2>
        <p>Cyprus attracts interest for English-taught colleges. Verify institution recognition and the correct long-stay student route before paying agents — not every brochure equals embassy-ready admission.</p>
        <h2>Prepare</h2>
        <ul>
          <li>Admission letter from institution you can document</li>
          <li>Tuition payment trail to the school</li>
          <li>Funds and insurance per checklist</li>
          <li>Attestation when required</li>
        </ul>
        <h2>Mistakes</h2>
        <ul>
          <li>Broker campuses without independent verification</li>
          <li>Confusing visit entry with degree intent</li>
          <li>Weak funds narrative</li>
        </ul>
        <p><a href="../../official-links/#cy">Cyprus links</a> · <a href="../../checklist.html?country=cy&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'czech-republic-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Czech Republic study from Pakistan</h2>
        <p>Prague and regional Czech universities offer English programmes. National student visas need admission, funds and often nostrification or recognition steps for some fields — verify early.</p>
        <h2>Process outline</h2>
        <ol>
          <li>Programme shortlist and language plan</li>
          <li>University application and admission</li>
          <li>Funds and accommodation evidence</li>
          <li>VFS appointment with complete set</li>
        </ol>
        <h2>Mistakes</h2>
        <ul>
          <li>Ignoring recognition for regulated fields</li>
          <li>Generic SOP with no Czech programme detail</li>
          <li>Booking VFS empty-handed</li>
        </ul>
        <p><a href="../../official-links/#cz">Czech links</a> · <a href="../../checklist.html?country=cz&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'greece-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Greece study from Pakistan</h2>
        <p>Greece offers English-taught options especially in Athens and islands-based colleges. Mission files need real admission, funds and insurance — tourism visits are not study shortcuts.</p>
        <h2>Focus areas</h2>
        <ul>
          <li>Admission authenticity on university domains</li>
          <li>Funds covering tuition and living</li>
          <li>Language clause on offer letter</li>
          <li>Complete attestation chain</li>
        </ul>
        <p><a href="../../official-links/#gr">Greece links</a> · <a href="../../checklist.html?country=gr&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'ireland-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Ireland study from Pakistan — separate from UK</h2>
        <p>Ireland uses its own student immigration permission. Pakistani applicants need admission from an eligible Irish institution, funds, and online application steps — not a UK student visa.</p>
        <h2>Building blocks</h2>
        <ul>
          <li>Offer letter / admission evidence</li>
          <li>Proof of funds per INIS guidance</li>
          <li>English evidence matching programme</li>
          <li>Online application and biometrics when required</li>
        </ul>
        <h2>Mistakes</h2>
        <ul>
          <li>Assuming UK CAS covers Ireland</li>
          <li>Funds only shown as one-day balance</li>
          <li>Weak study purpose narrative</li>
        </ul>
        <p><a href="../../official-links/#ie">Ireland links</a> · <a href="../../checklist.html?country=ie&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'malaysia-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Malaysia study from Pakistan</h2>
        <p>Malaysia offers affordable English programmes and student pass routes. Files need institution acceptance, funds and correct student pass category — not visit visas for degrees.</p>
        <h2>Prepare</h2>
        <ul>
          <li>Offer from recognized institution</li>
          <li>EMGS / student pass steps when applicable</li>
          <li>Funds and health requirements per checklist</li>
        </ul>
        <h2>Mistakes</h2>
        <ul>
          <li>Unverified college agents</li>
          <li>Visit visa instead of student pass</li>
          <li>Incomplete medical insurance</li>
        </ul>
        <p><a href="../../official-links/#my">Malaysia links</a> · <a href="../../checklist.html?country=my&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'malta-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Malta study from Pakistan</h2>
        <p>Malta hosts English-language colleges and EU base interest. Student files need admission, funds and mission-ready documentation — island living costs still require honest budgeting.</p>
        <h2>Checklist</h2>
        <ul>
          <li>Admission with fee schedule on college site</li>
          <li>Funds and accommodation proof</li>
          <li>Language evidence per programme</li>
        </ul>
        <p><a href="../../official-links/#mt">Malta links</a> · <a href="../../checklist.html?country=mt&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'slovakia-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Slovakia study from Pakistan</h2>
        <p>Slovakia offers EU study at lower living costs than Western Europe. Admission, funds and attestation order decide visa outcomes — not social media “easy EU” ads.</p>
        <h2>Process</h2>
        <ol>
          <li>University shortlist and applications</li>
          <li>Admission and tuition planning</li>
          <li>Document legalization</li>
          <li>Visa appointment when complete</li>
        </ol>
        <p><a href="../../official-links/#sk">Slovakia links</a> · <a href="../../checklist.html?country=sk&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'switzerland-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Switzerland study from Pakistan — high cost realism</h2>
        <p>Switzerland offers top universities but very high living costs. Files need strong admission, funds that match Swiss subsistence levels, and often language proof — weak budgets fail credibility checks.</p>
        <h2>Requirements focus</h2>
        <ul>
          <li>Admission from recognized Swiss institution</li>
          <li>Funds substantially above Eastern EU levels</li>
          <li>Language per programme (German/French/English)</li>
          <li>Health insurance meeting Swiss rules</li>
        </ul>
        <p><a href="../../official-links/#ch">Switzerland links</a> · <a href="../../checklist.html?country=ch&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'turkey-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Turkey study from Pakistan</h2>
        <p>Turkey attracts students for affordable programmes and Turkish universities. Student residence files need admission, funds and correct sticker/e-visa sequencing — verify High Commission instructions.</p>
        <h2>Prepare</h2>
        <ul>
          <li>University acceptance letter</li>
          <li>Tuition payment evidence</li>
          <li>Funds and passport validity</li>
          <li>Translations when listed</li>
        </ul>
        <p><a href="../../official-links/#tr">Turkey links</a> · <a href="../../checklist.html?country=tr&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,

  'netherlands-study-visa-pakistan': `
<!-- lander-depth -->
        <h2>Netherlands study from Pakistan</h2>
        <p>Dutch universities offer strong English-taught programmes. IND/MVV steps and institution admission must be sequenced correctly before VFS — not “print offer and run”.</p>
        <h2>Focus</h2>
        <ul>
          <li>Admission and tuition deposit rules</li>
          <li>Funds per IND guidance</li>
          <li>Nuffic / institution procedures when applicable</li>
          <li>Complete biometrics package</li>
        </ul>
        <p><a href="../../official-links/#nl">Netherlands links</a> · <a href="../../checklist.html?country=nl&amp;type=study">checklist</a>.</p>
<!-- /lander-depth -->`,
};

const DEPTH_RE = /<!-- lander-depth -->[\s\S]*?<!-- \/lander-depth -->/;

let updated = 0;
for (const [slug, block] of Object.entries(BLOCKS)) {
  const file = path.join(ROOT, 'study-visa', slug, 'index.html');
  if (!fs.existsSync(file)) {
    console.warn('missing', slug);
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  if (DEPTH_RE.test(html)) {
    html = html.replace(DEPTH_RE, block.trim());
  } else {
    // Insert before official links section if no lander-depth markers
    html = html.replace(
      /<h2>Official government/,
      `${block.trim()}\n\n        <h2>Official government`
    );
  }
  // Refresh visible review date where present
  html = html.replace(
    /SK Immigration Services · (Updated|Reviewed) 20\d{2}-\d{2}-\d{2}/,
    `SK Immigration Services · Reviewed ${TODAY}`
  );
  html = html.replace(
    /<meta name="last-reviewed" content="[^"]*"/,
    `<meta name="last-reviewed" content="${TODAY}"`
  );
  if (!html.includes('name="last-reviewed"')) {
    html = html.replace(
      /<meta name="author"[^>]*>/,
      (m) => `${m}\n  <meta name="last-reviewed" content="${TODAY}" />`
    );
  }
  fs.writeFileSync(file, html);
  updated += 1;
  console.log('updated', slug);
}

console.log('Phase 3 deepen complete:', updated);
