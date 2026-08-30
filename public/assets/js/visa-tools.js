/**
 * Checklist · Calculator · Compare — driven by visa-intel.json
 */
(function () {
  let INTEL = null;

  async function loadIntel() {
    if (INTEL) return INTEL;
    const res = await fetch('/assets/data/visa-intel.json');
    INTEL = await res.json();
    return INTEL;
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function countryByCode(intel, code) {
    return intel.countries.find((c) => c.code === code) || intel.countries[0];
  }

  function waLink(text) {
    const phone = window.SALAR_CONFIG?.whatsapp || '923045999859';
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  /* ——— Checklist ——— */
  async function mountChecklist(rootSel) {
    const root = document.querySelector(rootSel);
    if (!root) return;
    root.innerHTML = '<div class="glass card" style="padding:1.25rem"><p class="text-muted" style="margin:0">Loading interactive tick checklist…</p></div>';
    let intel;
    try {
      intel = await loadIntel();
    } catch (err) {
      root.innerHTML = `<div class="glass card" style="padding:1.25rem"><p class="form-msg show err" style="display:block">Could not load checklist data. Please refresh, or <a href="https://wa.me/923045999859">WhatsApp us</a>.</p></div>`;
      return;
    }
    let code = qs('country') || 'de';
    let type = qs('type') || 'study';
    const storageKey = () => `sk_check_${code}_${type}`;

    function render() {
      const c = countryByCode(intel, code);
      if (!c.visa_types.includes(type)) type = c.visa_types[0];
      const pack = c.checklists[type] || { documents: [] };
      const saved = JSON.parse(localStorage.getItem(storageKey()) || '{}');
      const docs = pack.documents;
      const done = docs.filter((d) => saved[d.title]).length;
      const pct = docs.length ? Math.round((done / docs.length) * 100) : 0;

      root.innerHTML = `
        <div class="tool-bar glass card">
          <div class="form-row">
            <div class="form-group">
              <label>Country</label>
              <select class="form-control" id="ckCountry">
                ${intel.countries.map((x) => `<option value="${x.code}" ${x.code === code ? 'selected' : ''}>${x.flag} ${x.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Visa / pathway</label>
              <select class="form-control" id="ckType">
                ${c.visa_types.map((t) => `<option value="${t}" ${t === type ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p class="text-muted" style="margin:0.75rem 0 0;font-size:0.9rem">${done} of ${docs.length} ready · ${pct}% · Last verified ${pack.last_verified || intel.updated}</p>
        </div>

        <div class="glass card mt-2" style="padding:1.25rem">
          <h2 class="section-title" style="font-size:1.35rem;margin-bottom:0.35rem">${c.flag} ${c.name} — ${type} checklist</h2>
          <p class="text-muted" style="font-size:0.92rem">${intel.disclaimer}</p>
          <ul class="check-list" id="ckList">
            ${docs
              .map(
                (d, i) => `
              <li class="check-item ${saved[d.title] ? 'done' : ''}">
                <label>
                  <input type="checkbox" data-title="${d.title.replace(/"/g, '&quot;')}" ${saved[d.title] ? 'checked' : ''} />
                  <span>
                    <strong>${d.title}</strong>
                    <span class="badge">${d.level}</span>
                    <small class="text-muted">${d.tip}</small>
                    <small class="text-muted">Source / issuer: ${d.issuer}</small>
                  </span>
                </label>
              </li>`
              )
              .join('')}
          </ul>

          <h3 style="font-family:var(--font-display);margin:1.5rem 0 0.5rem;font-size:1.1rem">Official sources to verify</h3>
          <ul class="source-list">
            ${(c.official_sources || []).map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a></li>`).join('')}
          </ul>

          <div class="hero-ctas mt-2">
            <a class="btn btn-gold" href="${waLink(`Hi SK Immigration, please review my ${c.name} ${type} checklist (${done}/${docs.length} done).`)}">WhatsApp my checklist</a>
            <a class="btn btn-navy" href="/contact/">Email me a personal list</a>
            <a class="btn btn-ghost" href="${c.guide_url.startsWith('/') ? c.guide_url : '/' + c.guide_url}">Full ${c.name} guide</a>
            <button type="button" class="btn btn-ghost" id="ckReset">Reset ticks</button>
          </div>
          <form id="ckLead" class="glass-strong mt-2" style="padding:1rem;border-radius:1rem;border:1px solid var(--glass-border)">
            <p style="margin:0 0 0.75rem;font-weight:600">Email me this checklist + free review</p>
            <div class="form-row">
              <div class="form-group"><label>Name *</label><input class="form-control" name="name" required></div>
              <div class="form-group"><label>WhatsApp *</label><input class="form-control" name="phone" required></div>
            </div>
            <div class="form-group"><label>Email</label><input class="form-control" name="email" type="email"></div>
            <button class="btn btn-gold" type="submit">Send checklist lead</button>
            <div class="form-msg" id="ckMsg"></div>
          </form>
        </div>`;

      document.getElementById('ckCountry').onchange = (e) => {
        code = e.target.value;
        render();
      };
      document.getElementById('ckType').onchange = (e) => {
        type = e.target.value;
        render();
      };
      document.getElementById('ckReset')?.addEventListener('click', () => {
        localStorage.removeItem(storageKey());
        render();
      });
      root.querySelectorAll('#ckList input[type=checkbox]').forEach((inp) => {
        inp.addEventListener('change', () => {
          const cur = JSON.parse(localStorage.getItem(storageKey()) || '{}');
          cur[inp.dataset.title] = inp.checked;
          localStorage.setItem(storageKey(), JSON.stringify(cur));
          render();
        });
      });
      document.getElementById('ckLead')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const msg = document.getElementById('ckMsg');
        try {
          await SalarAPI.saveLead('checklist', {
            name: fd.get('name'),
            phone: fd.get('phone'),
            email: fd.get('email'),
            country: c.name,
            visaType: type,
            progress: `${done}/${docs.length}`,
          });
          msg.className = 'form-msg show ok';
          msg.textContent = 'Saved! We will WhatsApp your personalized checklist within 24 hours.';
          e.target.reset();
        } catch {
          msg.className = 'form-msg show err';
          msg.textContent = 'Could not save — please WhatsApp us instead.';
        }
      });
    }
    render();
  }

  /* ——— Calculator ——— */
  async function mountCalculator(rootSel) {
    const root = document.querySelector(rootSel);
    if (!root) return;
    const intel = await loadIntel();
    let code = qs('country') || 'hu';

    function render() {
      const c = countryByCode(intel, code);
      const m = c.metrics;
      const low = m.total_year_usd_low;
      const high = m.total_year_usd_high;
      const mid = Math.round((low + high) / 2);

      root.innerHTML = `
        <div class="tool-bar glass card">
          <div class="form-group">
            <label>Destination</label>
            <select class="form-control" id="calcCountry">
              ${intel.countries.map((x) => `<option value="${x.code}" ${x.code === code ? 'selected' : ''}>${x.flag} ${x.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="glass card mt-2" style="padding:1.5rem">
          <h2 class="section-title" style="font-size:1.4rem">${c.flag} ${c.name} — yearly cost band</h2>
          <p class="text-muted">Planning ranges for tuition + living (USD). Not a quote. Embassy fees & flights extra.</p>
          <div class="cost-viz">
            <div class="cost-bar"><span style="width:${Math.min(100, (low / 50000) * 100)}%"></span></div>
            <div class="cost-nums">
              <div><span class="text-muted">Low</span><strong>$${low.toLocaleString()}</strong></div>
              <div><span class="text-muted">Typical</span><strong>$${mid.toLocaleString()}</strong></div>
              <div><span class="text-muted">High</span><strong>$${high.toLocaleString()}</strong></div>
            </div>
          </div>
          <div class="viz-strip mt-2">
            <div class="viz-pill"><span>Tuition</span><strong>${m.tuition}</strong></div>
            <div class="viz-pill"><span>Living / mo</span><strong>${m.living_month}</strong></div>
            <div class="viz-pill"><span>Timeline</span><strong>${m.timeline_months} mo</strong></div>
            <div class="viz-pill"><span>IELTS</span><strong>${m.ielts.slice(0, 40)}${m.ielts.length > 40 ? '…' : ''}</strong></div>
          </div>
          <h3 style="font-family:var(--font-display);margin:1.5rem 0 0.5rem;font-size:1.1rem">Cost breakdown</h3>
          <table class="data-table"><thead><tr><th>Item</th><th>Range</th></tr></thead>
          <tbody>${(c.costs || []).map((row) => `<tr><td>${row.item}</td><td>${row.amount}</td></tr>`).join('')}</tbody></table>
          <div class="hero-ctas mt-2">
            <a class="btn btn-gold" href="/checklist/?country=${c.code}">Documents for ${c.name}</a>
            <a class="btn btn-navy" href="/contact/">Get personal budget plan</a>
            <a class="btn btn-ghost" href="/compare/?a=${c.code}">Compare with another country</a>
          </div>
        </div>`;

      document.getElementById('calcCountry').onchange = (e) => {
        code = e.target.value;
        render();
      };
    }
    render();
  }

  /* ——— Compare ——— */
  async function mountCompare(rootSel) {
    const root = document.querySelector(rootSel);
    if (!root) return;
    const intel = await loadIntel();
    let a = qs('a') || 'hu';
    let b = qs('b') || 'pl';

    function cell(v) {
      return `<td>${v}</td>`;
    }

    function render() {
      const ca = countryByCode(intel, a);
      const cb = countryByCode(intel, b);
      const rows = [
        ['Living / month', ca.metrics.living_month, cb.metrics.living_month],
        ['Yearly band (USD)', `$${ca.metrics.total_year_usd_low.toLocaleString()}–$${ca.metrics.total_year_usd_high.toLocaleString()}`, `$${cb.metrics.total_year_usd_low.toLocaleString()}–$${cb.metrics.total_year_usd_high.toLocaleString()}`],
        ['Timeline', ca.metrics.timeline_months + ' months', cb.metrics.timeline_months + ' months'],
        ['IELTS', ca.metrics.ielts, cb.metrics.ielts],
        ['Low marks fit', ca.metrics.low_marks, cb.metrics.low_marks],
        ['Language', ca.metrics.language, cb.metrics.language],
        ['Part-time work', ca.metrics.part_time_work, cb.metrics.part_time_work],
        ['After studies', ca.metrics.post_study, cb.metrics.post_study],
      ];

      root.innerHTML = `
        <div class="tool-bar glass card">
          <div class="form-row">
            <div class="form-group"><label>Country A</label>
              <select class="form-control" id="cmpA">${intel.countries.map((x) => `<option value="${x.code}" ${x.code === a ? 'selected' : ''}>${x.flag} ${x.name}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label>Country B</label>
              <select class="form-control" id="cmpB">${intel.countries.map((x) => `<option value="${x.code}" ${x.code === b ? 'selected' : ''}>${x.flag} ${x.name}</option>`).join('')}</select>
            </div>
          </div>
        </div>
        <div class="glass card mt-2" style="padding:1.25rem;overflow-x:auto">
          <table class="data-table compare-table">
            <thead><tr><th>Factor</th><th>${ca.flag} ${ca.name}</th><th>${cb.flag} ${cb.name}</th></tr></thead>
            <tbody>
              ${rows.map(([k, x, y]) => `<tr><th scope="row">${k}</th>${cell(x)}${cell(y)}</tr>`).join('')}
            </tbody>
          </table>
          <p class="text-muted" style="font-size:0.9rem;margin-top:1rem">${intel.disclaimer}</p>
          <div class="hero-ctas mt-2">
            <a class="btn btn-gold" href="/eligibility/">Find my best fit (quiz)</a>
            <a class="btn btn-navy" href="/contact/">Free consult on both</a>
            <a class="btn btn-ghost" href="/checklist/?country=${ca.code}">Checklist ${ca.name}</a>
            <a class="btn btn-ghost" href="/checklist/?country=${cb.code}">Checklist ${cb.name}</a>
          </div>
        </div>`;

      document.getElementById('cmpA').onchange = (e) => {
        a = e.target.value;
        render();
      };
      document.getElementById('cmpB').onchange = (e) => {
        b = e.target.value;
        render();
      };
    }
    render();
  }

  window.SalarTools = { mountChecklist, mountCalculator, mountCompare, loadIntel };
})();
