#!/usr/bin/env node
/** Supplement Phase 2 — visit-extra blocks for pages still under ~750 words */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VISIT = path.join(__dirname, '..', 'public', 'visit-visa');
const EXTRA_RE = /<!-- visit-extra -->[\s\S]*?<!-- \/visit-extra -->/;

function words(html) {
  const m = html.match(/<div class="prose">([\s\S]*?)<\/div>\s*<\/article>/);
  if (!m) return 0;
  return m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}

function extraBlock(name, code) {
  return `
<!-- visit-extra -->
        <h2>Cover letter outline (${name} visit from Pakistan)</h2>
        <ol>
          <li>Your role in Pakistan (job, business, study) with contactable employer</li>
          <li>Exact travel dates aligned with insurance and hotel/invite</li>
          <li>Day-level plan for ${name} cities — not a generic “Europe tour”</li>
          <li>Who pays, with six-month bank trail explaining any large deposits</li>
          <li>Why you return (dependents, property, business continuity, studies)</li>
          <li>Prior visas/refusals stated calmly with what changed</li>
        </ol>

        <h2>First-time travellers from Pakistan</h2>
        <p>No prior visas is not automatic refusal, but first files need clearer employment proof and realistic trip length. Prior compliant Schengen/UK/US travel helps when explained; unexplained gaps hurt.</p>

        <h2>Children and family groups</h2>
        <p>Carry birth certificates and school leave letters. Group itineraries must show every traveller’s ties — not only the primary applicant’s job letter.</p>

        <h2>After a refusal</h2>
        <p>Read the refusal letter themes before reapplying. Fixing only the appointment slot without stronger purpose, funds or ties usually fails again. See <a href="../../answers/visit-visa-refusal-reasons-pakistan.html">visit refusal reasons</a> and <a href="../../answers/visa-refused-what-next.html">what next</a>.</p>

        <h2>SK Immigration visit support</h2>
        <p>Free consult → honest eligibility → checklist → packaging from <strong>PKR 30,000</strong>. We do not sell visa guarantees. WhatsApp <a href="https://wa.me/923045999859">+92 304 5999859</a> · <a href="../../checklist.html?country=${code}&amp;type=visit">interactive checklist</a> · <a href="../../contact.html">office booking</a>.</p>
<!-- /visit-extra -->`;
}

const nameMap = {
  australia: { name: 'Australia', code: 'au' },
  austria: { name: 'Austria', code: 'at' },
  belgium: { name: 'Belgium', code: 'be' },
  canada: { name: 'Canada', code: 'ca' },
  cyprus: { name: 'Cyprus', code: 'cy' },
  'czech-republic': { name: 'Czech Republic', code: 'cz' },
  dubai: { name: 'Dubai/UAE', code: 'ae' },
  france: { name: 'France', code: 'fr' },
  germany: { name: 'Germany', code: 'de' },
  greece: { name: 'Greece', code: 'gr' },
  hungary: { name: 'Hungary', code: 'hu' },
  ireland: { name: 'Ireland', code: 'ie' },
  italy: { name: 'Italy', code: 'it' },
  malaysia: { name: 'Malaysia', code: 'my' },
  malta: { name: 'Malta', code: 'mt' },
  netherlands: { name: 'Netherlands', code: 'nl' },
  poland: { name: 'Poland', code: 'pl' },
  portugal: { name: 'Portugal', code: 'pt' },
  romania: { name: 'Romania', code: 'ro' },
  schengen: { name: 'Schengen', code: 'eu' },
  slovakia: { name: 'Slovakia', code: 'sk' },
  spain: { name: 'Spain', code: 'es' },
  switzerland: { name: 'Switzerland', code: 'ch' },
  turkey: { name: 'Turkey', code: 'tr' },
  uk: { name: 'UK', code: 'gb' },
  usa: { name: 'USA', code: 'us' },
};

let n = 0;
for (const dir of fs.readdirSync(VISIT)) {
  const file = path.join(VISIT, dir, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (words(html) >= 750) continue;
  const key = dir.replace('-visit-visa-pakistan', '');
  const meta = nameMap[key] || { name: key, code: key.slice(0, 2) };
  const block = extraBlock(meta.name, meta.code).trim();
  if (EXTRA_RE.test(html)) {
    html = html.replace(EXTRA_RE, block);
  } else {
    html = html.replace(/<!-- \/lander-depth -->/, `<!-- /lander-depth -->\n\n${block}`);
  }
  fs.writeFileSync(file, html);
  n += 1;
  console.log('extra', dir, words(html));
}
console.log('visit-extra added:', n);
