/**
 * FILE: store.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Controller for the boutique product store.
 *
 * RESPONSIBILITIES:
 * - Registers product objects (coffee beans, equipment, merchandise).
 * - Appends custom category filtering controls inside the sidebar.
 * - Handles filtering logic and redraws grids with scale entrance effects.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * LAST UPDATED : 2026-05-23
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the boutique store interactive components and lists products.
 * @returns {void}
 */
export function mountStorePage() {
  // ═════════ PRODUCT COLLECTION DATA ═════════
  const PRODUCTS = [
    {
      id: 1, name: 'Le Grand Cru', origin: 'Ethiopia Yirgacheffe', notes: 'Jasmine, Bergamot, Dark Chocolate',
      desc: 'Our signature espresso. Cultivated at 2,000 meters. Roasted in Paris.', price: '€38', type: 'Beans — 250g',
      img: '/assets/img/Cinnamon.png', tag: 'Signature'
    },
    {
      id: 2, name: 'The Ritual Set', origin: 'Paris / Limoges', notes: 'Matte Black Porcelain, Copper Details',
      desc: 'Two espresso cups and saucers. Designed in our studio, crafted in Limoges.', price: '€85', type: 'Object',
      img: '/assets/img/gift pack.jpeg'
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
      img: '/assets/img/Dark Roast.png'
    },
    {
      id: 6, name: '+33 Tote', origin: 'Paris', notes: 'Heavyweight Cotton Canvas',
      desc: 'The only bag we carry. Screen printed in the Marais.', price: '€45', type: 'Merchandise',
      img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=85'
    },
    {
      id: 7, name: 'Ceremonial Matcha', origin: 'Uji, Japan', notes: 'Sweet Umami, Creamy Jade, Fresh Grass',
      desc: 'Bespoke ceremonial grade stone-ground green tea powder, sourced from historical estates in Kyoto.', price: '€48', type: 'Tea — 100g',
      img: '/assets/img/tea powder.jpeg', tag: 'Bespoke'
    },
    {
      id: 8, name: 'The Prestige Edition', origin: 'Panama Geisha micro-lot', notes: 'Bergamot, Peach Blossom, Candied Ginger',
      desc: 'An exceptional lot of Panama Geisha. Lightly roasted to highlight absolute floral clarity.', price: '€120', type: 'Beans — 250g',
      img: '/assets/img/The Prestige Edition.png', tag: 'Prestige'
    }
  ];

  // DOM References
  const grid = document.getElementById('store-grid');
  const filtersContainer = document.getElementById('store-filters');
  
  // ═════════ RENDERING LOGIC ═════════
  /**
   * Filters and renders the product list on the canvas grid.
   * @param {string} filter - Selected category filter.
   */
  function renderProducts(filter) {
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = PRODUCTS.filter(p => filter === 'All' || p.type.includes(filter));
    
    filtered.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = `store-card reveal reveal-${(i % 3) + 2}`;
      div.style.animationPlayState = 'running';
      div.setAttribute('aria-label', `Product: ${p.name}`);
      
      div.innerHTML = `
        <div class="store-card__img">
          <img src="${p.img}" alt="${p.name} product image" />
          ${p.tag ? `<div class="store-card__badge">${p.tag}</div>` : ''}
          <div class="store-card__overlay">
            <button class="btn btn-copper store-card__add" aria-label="Add ${p.name} to cart">Add to Cart</button>
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

  // ═════════ CATEGORY FILTERS ═════════
  const categories = ['All', 'Beans', 'Tea', 'Object', 'Equipment', 'Merchandise'];
  let currentFilter = 'All';

  if (filtersContainer) {
    filtersContainer.innerHTML = ''; // Prevent duplication
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `store__filter-btn ${currentFilter === cat ? 'store__filter-btn--active' : ''}`;
      btn.setAttribute('aria-pressed', currentFilter === cat ? 'true' : 'false');
      btn.innerHTML = `
        <span class="store__filter-dot"></span>
        ${cat === 'All' ? 'Full Collection' : cat}
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.store__filter-btn').forEach(b => {
          b.classList.remove('store__filter-btn--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('store__filter-btn--active');
        btn.setAttribute('aria-pressed', 'true');
        currentFilter = cat;
        renderProducts(currentFilter);
      });
      filtersContainer.appendChild(btn);
    });
  }

  renderProducts('All');
}
