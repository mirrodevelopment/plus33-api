import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/journal.css';

export function mountJournalPage() {
    gsap.registerPlugin(ScrollTrigger);

    const ARTICLES = [
        { id: 1, title: 'The Soil of Ethiopia', category: 'Origin', date: 'May 12, 2024', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=85' },
        { id: 2, title: 'Morning in the 7ème', category: 'Lifestyle', date: 'May 08, 2024', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=85' },
        { id: 3, title: 'The Architecture of Taste', category: 'Design', date: 'April 28, 2024', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=85' }
    ];

    const grid = document.getElementById('journal-grid');
    if (grid) {
        grid.innerHTML = '';
        ARTICLES.forEach((post, i) => {
            const article = document.createElement('article');
            article.className = 'journal-article reveal';
            article.innerHTML = `
                <div class="journal-article__img">
                    <img src="${post.img}" alt="${post.title}" />
                </div>
                <div class="journal-article__content">
                    <span class="t-label">${post.category} · ${post.date}</span>
                    <h3 style="color: var(--cream);">${post.title}</h3>
                    <div class="journal-article__read">
                        <span>Read Story</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                </div>
            `;
            grid.appendChild(article);
        });
    }

    gsap.from('.journal-page__header h1', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    gsap.from('.journal-article', {
        scrollTrigger: {
            trigger: '.journal-page__grid',
            start: 'top 85%'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
    });
}
