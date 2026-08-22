/**
 * AdSense on immigration.salaroutsourcing.com
 * Publisher: ca-pub-5113459275916426
 * AdSense Sites list uses the root domain (salaroutsourcing.com); this subdomain
 * loads the same client so ads can serve here once the root site is Ready.
 */
(function () {
  const ads = (window.SALAR_CONFIG && window.SALAR_CONFIG.adsense) || {};
  const raw = String(ads.publisherId || '').trim();
  if (!raw) return;

  const pub = raw.startsWith('ca-pub-') ? raw : raw.startsWith('pub-') ? 'ca-' + raw : '';
  if (!/^ca-pub-\d{10,20}$/.test(pub)) {
    console.warn('[adsense-connect] Invalid publisherId; expected ca-pub-…');
    return;
  }

  if (ads.connectMeta !== false) {
    if (!document.querySelector('meta[name="google-adsense-account"]')) {
      const meta = document.createElement('meta');
      meta.name = 'google-adsense-account';
      meta.content = pub;
      document.head.appendChild(meta);
    }
  }

  const hasClientScript = !!document.querySelector(
    'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
  );

  if (ads.loadConnectScript !== false && !hasClientScript) {
    const s = document.createElement('script');
    s.async = true;
    s.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
      encodeURIComponent(pub);
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-sk-adsense-connect', '1');
    document.head.appendChild(s);
  }

  /* Auto ads — only when explicitly enabled (after AdSense approval) */
  if (ads.autoAds !== true) return;

  /* Auto ads / page-level — served when AdSense root domain is Ready */
  if (!window.__SK_ADSENSE_AUTO__) {
    window.__SK_ADSENSE_AUTO__ = true;
    window.adsbygoogle = window.adsbygoogle || [];
    try {
      window.adsbygoogle.push({
        google_ad_client: pub,
        enable_page_level_ads: true,
      });
    } catch (_) {
      /* ignore if script not ready yet */
    }
  }

  /* Initialize manual ad slots when in viewport */
  function initManualAds() {
    const slots = document.querySelectorAll('.sk-ad-slot:not([data-ad-loaded])');
    if (!slots.length) return;

    const pushAd = (slot) => {
      if (slot.dataset.adLoaded === '1') return;
      slot.dataset.adLoaded = '1';
      
      const ins = slot.querySelector('ins.adsbygoogle');
      if (ins && !ins.getAttribute('data-ad-status')) {
        window.adsbygoogle = window.adsbygoogle || [];
        try {
          (window.adsbygoogle).push({});
        } catch (e) {
          console.debug('[adsense] Slot push skipped:', e);
        }
      }
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pushAd(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px 0px' });

      slots.forEach((s) => observer.observe(s));
    } else {
      slots.forEach((s) => pushAd(s));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initManualAds);
  } else {
    initManualAds();
  }
})();

