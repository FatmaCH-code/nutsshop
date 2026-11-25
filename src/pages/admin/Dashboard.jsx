import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'
import { money } from '../../data/defaults.js'
import { PageHead } from './shared.jsx'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    async function load() {
      const [orders, products] = await Promise.all([
        supabase.from('orders').select('id, created_at, customer_name, subtotal, status, items').order('created_at', { ascending: false }),
        supabase.from('products').select('id, name, stock, is_active'),
      ])
      const o = orders.data || []
      const p = products.data || []
      const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0)
      const today = new Date().toDateString()
      const valid = o.filter((x) => x.status !== 'cancelled')
      setStats({
        newOrders: o.filter((x) => x.status === 'new').length,
        todayOrders: o.filter((x) => new Date(x.created_at).toDateString() === today).length,
        monthSales: valid.filter((x) => new Date(x.created_at) >= startOfMonth).reduce((s, x) => s + Number(x.subtotal), 0),
        totalSales: valid.reduce((s, x) => s + Number(x.subtotal), 0),
        products: p.length,
        hidden: p.filter((x) => !x.is_active).length,
      })
      setRecent(o.slice(0, 6))
      setLowStock(p.filter((x) => x.stock != null && x.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 8))
    }
    load()
  }, [])

  if (!stats) return <p className="adm-loading">Loading dashboard…</p>

  return (
    <>
      <PageHead title="Dashboard" subtitle="Overview of your store" />
      <div className="adm-stats">
        <Link to="/admin/orders" className="adm-stat is-gold"><span>New orders</span><strong>{stats.newOrders}</strong></Link>
        <div className="adm-stat"><span>Orders today</span><strong>{stats.todayOrders}</strong></div>
        <div className="adm-stat"><span>Sales this month</span><strong>{money(stats.monthSales)}</strong></div>
        <div className="adm-stat"><span>All-time sales</span><strong>{money(stats.totalSales)}</strong></div>
        <Link to="/admin/products" className="adm-stat"><span>Products</span><strong>{stats.products}</strong><small>{stats.hidden} hidden</small></Link>
      </div>

      <div className="adm-two">
        <section className="adm-card">
          <div className="adm-card-head"><h2>Latest orders</h2><Link to="/admin/orders">See all →</Link></div>
          {recent.length === 0 && <p className="adm-empty">No orders yet.</p>}
          {recent.map((o) => (
            <div className="adm-mini-row" key={o.id}>
              <span><strong>#{o.id}</strong> {o.customer_name}</span>
              <span className={`adm-status s-${o.status}`}>{o.status}</span>
              <span>{money(o.subtotal)}</span>
            </div>
          ))}
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><h2>Low stock</h2><Link to="/admin/products">Manage →</Link></div>
          {lowStock.length === 0 && <p className="adm-empty">Nothing running low 👍</p>}
          {lowStock.map((p) => (
            <div className="adm-mini-row" key={p.id}>
              <span>{p.name}</span>
              <span className={p.stock === 0 ? 'adm-status s-cancelled' : 'adm-status s-preparing'}>{p.stock === 0 ? 'Sold out' : `${p.stock} left`}</span>
            </div>
          ))}
        </section>
      </div>

      <section className="adm-card adm-quick">
        <h2>Quick actions</h2>
        <div>
          <Link className="adm-btn adm-btn-gold" to="/admin/products?new=1">+ Add product</Link>
          <Link className="adm-btn" to="/admin/slides">Change home slides</Link>
          <Link className="adm-btn" to="/admin/settings">Edit texts & contact info</Link>
        </div>
      </section>
    </>
  )
}
