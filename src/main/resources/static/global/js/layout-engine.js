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

// ═════════ LEGAL MODAL CONTENT ═════════
const PRIVACY_POLICY_HTML = `
    <h2>Privacy Policy</h2>
    <p class="last-updated">Last Updated: June 2026</p>
    <p>Welcome to <strong>+33 Paris</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy informs you about how we handle your personal data when you visit our luxury café website, purchase our premium products, or interact with our digital ecosystem.</p>

    <h3>1. Information We Collect</h3>
    <p>We collect personal information to provide you with an exceptional experience. This includes information you provide directly (such as name, email, billing address, and phone number) and automated technical data collected via cookies and site interactions (such as IP address, browser type, and navigation paths).</p>

    <h3>2. How We Use Your Data</h3>
    <p>We use your data to process transactions, manage accounts, personalize content (including AI-driven coffee recommendations), orchestrate animations/transitions, and send notifications regarding special boutique releases or franchise events.</p>

    <h3>3. Data Sharing & Security</h3>
    <p>Your personal data is treated with the highest confidentiality. We do not sell your personal data. Any sharing with third-party service providers (such as payment systems or Cloudinary storage) is done securely under strict data protection protocols.</p>

    <h3>4. Your Rights</h3>
    <p>Under GDPR and local French regulations, you have the right to access, rectify, restrict, or erase your personal data at any time. For requests, please contact our data officer at <a href="mailto:privacy@plus33.paris">privacy@plus33.paris</a>.</p>
`;

const TERMS_OF_SERVICE_HTML = `
    <h2>Terms of Service</h2>
    <p class="last-updated">Last Updated: June 2026</p>
    <p>These Terms of Service govern your access to and use of the <strong>+33 Paris</strong> website, boutique services, and related digital channels. By visiting our site or buying our premium blends, you agree to comply with and be bound by these terms.</p>

    <h3>1. Use of Site and Intellectual Property</h3>
    <p>All content on this website—including brand marks, high-fidelity imagery, layouts, page transitions, and animations—is the intellectual property of +33 Paris and is protected under global trademark and copyright laws. You may not reproduce or reuse any design elements without explicit permission.</p>

    <h3>2. Products and Orders</h3>
    <p>All products listed in our boutique, including seasonal roasts, pastries, and luxury merchandise, are subject to availability. Prices are listed in Euros (€) and are subject to change. We reserve the right to limit or reject any orders placed via the digital store.</p>

    <h3>3. Limitation of Liability</h3>
    <p>+33 Paris provides this site and its boutique services on an "as is" basis. While we strive for perfection in our digital experiences and coffee roasts, we make no guarantees of uninterrupted access or completely error-free service.</p>

    <h3>4. Governing Law</h3>
    <p>These terms and any disputes arising from them are governed by and construed in accordance with the laws of France. Any disputes shall be subject to the exclusive jurisdiction of the courts of Paris.</p>
`;

/**
 * Initializes interactive behaviors for footer legal modals (Privacy Policy & Terms of Service).
 * @returns {void}
 */
export function initLegalModals() {
    const privacyLink = document.getElementById('legal-privacy-link');
    const termsLink = document.getElementById('legal-terms-link');
    const modal = document.getElementById('legal-modal');
    const modalContent = document.getElementById('legal-modal-content');

    if (!modal || !modalContent) return;

    const overlay = modal.querySelector('.plus33-modal__overlay');
    const closeBtn = modal.querySelector('.plus33-modal__close');

    const openModal = (htmlContent) => {
        modalContent.innerHTML = htmlContent;
        // Lock body scrolling and account for scrollbar width to prevent shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        document.body.style.overflow = 'hidden';

        modal.classList.add('plus33-modal--open');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modal.classList.remove('plus33-modal--open');
        modal.setAttribute('aria-hidden', 'true');
        // Release scroll lock after transition finishes
        setTimeout(() => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 500); // matches the 0.5s transition duration in CSS
    };

    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(PRIVACY_POLICY_HTML);
        });
    }

    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(TERMS_OF_SERVICE_HTML);
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('plus33-modal--open')) {
            closeModal();
        }
    });
}

