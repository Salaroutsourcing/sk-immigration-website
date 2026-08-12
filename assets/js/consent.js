/**
 * Cookie / advertising consent (Google Consent Mode v2 compatible)
 * Essential prefs (theme, language) never require this banner.
 * Analytics + advertising storage stay denied until the visitor opts in.
 */
(function () {
  const STORAGE_KEY = 'sk_consent_v1';
  const GA_ID = 'G-D0559366D6';

  function basePrefix() {
    const parts = location.pathname.split('/').filter(Boolean);
    const nestedRoots = [
      'blog', 'answers', 'admin', 'study-visa', 'visa-appointment', 'saudi-visa',
      'document-services', 'hire-workers-from-pakistan', 'work-permit', 'visit-visa',
      'local', 'guides', 'official-links', 'ur',
    ];
    if (parts[0] === 'ur' && parts.length >= 3) return '../../../';
    if (parts[0] === 'ur' && parts.length >= 2) return '../../';
    if (parts[0] === 'ur') return '../';
    if (parts.length >= 2 && nestedRoots.includes(parts[0])) return '../../';
    if (parts.length >= 1 && nestedRoots.includes(parts[0])) return '../';
    return '';
  }

  const BASE = basePrefix();

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }
  }

  function applyConsent(state) {
    ensureGtag();
    const granted = !!(state && state.analytics);
    const ads = !!(state && state.advertising);
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: ads ? 'granted' : 'denied',
      ad_user_data: ads ? 'granted' : 'denied',
      ad_personalization: ads ? 'granted' : 'denied',
    });
    if (granted) {
      try {
        window.gtag('event', 'consent_update', { consent_analytics: true, consent_ads: ads });
      } catch (_) { /* ignore */ }
    }
    window.SK_CONSENT = state || { analytics: false, advertising: false };
    document.documentElement.dataset.consentAnalytics = granted ? '1' : '0';
    document.documentElement.dataset.consentAds = ads ? '1' : '0';
  }

  function readStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) return null;
      return {
        analytics: !!parsed.analytics,
        advertising: !!parsed.advertising,
        ts: parsed.ts || Date.now(),
      };
    } catch (_) {
      return null;
    }
  }

  function save(state) {
    const payload = {
      analytics: !!state.analytics,
      advertising: !!state.advertising,
      ts: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) { /* private mode */ }
    applyConsent(payload);
    hideBanner();
    return payload;
  }

  function hideBanner() {
    document.getElementById('sk-consent-banner')?.remove();
  }

  function showBanner() {
    if (document.getElementById('sk-consent-banner')) return;
    const el = document.createElement('div');
    el.id = 'sk-consent-banner';
    el.className = 'sk-consent-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'false');
    el.setAttribute('aria-labelledby', 'sk-consent-title');
    el.innerHTML = `
      <div class="sk-consent-inner">
        <div class="sk-consent-copy">
          <p id="sk-consent-title" class="sk-consent-title">Cookies &amp; ads preferences</p>
          <p class="sk-consent-text">
            We use essential cookies for site functions. With your permission we also use
            <strong>Google Analytics</strong> and may use <strong>Google AdSense</strong>
            (including advertising cookies) to measure traffic and show ads.
            See our
            <a href="${BASE}privacy.html">Privacy Policy</a> and
            <a href="${BASE}cookies.html">Cookie Policy</a>.
            You can change this anytime.
          </p>
        </div>
        <div class="sk-consent-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-consent="reject">Essential only</button>
          <button type="button" class="btn btn-ghost btn-sm" data-consent="analytics">Analytics only</button>
          <button type="button" class="btn btn-gold btn-sm" data-consent="accept">Accept all</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    el.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-consent]');
      if (!btn) return;
      const mode = btn.getAttribute('data-consent');
      if (mode === 'reject') save({ analytics: false, advertising: false });
      else if (mode === 'analytics') save({ analytics: true, advertising: false });
      else save({ analytics: true, advertising: true });
    });
  }

  function openPreferences() {
    showBanner();
  }

  // Defaults already set in <head>; re-assert denied until stored choice applied.
  ensureGtag();
  const stored = readStored();
  if (stored) {
    applyConsent(stored);
  } else {
    applyConsent({ analytics: false, advertising: false });
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  window.SKConsent = {
    open: openPreferences,
    get: () => readStored() || { analytics: false, advertising: false },
    set: save,
    gaId: GA_ID,
  };
})();
