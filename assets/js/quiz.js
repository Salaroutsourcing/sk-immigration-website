/**
 * Eligibility quiz — captures lead + shows destination matches
 */
(function () {
  const QUESTIONS = [
    {
      key: 'marks',
      title: 'What are your academic marks?',
      options: [
        { v: 'high', t: 'Above 80% / 4.0 GPA' },
        { v: 'mid', t: '65–80% / 3.0–4.0 GPA' },
        { v: 'low', t: '50–65% / 2.5–3.0 GPA' },
        { v: 'verylow', t: 'Below 50% / Low marks' },
      ],
    },
    {
      key: 'ielts',
      title: 'Do you have IELTS or an English test?',
      options: [
        { v: '65', t: 'IELTS 6.5+ / TOEFL 90+' },
        { v: '55', t: 'IELTS 5.5–6.5' },
        { v: 'low', t: 'IELTS below 5.5' },
        { v: 'none', t: 'No IELTS yet' },
      ],
    },
    {
      key: 'budget',
      title: 'What is your annual budget (tuition + living)?',
      options: [
        { v: 'low', t: 'Under USD 8,000 / year' },
        { v: 'mid', t: 'USD 8,000–15,000 / year' },
        { v: 'high', t: 'USD 15,000–25,000 / year' },
        { v: 'premium', t: 'Above USD 25,000 / year' },
      ],
    },
    {
      key: 'region',
      title: 'Where do you dream of studying or working?',
      options: [
        { v: 'eu', t: 'Europe (Schengen)' },
        { v: 'uk', t: 'United Kingdom' },
        { v: 'settler', t: 'Canada / USA / Australia' },
        { v: 'any', t: 'Open to the best option' },
      ],
    },
    {
      key: 'gap',
      title: 'How long is your study/work gap?',
      options: [
        { v: 'none', t: 'No gap / currently studying' },
        { v: 'short', t: '1–2 years' },
        { v: 'mid', t: '3–5 years' },
        { v: 'long', t: 'Above 5 years' },
      ],
    },
    {
      key: 'goal',
      title: 'What is your primary goal?',
      options: [
        { v: 'bachelor', t: "Bachelor's Degree" },
        { v: 'master', t: "Master's Degree" },
        { v: 'phd', t: 'PhD / Doctorate' },
        { v: 'ausbildung', t: 'Diploma / Ausbildung / Job' },
      ],
    },
  ];

  function matchDestinations(a) {
    const list = [];
    if (a.goal === 'ausbildung') list.push({ name: 'Germany Ausbildung', why: 'Paid vocational training with salary during study.' });
    if (a.marks === 'high' || a.marks === 'mid') {
      if (a.region === 'uk' || a.region === 'any') list.push({ name: 'United Kingdom', why: 'Strong universities; budget and CAS readiness matter.' });
      if (a.region === 'settler' || a.region === 'any') list.push({ name: 'Canada', why: 'Study + post-grad work potential for strong profiles.' });
    }
    if (a.budget === 'low' || a.budget === 'mid' || a.marks === 'low' || a.marks === 'verylow') {
      list.push({ name: 'Hungary', why: 'Often more flexible admissions and lower living costs.' });
      list.push({ name: 'Poland', why: 'Affordable Europe with growing English programs.' });
      list.push({ name: 'Romania', why: 'Budget-friendly European credentials.' });
    }
    if (a.ielts === 'none' || a.ielts === 'low') {
      list.push({ name: 'Malta / Cyprus', why: 'English-friendly pathways and foundation options.' });
      list.push({ name: 'Malaysia', why: 'Affordable Asia with English-medium campuses.' });
    }
    if (a.region === 'eu' || a.region === 'any') {
      list.push({ name: 'Germany (Study)', why: 'Public universities with low tuition; blocked account planning needed.' });
      list.push({ name: 'Italy / Portugal', why: 'Competitive tuition and lifestyle balance.' });
    }
    if (a.budget === 'premium') list.push({ name: 'Australia', why: 'High-quality education with post-study work options.' });

    /* unique by name */
    const seen = new Set();
    return list.filter((x) => (seen.has(x.name) ? false : seen.add(x.name))).slice(0, 5);
  }

  window.SalarQuiz = {
    QUESTIONS,
    matchDestinations,

    mount(rootSelector) {
      const root = document.querySelector(rootSelector);
      if (!root) return;

      let step = 0;
      const answers = {};

      function render() {
        if (step >= QUESTIONS.length) {
          const matches = matchDestinations(answers);
          const top = matches[0]?.name || 'your best-fit country';
          const checkHint =
            top.includes('Hungary') ? 'hu' :
            top.includes('Poland') ? 'pl' :
            top.includes('Germany') ? 'de' :
            top.includes('United Kingdom') || top.includes('UK') ? 'gb' :
            top.includes('Canada') ? 'ca' :
            top.includes('Malaysia') ? 'my' :
            top.includes('Australia') ? 'au' :
            top.includes('Romania') ? 'ro' :
            top.includes('Malta') || top.includes('Cyprus') ? 'mt' : 'de';
          root.innerHTML = `
            <div class="glass card">
              <p class="eyebrow">Your 1-screen result</p>
              <h3 class="section-title" style="font-size:1.5rem">Best next move: ${top}</h3>
              <p class="lead-answer" style="margin-top:0.75rem">Based on your answers you may fit: <strong>${matches.map((m) => m.name).join(', ') || 'a tailored shortlist'}</strong>. This is guidance — not a visa guarantee. Embassies decide.</p>
              <div class="roadmap" aria-label="Personal roadmap">
                <div class="roadmap-step"><span class="n">1</span><div><strong>Confirm fit</strong><p class="text-muted" style="margin:0.25rem 0 0;font-size:0.9rem">Book a free call or WhatsApp your documents.</p></div></div>
                <div class="roadmap-step"><span class="n">2</span><div><strong>Gather documents</strong><p class="text-muted" style="margin:0.25rem 0 0;font-size:0.9rem">Open the interactive checklist for ${top}.</p></div></div>
                <div class="roadmap-step"><span class="n">3</span><div><strong>Plan budget</strong><p class="text-muted" style="margin:0.25rem 0 0;font-size:0.9rem">Use the cost calculator, then compare 1 backup country.</p></div></div>
                <div class="roadmap-step"><span class="n">4</span><div><strong>File with SK</strong><p class="text-muted" style="margin:0.25rem 0 0;font-size:0.9rem">We prepare; the embassy decides. No fake promises.</p></div></div>
              </div>
              <div class="grid-2" style="margin-bottom:1.25rem">
                ${matches
                  .map(
                    (m) => `
                  <div class="glass card" style="padding:1rem">
                    <strong>${m.name}</strong>
                    <p class="text-muted" style="font-size:0.9rem;margin-top:0.35rem">${m.why}</p>
                  </div>`
                  )
                  .join('')}
              </div>
              <div class="hero-ctas" style="margin-bottom:1rem">
                <a class="btn btn-gold" href="checklist.html?country=${checkHint}">Open my checklist</a>
                <a class="btn btn-navy" href="calculator.html?country=${checkHint}">See costs</a>
                <a class="btn btn-whatsapp" href="https://wa.me/923045999859?text=${encodeURIComponent('Hi SK Immigration, my quiz top match is ' + top)}" target="_blank" rel="noopener">WhatsApp results</a>
              </div>
              <form id="quizLeadForm" class="glass-strong" style="padding:1.25rem;border-radius:1rem;border:1px solid var(--glass-border)">
                <p class="mb-2"><strong>Save your roadmap</strong> — free shortlist on WhatsApp/email.</p>
                <div class="form-row">
                  <div class="form-group"><label>Full name *</label><input class="form-control" name="name" required></div>
                  <div class="form-group"><label>WhatsApp / Phone *</label><input class="form-control" name="phone" required></div>
                </div>
                <div class="form-group"><label>Email</label><input class="form-control" name="email" type="email"></div>
                <button class="btn btn-gold w-full" type="submit">Send my results</button>
                <div class="form-msg" id="quizMsg"></div>
              </form>
              <div class="hero-ctas mt-2">
                <a class="btn btn-ghost" href="contact.html">Book free consultation</a>
                <a class="btn btn-ghost" href="compare.html">Compare countries</a>
                <button type="button" class="btn btn-ghost" id="quizRestart">Retake quiz</button>
              </div>
            </div>`;

          document.getElementById('quizRestart')?.addEventListener('click', () => {
            step = 0;
            Object.keys(answers).forEach((k) => delete answers[k]);
            render();
          });

          document.getElementById('quizLeadForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const msg = document.getElementById('quizMsg');
            try {
              await SalarAPI.saveEligibilityLead({
                name: fd.get('name'),
                phone: fd.get('phone'),
                email: fd.get('email'),
                answers,
                matches,
              });
              msg.className = 'form-msg show ok';
              msg.textContent = 'Saved! We will contact you within 24 hours with a personalized plan.';
              e.target.reset();
            } catch {
              msg.className = 'form-msg show err';
              msg.textContent = 'Something went wrong. Please WhatsApp us instead.';
            }
          });
          return;
        }

        const q = QUESTIONS[step];
        root.innerHTML = `
          <div class="glass card">
            <p class="eyebrow">Question ${step + 1} of ${QUESTIONS.length}</p>
            <h3 style="font-family:var(--font-display);font-size:1.45rem;margin-bottom:1rem">${q.title}</h3>
            <div id="quizOpts">
              ${q.options
                .map(
                  (o) =>
                    `<button type="button" class="quiz-option ${answers[q.key] === o.v ? 'selected' : ''}" data-v="${o.v}">${o.t}</button>`
                )
                .join('')}
            </div>
            <div class="flex justify-between mt-2 gap-2 flex-wrap">
              <button type="button" class="btn btn-ghost" id="quizBack" ${step === 0 ? 'disabled' : ''}>← Back</button>
              <button type="button" class="btn btn-gold" id="quizNext" ${!answers[q.key] ? 'disabled' : ''}>Next →</button>
            </div>
          </div>`;

        root.querySelectorAll('.quiz-option').forEach((btn) => {
          btn.addEventListener('click', () => {
            answers[q.key] = btn.dataset.v;
            render();
          });
        });
        document.getElementById('quizBack')?.addEventListener('click', () => {
          if (step > 0) {
            step--;
            render();
          }
        });
        document.getElementById('quizNext')?.addEventListener('click', () => {
          if (answers[q.key]) {
            step++;
            render();
          }
        });
      }

      render();
    },
  };
})();
