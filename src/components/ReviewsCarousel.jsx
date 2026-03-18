import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'

const IMAGES = [
  { src: '/IMG/IMG_6097.JPG', alt: 'המלצה 1' },
  { src: '/IMG/IMG_6098.PNG', alt: 'המלצה 2' },
  { src: '/IMG/IMG_6100.JPG', alt: 'המלצה 3' },
  { src: '/IMG/IMG_6101.JPG', alt: 'המלצה 4' },
  { src: '/IMG/IMG_6102.PNG', alt: 'המלצה 5' },
  { src: '/IMG/IMG_6103.JPG', alt: 'המלצה 6' },
  { src: '/IMG/IMG_6104.JPG', alt: 'המלצה 7' },
]

const AUTO_MS = 4500
const DRAG_THRESHOLD = 60

/* ── Lightbox ── */
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <img
        src={src} alt={alt}
        onClick={onClose}
        style={{ maxWidth: '92vw', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 30px 80px rgba(0,0,0,.7)', objectFit: 'contain' }}
      />
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >✕</button>
    </div>
  )
}

/* ── Phone-frame wrapper ── */
function PhoneFrame({ src, alt, isActive }) {
  const [lightbox, setLightbox] = useState(false)

  return (
    <>
      <div
        className="phone-frame select-none"
        style={{ opacity: isActive ? 1 : 0.38, transition: 'opacity .4s, transform .4s', flexShrink: 0, position: 'relative' }}
      >
        <div className="notch" />
        <div className="screen" style={{ overflow: 'hidden' }}>
          <img
            src={src} alt={alt} draggable={false}
            style={{ userSelect: 'none', pointerEvents: 'none', objectFit: 'cover', objectPosition: 'center top', width: '100%' }}
          />
        </div>

        {/* Magnifier button — only on active card */}
        {isActive && (
          <button
            onClick={() => setLightbox(true)}
            style={{
              position: 'absolute', top: 30, left: 12,
              background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%',
              width: 30, height: 30, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,.5)', fontSize: 13, transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.18)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = 'rgba(255,255,255,.5)' }}
            aria-label="הצג תמונה מוגדלת"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
            </svg>
          </button>
        )}

        {/* Active glow */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-[40px] pointer-events-none"
            style={{ boxShadow: '0 0 60px rgba(255,59,107,.28), 0 0 120px rgba(192,38,211,.14)' }}
          />
        )}
      </div>

      {lightbox && <Lightbox src={src} alt={alt} onClose={() => setLightbox(false)} />}
    </>
  )
}

export default function ReviewsCarousel() {
  const [current, setCurrent]   = useState(0)
  const [dir,     setDir]       = useState(1)
  const [paused,  setPaused]    = useState(false)
  const timerRef                = useRef(null)

  const n = IMAGES.length

  const go = useCallback((idx) => {
    const next = (idx + n) % n
    setDir(idx > current || (current === n - 1 && next === 0) ? 1 : -1)
    setCurrent(next)
  }, [current, n])

  const next = useCallback(() => go(current + 1), [go, current])
  const prev = useCallback(() => go(current - 1), [go, current])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, AUTO_MS)
    return () => clearTimeout(timerRef.current)
  }, [current, paused, next])

  /* Drag / swipe via Framer Motion motion values */
  const dragX = useMotionValue(0)

  const handleDragEnd = useCallback((_, info) => {
    if (info.offset.x < -DRAG_THRESHOLD) next()
    else if (info.offset.x > DRAG_THRESHOLD) prev()
    dragX.set(0)
  }, [next, prev, dragX])

  /* Slide variants */
  const variants = {
    enter:  (d) => ({ x: d > 0 ? 280 : -280, opacity: 0, scale: 0.88, rotateY: d > 0 ? 12 : -12 }),
    center: ()  => ({ x: 0,  opacity: 1, scale: 1,    rotateY: 0 }),
    exit:   (d) => ({ x: d > 0 ? -280 : 280, opacity: 0, scale: 0.88, rotateY: d > 0 ? -12 : 12 }),
  }

  const prevIdx = (current - 1 + n) % n
  const nextIdx = (current + 1) % n

  /* Progress bar value (0→1 per slide) */
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    setProgress(0)
    if (paused) return
    const start = performance.now()
    let rafId
    const tick = () => {
      const p = Math.min((performance.now() - start) / AUTO_MS, 1)
      setProgress(p)
      if (p < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [current, paused])

  return (
    <section
      id="reviews"
      className="reveal py-14 px-4 relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', width: 600, height: 600,
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(255,59,107,.07), transparent 65%)',
        }} />
      </div>

      <div className="max-w-5xl mx-auto relative text-center">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold mb-4"
          style={{ background: 'rgba(255,59,107,.10)', border: '1px solid rgba(255,59,107,.24)', color: '#ff8cab' }}
        >
          💬 מה אומרים עלינו
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.08 }}
          className="font-black text-white mb-8"
          style={{ fontSize: 'clamp(24px, 4vw, 38px)' }}
        >
          לקוחות מרוצים,{' '}
          <span className="gradient-text">אירועים בלתי נשכחים</span>
        </motion.h2>

        {/* ── 3-card stage ── */}
        <div
          className="relative flex items-center justify-center"
          style={{ minHeight: 'min(80vw, 500px)', perspective: '1200px' }}
        >
          {/* Prev card (side peek — right in RTL) — hidden on small screens */}
          <div
            className="absolute hidden sm:block"
            style={{
              right: '50%',
              transform: 'translateX(calc(50% + 220px)) scale(0.72) translateZ(-80px)',
              zIndex: 1,
              cursor: 'pointer',
            }}
            onClick={prev}
          >
            <PhoneFrame src={IMAGES[prevIdx].src} alt={IMAGES[prevIdx].alt} isActive={false} />
          </div>

          {/* Next card (side peek — left in RTL) — hidden on small screens */}
          <div
            className="absolute hidden sm:block"
            style={{
              left: '50%',
              transform: 'translateX(calc(-50% + -220px)) scale(0.72) translateZ(-80px)',
              zIndex: 1,
              cursor: 'pointer',
            }}
            onClick={next}
          >
            <PhoneFrame src={IMAGES[nextIdx].src} alt={IMAGES[nextIdx].alt} isActive={false} />
          </div>

          {/* Current card — center, animated */}
          <div className="relative z-10" style={{ perspective: '1000px' }}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={handleDragEnd}
                style={{ x: dragX, cursor: 'grab' }}
                whileTap={{ cursor: 'grabbing', scale: 0.98 }}
              >
                <PhoneFrame
                  src={IMAGES[current].src}
                  alt={IMAGES[current].alt}
                  isActive={true}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Navigation arrows ── */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            aria-label="המלצה הקודמת"
            className="w-12 h-12 rounded-full grid place-items-center text-white font-bold text-xl transition-all duration-200 hover:scale-110"
            style={{
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.15)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,59,107,.5)'; e.currentTarget.style.borderColor = '#ff3b6b' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }}
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`המלצה ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width:      i === current ? '28px' : '6px',
                  background: i === current ? '#ff3b6b' : 'rgba(255,255,255,.2)',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="המלצה הבאה"
            className="w-12 h-12 rounded-full grid place-items-center text-white font-bold text-xl transition-all duration-200 hover:scale-110"
            style={{
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.15)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,59,107,.5)'; e.currentTarget.style.borderColor = '#ff3b6b' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }}
          >
            ‹
          </button>
        </div>

        {/* Progress bar */}
        <div
          className="mt-5 mx-auto rounded-full overflow-hidden"
          style={{ width: '160px', height: '3px', background: 'rgba(255,255,255,.08)' }}
        >
          <motion.div
            key={current}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #ff3b6b, #c026d3)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <p className="mt-3 text-sm font-medium" style={{ color: '#334155' }}>
          {current + 1} מתוך {IMAGES.length}
        </p>
      </div>
    </section>
  )
}
