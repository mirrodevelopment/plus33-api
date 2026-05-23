/**
 * FILE: find-us.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Interactive controller for the PLUS33 Destination Discovery Experience.
 *
 * RESPONSIBILITIES:
 * - Maintains registry of 8 premier European café destinations.
 * - Initialises Leaflet.js map with custom desaturated Dark Matter tiles.
 * - Renders and updates custom gold pulse markers and active highlight states.
 * - Performs user geolocation calculations via Haversine distance formula.
 * - Runs real-time fuzzy search queries and tag filters (Quiet Workspace, etc.).
 * - Executes dynamic local-time checks to toggle Morning, Evening, and Night modes.
 * - Orchestrates GSAP ScrollTriggers and handles cleanup routines on unmount.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * LAST UPDATED : 2026-05-23
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the Destination Discovery locator page.
 * Returns a teardown function to clean up Leaflet map resources, event listeners, and ScrollTriggers.
 * 
 * @returns {Function} Teardown cleanup function.
 */
export function mountFindUsPage() {
  const cleanups = [];
  let mapInstance = null;
  let userGeoMarker = null;
  let userCoords = null;
  let selectedStoreId = null;

  // ═════════ DESTINATION REGISTRY ═════════
  /**
   * Database of premier European cafe destinations.
   * @type {Array.<{id: number, name: string, city: string, address: string, lat: number, lng: number, phone: string, openHours: string, narrative: string, pairings: {selection: string, bite: string}, features: string[], img: string}>}
   */
  const STORES = [
    {
      id: 1,
      name: "Plus33 Maison Paris",
      city: "Paris",
      address: "12 Rue du Bac, 75007 Paris, France",
      lat: 48.8584,
      lng: 2.3262,
      phone: "+33 1 42 61 00 33",
      openHours: "08:00 - 22:00",
      narrative: "A softly lit retreat inspired by late-evening conversations along the Left Bank, crafted for intimate espresso moments and refined lounge culture.",
      pairings: {
        selection: "Nordic Vanilla Espresso",
        bite: "Paris Butter Croissant"
      },
      features: ["Terrace Lounge", "Evening Reserve", "Espresso Bar", "WiFi"],
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      isFeatured: true,
      region: "Europe",
      category: "Flagship Salon"
    },
    {
      id: 2,
      name: "Plus33 Milano Atelier",
      city: "Milan",
      address: "Via Dante 14, 20121 Milano, Italy",
      lat: 45.4665,
      lng: 9.1843,
      phone: "+39 02 89 01 00 33",
      openHours: "07:30 - 23:00",
      narrative: "A refined espresso destination blending Italian craftsmanship with modern lounge ambience, nestled under historic Milanese architecture.",
      pairings: {
        selection: "Sicilia Citrus Cold Brew",
        bite: "Milano Pistachio Biscotti"
      },
      features: ["Terrace Lounge", "Evening Reserve", "Espresso Bar", "Night Lounge"],
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      isFeatured: true,
      region: "Europe",
      category: "Espresso Bar"
    },
    {
      id: 3,
      name: "Plus33 Amsterdam Galerie",
      city: "Amsterdam",
      address: "Prinsengracht 456, 1016 HL Amsterdam, Netherlands",
      lat: 52.3688,
      lng: 4.8856,
      phone: "+31 20 52 10 033",
      openHours: "09:00 - 21:00",
      narrative: "A bright, canal-side gallery displaying contemporary artwork alongside slow-extraction cold brews and botanical tea infusions.",
      pairings: {
        selection: "Nordic Vanilla Espresso",
        bite: "Florence Almond Tart"
      },
      features: ["Quiet Workspace", "Open Courtyard", "WiFi"],
      img: "https://images.unsplash.com/photo-1522336572018-9b34001f44c3?w=800&q=80",
      isFeatured: true,
      region: "Europe",
      category: "Galerie & Brew"
    },
    {
      id: 4,
      name: "Plus33 Vienna Salon",
      city: "Vienna",
      address: "Herrengasse 10, 1010 Wien, Austria",
      lat: 48.2098,
      lng: 16.3654,
      phone: "+43 1 53 30 033",
      openHours: "08:00 - 22:00",
      narrative: "An elegant reserve experience blending warm walnut interiors, quiet jazz ambience, and signature hazelnut espresso rituals.",
      pairings: {
        selection: "Vienna Hazelnut Reserve",
        bite: "Florence Almond Tart"
      },
      features: ["Evening Reserve", "Quiet Workspace", "Private Seating"],
      img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
      isFeatured: true,
      region: "Europe",
      category: "Boutique Reserve"
    },
    {
      id: 5,
      name: "Plus33 Copenhagen Salon",
      city: "Copenhagen",
      address: "Nyhavn 21, 1051 København, Denmark",
      lat: 55.6798,
      lng: 12.5898,
      phone: "+45 33 15 00 33",
      openHours: "08:00 - 19:00",
      narrative: "A clean Scandinavian salon prioritizing workspace minimalism, single-origin V60 pour overs, and fresh organic pastries.",
      pairings: {
        selection: "Nordic Vanilla Espresso",
        bite: "Paris Butter Croissant"
      },
      features: ["Quiet Workspace", "Open Courtyard", "WiFi"],
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      isFeatured: true,
      region: "Europe",
      category: "Scandinavian Atelier"
    },
    {
      id: 6,
      name: "Plus33 Zurich Pavilion",
      city: "Zurich",
      address: "Bahnhofstrasse 24, 8001 Zürich, Switzerland",
      lat: 47.3712,
      lng: 8.5398,
      phone: "+41 44 21 10 033",
      openHours: "08:00 - 20:00",
      narrative: "An architectural lakefront pavilion crafted in dark steel and glass. Famous for its thick reserve chocolates and rich filter blends.",
      pairings: {
        selection: "Barcelona Cocoa Roast",
        bite: "Milano Pistachio Biscotti"
      },
      features: ["Evening Reserve", "Quiet Workspace", "Private Seating", "WiFi"],
      img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
      isFeatured: true,
      region: "Europe",
      category: "Bespoke Pavilion"
    },
    {
      id: 7,
      name: "Plus33 Barcelona Terrace",
      city: "Barcelona",
      address: "Passeig de Gràcia 50, 08007 Barcelona, Spain",
      lat: 41.3912,
      lng: 2.1648,
      phone: "+34 93 48 70 033",
      openHours: "08:30 - 23:30",
      narrative: "A sunlit open-air terrace framing beautiful Passeig de Gràcia views. Serves refreshing citrus cold brews and afternoon pairings.",
      pairings: {
        selection: "Sicilia Citrus Cold Brew",
        bite: "Florence Almond Tart"
      },
      features: ["Terrace Lounge", "Open Courtyard", "Night Lounge"],
      img: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
      isFeatured: true,
      region: "Europe",
      category: "Terrace Lounge"
    },
    {
      id: 8,
      name: "Plus33 Florence Palazzo",
      city: "Florence",
      address: "Piazza della Signoria 8, 50122 Firenze, Italy",
      lat: 43.7696,
      lng: 11.2558,
      phone: "+39 055 21 10 033",
      openHours: "08:00 - 22:30",
      narrative: "A Renaissance-style courtyard salon offering historic views, quiet alcoves, and double-extracted traditional espresso shots.",
      pairings: {
        selection: "Vienna Hazelnut Reserve",
        bite: "Florence Almond Tart"
      },
      features: ["Open Courtyard", "Private Seating", "Espresso Bar"],
      img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
      isFeatured: true,
      region: "Europe",
      category: "Heritage Courtyard"
    },
    {
      id: 9,
      name: "Plus33 Berlin Pavilion",
      city: "Berlin",
      address: "Oranienburger Str. 27, 10117 Berlin, Germany",
      lat: 52.5253,
      lng: 13.3924,
      phone: "+49 30 280 0033",
      openHours: "08:00 - 20:00",
      narrative: "An industrial-chic retreat showcasing steel frames and concrete pillars, celebrating minimalist design alongside specialty filter roasts.",
      pairings: {
        selection: "Nordic Vanilla Espresso",
        bite: "Berlin Plum Crumble"
      },
      features: ["Quiet Workspace", "Espresso Bar", "WiFi"],
      img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
      isFeatured: true,
      region: "Europe",
      category: "Industrial Pavilion"
    },
    {
      id: 10,
      name: "Plus33 London Atelier",
      city: "London",
      address: "45 Jermyn St, St. James's, London SW1Y 6JD, UK",
      lat: 51.5074,
      lng: -0.1278,
      phone: "+44 20 7930 0033",
      openHours: "08:00 - 21:00",
      narrative: "An elegant space of polished mahogany and brass in the heart of St. James's, bridging British tea rituals with masterfully pulled espresso.",
      pairings: {
        selection: "Earl Grey Espresso Macchiato",
        bite: "Chelsea Bun Scone"
      },
      features: ["Quiet Workspace", "Espresso Bar", "WiFi"],
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      isFeatured: false,
      region: "Europe",
      category: "Exclusive Atelier"
    },
    {
      id: 11,
      name: "Plus33 Rome Galleria",
      city: "Rome",
      address: "Piazza di Spagna 33, 00187 Roma, Italy",
      lat: 41.9060,
      lng: 12.4820,
      phone: "+39 06 699 0033",
      openHours: "07:00 - 23:00",
      narrative: "Steps from the Spanish Steps, our Rome Galleria celebrates Italian espresso traditions in a vault of travertine stone and contemporary gallery displays.",
      pairings: {
        selection: "Sicilia Citrus Cold Brew",
        bite: "Rome Pistachio Cannoli"
      },
      features: ["Terrace Lounge", "Espresso Bar", "Night Lounge"],
      img: "https://images.unsplash.com/photo-1522336572018-9b34001f44c3?w=800&q=80",
      isFeatured: false,
      region: "Europe",
      category: "Travertine Galleria"
    },
    {
      id: 12,
      name: "Plus33 Prague Cabinet",
      city: "Prague",
      address: "Staroměstské nám. 12, 110 00 Praha 1, Czechia",
      lat: 50.0870,
      lng: 14.4207,
      phone: "+420 224 210 033",
      openHours: "08:30 - 21:30",
      narrative: "A Gothic-inspired hideaway featuring velvet alcoves and curated library walls, designed for slow-extraction filter brews and quiet contemplation.",
      pairings: {
        selection: "Vienna Hazelnut Reserve",
        bite: "Prague Honey Cake"
      },
      features: ["Quiet Workspace", "Private Seating", "WiFi"],
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      isFeatured: false,
      region: "Europe",
      category: "Bibliotheque Cabinet"
    },
    {
      id: 13,
      name: "Plus33 Istanbul Bosphorus",
      city: "Istanbul",
      address: "Kemankeş Karamustafa Paşa, Rıhtım Cd. 33, 34425 Beyoğlu/İstanbul, Turkey",
      lat: 41.0082,
      lng: 28.9784,
      phone: "+90 212 244 0033",
      openHours: "08:00 - 22:30",
      narrative: "A transcontinental sensory escape framing beautiful Bosphorus views, celebrating Turkish heritage coffee spices alongside rich dark-roast rituals.",
      pairings: {
        selection: "Cardamom Velvet Espresso",
        bite: "Istanbul Rosewater Loukoum"
      },
      features: ["Terrace Lounge", "Open Courtyard", "Espresso Bar"],
      img: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
      isFeatured: false,
      region: "Middle East",
      category: "Bosphorus Lounge"
    },
    {
      id: 14,
      name: "Plus33 Dubai Reserve",
      city: "Dubai",
      address: "Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE",
      lat: 25.2048,
      lng: 55.2708,
      phone: "+971 4 456 0033",
      openHours: "08:00 - 01:00",
      narrative: "A refined lounge destination blending contemporary luxury with warm golden hospitality, set against soaring skyline perspectives.",
      pairings: {
        selection: "24K Gold Dust Macchiato",
        bite: "Dubai Pistachio Baklava"
      },
      features: ["Evening Reserve", "Terrace Lounge", "Night Lounge"],
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      isFeatured: false,
      region: "Middle East",
      category: "Skyline Reserve"
    },
    {
      id: 15,
      name: "Plus33 Tokyo Precision",
      city: "Tokyo",
      address: "5-chōme-11-1 Minamiaoyama, Minato City, Tokyo 107-0062, Japan",
      lat: 35.6762,
      lng: 139.6503,
      phone: "+81 3 5468 0033",
      openHours: "08:00 - 23:00",
      narrative: "Quiet midnight espresso rituals inspired by modern Japanese precision, meticulous pour overs, and elevated urban calm.",
      pairings: {
        selection: "Uji Matcha Shot Brew",
        bite: "Aoyama Sweet Azuki Mochi"
      },
      features: ["Quiet Workspace", "Espresso Bar", "WiFi"],
      img: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
      isFeatured: false,
      region: "Asia",
      category: "Midnight Atelier"
    },
    {
      id: 16,
      name: "Plus33 Singapore Sanctuary",
      city: "Singapore",
      address: "10 Bayfront Ave, Marina Bay Sands, Singapore 018956",
      lat: 1.3521,
      lng: 103.8198,
      phone: "+65 6688 0033",
      openHours: "09:00 - 22:00",
      narrative: "A tropical metropolitan retreat balancing architectural elegance with modern café culture, surrounded by lush botanical gardens.",
      pairings: {
        selection: "Coconut Nectar Drip Coffee",
        bite: "Pandan Coconut Crepe"
      },
      features: ["Open Courtyard", "Quiet Workspace", "WiFi"],
      img: "https://images.unsplash.com/photo-1522336572018-9b34001f44c3?w=800&q=80",
      isFeatured: false,
      region: "Asia",
      category: "Tropical Sanctuary"
    },
    {
      id: 17,
      name: "Plus33 Hong Kong Peak",
      city: "Hong Kong",
      address: "Shop G12, The Landmark, Central, Hong Kong",
      lat: 22.3193,
      lng: 114.1694,
      phone: "+852 2522 0033",
      openHours: "08:00 - 21:00",
      narrative: "A high-elevation glass sanctuary framing harbor vistas, celebrating specialty single-origin espresso and luxury tea culture.",
      pairings: {
        selection: "Oolong Jasmine Cold Brew",
        bite: "Hong Kong Egg Custard Tart"
      },
      features: ["Quiet Workspace", "Private Seating", "WiFi"],
      img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
      isFeatured: false,
      region: "Asia",
      category: "Skyline Glasshouse"
    },
    {
      id: 18,
      name: "Plus33 Shanghai Bund",
      city: "Shanghai",
      address: "No. 33 Zhongshan Road (E-1), Huangpu, Shanghai, China",
      lat: 31.2304,
      lng: 121.4737,
      phone: "+86 21 6323 0033",
      openHours: "08:30 - 22:00",
      narrative: "An editorial destination combining art-deco grandeur with signature cold-extraction brews along the historic Bund riverfront.",
      pairings: {
        selection: "Imperial Jasmine Espresso",
        bite: "Shanghai Sweet Red Bean Cake"
      },
      features: ["Evening Reserve", "Terrace Lounge", "Espresso Bar"],
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      isFeatured: false,
      region: "Asia",
      category: "Riverfront Grandeur"
    },
    {
      id: 19,
      name: "Plus33 Seoul Hanok",
      city: "Seoul",
      address: "33 Yulgok-ro 5-gil, Jongno-gu, Seoul, South Korea",
      lat: 37.5665,
      lng: 126.9780,
      phone: "+82 2 730 0033",
      openHours: "09:00 - 21:30",
      narrative: "A quiet traditional hanok pavilion reimagined with modern concrete architecture, serving single-origin drip filters and ginger infusions.",
      pairings: {
        selection: "Ginseng Honey Brew",
        bite: "Korean Sweet Rice Cake"
      },
      features: ["Open Courtyard", "Quiet Workspace", "Private Seating"],
      img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
      isFeatured: false,
      region: "Asia",
      category: "Hanok Retreat"
    },
    {
      id: 20,
      name: "Plus33 Mumbai Pavilion",
      city: "Mumbai",
      address: "Jio World Drive, BKC, Bandra East, Mumbai, Maharashtra 400051, India",
      lat: 19.0760,
      lng: 72.8777,
      phone: "+91 22 3500 0033",
      openHours: "08:30 - 23:00",
      narrative: "A majestic BKC oasis blending solid teak wood detailing with signature spicy chai espresso mocktails and artisanal baked bites.",
      pairings: {
        selection: "Masala Chai Spiced Espresso",
        bite: "Mumbai Pistachio Mawa Cake"
      },
      features: ["Terrace Lounge", "Espresso Bar", "WiFi"],
      img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
      isFeatured: false,
      region: "Asia",
      category: "Metropolitan Oasis"
    },
    {
      id: 21,
      name: "Plus33 Bangkok Oasis",
      city: "Bangkok",
      address: "IconSiam, 299 Charoen Nakhon Rd, Bangkok 10600, Thailand",
      lat: 13.7563,
      lng: 100.5018,
      phone: "+66 2 490 0033",
      openHours: "10:00 - 22:00",
      narrative: "A beautiful riverside terrace overlooking the Chao Phraya, featuring tropical design notes and signature lemongrass filter coffee.",
      pairings: {
        selection: "Lemongrass Citrus Cold Drip",
        bite: "Bangkok Mango Sticky Pastry"
      },
      features: ["Terrace Lounge", "Open Courtyard", "WiFi"],
      img: "https://images.unsplash.com/photo-1522336572018-9b34001f44c3?w=800&q=80",
      isFeatured: false,
      region: "Asia",
      category: "Riverside Sanctuary"
    },
    {
      id: 22,
      name: "Plus33 Coimbatore Heritage",
      city: "Coimbatore",
      address: "33 Race Course Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018, India",
      lat: 11.0168,
      lng: 76.9558,
      phone: "+91 422 222 0033",
      openHours: "08:00 - 22:00",
      narrative: "An elegant heritage estate nestled in tree-lined Race Course, serving premium Nilgiri cold drips and cardamom almond croissants.",
      pairings: {
        selection: "Nilgiri Mountain Filter Drip",
        bite: "Coimbatore Cardamom Croissant"
      },
      features: ["Open Courtyard", "Quiet Workspace", "Private Seating"],
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      isFeatured: false,
      region: "Asia",
      category: "Heritage Estate"
    },
    {
      id: 23,
      name: "Plus33 New York Downtown",
      city: "New York City",
      address: "33 Crosby St, New York, NY 10013, USA",
      lat: 40.7128,
      lng: -74.0060,
      phone: "+1 212 966 0033",
      openHours: "08:00 - 23:00",
      narrative: "An intimate late-evening destination inspired by timeless downtown Soho lounge energy, warm lights, and bold double ristrettos.",
      pairings: {
        selection: "Manhattan Dark Espresso Noir",
        bite: "New York Cinnamon Crumb Cake"
      },
      features: ["Evening Reserve", "Espresso Bar", "WiFi"],
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      isFeatured: false,
      region: "North America",
      category: "Downtown Lounge"
    },
    {
      id: 24,
      name: "Plus33 Los Angeles Villa",
      city: "Los Angeles",
      address: "8400 Melrose Ave, West Hollywood, CA 90069, USA",
      lat: 34.0522,
      lng: -118.2437,
      phone: "+1 310 659 0033",
      openHours: "07:30 - 20:00",
      narrative: "A light-filled West Hollywood villa featuring high ceilings, white stucco archways, and signature iced citrus tonic espresso drinks.",
      pairings: {
        selection: "Melrose Citrus Tonic Brew",
        bite: "Melrose Avocado Brioche Tart"
      },
      features: ["Open Courtyard", "Terrace Lounge", "WiFi"],
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      isFeatured: false,
      region: "North America",
      category: "Melrose Villa"
    },
    {
      id: 25,
      name: "Plus33 Toronto Reserve",
      city: "Toronto",
      address: "33 Bloor St E, Toronto, ON M4W 3H1, Canada",
      lat: 43.6532,
      lng: -79.3832,
      phone: "+1 416 925 0033",
      openHours: "08:00 - 21:00",
      narrative: "A warm maple wood haven offering double-extraction espresso rituals and quiet study pods for chilly Toronto mornings.",
      pairings: {
        selection: "Canadian Maple Cappuccino",
        bite: "Toronto Maple Pecan Scone"
      },
      features: ["Quiet Workspace", "Private Seating", "WiFi"],
      img: "https://images.unsplash.com/photo-1522336572018-9b34001f44c3?w=800&q=80",
      isFeatured: false,
      region: "North America",
      category: "Boutique Reserve"
    },
    {
      id: 26,
      name: "Plus33 São Paulo Paulista",
      city: "São Paulo",
      address: "Av. Paulista, 3333 - Bela Vista, São Paulo - SP, 01311-000, Brazil",
      lat: -23.5505,
      lng: -46.6333,
      phone: "+55 11 3253 0033",
      openHours: "08:00 - 22:00",
      narrative: "A grand modernist salon celebrating Brazilian coffee culture, serving heavy-bodied natural processed filter roasts and warm cheese pastries.",
      pairings: {
        selection: "Cerrado Honey Cold Brew",
        bite: "Paulista Warm Pão de Queijo"
      },
      features: ["Terrace Lounge", "Espresso Bar", "WiFi"],
      img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
      isFeatured: false,
      region: "South America",
      category: "Modernist Salon"
    },
    {
      id: 27,
      name: "Plus33 Sydney Harbour",
      city: "Sydney",
      address: "33 Circular Quay W, The Rocks NSW 2000, Australia",
      lat: -33.8688,
      lng: 151.2093,
      phone: "+61 2 9241 0033",
      openHours: "07:30 - 18:30",
      narrative: "An open-air glass pavilion overlooking the historic Rocks harbor, famous for its smooth flat whites and toasted macadamia bites.",
      pairings: {
        selection: "Rocks Macadamia Flat White",
        bite: "Sydney Toasted Almond Croissant"
      },
      features: ["Terrace Lounge", "Open Courtyard", "WiFi"],
      img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
      isFeatured: false,
      region: "Oceania",
      category: "Harbour Pavilion"
    }
  ];

  // Map Marker Storage
  let markers = {};
  let isWorldwideActive = false;

  function isRegionRevealed(region, zoom) {
    if (region === 'Europe') return true;
    if (region === 'Middle East') return zoom <= 3.2;
    if (region === 'Asia') return zoom <= 2.7;
    if (region === 'North America' || region === 'South America') return zoom <= 2.2;
    if (region === 'Oceania') return zoom <= 1.7;
    return false;
  }

  function updateMarkerStates() {
    if (!mapInstance) return;
    const currentZoom = mapInstance.getZoom();
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Check if any filters are active
    const checkedCheckboxes = document.querySelectorAll('.filters-grid input:checked');
    const activeFilters = Array.from(checkedCheckboxes).map(cb => cb.value);
    const hasSearchOrFilters = query || activeFilters.length > 0;

    STORES.forEach(store => {
      const marker = markers[store.id];
      if (!marker) return;

      const element = marker.getElement();
      if (!element) return;

      let isVisible = false;

      if (hasSearchOrFilters) {
        // If there's search/filter active, check query & filters match
        const matchesQuery = !query || 
                             store.name.toLowerCase().includes(query) || 
                             store.city.toLowerCase().includes(query) || 
                             (store.address && store.address.toLowerCase().includes(query));
        const matchesFilters = activeFilters.every(f => store.features.includes(f));
        isVisible = matchesQuery && matchesFilters;
      } else {
        // No search/filter active:
        // 1. Featured stores are always visible
        if (store.isFeatured) {
          isVisible = true;
        }
        // 2. Selected store is always visible
        else if (selectedStoreId === store.id) {
          isVisible = true;
        }
        // 3. Zoom level matches region or Worldwide mode is active
        else if (isWorldwideActive || isRegionRevealed(store.region, currentZoom)) {
          isVisible = true;
        }
      }

      if (isVisible) {
        element.classList.remove('gold-custom-marker--hidden');
      } else {
        element.classList.add('gold-custom-marker--hidden');
        if (marker.isPopupOpen()) {
          marker.closePopup();
        }
      }
    });
  }

  // ═════════ INITIALIZATION ═════════
  const pageContainer = document.querySelector('.locations-page');
  const searchInput = document.getElementById('hero-search-input');
  const geoBtn = document.getElementById('hero-geo-btn');
  const cityQuickLinks = document.querySelectorAll('.city-quick-link');
  const resultsCounter = document.getElementById('results-counter');
  const journalContainer = document.getElementById('journal-listings-container');
  const googleMapsBtn = document.getElementById('google-maps-btn');
  const resetBtn = document.getElementById('map-reset-btn');

  // Dynamic Time-of-Day Atmosphere Mode Selector (Forced Light Mode)
  (function setAtmosphereMode() {
    if (!pageContainer) return;
    // Forcing luxury light mode atmosphere per user request
    pageContainer.classList.remove('locations-page--evening', 'locations-page--night');
    console.log('+33 | Ambient Mode: Light Morning (Forced)');
  })();

  // Initialize Map
  (function initMap() {
    const mapNode = document.getElementById('find-us-map');
    if (!mapNode || !window.L) return;

    // Center map initially over Europe [Lat, Lng], Zoom level 4.0 per implementation plan.
    mapInstance = L.map('find-us-map', {
      center: [47.5, 10.0],
      zoom: 4.0,
      zoomSnap: 0.1,
      scrollWheelZoom: false,
      fadeAnimation: true,
      zoomAnimation: true
    });

    // CartoDB Voyager tiles for a clean, bright, and detailed modern aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapInstance);

    // Draw custom matte gold pins for all destinations
    STORES.forEach(store => {
      const customIcon = L.divIcon({
        className: 'gold-custom-marker',
        html: `
          <div class="marker-pin-dot"></div>
          <div class="marker-pulse-ring"></div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(mapInstance);
      
      // Luxury Popup Layout
      const popupHtml = `
        <div class="popup-card">
          <img src="${store.img}" alt="${store.name}" class="popup-img" />
          <div class="popup-body">
            <span class="popup-eyebrow">${store.city}</span>
            <h4 class="popup-title">${store.name}</h4>
            <p style="font-size:0.75rem; line-height:1.4; opacity:0.8;">${store.narrative}</p>
            <div class="popup-meta-row">
              <span>Pairing:</span>
              <span style="color:var(--gold); font-weight:300;">${store.pairings.selection}</span>
            </div>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}" target="_blank" rel="noopener" class="popup-btn">Get Directions</a>
        </div>
      `;
      marker.bindPopup(popupHtml, {
        closeButton: false,
        offset: [0, -10]
      });

      // Bind click triggers
      marker.on('click', () => {
        selectStore(store.id);
      });

      markers[store.id] = marker;
    });

    // Listen to zoom transitions
    mapInstance.on('zoomend', () => {
      updateMarkerStates();
    });

    // Fade loader once map tiles finish rendering (guaranteeing beautiful loading experience)
    mapInstance.whenReady(() => {
      updateMarkerStates();
      setTimeout(() => {
        const loader = document.getElementById('locations-loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.visibility = 'hidden';
          }, 1200);
        }
      }, 1000);
    });
  })();

  // ═════════ LISTING RENDERING ═════════
  function showPlaceholderListing() {
    if (!journalContainer) return;
    journalContainer.innerHTML = `
      <div class="select-destination-placeholder" style="padding: 100px 24px; text-align: center; border: 1px dashed rgba(184, 115, 51, 0.2); border-radius: var(--r-md); background: rgba(245, 241, 234, 0.4); margin-top: 40px;">
        <span class="t-label" style="letter-spacing: 0.3em; color: var(--copper);">Discover +33 Paris</span>
        <h3 class="display-sm text-navy" style="font-family: var(--font-display); font-weight: 300; margin-top: 12.5px; font-size: 1.8rem; letter-spacing: -0.015em;">Select a Destination</h3>
        <p class="t-body" style="margin-top: 16px; color: var(--text-secondary); max-width: 340px; margin-left: auto; margin-right: auto; line-height: 1.8; font-size: 0.9rem;">
          Choose an atelier from the map markers or prominent list above to reveal its details, specialty coffee pairings, and directions.
        </p>
      </div>
    `;
  }

  function selectStore(id) {
    selectedStoreId = id;
    const store = STORES.find(s => s.id === id);
    if (!store) return;

    arriveAtDestination(store.id, store.lat, store.lng);
    renderListings([store]);
  }

  /**
   * Calculations for distance sorting.
   * Uses the Haversine formula to compute km distance between coordinates.
   * @param {number} lat1 - Latitude point A.
   * @param {number} lon1 - Longitude point A.
   * @param {number} lat2 - Latitude point B.
   * @param {number} lon2 - Longitude point B.
   * @returns {number} Distance in kilometers.
   */
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Formats and appends filtered store cards to the left panel listing.
   * @param {Array.<Object>} items - The list of stores to render.
   */
  function renderListings(items) {
    if (!journalContainer) return;
    journalContainer.innerHTML = '';

    if (items.length === 0) {
      journalContainer.innerHTML = `
        <div style="padding: 100px 0; text-align: center;">
          <span class="t-label">NO SANCTUARY FOUND</span>
          <p class="t-body" style="margin-top: 16px;">Try adjusting your keywords or clearing the active filters.</p>
        </div>
      `;
      return;
    }

    items.forEach((store, idx) => {
      const isAlt = idx % 2 === 1;
      const block = document.createElement('div');
      block.className = 'journal-dest-block reveal';
      block.id = `dest-block-${store.id}`;
      
      const distanceBadge = store.distance 
        ? `<div class="dest-distance">${store.distance.toFixed(1)} KM AWAY</div>`
        : '';

      const tagsHtml = store.features.map(f => `<span class="atmosphere-tag">${f}</span>`).join('');

      block.innerHTML = `
        <div class="dest-content-wrap">
          <div class="dest-headline-group">
            <div>
              <span class="t-label">${store.city} · ESTABLISHED 2024</span>
              <h3 class="text-navy">${store.name}</h3>
            </div>
            ${distanceBadge}
          </div>

          <div class="dest-atmosphere-tags">
            ${tagsHtml}
          </div>

          <!-- Asymmetric image positioning based on index -->
          <div class="dest-image-composer" style="margin-left:${isAlt ? 'var(--s2)' : '0'}; margin-right:${isAlt ? '0' : 'var(--s2)'};">
            <img src="${store.img}" alt="${store.name} interior style" />
          </div>

          <p class="t-body dest-story-copy">${store.narrative}</p>

          <!-- Signature Pairings -->
          <div class="dest-pairings">
            <span class="pairings-title">Curated Pairings</span>
            <div class="pairings-list">
              <div class="pairing-item">
                <span class="pairing-key">Evening Selection</span>
                <span class="pairing-val">${store.pairings.selection}</span>
              </div>
              <div class="pairing-item">
                <span class="pairing-key">Signature Pairing</span>
                <span class="pairing-val">${store.pairings.bite}</span>
              </div>
            </div>
          </div>

          <!-- Meta Address Details -->
          <div class="dest-meta-details">
            <div class="meta-detail-item">
              <span class="meta-detail-label">Address</span>
              <span class="meta-detail-val">${store.address}</span>
            </div>
            <div class="meta-detail-item">
              <span class="meta-detail-label">Working Hours</span>
              <span class="meta-detail-val">${store.openHours}</span>
            </div>
          </div>

          <!-- Interactions -->
          <div class="dest-interactions">
            <button class="btn-luxury-pill btn-luxury-pill--primary btn-arrive" data-id="${store.id}">Arrive at Destination</button>
            <a href="https://wa.me/33142610033" target="_blank" rel="noopener" class="btn-luxury-pill btn-luxury-pill--secondary">WhatsApp Atelier</a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}" target="_blank" rel="noopener" class="btn-luxury-pill btn-luxury-pill--secondary">Get Directions</a>
          </div>
        </div>
      `;

      // Click callback on card arrive button
      block.querySelector('.btn-arrive').addEventListener('click', () => {
        arriveAtDestination(store.id, store.lat, store.lng);
      });

      journalContainer.appendChild(block);
    });

    // Re-trigger GSAP scroll staggers for newly rendered listings
    gsap.from('.journal-dest-block', {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  // ═════════ SEARCH & FILTER HANDLING ═════════
  const suggestionsOverlay = document.getElementById('search-suggestions-overlay');

  function renderSuggestions(query) {
    if (!suggestionsOverlay) return;
    if (!query) {
      suggestionsOverlay.innerHTML = '';
      suggestionsOverlay.classList.remove('search-suggestions-overlay--active');
      return;
    }

    const matches = STORES.filter(store => 
      store.name.toLowerCase().includes(query) || 
      store.city.toLowerCase().includes(query) || 
      (store.address && store.address.toLowerCase().includes(query))
    );

    if (matches.length === 0) {
      suggestionsOverlay.innerHTML = `
        <div class="suggestion-no-results">
          No destinations found
        </div>
      `;
      suggestionsOverlay.classList.add('search-suggestions-overlay--active');
      return;
    }

    suggestionsOverlay.innerHTML = '';
    matches.forEach(store => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      
      const typeBadge = store.isFeatured 
        ? `<span class="suggestion-badge">Featured</span>` 
        : `<span class="suggestion-badge suggestion-badge--hidden">Hidden</span>`;
        
      item.innerHTML = `
        <div class="suggestion-info">
          <span class="suggestion-city">${store.city}</span>
          <span class="suggestion-name">${store.name}</span>
        </div>
        <div class="suggestion-meta">
          <span class="suggestion-region">${store.region}</span>
          ${typeBadge}
        </div>
      `;
      
      item.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = store.city;
        }
        selectStore(store.id);
        suggestionsOverlay.innerHTML = '';
        suggestionsOverlay.classList.remove('search-suggestions-overlay--active');
      });
      
      suggestionsOverlay.appendChild(item);
    });

    suggestionsOverlay.classList.add('search-suggestions-overlay--active');
  }

  /**
   * Filters the master store list based on query text and checklist criteria.
   */
  function filterDestinations() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Get checked tags
    const checkedCheckboxes = document.querySelectorAll('.filters-grid input:checked');
    const activeFilters = Array.from(checkedCheckboxes).map(cb => cb.value);

    let filtered = STORES.filter(store => {
      // Name, city, address, or features check
      const matchesQuery = !query || 
                           store.name.toLowerCase().includes(query) || 
                           store.city.toLowerCase().includes(query) || 
                           (store.address && store.address.toLowerCase().includes(query));

      const matchesFilters = activeFilters.every(f => store.features.includes(f));

      return matchesQuery && matchesFilters;
    });

    // Calculate distance if coordinates exist
    if (userCoords) {
      filtered.forEach(store => {
        store.distance = haversineDistance(userCoords.lat, userCoords.lng, store.lat, store.lng);
      });
      // Sort closest first
      filtered.sort((a, b) => a.distance - b.distance);
    }

    // Toggle markers visibility on map via state helper
    updateMarkerStates();

    // Update Counter text
    if (resultsCounter) {
      resultsCounter.textContent = `Displaying ${filtered.length} curated destinations`;
    }

    if (selectedStoreId && filtered.some(s => s.id === selectedStoreId)) {
      const activeStore = STORES.find(s => s.id === selectedStoreId);
      renderListings([activeStore]);
    } else {
      showPlaceholderListing();
    }
  }

  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      renderSuggestions(searchInput.value.toLowerCase().trim());
    });
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      renderSuggestions(q);
      filterDestinations();
    });
  }

  // Click outside listener for suggestions overlay
  const onDocumentClick = (e) => {
    if (suggestionsOverlay && !suggestionsOverlay.contains(e.target) && e.target !== searchInput) {
      suggestionsOverlay.classList.remove('search-suggestions-overlay--active');
    }
  };
  document.addEventListener('click', onDocumentClick);
  cleanups.push(() => document.removeEventListener('click', onDocumentClick));

  // Checkbox triggers
  const checkboxes = document.querySelectorAll('.filters-grid input');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', filterDestinations);
  });

  // ═════════ MAP INTERACTIVITY ═════════
  /**
   * Centers the map, triggers markers highlight states, and simulates destination arrivals.
   * @param {number} id - Target store ID.
   * @param {number} lat - Latitude.
   * @param {number} lng - Longitude.
   */
  function arriveAtDestination(id, lat, lng) {
    if (!mapInstance) return;

    // Cinematic pan and zoom transition
    mapInstance.flyTo([lat, lng], 13.5, {
      animate: true,
      duration: 3,
      ease: L.Ease ? L.Ease.cubic : null
    });

    highlightDestination(id);

    // Open Leaflet popup
    const marker = markers[id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 2500);
    }
  }

  /**
   * Toggles custom marker classes to highlight selected destination pins.
   * @param {number} id - Target store ID.
   */
  function highlightDestination(id) {
    updateMarkerStates();
    const store = STORES.find(s => s.id === id);
    if (store && googleMapsBtn) {
      googleMapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
    }

    Object.keys(markers).forEach(key => {
      const m = markers[key];
      const iconElement = m.getElement();
      if (iconElement) {
        if (parseInt(key) === id) {
          iconElement.classList.add('gold-custom-marker--active');
        } else {
          iconElement.classList.remove('gold-custom-marker--active');
        }
      }
    });
  }

  // ═════════ GEOLOCATION HANDLING ═════════
  /**
   * Prompts user coordinates, calculates distances, and centers map.
   */
  function handleGeolocation() {
    if (!navigator.geolocation) {
      alert("Your browser does not support geolocation details.");
      return;
    }

    if (geoBtn) {
      geoBtn.querySelector('span').textContent = "LOCATING ATELIER...";
      geoBtn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        userCoords = { lat, lng };

        if (googleMapsBtn) {
          googleMapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        }

        // Place user home marker
        if (mapInstance) {
          if (userGeoMarker) mapInstance.removeLayer(userGeoMarker);

          const userIcon = L.divIcon({
            className: 'gold-custom-marker user-custom-marker',
            html: `
              <div class="marker-pin-dot"></div>
              <div class="marker-pulse-ring"></div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          userGeoMarker = L.marker([lat, lng], { icon: userIcon }).addTo(mapInstance);
          userGeoMarker.bindPopup('<div class="popup-body" style="padding:10px;"><p style="margin:0;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--gold);">You are here</p></div>');

          // Fly map to user location
          mapInstance.flyTo([lat, lng], 8, {
            animate: true,
            duration: 2.5
          });
        }

        // Re-run filter and sort listings
        filterDestinations();

        if (geoBtn) {
          geoBtn.querySelector('span').textContent = "LOCATED SUCCESS";
          geoBtn.disabled = false;
        }
      },
      (err) => {
        console.error("Geolocation Error:", err);
        alert("Unable to fetch location. Showing default listings.");
        if (geoBtn) {
          geoBtn.querySelector('span').textContent = "USE CURRENT LOCATION";
          geoBtn.disabled = false;
        }
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }

  if (geoBtn) {
    geoBtn.addEventListener('click', handleGeolocation);
  }

  // Quick link handles
  cityQuickLinks.forEach(link => {
    link.addEventListener('click', () => {
      const city = link.getAttribute('data-city');
      const storesInCity = STORES.filter(s => s.city === city);
      
      if (storesInCity.length > 0) {
        const store = storesInCity[0];
        selectStore(store.id);
      }
    });
  });

  // ═════════ GSAP ENTRANCES ═════════
  // Hero staggers
  gsap.from('.hero-content-wrapper .reveal', {
    opacity: 0,
    y: 50,
    duration: 1.5,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Panoramic city showcases
  const panoramicItems = document.querySelectorAll('.panoramic-row');
  panoramicItems.forEach(row => {
    const visual = row.querySelector('.panoramic-visual');
    const text = row.querySelector('.panoramic-text');

    gsap.from(visual, {
      scrollTrigger: { trigger: row, start: 'top 85%' },
      opacity: 0,
      scale: 0.95,
      duration: 1.6,
      ease: 'power2.out'
    });

    gsap.from(text, {
      scrollTrigger: { trigger: row, start: 'top 85%' },
      opacity: 0,
      y: 45,
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.2
    });
  });

  // Flagships magazine staggers
  const magazineBlocks = document.querySelectorAll('.flagship-magazine-block');
  magazineBlocks.forEach(block => {
    gsap.from(block, {
      scrollTrigger: { trigger: block, start: 'top 85%' },
      opacity: 0,
      y: 60,
      duration: 1.5,
      ease: 'power3.out'
    });
  });

  // Floating stats
  const statElements = document.querySelectorAll('.stat-element');
  statElements.forEach((stat, i) => {
    gsap.from(stat, {
      scrollTrigger: { trigger: '.floating-stats-section', start: 'top 90%' },
      opacity: 0,
      y: 35,
      duration: 1.2,
      delay: i * 0.15,
      ease: 'power3.out'
    });
  });

  // FAQ Accordion toggles
  const faqQuestions = document.querySelectorAll('.faq-editorial-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const otherItems = document.querySelectorAll('.faq-editorial-item');
      
      otherItems.forEach(ot => {
        if (ot !== item) {
          ot.classList.remove('active');
          ot.querySelector('.faq-editorial-question').setAttribute('aria-expanded', 'false');
        }
      });

      const isActive = item.classList.toggle('active');
      btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  });

  // Reset Map View & Filters Click Callback
  function resetMapToDefault() {
    if (!mapInstance) return;

    // 0. Reset worldwide exploration flag
    isWorldwideActive = false;

    // 1. Reset map view to Europe center
    mapInstance.flyTo([47.5, 10.0], 4.0, {
      animate: true,
      duration: 2.5
    });

    // 2. Clear user geolocation marker
    if (userGeoMarker) {
      mapInstance.removeLayer(userGeoMarker);
      userGeoMarker = null;
    }
    userCoords = null;

    // 3. Reset geolocation button state
    if (geoBtn) {
      geoBtn.querySelector('span').textContent = "USE CURRENT LOCATION";
      geoBtn.disabled = false;
    }

    // 4. Clear search query input
    if (searchInput) {
      searchInput.value = '';
    }

    // 5. Reset Google Maps URL
    if (googleMapsBtn) {
      googleMapsBtn.href = "https://www.google.com/maps/search/?api=1&query=48.8584,2.3262";
    }

    // 6. Reset all store highlights
    Object.keys(markers).forEach(key => {
      const m = markers[key];
      const iconElement = m.getElement();
      if (iconElement) {
        iconElement.classList.remove('gold-custom-marker--active');
      }
    });

    // 7. Refresh list / filters
    selectedStoreId = null;
    filterDestinations();
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetMapToDefault);
  }

  const worldwideBtn = document.getElementById('btn-worldwide-trigger');
  if (worldwideBtn) {
    worldwideBtn.addEventListener('click', () => {
      isWorldwideActive = true;
      if (mapInstance) {
        mapInstance.flyTo([20, 10], 1.8, {
          animate: true,
          duration: 3
        });
      }
      updateMarkerStates();
    });
  }

  // Initial listing render
  showPlaceholderListing();

  // ═════════ TEARDOWN CLEANUP Lifecycle Hook ═════════
  return () => {
    // 1. Remove map instance completely to release DOM memory leaks
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
      console.log('+33 Destinations | Leaflet Map Destroyed');
    }

    // 2. Clear all triggers
    const allTriggers = ScrollTrigger.getAll();
    allTriggers.forEach(t => t.kill());

    console.log('+33 Destinations | Page Teardown Complete');
  };
}
