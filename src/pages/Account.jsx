import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase, supabaseConfigured } from '../lib/supabaseClient.js'
import { money } from '../data/defaults.js'
import './Checkout.css'

export default function Account() {
  const { user, profile, isStaff, loading, signOut } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!user) return
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []))
  }, [user])

  if (!supabaseConfigured) return <Navigate to="/login" replace />
  if (loading) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Loading…</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <section className="container checkout-page" style={{ maxWidth: 800 }}>
      <h1>Hello{profile?.full_name ? `, ${profile.full_name}` : ''}</h1>
      <p style={{ opacity: 0.7, marginBottom: 24 }}>{user.email}</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
        {isStaff && <Link to="/admin" className="btn btn-gold">Open Admin Panel</Link>}
        <button className="btn btn-outline-dark" onClick={signOut}>Log Out</button>
      </div>

      <h2 style={{ fontSize: 20, marginBottom: 16 }}>My orders</h2>
      {orders.length === 0 && <p style={{ opacity: 0.6 }}>No orders yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders.map((o) => (
          <div key={o.id} style={{ border: '1px solid var(--color-line)', padding: 16, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <strong>#{o.id}</strong> · {new Date(o.created_at).toLocaleDateString()}
              <p style={{ fontSize: 13, opacity: 0.7 }}>{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>{money(o.subtotal)}</strong>
              <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold-deep)', fontWeight: 800 }}>{o.status}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
