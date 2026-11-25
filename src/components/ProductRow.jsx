import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'
import './ProductRow.css'

export default function ProductRow({ title, viewAllHref, products }) {
  if (!products || products.length === 0) return null
  return (
    <section className="product-row container">
      <div className="product-row-head">
        <h2>{title}</h2>
        {viewAllHref && <Link to={viewAllHref} className="view-all">View all →</Link>}
      </div>
      <div className="product-scroll">
        {products.map((p) => <ProductCard product={p} key={p.id} />)}
      </div>
    </section>
  )
}
