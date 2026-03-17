import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'ראשי',     href: '#hero' },
  { label: 'מה כלול',  href: '#features' },
  { label: 'המלצות',   href: '#reviews' },
  { label: 'צור קשר',  href: '#form' },
]

function smoothScroll(href) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState('#hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1))
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background:     scrolled ? 'rgba(6,11,24,.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px) saturate(180%)' : 'none',
        borderBottom:   scrolled ? '1px solid rgba(255,255,255,.07)' : 'none',
        boxShadow:      scrolled ? '0 4px 32px rgba(0,0,0,.35)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-11 flex items-center justify-center gap-1">

        {NAV_LINKS.map(link => (
          <button
            key={link.href}
            onClick={() => smoothScroll(link.href)}
            className="relative px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              color:      active === link.href ? '#fff' : '#64748b',
              background: active === link.href ? 'rgba(255,255,255,.07)' : 'transparent',
              border:     'none',
              cursor:     'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {link.label}
            {active === link.href && (
              <motion.span
                layoutId="nav-dot"
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: '#ff3b6b' }}
              />
            )}
          </button>
        ))}

        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.12)', margin: '0 4px' }} />

        <button
          onClick={() => smoothScroll('#form')}
          className="inline-flex items-center gap-1.5 font-black text-white rounded-lg relative group flex-shrink-0"
          style={{
            fontSize: '13px', padding: '6px 14px', whiteSpace: 'nowrap',
            background: 'linear-gradient(135deg, #ff3b6b, #c026d3)',
            boxShadow: '0 3px 14px rgba(255,59,107,.38)',
            border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 22px rgba(255,59,107,.55)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 3px 14px rgba(255,59,107,.38)')}
        >
          <span className="relative z-10">לקבלת מחיר</span>
          <span className="relative z-10 text-sm">←</span>
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent)', transform: 'skewX(-20deg)' }}
          />
        </button>
      </div>
    </motion.nav>
  )
}
