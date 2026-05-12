import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/experience.css';

export function mountExperiencePage() {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.getElementById('stage-wrapper');
    const heroBg = document.getElementById('exp-p-bg');
    const heroUi = document.getElementById('exp-hero-ui');
    const outlineWrap = document.getElementById('exp-zoom-logo-wrap');
    const fogLayers = document.querySelectorAll('.exp-fog-layer');
    const veil = document.getElementById('exp-zoom-veil');
    const portal = document.getElementById('exp-gateway-portal');
    const inner = document.getElementById('exp-portal-inner');
    const bloom = document.getElementById('exp-portal-bloom');
    const glass = document.getElementById('exp-alley-glass');
    const text1 = document.getElementById('exp-cinematic-text-1');
    const whiteBg = document.getElementById('exp-white-transition');

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const mapRange = (v, a, b, c, d) => c + clamp((v - a) / (b - a), 0, 1) * (d - c);
    const easeIn3 = t => t * t * t;
    const easeInOut = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    let ticking = false;

    function update() {
        if (!wrapper) { ticking = false; return; }
        const rect = wrapper.getBoundingClientRect();
        const scrollY = -rect.top;
        const maxS = wrapper.offsetHeight - window.innerHeight;

        if (scrollY > maxS + window.innerHeight) { ticking = false; return; }

        const p = clamp(scrollY / maxS, 0, 1);

        if (heroUi) {
            heroUi.style.opacity = mapRange(p, 0, 0.08, 1, 0);
            heroUi.style.transform = `translateY(${p * 160}px)`;
        }

        if (heroBg) {
            const scale = 1 + easeIn3(clamp(p / 0.45, 0, 1)) * 14;
            const blur = mapRange(p, 0.2, 0.4, 0, 3);
            heroBg.style.transform = `scale(${scale})`;
            heroBg.style.filter = `brightness(${mapRange(p, 0, 0.4, 0.55, 0.4)}) contrast(1.1) saturate(0.9) blur(${blur}px)`;
        }

        if (outlineWrap) {
            const show = mapRange(p, 0.05, 0.15, 0, 1);
            const hide = mapRange(p, 0.3, 0.4, 1, 0);
            outlineWrap.style.opacity = Math.min(show, hide);
            const typeScale = 1 + mapRange(p, 0.05, 0.45, 0, 0.4);
            outlineWrap.style.transform = `scale(${typeScale})`;
        }

        fogLayers.forEach((fog, i) => {
            const delay = i * 0.04;
            fog.style.opacity = mapRange(p, 0.08 + delay, 0.3 + delay, 0, 0.9);
            fog.style.transform = `translateY(${mapRange(p, 0.08, 0.45, 20, 0)}%)`;
        });

        if (veil) veil.style.opacity = mapRange(p, 0.25, 0.48, 0, 1);

        if (portal && inner) {
            const pp = clamp((p - 0.45) / 0.25, 0, 1);
            portal.style.opacity = clamp(pp * 5, 0, 1);
            const dim = easeInOut(pp) * 7000;
            portal.style.webkitMaskSize = `${dim}px ${dim}px`;
            portal.style.maskSize = `${dim}px ${dim}px`;
            inner.style.transform = `scale(${1.9 - pp * 0.9})`;
            if (bloom) bloom.style.opacity = mapRange(p, 0.45, 0.58, 0, 1);
        } else if (portal) {
            portal.style.opacity = 0;
            portal.style.webkitMaskSize = '0px 0px';
            portal.style.maskSize = '0px 0px';
        }

        if (glass) glass.style.opacity = mapRange(p, 0.62, 0.7, 0, 1);
        if (text1) {
            const tIn = mapRange(p, 0.65, 0.73, 0, 1);
            const tOut = mapRange(p, 0.8, 0.86, 1, 0);
            const opacity = Math.min(tIn, tOut);
            text1.style.opacity = opacity;
            text1.style.transform = `translateY(${(1 - tIn) * 40}px)`;
            text1.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
        }

        if (whiteBg) whiteBg.style.opacity = mapRange(p, 0.84, 0.97, 0, 1);

        ticking = false;
    }

    function onScroll() {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    // Init Particle system
    const canvas = document.getElementById('exp-particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        for (let i = 0; i < 110; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.8 + 0.3,
                vx: (Math.random() - 0.5) * 0.25,
                vy: -(Math.random() * 0.4 + 0.1),
                opacity: Math.random() * 0.5 + 0.1,
                flicker: Math.random() * Math.PI * 2
            });
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.flicker += 0.04;
                if (p.y < -5 || p.x < -5 || p.x > W + 5) {
                    p.x = Math.random() * W;
                    p.y = H + 5;
                }
                const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.flicker));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(216,154,91,${alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        draw();
    }
}
