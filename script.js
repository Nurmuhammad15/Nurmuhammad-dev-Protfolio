// script.js — Fixed version + Stars + Hero effects

document.addEventListener('DOMContentLoaded', () => {

  // ---- STARS CANVAS ----
  const canvas = document.getElementById('starsCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      v: Math.random() * 0.0003 + 0.0001,
      o: Math.random() * 0.6 + 0.2
    }));

    let t = 0;
    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.5;
      stars.forEach(s => {
        s.y -= s.v;
        if (s.y < 0) s.y = 1;
        const flicker = 0.5 + 0.5 * Math.sin(t * s.v * 100 + s.x * 99);
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(92,255,178,${s.o * flicker})`;
        ctx.fill();
      });
      requestAnimationFrame(drawStars);
    }
    drawStars();
    window.addEventListener('resize', resizeCanvas);
  }

  // ---- HERO NAME HOVER EFFECT ----
  const heroName = document.getElementById('heroName');
  if (heroName) {
    heroName.addEventListener('mouseenter', () => {
      heroName.classList.add('glow-hover');
    });
    heroName.addEventListener('mouseleave', () => {
      heroName.classList.remove('glow-hover');
    });
  }

  // ---- CURSOR GLOW ----
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    });
  }

  // ---- HEADER SCROLL ----
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('active') &&
          !nav.contains(e.target) &&
          !hamburger.contains(e.target)) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      if (nav && hamburger) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  });

  // ---- REVEAL ANIMATIONS ----
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---- SKILL BARS ----
  const skillCards = document.querySelectorAll('.skill-card');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => skillObserver.observe(card));

  // ---- PROJECT FILTER TABS ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

});
