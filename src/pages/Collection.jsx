import { useParams, Link } from 'react-router-dom'
import { useProductsByCategory, useCategoryName } from '../data/useProducts.js'
import ProductCard from '../components/ProductCard.jsx'
import './Collection.css'

export default function Collection() {
  const { slug } = useParams()
  const { products, loading } = useProductsByCategory(slug)
  const title = useCategoryName(slug) || slug.replace(/-/g, ' ')

  return (
    <section className="collection-page container">
      <h1 style={{ textTransform: 'capitalize' }}>{title}</h1>
      <p className="collection-count">{loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''}`}</p>

      {!loading && products.length === 0 ? (
        <div className="collection-empty">
          <p>No products in this collection yet.</p>
          <Link to="/" className="btn btn-outline-dark">Back to Home</Link>
        </div>
      ) : (
        <div className="collection-grid">
          {products.map((p) => <ProductCard product={p} key={p.id} className="collection-card" />)}
        </div>
      )}
    </section>
  )
}
