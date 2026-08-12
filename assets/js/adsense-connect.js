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

  /* Auto ads / page-level — served when AdSense root domain is Ready */
  if (ads.autoAds === true && !window.__SK_ADSENSE_AUTO__) {
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
})();
