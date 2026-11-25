import { Link } from 'react-router-dom'
import { footerCollections, footerMenu } from '../data/nav.js'
import { useSettings } from '../context/SiteDataContext.jsx'
import './Footer.css'

export default function Footer() {
  const st = useSettings()
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/gnh-logo.png" alt={st.storeName} className="footer-logo" />
          <p>{st.footerText}</p>
          <p className="footer-address">
            {st.address}
            {st.phone && <><br />{st.phone}</>}
            {st.hours && <><br />{st.hours}</>}
          </p>
          {st.email && <p><a href={`mailto:${st.email}`}>{st.email}</a></p>}
        </div>

        <div className="footer-col">
          <h4>Collections</h4>
          <ul>
            {footerCollections.map((c) => (
              <li key={c.label}><Link to={c.href}>{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Menu</h4>
          <ul>
            {footerMenu.map((m) => (
              <li key={m.label}><Link to={m.href}>{m.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h4>Visit Us</h4>
          <p>{st.thankYouText}</p>
          <div className="footer-social">
            {st.facebook && <a href={st.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">FB</a>}
            {st.instagram && <a href={st.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>}
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {st.storeName}®. All rights reserved.</span>
        <span className="footer-tagline">{st.tagline}</span>
      </div>
    </footer>
  )
}
