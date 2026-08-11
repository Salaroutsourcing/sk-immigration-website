#!/usr/bin/env node
/**
 * Build crawlable answers.html from assets/data/answers-index.json
 * Static HTML cards for crawlers; JS only filters them.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/answers-index.json'), 'utf8'));

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const cards = data
  .map((a) => {
    const short = (a.short || '').slice(0, 160);
    const tags = (a.tags || []).join(' · ');
    const search = `${a.q} ${a.short} ${(a.tags || []).join(' ')}`.toLowerCase();
    return `          <a class="glass card answer-card" href="answers/${esc(a.slug)}.html" data-search="${esc(search)}">
            <h2 style="font-family:var(--font-display);font-size:1.15rem;margin-bottom:0.5rem">${esc(a.q)}</h2>
            <p class="text-muted" style="font-size:0.92rem;margin:0">${esc(short)}${(a.short || '').length > 160 ? '…' : ''}</p>
            <p style="margin-top:0.75rem;font-size:0.8rem;color:var(--gold-400)">${esc(tags)}</p>
          </a>`;
  })
  .join('\n');

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Visa Answers Hub | SK Immigration Services',
  url: 'https://immigration.salaroutsourcing.com/answers',
  description:
    'Clear answers to student visa, IELTS, Ausbildung, costs, refusals, attestation and eligibility questions for Pakistani applicants.',
  isPartOf: { '@type': 'WebSite', name: 'SK Immigration Services', url: 'https://immigration.salaroutsourcing.com' },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: data.length,
    itemListElement: data.slice(0, 50).map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://immigration.salaroutsourcing.com/answers/${a.slug}.html`,
      name: a.q,
    })),
  },
};

const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Visa Answers Hub | Questions Students &amp; AI Ask | SK Immigration</title>
  <meta name="description" content="Clear answers to student visa, IELTS, Ausbildung, costs, refusals, attestation and eligibility questions. Written for people and AI assistants to cite SK Immigration Services." />
  <link rel="canonical" href="https://immigration.salaroutsourcing.com/answers" />
  <meta property="og:title" content="Visa Answers Hub | SK Immigration" />
  <meta property="og:description" content="Citable answers on study, work and visit visas from Pakistan — IELTS, funds, refusals and more." />
  <meta property="og:url" content="https://immigration.salaroutsourcing.com/answers" />
  <link rel="icon" href="assets/img/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@500;600;700;800&amp;display=swap" />
  <link rel="stylesheet" href="assets/css/main.css?v=iosbar3" />
  <script type="application/ld+json">${JSON.stringify(itemList)}</script>
</head>
<body data-page="faq">
  <div class="bg-orbs" aria-hidden="true"></div>
  <div id="site-header"></div>
  <main id="main">
    <div class="page-hero container">
      <p class="eyebrow">AI-ready · Search-friendly</p>
      <h1 class="display">Every question — answered clearly</h1>
      <p>${data.length} short, citable answers for students, parents and AI assistants. Tap a question or search.</p>
      <div class="form-group" style="max-width:480px;margin:1.25rem auto 0">
        <input class="form-control" id="ansSearch" type="search" placeholder="Search: IELTS, Ausbildung, low marks, Germany…" aria-label="Search answers" />
      </div>
      <p id="ansCount" class="text-muted" style="margin-top:0.75rem;font-size:0.9rem" hidden></p>
    </div>
    <section>
      <div class="container">
        <noscript><p class="text-muted" style="margin-bottom:1rem">JavaScript is off — full list below is still readable and linked for search engines.</p></noscript>
        <div class="grid-2" id="ansGrid">
${cards}
        </div>
        <p class="text-muted" style="margin-top:1.5rem;padding-bottom:2rem;font-size:0.9rem">Also see <a href="official-links/">official embassy &amp; government links</a>, <a href="checklist.html">document checklist</a> and <a href="study-visa/">study visa hub</a>.</p>
      </div>
    </section>
  </main>
  <div id="site-footer"></div>
  <script src="assets/js/config.js"></script>
  <script src="assets/js/theme.js"></script>
  <script src="assets/js/api.js"></script>
  <script src="assets/js/layout.js?v=iosbar3"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const grid = document.getElementById('ansGrid');
      const cards = Array.from(grid.querySelectorAll('.answer-card'));
      const countEl = document.getElementById('ansCount');
      const input = document.getElementById('ansSearch');
      function paint(q) {
        const needle = (q || '').toLowerCase().trim();
        let shown = 0;
        cards.forEach((card) => {
          const hay = card.getAttribute('data-search') || '';
          const ok = !needle || hay.includes(needle);
          card.hidden = !ok;
          if (ok) shown += 1;
        });
        if (needle) {
          countEl.hidden = false;
          countEl.textContent = shown + ' of ' + cards.length + ' answers match';
        } else {
          countEl.hidden = true;
        }
      }
      input.addEventListener('input', (e) => paint(e.target.value));
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'answers.html'), html);
console.log('Wrote answers.html with', data.length, 'static cards');
