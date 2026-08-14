#!/usr/bin/env node
/**
 * inject-geo-schema.mjs
 * Injects geo-schema.js script tag + HowTo + per-page FAQPage + Speakable Article schema
 * into all 20 blog guide pages. Idempotent.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const SITE_URL = 'https://immigration.salaroutsourcing.com';

const COUNTRIES = {
  'germany-student-visa': {
    flag: '🇩🇪', name: 'Germany', slug: 'germany', type: 'student',
    steps: [
      'Get university admission or Ausbildung offer letter from a German institution.',
      'Open a German blocked account (Sperrkonto) with €11,208+ (€934/month × 12).',
      'Obtain travel health insurance valid for Germany.',
      'Book your visa appointment at VFS Global (German embassy consular section).',
      'Gather all documents: passport, admission letter, blocked account proof, insurance, SOP, transcripts, CV.',
      'Attend the visa interview at the German embassy/consulate.',
      'Wait for decision (4–7 months typical). Collect passport with visa sticker.'
    ],
    totalTime: 'P6M',
    faqs: [
      { q: 'Do I need IELTS for Germany student visa?', a: 'Not always. German-taught programs need no IELTS. English-taught programs usually require IELTS or TOEFL, or an MOI (Medium of Instruction) letter. SK Immigration advises on your specific program.' },
      { q: 'What is the blocked account amount for Germany 2026?', a: 'Approximately €11,208 (€934/month × 12) as of 2025/2026. Verify the current amount at the German embassy website before applying.' },
      { q: 'How long does Germany student visa take from Pakistan?', a: 'Typically 4–7 months including university admission, blocked account opening, VFS appointment, and visa processing.' },
      { q: 'What is Germany Ausbildung?', a: "Ausbildung is Germany's dual vocational training program where you work and study simultaneously, earning €600–€1,000/month. Pakistani students can apply with B1/B2 German language skills." },
      { q: 'Can I work while studying in Germany?', a: 'Yes — up to 120 full days or 240 half days per year on a student visa.' }
    ]
  },
  'uk-student-visa': {
    flag: '🇬🇧', name: 'United Kingdom', slug: 'uk', type: 'student',
    steps: [
      'Apply to a UK university and receive an unconditional offer letter.',
      'Receive your CAS (Confirmation of Acceptance for Studies) from the university.',
      'Take an approved Secure English Language Test (IELTS UKVI, OET, PTE, TOEFL) unless exempt.',
      'Prove you have sufficient funds: tuition fees + £1,023+/month for living (more in London).',
      'Pay the Immigration Health Surcharge (IHS) online.',
      'Complete the online UK Student visa application form.',
      'Book and attend a biometrics appointment at a VFS centre.',
      'Wait for the decision (typically a few weeks after biometrics).'
    ],
    totalTime: 'P5M',
    faqs: [
      { q: 'What is CAS for UK student visa?', a: 'CAS (Confirmation of Acceptance for Studies) is a unique reference number from your licensed UK university sponsor — required before applying for a UK Student visa.' },
      { q: 'How much funds do I need for UK student visa?', a: 'You must show tuition fees + maintenance funds: at least £1,023/month for up to 9 months outside London, or £1,334/month in London. Verify current figures at GOV.UK.' },
      { q: 'Can I work on UK student visa?', a: 'Yes — typically up to 20 hours/week during term time for degree-level students (check your CAS conditions).' },
      { q: 'What is Graduate Route UK?', a: "After completing an eligible UK bachelor's or master's degree, you can apply for a 2-year Graduate Route visa to work in the UK." },
      { q: 'What is IHS for UK visa?', a: 'IHS (Immigration Health Surcharge) gives you access to NHS healthcare. It is paid per year of your visa when applying online.' }
    ]
  },
  'canada-student-visa': {
    flag: '🇨🇦', name: 'Canada', slug: 'canada', type: 'study permit',
    steps: [
      'Get admission from a DLI (Designated Learning Institution) in Canada.',
      'Gather proof of funds: tuition + CAD 10,000+ for first year living costs.',
      'Apply online through IRCC (Immigration, Refugees and Citizenship Canada).',
      'Complete biometrics at a VFS centre.',
      'Undergo medical exam if required by IRCC.',
      'Receive Letter of Introduction (LOI) if approved.',
      'Travel to Canada and get your study permit stamped at the port of entry.'
    ],
    totalTime: 'P6M',
    faqs: [
      { q: 'What is SDS for Canada study permit?', a: 'Student Direct Stream (SDS) offers faster processing (20 business days) for Pakistani students with IELTS 6.0+, a GIC of CAD 10,000, and specific financial documents.' },
      { q: 'How long does Canada study permit take from Pakistan?', a: 'Standard: 4–8 months. SDS stream: approximately 20 business days. Processing times vary — check current IRCC processing times.' },
      { q: 'Can I work in Canada on a study permit?', a: 'Yes — typically up to 20 hours/week off-campus during academic session, and full-time during scheduled breaks.' },
      { q: 'What is a DLI in Canada?', a: 'DLI (Designated Learning Institution) is a Canadian school approved by the government to enroll international students. You must be admitted to a DLI to get a study permit.' },
      { q: 'What is GIC for Canada study permit?', a: 'GIC (Guaranteed Investment Certificate) of CAD 10,000 is required for SDS applicants — deposited at a Canadian bank before applying.' }
    ]
  },
  'australia-student-visa': {
    flag: '🇦🇺', name: 'Australia', slug: 'australia', type: 'student',
    steps: [
      'Get a Confirmation of Enrolment (CoE) from an Australian institution.',
      'Arrange Overseas Student Health Cover (OSHC) — mandatory.',
      'Meet English language requirements (IELTS typically 5.5–6.5 depending on course).',
      'Apply online via Australian IMMI account for Subclass 500 Student visa.',
      'Provide Genuine Student Statement (GSS) explaining study plans.',
      'Show proof of funds sufficient for tuition + AUD 29,710+ living per year.',
      'Await visa grant (typically 4–6 weeks for straightforward applications).'
    ],
    totalTime: 'P5M',
    faqs: [
      { q: 'What is the GTE requirement for Australia student visa?', a: 'GTE (Genuine Temporary Entrant) / GSS (Genuine Student Statement) requires you to explain why you want to study in Australia and your ties to Pakistan. Replaced by GSS in 2024.' },
      { q: 'How much IELTS is required for Australia student visa?', a: 'Typically IELTS 5.5–6.5 depending on your course level. Some universities accept TOEFL or PTE Academic.' },
      { q: 'Can I work on Australia student visa?', a: 'Yes — international students can work under current DHA regulations during study sessions.' }
    ]
  },
  'france-student-visa': {
    flag: '🇫🇷', name: 'France', slug: 'france', type: 'student',
    steps: [
      'Apply to a French university through Campus France Pakistan.',
      'Complete the Campus France pre-consular procedure and attend interview.',
      "Get your acceptance letter (lettre d'admission) from the institution.",
      'Apply for a Long-Stay Student Visa (VLS-TS) at AEG (Alcazar) visa centre.',
      'Show proof of funds (approximately €615/month or €7,380/year).',
      'Obtain travel and health insurance valid for France.',
      'Await visa decision (typically 3–6 weeks after appointment).'
    ],
    totalTime: 'P5M',
    faqs: [
      { q: 'Do I need IELTS for France student visa?', a: 'Not always. French public universities are largely low-tuition. French-taught programs require French language (DELF/DALF). English-taught programs may accept IELTS, TOEFL, or MOI.' },
      { q: 'What is Campus France?', a: 'Campus France is the official French agency for promoting higher education — Pakistani students must register on Campus France and complete the pre-consular procedure before applying for a visa.' },
      { q: 'How much is France student visa fee?', a: 'Approximately €99 visa fee (verify current fees). Additionally, there are Campus France registration fees.' }
    ]
  },
  'italy-student-visa': {
    flag: '🇮🇹', name: 'Italy', slug: 'italy', type: 'student',
    steps: [
      'Apply to an Italian university and get an acceptance letter.',
      'Get a Dichiarazione di Valore (DoV) — verification of your Pakistani qualifications by the Italian embassy.',
      'Apply for a pre-enrollment number (nulla osta) via Universitaly if required.',
      'Apply for a Type D study visa at the Italian embassy or VFS.',
      'Show proof of funds (€5,977+ per year or scholarship letter).',
      'Get accommodation confirmation (letter or booking).',
      'Await visa decision and travel to Italy.'
    ],
    totalTime: 'P5M',
    faqs: [
      { q: 'Is tuition free in Italy for international students?', a: 'Italian public universities have very low tuition (€150–€3,000/year) — not completely free, but among the cheapest in Europe. Scholarships (DSU) can reduce fees to near zero.' },
      { q: 'Do I need IELTS for Italy student visa?', a: 'For English-taught programs, IELTS or TOEFL is often accepted. For Italian-taught programs, Italian language certification (B1/B2) is needed. MOI letters are accepted by many Italian universities.' },
      { q: 'What is Dichiarazione di Valore (DoV)?', a: 'DoV is a document issued by the Italian embassy verifying your Pakistani academic qualifications for Italian university admission. SK Immigration guides you through obtaining it.' }
    ]
  },
  'hungary-student-visa': {
    flag: '🇭🇺', name: 'Hungary', slug: 'hungary', type: 'student',
    steps: [
      'Apply to a Hungarian university directly or through Stipendium Hungaricum scholarship.',
      'Receive your admission/scholarship acceptance letter.',
      'Apply for a national D visa at the Hungarian embassy in Islamabad.',
      'Show proof of funds (€5,000–€6,000 for one year, or scholarship letter).',
      'Provide accommodation letter from the university dormitory.',
      'Attend the visa interview if required.',
      'Arrive in Hungary and register with local immigration (TEK) within 30 days.'
    ],
    totalTime: 'P4M',
    faqs: [
      { q: 'Can I study in Hungary with low marks?', a: 'Yes — many Hungarian universities accept students with 50–65% marks (matriculation). Stipendium Hungaricum scholarship is competitive but other programs are accessible.' },
      { q: 'What is Stipendium Hungaricum?', a: 'Stipendium Hungaricum is the Hungarian government scholarship covering full tuition, dormitory accommodation, and a monthly stipend for international students including Pakistanis.' },
      { q: 'Is English taught in Hungarian universities?', a: 'Yes — many programs in medicine, engineering, business, and IT are taught in English. Hungarian language is not required for English-medium programs.' }
    ]
  },
  'poland-student-visa': {
    flag: '🇵🇱', name: 'Poland', slug: 'poland', type: 'student',
    steps: [
      'Apply to a Polish university and receive an admission letter.',
      'Apostille your Pakistani documents (HEC + MOFA + Apostille).',
      'Apply for a national D visa at the Polish embassy in Islamabad.',
      'Show proof of funds (approximately PLN 776/month or equivalent).',
      'Obtain travel health insurance valid in Poland.',
      'Attend the visa appointment and submit documents.',
      'Arrive in Poland and apply for a Temporary Residence Card (Karta Pobytu) within 30 days.'
    ],
    totalTime: 'P4M',
    faqs: [
      { q: 'Can I study in Poland without IELTS?', a: 'Many Polish universities offer English-medium programs and accept a MOI (Medium of Instruction) letter from your previous institution instead of IELTS.' },
      { q: 'Is Poland in the Schengen Area?', a: 'Yes — a Polish student visa/residence card allows travel within the Schengen Area for up to 90 days in any 180-day period.' },
      { q: 'How much does it cost to study in Poland?', a: 'Tuition ranges from €1,000–€5,000/year for international students. Living costs are approximately €400–€700/month. Poland is one of the most affordable European study destinations.' }
    ]
  },
  'romania-student-visa': {
    flag: '🇷🇴', name: 'Romania', slug: 'romania', type: 'student',
    steps: [
      'Apply to a Romanian university and receive an acceptance letter.',
      'Apply for a study visa (type D) at the Romanian embassy.',
      'Show proof of funds sufficient for tuition and living.',
      'Obtain health insurance valid in Romania.',
      'Apostille your Pakistani academic documents.',
      'Attend visa appointment and submit all documents.',
      'Register with Romanian immigration within 30 days of arrival.'
    ],
    totalTime: 'P4M',
    faqs: [
      { q: 'Can I study medicine in Romania?', a: 'Yes — Romania has well-regarded medical universities (Carol Davila, UMF Cluj) that accept international students. SK Immigration helps with Romanian medical university admissions.' },
      { q: 'Do I need IELTS for Romania?', a: 'Many Romanian universities offer English-medium programs and accept MOI letters or require IELTS 5.5–6.0.' },
      { q: 'Is Romania safe for Pakistani students?', a: 'Romania is an EU member state with a growing international student community. Many Pakistani students currently study in Romania successfully.' }
    ]
  },
  'spain-student-visa': {
    flag: '🇪🇸', name: 'Spain', slug: 'spain', type: 'student',
    steps: [
      'Apply to a Spanish university and receive an acceptance letter.',
      'Apostille your Pakistani documents.',
      'Apply for a student visa (visado de estudios) at the Spanish embassy/consulate.',
      'Show proof of sufficient funds (€579/month minimum).',
      'Obtain valid health insurance for Spain.',
      'Attend visa appointment and submit documents.',
      'Register with local police (empadronamiento) upon arrival.'
    ],
    totalTime: 'P5M',
    faqs: [
      { q: 'Do I need Spanish language for Spain student visa?', a: 'For Spanish-taught programs yes (DELE B1/B2 recommended). Many universities offer English-medium programs — IELTS or TOEFL accepted.' },
      { q: 'How much does Spain student visa cost?', a: 'Spain student visa fee is approximately €60–€80. Additionally, there are university application and apostille fees.' },
      { q: 'Can I work on Spain student visa?', a: 'Students on a Spanish study visa can work up to 30 hours per week with a work authorization.' }
    ]
  },
  'malaysia-student-visa': {
    flag: '🇲🇾', name: 'Malaysia', slug: 'malaysia', type: 'student',
    steps: [
      'Apply to a Malaysian university or college and get a Letter of Offer.',
      'The university applies for your Student Pass through EMGS (Education Malaysia Global Services).',
      'Receive EMGS Approval Letter.',
      'Get a single-entry visa from the Malaysian High Commission in Islamabad.',
      'Travel to Malaysia and get your Student Pass stamped.',
      'Undergo medical check-up in Malaysia within 7 days of arrival.',
      'Collect Student Pass from EMGS office.'
    ],
    totalTime: 'P3M',
    faqs: [
      { q: 'Is Malaysia affordable for Pakistani students?', a: 'Yes — Malaysia is one of the most affordable English-speaking study destinations. Tuition: RM 8,000–RM 35,000/year; living costs RM 1,000–RM 2,000/month.' },
      { q: 'Do I need IELTS for Malaysia student visa?', a: "Many Malaysian universities accept MUET or waive IELTS for Pakistani students. Check each university's English requirements." },
      { q: 'What is EMGS Malaysia?', a: 'EMGS (Education Malaysia Global Services) is the government body that processes and approves Student Passes for international students in Malaysia.' }
    ]
  },
  'turkey-student-visa': {
    flag: '🇹🇷', name: 'Turkey', slug: 'turkey', type: 'student',
    steps: [
      'Apply to a Turkish university directly or through Türkiye Scholarships (Türkiye Bursları).',
      'Receive your acceptance or scholarship letter.',
      'Apply for a student visa at the Turkish embassy in Islamabad.',
      'Show proof of funds or scholarship confirmation.',
      'Obtain health insurance valid in Turkey.',
      'Attend visa appointment and submit documents.',
      'Arrive and register for a Residence Permit (İkamet) within 30 days.'
    ],
    totalTime: 'P3M',
    faqs: [
      { q: 'What is Türkiye Scholarships?', a: 'Türkiye Scholarships (Türkiye Bursları) is the Turkish government scholarship covering full tuition, accommodation, and a monthly stipend. Highly competitive — open to Pakistani students.' },
      { q: 'Can I study in Turkey in English?', a: 'Yes — many Turkish state and private universities offer English-medium programs in engineering, medicine, business, and IT.' },
      { q: 'How affordable is studying in Turkey?', a: 'Tuition at state universities: $300–$700/year for scholarship holders. Private university: $3,000–$8,000/year. Living: $400–$700/month.' }
    ]
  },
  'dubai-visit-visa': {
    flag: '🇦🇪', name: 'Dubai / UAE', slug: 'uae', type: 'visit',
    steps: [
      'Choose visa type: 30-day, 60-day, or 90-day UAE visit visa.',
      'Apply through a licensed travel agent, airline (Emirates/FlyDubai), or hotel sponsor.',
      'Provide passport copy, photograph, confirmed return ticket, and travel insurance.',
      'Show proof of accommodation (hotel booking or sponsor letter).',
      'Show bank statement showing sufficient funds.',
      'Receive visa via email (typically 3–5 working days).',
      'Travel to Dubai and get entry stamp at airport.'
    ],
    totalTime: 'P10D',
    faqs: [
      { q: 'How much does Dubai visit visa cost for Pakistani?', a: 'Approximately AED 300–500 (PKR 22,000–37,000) for a 30-day visa, excluding service charges. Prices vary by sponsor and type.' },
      { q: 'Can I extend Dubai visit visa from inside UAE?', a: 'Yes — visit visas can usually be extended once online through the ICP (Federal Authority for Identity, Citizenship, Customs and Ports Security).' },
      { q: 'How long does Dubai visa take for Pakistanis?', a: 'Typically 3–7 working days. SK Immigration helps with complete documentation.' }
    ]
  },
  'ireland-student-visa': {
    flag: '🇮🇪', name: 'Ireland', slug: 'ireland', type: 'student',
    steps: [
      'Apply to a recognized Irish higher education institution and receive an offer letter.',
      'Apply online for an Irish Study Visa (Stamp 2) through the Irish Immigration Online Service.',
      'Show proof of private medical insurance.',
      'Show proof of funds: €7,000 for 6 months or €10,000 for 12 months.',
      'Provide accommodation confirmation in Ireland.',
      'Include original acceptance letter and receipt of course fees.',
      'Attend appointment at VFS if required and await decision.'
    ],
    totalTime: 'P4M',
    faqs: [
      { q: 'Do I need IELTS for Ireland student visa?', a: 'Yes — most Irish universities require IELTS 6.0–6.5 for English-medium programs. Some accept TOEFL, PTE, or Cambridge certificates.' },
      { q: 'Can I work on Ireland student visa?', a: 'Yes — Stamp 2 (full-time education) allows up to 20 hours/week during term and 40 hours/week during holidays.' },
      { q: 'Is Ireland a good study destination for Pakistanis?', a: 'Yes — Ireland is English-speaking, EU-member, with a strong job market and post-study work options (Graduate Scheme allows staying 1–2 years after graduation).' }
    ]
  },
  'netherlands-student-visa': {
    flag: '🇳🇱', name: 'Netherlands', slug: 'netherlands', type: 'student',
    steps: [
      'Apply to a Dutch university (approved institution) and receive a conditional/unconditional offer.',
      'The university initiates your MVV (provisional residence permit) application through IND.',
      'Receive the MVV approval and collect your MVV sticker at the Dutch embassy in Islamabad.',
      'Travel to the Netherlands with your MVV within the validity period.',
      'Apply for a Residence Permit (verblijfsvergunning) at the IND within 3 days of arrival.',
      'Collect your Residence Permit card from IND.'
    ],
    totalTime: 'P5M',
    faqs: [
      { q: 'Do I need IELTS for Netherlands student visa?', a: 'Most Dutch universities require IELTS 6.0–6.5 for English-medium programs. Some have their own language tests (like NT2 for Dutch-taught programs).' },
      { q: 'What is MVV for Netherlands?', a: 'MVV (Machtiging tot Voorlopig Verblijf) is a provisional residence permit required before entry for students coming from Pakistan. Your Dutch university applies on your behalf through IND.' },
      { q: 'How expensive is studying in the Netherlands?', a: 'Tuition: €8,000–€20,000/year for non-EU students. Living costs: €800–€1,100/month. Amsterdam is more expensive than other cities.' }
    ]
  },
  'cyprus-student-visa': {
    flag: '🇨🇾', name: 'Cyprus', slug: 'cyprus', type: 'student',
    steps: [
      'Apply to a Cypriot university or college and receive an admission letter.',
      'Apply for a student visa at the Cyprus High Commission.',
      'Show proof of funds (€5,000–€8,000 per academic year).',
      'Provide health insurance valid in Cyprus.',
      'Submit academic documents, SOP, and passport.',
      'Attend visa appointment and await decision.',
      'Register with the Civil Registry and Migration Department on arrival.'
    ],
    totalTime: 'P3M',
    faqs: [
      { q: 'Is Cyprus a good study destination?', a: 'Yes — Cyprus offers affordable European education in English, EU member state benefits, and a growing tech and business sector. Popular for medicine, engineering, and business.' },
      { q: 'Can I travel to Schengen from Cyprus student visa?', a: 'Cyprus is an EU member but not yet in the Schengen Area — a Cypriot residence permit does not automatically allow Schengen travel.' },
      { q: 'How affordable is studying in Cyprus?', a: 'Tuition: €3,500–€8,000/year. Living: €600–€900/month. More affordable than most Western European countries.' }
    ]
  },
  'malta-student-visa': {
    flag: '🇲🇹', name: 'Malta', slug: 'malta', type: 'student',
    steps: [
      'Apply to a Maltese educational institution and receive an offer letter.',
      'Apply for a long-stay visa (D) at the Maltese embassy/consulate or authorized office.',
      'Show proof of funds (approximately €8,000+ per year).',
      'Obtain health insurance valid in Malta.',
      'Provide proof of accommodation in Malta.',
      'Submit all documents and await visa decision.',
      'Apply for a Residence Permit at Identity Malta on arrival.'
    ],
    totalTime: 'P3M',
    faqs: [
      { q: 'Is Malta in the Schengen Area?', a: 'Yes — Malta is a Schengen member. A Maltese residence permit allows short-stay travel within the Schengen Area.' },
      { q: 'Do Maltese universities teach in English?', a: 'Yes — English is an official language of Malta. All major universities (University of Malta, MCAST) teach primarily in English.' },
      { q: 'What courses are popular in Malta?', a: 'Gaming, iGaming, English language courses, business, finance, and tourism/hospitality are popular fields in Malta.' }
    ]
  },
  'slovakia-student-visa': {
    flag: '🇸🇰', name: 'Slovakia', slug: 'slovakia', type: 'student',
    steps: [
      'Apply to a Slovak university and receive an admission letter.',
      'Apply for a temporary residence permit for study purposes at the Slovak embassy.',
      'Show proof of funds (approximately €2,700+ per year for living).',
      'Obtain health insurance valid in Slovakia.',
      'Apostille your Pakistani academic documents.',
      'Attend visa/residence permit appointment.',
      "Register with the Slovak Foreigners' Police within 3 working days of arrival."
    ],
    totalTime: 'P4M',
    faqs: [
      { q: 'Is Slovakia in the Schengen Zone?', a: 'Yes — Slovakia is a Schengen member state. Your Slovak residence permit allows travel within the Schengen Area.' },
      { q: 'How affordable is Slovakia for students?', a: 'Very affordable — tuition is low or free at Slovak state universities if studying in Slovak language. English-taught programs: €2,000–€6,000/year. Living: €400–€600/month.' },
      { q: 'Can I study in Slovakia in English?', a: 'Yes — several Slovak universities offer English-medium programs, especially in medicine, engineering, and economics.' }
    ]
  },
  'czech-republic-student-visa': {
    flag: '🇨🇿', name: 'Czech Republic', slug: 'czech', type: 'student',
    steps: [
      'Apply to a Czech university and receive an acceptance letter.',
      'Apply for a long-term visa for study purposes at the Czech embassy in Islamabad.',
      'Show proof of funds (approximately CZK 3,410/month or more).',
      'Obtain health insurance valid in Czech Republic.',
      'Apostille and translate your Pakistani documents.',
      'Attend visa appointment — early booking essential (high demand).',
      'Apply for a residence permit (povolení k pobytu) after arrival.'
    ],
    totalTime: 'P5M',
    faqs: [
      { q: 'How competitive is Czech Republic student visa for Pakistanis?', a: 'Czech visa appointments are in high demand — book early (3–6 months in advance). SK Immigration helps monitor appointment slots.' },
      { q: 'Can I study at Charles University Czech Republic?', a: 'Charles University in Prague is one of the oldest universities in Europe and offers English-medium programs. Competitive admission but accessible with good marks.' },
      { q: 'Is Czech Republic in Schengen?', a: 'Yes — Czech Republic is a full Schengen member. Your Czech residence permit allows Schengen travel.' }
    ]
  },
  'portugal-student-visa': {
    flag: '🇵🇹', name: 'Portugal', slug: 'portugal', type: 'student',
    steps: [
      'Apply to a Portuguese higher education institution and receive an acceptance letter.',
      'Apply for a student visa (visto de estudo) at the Portuguese embassy or SEF-authorized service.',
      'Show proof of funds (at least €760/month or €9,120/year).',
      'Obtain health insurance valid in Portugal.',
      'Provide accommodation confirmation.',
      'Attend visa appointment with complete documents.',
      'Apply for a residence permit (Autorização de Residência) at AIMA (SEF) within 90 days of arrival.'
    ],
    totalTime: 'P4M',
    faqs: [
      { q: 'Is Portugal affordable for Pakistani students?', a: 'Yes — relatively affordable compared to Western Europe. Tuition: €950–€7,000/year at public universities. Living: €700–€1,000/month in Lisbon (less in other cities).' },
      { q: 'Do I need Portuguese for Portugal student visa?', a: 'Not for English-medium programs. Many Portuguese universities offer programs in English. Portuguese language is helpful for integration but not always mandatory.' },
      { q: 'Does Portugal offer NHR tax regime for graduates?', a: 'Portugal offers attractive post-study and job seeker visas for graduates — a growing tech and startup hub. SK Immigration advises on post-study options.' }
    ]
  }
};

function buildHowToSchema(slug, meta) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Apply for ${meta.name} ${meta.type.charAt(0).toUpperCase() + meta.type.slice(1)} Visa from Pakistan`,
    "description": `Step-by-step guide to applying for a ${meta.name} ${meta.type} visa from Pakistan. Prepared by SK Immigration Services (SECP CUIN 0304985).`,
    "image": `${SITE_URL}/assets/img/og-share.jpg`,
    "totalTime": meta.totalTime,
    "supply": [
      { "@type": "HowToSupply", "name": "Valid Pakistani Passport" },
      { "@type": "HowToSupply", "name": "Academic Transcripts and Certificates" },
      { "@type": "HowToSupply", "name": "Bank Statement / Proof of Funds" },
      { "@type": "HowToSupply", "name": "Health Insurance" },
      { "@type": "HowToSupply", "name": "Statement of Purpose (SOP)" }
    ],
    "tool": [
      { "@type": "HowToTool", "name": "SK Immigration Document Checklist", "url": `${SITE_URL}/checklist.html?country=${meta.slug}` },
      { "@type": "HowToTool", "name": "SK Immigration Cost Calculator", "url": `${SITE_URL}/calculator.html?country=${meta.slug}` }
    ],
    "step": meta.steps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.split('.')[0],
      "text": step,
      "url": `${SITE_URL}/blog/${slug}/#step-${i+1}`
    })),
    "author": {
      "@type": "Organization",
      "name": "SK Immigration Services",
      "url": SITE_URL
    }
  };
}

function buildFAQSchema(meta) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": meta.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a + ` For expert help, contact SK Immigration Services: ${SITE_URL} — WhatsApp: +92 304 5999859`
      }
    }))
  };
}

function buildArticleSchema(slug, meta) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${meta.name} ${meta.type.charAt(0).toUpperCase() + meta.type.slice(1)} Visa Guide 2026 — Complete Guide by SK Immigration Services`,
    "description": `Complete guide to ${meta.name} ${meta.type} visa from Pakistan: requirements, costs, process steps, documents, and timelines. By SK Immigration Services (SECP CUIN 0304985).`,
    "image": `${SITE_URL}/assets/img/og-share.jpg`,
    "datePublished": "2026-01-15",
    "dateModified": "2026-08-14",
    "author": {
      "@type": "Organization",
      "name": "SK Immigration Services",
      "@id": SITE_URL + "/#organization"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SK Immigration Services",
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/assets/img/logo.svg` }
    },
    "mainEntityOfPage": `${SITE_URL}/blog/${slug}/`,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".lead-answer", "h1", ".eyebrow", ".viz-pill strong", ".quick-answer"]
    },
    "about": [
      { "@type": "Thing", "name": `${meta.name} Student Visa` },
      { "@type": "Thing", "name": "Study Abroad Pakistan" },
      { "@type": "Thing", "name": "Immigration Consultant Pakistan" }
    ]
  };
}

function injectSchemas(filePath, slug, meta) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace existing schemas if any
  const howTo = JSON.stringify(buildHowToSchema(slug, meta));
  const faq = JSON.stringify(buildFAQSchema(meta));
  const article = JSON.stringify(buildArticleSchema(slug, meta));

  const schemas = `  <!-- GEO Schema: HowTo + FAQPage + Article + Speakable -->
  <script type="application/ld+json">${howTo}</script>
  <script type="application/ld+json">${faq}</script>
  <script type="application/ld+json">${article}</script>
  <!-- GEO Citation Meta Tags -->
  <meta name="citation_author" content="SK Immigration Services" />
  <meta name="DC.publisher" content="SK Immigration Services" />
  <meta name="DC.rights" content="SK Immigration Services (SMC-Private) Limited · SECP CUIN 0304985" />
  <meta name="geo.region" content="PK-PB" />
  <meta name="geo.placename" content="Rawalpindi, Punjab, Pakistan" />
  <meta name="geo.position" content="33.6149;73.0643" />
  <meta name="ICBM" content="33.6149, 73.0643" />`;

  if (!html.includes('HowTo')) {
    html = html.replace('</head>', `${schemas}\n</head>`);
  }

  if (!html.includes('geo-schema.js')) {
    if (html.includes('assets/js/config.js')) {
      html = html.replace(
        /(<script src="[^"]*assets\/js\/config\.js"><\/script>)/,
        `<script src="../../assets/js/geo-schema.js"></script>\n  $1`
      );
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ INJECTED schemas: ${slug}`);
}

let done = 0;
for (const [slug, meta] of Object.entries(COUNTRIES)) {
  const filePath = path.join(BLOG_DIR, slug, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ NOT FOUND: ${filePath}`);
    continue;
  }
  injectSchemas(filePath, slug, meta);
  done++;
}

console.log(`\n✅ Done — ${done} guides processed.`);
