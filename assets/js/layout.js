/**
 * Shared layout — SK Immigration Services
 * Parent mention only as subtle "division of Salar Outsourcing"
 */
(function () {
  const C = () => window.SALAR_CONFIG || {};

  /** Fix relative links when page is in /blog/.../ subfolders */
  function basePrefix() {
    if (location.pathname.includes('/blog/') && location.pathname.split('/').filter(Boolean).length >= 2) {
      return '../../';
    }
    if (location.pathname.includes('/admin')) return '../';
    return '';
  }

  const BASE = basePrefix();

  const NAV = [
    { href: 'index.html', label: 'Home', id: 'home' },
    { href: 'services.html', label: 'Services', id: 'services' },
    { href: 'checklist.html', label: 'Checklist', id: 'checklist' },
    { href: 'countries.html', label: 'Countries', id: 'countries' },
    { href: 'ausbildung.html', label: 'Ausbildung', id: 'ausbildung' },
    { href: 'jobs.html', label: 'Jobs', id: 'jobs' },
    { href: 'pricing.html', label: 'Pricing', id: 'pricing' },
    { href: 'answers.html', label: 'Answers', id: 'faq' },
    { href: 'contact.html', label: 'Contact', id: 'contact' },
  ];

  function activeId() {
    if (location.pathname.includes('/blog/')) return 'blog';
    return document.body.dataset.page || 'home';
  }

  function href(path) {
    return BASE + path;
  }

  function navLinks(cls) {
    const cur = activeId();
    return NAV.map(
      (n) =>
        `<a href="${href(n.href)}" class="${cls} ${cur === n.id ? 'active' : ''}" ${cur === n.id ? 'aria-current="page"' : ''}>${n.label}</a>`
    ).join('');
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
    return `
      <a href="${href('index.html')}" class="logo" aria-label="${brand} home">
        <span class="logo-mark">SK</span>
        <span class="logo-text">
          <span class="nav-name">${brand}</span>
          <small class="nav-sub">A Salar Outsourcing brand</small>
        </span>
      </a>`;
  }

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;
    el.innerHTML = `
      <div class="brand-bar">
        <div class="container">
          <span>A service by <a href="https://salaroutsourcing.com">Salar Outsourcing</a> — Pakistan’s multi-service company</span>
          <div class="brand-bar-links">
            <a href="${href('ausbildung.html')}">Ausbildung Jobs</a>
            <a href="${href('portal.html')}">Client Portal</a>
            <a href="tel:+923045999859">${C().phoneDisplay || '+92 304 5999859'}</a>
          </div>
        </div>
      </div>
      <a href="#main" class="skip-link">Skip to main content</a>
      <header class="site-header" id="header">
        <div class="container header-inner">
          ${logoBlock()}
          <nav class="nav-desktop" aria-label="Primary">${navLinks('')}</nav>
          <div class="header-actions">
            <button type="button" class="lang-toggle" id="langToggle" aria-label="Toggle English / Urdu summary">EN</button>
            <button type="button" class="theme-toggle" aria-label="Toggle dark/light mode" onclick="SalarTheme.toggle()">
              <span data-theme-icon>☾</span>
            </button>
            <a href="${href('eligibility.html')}" class="btn btn-ghost btn-sm btn-portal">Quiz</a>
            <a href="${href('contact.html')}" class="btn btn-gold btn-sm">Free Consult</a>
            <button type="button" class="menu-toggle" aria-label="Open menu" aria-expanded="false" id="menuBtn">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
          </div>
        </div>
      </header>
      <div class="mobile-nav" id="mobileNav" role="dialog" aria-label="Mobile menu">
        <div class="mobile-nav-panel">
          ${navLinks('')}
          <a href="${href('eligibility.html')}">Eligibility Quiz</a>
          <a href="${href('calculator.html')}">Cost Calculator</a>
          <a href="${href('compare.html')}">Compare Countries</a>
          <a href="${href('cv-builder.html')}">CV Builder</a>
          <a href="${href('faq.html')}">FAQ</a>
          <a href="${href('blog.html')}">Blog</a>
          <a href="${href('portal.html')}">Client Portal</a>
          <a href="${href('about.html')}">About</a>
          <a href="${href('attestation.html')}">Attestation</a>
          <a href="${C().whatsappLink || '#'}" class="btn btn-whatsapp mt-2" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    `;

    const header = document.getElementById('header');
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');

    window.addEventListener('scroll', () => {
      header?.classList.toggle('scrolled', window.scrollY > 12);
    });

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
            <a href="${href('services.html')}">All Services</a>
            <a href="${href('pricing.html')}">Packages &amp; Pricing</a>
            <a href="${href('ausbildung.html')}">Germany Ausbildung</a>
            <a href="${href('jobs.html')}">Global Jobs</a>
            <a href="${href('attestation.html')}">Document Attestation</a>
          </div>
          <div class="footer-col">
            <h4>Quick tools</h4>
            <a href="${href('eligibility.html')}">Eligibility Quiz</a>
            <a href="${href('checklist.html')}">Document Checklist</a>
            <a href="${href('calculator.html')}">Cost Calculator</a>
            <a href="${href('compare.html')}">Compare Countries</a>
            <a href="${href('answers.html')}">Answers Hub</a>
            <a href="${href('cv-builder.html')}">CV Builder</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <a href="mailto:${C().email}">${C().email}</a>
            <a href="tel:${(C().phone || '').replace(/\s/g, '')}">${C().phoneDisplay}</a>
            <a href="${C().whatsappLink}" target="_blank" rel="noopener">WhatsApp Chat</a>
            <a href="${href('about.html')}">About</a>
            <a href="${href('faq.html')}">FAQ</a>
            <a href="${href('contact.html')}">Book consult</a>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© ${year} ${brand}. All rights reserved. · <a href="${href('privacy.html')}">Privacy &amp; Terms</a></span>
          <span class="parent-line">${C().parentLine || 'A division of Salar Outsourcing'}</span>
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
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  function bindLangToggle() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;
    const apply = (ur) => {
      document.documentElement.lang = ur ? 'ur' : 'en';
      btn.textContent = ur ? 'UR' : 'EN';
      document.querySelectorAll('[data-en][data-ur]').forEach((el) => {
        el.textContent = ur ? el.getAttribute('data-ur') : el.getAttribute('data-en');
      });
      let banner = document.getElementById('urBanner');
      if (ur) {
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'urBanner';
          banner.className = 'glass card';
          banner.style.cssText = 'margin:0;border-radius:0;padding:0.65rem 1rem;text-align:center;font-size:0.9rem';
          banner.innerHTML =
            'اردو مدد: مفت مشورہ، دستاویزات کی فہرست، اور واٹس ایپ +92 304 5999859 · <a href="' +
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
    btn.addEventListener('click', () => apply(btn.textContent !== 'UR'));
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
    if (!document.querySelector('script[src*="ai-chat.js"]')) {
      const a = document.createElement('script');
      a.src = BASE + 'assets/js/ai-chat.js';
      document.body.appendChild(a);
    }
  });
})();
