import { useSiteData } from '../context/SiteDataContext.jsx'

// Thin helpers on top of SiteDataContext (live Supabase data with local fallback).
export function useProducts() {
  const { products, loading, isLive } = useSiteData()
  return { products, loading, isLive }
}

export function useProductBySlug(slug) {
  const { products, loading } = useSiteData()
  return { product: products.find((p) => p.slug === slug), loading }
}

export function useProductsByCategory(categorySlug) {
  const { products, loading } = useSiteData()
  return { products: products.filter((p) => p.category?.includes(categorySlug)), loading }
}

export function useCategoryName(slug) {
  const { categories } = useSiteData()
  return categories.find((c) => c.slug === slug)?.name
}
