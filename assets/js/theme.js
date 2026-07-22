/**
 * Theme toggle with localStorage persistence
 */
(function () {
  const KEY = 'salar-theme';
  const root = document.documentElement;

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    document.querySelectorAll('[data-theme-icon]').forEach((el) => {
      el.textContent = theme === 'dark' ? '☀' : '☾';
    });
  }

  const saved = localStorage.getItem(KEY);
  apply(saved || 'dark'); // always dark by default

  window.SalarTheme = {
    toggle() {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
    },
    current() {
      return root.getAttribute('data-theme');
    },
  };
})();
