/**
 * FILE: app.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Main bootstrapper and application entry point for the PLUS33 SPA.
 *
 * RESPONSIBILITIES:
 * - Listens for DOMContentLoaded events to safely initialize core handlers.
 * - Triggers global components (navbar panel toggles and scroll listeners).
 * - Spawns and starts the routing system engine.
 *
 * ARCHITECTURE NOTES:
 * - Bootstraps the application dependencies in modular sequence: fragment layout -> router engine.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * LAST UPDATED : 2026-05-23
 * ══════════════════════════════════════════════════
 */

// ═════════ GLOBAL CONFIGURATION ═════════
import { initNavbar } from './fragment.js';
import { Router } from './router.js';

// ═════════ INITIALIZATION ═════════
document.addEventListener('DOMContentLoaded', () => {
    console.log('+33 Paris | App Initialized');
    initNavbar();
    new Router();
});
