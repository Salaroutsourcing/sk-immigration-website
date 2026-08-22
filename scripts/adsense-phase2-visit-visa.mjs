#!/usr/bin/env node
/**
 * AdSense Track B Phase 2 — unique visit-visa lander depth (English only).
 * Replaces <!-- lander-depth --> blocks with country-specific editorial content.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const VISIT = path.join(ROOT, 'public', 'visit-visa');
const TODAY = '2026-08-22';
const DEPTH_RE = /<!-- lander-depth -->[\s\S]*?<!-- \/lander-depth -->/;

/** Schengen + other visit destinations — unique editorial per country */
const COUNTRIES = {
  belgium: {
    name: 'Belgium',
    code: 'be',
    hook: 'EU hub visits with strict Schengen logic',
    intro:
      'Belgium processes Schengen short-stay visits for tourism, family and short business meetings. Pakistani applicants often combine Brussels with neighbouring countries — your file must still justify applying through Belgium when Belgium is the main destination.',
    vfs: 'Short-stay applications are handled through the Belgian mission’s appointed VFS Global centres in Pakistan (typically Islamabad and Karachi — verify the live list).',
    centres: 'Islamabad · Karachi (confirm on VFS Belgium Pakistan before travel)',
    tourism:
      'Tourists should show a day plan in Belgium (Brussels, Bruges, Antwerp) with hotels or host proof that matches ticket dates. “Europe tour” PDFs with no Belgian nights fail when you apply via Belgium.',
    family:
      'Family visits need a lawful invitation, host identity and address proof, plus your own employment and family ties in Pakistan. A host letter alone does not erase weak return intent.',
    business:
      'EU meetings or company visits need bilateral letters naming dates, venues and that you are not taking Belgian employment.',
    processing: 'Often 2–6 weeks after biometrics; summer and pre-holiday peaks add queue time.',
    funds:
      'Plan funds for daily subsistence plus hotels/transport. Schengen missions look at six-month statement history — sudden unexplained PKR deposits before apply are a common Pakistan refusal theme.',
    mistakes: [
      'Main nights in France/Netherlands but applying via Belgium',
      'Insurance end date before return flight',
      'Incomplete host attestation or missing host income proof',
      'Leave letter dates that do not match travel',
      'Using visit status to scout illegal work',
    ],
    studyLink: 'belgium-study-visa-pakistan',
  },
  austria: {
    name: 'Austria',
    code: 'at',
    hook: 'Alpine tourism and Vienna city breaks',
    intro:
      'Austria attracts Pakistani visitors for Vienna culture trips, skiing regions and family visits in the Schengen zone. Files must show Austria as the credible main destination when you lodge via Austria.',
    vfs: 'Austria Schengen visas from Pakistan are submitted through VFS Global under Austrian mission rules.',
    centres: 'Islamabad · Karachi',
    tourism:
      'Winter ski or summer lake itineraries should name Austrian cities, transport and paid accommodation — not only a generic “Schengen trip”.',
    family:
      'Hosts in Austria must provide invitation formats accepted by the Austrian mission; relationship evidence from Pakistan still matters.',
    business:
      'Conference or supplier visits need employer letters on both sides with meeting purpose — not employment promises.',
    processing: 'Often 2–8 weeks depending on season and file quality.',
    funds:
      'Match bank history to trip cost and ongoing Pakistan commitments. Sponsors need traceable income, not one-day transfers.',
    mistakes: [
      'Itinerary dominated by Germany/Italy with token Austrian hotel',
      'Travel insurance below Schengen minimum or wrong dates',
      'Unexplained cash deposits before biometrics',
      'Prior Schengen refusals not addressed in cover letter',
    ],
    studyLink: 'austria-study-visa-pakistan',
  },
  slovakia: {
    name: 'Slovakia',
    code: 'sk',
    hook: 'Central Europe visits off the main tourist trail',
    intro:
      'Slovakia is a valid Schengen main destination for focused trips to Bratislava or regional tourism. Pakistani applicants should not use Slovakia only as a “backup embassy” while planning most nights elsewhere.',
    vfs: 'Applications are lodged via VFS Global for the Slovak mission in Pakistan.',
    centres: 'Islamabad · Karachi',
    tourism:
      'Show concrete Slovak cities, hotels and transport. Pairing with Prague or Vienna is fine if Slovak nights remain the main block.',
    family:
      'Family invitations must meet Slovak Schengen checklist items — verify the current PDF rather than WhatsApp templates.',
    business:
      'Short supplier or factory visits need dated meeting evidence; no local payroll implied.',
    processing: 'Often 2–6 weeks; allow buffer before non-refundable tickets.',
    funds:
      'Demonstrate subsistence for the whole Schengen period plus living costs continuing in Pakistan.',
    mistakes: [
      'Visa shopping after refusals elsewhere without fixing file',
      'Hotel bookings that cancel before decision',
      'Weak employment proof for salaried applicants',
      'Insurance not covering full itinerary',
    ],
    studyLink: 'slovakia-study-visa-pakistan',
  },
  greece: {
    name: 'Greece',
    code: 'gr',
    hook: 'Islands, heritage tourism and family reunions',
    intro:
      'Greece is a popular Schengen destination for Pakistani tourists and families visiting relatives. Summer peak seasons tighten appointment slots — complete files before chasing dates.',
    vfs: 'Greek Schengen applications from Pakistan go through VFS Global centres under Embassy of Greece rules.',
    centres: 'Islamabad · Karachi',
    tourism:
      'Island-hopping plans must show ferry/flight logic and paid hotels per island. “Open tourism” without dates fails credibility checks.',
    family:
      'Greek hosts should supply lawful invitation and status proof; you still need Pakistani ties and funds.',
    business:
      'Shipping, tourism-sector or trade meetings need bilateral company letters with verifiable contacts.',
    processing: 'Often 2–8 weeks; July–August peaks slow decisions.',
    funds:
      'Island trips cost more than mainland-only plans — balances should reflect realistic daily spend, not minimum scraping.',
    mistakes: [
      'Applying via Greece with no Greek nights',
      'Non-refundable tickets bought before decision',
      'Fake hotel vouchers from unknown agents',
      'Ignoring prior Schengen refusal letters',
    ],
    studyLink: null,
  },
  'czech-republic': {
    name: 'Czech Republic',
    code: 'cz',
    hook: 'Prague tourism and Central Europe entry',
    intro:
      'Czech Republic (Czechia) Schengen visits cover Prague tourism, family stays and short business. Many Pakistani travellers combine Prague with neighbouring countries — main-destination logic still applies.',
    vfs: 'Czech short-stay visas are submitted through VFS Global for the Czech mission.',
    centres: 'Islamabad · Karachi',
    tourism:
      'Prague-focused itineraries with museums, hotels and return flights read stronger than vague “Europe visit”.',
    family:
      'Host documents must match Czech mission formats; attest translations when required.',
    business:
      'IT, manufacturing or conference visits need employer authorization letters with dates.',
    processing: 'Often 2–6 weeks after biometrics.',
    funds:
      'Six-month statements with salary trail; large gifts need donor explanation and tax trail where applicable.',
    mistakes: [
      'Main stay in Germany but Czech application',
      'Insurance gaps on multi-country trips',
      'Employment letters without leave approval dates',
      'Cover letter copied from another country page',
    ],
    studyLink: 'czech-republic-study-visa-pakistan',
  },
  cyprus: {
    name: 'Cyprus',
    code: 'cy',
    hook: 'Mediterranean visits — Schengen and route awareness',
    intro:
      'Cyprus draws Pakistani visitors for tourism and family links. Confirm whether your trip uses the Schengen short-stay route applicable from Pakistan for your passport category — rules differ for north/south entry contexts; verify on official mission pages before paying agents.',
    vfs: 'Cyprus visa applications from Pakistan are handled through the appointed centre listed on the official Cyprus / VFS Pakistan pages.',
    centres: 'Confirm live centre on official links before booking travel to a VAC',
    tourism:
      'Beach and resort plans should show paid accommodation and return employment in Pakistan — tourism is not a work search strategy.',
    family:
      'Family visits need relationship proof and host documentation as listed for your case type.',
    business:
      'Property or business inspection trips need company letters and realistic meeting schedules.',
    processing: 'Often 2–6 weeks; verify current mission published timelines.',
    funds:
      'Show trip cost plus ongoing Pakistan obligations; resort-heavy trips need higher plausible balances.',
    mistakes: [
      'Confusing visit visa with long-stay or study routes',
      'Incomplete property or host paperwork',
      'Assuming EU visit equals easy work conversion',
      'Weak ties for first-time travellers',
    ],
    studyLink: 'cyprus-study-visa-pakistan',
  },
  malta: {
    name: 'Malta',
    code: 'mt',
    hook: 'Island Schengen stays and English-speaking tourism',
    intro:
      'Malta Schengen visits suit short island tourism and family trips. Small-country missions still apply full Schengen credibility tests on Pakistani files.',
    vfs: 'Malta applications are lodged via the VFS/TLS channel listed for Malta in Pakistan.',
    centres: 'Islamabad · Karachi (verify live list)',
    tourism:
      'Hotel blocks on Malta with ferry/flight logic to the island; day plans beat generic “Mediterranean holiday”.',
    family:
      'Hosts must meet Maltese invitation requirements; your Pakistani job and family anchors remain central.',
    business:
      'Gaming, maritime or services-sector meetings need verifiable invite letters.',
    processing: 'Often 2–6 weeks.',
    funds:
      'Island accommodation can be pricey — statements should support stated hotel category.',
    mistakes: [
      'Using Malta as Schengen shopping embassy',
      'Insurance not covering Malta dates',
      'Unverified hotel prepayments to agents',
      'Study intent hidden behind tourism',
    ],
    studyLink: 'malta-study-visa-pakistan',
  },
  romania: {
    name: 'Romania',
    code: 'ro',
    hook: 'EU travel — Schengen entry rules evolving',
    intro:
      'Romania issues national and Schengen-related short stays under EU rules that change. Always read the current Romanian mission page for Pakistan — do not rely on old forum posts about “non-Schengen Romania”.',
    vfs: 'Romanian visa applications use the centre named on the Embassy of Romania Pakistan / VFS instructions.',
    centres: 'Confirm on official Romania links hub',
    tourism:
      'Bucharest and Transylvania itineraries with credible hotels and transport bookings.',
    family:
      'Invitation letters and host registration per Romanian checklist.',
    business:
      'Trade or factory visits with dated meetings on both sides.',
    processing: 'Often 2–8 weeks — verify published service standards.',
    funds:
      'Lower living costs than Western Europe still require honest subsistence math in cover letters.',
    mistakes: [
      'Outdated Schengen travel assumptions',
      'Incomplete translations of civil documents',
      'Funds only shown for one week on a month-long plan',
      'Ignoring multi-country main-destination rule',
    ],
    studyLink: 'romania-study-visa-pakistan',
  },
  hungary: {
    name: 'Hungary',
    code: 'hu',
    hook: 'Budapest tourism and thermal-city visits',
    intro:
      'Hungary is a Schengen visit destination for Budapest city breaks and regional tourism. Pakistani applicants with strong study interest should compare visit vs student routes — degrees need national student visas.',
    vfs: 'Hungary Schengen applications from Pakistan are submitted through VFS Global.',
    centres: 'Islamabad · Karachi',
    tourism:
      'Budapest hotel and activity plan with leave letter matching dates.',
    family:
      'Hungarian host invitations plus Pakistani family registry evidence when visiting relatives.',
    business:
      'EU vendor or conference visits with employer NOC.',
    processing: 'Often 2–6 weeks.',
    funds:
      'Mid-range European daily costs — show statements supporting hotels and food realistically.',
    mistakes: [
      'Booking VFS before insurance is purchased',
      'Tourism story while holding admission letters for Hungarian universities',
      'Unexplained forex inflows',
      'Weak return date logic',
    ],
    studyLink: 'hungary-study-visa-pakistan',
  },
  netherlands: {
    name: 'Netherlands',
    code: 'nl',
    hook: 'Amsterdam tourism and family visits',
    intro:
      'Netherlands Schengen visits require clear purpose for Dutch stays. Many Pakistani families visit relatives in the Randstad — ties and funds must still be documented on the applicant side.',
    vfs: 'Netherlands visas from Pakistan are handled through VFS Global under Dutch mission rules.',
    centres: 'Islamabad · Karachi',
    tourism:
      'Amsterdam/Rotterdam itineraries with museums, hotels and transport — credible day-level detail.',
    family:
      'Host guarantees and registration forms as per Dutch checklist; relationship proof from Pakistan.',
    business:
      'Port logistics, tech or conference visits with bilateral meeting proof.',
    processing: 'Often 2–8 weeks in peak seasons.',
    funds:
      'High Western European subsistence — balances should reflect Amsterdam hotel tiers honestly.',
    mistakes: [
      'Applying via Netherlands with minimal Dutch nights',
      'Sponsor in NL without income proof',
      'Student intent disguised as tourism',
      'Insurance below €30,000 medical cover',
    ],
    studyLink: 'netherlands-study-visa-pakistan',
  },
  portugal: {
    name: 'Portugal',
    code: 'pt',
    hook: 'Lisbon coast tourism and Schengen entry',
    intro:
      'Portugal Schengen visits cover Atlantic tourism, family stays and short business. Portuguese missions apply standard Schengen credibility tests to Pakistani applicants.',
    vfs: 'Portugal applications use VFS Global centres listed for the Portuguese mission in Pakistan.',
    centres: 'Islamabad · Karachi',
    tourism:
      'Lisbon/Porto plans with hotels and return employment proof.',
    family:
      'Host invitation and status documentation per Portuguese requirements.',
    business:
      'Trade or tourism-sector meetings with dated letters.',
    processing: 'Often 2–6 weeks.',
    funds:
      'Coastal peak-season trips need higher plausible daily spend in statements.',
    mistakes: [
      'Spain-heavy itinerary filed via Portugal',
      'Cancelled hotel reservations before decision',
      'Weak cover letters',
      'Prior Schengen refusals unaddressed',
    ],
    studyLink: 'portugal-study-visa-pakistan',
  },
  poland: {
    name: 'Poland',
    code: 'pl',
    hook: 'Warsaw/Krakow tourism and family visits',
    intro:
      'Poland is both a study destination and a Schengen visit route. Visit files must show temporary tourism/family purpose — not a hidden student or work plan.',
    vfs: 'Polish Schengen visas from Pakistan are submitted through VFS Global.',
    centres: 'Islamabad · Karachi',
    tourism:
      'City-specific plans for Warsaw, Krakow or northern lakes — hotels matching dates.',
    family:
      'Polish invitation formats with host registration when required.',
    business:
      'Manufacturing or EU supply-chain visits with employer letters.',
    processing: 'Often 2–6 weeks.',
    funds:
      'Lower cost than UK but still needs six-month statement discipline.',
    mistakes: [
      'Visit application while holding Polish admission deposits',
      'Fake invitation sellers on social media',
      'Insurance not Schengen-compliant',
      'Unrealistic multi-month “tourism”',
    ],
    studyLink: 'poland-study-visa-pakistan',
  },
  spain: {
    name: 'Spain',
    code: 'es',
    hook: 'Madrid, Barcelona and coastal tourism',
    intro:
      'Spain is one of the busiest Schengen visit routes for Pakistani tourists and families. Peak summer appointment scarcity rewards applicants who prepare documents before slot hunting.',
    vfs: 'Spain Schengen applications from Pakistan go through BLS International / appointed centres per Spanish mission instructions.',
    centres: 'Islamabad · Karachi (verify BLS Spain Pakistan portal)',
    tourism:
      'Coastal or city itineraries with paid hotels and return employment proof.',
    family:
      'Spanish host documentation plus Pakistani civil evidence.',
    business:
      'Trade fair or company visits with dated invitations.',
    processing: 'Often 2–8 weeks; summer peaks are slower.',
    funds:
      'Tourism-heavy seasons need credible balances for hotels and daily spend.',
    mistakes: [
      'BLS slot bought before file complete',
      'Itinerary mostly France/Italy',
      'Non-refundable flights before approval',
      'Ignoring prior Schengen refusal reasons',
    ],
    studyLink: 'spain-study-visa-pakistan',
  },
  france: {
    name: 'France',
    code: 'fr',
    hook: 'AEG appointments and attestation d\'accueil',
    intro:
      'France Schengen visits from Pakistan require France-Visas forms, compliant insurance and often AEG appointment channels. Family stays frequently need attestation d\'accueil from French hosts.',
    vfs: 'Ordinary-passport France visa appointments in Pakistan are booked through AEG Travel Services after France-Visas submission.',
    centres: 'AEG Islamabad-linked process — follow Embassy of France Pakistan instructions',
    tourism:
      'Paris/regional plans with hotels or lawful host paperwork; day-by-day itinerary matching insurance dates.',
    family:
      'Attestation d\'accueil from French mairie for hosted stays; still need Pakistani ties.',
    business:
      'Company invitations with meeting schedules — not employment offers on visit status.',
    processing: 'Often 2–8 weeks after biometrics via AEG path.',
    funds:
      'Many planners use ~€65/day with prepaid hotel or higher without — confirm France-Visas subsistence guidance; match PKR history to trip.',
    mistakes: [
      'Missing attestation d\'accueil for family stays',
      'AEG slot without complete insurance',
      'Main destination actually Italy/Spain',
      'Sudden bank deposits before apply',
    ],
    studyLink: 'france-study-visa-pakistan',
  },
  italy: {
    name: 'Italy',
    code: 'it',
    hook: 'Rome, Milan tourism and family reunions',
    intro:
      'Italy Schengen visits cover heritage tourism, fashion/business districts and large Pakistani family networks in northern Italy. Files must show Italy as main destination when applying via Italy.',
    vfs: 'Italy visas from Pakistan are lodged through VFS Global / appointed centres per Italian mission rules.',
    centres: 'Islamabad · Karachi',
    tourism:
      'City and regional plans with hotels, trains and museum bookings aligned to dates.',
    family:
      'Italian host invitations and status proof; Pakistani relationship documents.',
    business:
      'Supplier or fashion-industry meetings with bilateral letters.',
    processing: 'Often 2–8 weeks.',
    funds:
      'Northern Italy hotel costs exceed southern regions — statements should match chosen tier.',
    mistakes: [
      'Swiss/Austria-heavy trip filed via Italy',
      'Dichiarazione di ospitalità missing or incomplete',
      'Tourism while holding Italian university offers',
      'Weak employment letters',
    ],
    studyLink: 'italy-study-visa-pakistan',
  },
  switzerland: {
    name: 'Switzerland',
    code: 'ch',
    hook: 'Alpine tourism at higher subsistence levels',
    intro:
      'Switzerland Schengen visits are credible for focused Alpine tourism or family/business with Swiss hosts. High local costs mean fund evidence must look realistic — not minimum-balance games.',
    vfs: 'Swiss Schengen applications from Pakistan use VFS Global under Swiss mission rules.',
    centres: 'Islamabad · Karachi',
    tourism:
      'Swiss city/Alpine itinerary with expensive hotels reflected in fund planning.',
    family:
      'Swiss host guarantees per checklist; applicant ties in Pakistan remain mandatory.',
    business:
      'Banking, pharma or watch-industry meetings with verifiable invites.',
    processing: 'Often 2–8 weeks.',
    funds:
      'Among the highest European daily costs — officers expect proportionate balances and income.',
    mistakes: [
      'France/Germany-heavy trip via Switzerland',
      'Insurance limits too low for trip length',
      'Underestimating Swiss hotel prices in cover letter',
      'Visit route used to scout illegal work',
    ],
    studyLink: 'switzerland-study-visa-pakistan',
  },
  ireland: {
    name: 'Ireland',
    code: 'ie',
    hook: 'Not Schengen — separate UK-adjacent visit route',
    intro:
      'Ireland is outside the Schengen Area. Pakistani visitors need the Irish short-stay permission route — do not confuse a Schengen visa with legal entry to Ireland.',
    vfs: 'Irish visa applications from Pakistan are submitted through VFS Global for the Irish Naturalisation and Immigration Service (INIS) process.',
    centres: 'Islamabad · Karachi',
    tourism:
      'Tourism itineraries for Dublin and regions with hotels and return ties.',
    family:
      'Family visit invitations per Irish checklist; relationship and host status proof.',
    business:
      'Short business visits with Irish company letters and Pakistani employer NOC.',
    processing: 'Often 4–8 weeks; plan before non-refundable tickets.',
    funds:
      'Show funds for Irish daily costs plus ongoing Pakistan commitments; INIS examines credibility closely.',
    mistakes: [
      'Assuming UK visa covers Ireland',
      'Assuming Schengen visa covers Ireland',
      'Weak purpose for long stays',
      'Unexplained financial spikes',
    ],
    studyLink: 'ireland-study-visa-pakistan',
  },
  germany: {
    name: 'Germany',
    code: 'de',
    hook: 'VFS national vs Schengen visit distinction',
    intro:
      'Germany Schengen visits cover tourism, family and business short stays. Long study or Ausbildung needs a national visa — not a tourist Schengen file.',
    vfs: 'German Schengen short-stay applications from Pakistan are submitted through VFS Global Germany.',
    centres: 'Islamabad · Karachi',
    tourism:
      'City and regional plans; Christmas-market season peaks tighten slots.',
    family:
      'Verpflichtungserklärung or host paperwork when applicable; verify current forms.',
    business:
      'Trade fair (Messe) or supplier visits with dated bilateral letters.',
    processing: 'Often 2–8 weeks for Schengen visit category.',
    funds:
      'Blocked-account logic applies to students — not tourists. Tourists need liquid funds matching trip + Pakistan life.',
    mistakes: [
      'Using Schengen visit to enter for Ausbildung/job hunt',
      'Insurance not covering full Schengen period',
      'Main destination actually another country',
      'Ignoring prior Schengen refusals',
    ],
    studyLink: 'germany-study-visa-pakistan',
  },
  canada: {
    name: 'Canada',
    code: 'ca',
    hook: 'TRV visitor records and family visits',
    intro:
      'Canada visitor visas (Temporary Resident Visa) from Pakistan require online IRCC applications, biometrics and strong ties to Pakistan. Officers assess temporary intent — not just bank balance.',
    vfs: 'After IRCC approval instructions, biometrics and passport submission use VFS Global Canada in Pakistan.',
    centres: 'Islamabad · Karachi · Lahore (verify VFS Canada Pakistan)',
    tourism:
      'Tourism needs credible itinerary, funds and employment; prior US/UK travel helps but does not replace ties.',
    family:
      'Super visa and family visit streams have different rules — confirm category before applying.',
    business:
      'Business visitor letters from Canadian and Pakistani companies with meeting scope.',
    processing: 'Often several weeks to months depending on IRCC queues.',
    funds:
      'Funds must cover trip and show income history; borrowed lumps fail credibility checks.',
    mistakes: [
      'TRV filed with hidden study/work intent',
      'Weak employment proof for young applicants',
      'Prior refusals not explained',
      'Biometrics deadline missed',
    ],
    studyLink: 'canada-study-visa-pakistan',
  },
  turkey: {
    name: 'Turkey',
    code: 'tr',
    hook: 'e-Visa vs sticker visa awareness',
    intro:
      'Turkey offers e-Visa and sticker routes depending on passport history and purpose. Pakistani applicants must use the channel IRCC/Turkey currently assigns — verify before paying agents.',
    vfs: 'Sticker visas and some categories use VFS/iDATA centres in Pakistan; e-Visa uses the official Republic of Turkey e-Visa portal when eligible.',
    centres: 'Islamabad · Karachi · Lahore (sticker route — confirm live list)',
    tourism:
      'Hotel and flight plans for Istanbul/Antalya tourism with return employment proof for sticker files.',
    family:
      'Family visits may need invitations and relationship proof per sticker checklist.',
    business:
      'Trade visits with company letters — not informal buying trips without paperwork.',
    processing: 'e-Visa can be fast when eligible; sticker routes often 1–4 weeks.',
    funds:
      'Sticker applications need bank history; e-Visa eligibility does not remove scrutiny at border.',
    mistakes: [
      'Wrong visa product (e-Visa vs sticker)',
      'Tourism used to scout illegal work',
      'Invalid invitation PDFs from brokers',
      'Ignoring prior Turkey entry violations',
    ],
    studyLink: 'turkey-study-visa-pakistan',
  },
  malaysia: {
    name: 'Malaysia',
    code: 'my',
    hook: 'Tourism and family visits to ASEAN hub',
    intro:
      'Malaysia visit routes from Pakistan cover tourism, family and short business. Requirements depend on the visa category and current Malaysian High Commission instructions.',
    vfs: 'Malaysian visa applications from Pakistan are submitted through the appointed visa application centre listed by the High Commission of Malaysia.',
    centres: 'Islamabad (confirm High Commission Malaysia Pakistan page)',
    tourism:
      'Hotel bookings, funds and return employment for tourism categories.',
    family:
      'Family visit letters and relationship proof as per checklist.',
    business:
      'Company invitation for meetings — not employment without work pass.',
    processing: 'Often 1–3 weeks when file is complete.',
    funds:
      'Show funds for stay plus ongoing Pakistan obligations.',
    mistakes: [
      'Confusing visit with student pass routes',
      'Fake hotel vouchers',
      'Weak ties for young solo travellers',
      'Overstaying prior Malaysian visits',
    ],
    studyLink: 'malaysia-study-visa-pakistan',
  },
  australia: {
    name: 'Australia',
    code: 'au',
    hook: 'Subclass 600 visitor credibility',
    intro:
      'Australia visitor visas from Pakistan are assessed online via ImmiAccount. Officers focus on genuine temporary entry, health, character and funds — similar rigour to US/UK visitor routes.',
    vfs: 'Biometrics for Australian visas in Pakistan are collected at the Australian Biometrics Collection Centre (ABCC) after ImmiAccount lodgement.',
    centres: 'Islamabad · Karachi · Lahore (verify ABCC Australia Pakistan)',
    tourism:
      'Tourism needs itinerary, funds and strong Pakistani anchors; prior compliant travel helps.',
    family:
      'Family sponsored streams have specific forms — use correct subclass.',
    business:
      'Business visitor activities with Australian and Pakistani company letters.',
    processing: 'Often 2–8 weeks or longer in peak periods.',
    funds:
      'Demonstrate access to funds for stay and ties; health insurance may be requested.',
    mistakes: [
      'Visitor visa with hidden study intent',
      'Incomplete ImmiAccount answers',
      'Health exam delays ignored',
      'Prior visa cancellations unexplained',
    ],
    studyLink: null,
  },
};

function schengenBlock(c) {
  const study =
    c.studyLink
      ? `For degrees see <a href="../../study-visa/${c.studyLink}/">${c.name} study visa</a>.`
      : `For long stays see <a href="../../study-visa/">study visa hub</a>.`;
  return `
<!-- lander-depth -->
        <h2>${c.name} visit visa from Pakistan — ${c.hook}</h2>
        <p>${c.intro}</p>

        <h2>Where Pakistanis apply (${c.name})</h2>
        <p>${c.vfs}</p>
        <p><strong>Centres:</strong> ${c.centres}. Confirm the live centre list before paying travel costs to a VAC city.</p>

        <h2>Tourism visits</h2>
        <p>${c.tourism}</p>

        <h2>Family visits</h2>
        <p>${c.family}</p>

        <h2>Business visitor (short meetings)</h2>
        <p>${c.business}</p>

        <h2>Fees and processing (verify before paying)</h2>
        <table>
          <thead><tr><th>Item</th><th>Guidance</th></tr></thead>
          <tbody>
            <tr><td>Official visa fee</td><td>Mission-published fee in EUR or local currency — confirm on payment day</td></tr>
            <tr><td>VAC service fee</td><td>Separate handling charge at VFS/BLS/AEG/iDATA as applicable</td></tr>
            <tr><td>SK Immigration consultancy</td><td>Visit packaging from <strong>PKR 30,000</strong> — government fees always separate</td></tr>
            <tr><td>Typical processing</td><td>${c.processing}</td></tr>
          </tbody>
        </table>

        <h2>Pakistan-side refusal risks</h2>
        <ul>${c.mistakes.map((m) => `<li>${m}</li>`).join('')}</ul>

        <h2>Funds and credibility</h2>
        <p>${c.funds}</p>

        <h2>Visit vs study / work</h2>
        <p>Short visits cannot replace student residence or work permits. ${study} Work needs correct authorization — <a href="../../work-permit/">work permit hub</a>.</p>

        <p><a href="../../official-links/#${c.code}">Official ${c.name} links</a> · <a href="../../checklist.html?country=${c.code}&amp;type=visit">${c.name} visit checklist</a> · <a href="../../answers/visit-visa-refusal-reasons-pakistan.html">refusal reasons</a> · <a href="../../visa-appointment/">appointment guides</a></p>
<!-- /lander-depth -->`;
}

const PRIORITY_BLOCKS = {
  'uk-visit-visa-pakistan': `
<!-- lander-depth -->
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

        <h2>Where Pakistanis apply (UK)</h2>
        <p>UK visitor applications are filed online on GOV.UK, then biometrics at <strong>VFS Global UKVI</strong> centres in Pakistan (Islamabad, Karachi, Lahore — verify live list). SK Immigration sequences documents before you pay UKVI fees.</p>

        <h2>Invitation letters — help, not a stamp</h2>
        <p>An invitation from a UK resident helps family/business visits when the sponsor’s status and address are documented. It does <strong>not</strong> replace your own funds/ties analysis. Tourists can self-fund with hotels — honesty beats fake sponsors.</p>

        <h2>Visitor vs Student — do not mix</h2>
        <p>Short recreational courses may fit visitor rules; full degrees need a Student visa + CAS. Using a visit application to “enter and switch” is a refusal and ban risk. See <a href="../../answers/visit-visa-vs-student-visa.html">visit vs student</a>.</p>

        <h2>Fees and timing</h2>
        <ul>
          <li>SK Immigration visit packaging from <strong>PKR 30,000</strong></li>
          <li>UKVI + VAC fees separate — confirm on GOV.UK before payment</li>
          <li>Often 3–8 weeks; priority is paid speed, not approval</li>
        </ul>

        <h2>Cover letter structure that helps UKVI</h2>
        <ul>
          <li>Who you are and what you do in Pakistan</li>
          <li>Exact travel dates and where you stay</li>
          <li>Who pays and how the bank trail shows it</li>
          <li>Why you will return (job, business, dependents)</li>
        </ul>

        <h2>Pakistan refusal themes</h2>
        <ul>
          <li>Insufficient ties after prior refusals</li>
          <li>Sponsor claiming support without evidence</li>
          <li>Tourism with no plan or unrealistic duration</li>
          <li>Prior overstays or credibility interview issues</li>
        </ul>

        <p><a href="../../answers/uk-visit-visa-requirements-pakistan.html">UK visit requirements</a> · <a href="../../official-links/#gb">GOV.UK / VFS links</a> · <a href="../../checklist.html?country=gb&amp;type=visit">visit checklist</a> · <a href="../../visa-appointment/uk-visa-appointment-pakistan/">UK appointments</a></p>
<!-- /lander-depth -->`,

  'usa-visit-visa-pakistan': `
<!-- lander-depth -->
        <h2>USA B1/B2 from Pakistan — interview logic</h2>
        <p>US visitor visas are decided largely at the <strong>interview</strong> at the US Embassy Islamabad or Consulate Karachi. Officers test whether you are a genuine temporary visitor with a residence abroad you will not abandon.</p>

        <h2>Where Pakistanis apply (USA)</h2>
        <p>DS-160 online, visa fee (MRV), then appointment via the official US visa scheduling portal. Biometrics and interview at Islamabad or Karachi per appointment letter — never through unofficial “slot sellers”.</p>

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

        <h2>Practice interview themes</h2>
        <ul>
          <li>What is your job and monthly income?</li>
          <li>Who is paying for this trip?</li>
          <li>How long will you stay and why that duration?</li>
          <li>What ties do you have in Pakistan?</li>
          <li>Have you been refused a visa before?</li>
        </ul>

        <h2>B1 vs B2 vs study/work</h2>
        <p>B1 is business visitor activity; B2 is tourism/family. Neither is a work permit or student visa. See <a href="../../study-visa/usa-study-visa-pakistan/">USA study</a> or work guidance for other categories.</p>

        <h2>SK Immigration support</h2>
        <p>Visit packaging from <strong>PKR 30,000</strong>: document review, DS-160 coaching, interview prep. Consulate decides. <a href="../../answers/usa-b1-b2-visa-pakistan.html">B1/B2 answer</a> · <a href="../../official-links/#us">official US links</a> · <a href="../../visa-appointment/usa-visa-appointment-pakistan/">USA appointments</a>.</p>
<!-- /lander-depth -->`,

  'schengen-visit-visa-pakistan': `
<!-- lander-depth -->
        <h2>Schengen visit from Pakistan — main destination rule</h2>
        <p>Apply to the country that is your <strong>main destination</strong> (longest stay or main purpose). Shopping for the “easiest embassy” while planning most nights elsewhere is a classic refusal reason.</p>

        <h2>Where Pakistanis apply (Schengen)</h2>
        <p>Each Schengen state appoints VFS, TLS, BLS or AEG centres in Pakistan. You must use the centre for the country you apply through — not a random EU flag on a broker’s poster.</p>

        <table>
          <thead><tr><th>File part</th><th>Must show</th></tr></thead>
          <tbody>
            <tr><td>Itinerary</td><td>Days, cities, transport that match hotel/invite</td></tr>
            <tr><td>Insurance</td><td>Schengen-compliant medical cover for full trip (typically €30,000+)</td></tr>
            <tr><td>Funds</td><td>Trip cost + life continuing in Pakistan</td></tr>
            <tr><td>Ties</td><td>Job leave, business, family — return intent</td></tr>
            <tr><td>Biometrics</td><td>VFS/TLS appointment with complete set</td></tr>
          </tbody>
        </table>

        <h2>Sample 7-day tourism evidence set</h2>
        <ul>
          <li>Day-by-day city plan matching hotel bookings</li>
          <li>Return flight reservation (understand cancellation rules)</li>
          <li>Travel insurance covering the full Schengen period</li>
          <li>Employer NOC / leave letter with joining date back at work</li>
          <li>6 months bank statements + salary slips</li>
        </ul>

        <h2>Tourism vs family vs business visit</h2>
        <ul>
          <li><strong>Tourism:</strong> hotels + day plan; no fake “uncle” sponsors</li>
          <li><strong>Family:</strong> invitation + host status docs + your ties still matter</li>
          <li><strong>Business:</strong> company letters both sides; meetings that look real</li>
        </ul>

        <h2>Multi-country itineraries</h2>
        <p>If you visit France and Italy, apply where you spend the most nights. Split itineraries engineered only to chase a “weaker” visa centre are a known risk pattern.</p>

        <h2>Schengen visit is not work or study</h2>
        <p>Short stays cannot start a job or degree. See <a href="../../study-visa/">study hub</a> and <a href="../../work-permit/">work hub</a>.</p>

        <h2>SK Immigration</h2>
        <p>Visit files from <strong>PKR 30,000</strong>. We refuse to sell fake “priority slots.” <a href="../../answers/schengen-visit-visa-from-pakistan-how.html">How to apply</a> · <a href="../../answers/schengen-visit-visa-requirements.html">requirements</a> · <a href="../../visa-appointment/schengen-visa-appointment-pakistan/">appointments</a>.</p>
<!-- /lander-depth -->`,

  'dubai-visit-visa-pakistan': `
<!-- lander-depth -->
        <h2>Dubai / UAE visit from Pakistan — tourism vs status confusion</h2>
        <p>UAE visit products change by airline, hotel packages and sponsor types. Your job is to match the <strong>correct visit product</strong> to a real trip — not to treat a visit entry as a hidden work visa.</p>

        <h2>Where Pakistanis apply (UAE)</h2>
        <p>Many tourism visits use airline/hotel bundles or sponsor channels via UAE entities; employment needs separate work authorization. Verify GDRFA / ICP rules for your product — not Instagram “5-year package” ads.</p>

        <table>
          <thead><tr><th>Scenario</th><th>Usually need</th><th>Do not</th></tr></thead>
          <tbody>
            <tr><td>Short tourism</td><td>Valid passport, funds/hotel or package rules for that product</td><td>Expect to work on visit status</td></tr>
            <tr><td>Family visit</td><td>Host/sponsor documents as required</td><td>Fake relationship letters</td></tr>
            <tr><td>Business meetings</td><td>Invite + company paperwork</td><td>Use visit to start employment</td></tr>
          </tbody>
        </table>

        <h2>Choosing a visit product without overpaying</h2>
        <p>Airline + hotel bundles, sponsor visas and different durations each have document quirks. SK Immigration maps the product to your passport history and trip purpose before you pay a package seller.</p>

        <h2>Overstay and status risks</h2>
        <p>Overstaying UAE visit status creates fines and future refusal risk. Exit on time. For employment see <a href="../../work-permit/uae-work-visa-pakistan/">UAE work visa</a>.</p>

        <h2>Employment seekers</h2>
        <p>Arriving on visit status to “find a job” can breach conditions. Discuss <a href="../../work-permit/uae-work-visa-pakistan/">UAE work</a> or <a href="../../saudi-visa/saudi-visa-processing-pakistan/">Saudi processing</a> instead.</p>

        <h2>Family travel with children</h2>
        <p>Carry relationship evidence and align exit dates. School leave letters help show return intent for employed parents.</p>

        <h2>SK Immigration</h2>
        <p>Visit packaging from <strong>PKR 30,000</strong> where consultancy applies. <a href="../../answers/dubai-visit-visa-from-pakistan.html">Dubai visit answer</a> · WhatsApp +92 304 5999859</p>
<!-- /lander-depth -->`,
};

function slugFromDir(dir) {
  return dir; // folder name is slug e.g. belgium-visit-visa-pakistan
}

function countryKeyFromSlug(slug) {
  const map = {
    'czech-republic-visit-visa-pakistan': 'czech-republic',
    'schengen-visit-visa-pakistan': null,
    'uk-visit-visa-pakistan': null,
    'usa-visit-visa-pakistan': null,
    'dubai-visit-visa-pakistan': null,
  };
  if (map[slug] !== undefined) return map[slug];
  const m = slug.match(/^(.+)-visit-visa-pakistan$/);
  return m ? m[1] : null;
}

let updated = 0;
for (const dir of fs.readdirSync(VISIT)) {
  const folder = path.join(VISIT, dir);
  if (!fs.statSync(folder).isDirectory()) continue;
  const file = path.join(folder, 'index.html');
  if (!fs.existsSync(file)) continue;

  const slug = slugFromDir(dir);
  let block;
  if (PRIORITY_BLOCKS[slug]) {
    block = PRIORITY_BLOCKS[slug].trim();
  } else {
    const key = countryKeyFromSlug(slug);
    const c = key && COUNTRIES[key];
    if (!c) {
      console.warn('skip (no data)', slug);
      continue;
    }
    block = schengenBlock(c).trim();
  }

  let html = fs.readFileSync(file, 'utf8');
  if (DEPTH_RE.test(html)) {
    html = html.replace(DEPTH_RE, block);
  } else {
    html = html.replace(
      /<h2>Related/,
      `${block}\n\n        <h2>Related`
    );
  }
  html = html.replace(
    /SK Immigration Services · (Updated|Reviewed) 20\d{2}-\d{2}-\d{2}/,
    `SK Immigration Services · Reviewed ${TODAY}`
  );
  fs.writeFileSync(file, html);
  updated += 1;
  console.log('visit-visa', slug);
}

console.log('Phase 2 visit-visa complete:', updated);
