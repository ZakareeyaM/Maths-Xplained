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

/* ── MATHS CANVAS BACKGROUND ── */
(function initMathsCanvas() {
  const canvas = document.getElementById('maths-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Maths expressions to float across the background
  const EXPRESSIONS = [
    'x² + y² = r²', 'f(x) = mx + c', '∫₀^∞ e^-x dx', 'sin²θ + cos²θ = 1',
    'E = mc²', 'lim(x→0)', 'Σ(n=1)^∞', '√(a² + b²)', 'dy/dx', 'P(A|B)',
    'a² + b² = c²', 'y = ax² + bx + c', 'log₁₀(x)', 'nCr = n! / r!(n-r)!',
    '∇²φ = 0', 'Tn = a + (n-1)d', 'A = πr²', 'V = ⁴⁄₃πr³',
    'f\'(x)', 'μ = Σx/n', 'σ² = Σ(x-μ)²/n', 'z = (x-μ)/σ',
    'tan(θ) = sin/cos', 'Sn = n/2(2a + (n-1)d)', '2πr', 'bh/2',
  ];

  // Geometry shapes drawn in background
  const SHAPES = [];
  const PARTICLES = [];

  let W, H, animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  // Create floating text nodes
  function makeParticle() {
    return {
      text:  EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)],
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.28,
      vy:    (Math.random() - 0.5) * 0.22,
      alpha: 0.04 + Math.random() * 0.10,
      size:  10 + Math.random() * 14,
      hue:   Math.random() < 0.7 ? 215 : 42, // blue or gold
    };
  }

  // Create background geometric shapes (circles, triangles, axes)
  function makeShape() {
    const types = ['circle', 'triangle', 'axes', 'parabola', 'grid'];
    return {
      type:  types[Math.floor(Math.random() * types.length)],
      x:     Math.random() * W,
      y:     Math.random() * H,
      size:  40 + Math.random() * 100,
      alpha: 0.025 + Math.random() * 0.04,
      vx:    (Math.random() - 0.5) * 0.15,
      vy:    (Math.random() - 0.5) * 0.12,
      rot:   Math.random() * Math.PI * 2,
      rotV:  (Math.random() - 0.5) * 0.003,
      hue:   Math.random() < 0.75 ? 215 : 42,
    };
  }

  function init() {
    resize();
    PARTICLES.length = 0;
    SHAPES.length    = 0;
    for (let i = 0; i < 36; i++) PARTICLES.push(makeParticle());
    for (let i = 0; i < 14; i++) SHAPES.push(makeShape());
  }

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.globalAlpha = s.alpha;
    ctx.strokeStyle = s.hue === 42
      ? `hsl(42,60%,62%)`
      : `hsl(215,80%,68%)`;
    ctx.lineWidth = 1;

    switch (s.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        ctx.stroke();
        // inner ring
        ctx.beginPath();
        ctx.arc(0, 0, s.size * 0.55, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -s.size);
        ctx.lineTo(s.size * 0.87, s.size * 0.5);
        ctx.lineTo(-s.size * 0.87, s.size * 0.5);
        ctx.closePath();
        ctx.stroke();
        break;

      case 'axes':
        ctx.beginPath();
        ctx.moveTo(-s.size, 0); ctx.lineTo(s.size, 0);
        ctx.moveTo(0, -s.size); ctx.lineTo(0, s.size);
        // arrowheads
        ctx.moveTo(s.size, 0); ctx.lineTo(s.size - 8, -5);
        ctx.moveTo(s.size, 0); ctx.lineTo(s.size - 8,  5);
        ctx.moveTo(0, -s.size); ctx.lineTo(-5, -s.size + 8);
        ctx.moveTo(0, -s.size); ctx.lineTo( 5, -s.size + 8);
        ctx.stroke();
        // tick marks
        for (let t = -3; t <= 3; t++) {
          if (t === 0) continue;
          const d = (s.size / 3.5) * t;
          ctx.beginPath();
          ctx.moveTo(d, -4); ctx.lineTo(d, 4);
          ctx.moveTo(-4, d); ctx.lineTo(4, d);
          ctx.stroke();
        }
        break;

      case 'parabola':
        ctx.beginPath();
        for (let px = -s.size; px <= s.size; px += 2) {
          const py = (px * px) / s.size - s.size * 0.5;
          if (px === -s.size) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        break;

      case 'grid':
        const step = s.size / 3;
        for (let g = -s.size; g <= s.size; g += step) {
          ctx.beginPath();
          ctx.moveTo(g, -s.size); ctx.lineTo(g, s.size);
          ctx.moveTo(-s.size, g); ctx.lineTo(s.size, g);
          ctx.stroke();
        }
        break;
    }
    ctx.restore();
  }

  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = p.hue === 42
      ? `hsl(42,70%,65%)`
      : `hsl(215,75%,72%)`;
    ctx.font = `${p.size}px 'DM Mono', monospace`;
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  }

  function move(arr) {
    arr.forEach(o => {
      o.x += o.vx;
      o.y += o.vy;
      if (o.rot !== undefined) o.rot += o.rotV;
      // wrap around edges with padding
      const pad = 120;
      if (o.x < -pad) o.x = W + pad;
      if (o.x > W + pad) o.x = -pad;
      if (o.y < -pad) o.y = H + pad;
      if (o.y > H + pad) o.y = -pad;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Deep dark base
    ctx.fillStyle = '#07090f';
    ctx.fillRect(0, 0, W, H);

    // Subtle radial glow centre-left
    const grd = ctx.createRadialGradient(W * 0.3, H * 0.45, 0, W * 0.3, H * 0.45, W * 0.55);
    grd.addColorStop(0, 'rgba(91,156,246,0.07)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Bottom-right warm glow
    const grd2 = ctx.createRadialGradient(W * 0.8, H * 0.8, 0, W * 0.8, H * 0.8, W * 0.4);
    grd2.addColorStop(0, 'rgba(200,161,74,0.05)');
    grd2.addColorStop(1, 'transparent');
    ctx.fillStyle = grd2;
    ctx.fillRect(0, 0, W, H);

    SHAPES.forEach(drawShape);
    PARTICLES.forEach(drawParticle);

    move(SHAPES);
    move(PARTICLES);

    animId = requestAnimationFrame(draw);
  }

  // Boot
  init();
  draw();

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      init();
      draw();
    }, 200);
  });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
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
