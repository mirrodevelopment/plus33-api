/**
 * FILE: router.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Client-side Single Page Application (SPA) routing engine for PLUS33.
 *
 * RESPONSIBILITIES:
 * - Directs address bar changes to resolve and fetch corresponding HTML fragments.
 * - Handles navigation animations, view swaps, and dynamic title updates.
 * - Triggers controller mount hooks to initialize pages.
 * - Performs resource cleanups (such as killing active GSAP ScrollTriggers) to prevent memory leaks.
 *
 * LIFECYCLE MANAGEMENT:
 * - Dynamic route changes undergo three phases:
 *   1. Cinematic Fade Out: Opacity of `#app` is reduced to 0.
 *   2. Teardown: Kills all active ScrollTriggers to release memory and event bindings.
 *   3. Mount & Fade In: Renders the new HTML template, calls `route.mount()`, resets scroll position, and fades the container back in.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

// ═════════ GLOBAL CONFIGURATION ═════════
import { mountHomePage } from './home.js';
import { mountStorePage } from './store.js';
import { mountRewardsPage } from '../global/rewards/js/rewards.js';
import { mountAboutPage } from '../global/about/js/about.js';
import { mountJournalPage } from '../global/journal/js/journal.js';
import { mountFranchisePage } from '../global/js/franchise.js';
import { mountFindUsPage } from '../global/js/find-us.js';

/**
 * Static route registry containing paths, fragments, mounts, and page titles.
 * @type {Object.<string, {htmlPath: string, mount: Function, title: string, html?: string}>}
 */
const routes = {
    '/': {
        htmlPath: '/html/home.html',
        mount: mountHomePage,
        title: '+33 Paris | Luxury Café'
    },
    '/store': {
        htmlPath: '/html/store.html',
        mount: mountStorePage,
        title: '+33 Store | Luxury Collection'
    },
    '/rewards': {
        htmlPath: '/global/rewards/html/rewards.html',
        mount: mountRewardsPage,
        title: '+33 Society Rewards | Loyalty & Perks'
    },
    '/about': {
        htmlPath: '/global/about/html/about.html',
        mount: mountAboutPage,
        title: '+33 Heritage & Philosophy | About Us'
    },
    '/journal': {
        htmlPath: '/global/journal/html/journal.html',
        mount: mountJournalPage,
        title: '+33 Journal | Dispatches from the Craft'
    },
    '/franchise': {
        htmlPath: '/global/html/franchise.html',
        mount: mountFranchisePage,
        title: '+33 Franchise'
    },
    '/find-us': {
        htmlPath: '/global/html/find-us.html',
        mount: mountFindUsPage,
        title: '+33 Destinations | Find Us'
    }
};

/**
 * Client-side routing engine managing SPA lifecycles.
 */
export class Router {
    /**
     * Initializes the router and references the main mount node.
     */
    constructor() {
        // Disable browser automatic scroll restoration to prevent scroll jumps on page refresh/navigation
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // ═════════ DOM REFERENCES ═════════
        this.app = document.getElementById('app');
        this.isTransitioning = false;
        this.activeCleanup = null;

        // ═════════ INITIALIZATION ═════════
        this.init();
    }

    /**
     * Binds history popstate triggers and hijack click listeners on internal links.
     * @returns {void}
     */
    init() {
        // ═════════ EVENT LISTENERS ═════════
        window.addEventListener('popstate', () => this.handleRoute());
        
        document.addEventListener('click', (e) => {
            // Logo click navigation behavior
            const logo = e.target.closest('.plus33-nav__logo');
            if (logo) {
                e.preventDefault();
                if (window.location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    this.navigate('/');
                }
                return;
            }

            const link = e.target.closest('a');
            if (link && link.getAttribute('href')?.startsWith('/')) {
                // Ignore download links
                if (link.hasAttribute('download')) return;

                // Ignore external links or non-internal paths
                const href = link.getAttribute('href');
                if (href.startsWith('http') || href.startsWith('//')) return;
                
                e.preventDefault();
                this.navigate(href);
            }
        });

        this.handleRoute();
    }

    /**
     * Updates pushState history and triggers route handler.
     * @param {string} path - Target URL path to navigate to.
     * @returns {Promise<void>}
     */
    async navigate(path) {
        if (window.location.pathname === path || this.isTransitioning) return;
        window.history.pushState({}, '', path);
        await this.handleRoute();
    }

    /**
     * Runs cinematic transition, performs cleanup teardown, and mounts new page templates.
     * @returns {Promise<void>}
     */
    async handleRoute() {
        this.isTransitioning = true;
        const path = window.location.pathname;
        const route = routes[path] || routes['/'];

        try {
            // 1. Fetch fresh HTML fragment dynamically
            try {
                const response = await fetch(route.htmlPath, { cache: 'no-cache' });
                if (response.ok) {
                    route.html = await response.text();
                }
            } catch (fetchErr) {
                console.warn('Failed to fetch fresh route HTML, using cached version:', fetchErr);
            }
            if (!route.html) {
                throw new Error(`Route HTML unavailable for path: ${route.htmlPath}`);
            }

            // 2. Cinematic Fade Out the current page now that the content is resolved
            if (this.app.children.length > 0) {
                await gsap.to(this.app, { opacity: 0, duration: 0.35, ease: 'power2.inOut' });
            }

            // 3. Run active page cleanup callback to prevent memory leaks
            if (this.activeCleanup) {
                try {
                    this.activeCleanup();
                } catch (cleanupErr) {
                    console.error('Teardown Cleanup Error:', cleanupErr);
                }
                this.activeCleanup = null;
            }

            // 4. Teardown old ScrollTriggers
            if (window.ScrollTrigger) {
                const allTriggers = ScrollTrigger.getAll();
                allTriggers.forEach(t => t.kill());
            }

            // 5. Mount & Fade In the new page template
            this.app.innerHTML = route.html;
            document.title = route.title;
            window.scrollTo(0, 0);
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
            });

            this.updateNavbar(path);

            gsap.set(this.app, { opacity: 0 });
            
            if (route.mount) {
                this.activeCleanup = route.mount();
            }

            await gsap.to(this.app, { opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.05 });

        } catch (err) {
            console.error('Router Error:', err);
            this.app.innerHTML = '<div class="container" style="padding: 100px 0;"><h1>404</h1><p>The sanctuary you seek has moved.</p></div>';
            gsap.to(this.app, { opacity: 1, duration: 0.4 });
        } finally {
            this.isTransitioning = false;
        }
    }

    /**
     * Highlights active navigation elements by class toggle.
     * @param {string} path - The current route path.
     * @returns {void}
     */
    updateNavbar(path) {
        const links = document.querySelectorAll('.plus33-nav__panel-link, .plus33-nav__link');
        links.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === path);
        });
    }
}
