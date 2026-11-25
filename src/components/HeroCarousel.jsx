import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './HeroCarousel.css'

export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length])
  const current = index % slides.length
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [next])

  return (
    <section className="hero-carousel">
      <div
        className="hero-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className="hero-slide" key={slide.id} style={{ backgroundImage: `url(${slide.image})` }}>
            <div className="hero-overlay" />
            <div className="container hero-content hero-content-center">
              {slide.eyebrow && <p className="eyebrow hero-eyebrow">{slide.eyebrow}</p>}
              <h1>{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-ctas hero-ctas-center">
                {slide.ctaLabel && <Link to={slide.ctaHref || '/'} className="btn btn-gold">{slide.ctaLabel}</Link>}
                {slide.secondaryLabel && <Link to={slide.secondaryHref || '/'} className="btn btn-outline-light">{slide.secondaryLabel}</Link>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="hero-arrow hero-arrow-left" onClick={prev} aria-label="Previous slide">‹</button>
      <button className="hero-arrow hero-arrow-right" onClick={next} aria-label="Next slide">›</button>

      <div className="hero-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={i === current ? 'dot is-active' : 'dot'}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
