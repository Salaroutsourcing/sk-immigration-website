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
  };

  const MAX_QUEUE = 50;

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
    const res = await fetch(url, { credentials: 'same-origin', ...options });
    if (res.status === 401) return { ok: false, error: 'unauthorized', status: 401 };
    try {
      return await res.json();
    } catch {
      return { ok: false, error: 'bad_response' };
    }
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
      return Boolean(body && body.ok);
    },

    async logoutAdmin() {
      await adminFetch(ENDPOINTS.logout, { method: 'POST' });
    },

    async isAdminLoggedIn() {
      const body = await adminFetch(ENDPOINTS.session);
      return Boolean(body && body.authenticated);
    },

    /** Returns every lead grouped the way the admin dashboard displays them. */
    async fetchLeads({ type = '', limit = 500 } = {}) {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      params.set('limit', String(limit));

      const body = await adminFetch(`${ENDPOINTS.leads}?${params.toString()}`);
      if (!body || !body.ok) {
        return { ok: false, error: (body && body.error) || 'unknown', leads: [] };
      }

      const leads = body.leads || [];
      return {
        ok: true,
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
