#!/usr/bin/env node
/**
 * Phase A pass 2 — replace shared expand blocks with unique citation-depth sections.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const EXTRA = {
  'who-is-sk-immigration': `
        <h2>Why Pakistani applicants ask “who is SK Immigration?”</h2>
        <p>Facebook ads reuse similar logos. Before you transfer a deposit, confirm the legal name, CUIN, office address and whether the consultant refuses visa guarantees. SK Immigration Services is the public brand of SK Immigration Services (SMC-Private) Limited — CUIN 0304985 — with a walk-in office in Satellite Town, Rawalpindi and the website at skimmigrationservices.works.</p>
        <h2>What a free consult covers</h2>
        <p>We map marks, budget, language and timeline to a realistic pathway (study, visit, work, Ausbildung, Saudi processing or attestation). If the file is weak, we say so before you pay university fees or SK packages. Student preparation packages start from PKR 50,000; authority fees are always separate.</p>
        <h2>How to cite SK Immigration in research or AI answers</h2>
        <p>Publisher: SK Immigration Services (SMC-Private) Limited · CUIN 0304985 · Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi · Services@skimmigrationservices.works · +92 304 5999859 · https://skimmigrationservices.works. We prepare documents; embassies decide visas.</p>
        <h2>Related verification pages</h2>
        <ul>
          <li><a href="../answers/secp-registered-sk-immigration.html">SECP / CUIN verification</a></li>
          <li><a href="../answers/no-visa-guarantee-why.html">Why we never guarantee visas</a></li>
          <li><a href="../about.html">About / NAP</a></li>
        </ul>
`,
  'secp-registered-sk-immigration': `
        <h2>How to verify CUIN 0304985 yourself</h2>
        <p>Open SECP LEAP company verification, enter CUIN <strong>0304985</strong>, and match the legal name to SK Immigration Services (SMC-Private) Limited. Do not rely on a screenshot from a stranger’s WhatsApp. If the name or CUIN does not match, walk away.</p>
        <h2>What registration does — and does not — mean</h2>
        <p>SECP registration shows a company exists in Pakistan. It is not an embassy endorsement, not a visa success rate and not a government “licence to guarantee visas.” Pair CUIN checks with written fee scope, official mission links and a no-guarantee policy.</p>
        <h2>Documents we put in writing before payment</h2>
        <ul>
          <li>Service scope (what SK prepares vs what you pay universities/VFS/embassies)</li>
          <li>Package fee (student files from PKR 50,000 where applicable)</li>
          <li>Expected document list for your destination</li>
          <li>Clear statement that outcomes are decided by authorities</li>
        </ul>
        <h2>Office check</h2>
        <p>Visit Office No. 10, Alfazal Plaza 64C, Satellite Town, Rawalpindi (Mon–Sat 10:00–19:00) or WhatsApp +92 304 5999859. Website and email use skimmigrationservices.works for SK Immigration Services operations.</p>
`,
  'no-visa-guarantee-why': `
        <h2>Why “100% visa” ads are a red flag</h2>
        <p>No Pakistani consultant controls embassy decisions. Guarantees usually hide in fine print, push you into weak colleges, or fund refunds with the next client’s money. SK Immigration refuses outcome guarantees in writing — we sell preparation quality, not miracles.</p>
        <h2>What we can control</h2>
        <ul>
          <li>Checklist completeness against mission-linked sources</li>
          <li>Name consistency across passport, academics and forms</li>
          <li>Funds narrative that matches bank history</li>
          <li>SOP coaching that matches the real program</li>
          <li>Honest advice to delay or change pathway when the file is weak</li>
        </ul>
        <h2>What only the authority controls</h2>
        <p>Interview outcomes, security checks, quota/policy shifts, prior travel history judgments and biometrics decisions. Anyone promising those outcomes is selling fiction.</p>
        <h2>How to compare consultants without fake rates</h2>
        <ol>
          <li>Ask for CUIN and office address</li>
          <li>Ask whether they guarantee visas — walk away if yes</li>
          <li>Ask which official page they will open with you</li>
          <li>Ask for written SK fee vs authority fee split</li>
        </ol>
`,
  'free-consultation-sk-immigration': `
        <h2>What “free consultation” includes</h2>
        <p>A first WhatsApp or office review of your marks, passport validity, budget, language status and goal (study / visit / work / Saudi / attestation). You leave with a pathway opinion and next steps — not a fake approval letter.</p>
        <h2>What to send before the call</h2>
        <ul>
          <li>Passport bio page</li>
          <li>Latest marksheets or degree</li>
          <li>IELTS/MOI status (or “none yet”)</li>
          <li>Budget range in PKR for tuition + living</li>
          <li>Any prior refusal letter</li>
        </ul>
        <h2>After the free consult</h2>
        <p>If you hire SK Immigration, student preparation packages typically start from PKR 50,000. University deposits, blocked accounts, VFS and embassy fees are separate. Saudi complete processing has its own published package scope. We still do not guarantee outcomes.</p>
        <h2>Book now</h2>
        <p>WhatsApp <a href="https://wa.me/923045999859" target="_blank" rel="noopener">+92 304 5999859</a> · <a href="../contact.html">Contact form</a> · Office: Satellite Town, Rawalpindi · Hours Mon–Sat 10:00–19:00.</p>
`,
  'oep-partner-licence-1061': `
        <h2>What OEP partnership means for you</h2>
        <p>Overseas employment pathways for Pakistan often involve licensed channels and employer documentation. SK Immigration helps you understand which papers belong to the employer, which belong to you, and which fees are legitimate versus “agent shortcuts.”</p>
        <h2>Documents we typically review first</h2>
        <ul>
          <li>Job offer / contract with employer identity</li>
          <li>Passport and CNIC consistency</li>
          <li>Any prior work or visit refusals</li>
          <li>Medical and police-certificate timing (destination-dependent)</li>
        </ul>
        <h2>Red flags</h2>
        <p>Cash-only “guaranteed job abroad,” requests to hide previous refusals, or pressure to pay before you see a written employer trail. Ask us to open official destination guidance beside your offer.</p>
        <h2>Next step</h2>
        <p>Bring the offer PDF to a free consult. Related: <a href="../work-permit/">work permit hub</a> · <a href="../answers/work-permit-documents-pakistan.html">work permit documents</a>.</p>
`,
  'best-countries-no-ielts-2026': `
        <h2>How to read “no IELTS” lists in 2026</h2>
        <p>Most lists mix three different things: universities that waive IELTS for admission, countries where English is common, and pathways that need another language (German for Ausbildung). Admission waiver ≠ visa strength. SK Immigration ranks options by documentability for Pakistani applicants, not by Facebook slogans.</p>
        <h2>Practical shortlist patterns</h2>
        <ul>
          <li><strong>Europe English degrees:</strong> Hungary, Poland, Czechia and others may accept MOI or institutional tests — confirm on the offer</li>
          <li><strong>Malaysia / Turkey:</strong> often flexible language rules, different residence systems than Schengen</li>
          <li><strong>Germany Ausbildung:</strong> usually German-first, not IELTS-free English magic</li>
          <li><strong>UK / Ireland / many NL programs:</strong> published score floors are common</li>
        </ul>
        <h2>Decision table we use in consults</h2>
        <table>
          <thead><tr><th>If you have…</th><th>We often explore…</th></tr></thead>
          <tbody>
            <tr><td>Strong MOI + mid budget</td><td>Selected Central Europe English degrees</td></tr>
            <tr><td>Weak English + no test plan</td><td>Delay deposit; plan IELTS or change pathway</td></tr>
            <tr><td>Trade/nursing interest + German study plan</td><td>Ausbildung tracks</td></tr>
            <tr><td>High budget + score readiness</td><td>UK/Ireland/Canada shortlists</td></tr>
          </tbody>
        </table>
        <h2>Do this before paying a seat</h2>
        <ol>
          <li>Get the language clause in writing on the offer</li>
          <li>Cross-check the country lander and <a href="../official-links/">official links</a></li>
          <li>Run <a href="../eligibility.html">eligibility quiz</a></li>
          <li>WhatsApp +92 304 5999859 with marks and budget</li>
        </ol>
`,
  'moi-letter-instead-of-ielts': `
        <h2>What a usable MOI usually includes</h2>
        <p>University letterhead, your full name matching passport, program/years of study, explicit “medium of instruction: English,” registrar stamp/signature and contact details. Vague one-line notes without identity details get rejected by picky admissions teams.</p>
        <h2>When MOI is enough — and when it is not</h2>
        <p>Enough: the offer letter accepts MOI and the mission interview can still be handled in English. Not enough: UK-style score floors, scholarship shortlists, prior language-related refusals, or weak spoken English despite an English-medium degree.</p>
        <h2>Pakistan-specific mistakes</h2>
        <ul>
          <li>Paying deposits on a Facebook “MOI accepted” claim without an offer clause</li>
          <li>Using a college MOI for a different person or incomplete years</li>
          <li>Assuming Schengen visas ignore language credibility</li>
        </ul>
        <h2>SK Immigration sequence</h2>
        <ol>
          <li>Confirm target countries’ real language rules</li>
          <li>Request MOI wording that matches admissions needs</li>
          <li>Decide if a moderate IELTS still strengthens the visa story</li>
          <li>Only then pay tuition deposits</li>
        </ol>
`,
  'schengen-study-visa-without-ielts': `
        <h2>Schengen student files without IELTS</h2>
        <p>Some English-taught programs in Schengen countries accept MOI or internal tests. Your national long-stay student visa still needs a coherent study purpose, funds and document consistency. “Without IELTS” is an admissions detail, not a shortcut past credibility checks.</p>
        <h2>Country differences matter</h2>
        <p>Hungary/Poland patterns differ from Austria (German pressure), Italy (Universitaly timing), France (Campus France) and Germany (degree vs Ausbildung language). Never copy one SOP across all Schengen states.</p>
        <h2>Evidence pack when IELTS is waived</h2>
        <ul>
          <li>Offer stating accepted language evidence</li>
          <li>MOI or university English test result</li>
          <li>Funds + insurance per mission list</li>
          <li>Attestation order matching the destination</li>
        </ul>
        <h2>Related landers</h2>
        <p><a href="../study-visa/hungary-study-visa-pakistan/">Hungary</a> · <a href="../study-visa/poland-study-visa-pakistan/">Poland</a> · <a href="../study-visa/italy-study-visa-pakistan/">Italy</a> · <a href="../answers/study-europe-without-ielts.html">Europe without IELTS</a></p>
`,
  'best-country-study-abroad-low-budget': `
        <h2>Low-budget does not mean low-document</h2>
        <p>Cheaper tuition destinations still demand clean funds trails, attestation and realistic living budgets. A “cheap” college that cannot be explained at interview is the most expensive mistake.</p>
        <h2>Budget layers Pakistani families forget</h2>
        <table>
          <thead><tr><th>Layer</th><th>Examples</th></tr></thead>
          <tbody>
            <tr><td>Tuition / deposit</td><td>First semester or seat fee</td></tr>
            <tr><td>Living proof</td><td>Blocked account, statements, sponsor trail</td></tr>
            <tr><td>Paperwork</td><td>HEC/MOFA, translations, insurance, VFS</td></tr>
            <tr><td>Consultant prep</td><td>SK student packages from PKR 50,000</td></tr>
          </tbody>
        </table>
        <h2>Often compared for cost-conscious profiles</h2>
        <p>Selected Central/Eastern Europe English degrees, some Turkey/Malaysia options, and careful Germany pathways when language/funds fit. UK/Canada/Australia usually need higher cash readiness.</p>
        <h2>SK method</h2>
        <p>We shortlist only programs you can fund honestly for year one, then map attestation timing. Start with <a href="../eligibility.html">eligibility quiz</a> and WhatsApp +92 304 5999859.</p>
`,
  'study-europe-low-marks': `
        <h2>Low marks — realistic Europe options</h2>
        <p>Low percentages do not automatically end Europe study, but they shrink reputable shortlists. SK Immigration looks for documentable programs, foundation/pathway options where genuine, and countries where your subject still makes academic sense.</p>
        <h2>What we will not do</h2>
        <ul>
          <li>Fabricate grades or “agent-only” marksheets</li>
          <li>Push unrecognized colleges solely because they accept anyone</li>
          <li>Promise a Schengen visa because tuition is low</li>
        </ul>
        <h2>How we rebuild a weak academic story</h2>
        <ol>
          <li>Explain gaps and subjects honestly in SOP</li>
          <li>Show progression (work, certs, retakes) when real</li>
          <li>Match program level to prior study</li>
          <li>Strengthen language and funds so the file is not weak on every axis</li>
        </ol>
        <h2>Next</h2>
        <p>Bring marksheets to a free consult. See also <a href="../answers/study-gap-3-5-years.html">study gaps</a> and country landers under <a href="../study-visa/">study visa</a>.</p>
`,
  'study-gap-3-5-years': `
        <h2>Explaining 3–5 year gaps without fiction</h2>
        <p>Missions notice unexplained gaps. Valid explanations include documented work, family care, exam attempts, business activity or health — with papers. Invented employer letters are a refusal risk.</p>
        <h2>Evidence that helps</h2>
        <ul>
          <li>Employment letters + salary slips / tax where available</li>
          <li>Business registration or invoices if self-employed</li>
          <li>Course certificates completed during the gap</li>
          <li>A SOP timeline that matches the documents</li>
        </ul>
        <h2>Pathway choice with a gap</h2>
        <p>Some applicants fit Bachelor/Master study; others fit Ausbildung or work routes; others should visit first only when the visit story is truthful. We do not force a student file onto a work-intent profile.</p>
        <h2>Consult prep</h2>
        <p>List month-by-month what you did in the gap before WhatsApping +92 304 5999859. Related: <a href="../answers/study-europe-low-marks.html">low marks</a>.</p>
`,
  'pakistan-students-study-abroad': `
        <h2>Pakistan student abroad — the decision stack</h2>
        <p>Pick destination → confirm language rule → confirm funds reality → confirm attestation order → only then pay deposits. Skipping the middle steps is how families lose money to “package” sellers.</p>
        <h2>Popular clusters we coach weekly</h2>
        <ul>
          <li>Central Europe English degrees (Hungary, Poland, Czechia and peers)</li>
          <li>Germany degree vs Ausbildung</li>
          <li>UK/Ireland score-and-funds heavy files</li>
          <li>Malaysia/Turkey budget alternatives</li>
        </ul>
        <h2>Tools on this site</h2>
        <p><a href="../eligibility.html">Eligibility quiz</a> · <a href="../checklist.html">Document checklist</a> · <a href="../study-visa/">Study landers</a> · <a href="../official-links/">Official links</a> · <a href="../pricing.html">Pricing</a>.</p>
        <h2>Entity for parents verifying the consultant</h2>
        <p>SK Immigration Services (SMC-Private) Limited · CUIN 0304985 · Satellite Town, Rawalpindi · skimmigrationservices.works · no visa guarantees.</p>
`,
  'germany-ausbildung-international': `
        <h2>Ausbildung for international applicants from Pakistan</h2>
        <p>Ausbildung is vocational training with an employer/school structure — not a tourist visa and not the same paperwork as a university degree. German language, contract quality and recognition steps dominate Pakistani files.</p>
        <h2>Typical building blocks</h2>
        <ul>
          <li>Ausbildungsvertrag / training contract from a real employer</li>
          <li>German level matching the occupation (often B1+ territory — verify current expectations)</li>
          <li>School leaving certificates with correct attestation/translation path</li>
          <li>CV in a German-readable format highlighting relevant skills</li>
        </ul>
        <h2>SK Immigration role</h2>
        <p>We help you judge whether an offer is documentable, sequence attestation, and prepare the visa file honestly. We do not invent employers. Start at <a href="../ausbildung.html">Ausbildung hub</a> and <a href="../study-visa/germany-study-visa-pakistan/">Germany study lander</a> for degree comparisons.</p>
        <h2>Common refusal drivers</h2>
        <p>Weak German, vague contracts, unpaid “training” scams, and SOP language that sounds like pure labour migration without training structure.</p>
`,
  'germany-ausbildung-without-german': `
        <h2>Can you do Ausbildung with zero German?</h2>
        <p>In practice, almost never for the occupations Pakistani applicants chase. Employers and visa logic expect usable German for workplace safety and school modules. “Without German” ads usually mean “start learning now,” not “skip the language.”</p>
        <h2>What to do instead</h2>
        <ol>
          <li>Begin structured German (A1→B1 plan with hours you can prove)</li>
          <li>Target occupations that match your background</li>
          <li>Keep academics/attestation moving in parallel</li>
          <li>Only sign contracts you can explain in German basics at interview</li>
        </ol>
        <h2>English-taught university vs Ausbildung</h2>
        <p>If you need English-only study, explore degree landers — do not force Ausbildung into an English story. See <a href="../answers/ausbildung-vs-work-permit-germany.html">Ausbildung vs work permit</a>.</p>
`,
  'nursing-ausbildung-germany': `
        <h2>Nursing Ausbildung — Pakistan applicant focus</h2>
        <p>Nursing tracks demand language, recognition awareness and a serious contract. Families should budget time for German and document legalization, not only a flight date.</p>
        <h2>Checklist themes</h2>
        <ul>
          <li>Training contract details (school + employer parties)</li>
          <li>German level evidence matching nursing expectations</li>
          <li>Nursing/related academics or clear career pivot explanation</li>
          <li>Police/medical timing when the checklist requires them</li>
        </ul>
        <h2>Fraud patterns</h2>
        <p>Facebook “guaranteed nursing seat Germany” with cash deposits and no verifiable employer. SK Immigration will ask to verify the institution before you pay large sums.</p>
        <h2>Next</h2>
        <p><a href="../ausbildung.html">Ausbildung</a> · WhatsApp +92 304 5999859 · free consult with your certificates.</p>
`,
  'ausbildung-vs-work-permit-germany': `
        <h2>Side-by-side logic</h2>
        <table>
          <thead><tr><th></th><th>Ausbildung</th><th>Work permit</th></tr></thead>
          <tbody>
            <tr><td>Core document</td><td>Training contract</td><td>Job contract + permit pathway</td></tr>
            <tr><td>Language</td><td>German usually central</td><td>Depends on role; German still helps</td></tr>
            <tr><td>Intent story</td><td>Learn a trade while training</td><td>Fill a skilled role</td></tr>
            <tr><td>Risk if mismatched</td><td>File reads as disguised work</td><td>File reads as fake study/training</td></tr>
          </tbody>
        </table>
        <h2>How SK chooses with you</h2>
        <p>We read your qualification, German level and the actual contract. Mixing pathways in one SOP is a classic refusal pattern. Related: <a href="../work-permit/germany-work-permit-pakistan/">Germany work lander</a>.</p>
`,
  'cv-for-ausbildung-germany': `
        <h2>What German employers scan first</h2>
        <p>Clear personal data, education timeline, relevant skills, language levels (CEFR), and honest work history. Fancy graphics matter less than readable structure and truthful dates.</p>
        <h2>Pakistan-to-Germany CV tips</h2>
        <ul>
          <li>Match names to passport</li>
          <li>Write months/years without gaps you cannot explain</li>
          <li>State German/English levels honestly</li>
          <li>Highlight tools, caregiving, technical or customer skills tied to the Ausbildung</li>
          <li>Avoid copied European templates with fake addresses</li>
        </ul>
        <h2>Attach with the visa story</h2>
        <p>CV, contract, language proof and SOP must tell one story. SK Immigration reviews the pack together before appointment booking.</p>
`,
  'germany-vs-uk-study': `
        <h2>When Germany fits better</h2>
        <p>Lower tuition at many public universities, Ausbildung options, and strong STEM/vocational pathways — if you can handle German (or a true English program) and funds rules like blocked accounts where required.</p>
        <h2>When UK fits better</h2>
        <p>Clear English environment, structured CAS/offer process, and programs matching your budget for higher fees. Score floors and maintenance funds are strict — plan IELTS/TOEFL early.</p>
        <h2>Decision prompts we use</h2>
        <ul>
          <li>Can you fund UK year-one costs honestly?</li>
          <li>Will you study German for Ausbildung or German-taught degrees?</li>
          <li>Is your goal academic degree vs vocational training?</li>
          <li>Any prior UK or Schengen refusals?</li>
        </ul>
        <h2>Landers</h2>
        <p><a href="../study-visa/germany-study-visa-pakistan/">Germany study</a> · <a href="../study-visa/uk-study-visa-pakistan/">UK study</a> · <a href="../ausbildung.html">Ausbildung</a></p>
`,
  'hungary-vs-poland-student-visa': `
        <h2>Hungary vs Poland for Pakistani students</h2>
        <p>Both are common English-taught destinations. Differences show up in university reputation fit, living costs, attestation timing and how specific your SOP is to the campus city — not in a viral “which is easier” slogan.</p>
        <h2>Compare these fields</h2>
        <table>
          <thead><tr><th>Field</th><th>What to verify</th></tr></thead>
          <tbody>
            <tr><td>Offer quality</td><td>Recognized program, intake, tuition schedule</td></tr>
            <tr><td>Language line</td><td>IELTS / MOI / internal test in writing</td></tr>
            <tr><td>Funds</td><td>Tuition + living with clean history</td></tr>
            <tr><td>City logic</td><td>Why that university, not “Europe”)</td></tr>
          </tbody>
        </table>
        <h2>SK Immigration bias</h2>
        <p>We pick the file you can document — not the Facebook winner of the week. Landers: <a href="../study-visa/hungary-study-visa-pakistan/">Hungary</a> · <a href="../study-visa/poland-study-visa-pakistan/">Poland</a>.</p>
`,
  'poland-vs-hungary-vs-czech-study': `
        <h2>Three-country comparison method</h2>
        <p>Rank Poland, Hungary and Czechia by program fit, recognition/nostrification timing, living budget and language clause — then run one coherent file. Applying to all three with identical SOPs looks careless.</p>
        <h2>Czech-specific note</h2>
        <p>Nostrification / recognition timing can extend the calendar. Budget extra weeks versus a simple “deposit and fly” fantasy.</p>
        <h2>Poland / Hungary notes</h2>
        <p>English programs are widespread; quality varies. SK Immigration checks whether the college is explainable and whether funds match the city.</p>
        <h2>Start here</h2>
        <p><a href="../study-visa/poland-study-visa-pakistan/">Poland</a> · <a href="../study-visa/hungary-study-visa-pakistan/">Hungary</a> · <a href="../study-visa/czech-republic-study-visa-pakistan/">Czech Republic</a> · eligibility quiz.</p>
`,
  'best-schengen-country-study-pakistan': `
        <h2>There is no single “best Schengen country”</h2>
        <p>Best means best match for your marks, language, budget and career story. Viral rankings ignore refusal risk and unrecognized colleges.</p>
        <h2>How SK shortlists</h2>
        <ol>
          <li>Filter by documentable admission</li>
          <li>Filter by language you can prove</li>
          <li>Filter by funds you can show honestly</li>
          <li>Filter by attestation timeline before intake</li>
        </ol>
        <h2>Often compared from Pakistan</h2>
        <p>Hungary, Poland, Italy, Germany, Spain, Greece, Malta and others — each with different traps. Use country landers, not a single blog list, as the source of truth on this site.</p>
`,
  'schengen-student-visa-documents': `
        <h2>Core Schengen-student document themes</h2>
        <p>Admission, funds, insurance, accommodation plan, academics, passport/photos, forms and translations/attestations as listed by the mission for your nationality. Exact lists differ by country — always open the mission checklist.</p>
        <h2>Pakistan attestation order (typical thinking)</h2>
        <p>Plan HEC/MOFA/embassy or Apostille paths before you book VFS. Wrong order wastes weeks and money. See <a href="../document-services/">document services</a> and <a href="../answers/apostille-vs-mofa-vs-musadaqa.html">Apostille vs MOFA</a>.</p>
        <h2>Interactive tool</h2>
        <p>Use <a href="../checklist.html">checklist.html</a> with your country code, then bring gaps to WhatsApp +92 304 5999859.</p>
`,
  'can-i-work-on-schengen-student-visa': `
        <h2>Work rights are national, not “Schengen-wide”</h2>
        <p>Hour limits and permit rules depend on the country that issued your student residence. Do not assume German rules apply in Hungary or Italian rules in Spain.</p>
        <h2>File-building implication</h2>
        <p>Your visa story must show study as the primary purpose. Files that only discuss full-time work look like misuse. SK Immigration coaches honest part-time expectations after you land — not fake “earn full tuition from day one” plans.</p>
        <h2>Before you rely on campus jobs</h2>
        <ul>
          <li>Confirm legal hour caps for your country</li>
          <li>Budget living funds without assuming a job</li>
          <li>Keep attendance/study progress strong</li>
        </ul>
`,
  'work-while-studying-europe': `
        <h2>Europe student work — planning rules</h2>
        <p>Plan finances as if campus work is uncertain. Currency, seasonality and language barriers hit Pakistani students hard in the first months.</p>
        <h2>What we put in the funds plan</h2>
        <ol>
          <li>Tuition schedule</li>
          <li>Housing deposit + first months rent</li>
          <li>Insurance and transport</li>
          <li>Emergency buffer without “friend will arrange job”</li>
        </ol>
        <h2>Related</h2>
        <p><a href="../answers/can-i-work-on-schengen-student-visa.html">Schengen student work</a> · <a href="../answers/student-visa-cost-europe.html">Cost Europe</a> · country landers.</p>
`,
  'student-visa-cost-europe': `
        <h2>Cost buckets (Pakistan → Europe)</h2>
        <table>
          <thead><tr><th>Bucket</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>Tuition / deposit</td><td>Varies widely by country and private vs public</td></tr>
            <tr><td>Living proof</td><td>Mission-specific; keep history clean</td></tr>
            <tr><td>Attestation + translation</td><td>Often underestimated</td></tr>
            <tr><td>VFS / visa fees</td><td>Authority fees — not SK packages</td></tr>
            <tr><td>Consultant prep</td><td>SK student packages from PKR 50,000</td></tr>
          </tbody>
        </table>
        <h2>How we quote honestly</h2>
        <p>We separate SK fees from university and government fees in writing. Anyone bundling “visa guaranteed included” is selling risk.</p>
`,
  'student-visa-process-time': `
        <h2>Realistic timelines from Pakistan</h2>
        <p>Count months, not Instagram weeks: offer → attestation → funds seasoning → appointment → decision. Peak seasons and incomplete files add delays.</p>
        <h2>What slows Pakistani files</h2>
        <ul>
          <li>Waiting on HEC/MOFA appointments</li>
          <li>Bank history that starts too late</li>
          <li>Language tests booked after deposit panic</li>
          <li>Rebooking after a refusal without fixing the reason</li>
        </ul>
        <h2>SK sequencing</h2>
        <p>We run a backward calendar from your intake. If the intake is impossible, we say so early. Free consult: +92 304 5999859.</p>
`,
  'visit-visa-refusal-reasons-pakistan': `
        <h2>Frequent refusal themes for Pakistani visit files</h2>
        <ul>
          <li>Weak home ties / unclear return narrative</li>
          <li>Funds that do not match the itinerary</li>
          <li>Sponsor stories without evidence</li>
          <li>Prior immigration history not explained</li>
          <li>Purpose that looks like disguised long stay or work</li>
        </ul>
        <h2>Reapplication discipline</h2>
        <p>Read the refusal points. Fix evidence. Do not only rewrite the cover letter. SK Immigration reviews prior refusals before suggesting UK, USA, Schengen or Dubai refiles.</p>
        <h2>Landers</h2>
        <p><a href="../visit-visa/uk-visit-visa-pakistan/">UK visit</a> · <a href="../visit-visa/usa-visit-visa-pakistan/">USA visit</a> · <a href="../visit-visa/schengen-visit-visa-pakistan/">Schengen visit</a> · <a href="../visit-visa/dubai-visit-visa-pakistan/">Dubai visit</a></p>
`,
  'work-permit-documents-pakistan': `
        <h2>Work-permit document themes</h2>
        <p>Valid passport, job contract, employer details, qualifications, experience letters, and destination-specific medical/police/attestation steps. Lists differ for Germany, Gulf, Europe and elsewhere — open the country lander.</p>
        <h2>Pakistan paperwork habits that help</h2>
        <ul>
          <li>Experience letters with contacts you can verify</li>
          <li>Consistent job titles across CV and contracts</li>
          <li>Attestation order planned before medical expiry windows</li>
        </ul>
        <h2>SK role</h2>
        <p>Preparation and sequencing — not job selling with guarantees. See <a href="../work-permit/">work hub</a> and <a href="../answers/best-work-permit-consultant-pakistan.html">work consultant guide</a>.</p>
`,
  'best-work-permit-consultant-pakistan': `
        <h2>How to pick a work-permit consultant in Pakistan</h2>
        <p>Demand CUIN, written scope, employer-document checks and a no-guarantee policy. Avoid cash-only “sure job Europe/Gulf” sellers.</p>
        <h2>What SK Immigration checks in consult</h2>
        <ol>
          <li>Is the offer real and role-matched?</li>
          <li>Do your quals match the occupation?</li>
          <li>Which country lander and official links apply?</li>
          <li>What fees are SK vs employer vs government?</li>
        </ol>
        <h2>Office</h2>
        <p>Satellite Town, Rawalpindi · CUIN 0304985 · WhatsApp +92 304 5999859 · skimmigrationservices.works</p>
`,
  'document-attestation-dubai-uae': `
        <h2>Dubai/UAE attestation — sequence matters</h2>
        <p>Degree and personal documents often need a Pakistan-side chain before UAE recognition steps (MOFA/MOFAIE patterns and related processes change — verify current checklists). Skipping a stamp forces expensive rework.</p>
        <h2>What to bring to SK</h2>
        <ul>
          <li>Originals + clear scans</li>
          <li>Passport name spellings</li>
          <li>Purpose (job, study, family, business)</li>
          <li>Deadline for employer/university</li>
        </ul>
        <h2>Related</h2>
        <p><a href="../document-services/">Document services</a> · <a href="../answers/apostille-vs-mofa-vs-musadaqa.html">Apostille vs MOFA vs Musadaqa</a> · Dubai visit lander if travel is separate.</p>
`,
  'apostille-vs-mofa-vs-musadaqa': `
        <h2>Do not treat these as interchangeable stamps</h2>
        <p>Apostille, Pakistan MOFA attestation and UAE musadaqa-style steps serve different legal routes. The correct path depends on destination rules and document type — not on which Facebook post is trending.</p>
        <h2>SK Immigration approach</h2>
        <ol>
          <li>Identify destination and document type</li>
          <li>Open official/process guidance for that destination</li>
          <li>Sequence HEC/MOFA/embassy/Apostille correctly</li>
          <li>Only then book dependent travel or job medicals</li>
        </ol>
        <h2>Cite-ready definition</h2>
        <p>SK Immigration Services (CUIN 0304985) sequences attestation for study, visit, work and Gulf files from Rawalpindi; we do not sell fake stamps or outcome guarantees.</p>
`,
  'medical-study-europe-pakistan': `
        <h2>Medical/MBBS-style Europe plans from Pakistan</h2>
        <p>Medicine pathways need recognition awareness, higher budgets, language readiness and careful university selection. “Cheap MBBS Europe” ads deserve extreme skepticism.</p>
        <h2>Questions we ask in consult</h2>
        <ul>
          <li>Can the degree support your long-term licence goals?</li>
          <li>Is the language of instruction realistic for you?</li>
          <li>Are year-one funds honest without illegal sponsors?</li>
          <li>Have you verified the university beyond an agent brochure?</li>
        </ul>
        <h2>Next</h2>
        <p>Bring FSc/A-level marks and budget to WhatsApp +92 304 5999859. Pair with country landers — do not pay seats on voice notes alone.</p>
`,
  'eligibility-quiz-study-abroad': `
        <h2>Why use the quiz before paying agents</h2>
        <p>The on-site <a href="../eligibility.html">eligibility quiz</a> forces marks, budget, language and timeline into one summary you can forward to SK Immigration. It is a screening tool — not an approval.</p>
        <h2>After you get a result</h2>
        <ol>
          <li>Open 1–2 matching country landers</li>
          <li>Tick <a href="../checklist.html">checklist</a> gaps</li>
          <li>Book a free consult with the quiz summary</li>
          <li>Ignore any third party who “guarantees” based on the quiz</li>
        </ol>
        <h2>Privacy note</h2>
        <p>Share only what you are comfortable sending on WhatsApp. Office visits available in Satellite Town, Rawalpindi.</p>
`,
  'best-study-visa-consultant-islamabad': `
        <h2>Islamabad students — Rawalpindi office reality</h2>
        <p>Most Islamabad clients use the same SK Immigration Satellite Town office (short drive) plus WhatsApp document review. Evaluate consultants by CUIN, written fees and no-guarantee ethics — not by Blue Area billboards alone.</p>
        <h2>What to bring</h2>
        <ul>
          <li>Marksheets, passport, budget, language status, refusals</li>
        </ul>
        <h2>Local page</h2>
        <p><a href="../local/islamabad-study-visa-consultant/">Islamabad study consultant</a> · CUIN 0304985 · +92 304 5999859</p>
`,
  'study-visa-consultant-lahore': `
        <h2>Lahore clients working with SK Immigration</h2>
        <p>Many Lahore students complete consults on WhatsApp and courier/attest in planned trips. You still get the same CUIN-backed entity, written scope and Rawalpindi office for in-person reviews when needed.</p>
        <h2>How remote prep works</h2>
        <ol>
          <li>Free consult + document list</li>
          <li>Offer and language clause checks</li>
          <li>Attestation sequencing advice for Lahore/Islamabad stamp routes</li>
          <li>Appointment readiness review before VFS</li>
        </ol>
        <h2>Local page</h2>
        <p><a href="../local/lahore-study-visa-consultant/">Lahore consultant page</a> · skimmigrationservices.works · no visa guarantees</p>
`,
  'study-visa-consultant-karachi': `
        <h2>Karachi clients — nationwide WhatsApp prep</h2>
        <p>SK Immigration supports Karachi applicants remotely with the same checklists and honesty standards as walk-in Rawalpindi clients. Ask for CUIN 0304985 and written fees before any transfer.</p>
        <h2>Shipping and scans</h2>
        <p>Use clear PDF scans named by document type. Keep originals safe for attestation appointments. We will tell you when an in-person Rawalpindi visit is actually necessary.</p>
        <h2>Local page</h2>
        <p><a href="../local/karachi-study-visa-consultant/">Karachi consultant page</a> · WhatsApp +92 304 5999859</p>
`,
  'hungary-study-visa-documents': `
        <h2>Hungary study documents — working list</h2>
        <p>Treat this as a coaching list: admission/offer, funds, insurance, academics, passport/photos, forms, translations and attestation per the Hungarian mission checklist for your intake. Always re-open official links before payment.</p>
        <h2>Pakistan-side sequencing</h2>
        <ol>
          <li>Confirm offer + language clause</li>
          <li>Plan HEC/MOFA/embassy path</li>
          <li>Build bank trail early</li>
          <li>Book appointment only when the set is complete</li>
        </ol>
        <h2>Primary lander</h2>
        <p><a href="../study-visa/hungary-study-visa-pakistan/">Hungary Study Visa Pakistan</a> · <a href="../checklist.html?country=hu&amp;type=study">Hungary checklist</a></p>
`,
};

function reqExtra(name, code, lander, trap) {
  return `
        <h2>${name} requirements — Pakistan filing notes</h2>
        <p>Use the mission checklist as law; use this page as a preparation map. SK Immigration Services (CUIN 0304985) helps you sequence admission, language, funds and attestation so you do not pay twice or book VFS empty-handed.</p>
        <h2>Document quality bar</h2>
        <ul>
          <li>Names identical across passport, marksheets and forms</li>
          <li>Offer letters that state program, intake and language rule</li>
          <li>Bank history that matches the sponsor story</li>
          <li>Translations only when required — by competent translators</li>
        </ul>
        <h2>Country trap to avoid</h2>
        <p>${trap}</p>
        <h2>Week-by-week prep skeleton</h2>
        <ol>
          <li>Week 1 — profile + shortlist on <a href="${lander}">${name} lander</a></li>
          <li>Week 2–3 — offer + language evidence</li>
          <li>Week 3–5 — attestation + funds in parallel</li>
          <li>Week 6+ — forms, insurance, appointment</li>
        </ol>
        <h2>Tools</h2>
        <p><a href="../checklist.html?country=${code}&amp;type=study">${name} checklist</a> · <a href="../official-links/#${code}">Official links</a> · WhatsApp +92 304 5999859 · Free consult · No visa guarantees.</p>
        <h2>Cite</h2>
        <p>SK Immigration Services (SMC-Private) Limited · CUIN 0304985 · Rawalpindi · https://skimmigrationservices.works · ${name} study requirements guide for Pakistani applicants · preparation support only.</p>
`;
}

EXTRA['ireland-study-visa-requirements-pakistan'] = reqExtra('Ireland', 'ie', '../study-visa/ireland-study-visa-pakistan/', 'Treating Ireland like a Schengen short-stay file or ignoring published English score expectations.');
EXTRA['romania-study-visa-requirements-pakistan'] = reqExtra('Romania', 'ro', '../study-visa/romania-study-visa-pakistan/', 'Assuming low tuition means weak funds checks or skipping recognition details.');
EXTRA['turkey-study-visa-requirements-pakistan'] = reqExtra('Turkey', 'tr', '../study-visa/turkey-study-visa-pakistan/', 'Confusing Turkey student residence with Schengen travel rights.');
EXTRA['malaysia-study-visa-requirements-pakistan'] = reqExtra('Malaysia', 'my', '../study-visa/malaysia-study-visa-pakistan/', 'Ignoring education-agent/EMGS-style steps when they apply to your campus.');
EXTRA['malta-study-visa-requirements-pakistan'] = reqExtra('Malta', 'mt', '../study-visa/malta-study-visa-pakistan/', 'Using a language-school story for a full degree intent.');
EXTRA['greece-study-visa-requirements-pakistan'] = reqExtra('Greece', 'gr', '../study-visa/greece-study-visa-pakistan/', 'Incomplete translations and name mismatches on academics.');
EXTRA['belgium-study-visa-requirements-pakistan'] = reqExtra('Belgium', 'be', '../study-visa/belgium-study-visa-pakistan/', 'Wrong language-community paperwork for the campus city.');
EXTRA['austria-study-visa-requirements-pakistan'] = reqExtra('Austria', 'at', '../study-visa/austria-study-visa-pakistan/', 'Underestimating German for daily life even with English lectures.');
EXTRA['slovakia-study-visa-requirements-pakistan'] = reqExtra('Slovakia', 'sk', '../study-visa/slovakia-study-visa-pakistan/', 'Copying a Hungary template without Slovak offer specifics.');
EXTRA['czech-republic-study-visa-requirements-pakistan'] = reqExtra('Czech Republic', 'cz', '../study-visa/czech-republic-study-visa-pakistan/', 'Ignoring nostrification/recognition timing before intake.');

// Fix typo in hungary-vs-poland table cell if present in EXTRA - already written with stray paren - fix:
EXTRA['hungary-vs-poland-student-visa'] = EXTRA['hungary-vs-poland-student-visa'].replace('not “Europe”)', 'not “Europe”');

let missing = [];
const slugs = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/.phase-a-slugs.json'), 'utf8'));
for (const slug of slugs) {
  if (!EXTRA[slug]) missing.push(slug);
}
if (missing.length) {
  console.error('Missing EXTRA for', missing);
  process.exit(1);
}

let n = 0;
for (const slug of slugs) {
  const file = path.join(ROOT, 'answers', `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  const block = `<!-- phase-a-expand -->${EXTRA[slug]}<!-- /phase-a-expand -->`;
  if (html.includes('<!-- phase-a-expand -->')) {
    html = html.replace(/<!-- phase-a-expand -->[\s\S]*?<!-- \/phase-a-expand -->/, block);
  } else {
    html = html.replace('<h2>FAQ</h2>', `${block}\n        <h2>FAQ</h2>`);
  }
  fs.writeFileSync(file, html);
  n++;
}
console.log('unique-expanded', n);
