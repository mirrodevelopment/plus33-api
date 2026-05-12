import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/franchise.css';

export function mountFranchisePage() {
    gsap.registerPlugin(ScrollTrigger);

    // Entrance animations
    gsap.from('.franchise-hero__content h1', {
        y: 40,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
    });

    gsap.from('.reveal', {
        scrollTrigger: {
            trigger: '.reveal',
            start: 'top 85%'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Stats counting animation
    const stats = document.querySelectorAll('.franchise-stats__val[data-target]');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        gsap.to(stat, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: '.franchise-stats',
                start: 'top 90%'
            }
        });
    });

    // Form handling
    const form = document.getElementById('franchise-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'SENDING...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'APPLICATION SENT';
                btn.style.background = 'var(--gold)';
                form.reset();
            }, 1500);
        });
    }

    // FAQ Accordion
    const faqs = document.querySelectorAll('.faq-question');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const parent = faq.parentElement;
            // Close others
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== parent) item.classList.remove('active');
            });
            parent.classList.toggle('active');
        });
    });
}
