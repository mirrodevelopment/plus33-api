import { initNavbar } from './navbar.js';
import { Router } from './router.js';

// Force Vite to process and bundle all assets inside the assets folder
// so they are available to raw HTML templates in production without hashes.
import.meta.glob('../assets/img/*.{png,jpg,jpeg,svg,gif}', { eager: true });
import.meta.glob('../assets/video/*.{mp4,webm,ogg}', { eager: true });
import.meta.glob('../assets/fonts/*.{woff,woff2,ttf,otf,eot}', { eager: true });
import.meta.glob('../assets/icons/*.{svg,png}', { eager: true });

import '../css/navbar.css';
import '../css/footer.css';
import '../css/buttons.css';
import '../css/cards.css';

document.addEventListener('DOMContentLoaded', () => {
    console.log('+33 App Initialized');
    initNavbar();
    
    // Initialize SPA Router
    new Router();
});
