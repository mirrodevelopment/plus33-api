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

    // Close side panel drawer and release scroll lock
    const closeMenu = () => {
        sideMenu.classList.remove('plus33-nav__panel--open');
        toggle.classList.remove('plus33-nav__toggle--open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        toggle.setAttribute('aria-expanded', 'false');
        sideMenu.setAttribute('aria-hidden', 'true');
    };

    // Toggle side panel drawer and release/lock viewport scroll
    toggle.addEventListener('click', () => {
        const isOpen = sideMenu.classList.contains('plus33-nav__panel--open');
        if (isOpen) {
            closeMenu();
        } else {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = scrollbarWidth + 'px';
            document.body.style.overflow = 'hidden';
            sideMenu.classList.add('plus33-nav__panel--open');
            toggle.classList.add('plus33-nav__toggle--open');
            toggle.setAttribute('aria-expanded', 'true');
            sideMenu.setAttribute('aria-hidden', 'false');
        }
    });

    if (close) close.addEventListener('click', closeMenu);

    // Close panel when any navigation link is clicked
    sideMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ─── Logo click → scroll to hero ──────────────────────────────────────────
    // Selects both desktop and mobile logo anchors
    const logoLinks = document.querySelectorAll(
        '.plus33-nav__logo--desktop, .plus33-nav__logo--mobile'
    );

    logoLinks.forEach(logo => {
        logo.addEventListener('click', (e) => {
            e.preventDefault();

            const hero = document.getElementById('home-hero');

            if (hero) {
                // Already on home — just smooth-scroll to hero
                hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // On another SPA page — navigate home, then scroll once mounted
                window.plus33Router?.navigate('/');
                // Wait for the page fragment to mount, then scroll
                const waitForHero = setInterval(() => {
                    const h = document.getElementById('home-hero');
                    if (h) {
                        clearInterval(waitForHero);
                        setTimeout(() => h.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
                    }
                }, 50);
            }
        });
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

/**
 * Initializes interactive behaviors for footer legal modals (Privacy Policy & Terms of Service).
 * @returns {void}
 */
export function initLegalModals() {
    const modal = document.getElementById('legal-modal');
    const modalContent = document.getElementById('legal-modal-content');
    const privacyBtn = document.getElementById('legal-privacy-link');
    const termsBtn = document.getElementById('legal-terms-link');

    if (!modal || !modalContent) return;

    const overlay = modal.querySelector('.plus33-modal__overlay');
    const closeBtn = modal.querySelector('.plus33-modal__close');

    const PRIVACY_POLICY_HTML = `
        <h2>Privacy Policy</h2>
        <p class="last-updated">Last Updated: June 2026</p>
        <p>Welcome to <strong>+33 Paris</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy informs you about how we handle your personal data when you visit our luxury café website, purchase our premium products, or interact with our digital ecosystem.</p>
        
        <h3>1. Information We Collect</h3>
        <p>We collect personal information to provide you with an exceptional experience. This includes information you provide directly (such as name, email, billing address, and phone number) and automated technical data collected via cookies and site interactions (such as IP address, browser type, and navigation paths).</p>
        
        <h3>2. How We Use Your Information</h3>
        <p>Your data is used to process orders, fulfill boutique services, manage account preferences, send curated brand communication, and optimize digital application performance.</p>
        
        <h3>3. Data Sharing & Security</h3>
        <p>Your personal data is treated with the highest confidentiality. We do not sell your personal data. Any sharing with third-party service providers (such as payment systems or Cloudinary storage) is done securely under strict data protection protocols.</p>
        
        <h3>4. Your Rights</h3>
        <p>Under GDPR and local French regulations, you have the right to access, rectify, restrict, or erase your personal data at any time. For requests, please contact our data officer at <a href="mailto:plus33coffee@gmail.com">plus33coffee@gmail.com</a>.</p>

    `;

    const TERMS_OF_SERVICE_HTML = `
        <h2>Terms of Service</h2>
        <p class="last-updated">Last Updated: June 2026</p>
        <p>These Terms of Service govern your access to and use of the <strong>+33 Paris</strong> website, boutique services, and related digital channels. By visiting our site or buying our premium blends, you agree to comply with and be bound by these terms.</p>
        
        <h3>1. Boutique Operations & Purchases</h3>
        <p>All product purchases through our digital store are subject to availability and confirmation of order price. Prices are displayed in Euros (€) and include applicable taxes unless stated otherwise.</p>
        
        <h3>2. Intellectual Property</h3>
        <p>All content included on this platform, such as text, graphics, logos, images, audio clips, digital downloads, and data compilations, is the exclusive property of +33 Paris and protected by international copyright laws.</p>
        
        <h3>3. User Conduct</h3>
        <p>Users agree not to misuse this website, introduce malicious software, or attempt unauthorized access to our administrative systems or user databases.</p>
        
        <h3>4. Governing Law</h3>
        <p>These terms are governed by and construed in accordance with the laws of France. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Paris.</p>
    `;

    const openModal = (htmlContent) => {
        modalContent.innerHTML = htmlContent;
        modal.classList.add('plus33-modal--open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('plus33-modal--open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (privacyBtn) {
        privacyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(PRIVACY_POLICY_HTML);
        });
    }

    if (termsBtn) {
        termsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(TERMS_OF_SERVICE_HTML);
        });
    }

    if (overlay) overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
}
