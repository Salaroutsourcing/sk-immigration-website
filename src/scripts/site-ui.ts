const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initHeader() {
  const header = document.getElementById('header');
  const drawer = document.getElementById('sk-drawer');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('sk-drawer-close');
  const backdrop = drawer?.querySelector('.sk-drawer-backdrop');

  const onScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setDrawer = (open: boolean) => {
    drawer?.classList.toggle('is-open', open);
    menuBtn?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  menuBtn?.addEventListener('click', () => setDrawer(true));
  closeBtn?.addEventListener('click', () => setDrawer(false));
  backdrop?.addEventListener('click', () => setDrawer(false));

  document.querySelectorAll<HTMLElement>('.sk-nav-item').forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('.sk-nav-trigger');
    const close = () => {
      item.classList.remove('is-open');
      trigger?.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      document.querySelectorAll('.sk-nav-item.is-open').forEach((other) => {
        if (other !== item) other.classList.remove('is-open');
      });
      item.classList.add('is-open');
      trigger?.setAttribute('aria-expanded', 'true');
    };

    trigger?.addEventListener('click', (event) => {
      event.preventDefault();
      if (item.classList.contains('is-open')) close();
      else open();
    });
    item.addEventListener('mouseenter', () => {
      if (window.matchMedia('(min-width: 960px)').matches) open();
    });
    item.addEventListener('mouseleave', () => {
      if (window.matchMedia('(min-width: 960px)').matches) close();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setDrawer(false);
      document.querySelectorAll('.sk-nav-item.is-open').forEach((item) => item.classList.remove('is-open'));
    }
  });
}

function initTheme() {
  const apply = () => {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.sun-icon').forEach((el) => el.classList.toggle('hidden', !isDark));
    document.querySelectorAll('.moon-icon').forEach((el) => el.classList.toggle('hidden', isDark));
  };
  apply();
  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      apply();
    });
  });
}

function initReveal() {
  const nodes = document.querySelectorAll('.sk-reveal');
  if (!nodes.length) return;
  if (reduceMotion() || !('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
  );
  nodes.forEach((node) => io.observe(node));
}

function initTimeline() {
  const el = document.querySelector<HTMLElement>('[data-timeline]');
  if (!el) return;
  const nodes = [...el.querySelectorAll<HTMLElement>('[data-node]')];
  const setProgress = (value: number) => {
    const progress = Math.min(1, Math.max(0, value));
    el.style.setProperty('--progress', String(progress));
    nodes.forEach((node, index) => {
      const threshold = index / Math.max(nodes.length - 1, 1);
      node.classList.toggle('is-done', progress > threshold + 0.08);
      node.classList.toggle('is-active', progress >= threshold - 0.04 && progress < threshold + 0.18);
      if (progress >= 0.98 && index === nodes.length - 1) {
        node.classList.add('is-active');
        node.classList.remove('is-done');
      }
    });
  };

  if (reduceMotion()) {
    setProgress(1);
    return;
  }

  const update = () => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const start = vh * 0.78;
    const span = rect.height + vh * 0.35;
    setProgress((start - rect.top) / span);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

function initJourneyParallax() {
  if (reduceMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((stage) => {
    const onMove = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
      stage.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', () => {
      stage.style.transform = 'translate3d(0,0,0)';
    });
  });
}

function initFaq() {
  document.querySelectorAll<HTMLElement>('[data-faq]').forEach((root) => {
    const items = [...root.querySelectorAll<HTMLElement>('.sk-faq-item')];
    items.forEach((item) => {
      const btn = item.querySelector('button');
      btn?.addEventListener('click', () => {
        const open = item.classList.contains('is-open');
        const opened = items.filter((entry) => entry.classList.contains('is-open'));
        if (!open && opened.length >= 2) opened[0]?.classList.remove('is-open');
        item.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', String(!open));
      });
    });
  });
}

function initWhatsAppTip() {
  const btn = document.getElementById('whatsapp-float');
  if (!btn) return;
  btn.classList.add('is-tip');
  window.setTimeout(() => btn.classList.remove('is-tip'), 3200);
}

function boot() {
  initHeader();
  initTheme();
  initReveal();
  initTimeline();
  initJourneyParallax();
  initFaq();
  initWhatsAppTip();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
