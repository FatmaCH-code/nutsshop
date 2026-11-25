import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabaseClient.js'
import { allProducts as localProducts, heroSlides as localSlides, categoryTiles } from '../data/products.js'
import { DEFAULT_SETTINGS, DEFAULT_CATEGORIES } from '../data/defaults.js'

const SiteDataContext = createContext(null)

export function normalizeProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    basePrice: Number(row.base_price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    hasWeight: row.has_weight,
    category: row.category || [],
    image: row.image_url,
    stock: row.stock,
    isActive: row.is_active,
    href: `/products/${row.slug}`,
  }
}

function normalizeSlide(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image: row.image_url,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
    secondaryLabel: row.secondary_label,
    secondaryHref: row.secondary_href,
  }
}

// Offline fallback (used until Supabase is connected / seeded)
const tileBySlug = Object.fromEntries(categoryTiles.map((t) => [t.href.split('/').pop(), t.image]))
const FALLBACK = {
  products: localProducts.map((p) => ({ ...p, slug: p.href.split('/').pop(), description: '', compareAtPrice: null, stock: null })),
  slides: localSlides,
  categories: DEFAULT_CATEGORIES.map((c) => ({
    ...c,
    image: tileBySlug[c.slug] || null,
    showOnHome: Boolean(tileBySlug[c.slug]),
  })),
  settings: DEFAULT_SETTINGS,
}

export function SiteDataProvider({ children }) {
  const [data, setData] = useState({ ...FALLBACK, loading: supabaseConfigured, isLive: false })

  const refresh = useCallback(async () => {
    if (!supabaseConfigured) return
    const [p, s, c, st] = await Promise.all([
      supabase.from('products').select('*').eq('is_active', true).order('sort_order').order('created_at', { ascending: false }),
      supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('site_settings').select('data').eq('id', 1).maybeSingle(),
    ])
    setData({
      products: p.data && p.data.length ? p.data.map(normalizeProduct) : FALLBACK.products,
      slides: s.data && s.data.length ? s.data.map(normalizeSlide) : FALLBACK.slides,
      categories:
        c.data && c.data.length
          ? c.data.map((r) => ({ slug: r.slug, name: r.name, image: r.image_url, showOnHome: r.show_on_home }))
          : FALLBACK.categories,
      settings: { ...DEFAULT_SETTINGS, ...(st.data?.data || {}) },
      loading: false,
      isLive: Boolean(p.data && p.data.length),
    })
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return <SiteDataContext.Provider value={{ ...data, refresh }}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext)
  if (!ctx) throw new Error('useSiteData must be used within a SiteDataProvider')
  return ctx
}

export function useSettings() {
  return useSiteData().settings
}
