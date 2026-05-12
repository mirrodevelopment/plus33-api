import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountHomePage } from './home.js';
import { mountStorePage } from './store.js';
import { mountFranchisePage } from './franchise.js';
import { mountJournalPage } from './journal.js';

import homeHtml from '../html/home.html?raw';
import storeHtml from '../html/store.html?raw';
import journalHtml from '../html/journal.html?raw';
import franchiseHtml from '../html/franchise.html?raw';

const routes = {
    '/': {
        html: homeHtml,
        mount: mountHomePage,
        title: '+33 Paris | Luxury Café'
    },
    '/store': {
        html: storeHtml,
        mount: mountStorePage,
        title: '+33 Store | Luxury Collection'
    },
    '/journal': {
        html: journalHtml,
        mount: mountJournalPage,
        title: '+33 Journal'
    },
    '/franchise': {
        html: franchiseHtml,
        mount: mountFranchisePage,
        title: '+33 Franchise'
    }
};

export class Router {
    constructor() {
        this.app = document.getElementById('app');
        this.isTransitioning = false;
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')?.startsWith('/')) {
                // Ignore external links or non-internal paths
                const href = link.getAttribute('href');
                if (href.startsWith('http') || href.startsWith('//')) return;
                
                e.preventDefault();
                this.navigate(href);
            }
        });

        this.handleRoute();
    }

    async navigate(path) {
        if (window.location.pathname === path || this.isTransitioning) return;
        window.history.pushState({}, '', path);
        await this.handleRoute();
    }

    async handleRoute() {
        this.isTransitioning = true;
        const path = window.location.pathname;
        const route = routes[path] || routes['/'];

        // 1. Cinematic Fade Out
        if (this.app.children.length > 0) {
            await gsap.to(this.app, { opacity: 0, duration: 0.4, ease: 'power2.inOut' });
        }

        // 2. Cleanup old animations
        if (window.ScrollTrigger) {
            const allTriggers = ScrollTrigger.getAll();
            allTriggers.forEach(t => t.kill());
        }

        try {
            this.app.innerHTML = route.html;
            document.title = route.title;

            this.updateNavbar(path);

            // 3. Cinematic Fade In
            gsap.set(this.app, { opacity: 0 });
            
            if (route.mount) {
                route.mount();
            }

            await gsap.to(this.app, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 });

            window.scrollTo(0, 0);

        } catch (err) {
            console.error('Router Error:', err);
            this.app.innerHTML = '<div class="container" style="padding: 100px 0;"><h1>404</h1><p>The sanctuary you seek has moved.</p></div>';
            gsap.to(this.app, { opacity: 1, duration: 0.4 });
        } finally {
            this.isTransitioning = false;
        }
    }

    updateNavbar(path) {
        const links = document.querySelectorAll('.plus33-nav__panel-link');
        links.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === path);
        });
    }
}
