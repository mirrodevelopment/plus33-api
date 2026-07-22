/**
 * FILE: store.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Controller for the boutique product store.
 *
 * RESPONSIBILITIES:
 * - Registers product objects from /global/product collection.
 * - Appends custom category filtering controls inside the sidebar.
 * - Handles filtering logic and redraws grids with entrance animations.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the boutique store interactive components and lists products.
 * @returns {void}
 */
export function mountStorePage() {
  // ═════════ PRODUCT COLLECTION DATA ═════════
  const PRODUCTS = [
    // ── HOT COFFEE ──
    {
      id: 1, name: 'Café Filtre', origin: 'Kenya Nyeri Wash-Lot', notes: 'Light, Filter Drip, Red Currant',
      desc: 'A traditional hand-poured filter drip bag highlighting clean single-origin nuances. Slow-brewed for cup clarity.', price: '€6.00', type: 'Hot Coffee',
      img: '/global/product/drinks/hot-coffee/cafe-filtre.png', tag: 'Single Origin'
    },
    {
      id: 2, name: 'Cappuccino', origin: 'Organic Blend · In-Salon', notes: 'Rich & Velvety, Double Espresso',
      desc: 'Expertly steamed milk poured over a rich double espresso base, creating a thick, luxurious blanket of microfoam.', price: '€6.50', type: 'Hot Coffee',
      img: '/global/product/drinks/hot-coffee/cappuccino.png', tag: 'Best Seller'
    },
    {
      id: 3, name: 'Latte / Flat White', origin: 'Brazilian Cerrado · In-Salon', notes: 'Smooth & Creamy, Ristretto',
      desc: 'Your choice between our smooth Caffè Latte or the bolder Flat White crafted with ristretto extraction.', price: '€6.80', type: 'Hot Coffee',
      img: '/global/product/drinks/hot-coffee/latte-flat-white.jpg', tag: 'Atelier Standard'
    },
    {
      id: 4, name: 'Chai Latte', origin: 'Nilgiri Tea & Spices', notes: 'Masala Spices, Oat Milk, Cardamom',
      desc: 'An elegant infusion of slow-brewed black tea leaves, crushed cardamoms, cinnamon, and wild ginger with oat milk.', price: '€7.00', type: 'Hot Coffee',
      img: '/global/product/drinks/hot-coffee/chai-latte.png', tag: 'House Specialty'
    },
    {
      id: 5, name: 'Pumpkin Latte', origin: 'Atelier Blend · In-Salon', notes: 'Pumpkin Coulis, Nutmeg, Vanilla',
      desc: 'A refined autumnal luxury. Double shot of specialty espresso combined with slow-simmered pumpkin coulis.', price: '€7.50', type: 'Hot Coffee',
      img: '/global/product/drinks/hot-coffee/pumpkin-latte.jpg', tag: 'Autumn Special'
    },
    {
      id: 6, name: 'Ceremonial Matcha', origin: 'Uji, Kyoto, Japan', notes: 'Kyoto Origin, Umami, Spring Harvest',
      desc: 'Stone-ground spring tencha leaves from Uji, Kyoto. Traditional bamboo-whisked preparation delivering emerald green color.', price: '€7.20', type: 'Hot Coffee',
      img: '/global/product/drinks/matcha.jpeg', tag: 'Ceremonial Grade'
    },

    // ── ICED COFFEE & DRINKS ──
    {
      id: 7, name: 'Matcha Vanille', origin: 'Kyoto & Madagascar', notes: 'Vanilla Nectar, Ceremonial Uji',
      desc: 'A luxurious layered creation pairing whisked Ceremonial Uji Matcha with organic Madagascar vanilla bean nectar.', price: '€7.50', type: 'Iced Coffee',
      img: '/global/product/drinks/iced-coffee/matcha-vanille.jpg', tag: 'Pastry Lab Blend'
    },
    {
      id: 8, name: 'Thé Glacé d\'Hiver', origin: 'Provence Blend · Cold Steeped', notes: 'Cold Steeped, Forest Berries',
      desc: 'Winter Iced Tea — A delicate, 12-hour cold-steeped botanical infusion featuring wild forest berries and elderflower.', price: '€7.00', type: 'Iced Coffee',
      img: '/global/product/drinks/iced-coffee/the-glace-dhiver.png', tag: 'Botanical Brew'
    },
    {
      id: 9, name: 'Iced Punch Coco', origin: 'Tropical Sourced · Iced', notes: 'Coconut Water, Lime Splash',
      desc: 'An ultra-refreshing Parisian-tropical fusion. Chilled organic coconut water, whipped sweet coconut cream, and lime.', price: '€8.00', type: 'Iced Coffee',
      img: '/global/product/drinks/iced-coffee/iced-punch-coco.jpg', tag: 'Exotic Reserve'
    },

    // ── SIGNATURE CREATIONS ──
    {
      id: 10, name: 'Biscoff Cream Latte', origin: 'Plus33 Signature Lab', notes: 'Speculoos Cookie, Caramelized Cream',
      desc: 'Velvety espresso paired with slow-melted Biscoff speculoos cream, whipped mascarpone foam, and biscuit dust.', price: '€8.50', type: 'Signature',
      img: '/global/product/signature/biscoff-cream-latte.webp', tag: 'Signature'
    },
    {
      id: 11, name: 'Champs-Élysées Cold Brew', origin: 'Parisian Atelier', notes: '24-Hour Steep, Dark Cacao',
      desc: 'Our signature 24-hour slow steep cold brew, poured over hand-cut ice with notes of dark cacao and orange blossom.', price: '€8.00', type: 'Signature',
      img: '/global/product/signature/champs-elysees-cold-brew.jpg', tag: 'Signature'
    },
    {
      id: 12, name: 'Louvre Mocha', origin: 'Valrhona French Chocolate', notes: '70% Dark Chocolate, Espresso',
      desc: 'Single-origin espresso blended with melted Valrhona 70% dark French chocolate and velvety steamed milk.', price: '€7.80', type: 'Signature',
      img: '/global/product/signature/louvre-mocha.jpg', tag: 'Signature'
    },
    {
      id: 13, name: 'Montmartre Caramel Latte', origin: 'Salted Butter Caramel', notes: 'Breton Caramel, Fleur de Sel',
      desc: 'Artisanal espresso infused with house-made Breton salted butter caramel and dusted with Maldon sea salt.', price: '€8.20', type: 'Signature',
      img: '/global/product/signature/montmartre-caramel-latte.png', tag: 'Signature'
    },
    {
      id: 14, name: 'Paris Vanilla Latte', origin: 'Madagascar Vanilla Pods', notes: 'Bourbon Vanilla, Velvet Foam',
      desc: 'Double espresso sweetened with organic Madagascar bourbon vanilla pod reduction and velvet microfoam.', price: '€7.90', type: 'Signature',
      img: '/global/product/signature/paris-vanilla-latte.jpg', tag: 'Signature'
    },
    {
      id: 15, name: 'Rose Pistachio Latte', origin: 'Sicilian Pistachio & Rose', notes: 'Roasted Pistachio, Damascus Rose',
      desc: 'Pure Sicilian pistachio paste whipped into espresso, delicately infused with organic Damascus rosewater.', price: '€8.80', type: 'Signature',
      img: '/global/product/signature/rose-pistachio-latte.jpg', tag: 'Signature'
    },

    // ── DESSERTS & BAKERY ──
    {
      id: 16, name: 'Almond Croissant', origin: 'Plus33 Pastry Lab', notes: 'Almond Frangipane, Toasted Almonds',
      desc: 'Our classic croissant filled with rich almond frangipane cream, topped with sliced toasted almonds.', price: '€5.20', type: 'Desserts & Bakery',
      img: '/global/product/desserts/ALMOND CROISSANT.jpg', tag: 'Fresh Daily'
    },
    {
      id: 17, name: 'Pain au Chocolat', origin: 'Plus33 Pastry Lab', notes: 'Valrhona Chocolate, Flaky Pastry',
      desc: 'A traditional French chocolate pastry crafted with layered puff pastry and filled with Valrhona dark chocolate.', price: '€4.80', type: 'Desserts & Bakery',
      img: '/global/product/desserts/croissant.jpg', tag: 'Best Seller'
    },
    {
      id: 18, name: 'French Croissant', origin: 'Plus33 Pastry Lab', notes: 'Normandy Butter, Flaky Layers',
      desc: 'A classic, golden French pastry with a flaky, buttery texture and crisp exterior, baked fresh daily.', price: '€4.50', type: 'Desserts & Bakery',
      img: '/global/product/bakery_category.jpg', tag: 'Pastry Lab Selection'
    },
    {
      id: 19, name: 'Artisanal Glazed Donut', origin: 'Plus33 Pastry Lab', notes: 'Artisanal Glaze, Soft Dough',
      desc: 'An artisanal glazed donut, soft and fluffy inside, topped with a delicate sweet vanilla glaze.', price: '€3.80', type: 'Desserts & Bakery',
      img: '/global/product/desserts/donut.jpg', tag: 'Sweet Treat'
    },
    {
      id: 20, name: 'Soft German Pretzel', origin: 'Plus33 Pastry Lab', notes: 'Coarse Sea Salt, Baked Fresh',
      desc: 'A classic German-style soft pretzel, golden brown and sprinkled with coarse sea salt.', price: '€4.20', type: 'Desserts & Bakery',
      img: '/global/product/desserts/pretzel.jpg', tag: 'Atelier Baked'
    },
    {
      id: 21, name: 'Éclair au Chocolat', origin: 'Plus33 Pastry Lab', notes: 'Choux Pastry, Valrhona Cocoa',
      desc: 'Classic French pastry made with light choux dough, filled with chocolate cream and dark cocoa glaze.', price: '€5.50', type: 'Desserts & Bakery',
      img: '/global/product/desserts_category.jpg', tag: 'Atelier Classic'
    },
    {
      id: 22, name: 'Artisanal Gelato', origin: 'Plus33 Pastry Lab', notes: 'Madagascar Vanilla, House Churned',
      desc: 'House-churned Italian-style gelato made with fresh organic milk and organic Madagascar vanilla beans.', price: '€6.20', type: 'Desserts & Bakery',
      img: '/global/product/desserts/Gelato.png', tag: 'Summer Special'
    },
    {
      id: 23, name: 'Tiramisu Glacé', origin: 'Plus33 Pastry Lab', notes: 'Single-Origin Espresso, Mascarpone',
      desc: 'An elevated frozen expression of the classic Italian dessert, featuring espresso-soaked ladyfingers.', price: '€6.80', type: 'Desserts & Bakery',
      img: '/global/product/desserts/tiramisu-glace.jpg', tag: 'Chef\'s Choice'
    },
    {
      id: 24, name: 'Zefir Fruit Confection', origin: 'Plus33 Pastry Lab', notes: 'Apple Purée, Meringue Style',
      desc: 'A light, airy fruit confection made with organic apple purée, fresh egg whites, dusted with powdered sugar.', price: '€4.50', type: 'Desserts & Bakery',
      img: '/global/product/desserts/Zefir.png', tag: 'Delicate Treat'
    },

    // ── RETAIL & BEANS ──
    {
      id: 25, name: 'Sachet de Café (250g)', origin: 'Ethiopia Yirgacheffe & Geisha', notes: 'Light-Medium Blend, Whole Bean',
      desc: 'Our signature luxury whole bean coffee pouch. Hand-packaged and nitrogen-flushed in Paris for peak aroma.', price: '€24.00', type: 'Retail & Beans',
      img: '/global/product/retail/sachet-de-cafe.png', tag: 'Micro-Lot Pouch'
    },
    {
      id: 26, name: 'Cerrado & Colombia Reserve', origin: 'Cerrado & Huila Regions', notes: 'Medium Roast, Chocolate & Hazelnut',
      desc: 'A signature house blend balancing sweet Brazilian Cerrado with vibrant Colombian Huila beans.', price: '€22.00', type: 'Retail & Beans',
      img: '/global/product/retail/cerrado-colombia.jpg', tag: 'House Reserve'
    },
    {
      id: 27, name: 'Signature Dark Roast', origin: 'Central & South America', notes: 'Dark Roast, Whole Bean, Dark Cacao',
      desc: 'A bold, deep espresso blend roasted to express rich dark cacao notes and a bittersweet smoky caramel finish.', price: '€21.00', type: 'Retail & Beans',
      img: '/global/product/retail/signature-dark-roast.png', tag: 'Intense Selection'
    },
    {
      id: 28, name: 'Masala Chai Tea Pouch', origin: 'Assam & Kerala, India', notes: 'Spiced Botanical, Assam Black Tea',
      desc: 'An authentic, aromatic heritage tea blend combining premium Assam black tea with crushed cardamoms and ginger.', price: '€18.00', type: 'Retail & Beans',
      img: '/global/product/retail/Masala Chai Tea Pouch.png', tag: 'Heritage Blend'
    },
    {
      id: 29, name: 'Kashmiri Kahwa Saffron Tea', origin: 'Kashmir Valley, India', notes: 'Saffron Green Tea, Cardamom',
      desc: 'An imperial saffron-infused green tea from Kashmir. Hand-blended with saffron threads, cardamom, and almonds.', price: '€26.00', type: 'Retail & Beans',
      img: '/global/product/retail/Kashmiri Kahwa.jpg', tag: 'Imperial Reserve'
    },
    {
      id: 30, name: 'Ooty Gold Single Origin', origin: 'Nilgiri Hills, India', notes: 'Medium Roast, Wild Honey, Citrus',
      desc: 'A rare, high-altitude single-origin coffee harvested from Nilgiri slopes at 2,200m. Notes of wild honey and blossom.', price: '€25.00', type: 'Retail & Beans',
      img: '/global/product/retail/Ooty Gold.jpg', tag: 'Single Origin'
    },

    // ── MERCHANDISE ──
    {
      id: 31, name: '+33 Atelier Gift Pack', origin: 'Curated Selection', notes: 'Multi-Roast Edition, Gift Box',
      desc: 'The ultimate sensory coffee gift. Beautifully boxed collection including micro-lot single-origin filter bags and reserve pouch.', price: '€63.30', type: 'Merchandise',
      img: '/global/product/merchandise/atelier-gift-pack.jpeg', tag: 'Luxury Set'
    },
    {
      id: 32, name: '+33 Organic Cotton Tote', origin: 'Parisian Atelier', notes: 'Cotton Canvas, French Design',
      desc: 'Heavyweight organic cotton canvas tote featuring our hand-pressed signature wordmark. Designed for daily essentials.', price: '€18.00', type: 'Merchandise',
      img: '/global/product/merchandise/organic-tote.png', tag: 'Ritual Object'
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
    const filtered = PRODUCTS.filter(p => filter === 'All' || p.type.toLowerCase().includes(filter.toLowerCase()));
    
    filtered.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = `store-card reveal reveal-${(i % 3) + 2}`;
      div.style.animationPlayState = 'running';
      div.setAttribute('aria-label', `Product: ${p.name}`);
      
      div.innerHTML = `
        <div class="store-card__img">
          <img src="${p.img}" alt="${p.name} product image" />
        </div>
        <div class="store-card__body">
          <div class="store-card__header">
            <h3 class="store-card__title">${p.name}</h3>
            <span class="store-card__price">${p.price}</span>
          </div>
          <span class="t-label" style="opacity: 0.5; display: block; margin: 2px 0 8px;">${p.type}</span>
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
  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Hot Coffee', value: 'Hot Coffee' },
    { label: 'Iced Coffee', value: 'Iced Coffee' },
    { label: 'Signature', value: 'Signature' },
    { label: 'Desserts & Bakery', value: 'Desserts' },
    { label: 'Retail & Beans', value: 'Retail' },
    { label: 'Merchandise', value: 'Merchandise' }
  ];
  let currentFilter = 'All';

  if (filtersContainer) {
    filtersContainer.innerHTML = ''; // Prevent duplication
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `store__filter-btn ${currentFilter === cat.value ? 'store__filter-btn--active' : ''}`;
      btn.setAttribute('aria-pressed', currentFilter === cat.value ? 'true' : 'false');
      btn.innerHTML = `
        <span class="store__filter-dot"></span>
        ${cat.label === 'All' ? 'Full Collection' : cat.label}
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.store__filter-btn').forEach(b => {
          b.classList.remove('store__filter-btn--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('store__filter-btn--active');
        btn.setAttribute('aria-pressed', 'true');
        currentFilter = cat.value;
        renderProducts(currentFilter);
      });
      filtersContainer.appendChild(btn);
    });
  }

  // Initial Paint
  renderProducts(currentFilter);
}
