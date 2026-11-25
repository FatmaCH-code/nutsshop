import { useState } from 'react'
import { Link } from 'react-router-dom'
import { nav } from '../data/nav.js'
import { useCart } from '../context/CartContext.jsx'
import { useSettings } from '../context/SiteDataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './Header.css'

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { totalCount } = useCart()
  const settings = useSettings()
  const { isStaff } = useAuth()

  return (
    <header className="site-header">
      {settings.announcement && <div className="announce-bar">{settings.announcement}</div>}

      <div className="header-top container">
        <button
          className="hamburger"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <span /><span /><span />
        </button>

        <Link to="/" className="logo" aria-label={settings.storeName}>
          <img src="/gnh-mark.png" alt="" className="logo-img" />
          <span className="logo-text">
            <span className="logo-word">Golden Nuts<span className="logo-reg">®</span></span>
            <span className="logo-sub">House</span>
          </span>
        </Link>

        <div className="header-actions">
          {isStaff && <Link to="/admin" className="admin-pill">Admin</Link>}
          <button className="icon-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <Link to="/account" className="icon-btn" aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
          <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>
        </div>
      </div>

      <div className="header-bottom container">
        <nav className="main-nav" onMouseLeave={() => setOpenMenu(null)}>
          <ul>
            {nav.map((item) => {
              const hasMenu = item.columns || item.links
              return (
                <li
                  key={item.label}
                  onMouseEnter={() => setOpenMenu(item.label)}
                  className={openMenu === item.label ? 'is-open' : ''}
                >
                  <Link to={item.href} className={hasMenu ? 'has-caret' : ''}>
                    {item.label}
                    {hasMenu && (
                      <svg className="caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    )}
                  </Link>

                  {hasMenu && openMenu === item.label && (
                    <div className="mega-menu">
                      <div className="mega-menu-inner">
                        {item.columns
                          ? item.columns.map((col) => (
                              <div className="mega-col" key={col.title}>
                                <Link to={col.href} className="mega-col-title">{col.title}</Link>
                                <ul>
                                  {col.links.map((l) => (
                                    <li key={l.label}><Link to={l.href}>{l.label}</Link></li>
                                  ))}
                                </ul>
                              </div>
                            ))
                          : (
                            <div className="mega-col">
                              <ul>
                                {item.links.map((l) => (
                                  <li key={l.label}><Link to={l.href}>{l.label}</Link></li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {mobileOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-header">
            <img src="/gnh-mark.png" alt={settings.storeName} style={{ height: 44 }} />
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">✕</button>
          </div>
          <ul className="mobile-nav-list">
            {nav.map((item) => (
              <li key={item.label}>
                <Link to={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
