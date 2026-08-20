/**
 * Shared admin shell — login, sidebar, service catalog helpers.
 */
(function () {
  const PAGE = document.body?.dataset?.adminPage || 'leads';

  /** Every public service on the website → CRM lead types + page links */
  const SERVICES = [
    {
      id: 'study',
      name: 'Study Visa',
      blurb: 'University / college pathways from the study-visa hub and student forms.',
      types: ['student', 'eligibility'],
      href: '../study-visa/',
      filter: 'group:study',
    },
    {
      id: 'appointments',
      name: 'Visa Appointments',
      blurb: 'Schengen, UK, USA, Canada, Australia appointment assistance leads.',
      types: ['visa_appointment'],
      href: '../visa-appointment/',
      filter: 'visa_appointment',
    },
    {
      id: 'saudi',
      name: 'Saudi Visa Processing',
      blurb: 'Complete Saudi work visa processing (E-Number + Protector + visa).',
      types: ['saudi'],
      href: '../saudi-visa/saudi-visa-processing-pakistan/',
      filter: 'saudi',
    },
    {
      id: 'work',
      name: 'Work Permit & Jobs',
      blurb: 'Job applications and work-permit candidates from jobs pages.',
      types: ['job_application'],
      href: '../jobs.html',
      filter: 'job_application',
    },
    {
      id: 'ausbildung',
      name: 'Ausbildung / Schengen Training',
      blurb: 'Germany Ausbildung and vocational training interest (via jobs + contact).',
      types: ['job_application'],
      href: '../ausbildung.html',
      filter: 'job_application',
    },
    {
      id: 'visit',
      name: 'Visit / Consult',
      blurb: 'Contact, booking and general consult requests (visit visas included).',
      types: ['contact', 'booking', 'lead'],
      href: '../contact.html',
      filter: 'group:consult',
    },
    {
      id: 'attestation',
      name: 'Document Attestation',
      blurb: 'Musadaqa, QVP, Apostille, MOFA and checklist requests.',
      types: ['attestation', 'checklist'],
      href: '../document-services/',
      filter: 'group:docs',
    },
    {
      id: 'hire',
      name: 'Hire Workers (Employers)',
      blurb: 'Employer registration, workforce needs and quotation requests.',
      types: ['employer', 'workforce', 'quotation'],
      href: '../hire-workers-from-pakistan/',
      filter: 'group:employers',
    },
    {
      id: 'cv',
      name: 'CV Builder',
      blurb: 'Candidates who built or submitted a CV on the website.',
      types: ['cv'],
      href: '../cv-builder.html',
      filter: 'cv',
    },
    {
      id: 'eligibility',
      name: 'Eligibility Quiz',
      blurb: 'Quiz completions used for study / pathway matching.',
      types: ['eligibility'],
      href: '../eligibility.html',
      filter: 'eligibility',
    },
  ];

  const TYPE_LABELS = {
    contact: 'Consult / Contact',
    booking: 'Booking',
    lead: 'General lead',
    student: 'Study visa',
    eligibility: 'Eligibility quiz',
    visa_appointment: 'Visa appointment',
    saudi: 'Saudi visa',
    attestation: 'Attestation',
    checklist: 'Doc checklist',
    cv: 'CV builder',
    job_application: 'Job / Ausbildung',
    employer: 'Employer registration',
    workforce: 'Workforce request',
    quotation: 'Quotation request',
  };

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])
    );
  }

  function typeLabel(type) {
    return TYPE_LABELS[type] || type || 'Lead';
  }

  function statusBadge(status) {
    const s = status || 'new';
    return `<span class="adm-badge adm-badge-${esc(s)}">${esc(String(s).replace(/_/g, ' '))}</span>`;
  }

  function whatsappLink(phone, name) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (!digits) return null;
    const text = encodeURIComponent(
      `Hi ${name || ''}, this is SK Immigration Services following up on your enquiry.`
    );
    return `https://wa.me/${digits}?text=${text}`;
  }

  function countByTypes(leads, types) {
    const set = new Set(types);
    return (leads || []).filter((l) => set.has(l.type)).length;
  }

  function filterLeads(leads, filter) {
    const list = leads || [];
    if (!filter) return list;
    if (filter === 'group:study') {
      return list.filter((l) => ['student', 'eligibility'].includes(l.type));
    }
    if (filter === 'group:consult') {
      return list.filter((l) => ['contact', 'booking', 'lead'].includes(l.type));
    }
    if (filter === 'group:docs') {
      return list.filter((l) => ['attestation', 'checklist'].includes(l.type));
    }
    if (filter === 'group:employers') {
      return list.filter((l) => ['employer', 'quotation', 'workforce'].includes(l.type));
    }
    if (filter === 'group:visa') {
      return list.filter((l) =>
        ['visa_appointment', 'saudi', 'attestation'].includes(l.type)
      );
    }
    if (filter === 'group:students') {
      return list.filter((l) => ['student', 'eligibility'].includes(l.type));
    }
    return list.filter((l) => l.type === filter);
  }

  function shellHtml() {
    return `
      <aside class="adm-side">
        <div class="brand"><span class="adm-mark">SK</span><span>Admin</span></div>
        <nav class="adm-nav">
          <a href="index.html" data-nav="leads">All leads</a>
          <a href="services.html" data-nav="services">Services</a>
          <a href="blog.html" data-nav="blog">Blog</a>
          <a href="jobs.html" data-nav="jobs">Jobs</a>
        </nav>
        <div class="adm-side-foot">
          <a href="../services.html" target="_blank" rel="noopener">Public services page ↗</a>
          <a href="../index.html" target="_blank" rel="noopener">Website ↗</a>
          <a href="#" id="logoutBtn">Log out</a>
        </div>
      </aside>
      <main class="adm-main" id="admMain"></main>
    `;
  }

  function loginHtml() {
    return `
      <div class="adm-login" id="loginGate">
        <form class="adm-login-card" id="loginForm">
          <div class="brand"><span class="adm-mark">SK</span><span>Staff access</span></div>
          <h1>Admin workspace</h1>
          <p>Manage every website service lead, blog posts, and job listings.</p>
          <div class="adm-field">
            <label class="adm-label" for="adminPass">Password</label>
            <input class="adm-input" type="password" id="adminPass" required autocomplete="current-password" />
          </div>
          <button class="adm-btn adm-btn-gold adm-btn-block" type="submit">Sign in</button>
          <div class="adm-msg" id="loginMsg"></div>
          <p style="margin-top:1rem;text-align:center"><a href="../index.html">← Back to site</a></p>
        </form>
      </div>
    `;
  }

  async function mountShell({ title, subtitle, render }) {
    document.body.innerHTML =
      loginHtml() + `<div class="adm-shell hidden" id="adminApp">${shellHtml()}</div>`;

    document.querySelectorAll('[data-nav]').forEach((a) => {
      if (a.dataset.nav === PAGE) a.classList.add('active');
    });

    async function showApp() {
      document.getElementById('loginGate')?.classList.add('hidden');
      document.getElementById('adminApp')?.classList.remove('hidden');
      const main = document.getElementById('admMain');
      main.innerHTML = `
        <div class="adm-top">
          <div>
            <h1>${esc(title)}</h1>
            <p>${esc(subtitle || '')}</p>
          </div>
          <div class="adm-actions" id="admTopActions"></div>
        </div>
        <div id="admContent"></div>
      `;
      await render({
        content: document.getElementById('admContent'),
        actions: document.getElementById('admTopActions'),
        esc,
        statusBadge,
        whatsappLink,
        typeLabel,
        SERVICES,
        countByTypes,
        filterLeads,
      });
    }

    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('loginMsg');
      msg.className = 'adm-msg';
      msg.textContent = 'Signing in…';
      const result = await SalarAPI.loginAdmin(document.getElementById('adminPass').value);
      if (result && result.ok) {
        await showApp();
        return;
      }
      msg.className = 'adm-msg err';
      msg.textContent =
        result?.error === 'too_many_attempts'
          ? 'Too many attempts. Try again later.'
          : 'Incorrect password.';
    });

    document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
      e.preventDefault();
      await SalarAPI.logoutAdmin();
      location.reload();
    });

    if (await SalarAPI.isAdminLoggedIn()) await showApp();
  }

  window.AdminShell = {
    mountShell,
    esc,
    statusBadge,
    whatsappLink,
    typeLabel,
    SERVICES,
    countByTypes,
    filterLeads,
  };
})();
