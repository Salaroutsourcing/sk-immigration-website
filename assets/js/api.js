/**
 * API layer — Worker /api/* for leads, admin CRM, and blog/jobs CMS.
 */
(function () {
  const ENDPOINTS = {
    lead: '/api/lead',
    login: '/api/admin/login',
    logout: '/api/admin/logout',
    session: '/api/admin/session',
    leads: '/api/admin/leads',
    blog: '/api/blog',
    jobs: '/api/jobs',
    adminBlog: '/api/admin/blog',
    adminJobs: '/api/admin/jobs',
  };

  const STORAGE = { queue: 'salar_pending_leads' };
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
      /* ignore */
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
      error.retryable = true;
      throw error;
    }

    let body = null;
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }

    if (res.ok && body && body.ok) return body;

    const error = new Error((body && body.error) || `http_${res.status}`);
    error.status = res.status;
    error.retryable = res.status === 0 || res.status === 429;
    throw error;
  }

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

  async function apiFetch(url, options = {}) {
    try {
      const res = await fetch(url, { credentials: 'same-origin', ...options });
      let body = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }
      if (res.status === 404 || res.status === 405) {
        return { ok: false, error: 'api_unavailable', status: res.status };
      }
      if (body && typeof body === 'object') return { ...body, status: res.status };
      if (res.status === 401) return { ok: false, error: 'unauthorized', status: 401 };
      return { ok: false, error: 'bad_response', status: res.status };
    } catch {
      return { ok: false, error: 'api_unavailable', status: 0 };
    }
  }

  window.SalarAPI = {
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

    async loginAdmin(password) {
      const body = await apiFetch(ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (body && body.ok) return { ok: true, mode: 'api' };
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
      await apiFetch(ENDPOINTS.logout, { method: 'POST' });
    },

    async isAdminLoggedIn() {
      const body = await apiFetch(ENDPOINTS.session);
      return Boolean(body && body.authenticated);
    },

    async fetchLeads({ type = '', status = '', limit = 500 } = {}) {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (status) params.set('status', status);
      params.set('limit', String(limit));

      const body = await apiFetch(`${ENDPOINTS.leads}?${params.toString()}`);
      if (body && body.ok) {
        const leads = body.leads || [];
        return {
          ok: true,
          mode: 'api',
          leads,
          counts: body.counts || {},
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
      };
    },

    async fetchLead(id) {
      return apiFetch(`${ENDPOINTS.leads}/${encodeURIComponent(id)}`);
    },

    async updateLeadStatus(id, status) {
      return apiFetch(`${ENDPOINTS.leads}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    },

    async addLeadNote(id, noteBody) {
      return apiFetch(`${ENDPOINTS.leads}/${encodeURIComponent(id)}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: noteBody }),
      });
    },

    /* —— Public CMS —— */
    async listBlogPosts() {
      const body = await apiFetch(ENDPOINTS.blog);
      if (body && body.ok && Array.isArray(body.posts) && body.posts.length) {
        return body.posts;
      }
      return null;
    },

    async getBlogPost(slug) {
      const body = await apiFetch(`${ENDPOINTS.blog}/${encodeURIComponent(slug)}`);
      if (body && body.ok && body.post) return body.post;
      return null;
    },

    async listJobsPublic() {
      const body = await apiFetch(ENDPOINTS.jobs);
      if (body && body.ok && Array.isArray(body.jobs) && body.jobs.length) {
        return body.jobs;
      }
      return null;
    },

    /* —— Admin CMS —— */
    async adminListBlog() {
      return apiFetch(ENDPOINTS.adminBlog);
    },

    async adminSaveBlog(post) {
      const id = post.id;
      const url = id
        ? `${ENDPOINTS.adminBlog}/${encodeURIComponent(id)}`
        : ENDPOINTS.adminBlog;
      return apiFetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
    },

    async adminDeleteBlog(id) {
      return apiFetch(`${ENDPOINTS.adminBlog}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    },

    async adminListJobs() {
      return apiFetch(ENDPOINTS.adminJobs);
    },

    async adminSaveJob(job) {
      const id = job.id;
      const url = id
        ? `${ENDPOINTS.adminJobs}/${encodeURIComponent(id)}`
        : ENDPOINTS.adminJobs;
      return apiFetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
    },

    async adminDeleteJob(id) {
      return apiFetch(`${ENDPOINTS.adminJobs}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    },

    exportJSON(filename, data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    },

    /* Deprecated localStorage helpers — kept as no-ops for old scripts */
    getJobs() {
      return null;
    },
    saveJobs() {},
    getBlogPosts() {
      return null;
    },
    saveBlogPosts() {},
    syncRemote: {
      postToGas: async () => null,
      getFromGas: async () => null,
    },
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => flushQueue());
    window.addEventListener('online', () => flushQueue());
  }
})();
