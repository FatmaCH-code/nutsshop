import { Link } from 'react-router-dom'
import { useSettings } from '../context/SiteDataContext.jsx'
import './Sections.css'

export function AboutBanner() {
  const st = useSettings()
  return (
    <section className="about-banner">
      <div className="container about-grid">
        <div className="about-copy">
          <p className="eyebrow">Our Story</p>
          <h2>{st.aboutTitle}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{st.aboutText}</p>
          <Link to="/pages/about-us" className="btn btn-outline-dark">Read Our Story</Link>
        </div>
        <div
          className="about-image"
          style={{ backgroundImage: `url(${st.aboutImage})` }}
        />
      </div>
    </section>
  )
}

export function GiftBanner() {
  const st = useSettings()
  return (
    <section
      className="gift-banner"
      style={{ backgroundImage: `url(${st.giftImage})` }}
    >
      <div className="gift-banner-overlay" />
      <div className="container gift-banner-content">
        <p className="eyebrow" style={{ color: 'var(--color-gold)' }}>Gifting</p>
        <h2>{st.giftTitle}</h2>
        <p>{st.giftText}</p>
        <Link to="/collections/gifts" className="btn btn-gold">Shop Your Gift</Link>
      </div>
    </section>
  )
}

export function CategoryGrid({ tiles }) {
  if (!tiles || tiles.length === 0) return null
  return (
    <section className="category-grid-section container">
      <h2 className="category-grid-title">Shop by Category</h2>
      <div className="category-grid">
        {tiles.map((t) => (
          <Link to={t.href} className="category-tile" key={t.label}>
            <div className="category-tile-img" style={{ backgroundImage: `url(${t.image})` }} />
            <span>{t.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function AppBanner() {
  return (
    <section
      className="app-banner"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2000&auto=format&fit=crop)' }}
    >
      <div className="app-banner-overlay" />
      <div className="container app-banner-content">
        <h2>Enjoy Mobile Shopping</h2>
        <p>Download our app and shop smoothly, wherever you are</p>
        <div className="hero-ctas">
          <a href="#" className="btn btn-outline-light">Apple App Store</a>
          <a href="#" className="btn btn-outline-light">Google Play</a>
        </div>
      </div>
    </section>
  )
}
