import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import SectionStars from './SectionStars'

/* ── Animated count-up ── */
function CountUp({ to, suffix = '', duration = 1800 }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const raf = () => {
      const t = Math.min((performance.now() - start) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * to))
      if (t < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [inView, to, duration])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ── SVG icons ── */
const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18.5 6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/>
  </svg>
)
const TkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M14 3h3.1a5.9 5.9 0 0 0 5 5V11a8.9 8.9 0 0 1-5-1.6v6.1A6.5 6.5 0 1 1 11 9.1V12a3.5 3.5 0 1 0 2 3.1V3z"/>
  </svg>
)

export default function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  /* Parallax on the background image */
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  /* Fade + slide content on scroll */
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-12%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])

  return (
    <section id="hero" ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: '100svh' }}>

      {/* ── Background image with parallax ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imgY, scale: 1.08, transformOrigin: 'center top' }}
      >
        {/* Desktop image */}
        <img
          src={`${import.meta.env.BASE_URL}IMG/itay.jpg`}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover hero-bg-img hidden sm:block"
          style={{ objectPosition: '72% 15%' }}
        />
        {/* Mobile image */}
        <img
          src={`${import.meta.env.BASE_URL}IMG/itay-mobile.jpg`}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover hero-bg-img block sm:hidden"
          style={{ objectPosition: 'center 3%' }}
        />
      </motion.div>

      {/* ── Dark overlay — cinematic gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(to bottom,',
            '  rgba(6,11,24,.88) 0%,',
            '  rgba(6,11,24,.52) 30%,',
            '  rgba(6,11,24,.48) 52%,',
            '  rgba(6,11,24,.72) 75%,',
            '  rgba(6,11,24,1.0) 100%',
            ')',
          ].join('\n'),
        }}
      />

      {/* ── Subtle brand glow over image ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 35%, rgba(255,59,107,.12), transparent 65%)',
        }}
      />

      <SectionStars count={10} />

      {/* ── Hero content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, minHeight: '100svh', paddingTop: '110px', paddingBottom: '40px' }}
        className="relative z-10 flex flex-col items-center justify-start text-center px-6"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-2.5 mb-2"
        >
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#ff3b6b' }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#ff3b6b' }} />
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: '#ff8cab', letterSpacing: '.04em' }}
          >
            הופכים את האירוע שלכם לחוויה בלתי נשכחת
          </span>
        </motion.div>

        {/* Main name — very large */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-black text-white leading-none mb-3"
          style={{
            fontSize: 'clamp(52px, 10vw, 110px)',
            textShadow: '0 4px 40px rgba(0,0,0,.6), 0 0 120px rgba(255,59,107,.12)',
            letterSpacing: '-.02em',
          }}
        >
          איתי יצחקי
        </motion.h1>

        {/* Subtitle with gradient */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="shimmer-text font-black mb-6"
          style={{
            fontSize: 'clamp(22px, 4.5vw, 48px)',
            letterSpacing: '-.01em',
            marginTop: '10px',
          }}
        >
          מנחה אירועים
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mb-7"
          style={{
            width: '80px', height: '2px',
            background: 'linear-gradient(90deg, transparent, #ff3b6b, #c026d3, transparent)',
          }}
        />

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="max-w-lg mb-10 text-center"
          style={{ color: 'rgba(255,255,255,.72)', fontSize: 'clamp(15px, 2vw, 17px)', lineHeight: 1.9 }}
        >
          <p>
            <strong style={{ color: '#fff', fontWeight: 700 }}>מחפשים אירוע שכולם ידברו עליו?</strong>
          </p>
          <p className="mt-2">
            מצאתי את הנוסחה המושלמת.<br />הנחיה מגבשת, ייחודית עם אינספור רגעים של צחוק והתרגשות.
          </p>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,.5)', fontSize: 'clamp(13px, 1.6vw, 15px)' }}>
            אני והצוות שלי נלווה אתכם לכל אורך הדרך.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {/* Primary */}
          <a
            href="#form"
            className="relative inline-flex items-center gap-2 font-black text-white rounded-2xl overflow-hidden group"
            style={{ fontSize: 'clamp(15px, 2vw, 17px)', padding: '14px 32px' }}
          >
            <span
              className="absolute inset-0 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #ff3b6b, #c026d3)', boxShadow: '0 8px 36px rgba(255,59,107,.52)' }}
            />
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)', transform: 'skewX(-20deg)' }}
            />
            <span className="relative">קבלת הצעת מחיר</span>
            <span className="relative text-lg">←</span>
          </a>

          {/* Secondary — WhatsApp */}
          <a
            href="https://wa.me/972559950111"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
            style={{
              fontSize: 'clamp(12px, 1.6vw, 14px)', padding: '14px 18px',
              color: '#c8f0cc',
              background: 'rgba(72,180,97,.16)',
              border: '1px solid rgba(72,180,97,.32)',
              backdropFilter: 'blur(12px)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(72,180,97,.26)'; e.currentTarget.style.borderColor = 'rgba(72,180,97,.5)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(72,180,97,.16)'; e.currentTarget.style.borderColor = 'rgba(72,180,97,.32)' }}
          >
            <svg style={{width:16,height:16,flexShrink:0}} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.107.549 4.09 1.51 5.814L0 24l6.335-1.494A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.214-3.727.978.995-3.64-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>
            שליחת הודעה ישירה
          </a>

          {/* Social */}
          <div className="flex gap-2">
            {[
              { href: 'https://www.instagram.com/itayitzhaki1?igsh=NmEzdHNiZ3lkdWs2', icon: <IgIcon />, label: 'Instagram', hc: '#E1306C', hb: 'rgba(225,48,108,.18)' },
              { href: 'https://www.tiktok.com/@itayitzhaki1?_t=ZS-90VoJc0nIxA&_r=1',  icon: <TkIcon />, label: 'TikTok',    hc: '#EE1D52', hb: 'rgba(238,29,82,.18)'  },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label}
                className="w-12 h-12 grid place-items-center rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)', backdropFilter: 'blur(8px)' }}
                onMouseEnter={e => { e.currentTarget.style.color = s.hc; e.currentTarget.style.background = s.hb; e.currentTarget.style.borderColor = s.hc + '66' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.6)'; e.currentTarget.style.background = 'rgba(255,255,255,.10)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.82 }}
          className="flex items-center rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(6,11,24,.55)',
            border: '1px solid rgba(255,255,255,.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {[
            { to: 900, suffix: '+', label: 'אירועים' },
            { to: 8,   suffix: '+', label: 'שנות ניסיון' },
            { to: 5,   suffix: '★', label: 'דירוג ממוצע' },
          ].map((s, i, arr) => (
            <div key={s.label} className="flex items-center">
              <div className="text-center px-6 py-4">
                <span
                  className="block font-black shimmer-text"
                  style={{ fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1 }}
                >
                  <CountUp to={s.to} suffix={s.suffix} />
                </span>
                <span
                  className="block mt-1.5 font-bold tracking-widest"
                  style={{ fontSize: '10px', color: 'rgba(255,255,255,.38)', textTransform: 'uppercase' }}
                >
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,.10)' }} />
              )}
            </div>
          ))}
        </motion.div>

      </motion.div>

      {/* ── Marquee pills — at very bottom of hero ── */}
      <div
        className="absolute bottom-0 inset-x-0 py-5"
        style={{
          background: 'linear-gradient(to top, rgba(6,11,24,1) 0%, rgba(6,11,24,.85) 60%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="overflow-hidden"
          style={{ maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)' }}
        >
          <div className="marquee-inner flex w-max" style={{ gap: 0 }}>
            {[
              { icon: '🎤', text: 'הנחייה מגבשת וייחודית' },
              { icon: '🎧', text: 'דיג׳י כלול בחבילה' },
              { icon: '📆', text: 'לו״ז מסודר מקצה לקצה' },
              { icon: '📸', text: 'אופציה לחבילת צילום' },
              { icon: '🎊', text: '900+ אירועים מוצלחים' },
              { icon: '🌟', text: 'דירוג 5 כוכבים' },
              { icon: '💼', text: '8+ שנות ניסיון' },
              { icon: '🤝', text: 'שירות מותאם אישית' },
              { icon: '🎤', text: 'הנחייה מגבשת וייחודית' },
              { icon: '🎧', text: 'דיג׳י כלול בחבילה' },
              { icon: '📆', text: 'לו״ז מסודר מקצה לקצה' },
              { icon: '📸', text: 'אופציה לחבילת צילום' },
              { icon: '🎊', text: '900+ אירועים מוצלחים' },
              { icon: '🌟', text: 'דירוג 5 כוכבים' },
              { icon: '💼', text: '8+ שנות ניסיון' },
              { icon: '🤝', text: 'שירות מותאם אישית' },
            ].map((p, i) => (
              <span key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0"
                style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.08)', color: '#94a3b8', marginLeft: '12px' }}
              >
                <span>{p.icon}</span>
                <span>{p.text}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
