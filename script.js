// =============================================
// V-Fiesta 5.0 — IEEE PIE Kerala Section
// Main Script
// =============================================

'use strict';

// ---------------------------------------------------------------------------
// Configuration — all magic numbers in one place for easy maintenance
// ---------------------------------------------------------------------------
const CONFIG = {
  navbar: {
    scrollThreshold: 0.85,      // fraction of viewport height before nav goes opaque
    activeLinkOffset: 100,      // px offset for active-link detection
  },
  smoothScroll: {
    navbarOffset: 70,           // px to subtract so section isn't hidden under navbar
  },
  countdown: {
    eventDate: new Date('2026-08-15T09:00:00'),
  },
  reveal: {
    threshold: 0.12,
    staggerMs: 80,
  },
  counter: {
    steps: 80,                  // number of incremental animation frames
    threshold: 0.5,
  },
  canvas: {
    particleDensity: 11000,     // canvas area / this number = particle count
    particleSpeed: 0.4,
    mouseRadius: 120,
    maxConnectionDistSq: 18000,
    particleColor: 'rgba(204, 255, 0, 0.45)',
    lineColor: 'rgba(204, 255, 0, ',
    lineOpacityFactor: 0.35,
  },
  tilt: {
    maxDeg: 4,
    perspective: 1000,
    scale: 1.02,
  },
  parallax: {
    heroScrollFactor: 0.25,
  },
};

// ---------------------------------------------------------------------------
// Navbar — sticky glass effect + active link highlight
// ---------------------------------------------------------------------------

/** @type {HTMLElement|null} */
const navbar  = document.getElementById('navbar');
/** @type {NodeListOf<HTMLAnchorElement>} */
const navLinks = document.querySelectorAll('.nav-links a');
/** @type {NodeListOf<HTMLElement>} */
const sections = document.querySelectorAll('section[id]');

/**
 * Toggle the .scrolled class on the navbar based on scroll position,
 * and highlight the nav link matching the currently visible section.
 */
function onNavbarScroll() {
  if (!navbar) return;

  // Sticky glass effect
  const pastThreshold = window.scrollY > window.innerHeight * CONFIG.navbar.scrollThreshold;
  navbar.classList.toggle('scrolled', pastThreshold);

  // Active link highlight
  let currentSectionId = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - CONFIG.navbar.activeLinkOffset) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${currentSectionId}`;
    link.classList.toggle('active', isActive);
  });
}

window.addEventListener('scroll', onNavbarScroll, { passive: true });

// ---------------------------------------------------------------------------
// Mobile Navigation — hamburger toggle
// ---------------------------------------------------------------------------

/** @type {HTMLButtonElement|null} */
const hamburgerBtn = document.getElementById('hamburger-btn');
/** @type {HTMLElement|null} */
const mobileMenu   = document.getElementById('mobile-menu');

/**
 * Open or close the mobile overlay menu.
 */
function toggleMobileNav() {
  if (!hamburgerBtn || !mobileMenu) return;

  const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  const nextState  = !isExpanded;

  hamburgerBtn.classList.toggle('open', nextState);
  hamburgerBtn.setAttribute('aria-expanded', String(nextState));
  mobileMenu.classList.toggle('open', nextState);
  document.body.style.overflow = nextState ? 'hidden' : '';
}

/**
 * Close the mobile menu (called after a nav link is tapped).
 */
function closeMobileNav() {
  if (!hamburgerBtn || !mobileMenu) return;

  hamburgerBtn.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileNav);

// Close menu when any nav link inside the overlay is tapped
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}

// ---------------------------------------------------------------------------
// Countdown Timer
// ---------------------------------------------------------------------------

/** Zero-pad a number to at least 2 digits. */
const padTwo = n => String(n).padStart(2, '0');

/**
 * Write the current time-remaining values into the countdown DOM elements.
 */
function updateCountdown() {
  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');

  // Graceful no-op if countdown elements are absent
  if (!elDays || !elHours || !elMins || !elSecs) return;

  const diff = CONFIG.countdown.eventDate - new Date();

  if (diff <= 0) {
    [elDays, elHours, elMins, elSecs].forEach(el => (el.textContent = '00'));
    return;
  }

  const MS_SECOND = 1000;
  const MS_MINUTE = MS_SECOND * 60;
  const MS_HOUR   = MS_MINUTE * 60;
  const MS_DAY    = MS_HOUR   * 24;

  elDays.textContent  = padTwo(Math.floor(diff / MS_DAY));
  elHours.textContent = padTwo(Math.floor((diff % MS_DAY)    / MS_HOUR));
  elMins.textContent  = padTwo(Math.floor((diff % MS_HOUR)   / MS_MINUTE));
  elSecs.textContent  = padTwo(Math.floor((diff % MS_MINUTE) / MS_SECOND));
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---------------------------------------------------------------------------
// Scroll Reveal
// ---------------------------------------------------------------------------

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger sibling reveals
    const siblings = entry.target.parentElement.querySelectorAll('.reveal');
    let delay = 0;
    siblings.forEach((el, i) => {
      if (el === entry.target) delay = i * CONFIG.reveal.staggerMs;
    });

    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: CONFIG.reveal.threshold });

revealElements.forEach(el => revealObserver.observe(el));

// ---------------------------------------------------------------------------
// Schedule Tabs
// ---------------------------------------------------------------------------

const tabBtns     = document.querySelectorAll('.tab-btn');
const timelineDays = document.querySelectorAll('.timeline-day');

/**
 * Switch the visible schedule day panel.
 * @param {HTMLElement} activeBtn
 */
function switchScheduleTab(activeBtn) {
  tabBtns.forEach(b => b.classList.remove('active'));
  timelineDays.forEach(d => d.classList.remove('active'));

  activeBtn.classList.add('active');
  const targetPanel = document.getElementById(`day-${activeBtn.dataset.day}`);
  if (targetPanel) targetPanel.classList.add('active');
}

tabBtns.forEach(btn => btn.addEventListener('click', () => switchScheduleTab(btn)));

// ---------------------------------------------------------------------------
// Smooth Scroll — all anchor links
// ---------------------------------------------------------------------------

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function handleAnchorClick(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - CONFIG.smoothScroll.navbarOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---------------------------------------------------------------------------
// Parallax — hero background subtle scroll effect
// ---------------------------------------------------------------------------

const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * CONFIG.parallax.heroScrollFactor}px)`;
  }, { passive: true });
}

// ---------------------------------------------------------------------------
// Animated Number Counters
// ---------------------------------------------------------------------------

const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target  = +counter.getAttribute('data-target');
    const steps   = CONFIG.counter.steps;

    /** Increment the displayed number one step at a time. */
    function animateCount() {
      const current = +counter.innerText.replace(/,/g, '');
      const increment = target / steps;

      if (current < target) {
        counter.innerText = Math.ceil(current + increment).toLocaleString('en-IN');
        requestAnimationFrame(animateCount);
      } else {
        counter.innerText = target.toLocaleString('en-IN');
      }
    }

    animateCount();
    observer.unobserve(counter);
  });
}, { threshold: CONFIG.counter.threshold });

counters.forEach(counter => counterObserver.observe(counter));

// ---------------------------------------------------------------------------
// Particle Canvas Background (IIFE — keeps vars out of global scope)
// ---------------------------------------------------------------------------

(function initParticleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const { particleDensity, particleSpeed, mouseRadius, maxConnectionDistSq,
          particleColor, lineColor, lineOpacityFactor } = CONFIG.canvas;

  /** Tracked mouse position (undefined when outside the window). */
  const mouse = { x: undefined, y: undefined, radius: mouseRadius };

  /** @type {Particle[]} */
  let particles = [];

  /** Resize canvas to match the viewport. */
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} dirX  - initial drift direction X
     * @param {number} dirY  - initial drift direction Y
     * @param {number} size
     * @param {string} color
     */
    constructor(x, y, dirX, dirY, size, color) {
      this.x      = x;
      this.y      = y;
      this.baseX  = x;
      this.baseY  = y;
      this.dirX   = dirX;
      this.dirY   = dirY;
      this.size   = size;
      this.color  = color;
      this.density = Math.random() * 30 + 1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Bounce off canvas edges
      if (this.baseX > canvas.width  || this.baseX < 0) this.dirX = -this.dirX;
      if (this.baseY > canvas.height || this.baseY < 0) this.dirY = -this.dirY;

      // Mouse repulsion
      const dx       = mouse.x - this.x;
      const dy       = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (mouse.x !== undefined && distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= (dx / distance) * force * this.density;
        this.y -= (dy / distance) * force * this.density;
      } else {
        // Drift back to base position
        this.x -= (this.x - this.baseX) / 10;
        this.y -= (this.y - this.baseY) / 10;
      }

      // Natural drift
      this.baseX += this.dirX * particleSpeed;
      this.baseY += this.dirY * particleSpeed;

      this.draw();
    }
  }

  /** Populate the particles array. */
  function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / particleDensity);

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1;
      const x    = Math.random() * (canvas.width  - size * 4) + size * 2;
      const y    = Math.random() * (canvas.height - size * 4) + size * 2;
      const dirX = Math.random() * 2 - 1;
      const dirY = Math.random() * 2 - 1;
      particles.push(new Particle(x, y, dirX, dirY, size, particleColor));
    }
  }

  /** Draw connecting lines between nearby particles. */
  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx   = particles[a].x - particles[b].x;
        const dy   = particles[a].y - particles[b].y;
        const dist = dx * dx + dy * dy;

        if (dist < maxConnectionDistSq) {
          const opacity = (1 - dist / maxConnectionDistSq) * lineOpacityFactor;
          ctx.strokeStyle = `${lineColor}${opacity})`;
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  /** Main render loop. */
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());
    connectParticles();
  }

  // Event listeners
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout',  ()  => { mouse.x = undefined; mouse.y = undefined; });
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); }, { passive: true });

  resizeCanvas();
  initParticles();
  animate();
}());

// ---------------------------------------------------------------------------
// 3D Card Tilt + Spotlight Mouse Tracking
// ---------------------------------------------------------------------------

const tiltCards = document.querySelectorAll('.event-card, .speaker-card, .highlight-item, .timeline-body');
const { maxDeg, perspective, scale } = CONFIG.tilt;

tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect    = card.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const centerX = rect.width  / 2;
    const centerY = rect.height / 2;

    // CSS custom props for the spotlight gradient
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Subtle 3-D tilt
    const tiltX = ((y - centerY) / centerY) * -maxDeg;
    const tiltY = ((x - centerX) / centerX) *  maxDeg;
    card.style.transform =
      `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale},${scale},${scale})`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
  });
});
