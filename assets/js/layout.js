/**
 * Shared layout — SK Immigration Services
 * Parent mention only as subtle "division of Salar Outsourcing"
 */
(function () {
  const C = () => window.SALAR_CONFIG || {};

  /** Fix relative links when page is in a subfolder */
  function basePrefix() {
    const parts = location.pathname.split('/').filter(Boolean);
    const nestedRoots = [
      'blog',
      'answers',
      'admin',
      'study-visa',
      'visa-appointment',
      'saudi-visa',
      'document-services',
      'hire-workers-from-pakistan',
      'work-permit',
      'visit-visa',
      'local',
      'guides',
      'official-links',
      'ur',
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

  const NAV = [
    { href: 'study-visa/', label: 'Study', id: 'study-visa' },
    { href: 'work-permit/', label: 'Work', title: 'Work permits', id: 'work-permit' },
    { href: 'visit-visa/', label: 'Visit', title: 'Visit visas', id: 'visit-visa' },
    { href: 'visa-appointment/', label: 'Appts', title: 'Visa appointments', id: 'visa-appointment' },
    { href: 'saudi-visa/saudi-visa-processing-pakistan/', label: 'Saudi', id: 'saudi-visa' },
    { href: 'document-services/', label: 'Docs', title: 'Document attestation', id: 'document-services' },
    { href: 'contact.html', label: 'Contact', id: 'contact' },
  ];

  /** Pages without their own nav entry highlight their closest parent */
  const NAV_ALIAS = {
    calculator: 'document-services',
    compare: 'document-services',
    checklist: 'document-services',
    attestation: 'document-services',
    eligibility: 'study-visa',
    services: 'study-visa',
    countries: 'study-visa',
    ausbildung: 'work-permit',
    jobs: 'work-permit',
    pricing: 'contact',
    blog: 'study-visa',
    faq: 'contact',
  };

  function activeId() {
    const path = location.pathname;
    if (path.includes('/study-visa')) return 'study-visa';
    if (path.includes('/work-permit')) return 'work-permit';
    if (path.includes('/visit-visa')) return 'visit-visa';
    if (path.includes('/visa-appointment')) return 'visa-appointment';
    if (path.includes('/saudi-visa')) return 'saudi-visa';
    if (path.includes('/document-services') || path.includes('attestation')) return 'document-services';
    if (path.includes('/hire-workers')) return 'document-services';
    if (path.includes('/answers/')) return 'study-visa';
    if (path.includes('/blog/')) return 'study-visa';
    const page = document.body.dataset.page || 'home';
    return NAV_ALIAS[page] || page;
  }

  function href(path) {
    return BASE + path;
  }

  function navLinks(cls) {
    const cur = activeId();
    return NAV.map((n) => {
      const title = n.title ? ` title="${n.title}"` : '';
      return `<a href="${href(n.href)}" class="${cls} ${cur === n.id ? 'active' : ''}"${title} ${cur === n.id ? 'aria-current="page"' : ''}>${n.label}</a>`;
    }).join('');
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

  function logoBlock() {
    const brand = C().brandFull || C().brand || 'SK Immigration Services';
    const brandShort = C().brand || 'SK Immigration';
    return `
      <a href="${href('index.html')}" class="logo" aria-label="${brand} home">
        <span class="logo-mark"><span>SK</span></span>
        <span class="logo-text">
          <span class="nav-name">
            <span class="nav-name-long">${brandShort}</span>
            <span class="nav-name-short" aria-hidden="true">${brandShort}</span>
          </span>
        </span>
      </a>`;
  }

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;
    el.innerHTML = `
      <a href="#main" class="skip-link">Skip to main content</a>
      <header class="site-header" id="header">
        <div class="container header-shell">
          <div class="header-inner">
            ${logoBlock()}
            <nav class="nav-desktop" aria-label="Primary">${navLinks('nav-pill')}</nav>
            <div class="header-actions">
              <button type="button" class="lang-toggle glass-chip" id="langToggle" aria-label="Toggle English / Urdu summary">EN</button>
              <button type="button" class="theme-toggle glass-chip" aria-label="Toggle dark/light mode" onclick="SalarTheme.toggle()">
                <span data-theme-icon>☾</span>
              </button>
              <a href="${href('contact.html')}" class="btn btn-gold btn-sm btn-consult">Consult</a>
              <button type="button" class="menu-toggle glass-chip" aria-label="Open menu" aria-expanded="false" id="menuBtn">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div class="mobile-nav" id="mobileNav" role="dialog" aria-label="Mobile menu">
        <div class="mobile-nav-panel">
          <p class="mobile-nav-label">Services</p>
          ${navLinks('')}
          <p class="mobile-nav-label">Tools</p>
          <a href="${href('eligibility.html')}">Eligibility Quiz</a>
          <a href="${href('checklist.html')}">Document Checklist</a>
          <a href="${href('calculator.html')}">Cost Calculator</a>
          <a href="${href('compare.html')}">Compare Countries</a>
          <a href="${href('cv-builder.html')}">CV Builder</a>
          <a href="${href('answers.html')}">Answers / Guides</a>
          <a href="${href('faq.html')}">FAQ</a>
          <a href="${href('blog.html')}">Blog</a>
          <a href="${href('services.html')}">All Services</a>
          <a href="${href('about.html')}">About</a>
          <a href="${href('privacy.html')}">Privacy</a>
          <a href="${href('terms.html')}">Terms</a>
          <a href="${C().whatsappLink || '#'}" class="btn btn-whatsapp mt-2" target="_blank" rel="noopener">WhatsApp</a>
          <div class="mobile-nav-toggles">
            <button type="button" class="lang-toggle glass-chip" aria-label="Toggle English / Urdu summary">EN</button>
            <button type="button" class="theme-toggle glass-chip" aria-label="Toggle dark/light mode" onclick="SalarTheme.toggle()">
              <span data-theme-icon>☾</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const header = document.getElementById('header');
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');

    const onScroll = () => {
      header?.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    menuBtn?.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav?.addEventListener('click', (e) => {
      if (e.target === mobileNav) {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    const year = new Date().getFullYear();
    const brand = C().brandFull || 'SK Immigration Services';
    el.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            ${logoBlock()}
            <p>Trusted visa, Ausbildung and career guidance for students &amp; professionals from any country. Honest advice — no false guarantees.</p>
            <div class="footer-col" style="margin-top:1rem">
              <h4>Follow us</h4>
              ${socialRow()}
            </div>
          </div>
          <div class="footer-col">
            <h4>Services</h4>
            <a href="${href('study-visa/')}">Study Visa Pakistan</a>
            <a href="${href('work-permit/')}">Work Permit Pakistan</a>
            <a href="${href('visit-visa/')}">Visit Visa Pakistan</a>
            <a href="${href('visa-appointment/')}">Visa Appointments</a>
            <a href="${href('saudi-visa/saudi-visa-processing-pakistan/')}">Saudi Work Visa Processing</a>
            <a href="${href('document-services/')}">Document Attestation</a>
            <a href="${href('hire-workers-from-pakistan/')}">Hire Workers from Pakistan</a>
            <a href="${href('jobs.html')}">Jobs board</a>
          </div>
          <div class="footer-col">
            <h4>Quick tools</h4>
            <a href="${href('eligibility.html')}">Eligibility Quiz</a>
            <a href="${href('checklist.html')}">Document Checklist</a>
            <a href="${href('calculator.html')}">Cost Calculator</a>
            <a href="${href('compare.html')}">Compare Countries</a>
            <a href="${href('answers.html')}">Answers Hub</a>
            <a href="${href('official-links/')}">Official embassy links</a>
            <a href="${href('cv-builder.html')}">CV Builder</a>
          </div>
          <div class="footer-col">
            <h4>Contact &amp; legal</h4>
            <a href="mailto:${C().email}">${C().email}</a>
            <a href="tel:${(C().phone || '').replace(/\s/g, '')}">${C().phoneDisplay}</a>
            <a href="${C().whatsappLink}" target="_blank" rel="noopener">WhatsApp Chat</a>
            <a href="${href('about.html')}">About</a>
            <a href="${href('faq.html')}">FAQ</a>
            <a href="${href('contact.html')}">Book consult</a>
            <a href="${href('privacy.html')}">Privacy Policy</a>
            <a href="${href('terms.html')}">Terms &amp; Conditions</a>
            <a href="${href('local/rawalpindi-study-visa-consultant/')}">Rawalpindi office</a>
            <a href="${href('local/lahore-study-visa-consultant/')}">Lahore clients</a>
            <a href="${href('local/karachi-study-visa-consultant/')}">Karachi clients</a>
            <a href="${href('ur/')}">اردو</a>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© ${year} ${brand}. All rights reserved. · <a href="${href('privacy.html')}">Privacy</a> · <a href="${href('terms.html')}">Terms</a> · <a href="${href('ur/')}">اردو</a></span>
          <span class="parent-line">SK Immigration Services by <a href="${href('about.html')}">Salar Outsourcing</a> · Rawalpindi, Pakistan</span>
        </div>
      </footer>
      <a class="wa-float" href="${C().whatsappLink}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 6.165L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    `;
  }

  function revealOnScroll() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }
    requestAnimationFrame(() => {
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
        if (inView) el.classList.add('visible');
        else el.classList.add('reveal-ready');
      });
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              e.target.classList.remove('reveal-ready');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
      );
      els.forEach((el) => {
        if (!el.classList.contains('visible')) io.observe(el);
      });
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
          el.classList.add('visible');
          el.classList.remove('reveal-ready');
        });
      }, 1200);
    });
  }

  function bindLangToggle() {
    const buttons = [...document.querySelectorAll('.lang-toggle')];
    if (!buttons.length) return;
    const apply = (ur) => {
      document.documentElement.lang = ur ? 'ur' : 'en';
      document.documentElement.dir = ur ? 'rtl' : 'ltr';
      buttons.forEach((b) => { b.textContent = ur ? 'UR' : 'EN'; });
      document.querySelectorAll('[data-en][data-ur]').forEach((el) => {
        if (el.closest('.logo')) return;
        el.textContent = ur ? el.getAttribute('data-ur') : el.getAttribute('data-en');
      });
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
            '">یہاں</a> · <a href="' +
            href('contact.html') +
            '">اب بک کریں</a>';
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

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    revealOnScroll();
    bindLangToggle();
    if (window.SalarTheme) {
      const t = document.documentElement.getAttribute('data-theme');
      document.querySelectorAll('[data-theme-icon]').forEach((el) => {
        el.textContent = t === 'dark' ? '☀' : '☾';
      });
    }
    if (!document.querySelector('script[src*="seo.js"]') && !document.getElementById('sk-org-schema')) {
      const s = document.createElement('script');
      s.src = BASE + 'assets/js/seo.js';
      document.body.appendChild(s);
    }
    /* Ask SK chatbot removed — WhatsApp + guides are the support path */
  });
})();
