// Простая логика: анимации при скролле (IntersectionObserver),
// парраллакс для элементов с data-parallax,
// мобильное меню и изменение header при скролле.

// --- helpers
const q = sel => document.querySelector(sel);
const qa = sel => Array.from(document.querySelectorAll(sel));

// --- IntersectionObserver для появления элементов
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // включаем всё сразу для пользователей, выбравших уменьшение анимации
    qa('.animate-on-scroll').forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  qa('.animate-on-scroll').forEach(el => observer.observe(el));
}

// --- Parallax: простая реализация с rAF
function initParallax() {
  const els = qa('[data-parallax]');
  if (!els.length) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const vh = window.innerHeight;
        els.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.08;
          const rect = el.getBoundingClientRect();
          // смещение от центра окна
          const offset = (rect.top + rect.height / 2) - (vh / 2);
          const translate = offset * -speed;
          el.style.transform = XXXINLINECODEXXX0XXXINLINECODEXXX;
        });
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}

// --- Header show/hide & background on scroll
function initHeader() {
  const header = q('#site-header');
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (y > 24) header.classList.add('scrolled'); else header.classList.remove('scrolled');

    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (y > lastY && y > 100) {
          header.style.transform = 'translateY(-100%)'; // скролл вниз — прячем
        } else {
          header.style.transform = '';
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

// --- Mobile nav toggle
function initNavToggle() {
  const btn = q('.nav-toggle');
  const nav = q('.nav');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      nav.style.display = 'block';
    } else {
      nav.style.display = '';
    }
  });
  // Close nav on link click (mobile)
  qa('.nav a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 720) {
      q('.nav-toggle').click();
    }
  }));
}

// --- Small enhancements
function initSmall() {
  // текущий год
  const y = new Date().getFullYear();
  const yearEl = q('#year');
  if (yearEl) yearEl.textContent = y;
}

// --- init
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initParallax();
  initHeader();
  initNavToggle();
  initSmall();
});
