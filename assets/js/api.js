/**
 * API layer — Apps Script backend + localStorage fallback
 * Fast static site; GAS only used as thin write/read endpoint.
 */
(function () {
  const STORAGE = {
    leads: 'salar_leads',
    cvs: 'salar_cvs',
    applications: 'salar_applications',
    bookings: 'salar_bookings',
    blog: 'salar_blog_posts',
    jobs: 'salar_jobs',
    session: 'salar_admin_session',
  };

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async function postToGas(action, payload) {
    const url = window.SALAR_CONFIG?.appsScriptUrl;
    if (!url) return null;
    try {
      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...payload, source: 'website', ts: new Date().toISOString() }),
      });
      return await res.json();
    } catch (err) {
      console.warn('Apps Script unreachable, using local storage.', err);
      return null;
    }
  }

  async function getFromGas(action, params = {}) {
    const url = window.SALAR_CONFIG?.appsScriptUrl;
    if (!url) return null;
    try {
      const q = new URLSearchParams({ action, ...params });
      const res = await fetch(url + '?' + q.toString(), { method: 'GET', mode: 'cors' });
      return await res.json();
    } catch (err) {
      console.warn('Apps Script GET failed.', err);
      return null;
    }
  }

  function pushLocal(key, item) {
    const list = read(key, []);
    list.unshift(item);
    write(key, list);
    return item;
  }

  window.SalarAPI = {
    STORAGE,

    async saveLead(type, data) {
      const item = { id: uid(type), type, ...data, createdAt: new Date().toISOString(), status: 'new' };
      pushLocal(STORAGE.leads, item);
      await postToGas('saveLead', { type, data: item });
      return item;
    },

    async saveBooking(data) {
      const item = { id: uid('book'), ...data, createdAt: new Date().toISOString(), status: 'pending' };
      pushLocal(STORAGE.bookings, item);
      await postToGas('publicBookingRequest', { data: item });
      return item;
    },

    async saveEligibilityLead(data) {
      const item = { id: uid('elig'), ...data, createdAt: new Date().toISOString() };
      pushLocal(STORAGE.leads, { ...item, type: 'eligibility' });
      await postToGas('saveEligibilityLead', { data: item });
      return item;
    },

    async saveCVLead(data) {
      const item = { id: uid('cv'), ...data, createdAt: new Date().toISOString() };
      pushLocal(STORAGE.cvs, item);
      pushLocal(STORAGE.leads, { id: item.id, type: 'cv', name: data.fullName, email: data.email, phone: data.phone, createdAt: item.createdAt });
      await postToGas('saveCVLead', { data: item });
      return item;
    },

    async saveJobApplication(data) {
      const item = { id: uid('app'), ...data, createdAt: new Date().toISOString(), status: 'received' };
      pushLocal(STORAGE.applications, item);
      pushLocal(STORAGE.leads, {
        id: item.id,
        type: 'job_application',
        name: data.name,
        email: data.email,
        phone: data.phone,
        meta: data.jobTitle,
        createdAt: item.createdAt,
      });
      await postToGas('saveJobApplication', { data: item });
      return item;
    },

    async saveContact(data) {
      return this.saveLead('contact', data);
    },

    /* —— Admin local —— */
    getLeads() {
      return read(STORAGE.leads, []);
    },
    getCVs() {
      return read(STORAGE.cvs, []);
    },
    getApplications() {
      return read(STORAGE.applications, []);
    },
    getBookings() {
      return read(STORAGE.bookings, []);
    },

    getJobs() {
      const custom = read(STORAGE.jobs, null);
      return custom;
    },
    saveJobs(jobs) {
      write(STORAGE.jobs, jobs);
    },

    getBlogPosts() {
      return read(STORAGE.blog, null);
    },
    saveBlogPosts(posts) {
      write(STORAGE.blog, posts);
    },

    /* Simple session gate (client-side). Production: also verify on GAS. */
    async hash(str) {
      const enc = new TextEncoder().encode(str);
      const buf = await crypto.subtle.digest('SHA-256', enc);
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
    },

    async loginAdmin(password) {
      const expected = await this.hash('Salaar@98');
      const got = await this.hash(password);
      if (got !== expected) return false;
      const token = uid('sess');
      write(STORAGE.session, { token, at: Date.now() });
      return true;
    },

    isAdminLoggedIn() {
      const s = read(STORAGE.session, null);
      if (!s?.token) return false;
      /* 12 hour session */
      return Date.now() - s.at < 12 * 60 * 60 * 1000;
    },

    logoutAdmin() {
      localStorage.removeItem(STORAGE.session);
    },

    exportJSON(filename, data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
    },

    syncRemote: { postToGas, getFromGas },
  };
})();
