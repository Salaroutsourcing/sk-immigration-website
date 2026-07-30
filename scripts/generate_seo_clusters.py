#!/usr/bin/env python3
"""Generate Pakistan-intent SEO clusters + refresh sitemap entries."""

from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.salaroutsourcing.com"
UPDATED = "2026-07-30"


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def faq_json(faqs: list[dict]) -> str:
    entity = [
        {
            "@type": "Question",
            "name": f["q"],
            "acceptedAnswer": {"@type": "Answer", "text": f["a"]},
        }
        for f in faqs
    ]
    return json.dumps(
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": entity},
        ensure_ascii=False,
    )


def breadcrumb_json(items: list[tuple[str, str]]) -> str:
    entity = [
        {
            "@type": "ListItem",
            "position": i + 1,
            "name": name,
            "item": url if url.startswith("http") else SITE + url,
        }
        for i, (name, url) in enumerate(items)
    ]
    return json.dumps(
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": entity},
        ensure_ascii=False,
    )


def page_shell(
    *,
    title: str,
    description: str,
    canonical: str,
    breadcrumbs: list[tuple[str, str]],
    body_page: str,
    h1: str,
    lead: str,
    sections_html: str,
    faqs: list[dict],
    asset_prefix: str,
    og_type: str = "article",
    extra_schema: str = "",
    cta_note: str = "Free consultation · Honest advice · Embassies make final decisions · No visa guarantees",
) -> str:
    crumbs_nav = " · ".join(
        f'<a href="{esc(url if url.startswith("http") else SITE + url)}">{esc(name)}</a>'
        if i < len(breadcrumbs) - 1
        else f"<span>{esc(name)}</span>"
        for i, (name, url) in enumerate(breadcrumbs)
    )
    faq_html = "".join(
        f"<details><summary>{esc(f['q'])}</summary><p>{esc(f['a'])}</p></details>" for f in faqs
    )
    crumbs_attr = esc(
        json.dumps(
            [{"name": n, "url": u if u.startswith("http") else SITE + u} for n, u in breadcrumbs],
            ensure_ascii=False,
        )
    )
    return f"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}" />
  <link rel="canonical" href="{esc(canonical)}" />
  <meta property="og:type" content="{esc(og_type)}" />
  <meta property="og:title" content="{esc(title)}" />
  <meta property="og:description" content="{esc(description)}" />
  <meta property="og:url" content="{esc(canonical)}" />
  <meta property="og:image" content="{SITE}/assets/img/hero-graduation.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{esc(title)}" />
  <meta name="twitter:description" content="{esc(description)}" />
  <meta name="author" content="SK Immigration Services" />
  <link rel="icon" href="{asset_prefix}assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="{asset_prefix}assets/css/main.css" />
  <script type="application/ld+json">{breadcrumb_json(breadcrumbs)}</script>
  <script type="application/ld+json">{faq_json(faqs)}</script>
  {extra_schema}
</head>
<body data-page="{esc(body_page)}" data-breadcrumbs="{crumbs_attr}">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main" class="container" style="padding:2.5rem 0 4rem;max-width:920px">
    <nav class="text-muted" style="font-size:0.85rem;margin-bottom:1rem" aria-label="Breadcrumb">{crumbs_nav}</nav>
    <article class="glass card" style="padding:2rem">
      <p class="eyebrow">SK Immigration Services · Updated {UPDATED}</p>
      <h1 class="display" style="font-size:clamp(1.7rem,3vw,2.35rem);margin-bottom:0.75rem">{esc(h1)}</h1>
      <p class="lead-answer"><strong>Quick answer:</strong> {lead}</p>
      <p class="text-muted mb-2">{esc(cta_note)}</p>
      <div class="prose">
        {sections_html}
        <h2>Frequently asked questions</h2>
        <div class="faq-mini">{faq_html}</div>
        <h2>Talk to SK Immigration</h2>
        <p>Based in Rawalpindi with WhatsApp support nationwide. We prepare files carefully and explain risks in plain language — we never sell fake “visa guarantees.”</p>
        <div class="hero-ctas" style="margin-top:1rem">
          <a class="btn btn-gold" href="{asset_prefix}contact.html">Book free consultation</a>
          <a class="btn btn-whatsapp" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp +92 304 5999859</a>
          <a class="btn btn-ghost" href="{asset_prefix}eligibility.html">Check eligibility</a>
        </div>
      </div>
    </article>
  </main>
  <div id="site-footer"></div>
  <script src="{asset_prefix}assets/js/config.js"></script>
  <script src="{asset_prefix}assets/js/theme.js"></script>
  <script src="{asset_prefix}assets/js/api.js"></script>
  <script src="{asset_prefix}assets/js/layout.js"></script>
  <script src="{asset_prefix}assets/js/seo.js"></script>
</body>
</html>
"""


STUDY = [
    {
        "slug": "germany-study-visa-pakistan",
        "country": "Germany",
        "blog": "/blog/germany-student-visa/",
        "code": "de",
        "fees": "Embassy visa fee + blocked account / funding proof; SK Immigration student packages from PKR 50,000",
        "timeline": "Typically 4–7 months from shortlist to visa decision (varies by intake and nationality)",
        "requirements": [
            "University admission or Ausbildung contract from a recognized German institution",
            "Proof of funds (often Sperrkonto / blocked account — confirm current amount)",
            "Passport valid 6+ months, biometric photos, completed visa forms",
            "Academic transcripts and certificates (attestation may be required)",
            "Health insurance meeting embassy rules",
            "Language proof where the program/employer requires German or English",
        ],
        "process": [
            "Profile review and realistic shortlist (study vs Ausbildung)",
            "University or employer applications",
            "Admission / contract + funding setup",
            "Document packaging and appointment booking",
            "Biometrics / interview and decision tracking",
        ],
        "documents": [
            "Passport and photos",
            "Admission letter or Ausbildung contract",
            "Academic certificates and transcripts",
            "Proof of funds / blocked account confirmation",
            "SOP / motivation letter and CV",
            "Insurance and visa fee receipt",
            "APS certificate where applicable for your nationality",
        ],
        "mistakes": [
            "Opening a blocked account with the wrong amount or provider",
            "Weak motivation letter that does not match the program",
            "Ignoring German language needs for Ausbildung roles",
            "Submitting unattested academic documents when the mission asks for them",
        ],
        "lead": "Germany remains one of the strongest study and Ausbildung routes from Pakistan: low/no public tuition, clear funding rules, and post-study work options. SK Immigration helps with shortlists, document checklists, funding planning and appointment prep — embassies decide the visa.",
    },
    {
        "slug": "italy-study-visa-pakistan",
        "country": "Italy",
        "blog": "/blog/italy-student-visa/",
        "code": "it",
        "fees": "Embassy/VFS fees + living proof; SK packages from PKR 50,000",
        "timeline": "Often 3–6 months depending on Universitaly / pre-enrolment and appointment slots",
        "requirements": [
            "Admission / pre-enrolment via the Italian university process",
            "Proof of sufficient funds and accommodation plan",
            "Valid passport, photos, visa application",
            "Academic documents with required legalization/translation",
            "Health insurance for Schengen study stay",
        ],
        "process": [
            "Course shortlist and eligibility check",
            "University application / Universitaly steps",
            "Document attestation and translations",
            "Visa appointment at VFS / Italian Mission",
            "Travel and residence permit follow-up guidance",
        ],
        "documents": [
            "Passport, photos, application form",
            "Admission / pre-enrolment proof",
            "Academic certificates (attested/translated as required)",
            "Bank statements / sponsorship",
            "Accommodation evidence",
            "Insurance and fee receipts",
        ],
        "mistakes": [
            "Missing Universitaly / pre-enrolment deadlines",
            "Incomplete translations or attestation chain",
            "Under-documented living funds",
            "Booking appointments before the file is interview-ready",
        ],
        "lead": "Italy study visa from Pakistan suits students targeting affordable public universities and design, engineering or hospitality programs. Success depends on clean academic files, funding proof and correct pre-enrolment steps — SK Immigration guides each stage without fake guarantees.",
    },
    {
        "slug": "france-study-visa-pakistan",
        "country": "France",
        "blog": "/blog/france-student-visa/",
        "code": "fr",
        "fees": "Campus France / visa fees + living proof; SK packages from PKR 50,000",
        "timeline": "Often 3–6 months including Campus France steps where required",
        "requirements": [
            "University acceptance and Campus France procedure where applicable",
            "Proof of funds and housing plan",
            "Passport, photos, forms",
            "Academic records and language evidence (French or English program dependent)",
            "Insurance covering the stay",
        ],
        "process": [
            "Program shortlist and language pathway",
            "Applications + Campus France interview prep if required",
            "Document assembly and translations",
            "Visa appointment and biometrics",
            "Pre-departure briefing",
        ],
        "documents": [
            "Passport and biometric photos",
            "Acceptance letter",
            "Campus France documents (if applicable)",
            "Bank / sponsor proofs",
            "Housing proof",
            "Insurance and fee receipts",
        ],
        "mistakes": [
            "Skipping Campus France when your nationality/program requires it",
            "Inconsistent study plan vs chosen program",
            "Weak housing or funding evidence",
            "Late appointment booking in peak intakes",
        ],
        "lead": "France study visa Pakistan applicants usually need a clear academic plan, funding proof and — for many profiles — Campus France steps. SK Immigration helps structure the file and appointment so your story is consistent and complete.",
    },
    {
        "slug": "uk-study-visa-pakistan",
        "country": "United Kingdom",
        "blog": "/blog/uk-student-visa/",
        "code": "uk",
        "fees": "UKVI fees + IHS + tuition deposit; SK packages from PKR 50,000",
        "timeline": "Often 2–5 months after CAS, depending on biometrics and peak seasons",
        "requirements": [
            "CAS from a licensed UK sponsor institution",
            "Tuition and living-cost funds meeting UKVI rules",
            "English language evidence (IELTS or accepted alternatives)",
            "TB test where required for Pakistan residents",
            "Valid passport and online application",
        ],
        "process": [
            "University shortlist and offer strategy",
            "CAS issuance support checklist",
            "Funds seasoning / documentation",
            "Online application + VFS biometrics",
            "Decision tracking and travel planning",
        ],
        "documents": [
            "CAS letter",
            "Passport",
            "Bank statements meeting UKVI format",
            "English test results",
            "TB certificate (if required)",
            "Academic transcripts and previous study evidence",
        ],
        "mistakes": [
            "Funds not held for the required seasoning period",
            "Mismatched CAS details vs application",
            "Using an unaccepted English test format",
            "Ignoring TB / dependant rules",
        ],
        "lead": "UK study visa from Pakistan is CAS-driven: the right university offer, correctly documented funds, English evidence and clean biometrics. SK Immigration coaches the checklist and interview readiness — UKVI makes the final decision.",
    },
    {
        "slug": "canada-study-visa-pakistan",
        "country": "Canada",
        "blog": "/blog/canada-student-visa/",
        "code": "ca",
        "fees": "IRCC fees + biometrics + GIC/tuition proofs; SK packages from PKR 50,000",
        "timeline": "Often 3–8+ months depending on IRCC processing and completeness",
        "requirements": [
            "Letter of acceptance from a DLI",
            "Proof of funds (GIC and/or bank evidence as applicable)",
            "Study plan / SOP aligned with program",
            "Biometrics and medicals where required",
            "Passport and online IRCC application",
        ],
        "process": [
            "DLI shortlist and admission",
            "Funds and GIC planning",
            "SOP and document packaging",
            "IRCC submission + biometrics",
            "Passport request / decision follow-up",
        ],
        "documents": [
            "Letter of acceptance",
            "Passport",
            "Proof of funds / GIC",
            "SOP and CV",
            "Academic documents",
            "Police / medical if requested",
        ],
        "mistakes": [
            "Weak study plan that looks immigration-first",
            "Insufficient or poorly explained funds",
            "Choosing a program that does not fit prior academics",
            "Missing biometrics deadlines",
        ],
        "lead": "Canada study visa Pakistan files succeed when the program fit, funds story and SOP are coherent. SK Immigration helps build that narrative and checklist — IRCC decides every application independently.",
    },
    {
        "slug": "australia-study-visa-pakistan",
        "country": "Australia",
        "blog": "/blog/australia-student-visa/",
        "code": "au",
        "fees": "Visa subclass fees + OSHC + tuition deposit; SK packages from PKR 50,000",
        "timeline": "Often 2–6 months after CoE, subject to integrity checks and peak load",
        "requirements": [
            "Confirmation of Enrolment (CoE)",
            "Genuine Student / intent evidence",
            "Financial capacity documentation",
            "English language evidence",
            "OSHC health cover and health exams where required",
        ],
        "process": [
            "Course and provider shortlist",
            "Offer → CoE",
            "GS statement and funds packaging",
            "ImmiAccount lodgement + biometrics/health",
            "Decision and pre-departure",
        ],
        "documents": [
            "CoE and offer letter",
            "Passport",
            "Financial evidence",
            "English test results",
            "OSHC certificate",
            "Academic transcripts",
        ],
        "mistakes": [
            "Generic Genuine Student statements",
            "Funds that cannot be traced or explained",
            "Provider/course hopping without a clear reason",
            "Ignoring health examination timing",
        ],
        "lead": "Australia study visa from Pakistan hinges on a credible Genuine Student story, CoE, funds and English. SK Immigration prepares structured evidence packages; the Department of Home Affairs decides the outcome.",
    },
    {
        "slug": "usa-study-visa-pakistan",
        "country": "United States",
        "blog": "/answers/",
        "code": "us",
        "fees": "SEVIS + MRV fees + university deposits; SK packages from PKR 50,000",
        "timeline": "Often 2–5 months after I-20, depending on interview wait times",
        "requirements": [
            "Form I-20 from a SEVP-certified school",
            "SEVIS fee payment and DS-160",
            "Proof of funds covering tuition and living costs",
            "Strong non-immigrant intent for F-1 interview",
            "Academic and English readiness evidence",
        ],
        "process": [
            "University applications and I-20 issuance",
            "SEVIS + DS-160 completion",
            "Interview coaching and document binder",
            "Embassy/consulate interview",
            "Visa stamp and travel planning",
        ],
        "documents": [
            "I-20 and SEVIS receipt",
            "DS-160 confirmation",
            "Passport",
            "Bank / sponsor affidavits",
            "Academic transcripts and test scores",
            "Interview appointment confirmation",
        ],
        "mistakes": [
            "Inconsistent answers about program choice or funding",
            "Weak home ties explanation at interview",
            "Paying agents who promise guaranteed F-1 approval",
            "Incomplete sponsor documentation",
        ],
        "lead": "USA study visa Pakistan (F-1) is interview-led: I-20, SEVIS, funding proof and clear academic intent. SK Immigration prepares your document story and interview practice — consular officers decide every case.",
    },
    {
        "slug": "cyprus-study-visa-pakistan",
        "country": "Cyprus",
        "blog": "/blog/cyprus-student-visa/",
        "code": "cy",
        "fees": "Embassy/university fees + living proof; SK packages from PKR 50,000",
        "timeline": "Often 2–5 months depending on university and mission processing",
        "requirements": [
            "University acceptance from a recognized Cyprus institution",
            "Proof of funds and tuition payment plan",
            "Passport, photos, forms",
            "Academic documents with required attestation",
            "Medical / police certificates if requested",
        ],
        "process": [
            "Program shortlist (often English-taught)",
            "Admission and fee schedule",
            "Attestation and visa file",
            "Appointment / submission",
            "Arrival and residence formalities guidance",
        ],
        "documents": [
            "Acceptance letter",
            "Passport and photos",
            "Bank statements",
            "Academic certificates",
            "Medical/police if required",
            "Fee receipts",
        ],
        "mistakes": [
            "Choosing unaccredited providers",
            "Underestimating living costs in popular cities",
            "Incomplete attestation for Pakistani documents",
            "Late fee payments that delay the acceptance letter",
        ],
        "lead": "Cyprus study visa Pakistan is popular for English-taught degrees and relatively accessible entry profiles when documents and funds are clean. SK Immigration verifies institutions and builds embassy-ready files.",
    },
]


APPOINTMENTS = [
    {
        "slug": "schengen-visa-appointment-pakistan",
        "name": "Schengen Visa Appointment Pakistan",
        "focus": "Schengen (multi-country)",
        "lead": "Schengen visa appointment Pakistan slots fill quickly in peak seasons. SK Immigration helps you package a complete tourist, family or business visit file and time the VFS/TLS booking so you are not interviewing with missing documents.",
    },
    {
        "slug": "germany-visa-appointment-pakistan",
        "name": "Germany Visa Appointment Pakistan",
        "focus": "Germany",
        "lead": "Germany visa appointment Pakistan wait times vary by visa type (study, Ausbildung, work, visit). We prepare checklists first, then guide booking so your biometrics date matches a complete file.",
    },
    {
        "slug": "italy-visa-appointment-pakistan",
        "name": "Italy Visa Appointment Pakistan",
        "focus": "Italy",
        "lead": "Italy visa appointment Pakistan applicants usually book via VFS after university or visit documents are ready. SK Immigration sequences attestation, translations and appointment timing for study and visit cases.",
    },
    {
        "slug": "france-visa-appointment-pakistan",
        "name": "France Visa Appointment Pakistan",
        "focus": "France",
        "lead": "France visa appointment Pakistan steps often include Campus France (study) or VFS visit lanes. We help you avoid booking too early — before your supporting evidence is interview-ready.",
    },
    {
        "slug": "uk-visa-appointment-pakistan",
        "name": "UK Visa Appointment Pakistan",
        "focus": "United Kingdom",
        "lead": "UK visa appointment Pakistan means completing the online UKVI form, paying fees, then biometrics at a visa application centre. SK Immigration checks CAS/funds/visit evidence before you lock a slot.",
    },
    {
        "slug": "usa-visa-appointment-pakistan",
        "name": "USA Visa Appointment Pakistan",
        "focus": "United States",
        "lead": "USA visa appointment Pakistan (study/visit/work categories) requires DS-160, fee payment and consular interview scheduling. We focus on document binders and interview clarity — not fake guarantees.",
    },
    {
        "slug": "canada-visa-appointment-pakistan",
        "name": "Canada Visa Appointment Pakistan",
        "focus": "Canada",
        "lead": "Canada visa appointment Pakistan usually means biometrics after IRCC submission. SK Immigration helps you submit a complete study or visit package so biometrics timing does not stall a weak file.",
    },
    {
        "slug": "australia-visa-appointment-pakistan",
        "name": "Australia Visa Appointment Pakistan",
        "focus": "Australia",
        "lead": "Australia visa appointment Pakistan covers biometrics and health checks linked to ImmiAccount lodgements. We package Genuine Student / visit evidence before you attend collection centres.",
    },
]


DOCS = [
    {
        "slug": "musadaqa-verification",
        "name": "Musadaqa Verification",
        "lead": "Musadaqa verification confirms Saudi-related document authenticity used in employment and visa workflows. SK Immigration guides which certificates need Musadaqa, sequencing with MOFA and embassy steps.",
        "keywords": "Musadaqa Pakistan, Saudi document verification",
    },
    {
        "slug": "qvp-verification",
        "name": "QVP Verification",
        "lead": "QVP verification is part of document legalization pathways used for Gulf and related processes. We map whether your degree, marriage or commercial papers need QVP before embassy attestation.",
        "keywords": "QVP verification Pakistan",
    },
    {
        "slug": "apostille-pakistan",
        "name": "Apostille Pakistan",
        "lead": "Apostille Pakistan is used for Hague-member destinations instead of full embassy legalization. SK Immigration confirms if your destination accepts Apostille and which Pakistani documents qualify.",
        "keywords": "Apostille Pakistan, HEC apostille",
    },
    {
        "slug": "saudi-embassy-attestation",
        "name": "Saudi Embassy Attestation",
        "lead": "Saudi Embassy attestation legalizes Pakistani documents for use in the Kingdom after local MOFA/relevant steps. We provide sequenced checklists for educational and personal documents.",
        "keywords": "Saudi Embassy attestation Pakistan",
    },
    {
        "slug": "mofa-attestation",
        "name": "MOFA Attestation",
        "lead": "MOFA attestation (Ministry of Foreign Affairs) is a core step before many embassy legalizations. SK Immigration explains order of operations so you do not pay twice for out-of-sequence stamps.",
        "keywords": "MOFA attestation Pakistan",
    },
]


def ul(items: list[str]) -> str:
    return "<ul>" + "".join(f"<li>{esc(i)}</li>" for i in items) + "</ul>"


def ol(items: list[str]) -> str:
    return "<ol>" + "".join(f"<li>{esc(i)}</li>" for i in items) + "</ol>"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print("wrote", path.relative_to(ROOT))


def study_pages() -> list[str]:
    urls = [f"{SITE}/study-visa/"]
    cards = []
    for c in STUDY:
        url = f"/study-visa/{c['slug']}/"
        urls.append(SITE + url)
        cards.append(
            f'<a class="glass card reveal" href="{c["slug"]}/"><h3 style="font-family:var(--font-display);margin-bottom:0.35rem">{esc(c["country"])} Study Visa Pakistan</h3><p class="text-muted" style="font-size:0.92rem">Requirements, process, documents, fees, timeline &amp; FAQ.</p></a>'
        )
        faqs = [
            {
                "q": f"What are the main requirements for a {c['country']} study visa from Pakistan?",
                "a": f"Typically admission/offer documents, proof of funds, passport, academic records, and any language or medical checks {c['country']} requires. Exact lists change — SK Immigration builds a country checklist for your case.",
            },
            {
                "q": f"How long does a {c['country']} student visa take from Pakistan?",
                "a": c["timeline"] + " Peak intakes and incomplete files take longer.",
            },
            {
                "q": f"What are typical fees for {c['country']} study visa Pakistan applicants?",
                "a": c["fees"] + ". Official fees are paid to universities/missions; our service fee covers preparation only.",
            },
            {
                "q": "Do you guarantee the visa?",
                "a": "No. Embassies and immigration authorities decide every application. We prepare honest, complete files and explain risks clearly.",
            },
            {
                "q": f"Can SK Immigration help with attestation for {c['country']}?",
                "a": "Yes — we sequence Apostille/MOFA/embassy steps when your destination requires legalized Pakistani documents.",
            },
            {
                "q": "Is IELTS always required?",
                "a": "Not always. Some programs accept MOI letters, university tests or other evidence. We map realistic language pathways case by case.",
            },
        ]
        sections = f"""
        <h2>Requirements</h2>
        {ul(c['requirements'])}
        <h2>Process</h2>
        {ol(c['process'])}
        <h2>Documents</h2>
        {ul(c['documents'])}
        <p>Interactive checklist: <a href="../../checklist.html?country={c['code']}&type=study">Open {esc(c['country'])} checklist →</a></p>
        <h2>Fees</h2>
        <p>{esc(c['fees'])}. Always verify current embassy and university fees before paying.</p>
        <h2>Timeline</h2>
        <p>{esc(c['timeline'])}.</p>
        <h2>Common mistakes</h2>
        {ul(c['mistakes'])}
        <h2>Deeper country guide</h2>
        <p>Read our educational guide: <a href="../../{c['blog'].lstrip('/')}">{esc(c['country'])} student visa guide</a>. Also explore the <a href="../../answers/">Answers Hub</a> for IELTS, funds and attestation questions.</p>
        """
        service = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": f"{c['country']} Study Visa Pakistan",
            "provider": {"@id": SITE + "/#organization"},
            "areaServed": "PK",
            "url": SITE + url,
            "description": c["lead"],
        }
        extra = f'<script type="application/ld+json">{json.dumps(service, ensure_ascii=False)}</script>'
        write(
            ROOT / "study-visa" / c["slug"] / "index.html",
            page_shell(
                title=f"{c['country']} Study Visa Pakistan — Requirements, Fees & Process | SK Immigration",
                description=f"{c['country']} study visa from Pakistan: requirements, documents, fees, timeline, common mistakes and FAQ. Honest guidance by SK Immigration Services, Rawalpindi.",
                canonical=SITE + url,
                breadcrumbs=[
                    ("Home", "/"),
                    ("Study Visa", "/study-visa/"),
                    (f"{c['country']} Study Visa Pakistan", url),
                ],
                body_page="study-visa",
                h1=f"{c['country']} Study Visa Pakistan",
                lead=c["lead"],
                sections_html=sections,
                faqs=faqs,
                asset_prefix="../../",
                extra_schema=extra,
            ),
        )

    hub = f"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Study Visa Pakistan — Germany, UK, Canada, Australia, USA & Europe | SK Immigration</title>
  <meta name="description" content="Pakistan's trusted study visa partner. Country guides for Germany, Italy, France, UK, Canada, Australia, USA and Cyprus — requirements, fees, timelines and FAQs." />
  <link rel="canonical" href="{SITE}/study-visa/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Study Visa Pakistan | SK Immigration Services" />
  <meta property="og:description" content="Country-by-country study visa guidance for Pakistani applicants — honest advice, clear checklists, no fake guarantees." />
  <meta property="og:url" content="{SITE}/study-visa/" />
  <meta property="og:image" content="{SITE}/assets/img/service-study.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <script type="application/ld+json">{breadcrumb_json([("Home", "/"), ("Study Visa Pakistan", "/study-visa/")])}</script>
</head>
<body data-page="study-visa" data-breadcrumbs="{esc(json.dumps([{'name':'Home','url':SITE+'/'},{'name':'Study Visa Pakistan','url':SITE+'/study-visa/'}]))}">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main">
    <section class="hero" style="padding-bottom:2rem">
      <div class="container">
        <p class="eyebrow">Primary service</p>
        <h1 class="display" style="font-size:clamp(2rem,4vw,2.8rem)">Study Visa Pakistan</h1>
        <p class="hero-lead" style="max-width:40rem">Educational, embassy-ready guides for Pakistani students. Pick a destination to see requirements, process, documents, fees, timeline, mistakes and FAQ.</p>
        <div class="hero-ctas">
          <a class="btn btn-gold btn-lg" href="../eligibility.html">Check eligibility — free</a>
          <a class="btn btn-whatsapp btn-lg" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp Us</a>
        </div>
      </div>
    </section>
    <section>
      <div class="container grid-2" style="padding-bottom:3rem">{''.join(cards)}</div>
    </section>
  </main>
  <div id="site-footer"></div>
  <script src="../assets/js/config.js"></script>
  <script src="../assets/js/theme.js"></script>
  <script src="../assets/js/api.js"></script>
  <script src="../assets/js/layout.js"></script>
  <script src="../assets/js/seo.js"></script>
</body>
</html>
"""
    write(ROOT / "study-visa" / "index.html", hub)
    return urls


def appointment_pages() -> list[str]:
    urls = [f"{SITE}/visa-appointment/"]
    cards = []
    for a in APPOINTMENTS:
        url = f"/visa-appointment/{a['slug']}/"
        urls.append(SITE + url)
        cards.append(
            f'<a class="glass card reveal" href="{a["slug"]}/"><h3 style="font-family:var(--font-display);margin-bottom:0.35rem">{esc(a["name"])}</h3><p class="text-muted" style="font-size:0.92rem">Booking process, documents, mistakes &amp; FAQ.</p></a>'
        )
        faqs = [
            {
                "q": f"How do I book a {a['focus']} visa appointment from Pakistan?",
                "a": "Complete the online application for your visa category, pay the required fees, then schedule biometrics/interview via the official VFS, TLS, UKVI, US consular or IRCC channel for that country. SK Immigration helps you sequence documents before locking a date.",
            },
            {
                "q": "Should I book the appointment before documents are ready?",
                "a": "Usually no. Peak slots create pressure, but attending with an incomplete file risks refusal or delay. We aim for 'ready file first, then book'.",
            },
            {
                "q": "What documents are commonly needed for visa appointments?",
                "a": "Passport, application confirmation, fee receipts, photos, financial evidence, purpose documents (admission, invitation, employment), and category-specific forms. Exact lists depend on the destination.",
            },
            {
                "q": "Can SK Immigration get a 'special slot'?",
                "a": "We do not sell fake priority slots. We help you use official channels correctly and keep your file complete so a cancelled/rescheduled date does not waste the opportunity.",
            },
            {
                "q": "Do you help with study and visit appointments?",
                "a": "Yes — study, visit, work and Saudi-related appointment support, with checklists tailored to the category.",
            },
        ]
        sections = f"""
        <h2>Requirements</h2>
        {ul([
            "Completed online visa application for the correct category",
            "Valid passport with enough blank pages and validity",
            "Fee payment receipts for visa and service centres",
            "Purpose evidence (admission, invitation, employment, tourism itinerary)",
            "Financial and ties evidence appropriate to the visa type",
        ])}
        <h2>Process</h2>
        {ol([
            "Confirm visa category and destination rules",
            "Assemble documents and translations/attestations",
            "Submit online application and pay fees",
            "Book biometrics / interview appointment on official portals",
            "Attend appointment and track decision",
        ])}
        <h2>Documents checklist</h2>
        {ul([
            "Passport and biometric photos",
            "Application form / DS-160 / UKVI / ImmiAccount confirmation as applicable",
            "Fee receipts",
            "Cover letter explaining purpose of travel",
            "Financial statements / sponsorship",
            "Supporting category documents (CAS, I-20, invitation, employment contract)",
        ])}
        <h2>Fees</h2>
        <p>You pay official mission/VFS/UKVI/IRCC fees directly. SK Immigration charges a separate preparation fee for file review and appointment coaching — quoted after a free consultation.</p>
        <h2>Timeline</h2>
        <p>Appointment availability for {esc(a['focus'])} can range from a few days to several weeks in peak seasons. Decision times after biometrics vary by category and nationality.</p>
        <h2>Common mistakes</h2>
        {ul([
            "Booking before the supporting file is complete",
            "Mismatched travel dates vs admission or invitation letters",
            "Unexplained large deposits in bank statements",
            "Using unofficial agents who claim guaranteed slots",
        ])}
        <h2>Related guides</h2>
        <p>See also <a href="../../study-visa/">Study Visa Pakistan</a>, <a href="../../answers/">Answers Hub</a> and <a href="../../contact.html">contact</a> for appointment assistance.</p>
        """
        write(
            ROOT / "visa-appointment" / a["slug"] / "index.html",
            page_shell(
                title=f"{a['name']} — Booking Help & Checklist | SK Immigration",
                description=f"{a['name']}: process, documents, fees, timeline, common mistakes and FAQ. Appointment assistance by SK Immigration Services.",
                canonical=SITE + url,
                breadcrumbs=[
                    ("Home", "/"),
                    ("Visa Appointments", "/visa-appointment/"),
                    (a["name"], url),
                ],
                body_page="visa-appointment",
                h1=a["name"],
                lead=a["lead"],
                sections_html=sections,
                faqs=faqs,
                asset_prefix="../../",
            ),
        )

    hub = f"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Visa Appointment Pakistan — Schengen, UK, USA, Canada, Australia | SK Immigration</title>
  <meta name="description" content="Visa appointment assistance in Pakistan for Schengen, Germany, Italy, France, UK, USA, Canada and Australia. Complete-file-first booking guidance." />
  <link rel="canonical" href="{SITE}/visa-appointment/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Visa Appointment Pakistan | SK Immigration" />
  <meta property="og:description" content="Official-channel appointment help with complete document packaging — no fake slots." />
  <meta property="og:url" content="{SITE}/visa-appointment/" />
  <meta property="og:image" content="{SITE}/assets/img/service-europe.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <script type="application/ld+json">{breadcrumb_json([("Home", "/"), ("Visa Appointments", "/visa-appointment/")])}</script>
</head>
<body data-page="visa-appointment">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main">
    <section class="hero" style="padding-bottom:2rem">
      <div class="container">
        <p class="eyebrow">Appointment assistance</p>
        <h1 class="display" style="font-size:clamp(2rem,4vw,2.8rem)">Visa Appointment Pakistan</h1>
        <p class="hero-lead" style="max-width:40rem">We help Pakistani applicants prepare complete files, then book official VFS / UKVI / consular / biometrics appointments — without selling fake “priority slots.”</p>
        <div class="hero-ctas">
          <a class="btn btn-gold btn-lg" href="../contact.html">Request appointment help</a>
          <a class="btn btn-whatsapp btn-lg" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp Us</a>
        </div>
      </div>
    </section>
    <section><div class="container grid-2" style="padding-bottom:3rem">{''.join(cards)}</div></section>
  </main>
  <div id="site-footer"></div>
  <script src="../assets/js/config.js"></script>
  <script src="../assets/js/theme.js"></script>
  <script src="../assets/js/api.js"></script>
  <script src="../assets/js/layout.js"></script>
  <script src="../assets/js/seo.js"></script>
</body>
</html>
"""
    write(ROOT / "visa-appointment" / "index.html", hub)
    return urls


def saudi_page() -> list[str]:
    url = "/saudi-visa/saudi-visa-processing-pakistan/"
    faqs = [
        {
            "q": "What is the Saudi visa processing fee in Pakistan with SK Immigration?",
            "a": "Our processing support package is PKR 15,000 and includes E Number biometrics assistance, Protector included, and visa processing support. Official Saudi / medical / embassy fees are separate.",
        },
        {
            "q": "What is E Number biometrics?",
            "a": "E Number is part of the Saudi workforce / visa identification flow used before travel. We assist with the biometrics appointment process and document readiness.",
        },
        {
            "q": "Is Protector included?",
            "a": "Yes — Protector guidance/processing support is included in the PKR 15,000 package. Government Protector charges, if any, are paid to the relevant authority.",
        },
        {
            "q": "Are you a Saudi visa agent in Pakistan?",
            "a": "SK Immigration Services provides Saudi visa processing support and documentation guidance from Rawalpindi. Final visa issuance is decided by Saudi authorities.",
        },
        {
            "q": "What are typical Saudi work visa charges in Pakistan?",
            "a": "Applicants usually pay medical, biometrics, insurance, and authority fees in addition to consultant support. We quote our PKR 15,000 support package clearly before work begins.",
        },
        {
            "q": "What documents are needed?",
            "a": "Typically passport, photos, job offer / visa authorization details from the employer side, medicals, and civil documents with required attestation. Exact lists depend on visa category.",
        },
    ]
    sections = f"""
        <h2>Saudi visa processing Pakistan — what we cover</h2>
        <p>SK Immigration helps workers and families navigate Saudi visa documentation from Pakistan with transparent pricing and sequenced steps: authorization review, medicals, <strong>E Number biometrics</strong>, <strong>Protector</strong>, and submission support.</p>
        <h2>Package charges</h2>
        <p class="text-muted" style="font-size:1.05rem;padding:0.85rem 1rem;background:var(--gold-light);border:1px solid var(--gold-soft);border-radius:12px;color:var(--gold-dark);font-weight:700">PKR 15,000 processing support</p>
        <ul>
          <li><strong>E Number Biometrics Assistance</strong></li>
          <li><strong>Protector Included</strong></li>
          <li><strong>Visa Processing Support</strong></li>
        </ul>
        <p>Official medical, insurance, embassy or government fees are paid separately to the relevant providers.</p>
        <h2>Requirements</h2>
        {ul([
            "Valid passport with required blank pages",
            "Employer visa authorization / job details for work categories",
            "Medical fitness as required for the visa type",
            "Civil and educational documents with correct attestation chain when requested",
            "Photos and forms meeting current Saudi specifications",
        ])}
        <h2>Process</h2>
        {ol([
            "Free consultation and category confirmation",
            "Document checklist and attestation guidance",
            "E Number biometrics assistance",
            "Protector support",
            "Visa processing support and travel readiness briefing",
        ])}
        <h2>Documents</h2>
        {ul([
            "Passport and photographs",
            "Offer / visa authorization references",
            "CNIC and relevant civil documents",
            "Educational certificates if the role requires them",
            "Medical reports as instructed",
        ])}
        <h2>Timeline</h2>
        <p>Many files move in roughly 1–4 weeks after documents and medicals are complete, but Saudi authority processing times vary. Incomplete attestation is the most common delay.</p>
        <h2>Common mistakes</h2>
        {ul([
            "Paying unofficial agents who promise guaranteed visas",
            "Skipping Protector or biometrics sequencing",
            "Name mismatches across passport and authorization papers",
            "Out-of-order MOFA / embassy attestation",
        ])}
        <h2>Related services</h2>
        <p><a href="../../document-services/saudi-embassy-attestation/">Saudi Embassy Attestation</a> · <a href="../../document-services/musadaqa-verification/">Musadaqa Verification</a> · <a href="../../document-services/mofa-attestation/">MOFA Attestation</a> · <a href="../../hire-workers-from-pakistan/">Hire workers from Pakistan</a></p>
    """
    service = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Saudi Visa Processing Pakistan",
        "provider": {"@id": SITE + "/#organization"},
        "areaServed": "PK",
        "url": SITE + url,
        "description": "Saudi visa processing support including E Number biometrics assistance, Protector and documentation. Package from PKR 15000.",
        "offers": {
            "@type": "Offer",
            "price": "15000",
            "priceCurrency": "PKR",
            "availability": "https://schema.org/InStock",
        },
    }
    write(
        ROOT / "saudi-visa" / "saudi-visa-processing-pakistan" / "index.html",
        page_shell(
            title="Saudi Visa Processing Pakistan — E Number, Protector, PKR 15,000 | SK Immigration",
            description="Saudi visa processing fee Pakistan: PKR 15,000 package with E Number biometrics assistance, Protector included and visa processing support. Saudi visa agent guidance in Rawalpindi.",
            canonical=SITE + url,
            breadcrumbs=[
                ("Home", "/"),
                ("Saudi Visa", "/saudi-visa/saudi-visa-processing-pakistan/"),
                ("Saudi Visa Processing Pakistan", url),
            ],
            body_page="saudi-visa",
            h1="Saudi Visa Processing Pakistan",
            lead="SK Immigration offers Saudi visa processing support from Pakistan for <strong>PKR 15,000</strong>, including <strong>E Number biometrics assistance</strong>, <strong>Protector included</strong>, and visa documentation support. Authority fees are separate; Saudi officials decide outcomes.",
            sections_html=sections,
            faqs=faqs,
            asset_prefix="../../",
            extra_schema=f'<script type="application/ld+json">{json.dumps(service, ensure_ascii=False)}</script>',
        ),
    )
    # simple hub redirect-style index
    write(
        ROOT / "saudi-visa" / "index.html",
        f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" />
<title>Saudi Visa Pakistan | SK Immigration</title>
<link rel="canonical" href="{SITE}/saudi-visa/saudi-visa-processing-pakistan/" />
<meta http-equiv="refresh" content="0;url=saudi-visa-processing-pakistan/" />
<script>location.replace('saudi-visa-processing-pakistan/');</script>
</head><body><p><a href="saudi-visa-processing-pakistan/">Saudi Visa Processing Pakistan</a></p></body></html>
""",
    )
    return [SITE + url, f"{SITE}/saudi-visa/"]


def document_pages() -> list[str]:
    urls = [f"{SITE}/document-services/"]
    cards = []
    for d in DOCS:
        url = f"/document-services/{d['slug']}/"
        urls.append(SITE + url)
        cards.append(
            f'<a class="glass card reveal" href="{d["slug"]}/"><h3 style="font-family:var(--font-display);margin-bottom:0.35rem">{esc(d["name"])}</h3><p class="text-muted" style="font-size:0.92rem">{esc(d["keywords"])}</p></a>'
        )
        faqs = [
            {
                "q": f"What is {d['name']}?",
                "a": d["lead"],
            },
            {
                "q": "How long does attestation take?",
                "a": "Simple chains may finish in several working days; embassy queues and incomplete prior stamps take longer. We give a realistic range after seeing your document list.",
            },
            {
                "q": "Do you handle HEC / MOFA / embassy sequencing?",
                "a": "Yes. Wrong order is the most expensive mistake — we map the chain for your destination before you pay for stamps.",
            },
            {
                "q": "Can attestation be done for Saudi employment?",
                "a": "Yes — educational and personal documents for Saudi often need MOFA and Saudi Embassy steps, sometimes with Musadaqa/QVP depending on the paper type.",
            },
            {
                "q": "Where can I see the full attestation hub?",
                "a": "Visit our attestation overview page for Musadaqa, QVP, Apostille, MOFA and embassy options in one place.",
            },
        ]
        sections = f"""
        <h2>Overview</h2>
        <p>{esc(d['lead'])}</p>
        <h2>Requirements</h2>
        {ul([
            "Original documents or certified copies as required",
            "Clear scans and consistent name spellings vs passport",
            "Prior stamps (notary/HEC/IBCC/MOFA) in the correct order",
            "Destination country rules (Apostille vs embassy legalization)",
        ])}
        <h2>Process</h2>
        {ol([
            "Document audit and destination check",
            "Local verification steps (as applicable)",
            "MOFA / Apostille pathway",
            "Embassy attestation if required",
            "Delivery checklist for visa or employer use",
        ])}
        <h2>Documents we commonly handle</h2>
        {ul([
            "Degrees and transcripts",
            "Marriage and birth certificates",
            "Police character certificates",
            "Commercial papers (case by case)",
        ])}
        <h2>Fees &amp; timeline</h2>
        <p>Government and embassy fees vary by document type. SK Immigration quotes service support separately after reviewing your list. Timelines depend on authority queues.</p>
        <h2>Common mistakes</h2>
        {ul([
            "Paying for embassy stamps before MOFA/Apostille is done",
            "Name mismatches across documents",
            "Using photocopies when originals are required",
            "Assuming every country accepts Apostille",
        ])}
        <p>Full hub: <a href="../../attestation.html">Document attestation services</a> · Saudi processing: <a href="../../saudi-visa/saudi-visa-processing-pakistan/">Saudi visa Pakistan</a></p>
        """
        write(
            ROOT / "document-services" / d["slug"] / "index.html",
            page_shell(
                title=f"{d['name']} — Process, Fees & FAQ | SK Immigration",
                description=f"{d['name']}: requirements, process, documents, fees, timeline and common mistakes. {d['keywords']}.",
                canonical=SITE + url,
                breadcrumbs=[
                    ("Home", "/"),
                    ("Document Services", "/document-services/"),
                    (d["name"], url),
                ],
                body_page="document-services",
                h1=d["name"],
                lead=d["lead"],
                sections_html=sections,
                faqs=faqs,
                asset_prefix="../../",
            ),
        )

    hub = f"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Document Services Pakistan — Musadaqa, QVP, Apostille, MOFA, Saudi Embassy | SK Immigration</title>
  <meta name="description" content="Document attestation and verification in Pakistan: Musadaqa, QVP, Apostille, Saudi Embassy attestation and MOFA — sequenced correctly for your destination." />
  <link rel="canonical" href="{SITE}/document-services/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Document Services Pakistan | SK Immigration" />
  <meta property="og:description" content="Musadaqa, QVP, Apostille, MOFA and Saudi Embassy attestation guidance." />
  <meta property="og:url" content="{SITE}/document-services/" />
  <meta property="og:image" content="{SITE}/assets/img/service-docs.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="../assets/css/main.css" />
</head>
<body data-page="document-services">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main">
    <section class="hero" style="padding-bottom:2rem">
      <div class="container">
        <p class="eyebrow">Document services</p>
        <h1 class="display" style="font-size:clamp(2rem,4vw,2.8rem)">Attestation &amp; Verification Pakistan</h1>
        <p class="hero-lead" style="max-width:40rem">Educational pages for Musadaqa, QVP, Apostille, Saudi Embassy and MOFA — so you stamp documents in the right order.</p>
        <div class="hero-ctas">
          <a class="btn btn-gold btn-lg" href="../attestation.html">Attestation hub</a>
          <a class="btn btn-whatsapp btn-lg" href="https://wa.me/923045999859" target="_blank" rel="noopener">WhatsApp Us</a>
        </div>
      </div>
    </section>
    <section><div class="container grid-2" style="padding-bottom:3rem">{''.join(cards)}</div></section>
  </main>
  <div id="site-footer"></div>
  <script src="../assets/js/config.js"></script>
  <script src="../assets/js/theme.js"></script>
  <script src="../assets/js/api.js"></script>
  <script src="../assets/js/layout.js"></script>
  <script src="../assets/js/seo.js"></script>
</body>
</html>
"""
    write(ROOT / "document-services" / "index.html", hub)
    return urls


def merge_sitemap(new_urls: list[str]) -> None:
    path = ROOT / "sitemap.xml"
    text = path.read_text(encoding="utf-8")
    existing = set()
    for line in text.splitlines():
        if "<loc>" in line:
            existing.add(line.split("<loc>")[1].split("</loc>")[0].strip())
    additions = []
    for u in new_urls:
        if u not in existing:
            additions.append(
                f"  <url><loc>{u}</loc><lastmod>{UPDATED}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>"
            )
    if not additions:
        print("sitemap already up to date")
        return
    if not text.strip().endswith("</urlset>"):
        raise SystemExit("unexpected sitemap format")
    updated = text.replace("</urlset>", "\n".join(additions) + "\n</urlset>\n")
    path.write_text(updated, encoding="utf-8")
    print(f"sitemap: added {len(additions)} urls")


def add_og_to_core() -> None:
    pages = {
        "services.html": (
            "Services | Study Visa, Appointments, Saudi, Work, Attestation | SK Immigration",
            "Student visas, visa appointments, work visas, Saudi processing, document attestation and employer recruitment from SK Immigration Services.",
            f"{SITE}/services",
        ),
        "about.html": (
            "About SK Immigration Services | Pakistan Study Visa & Immigration Partner",
            "Learn about SK Immigration Services — a Salar Outsourcing brand helping Pakistani applicants with study visas, appointments, Saudi processing and attestation.",
            f"{SITE}/about",
        ),
        "contact.html": (
            "Contact SK Immigration | Free Consultation Rawalpindi",
            "Book a free consultation with SK Immigration Services in Satellite Town, Rawalpindi. WhatsApp +92 304 5999859.",
            f"{SITE}/contact",
        ),
        "jobs.html": (
            "Work Visa & Jobs Abroad | SK Immigration Services",
            "Browse Ausbildung and international work opportunities with SK Immigration Services — honest guidance for Pakistani applicants.",
            f"{SITE}/jobs",
        ),
        "countries.html": (
            "Study Destinations | Country Guides | SK Immigration",
            "Explore country guides for study and work pathways. Requirements, costs and timelines from SK Immigration Services.",
            f"{SITE}/countries",
        ),
        "attestation.html": (
            "Document Attestation Pakistan | Musadaqa, Apostille, MOFA | SK Immigration",
            "Musadaqa, QVP, Apostille, MOFA and embassy attestation guidance sequenced for your destination.",
            f"{SITE}/attestation",
        ),
    }
    for filename, (title, desc, canon) in pages.items():
        path = ROOT / filename
        text = path.read_text(encoding="utf-8")
        if 'property="og:title"' in text:
            continue
        block = f"""  <meta property="og:type" content="website" />
  <meta property="og:title" content="{esc(title)}" />
  <meta property="og:description" content="{esc(desc)}" />
  <meta property="og:url" content="{esc(canon)}" />
  <meta property="og:image" content="{SITE}/assets/img/hero-graduation.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{esc(title)}" />
  <meta name="twitter:description" content="{esc(desc)}" />
"""
        if '<link rel="canonical"' in text:
            text = text.replace(
                '<link rel="canonical"',
                block + '  <link rel="canonical"',
                1,
            )
            path.write_text(text, encoding="utf-8")
            print("og tags ->", filename)


def main() -> None:
    add_og_to_core()
    urls: list[str] = []
    urls += study_pages()
    urls += appointment_pages()
    urls += saudi_page()
    urls += document_pages()
    merge_sitemap(urls)
    print("done", len(urls), "cluster urls")


if __name__ == "__main__":
    main()
