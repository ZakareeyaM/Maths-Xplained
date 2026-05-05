/* ══════════════════════════════════════════════
   MATHS XPLAINED — main.js
   ══════════════════════════════════════════════ */

'use strict';

/* ── NAVBAR SCROLL BEHAVIOUR ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── HAMBURGER MENU ── */
(function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links-list');
  if (!hamburger || !navLinks) return;

  let open = false;

  hamburger.addEventListener('click', () => {
    open = !open;
    navLinks.classList.toggle('mobile-open', open);
    hamburger.setAttribute('aria-expanded', String(open));

    // Animate the 3 bars into an X
    const bars = hamburger.querySelectorAll('span');
    if (open) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });

  // Close when a link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      open = false;
      navLinks.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
      const bars = hamburger.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    });
  });
})();

/* ── INTERSECTION OBSERVER — REVEAL ANIMATIONS ── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.1, rootMargin: '-40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ── SMOOTH SCROLL FOR ALL IN-PAGE ANCHORS ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── HERO VIDEO FALLBACK ── */
(function initHeroVideo() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  video.addEventListener('error', () => {
    const wrap = video.closest('.hero-video-wrap');
    if (wrap) wrap.style.display = 'none';
  });

  // Pause video when tab hidden — save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  });
})();

/* ── GRADE CARD STAGGER ── */
(function initGradeStagger() {
  const cards = document.querySelectorAll('.grade-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
  });
})();

/* ── FLOATING MATH SYMBOLS — dynamic parallax ── */
(function initMathParallax() {
  const floats = document.querySelectorAll('.math-float');
  if (!floats.length) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    floats.forEach((el, i) => {
      const depth = (i % 3 + 1) * 6;
      el.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
  }, { passive: true });
})();

/* ── TICKER PAUSE ON HOVER ── */
(function initTickerHover() {
  const track = document.querySelector('.eq-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ── CONTACT COPY TO CLIPBOARD ── */
(function initContactCopy() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'Click to copy';

    el.addEventListener('click', (e) => {
      e.preventDefault();
      const text = el.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const original = el.textContent;
        el.textContent = 'Copied!';
        el.style.color = 'var(--accent2)';
        setTimeout(() => {
          el.textContent = original;
          el.style.color = '';
        }, 1800);
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      });
    });
  });
})();
