import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Collection from './pages/Collection.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Account from './pages/Account.jsx'
import Admin from './pages/admin/Admin.jsx'

function Placeholder({ title }) {
  return (
    <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 30, marginBottom: 12 }}>{title}</h1>
      <p style={{ opacity: 0.7 }}>This page is coming soon.</p>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()

  // The admin panel has its own full-screen layout (no shop header/footer)
  if (pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    )
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:slug" element={<Collection />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/pages/*" element={<Placeholder title="Coming Soon" />} />
        <Route path="*" element={<Placeholder title="Page Not Found" />} />
      </Routes>
      <Footer />
    </>
  )
}
