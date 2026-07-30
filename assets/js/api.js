/**
 * API layer — talks to the Worker API at /api/*.
 *
 * Submissions that fail because of a flaky connection are queued in
 * localStorage and retried on the next page load. A submission the server
 * actively rejects throws, so the calling form can show a real error instead
 * of a false "Saved!".
 */
(function () {
  const ENDPOINTS = {
    lead: '/api/lead',
    login: '/api/admin/login',
    logout: '/api/admin/logout',
    session: '/api/admin/session',
    leads: '/api/admin/leads',
  };

  const STORAGE = {
    queue: 'salar_pending_leads',
    blog: 'salar_blog_posts',
    jobs: 'salar_jobs',
    adminSession: 'sk_admin_session_v2',
  };

  /* Password: salaar@98 — used when /api/* is unavailable (static Pages hosting). */
  const LOCAL_ADMIN_PASSWORD_HASH =
    '5475cdfaa84f8594db8ad0db6015e9242a557d7eb1f127b33d8355441eaf069a';
  const LOCAL_SESSION_TTL_MS = 12 * 60 * 60 * 1000;

  const MAX_QUEUE = 50;

  async function sha256Hex(value) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function readLocalSession() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE.adminSession) || 'null');
      if (!raw || !raw.exp || Number(raw.exp) < Date.now()) {
        localStorage.removeItem(STORAGE.adminSession);
        return null;
      }
      return raw;
    } catch {
      return null;
    }
  }

  function writeLocalSession() {
    localStorage.setItem(
      STORAGE.adminSession,
      JSON.stringify({ exp: Date.now() + LOCAL_SESSION_TTL_MS, mode: 'local' })
    );
  }

  function clearLocalSession() {
    localStorage.removeItem(STORAGE.adminSession);
  }

  function readQueue() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE.queue) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeQueue(items) {
    try {
      localStorage.setItem(STORAGE.queue, JSON.stringify(items.slice(0, MAX_QUEUE)));
    } catch {
      /* storage full or blocked — nothing useful we can do here */
    }
  }

  function enqueue(payload) {
    const queue = readQueue();
    queue.push({ ...payload, queuedAt: new Date().toISOString() });
    writeQueue(queue);
  }

  async function postLead(payload) {
    const res = await fetch(ENDPOINTS.lead, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let body = null;
    try {
      body = await res.json();
    } catch {
      /* non-JSON response handled below */
    }

    if (res.ok && body && body.ok) return body;

    const error = new Error((body && body.error) || `http_${res.status}`);
    error.status = res.status;
    error.permanent = res.status >= 400 && res.status < 500 && res.status !== 429;
    throw error;
  }

  /**
   * Send a lead. Resolves when the server accepted it, or when it was safely
   * queued for retry. Rejects only when the server permanently refused it.
   */
  async function submit(type, data) {
    const payload = { type, data };
    try {
      return await postLead(payload);
    } catch (err) {
      if (err.permanent) throw err;
      enqueue(payload);
      return { ok: true, queued: true };
    }
  }

  async function flushQueue() {
    const queue = readQueue();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await postLead({ type: item.type, data: item.data });
      } catch (err) {
        if (!err.permanent) remaining.push(item);
      }
    }
    writeQueue(remaining);
  }

  async function adminFetch(url, options = {}) {
    try {
      const res = await fetch(url, { credentials: 'same-origin', ...options });
      let body = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }
      /* Static hosts often return HTML 404 for /api/* — treat as unavailable */
      if (res.status === 404 || res.status === 405) {
        return { ok: false, error: 'api_unavailable', status: res.status };
      }
      if (body && typeof body === 'object') {
        return { ...body, status: res.status };
      }
      if (res.status === 401) return { ok: false, error: 'unauthorized', status: 401 };
      return { ok: false, error: 'bad_response', status: res.status };
    } catch {
      return { ok: false, error: 'api_unavailable', status: 0 };
    }
  }

  function leadsFromQueue() {
    return readQueue().map((item, index) => {
      const data = item.data || {};
      return {
        id: `local-${index}-${item.queuedAt || index}`,
        createdAt: item.queuedAt || new Date().toISOString(),
        type: item.type || 'lead',
        name: data.name || data.fullName || '',
        email: data.email || '',
        phone: data.phone || data.whatsapp || '',
        meta: data.meta || data.companyName || data.service || data.target || '',
        status: 'queued-local',
        data,
      };
    });
  }

  window.SalarAPI = {
    /* —— Public submissions —— */

    saveLead(type, data) {
      return submit(type, data);
    },

    saveBooking(data) {
      return submit('contact', data);
    },

    saveEligibilityLead(data) {
      return submit('eligibility', data);
    },

    saveCVLead(data) {
      return submit('cv', data);
    },

    saveJobApplication(data) {
      return submit('job_application', data);
    },

    saveContact(data) {
      return submit('contact', data);
    },

    saveStudentLead(data) {
      return submit('student', data);
    },

    saveVisaAppointment(data) {
      return submit('visa_appointment', data);
    },

    saveSaudiLead(data) {
      return submit('saudi', data);
    },

    saveEmployerRequest(data) {
      return submit('employer', data);
    },

    saveQuotationRequest(data) {
      return submit('quotation', data);
    },

    saveWorkforceRequest(data) {
      return submit('workforce', data);
    },

    flushQueue,

    pendingCount() {
      return readQueue().length;
    },

    /* —— Admin —— */

    async loginAdmin(password) {
      const body = await adminFetch(ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (body && body.ok) {
        clearLocalSession();
        return { ok: true, mode: 'api' };
      }

      if (body && (body.error === 'invalid_credentials' || body.status === 401)) {
        return { ok: false, error: 'invalid_credentials', status: 401 };
      }

      /* API missing (static Cloudflare Pages) — verify password locally */
      const got = await sha256Hex(String(password || ''));
      if (got === LOCAL_ADMIN_PASSWORD_HASH) {
        writeLocalSession();
        return { ok: true, mode: 'local' };
      }
      return { ok: false, error: 'invalid_credentials', status: 401 };
    },

    async logoutAdmin() {
      clearLocalSession();
      await adminFetch(ENDPOINTS.logout, { method: 'POST' });
    },

    async isAdminLoggedIn() {
      const body = await adminFetch(ENDPOINTS.session);
      if (body && body.authenticated) return true;
      return Boolean(readLocalSession());
    },

    /** Returns every lead grouped the way the admin dashboard displays them. */
    async fetchLeads({ type = '', limit = 500 } = {}) {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      params.set('limit', String(limit));

      const body = await adminFetch(`${ENDPOINTS.leads}?${params.toString()}`);
      if (body && body.ok) {
        const leads = body.leads || [];
        return {
          ok: true,
          mode: 'api',
          leads,
          cvs: leads.filter((l) => l.type === 'cv'),
          applications: leads.filter((l) => l.type === 'job_application'),
          bookings: leads.filter((l) => l.type === 'contact' || l.type === 'booking'),
          students: leads.filter((l) => l.type === 'student' || l.type === 'eligibility'),
          visaLeads: leads.filter((l) =>
            ['visa_appointment', 'saudi', 'attestation'].includes(l.type)
          ),
          employers: leads.filter((l) =>
            ['employer', 'quotation', 'workforce'].includes(l.type)
          ),
        };
      }

      /* Fallback: show locally queued form submissions while API/D1 is offline */
      if (!readLocalSession() && !(body && body.status === 401)) {
        /* still allow viewing queue after local login */
      }
      const leads = leadsFromQueue();
      return {
        ok: true,
        mode: 'local',
        warning:
          'Live API is offline on this host. Showing locally queued form submissions only. Blog/Jobs admin still work.',
        leads,
        cvs: leads.filter((l) => l.type === 'cv'),
        applications: leads.filter((l) => l.type === 'job_application'),
        bookings: leads.filter((l) => l.type === 'contact' || l.type === 'booking'),
        students: leads.filter((l) => l.type === 'student' || l.type === 'eligibility'),
        visaLeads: leads.filter((l) =>
          ['visa_appointment', 'saudi', 'attestation'].includes(l.type)
        ),
        employers: leads.filter((l) =>
          ['employer', 'quotation', 'workforce'].includes(l.type)
        ),
      };
    },

    /* —— Local-only content editing (blog & jobs admin) —— */

    getJobs() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE.jobs) || 'null');
      } catch {
        return null;
      }
    },
    saveJobs(jobs) {
      localStorage.setItem(STORAGE.jobs, JSON.stringify(jobs));
    },
    getBlogPosts() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE.blog) || 'null');
      } catch {
        return null;
      }
    },
    saveBlogPosts(posts) {
      localStorage.setItem(STORAGE.blog, JSON.stringify(posts));
    },

    exportJSON(filename, data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    },

    /**
     * Deprecated. Blog and job posts are still edited in localStorage only;
     * kept so those admin screens keep working until they move to the API.
     */
    syncRemote: {
      postToGas: async () => null,
      getFromGas: async () => null,
    },
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      flushQueue();
    });
    window.addEventListener('online', () => {
      flushQueue();
    });
  }
})();
