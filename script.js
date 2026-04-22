/* ============================================================
   AUDI S3 HISTORY — SHARED SCRIPTS
   ============================================================ */

(function () {
  'use strict';

  // ── Scroll Progress Bar ────────────────────────────────────
  const scrollBar = document.querySelector('.scroll-bar');
  function updateScrollBar() {
    if (!scrollBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    scrollBar.style.width = ((window.scrollY / total) * 100) + '%';
  }

  // ── Navbar Shrink ──────────────────────────────────────────
  const nav = document.querySelector('.nav');
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  // ── Set Active Nav Link ────────────────────────────────────
  function setActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const normalized = page === '' ? 'index.html' : page;
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      a.classList.toggle('active', href === normalized);
    });
  }

  // ── Mobile Nav ─────────────────────────────────────────────
  const burger    = document.querySelector('.nav-burger');
  const mobileNav = document.querySelector('.mobile-nav');

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    burger && burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    burger && burger.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (burger)    burger.addEventListener('click', openMobileNav);
  if (mobileNav) mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });

  // ── Intersection Observer — Card Fade-In ──────────────────
  const animated = document.querySelectorAll(
    '.gen-card, .overview-card, .moment-card, .spec-deep-card, .cta-card, .race-event'
  );

  const cardIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children);
      const idx      = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 75);
      cardIO.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  animated.forEach(el => cardIO.observe(el));

  // ── Section Header Reveal ──────────────────────────────────
  const sectionHeaders = document.querySelectorAll('.section-header, .page-hero-content');
  const headerIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      headerIO.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  sectionHeaders.forEach(el => {
    // Don't override hero's own CSS animations
    if (el.closest('.hero')) return;
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    headerIO.observe(el);
  });

  // ── Smooth Scroll for Anchor Links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 82;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Hero Parallax ──────────────────────────────────────────
  const heroContent = document.querySelector('.hero-content');
  function heroParallax() {
    if (!heroContent) return;
    const y  = window.scrollY;
    const vh = window.innerHeight;
    if (y >= vh) return;
    heroContent.style.transform = `translateY(${y * 0.26}px)`;
    heroContent.style.opacity   = Math.max(0, 1 - (y / vh) * 1.55).toFixed(3);
  }

  // ── Sticky Timeline Nav — Active Generation ────────────────
  const tNodes      = document.querySelectorAll('.t-node');
  const genSections = document.querySelectorAll('[data-gen]');

  function updateTimelineNav() {
    if (!tNodes.length || !genSections.length) return;
    let current = '';
    genSections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= 160) {
        current = sec.dataset.gen;
      }
    });
    tNodes.forEach(node => {
      node.classList.toggle('active', node.dataset.target === current);
    });
  }

  tNodes.forEach(node => {
    node.addEventListener('click', () => {
      const target = document.querySelector(`[data-gen="${node.dataset.target}"]`);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Count-Up Animation ─────────────────────────────────────
  function countUp(el) {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const duration = 1400;
    const start    = performance.now();
    const isFloat  = target % 1 !== 0;

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = (isFloat ? (target * eased).toFixed(1) : Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const countEls = document.querySelectorAll('[data-count]');
  const countIO  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      countIO.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => countIO.observe(el));

  // ── Scroll Listener ────────────────────────────────────────
  window.addEventListener('scroll', () => {
    updateScrollBar();
    updateNav();
    heroParallax();
    updateTimelineNav();
  }, { passive: true });

  // ── Init ───────────────────────────────────────────────────
  updateScrollBar();
  updateNav();
  setActiveNav();

}());
