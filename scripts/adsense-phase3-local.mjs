#!/usr/bin/env node
/** Phase 3 — deepen local city consultant pages */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL = path.join(__dirname, '..', 'public', 'local');
const TODAY = '2026-08-22';
const DEPTH_RE = /<!-- local-depth -->[\s\S]*?<!-- \/local-depth -->/;

const BLOCKS = {
  'islamabad-study-visa-consultant': {
    city: 'Islamabad',
    commute: 'Satellite Town Rawalpindi is a short twin-city commute via Murree Road / Kashmir Highway — many Islamabad clients start on WhatsApp and visit only for file review.',
    destinations:
      'Popular Islamabad client destinations: <a href="../../study-visa/germany-study-visa-pakistan/">Germany</a> (APS + blocked account planning), <a href="../../study-visa/uk-study-visa-pakistan/">UK</a> (CAS route), <a href="../../study-visa/canada-study-visa-pakistan/">Canada</a> SDS/IRCC files, and Schengen study in <a href="../../study-visa/hungary-study-visa-pakistan/">Hungary</a> / <a href="../../study-visa/poland-study-visa-pakistan/">Poland</a>.',
    logistics:
      'Bring original academics, passport scans and any refusal letters on first consult. F-6/F-7 Islamabad clients often share documents via WhatsApp before driving to Alfazal Plaza.',
  },
  'lahore-study-visa-consultant': {
    city: 'Lahore',
    commute:
      'Lahore clients typically coordinate via WhatsApp and courier attested documents to Rawalpindi, or visit the Satellite Town office for in-person packaging before VFS Islamabad/Lahore appointments.',
    destinations:
      'Lahore students often target <a href="../../study-visa/uk-study-visa-pakistan/">UK</a>, <a href="../../study-visa/germany-study-visa-pakistan/">Germany</a>, <a href="../../study-visa/italy-study-visa-pakistan/">Italy</a>, and <a href="../../visit-visa/uk-visit-visa-pakistan/">UK visit</a> files for family. We also support <a href="../../saudi-visa/saudi-visa-processing-pakistan/">Saudi complete processing</a> for workers from Punjab.',
    logistics:
      'Lahore VFS centres (UK, US, Schengen) mean appointment timing matters — we sequence documents before you book slots. Courier: use tracked delivery for originals when not visiting office.',
  },
  'karachi-study-visa-consultant': {
    city: 'Karachi',
    commute:
      'Karachi clients work remotely with SK Immigration via WhatsApp and video consults; walk-in visits to Rawalpindi are optional for complex file reviews.',
    destinations:
      'Karachi profiles often include <a href="../../study-visa/canada-study-visa-pakistan/">Canada</a>, <a href="../../study-visa/australia-study-visa-pakistan/">Australia</a> (when applicable), <a href="../../visit-visa/dubai-visit-visa-pakistan/">Dubai visit</a>, and <a href="../../work-permit/uae-work-visa-pakistan/">UAE work</a> routing.',
    logistics:
      'Karachi VFS/US consulate appointments are common — biometrics in Karachi with documents prepared through our checklist workflow. Start consult with marks, budget and passport history.',
  },
  'rawalpindi-study-visa-consultant': {
    city: 'Rawalpindi',
    commute:
      'Walk-in office at Office No. 10, Alfazal Plaza 64C, Satellite Town — same NAP as Google Business profile.',
    destinations:
      'Local walk-ins cover full desk scope: study, <a href="../../visit-visa/">visit</a>, <a href="../../work-permit/">work</a>, <a href="../../ausbildung.html">Ausbildung</a>, <a href="../../saudi-visa/saudi-visa-processing-pakistan/">Saudi PKR 15k processing</a>, and <a href="../../document-services/">attestation</a>.',
    logistics:
      'Bring originals for first visit; office hours Mon–Sat 10:00–19:00. Parking near Alfazal Plaza; WhatsApp queue for same-day document triage.',
  },
};

function block(c) {
  return `
<!-- local-depth -->
        <h2>Why ${c.city} clients choose SK Immigration</h2>
        <p>${c.commute}</p>
        <p>${c.destinations}</p>

        <h2>Office logistics for ${c.city} applicants</h2>
        <p>${c.logistics}</p>

        <h2>Our process (no visa guarantees)</h2>
        <ol>
          <li><strong>Free consult</strong> — marks, gaps, budget, destination fit</li>
          <li><strong>Honest shortlist</strong> — we say “not yet” when profile is weak</li>
          <li><strong>Checklist</strong> — country-specific docs via <a href="../../checklist.html">interactive checklist</a></li>
          <li><strong>Packaging</strong> — cover letters, funds narrative, appointment sequencing</li>
          <li><strong>Submission support</strong> — embassies decide; we never sell guarantees</li>
        </ol>

        <h2>Verify before you pay</h2>
        <p>CUIN <strong>0304985</strong> · WhatsApp <strong>+92 304 5999859</strong> · <a href="../../trust.html">Trust page</a> · <a href="https://share.google/hQzlV2rZbYtUzYZ9n" target="_blank" rel="noopener noreferrer">Google reviews</a> (process quality — individual visa outcomes vary).</p>

        <h2>Related guides</h2>
        <p><a href="../../client-journey.html">Client journey &amp; case examples</a> · <a href="../../answers/best-study-visa-consultant-rawalpindi.html">Best consultant FAQ</a> · <a href="../../eligibility.html">Eligibility quiz</a></p>
<!-- /local-depth -->`;
}

for (const [slug, meta] of Object.entries(BLOCKS)) {
  const file = path.join(LOCAL, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const b = block(meta).trim();
  if (DEPTH_RE.test(html)) {
    html = html.replace(DEPTH_RE, b);
  } else {
    html = html.replace(
      /<section>\s*<div class="container">\s*<article class="glass card prose" style="padding:1\.5rem">\s*<h2>Verify/,
      `<section>\n      <div class="container">\n        <article class="glass card prose" style="padding:1.5rem">\n${b}\n        </article>\n      </div>\n    </section>\n\n    <section>\n      <div class="container">\n        <article class="glass card prose" style="padding:1.5rem">\n          <h2>Verify`
    );
  }
  html = html.replace(/content="2026-08-09"/, `content="${TODAY}"`);
  fs.writeFileSync(file, html);
  console.log('local', slug);
}

console.log('Local depth complete');
