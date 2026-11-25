import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProductBySlug } from '../data/useProducts.js'
import { useCart } from '../context/CartContext.jsx'
import { useSettings } from '../context/SiteDataContext.jsx'
import { money, HALF_POUND_RATIO } from '../data/defaults.js'
import './ProductDetail.css'

const WEIGHTS = ['One Pound', 'Half Pound']

export default function ProductDetail() {
  const { slug } = useParams()
  const { product, loading } = useProductBySlug(slug)
  const settings = useSettings()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const [weight, setWeight] = useState(WEIGHTS[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (loading) {
    return <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>Loading…</div>
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Product not found</h1>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>We couldn't find that item. It may have been moved or renamed.</p>
        <Link to="/" className="btn btn-outline-dark">Back to Home</Link>
      </div>
    )
  }

  const half = product.hasWeight && weight === 'Half Pound'
  const unitPrice = half ? +(product.basePrice * HALF_POUND_RATIO).toFixed(2) : product.basePrice
  const oldUnit = product.compareAtPrice && product.compareAtPrice > product.basePrice
    ? (half ? +(product.compareAtPrice * HALF_POUND_RATIO).toFixed(2) : product.compareAtPrice)
    : null
  const soldOut = product.stock === 0
  const maxQty = product.stock ?? 99

  function handleAddToCart() {
    addItem(product, product.hasWeight ? weight : null, qty, unitPrice)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addItem(product, product.hasWeight ? weight : null, qty, unitPrice)
    navigate('/cart')
  }

  return (
    <section className="pdp container">
      <div className="pdp-image" style={{ backgroundImage: `url(${product.image})` }} />

      <div className="pdp-info">
        <p className="pdp-brand">{settings.storeName}</p>
        <h1>{product.name}</h1>
        <p className="pdp-price">
          {money(unitPrice * qty)}
          {oldUnit && <s className="price-old" style={{ marginLeft: 10 }}>{money(oldUnit * qty)}</s>}
        </p>
        <p className="pdp-shipping">
          {soldOut ? 'Currently sold out.' : product.stock != null && product.stock <= 5 ? `Only ${product.stock} left!` : 'In stock.'}
        </p>

        {product.description && <p className="pdp-description">{product.description}</p>}

        {product.hasWeight && (
          <div className="pdp-field">
            <span className="pdp-label">Weight</span>
            <div className="pdp-weight-options">
              {WEIGHTS.map((w) => (
                <button key={w} className={w === weight ? 'weight-btn is-active' : 'weight-btn'} onClick={() => setWeight(w)} type="button">
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pdp-field">
          <span className="pdp-label">Quantity</span>
          <div className="qty-stepper">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" type="button">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Increase quantity" type="button">+</button>
          </div>
        </div>

        <button className="btn btn-outline-dark pdp-add-btn" onClick={handleAddToCart} type="button" disabled={soldOut}>
          {soldOut ? 'Sold Out' : added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>
        {!soldOut && (
          <button className="btn btn-gold pdp-buy-btn" onClick={handleBuyNow} type="button">Buy It Now</button>
        )}

        <Link to="/" className="pdp-back-link">← Continue Shopping</Link>
      </div>
    </section>
  )
}
