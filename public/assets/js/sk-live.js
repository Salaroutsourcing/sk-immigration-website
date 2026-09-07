/**
 * SK Live — course finder, FastTrack, scholarships, English pathway,
 * tracker, SOP studio, interview coach, pre-departure.
 */
(function () {
  const DATA = {
    courses: '/assets/data/sk-live-courses.json',
    scholarships: '/assets/data/sk-live-scholarships.json',
    interview: '/assets/data/sk-live-interview.json',
    predeparture: '/assets/data/sk-live-predeparture.json',
  };

  const cache = {};

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function waLink(text) {
    const phone = window.SALAR_CONFIG?.whatsapp || '923045999859';
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function loadJson(url) {
    if (cache[url]) return cache[url];
    const res = await fetch(url);
    if (!res.ok) throw new Error('load_failed');
    cache[url] = await res.json();
    return cache[url];
  }

  function lead(type, data) {
    if (window.SalarAPI?.saveLead) return window.SalarAPI.saveLead(type, data);
    return Promise.reject(new Error('no_api'));
  }

  function store(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function money(n) {
    return `$${Number(n || 0).toLocaleString()}`;
  }

  function scoreClass(n) {
    if (n >= 75) return 'is-strong';
    if (n >= 55) return 'is-ok';
    return 'is-low';
  }

  function germanRank(level) {
    const key = String(level || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    if (key.includes('b2')) return 4;
    if (key.includes('b1')) return 3;
    if (key.includes('a2')) return 2;
    if (key.includes('a1')) return 1;
    return 0;
  }

  function marksPct(band) {
    return { high: 85, mid: 72, low: 58, verylow: 42 }[band] || 60;
  }

  function ieltsNum(band) {
    const mapped = { '65': 6.5, '55': 5.8, low: 4.8, none: 0 }[band];
    if (mapped != null) return mapped;
    const n = Number(band);
    return Number.isFinite(n) ? n : 0;
  }

  function budgetUsd(band) {
    return { low: 8000, mid: 14000, high: 22000, premium: 40000 }[band] || 14000;
  }

  function scoreCourse(course, profile) {
    const reasons = [];
    let score = 48;
    const marks = marksPct(profile.marks);
    const ielts = ieltsNum(profile.ielts);
    const budget = budgetUsd(profile.budget);
    const total = (course.tuitionUsdYear || 0) + (course.livingUsdYear || 0);
    const goal = profile.goal;

    if (goal === 'ausbildung' && course.visaType === 'ausbildung') {
      score += 22;
      reasons.push('Matches Ausbildung / vocational goal');
    } else if (goal === 'ausbildung' && course.visaType !== 'ausbildung') {
      score -= 18;
      reasons.push('Degree route — not Ausbildung');
    } else if (goal === 'visit') {
      score -= 30;
      reasons.push('Study/training programmes are the wrong tool for a visit visa');
    } else if (goal === 'master' && course.level === 'Master') {
      score += 14;
      reasons.push('Master-level match');
    } else if (goal === 'bachelor' && (course.level === 'Bachelor' || course.level === 'Pathway / Foundation')) {
      score += 12;
      reasons.push('Undergraduate / pathway match');
    } else if (goal === 'master' && course.level === 'Bachelor') {
      score -= 8;
      reasons.push('This is a bachelor — you asked for a master');
    }

    if (profile.field && course.field === profile.field) {
      score += 10;
      reasons.push(`Field match: ${course.field}`);
    }

    if (marks >= (course.minMarksPct || 50)) {
      score += 10;
      reasons.push('Academic band clears the typical floor');
    } else if (course.lowMarksOk) {
      score += 2;
      reasons.push('Possible with lower marks — file quality still matters');
    } else {
      score -= 14;
      reasons.push(`Typical floor ~${course.minMarksPct}% — your marks look tight`);
    }

    if (course.ieltsMin > 0) {
      if (ielts >= course.ieltsMin) {
        score += 10;
        reasons.push(`Language: IELTS ${course.ieltsMin}+ typically asked`);
      } else if (course.moiOk && (profile.ielts === 'none' || profile.ielts === 'low')) {
        score += 6;
        reasons.push('MOI / internal test may replace IELTS — confirm the offer clause');
      } else {
        score -= 12;
        reasons.push(`IELTS ${course.ieltsMin}+ is commonly required`);
      }
    }

    if (course.germanMin) {
      const have = germanRank(profile.german);
      const need = germanRank(course.germanMin);
      if (have >= need) {
        score += 10;
        reasons.push(`German ${course.germanMin} looks in range`);
      } else {
        score -= 16;
        reasons.push(`German ${course.germanMin}+ is typically needed`);
      }
    }

    if (total === 0 && course.visaType === 'ausbildung') {
      if (profile.budget === 'low' || profile.budget === 'mid') {
        score += 8;
        reasons.push('Paid training can fit a tighter budget — contract still required');
      }
    } else if (budget >= total) {
      score += 10;
      reasons.push('Budget covers typical tuition + living');
    } else if (budget >= total * 0.75) {
      score += 2;
      reasons.push('Budget is tight vs typical year-1 cost');
    } else {
      score -= 16;
      reasons.push(`Typical year ~${money(total)} — above the budget you selected`);
    }

    if (profile.gap === 'long' && course.visaType === 'study' && course.level !== 'Pathway / Foundation') {
      score -= 8;
      reasons.push('Long gap: document work/family honestly');
    }

    score = Math.max(8, Math.min(96, Math.round(score)));
    return { score, reasons: reasons.slice(0, 5), total };
  }

  function leadForm(id, headline) {
    return `
      <form class="sklive-lead" id="${id}">
        <p><strong>${escapeHtml(headline)}</strong></p>
        <div class="form-row">
          <div class="form-group"><label>Name *</label><input class="form-control" name="name" required></div>
          <div class="form-group"><label>WhatsApp *</label><input class="form-control" name="phone" required></div>
        </div>
        <div class="form-group"><label>Email</label><input class="form-control" name="email" type="email"></div>
        <button class="btn btn-gold" type="submit">Send to SK desk</button>
        <div class="form-msg" data-msg></div>
      </form>`;
  }

  function bindLead(form, type, extra) {
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const msg = form.querySelector('[data-msg]');
      try {
        await lead(type, {
          name: fd.get('name'),
          phone: fd.get('phone'),
          email: fd.get('email'),
          ...extra(),
        });
        msg.className = 'form-msg show ok';
        msg.textContent = 'Saved. We WhatsApp a human review within 24 hours — embassies still decide visas.';
        form.reset();
      } catch {
        msg.className = 'form-msg show err';
        msg.textContent = 'Could not save — WhatsApp us instead.';
      }
    });
  }

  function emptyState(root, err) {
    root.innerHTML = `<div class="glass card"><p class="form-msg show err" style="display:block">Could not load this tool. Refresh, or <a href="${waLink('Hi SK Immigration, a tool failed to load.')}">WhatsApp us</a>. ${err ? escapeHtml(err.message || '') : ''}</p></div>`;
  }

  /* ——— Course finder ——— */
  async function mountCourseFinder(sel) {
    const root = document.querySelector(sel);
    if (!root) return;
    let pack;
    try {
      pack = await loadJson(DATA.courses);
    } catch (err) {
      return emptyState(root, err);
    }

    let shortlist = read('sk_live_shortlist', []);
    const state = {
      q: qs('q') || '',
      country: qs('country') || '',
      field: qs('field') || '',
      level: qs('level') || '',
      band: qs('budget') || '',
      moi: qs('moi') === '1',
      compare: [],
    };

    function filtered() {
      const q = state.q.trim().toLowerCase();
      return pack.courses.filter((c) => {
        if (state.country && c.countryCode !== state.country) return false;
        if (state.field && c.field !== state.field) return false;
        if (state.level && c.level !== state.level) return false;
        if (state.band && c.budgetBand !== state.band) return false;
        if (state.moi && !c.moiOk) return false;
        if (q) {
          const blob = `${c.title} ${c.country} ${c.field} ${c.level} ${c.blurb} ${c.tags.join(' ')}`.toLowerCase();
          if (!blob.includes(q)) return false;
        }
        return true;
      });
    }

    function render() {
      const list = filtered();
      const countries = [...new Map(pack.courses.map((c) => [c.countryCode, c])).values()];
      const cmp = pack.courses.filter((c) => state.compare.includes(c.id));

      root.innerHTML = `
        <div class="tool-bar glass card sklive-filters">
          <div class="form-row">
            <div class="form-group" style="flex:2">
              <label>Search</label>
              <input class="form-control" id="cfQ" value="${escapeHtml(state.q)}" placeholder="e.g. nursing, computer science, Ausbildung">
            </div>
            <div class="form-group">
              <label>Country</label>
              <select class="form-control" id="cfCountry">
                <option value="">All destinations</option>
                ${countries.map((c) => `<option value="${c.countryCode}" ${state.country === c.countryCode ? 'selected' : ''}>${c.flag} ${escapeHtml(c.country)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Field</label>
              <select class="form-control" id="cfField">
                <option value="">All fields</option>
                ${pack.fields.map((f) => `<option ${state.field === f ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Level</label>
              <select class="form-control" id="cfLevel">
                <option value="">All levels</option>
                ${pack.levels.map((f) => `<option ${state.level === f ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Budget band</label>
              <select class="form-control" id="cfBand">
                <option value="">Any</option>
                <option value="low" ${state.band === 'low' ? 'selected' : ''}>Lower cost</option>
                <option value="mid" ${state.band === 'mid' ? 'selected' : ''}>Mid</option>
                <option value="high" ${state.band === 'high' ? 'selected' : ''}>Higher</option>
                <option value="premium" ${state.band === 'premium' ? 'selected' : ''}>Premium (UK/CA/AU/NL)</option>
              </select>
            </div>
          </div>
          <label class="sklive-check"><input type="checkbox" id="cfMoi" ${state.moi ? 'checked' : ''}> MOI / without-IELTS pathways only</label>
          <p class="text-muted" style="margin:0.75rem 0 0;font-size:0.9rem">${list.length} pathways · ${shortlist.length} shortlisted · ${pack.disclaimer}</p>
        </div>

        <div class="sklive-grid mt-2">
          ${list
            .map((c) => {
              const saved = shortlist.includes(c.id);
              const on = state.compare.includes(c.id);
              const year = (c.tuitionUsdYear || 0) + (c.livingUsdYear || 0);
              return `
            <article class="sklive-card glass card" data-id="${c.id}">
              <header>
                <span class="sklive-flag">${c.flag}</span>
                <div>
                  <h3>${escapeHtml(c.title)}</h3>
                  <p class="text-muted">${escapeHtml(c.country)} · ${escapeHtml(c.level)} · ${escapeHtml(c.field)}</p>
                </div>
              </header>
              <p>${escapeHtml(c.blurb)}</p>
              <div class="viz-strip">
                <div class="viz-pill"><span>Year 1 typical</span><strong>${year ? money(year) : 'Training wage'}</strong></div>
                <div class="viz-pill"><span>IELTS</span><strong>${c.ieltsMin ? c.ieltsMin + '+' : 'German / n/a'}${c.moiOk ? ' · MOI possible' : ''}</strong></div>
                <div class="viz-pill"><span>Work rights</span><strong>${escapeHtml(c.workRights).slice(0, 42)}${c.workRights.length > 42 ? '…' : ''}</strong></div>
              </div>
              <p class="text-muted" style="font-size:0.85rem;margin-top:0.75rem">After study: ${escapeHtml(c.postStudy)} · ${escapeHtml(c.scholarshipHint)}</p>
              <div class="hero-ctas mt-2">
                <button type="button" class="btn ${saved ? 'btn-ghost' : 'btn-gold'}" data-save="${c.id}">${saved ? 'Shortlisted' : 'Shortlist'}</button>
                <button type="button" class="btn btn-ghost" data-cmp="${c.id}">${on ? 'In compare' : 'Compare'}</button>
                <a class="btn btn-ghost" href="${c.guideUrl}">Country guide</a>
              </div>
            </article>`;
            })
            .join('')}
        </div>

        ${
          cmp.length
            ? `<div class="glass card mt-2"><h2 class="section-title" style="font-size:1.25rem">Compare shortlist</h2>
          <div style="overflow:auto"><table class="data-table">
            <thead><tr><th>Pathway</th>${cmp.map((c) => `<th>${c.flag} ${escapeHtml(c.title)}</th>`).join('')}</tr></thead>
            <tbody>
              <tr><th>Country</th>${cmp.map((c) => `<td>${escapeHtml(c.country)}</td>`).join('')}</tr>
              <tr><th>Level</th>${cmp.map((c) => `<td>${escapeHtml(c.level)}</td>`).join('')}</tr>
              <tr><th>Year 1 typical</th>${cmp.map((c) => `<td>${(c.tuitionUsdYear || 0) + (c.livingUsdYear || 0) ? money((c.tuitionUsdYear || 0) + (c.livingUsdYear || 0)) : 'Training wage'}</td>`).join('')}</tr>
              <tr><th>IELTS / MOI</th>${cmp.map((c) => `<td>${c.ieltsMin || '—'} ${c.moiOk ? '(MOI possible)' : ''}</td>`).join('')}</tr>
              <tr><th>German</th>${cmp.map((c) => `<td>${escapeHtml(c.germanMin || '—')}</td>`).join('')}</tr>
              <tr><th>Post-study</th>${cmp.map((c) => `<td>${escapeHtml(c.postStudy)}</td>`).join('')}</tr>
            </tbody>
          </table></div>
          <p class="mt-2"><a class="btn btn-gold" href="${waLink('Hi SK Immigration, please review my course shortlist: ' + cmp.map((c) => c.title + ' (' + c.country + ')').join('; '))} ">WhatsApp this comparison</a>
          <a class="btn btn-ghost" href="/fasttrack/">Run FastTrack on my profile</a></p>
        </div>`
            : ''
        }

        ${leadForm('cfLead', 'Email my shortlist + a counsellor review')}
      `;

      const sync = () => {
        state.q = document.getElementById('cfQ').value;
        state.country = document.getElementById('cfCountry').value;
        state.field = document.getElementById('cfField').value;
        state.level = document.getElementById('cfLevel').value;
        state.band = document.getElementById('cfBand').value;
        state.moi = document.getElementById('cfMoi').checked;
        render();
      };
      ['cfCountry', 'cfField', 'cfLevel', 'cfBand', 'cfMoi'].forEach((id) => {
        document.getElementById(id)?.addEventListener('change', sync);
      });
      document.getElementById('cfQ')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sync();
      });
      document.getElementById('cfQ')?.addEventListener('blur', sync);

      root.querySelectorAll('[data-save]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-save');
          shortlist = shortlist.includes(id) ? shortlist.filter((x) => x !== id) : [...shortlist, id];
          store('sk_live_shortlist', shortlist);
          render();
        });
      });
      root.querySelectorAll('[data-cmp]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-cmp');
          if (state.compare.includes(id)) state.compare = state.compare.filter((x) => x !== id);
          else if (state.compare.length < 3) state.compare = [...state.compare, id];
          render();
        });
      });
      bindLead(document.getElementById('cfLead'), 'course_finder', () => ({
        query: state.q,
        country: state.country,
        field: state.field,
        shortlist: shortlist.join(','),
      }));
    }

    render();
  }

  /* ——— FastTrack ——— */
  async function mountFastTrack(sel) {
    const root = document.querySelector(sel);
    if (!root) return;
    let pack;
    try {
      pack = await loadJson(DATA.courses);
    } catch (err) {
      return emptyState(root, err);
    }

    const profile = read('sk_live_profile', {
      origin: 'pk',
      goal: 'bachelor',
      field: '',
      marks: 'mid',
      ielts: 'none',
      german: 'none',
      budget: 'mid',
      gap: 'none',
    });
    let step = 0;
    let results = [];

    const steps = [
      {
        key: 'origin',
        title: 'Where are you applying from?',
        options: [
          { v: 'pk', t: 'Pakistan' },
          { v: 'ae', t: 'UAE / Dubai' },
          { v: 'sa', t: 'Saudi Arabia' },
          { v: 'np', t: 'Nepal' },
          { v: 'bd', t: 'Bangladesh' },
        ],
      },
      {
        key: 'goal',
        title: 'What do you want this file to do?',
        options: [
          { v: 'bachelor', t: "Bachelor's degree" },
          { v: 'master', t: "Master's degree" },
          { v: 'ausbildung', t: 'Ausbildung / vocational training' },
          { v: 'visit', t: 'Visit / tourist visa (not study)' },
        ],
      },
      {
        key: 'field',
        title: 'Closest field of interest',
        options: pack.fields.map((f) => ({ v: f, t: f })),
      },
      {
        key: 'marks',
        title: 'Academic marks / GPA band',
        options: [
          { v: 'high', t: 'Above 80% / ~3.5+ GPA' },
          { v: 'mid', t: '65–80%' },
          { v: 'low', t: '50–65%' },
          { v: 'verylow', t: 'Below 50%' },
        ],
      },
      {
        key: 'ielts',
        title: 'English test today',
        options: [
          { v: '65', t: 'IELTS 6.5+ / TOEFL 90+' },
          { v: '55', t: 'IELTS 5.5–6.0' },
          { v: 'low', t: 'Below 5.5' },
          { v: 'none', t: 'No IELTS yet' },
        ],
      },
      {
        key: 'german',
        title: 'German (Goethe / telc / ÖSD)',
        options: [
          { v: 'none', t: 'None' },
          { v: 'a1', t: 'A1' },
          { v: 'a2', t: 'A2' },
          { v: 'b1', t: 'B1' },
          { v: 'b2', t: 'B2+' },
        ],
      },
      {
        key: 'budget',
        title: 'Realistic year-1 budget (tuition + living)',
        options: [
          { v: 'low', t: 'Under USD 8,000' },
          { v: 'mid', t: 'USD 8,000–15,000' },
          { v: 'high', t: 'USD 15,000–25,000' },
          { v: 'premium', t: 'Above USD 25,000' },
        ],
      },
      {
        key: 'gap',
        title: 'Study / work gap',
        options: [
          { v: 'none', t: 'None / currently studying' },
          { v: 'short', t: '1–2 years' },
          { v: 'mid', t: '3–5 years' },
          { v: 'long', t: '5+ years' },
        ],
      },
    ];

    function runMatch() {
      results = pack.courses
        .map((c) => ({ course: c, ...scoreCourse(c, profile) }))
        .sort((a, b) => b.score - a.score);
      if (profile.goal === 'visit') results = [];
    }

    function render() {
      if (step >= steps.length) {
        runMatch();
        store('sk_live_profile', profile);
        const top = results.slice(0, 5);
        const best = top[0];
        root.innerHTML = `
          <div class="glass card sklive-result">
            <p class="eyebrow">In-principle counselling assessment · not a university offer</p>
            <h2 class="section-title" style="font-size:1.45rem">${
              profile.goal === 'visit'
                ? 'Visit files are not course matches'
                : best
                  ? `Best fit right now: ${best.course.flag} ${escapeHtml(best.course.title)}`
                  : 'No clean match — talk to a counsellor'
            }</h2>
            <p class="text-muted">${
              profile.goal === 'visit'
                ? 'Use the visit-visa hub and document checklist. FastTrack scores study and Ausbildung pathways.'
                : 'Scores combine academics, language, budget and goal. Universities still issue offers; embassies still decide visas. SK does not sell seats or guarantees.'
            }</p>
            ${
              profile.goal === 'visit'
                ? `<div class="hero-ctas mt-2">
                    <a class="btn btn-gold" href="/visit-visa/">Visit visa hub</a>
                    <a class="btn btn-ghost" href="/checklist/?type=visit">Visit checklist</a>
                    <a class="btn btn-whatsapp" href="${waLink('Hi SK Immigration, I need a visit visa assessment.')}">WhatsApp</a>
                  </div>`
                : `<div class="sklive-scoreline mt-2">
                    ${top
                      .map(
                        (r) => `
                      <article class="sklive-fit ${scoreClass(r.score)}">
                        <div class="sklive-ring" aria-hidden="true"><strong>${r.score}</strong><span>fit</span></div>
                        <div>
                          <h3>${r.course.flag} ${escapeHtml(r.course.title)}</h3>
                          <p class="text-muted">${escapeHtml(r.course.country)} · ${escapeHtml(r.course.level)} · year ~${r.total ? money(r.total) : 'training wage'}</p>
                          <ul>${r.reasons.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
                          <a href="${r.course.guideUrl}">Open ${escapeHtml(r.course.country)} guide →</a>
                        </div>
                      </article>`,
                      )
                      .join('')}
                  </div>
                  <div class="hero-ctas mt-2">
                    <a class="btn btn-gold" href="/course-finder/">Refine in course finder</a>
                    <a class="btn btn-ghost" href="/checklist/?country=${encodeURIComponent(best?.course.countryCode || 'de')}">Document checklist</a>
                    <a class="btn btn-ghost" href="/english/">Language pathway</a>
                    <a class="btn btn-whatsapp" href="${waLink('Hi SK Immigration, my FastTrack top fit is ' + (best ? best.course.title + ' / ' + best.course.country + ' (score ' + best.score + ')' : 'unclear') + '. Please review.')}">WhatsApp this result</a>
                    <button type="button" class="btn btn-ghost" id="ftRedo">Retake</button>
                  </div>
                  ${leadForm('ftLead', 'Send this FastTrack result to the SK desk')}`
            }
          </div>`;
        document.getElementById('ftRedo')?.addEventListener('click', () => {
          step = 0;
          render();
        });
        bindLead(document.getElementById('ftLead'), 'fasttrack', () => ({
          ...profile,
          top: top.map((r) => `${r.course.id}:${r.score}`).join(','),
        }));
        return;
      }

      const s = steps[step];
      const pct = Math.round((step / steps.length) * 100);
      root.innerHTML = `
        <div class="glass card">
          <p class="eyebrow">SK FastTrack · step ${step + 1} of ${steps.length}</p>
          <div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width:${pct}%"></div></div>
          <h2 class="section-title" style="font-size:1.35rem;margin-top:1rem">${escapeHtml(s.title)}</h2>
          <div class="mt-2" id="ftOpts">
            ${s.options
              .map(
                (o) =>
                  `<button type="button" class="quiz-option ${profile[s.key] === o.v ? 'selected' : ''}" data-v="${escapeHtml(o.v)}">${escapeHtml(o.t)}</button>`,
              )
              .join('')}
          </div>
          <div class="hero-ctas mt-2">
            ${step ? '<button type="button" class="btn btn-ghost" id="ftBack">Back</button>' : ''}
          </div>
          <p class="text-muted" style="margin-top:1rem;font-size:0.88rem">This is a counselling score, not an admission or visa. No FastLane-style fake offer letters.</p>
        </div>`;
      root.querySelectorAll('#ftOpts [data-v]').forEach((btn) => {
        btn.addEventListener('click', () => {
          profile[s.key] = btn.getAttribute('data-v');
          step += 1;
          render();
        });
      });
      document.getElementById('ftBack')?.addEventListener('click', () => {
        step = Math.max(0, step - 1);
        render();
      });
    }

    render();
  }

  /* ——— Scholarships ——— */
  async function mountScholarships(sel) {
    const root = document.querySelector(sel);
    if (!root) return;
    let pack;
    try {
      pack = await loadJson(DATA.scholarships);
    } catch (err) {
      return emptyState(root, err);
    }
    let country = qs('country') || '';
    let type = qs('type') || '';

    function render() {
      const list = pack.scholarships.filter((s) => {
        if (country && s.countryCode !== country && !(country === 'eu' && s.countryCode === 'eu')) return false;
        if (type && s.type !== type) return false;
        return true;
      });
      const countries = [...new Map(pack.scholarships.map((s) => [s.countryCode, s])).values()];
      root.innerHTML = `
        <div class="tool-bar glass card">
          <div class="form-row">
            <div class="form-group">
              <label>Destination</label>
              <select class="form-control" id="scCountry">
                <option value="">All</option>
                ${countries.map((s) => `<option value="${s.countryCode}" ${country === s.countryCode ? 'selected' : ''}>${s.flag} ${escapeHtml(s.countries[0])}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Type</label>
              <select class="form-control" id="scType">
                <option value="">All</option>
                <option value="gov" ${type === 'gov' ? 'selected' : ''}>Government</option>
                <option value="uni" ${type === 'uni' ? 'selected' : ''}>University / partial</option>
              </select>
            </div>
          </div>
          <p class="text-muted" style="margin:0.5rem 0 0;font-size:0.9rem">${pack.disclaimer}</p>
        </div>
        <div class="sklive-grid mt-2">
          ${list
            .map(
              (s) => `
            <article class="sklive-card glass card">
              <header>
                <span class="sklive-flag">${s.flag}</span>
                <div>
                  <h3>${escapeHtml(s.name)}</h3>
                  <p class="text-muted">${escapeHtml(s.countries.join(', '))} · ${escapeHtml(s.levels.join(', '))} · ${s.type === 'gov' ? 'Government' : 'University'}</p>
                </div>
              </header>
              <p><strong>${escapeHtml(s.amount)}</strong></p>
              <p>${escapeHtml(s.fit)}</p>
              <p class="text-muted" style="font-size:0.88rem">${escapeHtml(s.eligibility)} · ${escapeHtml(s.forPakistanis)}</p>
              <p class="text-muted" style="font-size:0.88rem">Deadline: ${escapeHtml(s.deadlineNote)}</p>
              <div class="hero-ctas mt-2">
                <a class="btn btn-gold" href="${s.officialUrl}" target="_blank" rel="noopener noreferrer">Official portal</a>
                <a class="btn btn-ghost" href="${waLink('Hi SK Immigration, I want to understand fit for ' + s.name + '.')}">Ask SK</a>
              </div>
            </article>`,
            )
            .join('')}
        </div>
        ${leadForm('scLead', 'Help me shortlist scholarships I can actually apply for')}`;
      document.getElementById('scCountry').onchange = (e) => {
        country = e.target.value;
        render();
      };
      document.getElementById('scType').onchange = (e) => {
        type = e.target.value;
        render();
      };
      bindLead(document.getElementById('scLead'), 'scholarships', () => ({ country, type }));
    }
    render();
  }

  /* ——— English / German ——— */
  function mountEnglish(sel) {
    const root = document.querySelector(sel);
    if (!root) return;
    const state = read('sk_live_english', { dest: 'de', have: 'none', target: '6.0', moi: 'maybe', german: 'none' });

    function advice() {
      const have = ieltsNum(state.have === 'none' ? 'none' : state.have === 'low' ? 'low' : state.have === '55' ? '55' : '65');
      const want = Number(state.target) || 6;
      const weeks = have >= want ? 0 : Math.max(4, Math.round((want - Math.max(have, 4)) * 8));
      const lines = [];
      if (state.dest === 'de' && (state.german === 'none' || state.german === 'a1')) {
        lines.push('Germany: if the programme is German-taught or Ausbildung, Goethe/telc beats another IELTS attempt.');
      }
      if (['hu', 'pl', 'ro', 'cz', 'my', 'tr'].includes(state.dest) && state.moi === 'yes') {
        lines.push('MOI can work when the written offer accepts it. Officers can still test whether you can study in English.');
      }
      if (['gb', 'ie', 'ca', 'au', 'nl'].includes(state.dest) && state.moi === 'yes') {
        lines.push('UK/Ireland/Canada/Australia/Netherlands files usually want a Secure English test — MOI rarely replaces IELTS/PTE.');
      }
      if (have >= want) lines.push('Your current band already meets the target you typed. Confirm the offer clause anyway.');
      else lines.push(`Plan about ${weeks} weeks of focused prep before sitting a test — this is a planning range, not a promise.`);
      lines.push('Book IELTS only on official IDP or British Council sites. SK is not an IELTS test centre.');
      return { weeks, lines, have, want };
    }

    function render() {
      const a = advice();
      root.innerHTML = `
        <div class="glass card">
          <div class="form-row">
            <div class="form-group"><label>Destination</label>
              <select class="form-control" id="enDest">
                <option value="de">Germany</option><option value="hu">Hungary</option><option value="pl">Poland</option>
                <option value="gb">United Kingdom</option><option value="ie">Ireland</option><option value="ca">Canada</option>
                <option value="au">Australia</option><option value="nl">Netherlands</option><option value="it">Italy</option>
                <option value="my">Malaysia</option><option value="tr">Turkey</option><option value="ro">Romania</option>
              </select>
            </div>
            <div class="form-group"><label>Current English</label>
              <select class="form-control" id="enHave">
                <option value="none">No test yet</option>
                <option value="low">Below 5.5</option>
                <option value="55">5.5–6.0</option>
                <option value="65">6.5+</option>
              </select>
            </div>
            <div class="form-group"><label>Target band on the offer</label>
              <select class="form-control" id="enWant">
                <option>5.5</option><option>6.0</option><option>6.5</option><option>7.0</option>
              </select>
            </div>
            <div class="form-group"><label>MOI letter available?</label>
              <select class="form-control" id="enMoi">
                <option value="maybe">Not sure</option>
                <option value="yes">Yes, from last institution</option>
                <option value="no">No</option>
              </select>
            </div>
            <div class="form-group"><label>German now</label>
              <select class="form-control" id="enDe">
                <option value="none">None</option><option value="a1">A1</option><option value="a2">A2</option>
                <option value="b1">B1</option><option value="b2">B2+</option>
              </select>
            </div>
          </div>
          <div class="viz-strip mt-2">
            <div class="viz-pill"><span>Prep range</span><strong>${a.weeks ? a.weeks + ' weeks' : 'Already in range'}</strong></div>
            <div class="viz-pill"><span>Current</span><strong>${a.have ? a.have : 'No score'}</strong></div>
            <div class="viz-pill"><span>Target</span><strong>${a.want}</strong></div>
          </div>
          <ul class="mt-2" style="padding-left:1.1rem">${a.lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>
          <div class="hero-ctas mt-2">
            <a class="btn btn-gold" href="https://ielts.idp.com/" target="_blank" rel="noopener noreferrer">Official IELTS by IDP</a>
            <a class="btn btn-ghost" href="https://www.britishcouncil.pk/exam/ielts" target="_blank" rel="noopener noreferrer">British Council IELTS</a>
            <a class="btn btn-ghost" href="/fasttrack/">Run FastTrack</a>
            <a class="btn btn-whatsapp" href="${waLink('Hi SK Immigration, I need a language pathway for ' + state.dest + '.')}">WhatsApp language plan</a>
          </div>
          ${leadForm('enLead', 'Send me a personal language plan')}
        </div>`;
      const bind = (id, key) => {
        const el = document.getElementById(id);
        el.value = state[key] || el.value;
        el.onchange = () => {
          state[key] = el.value;
          store('sk_live_english', state);
          render();
        };
      };
      bind('enDest', 'dest');
      bind('enHave', 'have');
      bind('enWant', 'target');
      bind('enMoi', 'moi');
      bind('enDe', 'german');
      bindLead(document.getElementById('enLead'), 'english', () => ({ ...state }));
    }
    render();
  }

  /* ——— Tracker ——— */
  const TRACK_STAGES = [
    { id: 'profile', title: 'Profile & counselling', tip: 'Goal, budget, language, destination shortlist' },
    { id: 'docs', title: 'Documents & attestation', tip: 'Degrees, translations, MOFA/HEC as required' },
    { id: 'apply', title: 'University / contract applications', tip: 'Portals, SOP, CV, employer outreach for Ausbildung' },
    { id: 'offer', title: 'Offer or training contract', tip: 'Written offer / CAS / contract — verify the domain' },
    { id: 'funds', title: 'Funds & insurance', tip: 'Blocked account, GIC, sponsor set, health cover' },
    { id: 'vfs', title: 'Visa appointment', tip: 'VFS / embassy slot + biometrics' },
    { id: 'decision', title: 'Decision', tip: 'Embassies decide. If refused, read the letter before refiling.' },
    { id: 'travel', title: 'Pre-departure', tip: 'Tickets, housing week-1, registration rules' },
  ];

  function mountTracker(sel) {
    const root = document.querySelector(sel);
    if (!root) return;
    let file = read('sk_live_tracker', {
      name: '',
      destination: 'Germany',
      pathway: 'study',
      done: {},
      notes: '',
    });

    function render() {
      const doneN = TRACK_STAGES.filter((s) => file.done[s.id]).length;
      const pct = Math.round((doneN / TRACK_STAGES.length) * 100);
      root.innerHTML = `
        <div class="glass card">
          <div class="form-row">
            <div class="form-group"><label>Your name</label><input class="form-control" id="trName" value="${escapeHtml(file.name)}" placeholder="Optional"></div>
            <div class="form-group"><label>Destination</label><input class="form-control" id="trDest" value="${escapeHtml(file.destination)}"></div>
            <div class="form-group"><label>Pathway</label>
              <select class="form-control" id="trPath">
                <option value="study">Study</option><option value="ausbildung">Ausbildung</option>
                <option value="visit">Visit</option><option value="work">Work permit</option>
              </select>
            </div>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p class="text-muted">${doneN} / ${TRACK_STAGES.length} stages · saved only in this browser</p>
          <ol class="sklive-timeline">
            ${TRACK_STAGES.map(
              (s, i) => `
              <li class="${file.done[s.id] ? 'is-done' : ''}">
                <label>
                  <input type="checkbox" data-stage="${s.id}" ${file.done[s.id] ? 'checked' : ''}>
                  <span><strong>${i + 1}. ${escapeHtml(s.title)}</strong><small class="text-muted">${escapeHtml(s.tip)}</small></span>
                </label>
              </li>`,
            ).join('')}
          </ol>
          <div class="form-group mt-2"><label>Private notes</label><textarea class="form-control" id="trNotes" rows="3">${escapeHtml(file.notes)}</textarea></div>
          <div class="hero-ctas">
            <a class="btn btn-gold" href="/checklist/">Open checklist</a>
            <a class="btn btn-ghost" href="/pre-departure/">Pre-departure list</a>
            <a class="btn btn-whatsapp" href="${waLink(`Hi SK Immigration, tracker ${doneN}/${TRACK_STAGES.length} for ${file.destination} ${file.pathway}.`)}">WhatsApp status</a>
            <button type="button" class="btn btn-ghost" id="trReset">Reset file</button>
          </div>
          ${leadForm('trLead', 'Ask SK to review this file with me')}
        </div>`;
      document.getElementById('trPath').value = file.pathway;
      const save = () => {
        file.name = document.getElementById('trName').value;
        file.destination = document.getElementById('trDest').value;
        file.pathway = document.getElementById('trPath').value;
        file.notes = document.getElementById('trNotes').value;
        store('sk_live_tracker', file);
      };
      ['trName', 'trDest', 'trNotes'].forEach((id) => document.getElementById(id).addEventListener('change', save));
      document.getElementById('trPath').addEventListener('change', () => {
        save();
      });
      root.querySelectorAll('[data-stage]').forEach((inp) => {
        inp.addEventListener('change', () => {
          file.done[inp.getAttribute('data-stage')] = inp.checked;
          store('sk_live_tracker', file);
          render();
        });
      });
      document.getElementById('trReset').onclick = () => {
        localStorage.removeItem('sk_live_tracker');
        file = { name: '', destination: 'Germany', pathway: 'study', done: {}, notes: '' };
        render();
      };
      bindLead(document.getElementById('trLead'), 'tracker', () => ({
        destination: file.destination,
        pathway: file.pathway,
        progress: `${doneN}/${TRACK_STAGES.length}`,
      }));
    }
    render();
  }

  /* ——— SOP ——— */
  function mountSOP(sel) {
    const root = document.querySelector(sel);
    if (!root) return;
    const d = read('sk_live_sop', {
      name: '',
      course: '',
      country: 'Germany',
      last: '',
      whyCourse: '',
      whyCountry: '',
      career: '',
      funds: '',
      gap: '',
    });

    function draft() {
      const name = d.name || 'the applicant';
      return [
        `My name is ${d.name || '[Name]'}. I am applying for ${d.course || '[programme]'} in ${d.country || '[country]'} after completing ${d.last || '[last qualification]'}.`,
        d.whyCourse
          ? `I chose this programme because ${d.whyCourse}. The modules connect to skills I still need, rather than repeating what I already studied.`
          : 'I will replace this paragraph with two specific modules and why they close a skill gap.',
        d.whyCountry
          ? `${d.country} is the right location because ${d.whyCountry}. I am not treating the visa as an immigration product; the academic fit comes first.`
          : `I will explain why ${d.country} — teaching language, cost, and recognition — not “Europe is better”.`,
        d.gap ? `During my gap, ${d.gap}. I can document this period.` : 'If I have a gap, I will document work, family, or exam cycles honestly.',
        d.career
          ? `After graduation I intend to ${d.career}. That plan is consistent with the degree level I am applying for.`
          : 'I will describe a realistic role in my home market or a lawful post-study route — not a guaranteed settlement story.',
        d.funds
          ? `Funding: ${d.funds}. The evidence I will submit matches this sentence.`
          : 'I will state who pays and the lawful source of funds, matching bank documents.',
        `I understand that ${d.country} missions assess credibility, funds and purpose, and that SK Immigration prepares files — it cannot guarantee a visa. I will not submit fabricated documents.`,
      ].join('\n\n');
    }

    function render() {
      const text = draft();
      root.innerHTML = `
        <div class="glass card">
          <div class="form-row">
            <div class="form-group"><label>Full name</label><input class="form-control" id="sopName" value="${escapeHtml(d.name)}"></div>
            <div class="form-group"><label>Programme</label><input class="form-control" id="sopCourse" value="${escapeHtml(d.course)}" placeholder="M.Sc. Computer Science"></div>
            <div class="form-group"><label>Country</label><input class="form-control" id="sopCountry" value="${escapeHtml(d.country)}"></div>
            <div class="form-group"><label>Last qualification</label><input class="form-control" id="sopLast" value="${escapeHtml(d.last)}"></div>
          </div>
          <div class="form-group"><label>Why this course (modules / skill gap)</label><textarea class="form-control" id="sopWhyC" rows="2">${escapeHtml(d.whyCourse)}</textarea></div>
          <div class="form-group"><label>Why this country</label><textarea class="form-control" id="sopWhyN" rows="2">${escapeHtml(d.whyCountry)}</textarea></div>
          <div class="form-group"><label>Gap explanation (if any)</label><textarea class="form-control" id="sopGap" rows="2">${escapeHtml(d.gap)}</textarea></div>
          <div class="form-group"><label>Career after the degree</label><textarea class="form-control" id="sopCareer" rows="2">${escapeHtml(d.career)}</textarea></div>
          <div class="form-group"><label>Who pays / source of funds</label><textarea class="form-control" id="sopFunds" rows="2">${escapeHtml(d.funds)}</textarea></div>
          <p class="eyebrow">Draft — edit in your own words before you submit anything</p>
          <textarea class="form-control" id="sopOut" rows="14">${escapeHtml(text)}</textarea>
          <div class="hero-ctas mt-2">
            <button type="button" class="btn btn-gold" id="sopCopy">Copy draft</button>
            <a class="btn btn-whatsapp" href="${waLink('Hi SK Immigration, please review my SOP draft for ' + (d.course || 'my course') + ' in ' + d.country + '.')}">WhatsApp for human edit</a>
          </div>
          <div class="form-msg" id="sopMsg"></div>
          ${leadForm('sopLead', 'Send this draft to SK for a counsellor edit')}
        </div>`;
      const map = {
        sopName: 'name',
        sopCourse: 'course',
        sopCountry: 'country',
        sopLast: 'last',
        sopWhyC: 'whyCourse',
        sopWhyN: 'whyCountry',
        sopGap: 'gap',
        sopCareer: 'career',
        sopFunds: 'funds',
      };
      Object.entries(map).forEach(([id, key]) => {
        document.getElementById(id).addEventListener('input', (e) => {
          d[key] = e.target.value;
          store('sk_live_sop', d);
          document.getElementById('sopOut').value = draft();
        });
      });
      document.getElementById('sopCopy').onclick = async () => {
        const val = document.getElementById('sopOut').value;
        try {
          await navigator.clipboard.writeText(val);
          const msg = document.getElementById('sopMsg');
          msg.className = 'form-msg show ok';
          msg.textContent = 'Copied. Rewrite clichés before you file.';
        } catch {
          /* ignore */
        }
      };
      bindLead(document.getElementById('sopLead'), 'sop', () => ({ country: d.country, course: d.course, draft: document.getElementById('sopOut').value.slice(0, 4000) }));
    }
    render();
  }

  /* ——— Interview ——— */
  async function mountInterview(sel) {
    const root = document.querySelector(sel);
    if (!root) return;
    let pack;
    try {
      pack = await loadJson(DATA.interview);
    } catch (err) {
      return emptyState(root, err);
    }
    let setId = qs('set') || pack.sets[0].id;
    let answers = read('sk_live_interview', {});
    let idx = 0;

    function scoreAnswer(text, item) {
      const t = (text || '').trim();
      if (t.length < 40) return { n: 25, note: 'Too short — officers expect specifics (city, modules, numbers).' };
      let n = 55;
      const low = t.toLowerCase();
      if (/\b(guarantee|100%|settle forever|asylum)\b/.test(low)) {
        n -= 25;
        return { n: Math.max(10, n), note: 'Avoid guarantee / settlement slogans. That is a refusal pattern.' };
      }
      if (t.length > 120) n += 15;
      if (/\b(\d|€|\$|ielts|module|campus|sponsor)\b/i.test(t)) n += 10;
      if (item.redFlag && low.includes('agent will arrange')) n -= 20;
      return { n: Math.min(92, n), note: t.length > 200 ? 'Good length. Check it matches your SOP and bank paper.' : 'Add one number (fees, hours, date) and one named institution.' };
    }

    function render() {
      const set = pack.sets.find((s) => s.id === setId) || pack.sets[0];
      const q = set.questions[idx];
      const key = `${set.id}_${idx}`;
      const scored = answers[key] ? scoreAnswer(answers[key], q) : null;
      root.innerHTML = `
        <div class="glass card">
          <div class="form-row">
            <div class="form-group"><label>Interview set</label>
              <select class="form-control" id="ivSet">
                ${pack.sets.map((s) => `<option value="${s.id}" ${s.id === set.id ? 'selected' : ''}>${escapeHtml(s.label)}</option>`).join('')}
              </select>
            </div>
          </div>
          <p class="text-muted">${pack.disclaimer}</p>
          <p class="eyebrow">Question ${idx + 1} / ${set.questions.length}</p>
          <h2 class="section-title" style="font-size:1.25rem">${escapeHtml(q.q)}</h2>
          <p><strong>Strong answer includes:</strong> ${escapeHtml(q.tip)}</p>
          <p class="text-muted"><strong>Red flag:</strong> ${escapeHtml(q.redFlag)}</p>
          <textarea class="form-control" id="ivAns" rows="5" placeholder="Type your answer in your own words…">${escapeHtml(answers[key] || '')}</textarea>
          ${scored ? `<div class="sklive-fit ${scoreClass(scored.n)} mt-2" style="padding:0.85rem"><div class="sklive-ring"><strong>${scored.n}</strong><span>draft</span></div><p>${escapeHtml(scored.note)}</p></div>` : ''}
          <div class="hero-ctas mt-2">
            <button type="button" class="btn btn-gold" id="ivScore">Score this answer</button>
            <button type="button" class="btn btn-ghost" id="ivPrev" ${idx === 0 ? 'disabled' : ''}>Previous</button>
            <button type="button" class="btn btn-ghost" id="ivNext" ${idx >= set.questions.length - 1 ? 'disabled' : ''}>Next</button>
            <a class="btn btn-whatsapp" href="${waLink('Hi SK Immigration, I want a mock interview for ' + set.label + '.')}">Book a human mock</a>
          </div>
        </div>`;
      document.getElementById('ivSet').onchange = (e) => {
        setId = e.target.value;
        idx = 0;
        render();
      };
      document.getElementById('ivScore').onclick = () => {
        answers[key] = document.getElementById('ivAns').value;
        store('sk_live_interview', answers);
        render();
      };
      document.getElementById('ivPrev').onclick = () => {
        answers[key] = document.getElementById('ivAns').value;
        store('sk_live_interview', answers);
        idx = Math.max(0, idx - 1);
        render();
      };
      document.getElementById('ivNext').onclick = () => {
        answers[key] = document.getElementById('ivAns').value;
        store('sk_live_interview', answers);
        idx = Math.min(set.questions.length - 1, idx + 1);
        render();
      };
    }
    render();
  }

  /* ——— Pre-departure ——— */
  async function mountPreDeparture(sel) {
    const root = document.querySelector(sel);
    if (!root) return;
    let pack;
    try {
      pack = await loadJson(DATA.predeparture);
    } catch (err) {
      return emptyState(root, err);
    }
    let id = qs('country') || 'de';
    let ticks = read('sk_live_predep', {});

    function render() {
      const dest = pack.destinations.find((d) => d.id === id) || pack.destinations[0];
      const generic = pack.destinations.find((d) => d.id === 'generic');
      const items = [...(generic?.items || []), ...dest.items];
      const key = dest.id;
      const saved = ticks[key] || {};
      const done = items.filter((i) => saved[i.title]).length;
      const pct = Math.round((done / items.length) * 100);
      root.innerHTML = `
        <div class="tool-bar glass card">
          <div class="form-group"><label>Destination</label>
            <select class="form-control" id="pdDest">
              ${pack.destinations.filter((d) => d.id !== 'generic').map((d) => `<option value="${d.id}" ${d.id === dest.id ? 'selected' : ''}>${d.flag} ${escapeHtml(d.name)}</option>`).join('')}
            </select>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p class="text-muted">${done}/${items.length} · ${pack.disclaimer}</p>
        </div>
        <div class="glass card mt-2">
          <h2 class="section-title" style="font-size:1.3rem">${dest.flag} ${escapeHtml(dest.name)} — first-week file</h2>
          <ul class="check-list">
            ${items
              .map(
                (i) => `
              <li class="check-item ${saved[i.title] ? 'done' : ''}">
                <label>
                  <input type="checkbox" data-title="${escapeHtml(i.title)}" ${saved[i.title] ? 'checked' : ''}/>
                  <span><strong>${escapeHtml(i.title)}</strong><small class="text-muted">${escapeHtml(i.tip)}</small></span>
                </label>
              </li>`,
              )
              .join('')}
          </ul>
          <div class="hero-ctas mt-2">
            <a class="btn btn-gold" href="${waLink('Hi SK Immigration, please walk me through pre-departure for ' + dest.name + '.')}">WhatsApp briefing</a>
            <a class="btn btn-ghost" href="/tracker/">Back to tracker</a>
          </div>
        </div>`;
      document.getElementById('pdDest').onchange = (e) => {
        id = e.target.value;
        render();
      };
      root.querySelectorAll('[data-title]').forEach((inp) => {
        inp.addEventListener('change', () => {
          const cur = ticks[key] || {};
          cur[inp.getAttribute('data-title')] = inp.checked;
          ticks[key] = cur;
          store('sk_live_predep', ticks);
          render();
        });
      });
    }
    render();
  }

  window.SKLive = {
    mountCourseFinder,
    mountFastTrack,
    mountScholarships,
    mountEnglish,
    mountTracker,
    mountSOP,
    mountInterview,
    mountPreDeparture,
  };
})();
