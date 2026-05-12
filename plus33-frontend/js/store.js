import '../css/store.css';

export function mountStorePage() {
  const PRODUCTS = [
    {
      id: 1, name: 'Le Grand Cru', origin: 'Ethiopia Yirgacheffe', notes: 'Jasmine, Bergamot, Dark Chocolate',
      desc: 'Our signature espresso. Cultivated at 2,000 meters. Roasted in Paris.', price: '€38', type: 'Beans — 250g',
      img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=85', tag: 'Signature'
    },
    {
      id: 2, name: 'The Ritual Set', origin: 'Paris / Limoges', notes: 'Matte Black Porcelain, Copper Details',
      desc: 'Two espresso cups and saucers. Designed in our studio, crafted in Limoges.', price: '€85', type: 'Object',
      img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=85'
    },
    {
      id: 3, name: 'L\'Édition Printemps', origin: 'Colombia Finca El Paraiso', notes: 'Wild Strawberry, Rose, Vanilla',
      desc: 'A rare thermal shock processing. Extremely limited availability.', price: '€55', type: 'Beans — 250g',
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=85', tag: 'Limited — 1/500'
    },
    {
      id: 4, name: 'Copper Drip Stand', origin: 'London', notes: 'Solid Copper, Walnut Base',
      desc: 'Engineered for thermal stability. Machined from solid copper.', price: '€240', type: 'Equipment',
      img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=85'
    },
    {
      id: 5, name: 'Le Noir', origin: 'Guatemala Antigua', notes: 'Cacao Nibs, Black Cherry, Cedar',
      desc: 'Developed for milk beverages. A deep, resonant profile.', price: '€34', type: 'Beans — 250g',
      img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=85'
    },
    {
      id: 6, name: '+33 Tote', origin: 'Paris', notes: 'Heavyweight Cotton Canvas',
      desc: 'The only bag we carry. Screen printed in the Marais.', price: '€45', type: 'Merchandise',
      img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=85'
    }
  ];

  const grid = document.getElementById('store-grid');
  const filtersContainer = document.getElementById('store-filters');
  
  function renderProducts(filter) {
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = PRODUCTS.filter(p => filter === 'All' || p.type.includes(filter));
    
    filtered.forEach((p, i) => {
      const div = document.createElement('div');
      // Using reveal classes for immediate animation trigger when appended
      div.className = `store-card reveal reveal-${(i % 3) + 2}`;
      // Force play state since they might be added dynamically
      div.style.animationPlayState = 'running';
      
      div.innerHTML = `
        <div class="store-card__img">
          <img src="${p.img}" alt="${p.name}" />
          ${p.tag ? `<div class="store-card__badge">${p.tag}</div>` : ''}
          <div class="store-card__overlay">
            <button class="btn btn-copper store-card__add">Add to Cart</button>
          </div>
        </div>
        <div class="store-card__body">
          <div class="store-card__header">
            <h3 class="store-card__title">${p.name}</h3>
            <span class="store-card__price">${p.price}</span>
          </div>
          <span class="t-label" style="opacity: 0.5; display: block; margin: 4px 0 12px;">${p.type}</span>
          <p class="store-card__desc t-body">${p.desc}</p>
          <div class="store-card__meta">
            <div class="store-card__meta-item">
              <span class="store-card__meta-key">Origin / Design</span>
              <span class="store-card__meta-val">${p.origin}</span>
            </div>
            <div class="store-card__meta-item">
              <span class="store-card__meta-key">Profile</span>
              <span class="store-card__meta-val">${p.notes}</span>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(div);
    });
  }

  const categories = ['All', 'Beans', 'Object', 'Equipment', 'Merchandise'];
  let currentFilter = 'All';

  if (filtersContainer) {
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `store__filter-btn ${currentFilter === cat ? 'store__filter-btn--active' : ''}`;
      btn.innerHTML = `
        <span class="store__filter-dot"></span>
        ${cat === 'All' ? 'Full Collection' : cat}
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.store__filter-btn').forEach(b => b.classList.remove('store__filter-btn--active'));
        btn.classList.add('store__filter-btn--active');
        currentFilter = cat;
        renderProducts(currentFilter);
      });
      filtersContainer.appendChild(btn);
    });
  }

  renderProducts('All');
}
