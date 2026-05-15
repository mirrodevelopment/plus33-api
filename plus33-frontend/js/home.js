import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/home.css';
import '../css/store.css';

export function mountHomePage() {

  // ─────────────────────────────────────────────
  // 1. GSAP REGISTER
  // ─────────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ─────────────────────────────────────────────
  // 2. ATMOSPHERIC PARTICLE SYSTEM
  // ─────────────────────────────────────────────
  (function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function createParticle() {
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.4 + 0.1),
        opacity: Math.random() * 0.5 + 0.1,
        flicker: Math.random() * Math.PI * 2
      };
    }
    for (let i = 0; i < 110; i++) particles.push(createParticle());

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const t = performance.now() / 1000;
      particles.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.flicker += 0.04;
        if (p.y < -5 || p.x < -5 || p.x > W + 5) {
          p.x = Math.random() * W;
          p.y = H + 5;
        }
        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.flicker));
        // Copper-tinted sparks
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216,154,91,${alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ─────────────────────────────────────────────
  // 3. CINEMATIC PARALLAX CAMERA (mouse drift)
  // ─────────────────────────────────────────────
  const scene = document.getElementById('parallax-scene');
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 18;
    my = (e.clientY / window.innerHeight - 0.5) * 10;
  }, { passive: true });
  function driftLoop() {
    cx += (mx - cx) * 0.04;
    cy += (my - cy) * 0.04;
    if (scene) gsap.set(scene, { x: cx, y: cy });
    requestAnimationFrame(driftLoop);
  }
  driftLoop();

  // ─────────────────────────────────────────────
  // 4. ELEMENTS
  // ─────────────────────────────────────────────
  const wrapper     = document.getElementById('stage-wrapper');
  const heroBg      = document.getElementById('p-bg');
  const heroUi      = document.getElementById('hero-ui');
  const outlineWrap = document.getElementById('outline-type-wrap');
  const imageInType = document.getElementById('image-in-type');
  const fogLayers   = document.querySelectorAll('.fog-layer');
  const veil        = document.getElementById('zoom-veil');
  const portal      = document.getElementById('gateway-portal');
  const inner       = document.getElementById('portal-inner');
  const bloom       = document.getElementById('portal-bloom');
  const glass       = document.getElementById('alley-glass');
  const text1       = document.getElementById('cinematic-text-1');
  const whiteBg     = document.getElementById('white-transition');
  const navbar      = document.getElementById('navbar');

  // ─────────────────────────────────────────────
  // 5. SCROLL-DRIVEN CINEMATIC ENGINE
  // ─────────────────────────────────────────────
  const clamp     = (v, a, b) => Math.max(a, Math.min(b, v));
  const mapRange  = (v, a, b, c, d) => c + clamp((v - a) / (b - a), 0, 1) * (d - c);
  const easeIn3   = t => t * t * t;
  const easeInOut = t => t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;

  let ticking = false;

  function update() {
    if (!wrapper) { ticking = false; return; }
    const rect  = wrapper.getBoundingClientRect();
    const scrollY = -rect.top;
    const maxS    = wrapper.offsetHeight - window.innerHeight;

    if (scrollY > maxS + window.innerHeight) { ticking = false; return; }

    const p = clamp(scrollY / maxS, 0, 1);

    // ── Phase 1: Hero UI fades out (0→0.08) ──
    if (heroUi) {
      heroUi.style.opacity   = mapRange(p, 0, 0.08, 1, 0);
      heroUi.style.transform = `translateY(${p * 160}px)`;
    }

    // ── Phase 2: Eiffel Tower Zoom (0.05→0.45) ──
    if (heroBg) {
      const scale = 1 + easeIn3(clamp(p / 0.45, 0, 1)) * 14;
      // slight motion blur simulation via filter
      const blur  = mapRange(p, 0.2, 0.4, 0, 3);
      heroBg.style.transform = `scale(${scale})`;
      heroBg.style.filter    = `brightness(${mapRange(p,0,0.4,0.55,0.4)}) contrast(1.1) saturate(0.9) blur(${blur}px)`;
    }

    // ── Phase 3: Outline Typography + Image-in-Text (0.05→0.35) ──
    if (outlineWrap) {
      const show = mapRange(p, 0.05, 0.15, 0, 1);
      const hide = mapRange(p, 0.3,  0.4,  1, 0);
      outlineWrap.style.opacity   = Math.min(show, hide);
      const typeScale = 1 + mapRange(p, 0.05, 0.45, 0, 0.4);
      outlineWrap.style.transform = `scale(${typeScale})`;
    }
    if (imageInType) {
      imageInType.style.opacity = mapRange(p, 0.12, 0.28, 0, 1);
    }

    // ── Phase 4: Fog rises (0.08→0.35) ──
    fogLayers.forEach((fog, i) => {
      const delay = i * 0.04;
      fog.style.opacity   = mapRange(p, 0.08 + delay, 0.3 + delay, 0, 0.9);
      fog.style.transform = `translateY(${mapRange(p, 0.08, 0.45, 20, 0)}%)`;
    });

    // ── Phase 5: Veil darkens (0.25→0.48) ──
    if (veil) veil.style.opacity = mapRange(p, 0.25, 0.48, 0, 1);

    // ── Phase 6: Portal Mask Opens (0.45→0.7) ──
    if (portal && inner) {
      const pp  = clamp((p - 0.45) / 0.25, 0, 1);
      portal.style.opacity = clamp(pp * 5, 0, 1);
      const dim = easeInOut(pp) * 7000;
      portal.style.webkitMaskSize = `${dim}px ${dim}px`;
      portal.style.maskSize       = `${dim}px ${dim}px`;
      inner.style.transform       = `scale(${1.9 - pp * 0.9})`;
      if (bloom) bloom.style.opacity = mapRange(p, 0.45, 0.58, 0, 1);
    } else if (portal) {
      portal.style.opacity        = 0;
      portal.style.webkitMaskSize = '0px 0px';
      portal.style.maskSize       = '0px 0px';
    }

    // ── Phase 7: Alley text fades in then out (0.6→0.88) ──
    if (glass) glass.style.opacity = mapRange(p, 0.62, 0.7, 0, 1);
    if (text1) {
      const tIn  = mapRange(p, 0.65, 0.73, 0, 1);
      const tOut = mapRange(p, 0.8,  0.86, 1, 0);
      const opacity = Math.min(tIn, tOut);
      text1.style.opacity   = opacity;
      text1.style.transform = `translateY(${(1 - tIn) * 40}px)`;
      text1.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    }

    // ── Phase 8: White Transition (0.84→0.97) ──
    if (whiteBg) whiteBg.style.opacity = mapRange(p, 0.84, 0.97, 0, 1);

    // ── Navbar appears at end ──
    if (navbar) {
      navbar.classList.toggle('visible', p > 0.96);
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  // ─────────────────────────────────────────────
  // 6. CITY SELECTOR (Global Identities)
  // ─────────────────────────────────────────────
  const cityData = {
    paris: {
      eyebrow: "L'ORIGINE",
      title:   "Rive Gauche",
      desc:    "Where it all began. The original sanctuary — nestled along the Left Bank, where artists, philosophers, and dreamers transformed coffee into ritual.",
      theme:   "Navy · Copper · Grandeur",
      features: ["Old-world elegance.", "Marble counters.", "Brass details.", "The soul of +33 Paris."],
      cta:     "DISCOVER PARIS",
      bg:      "url('./assets/paris_identity.png')"
    },
    london: {
      eyebrow: "MAYFAIR DISTRICT",
      title:   "London",
      desc:    "Sharp modern confidence wrapped in quiet prestige. Where crimson meets silver in the fog of a rainy Mayfair afternoon.",
      theme:   "Crimson · Silver · Precision",
      features: ["Refined precision.", "Modern luxury.", "Silver accents.", "Quiet prestige."],
      cta:     "EXPLORE LONDON",
      bg:      "url('./assets/london_identity.png')"
    },
    dubai: {
      eyebrow: "DOWNTOWN MAJESTY",
      title:   "Dubai",
      desc:    "Built for those who accept only the extraordinary. Obsidian interiors. Gold light. A sanctuary above the skyline.",
      theme:   "Obsidian · Gold · Majesty",
      features: ["Ultra-premium.", "Dramatic scale.", "Gold lighting.", "Obsidian interiors."],
      cta:     "ENTER DUBAI",
      bg:      "url('./assets/dubai_identity.png')"
    },
    switzerland: {
      eyebrow: "GENEVA ALTITUDE",
      title:   "Switzerland",
      desc:    "Precision elevated to art. At the foot of the Alps, +33 Geneva blends Parisian refinement with Swiss exactitude — where every gram is measured, every cup a masterwork.",
      theme:   "Alpine White · Gold · Precision",
      features: ["Swiss exactitude.", "Alpine refinement.", "Gold accents.", "Measured perfection."],
      cta:     "EXPLORE GENEVA",
      bg:      "url('./assets/switzerland_iconic.png')"
    }
  };

  // Mobile elements
  const miBg      = document.getElementById('mi-bg');
  const miEyebrow = document.getElementById('mi-eyebrow');
  const miTitle   = document.getElementById('mi-title');
  const miDesc    = document.getElementById('mi-desc');
  const miTheme   = document.getElementById('mi-theme');
  const miCta     = document.getElementById('mi-cta');
  const miThumbs  = document.getElementById('mi-thumbs-container');
  const miBox     = document.querySelector('.mi-left-box');

  // Desktop elements
  const diBg       = document.getElementById('di-bg');
  const diEyebrow  = document.getElementById('di-eyebrow');
  const diTitle    = document.getElementById('di-title');
  const diDesc     = document.getElementById('di-desc');
  const diFeatures = document.getElementById('di-features');
  const diCta      = document.getElementById('di-cta');
  const diNavItems = document.querySelectorAll('.di-nav-item');

  let activeCity = 'paris';

  function renderThumbs(activeKey) {
    if (!miThumbs) return;
    miThumbs.innerHTML = '';
    Object.keys(cityData).forEach(key => {
      if (key === activeKey) return;
      const d = cityData[key];
      const thumb = document.createElement('div');
      thumb.className = 'mi-thumb';
      thumb.innerHTML = `<div class="mi-thumb-img" style="background:${d.bg}; background-size:cover; background-position:center;"></div>`;
      thumb.addEventListener('click', () => switchCity(key));
      miThumbs.appendChild(thumb);
    });
  }

  function renderFeatures(features) {
    if (!diFeatures) return;
    const icons = [
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`
    ];
    diFeatures.innerHTML = features.map((f, i) => `
      <div class="di-feature-item">
        <div class="di-feature-icon">${icons[i % icons.length]}</div>
        <span>${f}</span>
      </div>
    `).join('');
  }

  function switchCity(key) {
    if (key === activeCity) return;
    activeCity = key;
    const d = cityData[key];
    if (!d) return;

    // Mobile cinematic fade transition
    if (miBg) {
      gsap.to(miBg, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => {
        miBg.style.background = d.bg;
        miBg.style.backgroundSize = 'cover';
        miBg.style.backgroundPosition = 'center';
        gsap.to(miBg, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      }});
    }

    // Desktop cinematic fade transition
    if (diBg) {
      gsap.to(diBg, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => {
        diBg.style.backgroundImage = d.bg;
        diBg.style.backgroundSize = 'cover';
        diBg.style.backgroundPosition = 'center';
        gsap.to(diBg, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      }});
    }

    // Stagger text update Mobile
    const targetsMi = [miEyebrow, miTitle, miDesc, miTheme, miCta];
    gsap.to(targetsMi, { opacity: 0, y: -10, duration: 0.25, stagger: 0.04, ease: 'power2.in', onComplete: () => {
      if (miEyebrow) miEyebrow.textContent = d.eyebrow;
      if (miTitle) {
        miTitle.textContent = d.title;
        miTitle.dataset.city = key;
      }
      if (miDesc)    miDesc.textContent    = d.desc;
      if (miTheme)   miTheme.textContent   = d.theme;
      if (miCta)     miCta.textContent     = d.cta;
      gsap.to(targetsMi, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
    }});

    // Stagger text update Desktop
    const targetsDi = [diEyebrow, diTitle, diDesc, diFeatures, diCta];
    gsap.to(targetsDi, { opacity: 0, y: -10, duration: 0.25, stagger: 0.04, ease: 'power2.in', onComplete: () => {
      if (diEyebrow) diEyebrow.textContent = d.eyebrow;
      if (diTitle) {
        diTitle.textContent = d.title;
        diTitle.dataset.city = key;
      }
      if (diDesc)    diDesc.textContent    = d.desc;
      if (diCta)     diCta.querySelector('span').textContent = d.cta;
      renderFeatures(d.features);
      gsap.to(targetsDi, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
    }});

    // Update desktop nav
    if (diNavItems) {
      diNavItems.forEach(item => {
        item.classList.toggle('active', item.dataset.city === key);
      });
    }

    renderThumbs(key);
    requestAnimationFrame(applyMobileCut);
  }

  function applyMobileCut() {
    if (!miTitle || !miBox) return;
    const boxRect   = miBox.getBoundingClientRect();
    const titleRect = miTitle.getBoundingClientRect();
    if (!boxRect.width) return;

    const cutX   = titleRect.right - boxRect.left;
    const cutPct = Math.min(((cutX / boxRect.width) * 100), 92);
    const cutH   = 56;

    miBox.style.clipPath = `polygon(0 0, ${cutPct}% 0, 100% ${cutH}px, 100% 100%, 0 100%)`;
  }

  // Initialize
  if (miTitle) miTitle.dataset.city = 'paris';
  if (diTitle) diTitle.dataset.city = 'paris';
  renderThumbs('paris');
  renderFeatures(cityData['paris'].features);
  requestAnimationFrame(applyMobileCut);
  window.addEventListener('resize', applyMobileCut, { passive: true });

  if (diNavItems) {
    diNavItems.forEach(item => item.addEventListener('click', () => switchCity(item.dataset.city)));
  }

  // GSAP ScrollTrigger entrance for identities section
  gsap.from('.identities-header', {
    scrollTrigger: { trigger: '#identities-section', start: 'top 80%' },
    opacity: 0, y: 50, duration: 1.2, ease: 'power3.out'
  });
  gsap.from('.mi-card', {
    scrollTrigger: { trigger: '.mi-card', start: 'top 85%' },
    opacity: 0, y: 60, duration: 1.4, ease: 'power3.out', delay: 0.2
  });

  // GSAP ScrollTrigger entrance for franchise section
  gsap.from('.franchise-text', {
    scrollTrigger: { trigger: '#franchise-section', start: 'top 75%' },
    opacity: 0, x: -60, duration: 1.3, ease: 'power3.out'
  });
  gsap.from('.franchise-visual', {
    scrollTrigger: { trigger: '#franchise-section', start: 'top 75%' },
    opacity: 0, x: 60, duration: 1.3, ease: 'power3.out', delay: 0.15
  });

  // ─────────────────────────────────────────────
  // 7. COFFEE PHILOSOPHY SCROLL REVEAL
  // ─────────────────────────────────────────────
  const cpPanels = document.querySelectorAll('.cp-panel');
  cpPanels.forEach((panel) => {
    const isImgLeft = panel.classList.contains('cp-panel--img-left');
    const textSide  = panel.querySelector('.cp-panel__text');
    const imgSide   = panel.querySelector('.cp-panel__visual');

    // Panel Entrance
    gsap.to(panel, {
      scrollTrigger: {
        trigger: panel,
        start: "top 80%",
        onEnter: () => panel.classList.add('is-visible')
      }
    });

    // Individual Side Animations (Directional)
    gsap.from(textSide, {
      scrollTrigger: { trigger: panel, start: "top 85%" },
      x: isImgLeft ? 100 : -100,
      opacity: 0,
      duration: 1.5,
      ease: "expo.out"
    });

    gsap.from(imgSide, {
      scrollTrigger: { trigger: panel, start: "top 85%" },
      x: isImgLeft ? -100 : 100,
      opacity: 0,
      duration: 1.5,
      ease: "expo.out",
      delay: 0.1
    });

    // Staggered Text Children
    const children = textSide.querySelectorAll('span, h3, p, .cp-panel__stats');
    gsap.from(children, {
      scrollTrigger: { trigger: panel, start: "top 80%" },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.3
    });
  });

}

