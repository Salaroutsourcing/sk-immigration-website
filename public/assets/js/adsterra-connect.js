/**
 * Adsterra loader — blogs, guides, and news only.
 *
 * Kept: Social Bar, Native Banner, 300x250, 728x90, 320x50
 * Skipped: 468x60, 160x600, 160x300 (obsolete or crowd the consult rail)
 *
 * Caps per page: 1 social bar, 1 native, 1 leaderboard, ≤2× 300x250
 */
(function () {
  'use strict';

  var CFG = {
    socialBar:
      'https://pl31086248.profitableratecpmnetwork.com/3f/73/43/3f73439fbb844ab44c84fadd6864bb9b.js',
    native: {
      key: '848fbe3f200288b029c7ffe3543cc1e3',
      src: 'https://pl31086298.profitableratecpmnetwork.com/848fbe3f200288b029c7ffe3543cc1e3/invoke.js',
      containerId: 'container-848fbe3f200288b029c7ffe3543cc1e3',
    },
    banners: {
      '300x250': {
        key: '62c64f4856d8516fc7a07be41075bdde',
        width: 300,
        height: 250,
        invoke: 'https://www.highrevenueformat.com/62c64f4856d8516fc7a07be41075bdde/invoke.js',
      },
      '728x90': {
        key: '0258ccdf7bd202ade60d0337cdf548f6',
        width: 728,
        height: 90,
        invoke: 'https://www.highrevenueformat.com/0258ccdf7bd202ade60d0337cdf548f6/invoke.js',
      },
      '320x50': {
        key: 'f8391902dbc87b54ed1cc4841abcaf94',
        width: 320,
        height: 50,
        invoke: 'https://www.highrevenueformat.com/f8391902dbc87b54ed1cc4841abcaf94/invoke.js',
      },
    },
  };

  function pathAllowed(pathname) {
    var path = String(pathname || '/').split('?')[0];
    if (path === '/blog' || path === '/blog/' || path === '/blog.html') return true;
    if (path.indexOf('/blog/') === 0) return true;
    if (path.indexOf('/guides/') === 0) return true;
    if (path.indexOf('/news/') === 0) return true;
    /* Dynamic article shell */
    if (path === '/blog-post.html' || path.indexOf('/blog-post') === 0) return true;
    return false;
  }

  if (!pathAllowed(location.pathname)) return;
  if (document.documentElement.getAttribute('data-sk-adsterra') === 'off') return;

  var queue = Promise.resolve();
  var counts = { native: 0, leaderboard: 0, box: 0, social: 0 };

  function loadScript(src, attrs, opts) {
    opts = opts || {};
    return new Promise(function (resolve, reject) {
      if (!opts.force) {
        var existing = document.querySelector('script[src="' + src + '"]');
        if (existing) {
          resolve();
          return;
        }
      }
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      if (attrs) {
        Object.keys(attrs).forEach(function (k) {
          s.setAttribute(k, attrs[k]);
        });
      }
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        reject(new Error('adsterra script failed'));
      };
      (opts.parent || document.body).appendChild(s);
    });
  }

  function injectBanner(el, size) {
    var unit = CFG.banners[size];
    if (!unit || !el || el.getAttribute('data-ad-loaded') === '1') return queue;
    el.setAttribute('data-ad-loaded', '1');
    el.setAttribute('data-adsterra-size', size);
    queue = queue
      .then(function () {
        window.atOptions = {
          key: unit.key,
          format: 'iframe',
          height: unit.height,
          width: unit.width,
          params: {},
        };
        /* Cache-bust so each banner zone can invoke independently */
        var src = unit.invoke + (unit.invoke.indexOf('?') >= 0 ? '&' : '?') + 'sk=' + Date.now() + counts.box;
        return loadScript(src, null, { force: true, parent: el });
      })
      .catch(function () {});
    return queue;
  }

  function injectNative(el) {
    if (!el || counts.native >= 1 || el.getAttribute('data-ad-loaded') === '1') return false;
    counts.native += 1;
    el.setAttribute('data-ad-loaded', '1');
    if (!document.getElementById(CFG.native.containerId)) {
      var box = document.createElement('div');
      box.id = CFG.native.containerId;
      el.appendChild(box);
    }
    loadScript(CFG.native.src, { 'data-cfasync': 'false' }, { parent: el }).catch(function () {});
    return true;
  }

  function leaderboardSize() {
    return window.matchMedia && window.matchMedia('(min-width: 768px)').matches
      ? '728x90'
      : '320x50';
  }

  function mapLegacySlot(slot) {
    if (slot.classList.contains('sk-ad-sidebar')) return '300x250';
    if (slot.classList.contains('sk-ad-leaderboard') || slot.classList.contains('sk-ad-footer')) {
      return 'leaderboard';
    }
    if (slot.classList.contains('sk-ad-infeed')) return 'native';
    return '300x250';
  }

  function hideExtra(slot) {
    slot.setAttribute('data-ad-loaded', '1');
    slot.setAttribute('data-adsterra-skipped', '1');
    var shell = slot.closest('.sk-ad-container') || slot;
    shell.style.display = 'none';
  }

  function stripAdsense(slot) {
    var ins = slot.querySelector('ins.adsbygoogle');
    if (ins) ins.remove();
  }

  function placeUnit(el, mapped) {
    if (!el || el.getAttribute('data-ad-loaded') === '1') return;
    stripAdsense(el);

    if (mapped === 'native') {
      if (counts.native >= 1) {
        if (counts.box >= 2) {
          hideExtra(el);
          return;
        }
        counts.box += 1;
        injectBanner(el, '300x250');
        return;
      }
      injectNative(el);
      return;
    }

    if (mapped === 'leaderboard') {
      if (counts.leaderboard >= 1) {
        hideExtra(el);
        return;
      }
      counts.leaderboard += 1;
      injectBanner(el, leaderboardSize());
      return;
    }

    if (counts.box >= 2) {
      hideExtra(el);
      return;
    }
    counts.box += 1;
    injectBanner(el, '300x250');
  }

  function fillExplicit() {
    document.querySelectorAll('[data-adsterra-unit]:not([data-ad-loaded])').forEach(function (el) {
      var unit = el.getAttribute('data-adsterra-unit');
      if (unit === 'native') placeUnit(el, 'native');
      else if (unit === 'leaderboard') placeUnit(el, 'leaderboard');
      else placeUnit(el, '300x250');
    });
  }

  function fillLegacyShells() {
    document.querySelectorAll('.sk-ad-slot:not([data-ad-loaded])').forEach(function (slot) {
      if (slot.getAttribute('data-adsterra-unit')) return;
      placeUnit(slot, mapLegacySlot(slot));
    });
  }

  function loadSocialBar() {
    if (counts.social >= 1) return;
    if (document.querySelector('script[data-sk-adsterra="social-bar"]')) {
      counts.social = 1;
      return;
    }
    counts.social = 1;
    var s = document.createElement('script');
    s.src = CFG.socialBar;
    s.async = true;
    s.setAttribute('data-sk-adsterra', 'social-bar');
    document.body.appendChild(s);
  }

  function run() {
    fillExplicit();
    fillLegacyShells();
    loadSocialBar();
  }

  window.__SK_ADSTERRA_REFRESH__ = function () {
    fillExplicit();
    fillLegacyShells();
    loadSocialBar();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
