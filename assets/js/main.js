// Main JS for navigation, smooth scroll, filtering, theme toggle, and form handling
// Updated: adds graceful SVG stroke/fill icons for theme toggle and updates aria-label accordingly.

document.addEventListener('DOMContentLoaded', function () {
  // Hamburger toggle
  const navToggleButtons = Array.from(document.querySelectorAll('#nav-toggle'));
  const navs = Array.from(document.querySelectorAll('#main-nav'));

  navToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = document.querySelector('#main-nav');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
      // animate hamburger
      btn.classList.toggle('open');
    });
  });

  // Close mobile nav when clicking a link
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.addEventListener('click', () => {
      const nav = document.querySelector('#main-nav');
      const toggle = document.querySelector('#nav-toggle');
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('open');
        }
      }
    });
  });

  // Highlight active nav link based on location
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    // Consider index.html and empty path
    if (href === path || (href === 'index.html' && path === '')) {
      link.classList.add('active');
    }
  });

  // Smooth scroll for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav if open
        const nav = document.querySelector('#main-nav');
        const toggle = document.querySelector('#nav-toggle');
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Artifact filters (if present)
  const artifactGrid = document.getElementById('artifact-grid');
  if (artifactGrid) {
    const filters = document.querySelectorAll('.artifact-filters .filter');
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        const cards = artifactGrid.querySelectorAll('.artifact');
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.type === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Basic contact form handling (client-side placeholder)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        alert('Please complete all fields before sending.');
        return;
      }

      // This placeholder demonstrates how you'd handle the form.
      // Replace this with a server endpoint or external form service.
      alert('Thank you, ' + name + '! Your message has been recorded (placeholder).');
      contactForm.reset();
    });
  }

  // THEME TOGGLE (with graceful SVG stroke/fill icons)
  const themeToggleButtons = Array.from(document.querySelectorAll('#theme-toggle'));
  const root = document.documentElement;
  const body = document.body;

  // SVG icons (inline strings so we can inject quickly)
  // Sun: filled core with subtle stroke for rays
  const ICON_SUN = `
    <svg class="icon icon-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sunGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="4.2" fill="url(#sunGrad)" />
      <g stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.95">
        <path d="M12 1.8v1.6" />
        <path d="M12 20.6v1.6" />
        <path d="M3.6 4.6l1.1 1.1" />
        <path d="M19.3 17.7l1.1 1.1" />
        <path d="M1.8 12h1.6" />
        <path d="M20.6 12h1.6" />
        <path d="M3.6 19.4l1.1-1.1" />
        <path d="M19.3 6.3l1.1-1.1" />
      </g>
    </svg>`;

  // Moon: filled crescent with soft stroke
  const ICON_MOON = `
    <svg class="icon icon-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="moonGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="0.6"/>
        </linearGradient>
      </defs>
      <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3 6.2 6.2 0 0 0 21 12.8z" fill="url(#moonGrad)" stroke="currentColor" stroke-opacity="0.16" stroke-width="0.8" />
    </svg>`;

  function setToggleIconForButton(btn, theme) {
    if (!btn) return;
    if (theme === 'dark') {
      btn.innerHTML = ICON_MOON;
      btn.setAttribute('aria-label', 'Switch to light theme');
      btn.classList.add('is-dark');
      btn.setAttribute('title', 'Dark mode — switch to light');
    } else {
      btn.innerHTML = ICON_SUN;
      btn.setAttribute('aria-label', 'Switch to dark theme');
      btn.classList.remove('is-dark');
      btn.setAttribute('title', 'Light mode — switch to dark');
    }
  }

  function setToggleIcons(theme) {
    themeToggleButtons.forEach(btn => setToggleIconForButton(btn, theme));
  }

  function getInitialTheme() {
    const persisted = localStorage.getItem('site-theme');
    if (persisted) return persisted;
    // respect OS preference
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    return mql.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    // apply to root (for CSS variables support)
    root.setAttribute('data-theme', theme);
    if (body) body.setAttribute('data-theme', theme);
    localStorage.setItem('site-theme', theme);

    // update toggle icon(s)
    setToggleIcons(theme);
  }

  // initialize
  const initial = getInitialTheme();
  applyTheme(initial);

  // toggle handler
  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });

  // remove theme-loading class so transitions re-enable after initial paint
  // small delay to ensure paint completed (safe and imperceptible)
  window.requestAnimationFrame(() => {
    document.documentElement.classList.remove('theme-loading');
  });
});