// Placeholder product imagery (Unsplash source) — swap image URLs with your own
// product photography before launch.

export const heroSlides = [
  {
    id: 'bestsellers',
    eyebrow: '',
    title: 'Treat Yourself Anytime',
    subtitle: 'Delicious chocolates, sweets & snacks made to brighten your day',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=2400&auto=format&fit=crop',
    ctaLabel: 'Shop Now',
    ctaHref: '/collections/best-sellers',
    secondaryLabel: 'Explore Gifts',
    secondaryHref: '/collections/gifts',
  },
  {
    id: 'nature',
    eyebrow: '',
    title: 'From Nature to Your Table',
    subtitle: 'Freshly sourced nuts & seeds with unbeatable flavor',
    image: 'https://images.unsplash.com/photo-1728310341959-6451b2d37f28?q=80&w=2400&auto=format&fit=crop',
    ctaLabel: 'Shop Now',
    ctaHref: '/collections/nuts-seeds-snacks',
    secondaryLabel: 'Explore Gifts',
    secondaryHref: '/collections/gifts',
  },
  {
    id: 'sweets',
    eyebrow: '',
    title: 'Sweet Tradition, Modern Delight',
    subtitle: 'Authentic Turkish delights crafted with rich nuts & flavors',
    image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?q=80&w=2400&auto=format&fit=crop',
    ctaLabel: 'Shop Now',
    ctaHref: '/collections/turkish-delights',
    secondaryLabel: 'Explore Gifts',
    secondaryHref: '/collections/gifts',
  },
  {
    id: 'coffee',
    eyebrow: '',
    title: 'Rich Coffee & Tea, Every Morning',
    subtitle: 'Slow-brewed traditions, sourced with care',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2400&auto=format&fit=crop',
    ctaLabel: 'Shop Now',
    ctaHref: '/collections/coffee-tea',
    secondaryLabel: 'Explore Gifts',
    secondaryHref: '/collections/gifts',
  },
]

export const categoryTiles = [
  { label: 'Nuts & Seeds', href: '/collections/nuts-seeds-snacks', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Coffee & Tea', href: '/collections/coffee-tea', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Dates & Dried Fruit', href: '/collections/dates-dry-fruits', image: 'https://images.unsplash.com/photo-1601599963565-b7f49deb2c19?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Chocolates & Sweets', href: '/collections/chocolates-sweets', image: 'https://images.unsplash.com/photo-1548907040-4baa419e8e9c?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Turkish Delights', href: '/collections/turkish-delights', image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Spices', href: '/collections/spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop' },
]

// Every product lives in this single list.
// - category: which collection page(s) it shows up on (matches the nav/collection slugs)
// - hasWeight: true = shows the "Weight" selector (loose nuts/seeds sold by weight)
//              false = just shows Quantity (packaged items like chocolate bars, gift boxes)
export const allProducts = [
  { id: 1, name: 'Salted Persian Pistachios', basePrice: 9, hasWeight: true, category: ['nuts-seeds-snacks', 'best-sellers'], image: 'https://images.unsplash.com/photo-1610137512859-aa919f651a05?q=80&w=800&auto=format&fit=crop', href: '/products/salted-persian-pistachios' },
  { id: 2, name: 'Pistachio Dubai Chocolate Bar', basePrice: 25, hasWeight: false, category: ['chocolates-sweets', 'best-sellers'], image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800&auto=format&fit=crop', href: '/products/pistachio-dubai-chocolate-bar' },
  { id: 3, name: 'Salted Pumpkin Seeds', basePrice: 5, hasWeight: true, category: ['nuts-seeds-snacks', 'best-sellers'], image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?q=80&w=800&auto=format&fit=crop', href: '/products/salted-pumpkin-seeds' },
  { id: 4, name: 'Mixed Nuts Deluxe', basePrice: 12, hasWeight: true, category: ['nuts-seeds-snacks', 'best-sellers'], image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800&auto=format&fit=crop', href: '/products/mixed-nuts-deluxe' },
  { id: 5, name: 'Turkish Sunflower Seeds', basePrice: 4, hasWeight: true, category: ['nuts-seeds-snacks', 'best-sellers'], image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=800&auto=format&fit=crop', href: '/products/turkish-sunflower-seeds' },

  { id: 6, name: 'Nut-Stuffed Dates Mix', basePrice: 9, hasWeight: true, category: ['dates-dry-fruits', 'hot-items'], image: 'https://images.unsplash.com/photo-1593904308074-e1a53c1c4a19?q=80&w=800&auto=format&fit=crop', href: '/products/nut-stuffed-dates-mix' },
  { id: 7, name: 'Dark Chocolate with Hazelnut', basePrice: 14, hasWeight: false, category: ['chocolates-sweets', 'hot-items'], image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800&auto=format&fit=crop', href: '/products/dark-chocolate-hazelnut' },
  { id: 8, name: 'Honey Roasted Almonds', basePrice: 11, hasWeight: true, category: ['nuts-seeds-snacks', 'hot-items'], image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?q=80&w=800&auto=format&fit=crop', href: '/products/honey-roasted-almonds' },
  { id: 9, name: 'Mixed Turkish Delights 700g', basePrice: 35, hasWeight: false, category: ['turkish-delights', 'hot-items'], image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=800&auto=format&fit=crop', href: '/products/mixed-turkish-delights' },
  { id: 10, name: 'Raw Cashews', basePrice: 10, hasWeight: true, category: ['nuts-seeds-snacks', 'hot-items'], image: 'https://images.unsplash.com/photo-1563412885-e335dc45a3f7?q=80&w=800&auto=format&fit=crop', href: '/products/raw-cashews' },
  { id: 11, name: '7 Spice Blend', basePrice: 8, hasWeight: true, category: ['spices', 'hot-items'], image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop', href: '/products/seven-spice-blend' },

  { id: 20, name: 'Wrapped Sultan Delight with Chocolate & Coconut', basePrice: 12, hasWeight: true, category: ['turkish-delights', 'deals'], image: 'https://images.unsplash.com/photo-1503153554456-938cf7ee200c?q=80&w=800&auto=format&fit=crop', href: '/products/wrapped-sultan-delight' },
  { id: 21, name: 'Salted Pumpkin Seeds (Bulk)', basePrice: 5, hasWeight: true, category: ['nuts-seeds-snacks', 'deals'], image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?q=80&w=800&auto=format&fit=crop', href: '/products/salted-pumpkin-seeds-deal' },
  { id: 22, name: 'Pistachio Knafeh Chocolate Bar', basePrice: 25, hasWeight: false, category: ['chocolates-sweets', 'deals'], image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800&auto=format&fit=crop', href: '/products/pistachio-knafeh-bar' },
  { id: 23, name: 'Muluki Zatar Blend', basePrice: 7, hasWeight: true, category: ['spices', 'deals'], image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop', href: '/products/muluki-zatar' },
  { id: 24, name: 'Mayasi Snack Mix', basePrice: 6, hasWeight: true, category: ['nuts-seeds-snacks', 'deals'], image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800&auto=format&fit=crop', href: '/products/mayasi-mix' },

  { id: 30, name: 'Turkish Coffee, Cardamom Blend', basePrice: 13, hasWeight: true, category: ['coffee-tea'], image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop', href: '/products/turkish-coffee-cardamom' },
  { id: 31, name: 'Loose Leaf Black Tea', basePrice: 9, hasWeight: true, category: ['coffee-tea'], image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop', href: '/products/loose-leaf-black-tea' },

  { id: 40, name: 'Medjool Dates, Premium', basePrice: 16, hasWeight: true, category: ['dates-dry-fruits'], image: 'https://images.unsplash.com/photo-1601599963565-b7f49deb2c19?q=80&w=800&auto=format&fit=crop', href: '/products/medjool-dates' },

  { id: 50, name: 'Gourmet Gift Tray', basePrice: 45, hasWeight: false, category: ['gifts'], image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?q=80&w=800&auto=format&fit=crop', href: '/products/gourmet-gift-tray' },
]

export function getProductBySlug(slug) {
  return allProducts.find((p) => p.href === `/products/${slug}`)
}

export function getProductsByCategory(categorySlug) {
  return allProducts.filter((p) => p.category.includes(categorySlug))
}

export const bestSellers = getProductsByCategory('best-sellers')
export const hotItems = getProductsByCategory('hot-items')
export const limitedTimeDeals = getProductsByCategory('deals')
