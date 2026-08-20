/**
 * Jobs / Ausbildung listings — prefers D1 public API, falls back to JSON seed.
 */
(function () {
  function dataUrl(file) {
    const inAdmin = location.pathname.includes('/admin');
    return (inAdmin ? '../' : '') + 'assets/data/' + file;
  }

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function loadJobs() {
    if (window.SalarAPI?.listJobsPublic) {
      const fromApi = await SalarAPI.listJobsPublic();
      if (fromApi && fromApi.length) return fromApi;
    }
    try {
      const res = await fetch(dataUrl('jobs.json'));
      return await res.json();
    } catch {
      return [];
    }
  }

  function renderCards(jobs, container) {
    if (!jobs.length) {
      container.innerHTML = `<p class="text-muted">No jobs match your filters. Try clearing filters or <a href="contact.html" class="text-gold">contact us</a>.</p>`;
      return;
    }
    container.innerHTML = jobs
      .map(
        (j) => `
      <article class="glass job-card reveal">
        <div class="flex justify-between items-center flex-wrap gap-2">
          <h3 style="font-family:var(--font-display);font-size:1.15rem">${esc(j.title)}</h3>
          ${j.featured ? '<span class="badge">Featured</span>' : ''}
        </div>
        <p class="text-muted" style="font-size:0.9rem">${esc(j.company)} · ${esc(j.city)}, ${esc(j.country)}</p>
        <div class="job-meta">
          <span class="badge badge-muted">${esc(j.type)}</span>
          <span class="badge badge-muted">${esc(j.category)}</span>
          <span class="badge badge-muted">${esc(j.language)}</span>
        </div>
        <p style="font-size:0.925rem">${esc(j.description)}</p>
        <p class="text-gold" style="font-weight:600;font-size:0.9rem">${esc(j.salary)}</p>
        <div class="flex gap-2 flex-wrap">
          <button type="button" class="btn btn-gold btn-sm" data-apply="${esc(j.id)}">Apply now</button>
          <button type="button" class="btn btn-ghost btn-sm" data-detail="${esc(j.id)}">Details</button>
        </div>
      </article>`
      )
      .join('');

    container.querySelectorAll('[data-apply]').forEach((btn) => {
      btn.addEventListener('click', () => openApply(jobs.find((x) => x.id === btn.dataset.apply)));
    });
    container.querySelectorAll('[data-detail]').forEach((btn) => {
      btn.addEventListener('click', () => openDetail(jobs.find((x) => x.id === btn.dataset.detail)));
    });

    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => el.classList.add('visible'));
  }

  function ensureModal() {
    let m = document.getElementById('jobModal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'jobModal';
    m.className = 'modal-backdrop';
    m.innerHTML = `<div class="modal glass-strong" role="dialog" aria-modal="true"><div id="jobModalBody"></div></div>`;
    document.body.appendChild(m);
    m.addEventListener('click', (e) => {
      if (e.target === m) m.classList.remove('open');
    });
    return m;
  }

  function openDetail(job) {
    if (!job) return;
    const m = ensureModal();
    document.getElementById('jobModalBody').innerHTML = `
      <h2 class="display" style="font-size:1.5rem;margin-bottom:0.5rem">${esc(job.title)}</h2>
      <p class="text-muted mb-2">${esc(job.company)} · ${esc(job.city)}, ${esc(job.country)}</p>
      <p class="mb-2">${esc(job.description)}</p>
      <p class="text-gold mb-2"><strong>${esc(job.salary)}</strong></p>
      <h3 style="margin-bottom:0.5rem">Requirements</h3>
      <ul class="prose">${(job.requirements || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      <div class="flex gap-2 mt-3">
        <button type="button" class="btn btn-gold" id="detailApply">Apply</button>
        <button type="button" class="btn btn-ghost" onclick="document.getElementById('jobModal').classList.remove('open')">Close</button>
      </div>`;
    m.classList.add('open');
    document.getElementById('detailApply')?.addEventListener('click', () => openApply(job));
  }

  function openApply(job) {
    if (!job) return;
    const m = ensureModal();
    document.getElementById('jobModalBody').innerHTML = `
      <h2 class="display" style="font-size:1.35rem;margin-bottom:0.75rem">Apply: ${esc(job.title)}</h2>
      <form id="jobApplyForm">
        <input type="hidden" name="jobId" value="${esc(job.id)}">
        <input type="hidden" name="jobTitle" value="${esc(job.title)}">
        <div class="form-row">
          <div class="form-group"><label>Full name *</label><input class="form-control" name="name" required></div>
          <div class="form-group"><label>Email *</label><input class="form-control" name="email" type="email" required></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>WhatsApp / Phone *</label><input class="form-control" name="phone" required></div>
          <div class="form-group"><label>Nationality *</label><input class="form-control" name="nationality" required></div>
        </div>
        <div class="form-group"><label>Years of experience</label><input class="form-control" name="experience" placeholder="e.g. 2 years nursing"></div>
        <div class="form-group"><label>Cover note</label><textarea class="form-control" name="note" placeholder="Why you are a fit..."></textarea></div>
        <div class="form-group"><label>Paste CV text (or build one first)</label><textarea class="form-control" name="cvText" style="min-height:90px"></textarea></div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.75rem">Tip: use our <a class="text-gold" href="cv-builder.html">free CV builder</a> then paste here.</p>
        <button class="btn btn-gold w-full" type="submit">Submit application</button>
        <div class="form-msg" id="applyMsg"></div>
      </form>
      <button type="button" class="btn btn-ghost btn-sm mt-2" onclick="document.getElementById('jobModal').classList.remove('open')">Cancel</button>`;
    m.classList.add('open');

    document.getElementById('jobApplyForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const msg = document.getElementById('applyMsg');
      const data = Object.fromEntries(fd.entries());
      try {
        await SalarAPI.saveJobApplication(data);
        msg.className = 'form-msg show ok';
        msg.textContent = 'Application received! Our recruitment team will review and contact you.';
        e.target.reset();
      } catch {
        msg.className = 'form-msg show err';
        msg.textContent = 'Could not submit. Please try WhatsApp.';
      }
    });
  }

  window.SalarJobs = {
    async mount({ listSelector, filterType }) {
      const container = document.querySelector(listSelector);
      if (!container) return;
      let jobs = await loadJobs();
      if (filterType) jobs = jobs.filter((j) => j.type === filterType);

      const all = jobs.slice();
      const search = document.getElementById('jobSearch');
      const country = document.getElementById('jobCountry');
      const category = document.getElementById('jobCategory');
      const type = document.getElementById('jobType');

      if (country) {
        const countries = [...new Set(all.map((j) => j.country).filter(Boolean))].sort();
        country.innerHTML =
          `<option value="">All countries</option>` +
          countries.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
      }
      if (category) {
        const cats = [...new Set(all.map((j) => j.category).filter(Boolean))].sort();
        category.innerHTML =
          `<option value="">All categories</option>` +
          cats.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
      }

      function applyFilters() {
        let filtered = all.slice();
        const q = (search?.value || '').toLowerCase();
        if (q) {
          filtered = filtered.filter((j) =>
            (j.title + j.company + j.city + j.description).toLowerCase().includes(q)
          );
        }
        if (country?.value) filtered = filtered.filter((j) => j.country === country.value);
        if (category?.value) filtered = filtered.filter((j) => j.category === category.value);
        if (type?.value) filtered = filtered.filter((j) => j.type === type.value);
        renderCards(filtered, container);
      }

      [search, country, category, type].forEach((el) => el?.addEventListener('input', applyFilters));
      applyFilters();
    },
  };
})();
