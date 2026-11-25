import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useSiteData } from '../context/SiteDataContext.jsx'
import { supabase, supabaseConfigured } from '../lib/supabaseClient.js'
import { money } from '../data/defaults.js'
import './Checkout.css'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user, profile } = useAuth()
  const { settings, refresh } = useSiteData()

  const [form, setForm] = useState({
    name: profile?.full_name || '',
    email: user?.email || '',
    phone: '',
    delivery_method: 'pickup',
    address: '',
    notes: '',
  })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function placeOrder(e) {
    e.preventDefault()
    setError('')
    if (!supabaseConfigured) {
      setError('Online ordering is temporarily unavailable. Please call the store.')
      return
    }
    setSending(true)
    const cart = items.map((i) => ({ id: i.id, weight: i.weight, qty: i.qty }))
    const { data, error } = await supabase.rpc('place_order', { customer: form, cart })
    setSending(false)
    if (error) {
      setError(error.message)
      return
    }
    setOrderId(data)
    clearCart()
    refresh()
  }

  if (orderId) {
    return (
      <section className="container checkout-done">
        <img src="/gnh-mark.png" alt="" className="checkout-done-logo" />
        <h1>Thank you, {form.name.split(' ')[0]}!</h1>
        <p>Your order <strong>#{orderId}</strong> has been received.</p>
        <p className="checkout-note">{settings.checkoutNote}</p>
        <Link to="/" className="btn btn-gold">Back to Shop</Link>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container cart-empty" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: 12 }}>Checkout</h1>
        <p style={{ marginBottom: 24, opacity: 0.7 }}>Your cart is empty.</p>
        <Link to="/" className="btn btn-gold">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <section className="container checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Your details</h2>
          <label>Full name<input value={form.name} onChange={set('name')} required /></label>
          <div className="checkout-two">
            <label>Email<input type="email" value={form.email} onChange={set('email')} required /></label>
            <label>Phone<input type="tel" value={form.phone} onChange={set('phone')} required /></label>
          </div>

          <h2>How do you want it?</h2>
          <div className="checkout-options">
            <label className={form.delivery_method === 'pickup' ? 'opt is-active' : 'opt'}>
              <input type="radio" name="dm" value="pickup" checked={form.delivery_method === 'pickup'} onChange={set('delivery_method')} />
              <span><strong>Pickup in store</strong><small>{settings.address}</small></span>
            </label>
            <label className={form.delivery_method === 'delivery' ? 'opt is-active' : 'opt'}>
              <input type="radio" name="dm" value="delivery" checked={form.delivery_method === 'delivery'} onChange={set('delivery_method')} />
              <span><strong>Local delivery</strong><small>We'll call to confirm the delivery fee</small></span>
            </label>
          </div>
          {form.delivery_method === 'delivery' && (
            <label>Delivery address<textarea rows={2} value={form.address} onChange={set('address')} required /></label>
          )}
          <label>Order notes (optional)<textarea rows={3} value={form.notes} onChange={set('notes')} placeholder="Gift message, preferred time…" /></label>

          {error && <p className="checkout-error">{error}</p>}
          <button className="btn btn-gold checkout-submit" disabled={sending}>
            {sending ? 'Placing order…' : `Place Order · ${money(subtotal)}`}
          </button>
          <p className="checkout-note">{settings.checkoutNote}</p>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          {items.map((i) => (
            <div className="checkout-line" key={i.lineId}>
              <div className="checkout-line-img" style={{ backgroundImage: `url(${i.image})` }}>
                <span>{i.qty}</span>
              </div>
              <div>
                <p className="checkout-line-name">{i.name}</p>
                {i.weight && <p className="checkout-line-meta">{i.weight}</p>}
              </div>
              <p>{money(i.unitPrice * i.qty)}</p>
            </div>
          ))}
          <div className="checkout-total"><span>Total</span><span>{money(subtotal)}</span></div>
        </aside>
      </div>
    </section>
  )
}
