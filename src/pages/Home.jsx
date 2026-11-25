import HeroCarousel from '../components/HeroCarousel.jsx'
import ProductRow from '../components/ProductRow.jsx'
import { AboutBanner, GiftBanner, CategoryGrid, AppBanner } from '../components/Sections.jsx'
import { useSiteData } from '../context/SiteDataContext.jsx'

export default function Home() {
  const { products, slides, categories, settings } = useSiteData()
  const inCat = (slug) => products.filter((p) => p.category?.includes(slug))

  return (
    <>
      {slides.length > 0 && <HeroCarousel slides={slides} />}
      <ProductRow title={settings.dealsTitle} viewAllHref="/collections/deals" products={inCat('deals')} />
      <ProductRow title={settings.bestTitle} viewAllHref="/collections/best-sellers" products={inCat('best-sellers')} />
      <AboutBanner />
      <ProductRow title={settings.hotTitle} viewAllHref="/collections/hot-items" products={inCat('hot-items')} />
      <GiftBanner />
      <CategoryGrid tiles={categories.filter((c) => c.showOnHome && c.image).map((c) => ({ label: c.name, href: `/collections/${c.slug}`, image: c.image }))} />
      {settings.showAppBanner && <AppBanner />}
    </>
  )
}
