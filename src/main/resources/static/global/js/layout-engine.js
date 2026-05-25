/**
 * FILE: fragment.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Interactive behaviors for layout shells and sticky components.
 *
 * RESPONSIBILITIES:
 * - Controls the mobile side drawer navigation panel expansion.
 * - Handles body scrolling lock/unlock scrollbar compensation.
 * - Implements smart scrolling header updates (reveals solid backgrounds, hides on scroll down).
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

/**
 * Initializes the layout's interactive navigation controllers, bindings, and scroll behaviors.
 * @returns {void}
 */
export function initNavbar() {
    // ═════════ DOM REFERENCES ═════════
    const nav = document.getElementById('plus33-nav');
    const toggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const close = document.getElementById('menu-close');

    if (!toggle || !sideMenu) return;

    // ═════════ EVENT LISTENERS ═════════

    // Open side panel drawer and lock viewport scroll
    toggle.addEventListener('click', () => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        document.body.style.overflow = 'hidden';
        sideMenu.classList.add('plus33-nav__panel--open');
        toggle.setAttribute('aria-expanded', 'true');
        sideMenu.setAttribute('aria-hidden', 'false');
    });

    // Close side panel drawer and release scroll lock
    const closeMenu = () => {
        sideMenu.classList.remove('plus33-nav__panel--open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        toggle.setAttribute('aria-expanded', 'false');
        sideMenu.setAttribute('aria-hidden', 'true');
    };

    if (close) close.addEventListener('click', closeMenu);

    // Close panel when any navigation link is clicked
    sideMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Smart Scroll: Solid background toggles and sliding hide/show transitions
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add solid background after 80px
        if (currentScrollY > 80) {
            nav.classList.add('plus33-nav--solid');
        } else {
            nav.classList.remove('plus33-nav--solid');
        }

        // Smart hide/show (only after 200px to avoid jitter)
        if (currentScrollY > 200) {
            if (currentScrollY > lastScrollY) {
                nav.classList.add('plus33-nav--hidden');    // scrolling down → hide
            } else {
                nav.classList.remove('plus33-nav--hidden'); // scrolling up → show
            }
        } else {
            nav.classList.remove('plus33-nav--hidden');     // near top → always show
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}
