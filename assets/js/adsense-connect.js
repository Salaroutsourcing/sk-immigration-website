/**
 * Phase 9 — AdSense site connection (no visible ads).
 * Activates only when SALAR_CONFIG.adsense.publisherId is set (ca-pub-…).
 * Phase 10 turns on autoAds / units after Google approval.
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

  /* Optional: AdSense head connect script (still no Auto ads / units). */
  if (ads.loadConnectScript && !document.querySelector('script[data-sk-adsense-connect]')) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(pub);
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-sk-adsense-connect', '1');
    document.head.appendChild(s);
  }

  /* Phase 10 only — never enable until approved. */
  if (ads.autoAds === true) {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({ google_ad_client: pub, enable_page_level_ads: true });
  }
})();
