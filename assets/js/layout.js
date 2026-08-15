/**
 * Shared layout — SK Immigration Services
 * Neon template chrome (header, menu, FAB, bottom nav, footer)
 */
(function () {
  const C = () => window.SALAR_CONFIG || {};

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
    if (location.pathname.includes('/admin')) return '../';
    return '';
  }

  const BASE = basePrefix();

  function ensureAssets() {
    if (!document.querySelector('link[href*="sk-theme.css"]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = BASE + 'assets/css/sk-theme.css?v=yellow1';
      document.head.appendChild(l);
    }
    if (!document.querySelector('script[src*="lucide"]')) {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/lucide@latest';
      s.onload = () => window.lucide && window.lucide.createIcons();
      document.head.appendChild(s);
    }
  }
  ensureAssets();

  const NAV = [
    { href: 'services.html', label: 'Services', id: 'services' },
    { href: 'checklist.html', label: 'Checklist', id: 'checklist' },
    { href: 'process.html', label: 'Process', id: 'process' },
    { href: 'pricing.html', label: 'Pricing', id: 'pricing' },
  ];

  const NAV_ALIAS = {
    calculator: 'tools', compare: 'tools', eligibility: 'tools',
    attestation: 'services', 'study-visa': 'services', 'work-permit': 'services',
    'visit-visa': 'services', 'visa-appointment': 'services', 'saudi-visa': 'services',
    'document-services': 'services', ausbildung: 'services', jobs: 'services',
    tracker: 'tracker', success: 'success', contact: 'contact', home: 'home',
    about: 'about', faq: '', blog: '',
  };

  function activeId() {
    const path = location.pathname;
    if (path.endsWith('/') && (path === '/' || path.endsWith('/index.html') || /\/$/.test(path) && partsLen(path) <= 1)) {
      if (!path.split('/').filter(Boolean).length) return 'home';
    }
    const file = path.split('/').pop() || '';
    if (file === '' || file === 'index.html') {
      if (!path.split('/').filter(Boolean).length) return 'home';
    }
    if (path.includes('/study-visa') || path.includes('/work-permit') || path.includes('/visit-visa') || path.includes('/saudi-visa') || path.includes('/document-services') || path.includes('services')) return 'services';
    if (path.includes('checklist')) return 'checklist';
    if (path.includes('process')) return 'process';
    if (path.includes('pricing')) return 'pricing';
    if (path.includes('contact')) return 'contact';
    if (path.includes('eligibility') || path.includes('calculator') || path.includes('compare') || path.includes('cv-builder') || path.includes('tools')) return 'tools';
    if (path.includes('tracker') || path.includes('portal')) return 'tracker';
    const page = document.body.dataset.page || '';
    if (page === 'home' && !path.split('/').filter(Boolean).length) return 'home';
    return NAV_ALIAS[page] || page;
  }

  function partsLen(path) {
    return path.split('/').filter(Boolean).length;
  }

  function href(path) {
    return BASE + path;
  }

  function icon(name) {
    return `<i data-lucide="${name}" width="20" height="20"></i>`;
  }

  function socialRow() {
    const s = C().social || {};
    const items = [
      ['Instagram', s.instagram],
      ['TikTok', s.tiktok],
      ['Facebook', s.facebook],
      ['LinkedIn', s.linkedin],
      ['YouTube', s.youtube],
    ].filter(([, u]) => u && u !== '#');
    return items.map(([label, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('');
  }

  function logoBlock(text) {
    return `
      <a href="${href('index.html')}" class="sk-logo" aria-label="SK Immigration Services home">
        <div class="sk-logo-icon">SK</div>
        <span>${text || 'SK Immigration'}</span>
      </a>`;
  }

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;
    const cur = activeId();
    const desktop = NAV.map((n) => {
      const on = cur === n.id;
      return `<a href="${href(n.href)}" class="${on ? 'active' : ''}"${on ? ' aria-current="page"' : ''}>${n.label}</a>`;
    }).join('');

    el.innerHTML = `
      <a href="#main" class="skip-link">Skip to main content</a>
      <header class="sk-header" id="header">
        <div class="sk-header-inner">
          ${logoBlock()}
          <nav class="sk-desktop-nav" aria-label="Primary">
            ${desktop}
            <a href="${href('tools.html')}">Tools</a>
            <a href="${href('contact.html')}" class="btn btn-primary" style="min-height:40px;padding:0 18px;font-size:0.85rem;">Free Consultation</a>
          </nav>
          <button class="sk-menu-btn" id="menuBtn" aria-label="Open menu">${icon('menu')}</button>
        </div>
      </header>
      <div class="sk-menu-overlay" id="menuOverlay"></div>
      <div class="sk-mobile-menu" id="mobileMenu">
        <div class="sk-mobile-menu-header">
          ${logoBlock()}
          <button class="sk-menu-btn" id="closeMenu" aria-label="Close menu">${icon('x')}</button>
        </div>
        <nav class="sk-mobile-links">
          <a href="${href('index.html')}" data-close>${icon('home')} Home</a>
          <a href="${href('services.html')}" data-close>${icon('briefcase')} Services</a>
          <a href="${href('checklist.html')}" data-close>${icon('clipboard-check')} Document Checklist</a>
          <a href="${href('process.html')}" data-close>${icon('git-branch')} How It Works</a>
          <a href="${href('about.html')}" data-close>${icon('shield-check')} Why Choose Us</a>
          <a href="${href('pricing.html')}" data-close>${icon('tag')} Pricing</a>
          <a href="${href('contact.html')}" data-close>${icon('message-circle')} Contact</a>
          <p class="sk-mobile-label">Tools</p>
          <a href="${href('tools.html')}" data-close>${icon('layout-grid')} All tools</a>
          <a href="${href('eligibility.html')}" data-close>${icon('sparkles')} Eligibility Quiz</a>
          <a href="${href('calculator.html')}" data-close>${icon('calculator')} Cost Calculator</a>
          <a href="${href('compare.html')}" data-close>${icon('git-compare')} Compare Countries</a>
          <a href="${href('tracker.html')}" data-close>${icon('radar')} Application Tracker</a>
          <a href="${href('cv-builder.html')}" data-close>${icon('file-text')} CV Builder</a>
          <p class="sk-mobile-label">Visa hubs</p>
          <a href="${href('study-visa/')}" data-close>${icon('graduation-cap')} Study Visa</a>
          <a href="${href('work-permit/')}" data-close>${icon('briefcase')} Work Permit</a>
          <a href="${href('visit-visa/')}" data-close>${icon('plane')} Visit Visa</a>
          <a href="${href('visa-appointment/')}" data-close>${icon('calendar')} Appointments</a>
          <a href="${href('saudi-visa/saudi-visa-processing-pakistan/')}" data-close>${icon('building-2')} Saudi Visa</a>
          <a href="${href('document-services/')}" data-close>${icon('stamp')} Attestation</a>
          <p class="sk-mobile-label">More</p>
          <a href="${href('success-stories.html')}" data-close>${icon('star')} Success Stories</a>
          <a href="${href('faq.html')}" data-close>${icon('help-circle')} FAQ</a>
          <a href="${href('blog.html')}" data-close>${icon('book-open')} Blog</a>
          <a href="${href('trust.html')}" data-close>${icon('badge-check')} Trust &amp; verify</a>
          <a href="${href('ur/')}" data-close>اردو</a>
        </nav>
        <div class="sk-mobile-footer">
          <a href="${href('contact.html')}" class="btn btn-primary btn-full" data-close>Free Consultation</a>
        </div>
      </div>
      <a href="${C().whatsappLink || href('contact.html')}" class="sk-fab" id="fab" aria-label="WhatsApp consultation" target="_blank" rel="noopener">
        ${icon('message-circle')}
      </a>
    `;

    const header = document.getElementById('header');
    const fab = document.getElementById('fab');
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const onScroll = () => {
      header?.classList.toggle('scrolled', window.scrollY > 40);
      fab?.classList.toggle('visible', window.scrollY > 300);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    function openMenu() {
      mobileMenu.classList.add('open');
      menuOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMenuFn() {
      mobileMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    menuBtn?.addEventListener('click', openMenu);
    closeMenu?.addEventListener('click', closeMenuFn);
    menuOverlay?.addEventListener('click', closeMenuFn);
    el.querySelectorAll('[data-close]').forEach((n) => n.addEventListener('click', closeMenuFn));
  }

  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    const year = new Date().getFullYear();
    const brand = C().brandFull || 'SK Immigration Services';
    const cur = activeId();

    el.innerHTML = `
      <footer class="sk-footer site-footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            ${logoBlock('SK Immigration Services')}
            <p>Making global opportunities accessible through clear guidance, transparent processes, and genuine care. Embassies decide visas — we never sell guarantees.</p>
            <div class="footer-col" style="margin-top:1rem">
              <h4>Follow us</h4>
              ${socialRow()}
            </div>
          </div>
          <div class="footer-col">
            <h4>Pages</h4>
            <a href="${href('services.html')}">Services</a>
            <a href="${href('process.html')}">How it works</a>
            <a href="${href('pricing.html')}">Pricing</a>
            <a href="${href('about.html')}">About / Why us</a>
            <a href="${href('success-stories.html')}">Success stories</a>
            <a href="${href('contact.html')}">Contact</a>
            <a href="${href('study-visa/')}">Study Visa hub</a>
            <a href="${href('work-permit/')}">Work Permit hub</a>
            <a href="${href('visit-visa/')}">Visit Visa hub</a>
          </div>
          <div class="footer-col">
            <h4>Tools</h4>
            <a href="${href('tools.html')}">All tools</a>
            <a href="${href('eligibility.html')}">Eligibility Quiz</a>
            <a href="${href('checklist.html')}">Document Checklist</a>
            <a href="${href('calculator.html')}">Cost Calculator</a>
            <a href="${href('compare.html')}">Compare Countries</a>
            <a href="${href('tracker.html')}">Application Tracker</a>
            <a href="${href('cv-builder.html')}">CV Builder</a>
            <a href="${href('official-links/')}">Official embassy links</a>
          </div>
          <div class="footer-col">
            <h4>Contact &amp; legal</h4>
            <a href="mailto:${C().email || 'Services@salaroutsourcing.com'}">${C().email || 'Services@salaroutsourcing.com'}</a>
            <a href="tel:+923045999859">${C().phoneDisplay || '+92 304 5999859'}</a>
            <a href="${C().whatsappLink || 'https://wa.me/923045999859'}" target="_blank" rel="noopener">WhatsApp Chat</a>
            <a href="${href('trust.html')}">Trust &amp; verify</a>
            <a href="${href('faq.html')}">FAQ</a>
            <a href="${href('privacy.html')}">Privacy</a>
            <a href="${href('cookies.html')}">Cookies</a>
            <a href="${href('terms.html')}">Terms</a>
            <button type="button" class="footer-cookie-btn" id="skFooterCookieBtn">Cookie settings</button>
            <a href="${href('local/')}">Cities we serve</a>
            <a href="${href('ur/')}">اردو</a>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© ${year} ${brand}. All rights reserved. · CUIN 0304985 · Rawalpindi, Pakistan</span>
        </div>
      </footer>
      <nav class="sk-bottom-nav" id="bottomNav" aria-label="Mobile">
        <a href="${href('index.html')}" class="sk-bottom-nav-item ${cur === 'home' ? 'active' : ''}" data-nav="home">
          ${icon('home')}<span>Home</span>
        </a>
        <a href="${href('services.html')}" class="sk-bottom-nav-item ${cur === 'services' ? 'active' : ''}" data-nav="services">
          ${icon('briefcase')}<span>Services</span>
        </a>
        <a href="${href('checklist.html')}" class="sk-bottom-nav-item ${cur === 'checklist' ? 'active' : ''}" data-nav="checklist">
          ${icon('clipboard-check')}<span>Checklist</span>
        </a>
        <a href="${href('tools.html')}" class="sk-bottom-nav-item ${cur === 'tools' ? 'active' : ''}" data-nav="tools">
          ${icon('layout-grid')}<span>Tools</span>
        </a>
        <a href="${href('contact.html')}" class="sk-bottom-nav-item ${cur === 'contact' ? 'active' : ''}" data-nav="contact">
          ${icon('message-circle')}<span>Contact</span>
        </a>
      </nav>
    `;
  }

  function revealOnScroll() {
    const els = document.querySelectorAll('.reveal, .fade-in');
    if (!els.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }

  function bindLangToggle() {
    const buttons = [...document.querySelectorAll('.lang-toggle, .sk-lang-btn')];
    if (!buttons.length) return;
    const apply = (ur) => {
      document.documentElement.lang = ur ? 'ur' : 'en';
      document.documentElement.dir = ur ? 'rtl' : 'ltr';
      buttons.forEach((b) => { b.textContent = ur ? 'UR' : 'EN'; });
      let banner = document.getElementById('urBanner');
      if (ur) {
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'urBanner';
          banner.className = 'ur-banner';
          banner.setAttribute('lang', 'ur');
          banner.dir = 'rtl';
          banner.innerHTML =
            'اردو خلاصہ: مفت مشورہ · واٹس ایپ <a href="https://wa.me/923045999859">+92 304 5999859</a> · مکمل اردو صفحات: <a href="' +
            href('ur/') +
            '">یہاں</a>';
          document.getElementById('site-header')?.after(banner);
        }
      } else {
        banner?.remove();
      }
      localStorage.setItem('sk_lang', ur ? 'ur' : 'en');
    };
    apply(localStorage.getItem('sk_lang') === 'ur');
    buttons.forEach((b) => b.addEventListener('click', () => apply(b.textContent !== 'UR')));
  }

  function ensureConsentScript() {
    if (window.SKConsent || document.querySelector('script[src*="consent.js"]')) {
      document.getElementById('skFooterCookieBtn')?.addEventListener('click', () => window.SKConsent?.open());
      return;
    }
    const s = document.createElement('script');
    s.src = BASE + 'assets/js/consent.js?v=consent1';
    s.onload = () => {
      document.getElementById('skFooterCookieBtn')?.addEventListener('click', () => window.SKConsent?.open());
    };
    document.body.appendChild(s);
  }

  function bindUiWidgets() {
    document.querySelectorAll('[data-toggle]').forEach((header) => {
      header.addEventListener('click', () => {
        const card = header.closest('.service-card');
        if (!card) return;
        const wasOpen = card.classList.contains('open');
        card.parentElement.querySelectorAll('.service-card').forEach((c) => c.classList.remove('open'));
        if (!wasOpen) card.classList.add('open');
      });
    });
    document.querySelectorAll('[data-timeline]').forEach((card) => {
      card.addEventListener('click', () => card.closest('.timeline-item')?.classList.toggle('open'));
    });

    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;
    function animateCounters() {
      if (countersAnimated || !counters.length) return;
      countersAnimated = true;
      counters.forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        const start = performance.now();
        function update(now) {
          const progress = Math.min((now - start) / 1800, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(update);
      });
    }
    const trust = document.querySelector('.trust-strip');
    if (trust && counters.length) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) animateCounters();
      }, { threshold: 0.3 });
      obs.observe(trust);
    }
  }

  function icons() {
    if (window.lucide) window.lucide.createIcons();
    else setTimeout(icons, 120);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    revealOnScroll();
    bindLangToggle();
    ensureConsentScript();
    bindUiWidgets();
    icons();
    if (!document.querySelector('script[src*="seo.js"]') && !document.getElementById('sk-org-schema')) {
      const s = document.createElement('script');
      s.src = BASE + 'assets/js/seo.js';
      document.body.appendChild(s);
    }
  });
})();
