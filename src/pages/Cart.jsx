import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import './Cart.css'

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container cart-empty">
        <h1>Your Cart</h1>
        <p>Your cart is empty right now.</p>
        <Link to="/" className="btn btn-gold">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <section className="container cart-page">
      <h1>Your Cart</h1>

      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-row" key={item.lineId}>
            <div className="cart-row-img" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="cart-row-info">
              <p className="cart-row-name">{item.name}</p>
              {item.weight && <p className="cart-row-weight">{item.weight}</p>}
              <button className="cart-remove" onClick={() => removeItem(item.lineId)}>Remove</button>
            </div>
            <div className="qty-stepper">
              <button onClick={() => updateQty(item.lineId, item.qty - 1)} aria-label="Decrease quantity">−</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.lineId, item.qty + 1)} aria-label="Increase quantity">+</button>
            </div>
            <p className="cart-row-price">${(item.unitPrice * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <p className="cart-summary-note">Pickup in store or local delivery — choose at checkout.</p>
        <Link to="/checkout" className="btn btn-gold cart-checkout-btn">Checkout</Link>
        <button className="cart-clear-link" onClick={clearCart}>Clear cart</button>
      </div>
    </section>
  )
}
