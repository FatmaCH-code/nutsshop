import { Link } from 'react-router-dom'
import { money } from '../data/defaults.js'

export function PriceTag({ product }) {
  const prefix = product.hasWeight ? 'From ' : ''
  const onSale = product.compareAtPrice && product.compareAtPrice > product.basePrice
  return (
    <span className="price-tag">
      {prefix}{money(product.basePrice)}
      {onSale && <s className="price-old">{money(product.compareAtPrice)}</s>}
    </span>
  )
}

export default function ProductCard({ product, className = 'product-card' }) {
  const soldOut = product.stock === 0
  const onSale = product.compareAtPrice && product.compareAtPrice > product.basePrice
  return (
    <Link to={product.href} className={className}>
      <div className={`${className}-img`} style={{ backgroundImage: `url(${product.image})` }}>
        {soldOut ? <span className="card-badge card-badge-dark">Sold out</span> : onSale && <span className="card-badge">Sale</span>}
      </div>
      <p className={`${className}-name`}>{product.name}</p>
      <p className={`${className}-price`}><PriceTag product={product} /></p>
    </Link>
  )
}
