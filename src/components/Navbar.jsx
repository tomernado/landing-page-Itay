import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background:     scrolled ? 'rgba(6,11,24,.25)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px) saturate(120%)' : 'none',
        borderBottom:   scrolled ? '1px solid rgba(255,255,255,.04)' : 'none',
        boxShadow:      'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-12 flex items-center justify-between">

        {/* Right — Logo */}
        <div className="flex flex-col leading-none">
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em', color: '#fff', opacity: 0.95 }}>
            ITAY ITZHAKI
          </span>
          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', color: '#ff3b6b', opacity: 0.85, textTransform: 'uppercase' }}>
            Events
          </span>
        </div>

        {/* Left — Socials + CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/itayitzhaki1/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,.55)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff3b6b')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.55)')}
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.tiktok.com/@itayitzhaki1"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,.55)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff3b6b')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.55)')}
          >
            <TikTokIcon />
          </a>

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,.12)' }} />

          <button
            onClick={() => {
              const el = document.getElementById('form')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
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
            לקבלת מחיר ←
          </button>
        </div>

      </div>
    </motion.nav>
  )
}
