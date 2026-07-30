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
    let res;
    try {
      res = await fetch(ENDPOINTS.lead, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      const error = new Error('network_error');
      error.status = 0;
      error.permanent = false;
      error.retryable = true;
      throw error;
    }

    let body = null;
    try {
      body = await res.json();
    } catch {
      /* non-JSON response handled below */
    }

    if (res.ok && body && body.ok) return body;

    const error = new Error((body && body.error) || `http_${res.status}`);
    error.status = res.status;
    /* Only brief network blips are queued. Missing API / 4xx / 5xx must surface to the user. */
    error.retryable = res.status === 0 || res.status === 429;
    error.permanent = !error.retryable;
    throw error;
  }

  /**
   * Send a lead. Resolves only when the server accepted it.
   * Network/rate-limit failures are queued for retry and still reject so the UI
   * does not show a false "Saved!".
   */
  async function submit(type, data) {
    const payload = { type, data };
    try {
      return await postLead(payload);
    } catch (err) {
      if (err.retryable) enqueue(payload);
      throw err;
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
        if (err.retryable) remaining.push(item);
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
        return { ok: true, mode: 'api' };
      }

      if (body && (body.error === 'invalid_credentials' || body.status === 401)) {
        return { ok: false, error: 'invalid_credentials', status: 401 };
      }

      return {
        ok: false,
        error: (body && body.error) || 'api_unavailable',
        status: (body && body.status) || 0,
      };
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

      if (body && body.status === 401) {
        return { ok: false, error: 'unauthorized', status: 401 };
      }

      return {
        ok: false,
        error: (body && body.error) || 'api_unavailable',
        status: (body && body.status) || 0,
        warning:
          'Live lead API is offline. Fix Worker/D1 deployment, then reload. Locally queued submissions are not shown in admin anymore.',
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
