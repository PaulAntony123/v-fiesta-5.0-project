// =============================================
// V-Fiesta 5.0 — IEEE PIE Kerala Section
// Main Script
// =============================================

/* ---------- Navbar: scroll state & active links ---------- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sticky glass effect
  if (window.scrollY > window.innerHeight * 0.85) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ---------- Hamburger / Mobile menu ---------- */
const hamburger = document.querySelector('.hamburger');
const arcaneMenu = document.querySelector('.arcane-menu');
const mobileMenu = document.querySelector('.mobile-menu');

function toggleMobileNav() {
  const isExpanded = hamburger ? hamburger.getAttribute('aria-expanded') === 'true' : false;
  if(hamburger) {
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', !isExpanded);
  }
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}

if(hamburger) hamburger.addEventListener('click', toggleMobileNav);
if(arcaneMenu) arcaneMenu.addEventListener('click', toggleMobileNav);


// Close menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---------- Countdown Timer ---------- */
// Event date: August 15, 2026
const eventDate = new Date('2026-08-15T09:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = n => String(n).padStart(2, '0');
  document.getElementById('cd-days').textContent  = pad(days);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent  = pad(mins);
  document.getElementById('cd-secs').textContent  = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- Scroll Reveal ---------- */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((el, i) => { if (el === entry.target) delay = i * 80; });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

/* ---------- Schedule Tabs ---------- */
const tabBtns = document.querySelectorAll('.tab-btn');
const timelineDays = document.querySelectorAll('.timeline-day');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    timelineDays.forEach(d => d.classList.remove('active'));
    btn.classList.add('active');
    const day = btn.dataset.day;
    document.getElementById(`day-${day}`).classList.add('active');
  });
});

/* ---------- Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- Parallax micro-effect on hero ---------- */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (heroBg) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
});

/* ---------- Dynamic Number Counters ---------- */
const counters = document.querySelectorAll('.counter');
const speed = 80;

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      
      const updateCount = () => {
        const count = +counter.innerText.replace(/,/g, '');
        const inc = target / speed;
        
        if (count < target) {
          counter.innerText = Math.ceil(count + inc).toLocaleString('en-IN');
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target.toLocaleString('en-IN');
        }
      };
      
      updateCount();
      observer.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => {
  counterObserver.observe(counter);
});

/* ---------- Interactive Canvas Background ---------- */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray = [];
  const mouse = {
    x: undefined,
    y: undefined,
    radius: 120
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });

  window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  class Particle {
    constructor(x, y, bgDirectionX, bgDirectionY, size, color) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.bgDirectionX = bgDirectionX;
      this.bgDirectionY = bgDirectionY;
      this.size = size;
      this.color = color;
      this.density = (Math.random() * 30) + 1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    
    update() {
      // Natural movement reflections
      if (this.baseX > canvas.width || this.baseX < 0) {
        this.bgDirectionX = -this.bgDirectionX;
      }
      if (this.baseY > canvas.height || this.baseY < 0) {
        this.bgDirectionY = -this.bgDirectionY;
      }
      
      // Mouse interaction (dodge the mouse smoothly)
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius && mouse.x !== undefined) {
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (mouse.radius - distance) / mouse.radius;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        
        this.x -= directionX;
        this.y -= directionY;
      } else {
        // Return to base position softly before continuing natural drift
        if (this.x !== this.baseX) {
          let dxBase = this.x - this.baseX;
          this.x -= dxBase / 10;
        }
        if (this.y !== this.baseY) {
          let dyBase = this.y - this.baseY;
          this.y -= dyBase / 10;
        }
      }
      
      // Add natural drift
      this.baseX += this.bgDirectionX * 0.4;
      this.baseY += this.bgDirectionY * 0.4;
      
      this.draw();
    }
  }

  function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 11000;
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 2) - 1;
      let directionY = (Math.random() * 2) - 1;
      let color = 'rgba(204, 255, 0, 0.45)';
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = (dx * dx) + (dy * dy);
        
        let connectionThreshold = (canvas.width / 10) * (canvas.height / 10);
        let maxDistSq = 18000;
        
        if (distance < connectionThreshold && distance < maxDistSq) {
          let opacityValue = 1 - (distance / maxDistSq);
          ctx.strokeStyle = `rgba(204, 255, 0, ${opacityValue * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }

  init();
  animate();
}

/* ---------- Modern 3D Card Tilt & Spotlight Tracking ---------- */
const modernCards = document.querySelectorAll('.event-card, .speaker-card, .highlight-item, .timeline-body');

modernCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    // 1. Spotlight Tracking
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // 2. 3D Tilt Effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // dampen the tilt so it's subtle, not aggressive
    const tiltX = ((y - centerY) / centerY) * -4; // max tilt 4deg
    const tiltY = ((x - centerX) / centerX) * 4; 
    
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});
