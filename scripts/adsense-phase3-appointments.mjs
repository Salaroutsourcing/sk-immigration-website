#!/usr/bin/env node
/**
 * AdSense Track B Phase 3 — deepen visa appointment pages (France-level depth).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TODAY = '2026-08-22';
const DEPTH_RE = /<!-- appointment-depth -->[\s\S]*?<!-- \/appointment-depth -->/;

const BLOCKS = {
  'uk-visa-appointment-pakistan': `
<!-- appointment-depth -->
        <h2>Key facts — UK visa appointment Pakistan</h2>
        <ul>
          <li><strong>Portal:</strong> GOV.UK online application for your visa category (visit, student, work)</li>
          <li><strong>Biometrics:</strong> VFS Global UKVI centres — Islamabad, Karachi, Lahore (verify live list)</li>
          <li><strong>SK Immigration:</strong> immigration.salaroutsourcing.com · WhatsApp +92 304 5999859 · CUIN 0304985</li>
          <li><strong>Decision range:</strong> Often 3–8 weeks for visit; student/work vary by season</li>
        </ul>

        <h2>Book visit vs student vs work — different files</h2>
        <p>UK appointment slots look the same at VFS, but the <strong>online form and evidence</strong> differ. Visit files need ties and itinerary; student files need CAS and maintenance; work needs employer sponsorship. Mixing categories wastes fees.</p>
        <table>
          <thead><tr><th>Category</th><th>Before you book VFS</th></tr></thead>
          <tbody>
            <tr><td>Standard Visitor</td><td>Funds, itinerary, employment — <a href="../../visit-visa/uk-visit-visa-pakistan/">UK visit guide</a></td></tr>
            <tr><td>Student</td><td>CAS, maintenance held correctly — <a href="../../study-visa/uk-study-visa-pakistan/">UK study guide</a></td></tr>
            <tr><td>Skilled Worker</td><td>Certificate of Sponsorship + employer docs</td></tr>
          </tbody>
        </table>

        <h2>Step-by-step booking (UKVI + VFS)</h2>
        <ol>
          <li>Complete category assessment with SK Immigration (free consult)</li>
          <li>Assemble documents — bank history, purpose papers, translations</li>
          <li>Submit GOV.UK application and pay UKVI fee</li>
          <li>Book VFS biometrics when file is ready — not before</li>
          <li>Attend with complete set; track decision on UKVI portal</li>
        </ol>

        <h2>Documents at VFS (typical)</h2>
        <ul>
          <li>Passport, photos, application confirmation</li>
          <li>UKVI and VFS fee receipts</li>
          <li>Financial evidence and purpose documents for your category</li>
          <li>Cover letter and checklist printout</li>
        </ul>

        <h2>Fees (guidance)</h2>
        <p>UKVI visa fee + VFS service charge — amounts change on GOV.UK. SK preparation fee quoted after free consult. We do not sell fake priority slots.</p>

        <h2>Slot scarcity tactics (legal)</h2>
        <ul>
          <li>Check official VFS portal mornings and evenings when batches open</li>
          <li>Keep PDFs ready so you can book when a date appears</li>
          <li>Reschedule only through official channels — not WhatsApp “slot dealers”</li>
        </ul>

        <h2>Common Pakistan refusal themes at UK appointments</h2>
        <ul>
          <li>Attending with incomplete bank statements</li>
          <li>Visit story with hidden study intent</li>
          <li>Maintenance funds deposited too late for student route</li>
          <li>Prior UKVI refusals not addressed in new cover letter</li>
        </ul>

        <p><a href="../../visit-visa/uk-visit-visa-pakistan/">UK visit visa</a> · <a href="../../official-links/#gb">Official UK links</a> · <a href="../../checklist.html?country=gb">Checklist</a></p>
<!-- /appointment-depth -->`,

  'germany-visa-appointment-pakistan': `
<!-- appointment-depth -->
        <h2>Key facts — Germany visa appointment Pakistan</h2>
        <ul>
          <li><strong>Schengen visit:</strong> VFS Global Germany short-stay route</li>
          <li><strong>National visa (study/Ausbildung/work):</strong> Different form set — not tourist Schengen</li>
          <li><strong>Centres:</strong> Islamabad · Karachi (confirm VFS Germany Pakistan)</li>
          <li><strong>SK Immigration:</strong> WhatsApp +92 304 5999859</li>
        </ul>

        <h2>National vs Schengen — book the correct appointment type</h2>
        <p>Germany student and Ausbildung files use <strong>national visa (D)</strong> appointments with blocked account / contract evidence. Schengen tourism uses Type C short-stay rules. Wrong category at VFS wastes months.</p>

        <h2>Process map</h2>
        <ol>
          <li>Pathway choice — visit vs study vs Ausbildung vs work</li>
          <li>Document kit per pathway (<a href="../../study-visa/germany-study-visa-pakistan/">Germany study</a> · <a href="../../visit-visa/germany-visit-visa-pakistan/">Germany visit</a>)</li>
          <li>Online forms and fee payment per VFS instructions</li>
          <li>Book VFS only when APS/blocked account/admission steps are complete</li>
          <li>Biometrics and possible interview — answers must match papers</li>
        </ol>

        <h2>Documents checklist (high level)</h2>
        <ul>
          <li>Passport, photos, application printouts</li>
          <li>Travel insurance (Schengen visit) or insurance meeting entry rules (national)</li>
          <li>Funds: trip liquidity (visit) or Sperrkonto / salary proof (study/Ausbildung)</li>
          <li>Admission or Ausbildung contract when applicable</li>
          <li>APS / attestation papers when your case requires them</li>
        </ul>

        <h2>Timeline</h2>
        <p>VFS slots: days to weeks in peak season. National visa decisions often run weeks to months after complete biometrics — incomplete files delay longer.</p>

        <h2>Mistakes we see</h2>
        <ul>
          <li>Booking Schengen visit to enter for Ausbildung job search</li>
          <li>Blocked account opened before admission confirmed</li>
          <li>Missing APS when degree pathway requires it</li>
          <li>Fake VFS slot sellers on social media</li>
        </ul>

        <p><a href="../../official-links/#de">Germany official links</a> · <a href="../../checklist.html?country=de">Checklist</a></p>
<!-- /appointment-depth -->`,

  'usa-visa-appointment-pakistan': `
<!-- appointment-depth -->
        <h2>Key facts — USA visa appointment Pakistan</h2>
        <ul>
          <li><strong>Form:</strong> DS-160 online for visitor, student (F-1) and other nonimmigrant classes</li>
          <li><strong>Scheduling:</strong> Official US visa appointment portal after MRV fee</li>
          <li><strong>Interview:</strong> US Embassy Islamabad or Consulate Karachi per appointment letter</li>
          <li><strong>SK Immigration:</strong> CUIN 0304985 · +92 304 5999859</li>
        </ul>

        <h2>Visitor vs F-1 — different interview stories</h2>
        <p>B1/B2 interviews test temporary visit intent. F-1 interviews test study purpose, I-20 programme fit and funding. Using visitor appointments to hide study plans is a serious credibility violation.</p>

        <h2>Booking steps</h2>
        <ol>
          <li>Complete DS-160 accurately — SK reviews before submit</li>
          <li>Pay MRV fee via official channels</li>
          <li>Schedule biometrics/interview when documents ready</li>
          <li>Attend with passport, DS-160 confirmation, photos, supporting papers</li>
          <li>Track passport return via courier instructions</li>
        </ol>

        <h2>Interview preparation (no scripted lies)</h2>
        <ul>
          <li>Know your employer, income and trip payer</li>
          <li>Match DS-160 answers to bank statements and letters</li>
          <li>Explain prior refusals honestly if any</li>
          <li>Short truthful answers beat long invented stories</li>
        </ul>

        <h2>Slot waiting times</h2>
        <p>US interview waits fluctuate by category and season. Check the official portal — brokers selling “guaranteed embassy dates” are often scams.</p>

        <h2>Common refusal patterns (Pakistan)</h2>
        <ul>
          <li>214(b) temporary intent — weak ties</li>
          <li>DS-160 inconsistencies</li>
          <li>Funds that appear borrowed</li>
          <li>Prior refusals without changed circumstances</li>
        </ul>

        <p><a href="../../visit-visa/usa-visit-visa-pakistan/">USA visit guide</a> · <a href="../../study-visa/usa-study-visa-pakistan/">USA study</a> · <a href="../../official-links/#us">Official US links</a></p>
<!-- /appointment-depth -->`,

  'canada-visa-appointment-pakistan': `
<!-- appointment-depth -->
        <h2>Key facts — Canada visa appointment Pakistan</h2>
        <ul>
          <li><strong>Portal:</strong> IRCC online — visitor TRV, study permit, work permit</li>
          <li><strong>Biometrics:</strong> VFS Global Canada ABCC after IRCC instruction letter</li>
          <li><strong>Centres:</strong> Islamabad · Karachi · Lahore (verify VFS Canada Pakistan)</li>
        </ul>

        <h2>TRV vs study permit sequencing</h2>
        <p>Study permits are lodged via IRCC with biometrics at VFS. Visitor TRVs need strong temporary intent. Do not file TRV with hidden study intent — IRCC cross-checks SOPs and prior applications.</p>

        <h2>Process</h2>
        <ol>
          <li>Choose correct IRCC program stream</li>
          <li>Compile documents — GIC/SDS rules for study when applicable</li>
          <li>Submit IRCC application and pay fees</li>
          <li>Complete biometrics within IRCC deadline</li>
          <li>Passport request or decision letter — track IRCC account</li>
        </ol>

        <h2>Biometrics checklist</h2>
        <ul>
          <li>Biometrics instruction letter from IRCC</li>
          <li>Passport and appointment confirmation</li>
          <li>VFS service fee receipt when required</li>
        </ul>

        <h2>Timeline</h2>
        <p>IRCC processing varies widely by category and season — weeks to months. Biometrics deadline missed = stalled file.</p>

        <h2>Mistakes</h2>
        <ul>
          <li>TRV tourism story with active study applications elsewhere</li>
          <li>Funds shown only as one-day balance</li>
          <li>Ignoring medical exam requests</li>
          <li>Fake IRCC “agent portals”</li>
        </ul>

        <p><a href="../../study-visa/canada-study-visa-pakistan/">Canada study</a> · <a href="../../visit-visa/canada-visit-visa-pakistan/">Canada visit</a> · <a href="../../official-links/#ca">Canada links</a></p>
<!-- /appointment-depth -->`,

  'italy-visa-appointment-pakistan': `
<!-- appointment-depth -->
        <h2>Key facts — Italy visa appointment Pakistan</h2>
        <ul>
          <li><strong>Visit:</strong> Schengen short-stay via VFS Italy Pakistan</li>
          <li><strong>Study:</strong> National student visa — Universitaly / pre-enrolment steps often required first</li>
          <li><strong>Centres:</strong> Islamabad · Karachi</li>
        </ul>

        <h2>Universitaly before VFS (many study cases)</h2>
        <p>Italy study appointments fail when applicants book VFS before portal/pre-enrolment status is complete. Sequence: admission → portal steps → visa appointment with full set.</p>

        <h2>Visit appointment documents</h2>
        <ul>
          <li>Schengen form, photos, insurance €30,000+</li>
          <li>Hotels or Italian host invitation (dichiarazione di ospitalità when applicable)</li>
          <li>Bank statements and employment proof</li>
          <li>Itinerary showing Italy as main destination</li>
        </ul>

        <h2>Slot strategy</h2>
        <p>Peak summer slots are scarce. Prepare insurance and statements before refreshing the VFS calendar — book immediately when a date opens.</p>

        <h2>Refusal themes</h2>
        <ul>
          <li>Applying via Italy with minimal Italian nights</li>
          <li>Visit file while holding Italian university admission</li>
          <li>Insurance dates misaligned with flights</li>
        </ul>

        <p><a href="../../study-visa/italy-study-visa-pakistan/">Italy study</a> · <a href="../../visit-visa/italy-visit-visa-pakistan/">Italy visit</a> · <a href="../../official-links/#it">Italy links</a></p>
<!-- /appointment-depth -->`,

  'australia-visa-appointment-pakistan': `
<!-- appointment-depth -->
        <h2>Key facts — Australia visa appointment Pakistan</h2>
        <ul>
          <li><strong>Portal:</strong> ImmiAccount online lodgement</li>
          <li><strong>Biometrics:</strong> Australian Biometrics Collection Centre (ABCC)</li>
          <li><strong>Categories:</strong> Visitor (600), Student (500), and others — separate evidence rules</li>
        </ul>

        <h2>ImmiAccount before ABCC</h2>
        <p>Lodge the correct visa subclass online first. ABCC biometrics happen after ImmiAccount generates instructions — not through unofficial booking apps.</p>

        <h2>Visitor vs student</h2>
        <p>Visitor subclasses test genuine temporary entry. Student subclass 500 needs CoE, GS statement, OSHC and funds. Wrong subclass wastes fees and creates immigration history problems.</p>

        <h2>ABCC checklist</h2>
        <ul>
          <li>Biometrics request from ImmiAccount</li>
          <li>Passport and appointment letter</li>
          <li>Supporting documents uploaded to ImmiAccount as required</li>
        </ul>

        <h2>Health exams</h2>
        <p>Some applicants receive health exam requests before decision. Delaying medicals stalls the whole case — monitor ImmiAccount messages daily.</p>

        <h2>Timeline</h2>
        <p>Often 2–8+ weeks after complete biometrics; peak student seasons slower.</p>

        <p><a href="../../visit-visa/australia-visit-visa-pakistan/">Australia visit</a> · <a href="../../official-links/#au">Australia links</a></p>
<!-- /appointment-depth -->`,

  'schengen-visa-appointment-pakistan': `
<!-- appointment-depth -->
        <h2>Key facts — Schengen visa appointment Pakistan</h2>
        <ul>
          <li><strong>Rule:</strong> Book with the member state that is your main destination</li>
          <li><strong>Providers:</strong> VFS, TLS, BLS, AEG — depend on country (France = AEG, Spain = BLS, etc.)</li>
          <li><strong>Insurance:</strong> Schengen-compliant medical cover for full trip (typically €30,000+)</li>
        </ul>

        <h2>Country-specific appointment channels</h2>
        <table>
          <thead><tr><th>Main destination</th><th>Typical Pakistan channel</th></tr></thead>
          <tbody>
            <tr><td>France</td><td>AEG + France-Visas — <a href="../france-visa-appointment-pakistan/">France appointment guide</a></td></tr>
            <tr><td>Germany</td><td>VFS Germany — <a href="../germany-visa-appointment-pakistan/">Germany appointments</a></td></tr>
            <tr><td>Italy</td><td>VFS Italy — <a href="../italy-visa-appointment-pakistan/">Italy appointments</a></td></tr>
            <tr><td>Spain</td><td>BLS Spain (verify portal)</td></tr>
            <tr><td>Netherlands / Belgium / etc.</td><td>VFS per country hub on <a href="../../official-links/">official links</a></td></tr>
          </tbody>
        </table>

        <h2>Ready file first, then book</h2>
        <ol>
          <li>Confirm main destination and itinerary</li>
          <li>Buy insurance covering all Schengen days</li>
          <li>Prepare bank statements, employment, hotels/invite</li>
          <li>Submit online forms where required (France-Visas, etc.)</li>
          <li>Book VFS/TLS/BLS/AEG when PDFs are complete</li>
        </ol>

        <h2>Slot scams</h2>
        <p>Agents selling “guaranteed Schengen slots” on WhatsApp are a common fraud pattern. Use only official centre websites linked from embassies.</p>

        <h2>After refusal</h2>
        <p>Do not immediately jump to another Schengen country without fixing purpose, funds and ties. Schengen states share data.</p>

        <p><a href="../../visit-visa/schengen-visit-visa-pakistan/">Schengen visit hub</a> · <a href="../../answers/schengen-visit-visa-requirements.html">Requirements answer</a></p>
<!-- /appointment-depth -->`,
};

for (const [slug, block] of Object.entries(BLOCKS)) {
  const file = path.join(ROOT, 'public', 'visa-appointment', slug, 'index.html');
  if (!fs.existsSync(file)) {
    console.warn('missing', slug);
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  const trimmed = block.trim();
  if (DEPTH_RE.test(html)) {
    html = html.replace(DEPTH_RE, trimmed);
  } else {
    html = html.replace(
      /<h2>Frequently asked questions/,
      `${trimmed}\n\n        <h2>Frequently asked questions`
    );
  }
  html = html.replace(
    /SK Immigration Services · (Updated|Reviewed) 20\d{2}-\d{2}-\d{2}/,
    `SK Immigration Services · Reviewed ${TODAY}`
  );
  fs.writeFileSync(file, html);
  console.log('appointment', slug);
}

console.log('Phase 3 appointments complete:', Object.keys(BLOCKS).length);
