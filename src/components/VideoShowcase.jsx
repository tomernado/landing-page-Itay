import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useInView } from 'framer-motion'
import SectionStars from './SectionStars'

const BASE = import.meta.env.BASE_URL

const VIDEOS = [
  { id: 'news',     label: 'חדשות',      src: `${BASE}videos/news.mp4`,     poster: `${BASE}videos/news-poster.jpg` },
  { id: 'birthday', label: 'יום הולדת',  src: `${BASE}videos/birthday.mp4`, poster: `${BASE}videos/birthday-poster.jpg` },
  { id: 'london',   label: 'לונדון',     src: `${BASE}videos/london.mp4`,   poster: `${BASE}videos/london-poster.jpg` },
  { id: 'tiktok',   label: 'טיקטוק',     src: `${BASE}videos/tiktok.mp4`,   poster: `${BASE}videos/tiktok-poster.jpg` },
]

const DRAG_THRESHOLD = 60
const UNMUTED_VOLUME = 0.75

function MicIcon({ muted }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
      <path d="M19 11a7 7 0 0 1-14 0" />
      <line x1="12" y1="18" x2="12" y2="22" />
      {muted && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  )
}

/* ── Fullscreen video overlay ── */
function VideoLightbox({ src, startTime, onClose }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(videoRef.current?.currentTime) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(10px)' }}
      onClick={() => onClose(videoRef.current?.currentTime)}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        controls
        playsInline
        onLoadedMetadata={() => { if (videoRef.current) videoRef.current.currentTime = startTime }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '92vw', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 30px 80px rgba(0,0,0,.7)' }}
      />
      <button
        onClick={() => onClose(videoRef.current?.currentTime)}
        aria-label="סגור"
        style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
      >✕</button>
    </div>
  )
}

/* ── One card in the 3-card stage ── */
function VideoCard({ video, isActive, canLoad, muted, onToggleMute, onExpand, onEnded, videoRef }) {
  const showVideo = isActive && canLoad
  return (
    <div
      className="relative select-none"
      style={{
        width: 'min(72vw, 260px)',
        aspectRatio: '9 / 16',
        borderRadius: '28px',
        overflow: 'hidden',
        opacity: isActive ? 1 : 0.4,
        filter: isActive ? 'none' : 'blur(3px)',
        transition: 'opacity .4s, filter .4s',
        background: '#0d1220',
        border: '1px solid rgba(255,255,255,.12)',
        boxShadow: isActive ? '0 0 60px rgba(255,59,107,.28), 0 0 120px rgba(192,38,211,.14)' : 'none',
      }}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          preload="auto"
          autoPlay
          muted={muted}
          playsInline
          onEnded={onEnded}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <img
          src={video.poster}
          alt={video.label}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        />
      )}

      {showVideo && (
        <>
          <button
            onClick={onToggleMute}
            aria-label={muted ? 'הפעל קול' : 'השתק'}
            style={{
              position: 'absolute', top: 10, left: 10,
              background: 'rgba(255,255,255,.10)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,.15)', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: muted ? 'rgba(255,255,255,.65)' : '#ff8cab',
            }}
          >
            <MicIcon muted={muted} />
          </button>
          <button
            onClick={onExpand}
            aria-label="הגדל למסך מלא"
            style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(255,255,255,.10)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,.15)', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,.75)',
            }}
          >
            <ExpandIcon />
          </button>
        </>
      )}
    </div>
  )
}

export default function VideoShowcase() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)
  const [muted, setMuted] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const videoRef = useRef(null)
  const sectionRef = useRef(null)
  // Don't fetch any video until the section is actually about to be seen —
  // otherwise it competes for bandwidth with the Hero's own images on load.
  const canLoad = useInView(sectionRef, { once: true, amount: 0.2 })

  const n = VIDEOS.length

  const go = useCallback((idx) => {
    const nextIdx = (idx + n) % n
    setDir(idx > current || (current === n - 1 && nextIdx === 0) ? 1 : -1)
    setMuted(true)
    setCurrent(nextIdx)
  }, [current, n])

  const next = useCallback(() => go(current + 1), [go, current])
  const prev = useCallback(() => go(current - 1), [go, current])

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const newMuted = !m
      if (videoRef.current) {
        videoRef.current.muted = newMuted
        if (!newMuted) videoRef.current.volume = UNMUTED_VOLUME
      }
      return newMuted
    })
  }, [])

  const openLightbox = useCallback(() => {
    setLightbox({ startTime: videoRef.current?.currentTime ?? 0 })
    videoRef.current?.pause()
  }, [])

  const closeLightbox = useCallback((endTime) => {
    setLightbox(null)
    const v = videoRef.current
    if (v) {
      if (typeof endTime === 'number') v.currentTime = endTime
      v.play()
    }
  }, [])

  const dragX = useMotionValue(0)
  const handleDragEnd = useCallback((_, info) => {
    if (info.offset.x < -DRAG_THRESHOLD) next()
    else if (info.offset.x > DRAG_THRESHOLD) prev()
    dragX.set(0)
  }, [next, prev, dragX])

  const variants = {
    enter:  (d) => ({ x: d > 0 ? 240 : -240, opacity: 0, scale: 0.88 }),
    center: ()  => ({ x: 0, opacity: 1, scale: 1 }),
    exit:   (d) => ({ x: d > 0 ? -240 : 240, opacity: 0, scale: 0.88 }),
  }

  const prevIdx = (current - 1 + n) % n
  const nextIdx = (current + 1) % n

  return (
    <section id="videos" ref={sectionRef} className="reveal py-14 px-4 relative overflow-hidden">
      <SectionStars count={7} />

      <div className="max-w-5xl mx-auto relative text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold mb-4"
          style={{ background: 'rgba(255,59,107,.10)', border: '1px solid rgba(255,59,107,.24)', color: '#ff8cab' }}
        >
          🎥 מאחורי הקלעים
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.08 }}
          className="font-black text-white mb-4"
          style={{ fontSize: 'clamp(24px, 4vw, 38px)' }}
        >
          תראו את זה בעצמכם<br />
          <span className="gradient-text">רגעים אמיתיים מהבמה</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.12 }}
          className="max-w-lg mx-auto mb-10"
          style={{ color: 'rgba(255,255,255,.6)', fontSize: 'clamp(14px, 1.8vw, 16px)' }}
        >
          קטעים נבחרים מתוך אירועים אמיתיים — כי סרטון אחד שווה יותר מכל תיאור.
        </motion.p>

        <div className="relative flex items-center justify-center" style={{ minHeight: 'min(115vw, 500px)', perspective: '1400px' }}>
          <div
            className="absolute"
            style={{ right: '50%', transform: 'translateX(calc(50% + min(150px, 34vw))) scale(0.72)', zIndex: 1, cursor: 'pointer' }}
            onClick={prev}
          >
            <VideoCard video={VIDEOS[prevIdx]} isActive={false} />
          </div>

          <div
            className="absolute"
            style={{ left: '50%', transform: 'translateX(calc(-50% - min(150px, 34vw))) scale(0.72)', zIndex: 1, cursor: 'pointer' }}
            onClick={next}
          >
            <VideoCard video={VIDEOS[nextIdx]} isActive={false} />
          </div>

          <div className="relative z-10">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                variants={variants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18}
                onDragEnd={handleDragEnd}
                style={{ x: dragX, cursor: 'grab' }}
                whileTap={{ cursor: 'grabbing', scale: 0.98 }}
              >
                <VideoCard
                  video={VIDEOS[current]}
                  isActive={true}
                  canLoad={canLoad}
                  muted={muted}
                  onToggleMute={toggleMute}
                  onExpand={openLightbox}
                  onEnded={next}
                  videoRef={videoRef}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            aria-label="הסרטון הקודם"
            className="w-12 h-12 rounded-full grid place-items-center text-white font-bold text-xl transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', backdropFilter: 'blur(12px)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,59,107,.5)'; e.currentTarget.style.borderColor = '#ff3b6b' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }}
          >
            ‹
          </button>

          <div className="flex items-center gap-2">
            {VIDEOS.map((v, i) => (
              <button
                key={v.id}
                onClick={() => go(i)}
                aria-label={v.label}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === current ? '28px' : '6px', background: i === current ? '#ff3b6b' : 'rgba(255,255,255,.2)' }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="הסרטון הבא"
            className="w-12 h-12 rounded-full grid place-items-center text-white font-bold text-xl transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', backdropFilter: 'blur(12px)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,59,107,.5)'; e.currentTarget.style.borderColor = '#ff3b6b' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }}
          >
            ›
          </button>
        </div>
      </div>

      {lightbox && (
        <VideoLightbox src={VIDEOS[current].src} startTime={lightbox.startTime} onClose={closeLightbox} />
      )}
    </section>
  )
}
