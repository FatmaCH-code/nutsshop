import { useState } from 'react'
import { Routes, Route, NavLink, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabaseConfigured } from '../../lib/supabaseClient.js'
import Dashboard from './Dashboard.jsx'
import Products from './Products.jsx'
import Orders from './Orders.jsx'
import Categories from './Categories.jsx'
import Slides from './Slides.jsx'
import Settings from './Settings.jsx'
import Users from './Users.jsx'
import './Admin.css'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '◧', end: true },
  { to: '/admin/orders', label: 'Orders', icon: '🧾' },
  { to: '/admin/products', label: 'Products', icon: '🥜' },
  { to: '/admin/categories', label: 'Categories', icon: '▦' },
  { to: '/admin/slides', label: 'Home Slides', icon: '🖼' },
  { to: '/admin/settings', label: 'Site Settings', icon: '⚙' },
  { to: '/admin/users', label: 'Users & Roles', icon: '👤', adminOnly: true },
]

function Message({ title, children }) {
  return (
    <div className="adm-message-page">
      <img src="/gnh-mark.png" alt="Golden Nuts House" />
      <h1>{title}</h1>
      <div>{children}</div>
    </div>
  )
}

export default function Admin() {
  const { user, profile, isStaff, loading, signOut } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!supabaseConfigured) {
    return (
      <Message title="Admin unavailable">
        <p>The store database is not connected.</p>
        <Link to="/" className="adm-btn adm-btn-gold">Back to the shop</Link>
      </Message>
    )
  }
  if (loading) return <Message title="Loading…" />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!isStaff) {
    return (
      <Message title="Staff only">
        <p>You're logged in as <strong>{user.email}</strong>, but this account has no admin access.</p>
        <p>The owner can give access in Admin → Users &amp; Roles.</p>
        <Link to="/" className="adm-btn adm-btn-gold">Back to the shop</Link>
      </Message>
    )
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="adm">
      <aside className={menuOpen ? 'adm-side is-open' : 'adm-side'}>
        <Link to="/admin" className="adm-brand" onClick={() => setMenuOpen(false)}>
          <img src="/gnh-mark.png" alt="" />
          <span>Golden Nuts House<small>Admin</small></span>
        </Link>
        <nav>
          {NAV.filter((n) => !n.adminOnly || isAdmin).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? 'adm-nav is-active' : 'adm-nav')}>
              <span className="adm-nav-icon">{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noreferrer" className="adm-nav">↗ View website</a>
          <div className="adm-user">
            <span>{profile?.full_name || user.email}</span>
            <small>{profile?.role}</small>
          </div>
          <button className="adm-nav adm-logout" onClick={signOut}>⎋ Log out</button>
        </div>
      </aside>
      {menuOpen && <div className="adm-side-backdrop" onClick={() => setMenuOpen(false)} />}

      <main className="adm-main">
        <div className="adm-topbar">
          <button className="adm-icon-btn adm-burger" onClick={() => setMenuOpen(true)} aria-label="Menu">☰</button>
          <span className="adm-topbar-title">Golden Nuts House · Admin</span>
        </div>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="slides" element={<Slides />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={isAdmin ? <Users /> : <Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}
