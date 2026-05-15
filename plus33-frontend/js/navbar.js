export function initNavbar() {
    const nav = document.getElementById('plus33-nav');
    const toggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const close = document.getElementById('menu-close');

    if (!toggle || !sideMenu) return;

    toggle.addEventListener('click', () => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        document.body.style.overflow = 'hidden';
        sideMenu.classList.add('plus33-nav__panel--open');
    });

    const closeMenu = () => {
        sideMenu.classList.remove('plus33-nav__panel--open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    };

    if (close) close.addEventListener('click', closeMenu);

    // Close on link click
    sideMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Scroll effect: smart header (hide on scroll down, show on scroll up)
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add solid background after 80px
        if (currentScrollY > 80) {
            nav.classList.add('plus33-nav--solid');
        } else {
            nav.classList.remove('plus33-nav--solid');
        }

        // Smart hide/show logic
        if (currentScrollY > 200) { // Only start hiding after some scroll
            if (currentScrollY > lastScrollY) {
                // Scrolling down
                nav.classList.add('plus33-nav--hidden');
            } else {
                // Scrolling up
                nav.classList.remove('plus33-nav--hidden');
            }
        } else {
            // Near top, always show
            nav.classList.remove('plus33-nav--hidden');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}
