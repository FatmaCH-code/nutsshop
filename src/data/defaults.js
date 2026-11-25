// Default site content. Everything here can be overridden from
// Admin → Settings (saved in Supabase `site_settings`).
export const DEFAULT_SETTINGS = {
  storeName: 'Golden Nuts House',
  tagline: 'Nuts • Coffee • Gifts • Luxury',
  announcement: 'Freshly roasted daily · Premium quality every time',
  address: '2499 Bethel Rd, Columbus, OH 43220',
  phone: '',
  email: '',
  hours: '',
  facebook: 'https://www.facebook.com/goldennutshouse',
  instagram: 'https://www.instagram.com/goldennutshouse',
  footerText:
    'Good nuts. Great coffee. Lasting memories. Premium nuts, coffee, sweets and gifts — roasted fresh and packed with care in Columbus, Ohio.',
  aboutTitle: 'Who is Golden Nuts House?',
  aboutText:
    'We roast premium nuts in small batches every day, and pair them with rich coffee, hand-picked dried fruit, sweets and gift trays. Every product reflects one promise: premium quality, every time.',
  aboutImage:
    'https://images.unsplash.com/photo-1601599963565-b7f49deb2c19?q=80&w=1600&auto=format&fit=crop',
  giftTitle: 'A Gift of Taste & Tradition',
  giftText: 'From premium nuts to sweets, perfect for every occasion',
  giftImage:
    'https://images.unsplash.com/photo-1607920591413-4ec007e70023?q=80&w=2000&auto=format&fit=crop',
  showAppBanner: false,
  dealsTitle: 'Limited-Time Discounts',
  bestTitle: "Bestsellers Everyone's Looking For",
  hotTitle: 'Hot Items',
  checkoutNote:
    'Pay in store at pickup, or on delivery. We will call you to confirm your order.',
  thankYouText: 'Thank you for supporting local!',
}

export const DEFAULT_CATEGORIES = [
  { slug: 'nuts-seeds-snacks', name: 'Nuts, Seeds & Snacks' },
  { slug: 'coffee-tea', name: 'Coffee & Tea' },
  { slug: 'dates-dry-fruits', name: 'Dates & Dry Fruits' },
  { slug: 'chocolates-sweets', name: 'Chocolates & Sweets' },
  { slug: 'turkish-delights', name: 'Turkish Delights' },
  { slug: 'spices', name: 'Spices' },
  { slug: 'gifts', name: 'Gifts' },
  { slug: 'best-sellers', name: 'Best Sellers' },
  { slug: 'hot-items', name: 'Hot Items' },
  { slug: 'deals', name: 'Limited-Time Discounts' },
]

export const ORDER_STATUSES = ['new', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']

export function money(n) {
  return `$${Number(n || 0).toFixed(2)}`
}

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const HALF_POUND_RATIO = 0.6
