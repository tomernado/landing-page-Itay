# Video Showcase Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a video showcase carousel section directly after the Hero, playing 4 real event
clips (NEWS, BIRTHDAY, LONDON, TIKTOK), matching the spec at
`docs/superpowers/specs/2026-07-23-video-showcase-design.md`.

**Architecture:** A new `VideoShowcase.jsx` component reusing the existing `ReviewsCarousel`
3-card-stage pattern (center plays, sides peek blurred/dimmed as static posters), plus a
one-time ffmpeg transcode of the 4 huge HEVC source clips into small web-friendly MP4s + poster
JPGs.

**Tech Stack:** React 18, Framer Motion, Tailwind, Vite, ffmpeg (asset prep only, not a runtime
dependency).

## Global Constraints

- This project has **no test runner** (no Jest/Vitest, `package.json` has none installed) and
  no existing test files anywhere — it's a marketing site verified visually. Do not introduce a
  test framework. "Verification" steps in this plan use a headless-browser script (Playwright,
  already available in this environment via `npx playwright`) to take screenshots and drive
  interactions — that is this project's actual QA method, matching how prior work in this
  session was verified.
- Served static assets **must** live in `public/` (Vite only copies `public/` to the production
  build — see `public/IMG/`). Never place site assets in a root-level folder outside `public/`.
- RTL site (`dir="rtl"` on `<html>`) — CSS `left`/`right` are physical, not logical, throughout
  this codebase (see `ReviewsCarousel.jsx`'s `PhoneFrame` magnifier button at `left: 12`). Match
  that convention, don't introduce logical properties (`inset-inline-start` etc.) elsewhere.
- Component/copy conventions to match exactly: badge pill (`rgba(255,59,107,.10)` bg,
  `1px solid rgba(255,59,107,.24)` border, `#ff8cab` text), `gradient-text` class for the accent
  heading line, `SectionStars` background component, arrow/dot styling — all copied verbatim
  from `ReviewsCarousel.jsx`.

---

### Task 1: Transcode the 4 source videos into web-ready assets

**Files:**
- Create: `public/videos/news.mp4`, `public/videos/news-poster.jpg`
- Create: `public/videos/birthday.mp4`, `public/videos/birthday-poster.jpg`
- Create: `public/videos/london.mp4`, `public/videos/london-poster.jpg`
- Create: `public/videos/tiktok.mp4`, `public/videos/tiktok-poster.jpg`
- Reads from (already in place): `public/IMG/NEWS.MOV`, `public/IMG/BIRTHDAY.MOV`,
  `public/IMG/LONDON.MOV`, `public/IMG/TIKTOK.MOV`

**Interfaces:**
- Produces: the exact file paths above, which Task 2's `VIDEOS` array references directly by
  URL (`${import.meta.env.BASE_URL}videos/<name>.mp4` / `-poster.jpg`).

- [ ] **Step 1: Create the output directory**

```bash
mkdir -p "public/videos"
```

- [ ] **Step 2: Transcode all 4 clips + extract posters (run in background — this takes several minutes)**

```bash
for pair in "NEWS:news" "BIRTHDAY:birthday" "LONDON:london" "TIKTOK:tiktok"; do
  src="${pair%%:*}"
  out="${pair##*:}"
  ffmpeg -y -i "public/IMG/${src}.MOV" \
    -vf "scale=720:-2" -c:v libx264 -preset slow -crf 26 -profile:v main \
    -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart \
    "public/videos/${out}.mp4"
  ffmpeg -y -ss 00:00:01 -i "public/IMG/${src}.MOV" \
    -vf "scale=720:-2" -frames:v 1 -q:v 3 \
    "public/videos/${out}-poster.jpg"
done
```

Run this with the Bash tool's `run_in_background: true` (4 videos × ~40-56s source footage at
`preset slow` will take a while) and check back via the task notification rather than polling.

- [ ] **Step 3: Verify output sizes and playability**

```bash
ls -la public/videos
for f in public/videos/*.mp4; do
  ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height -of default=noprint_wrappers=1 "$f"
  echo "---"
done
```

Expected: 4 `.mp4` files, each `codec_name=h264`, `width=720`, roughly 4–8MB each (not 75–260MB
like the sources), plus 4 `-poster.jpg` files a few dozen KB each. If any file is still huge or
`codec_name` isn't `h264`, the encode didn't apply — re-check the ffmpeg command didn't silently
fall back (look for ffmpeg stderr output above).

- [ ] **Step 4: Commit**

```bash
git add public/videos
git commit -m "Add transcoded web-ready video assets for the video showcase section"
```

---

### Task 2: Build the `VideoShowcase` component and mount it after the Hero

**Files:**
- Create: `src/components/VideoShowcase.jsx`
- Modify: `src/App.jsx` (mount between `<Hero />` and the existing `<SectionDivider /><Features />`)

**Interfaces:**
- Consumes: `SectionStars` from `./SectionStars` (existing, no changes — same usage as
  `ReviewsCarousel`: `<SectionStars count={7} />`). The `.gradient-text` and `.reveal` CSS
  classes from `src/index.css` (existing, unchanged).
- Produces: default export `VideoShowcase` (no props), mounted in `App.jsx`.

- [ ] **Step 1: Create `src/components/VideoShowcase.jsx`**

```jsx
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
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
function VideoCard({ video, isActive, muted, onToggleMute, onExpand, onEnded, videoRef }) {
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
      {isActive ? (
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
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

      {isActive && (
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
    <section id="videos" className="reveal py-14 px-4 relative overflow-hidden">
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
            className="absolute hidden sm:block"
            style={{ right: '50%', transform: 'translateX(calc(50% + 150px)) scale(0.72)', zIndex: 1, cursor: 'pointer' }}
            onClick={prev}
          >
            <VideoCard video={VIDEOS[prevIdx]} isActive={false} />
          </div>

          <div
            className="absolute hidden sm:block"
            style={{ left: '50%', transform: 'translateX(calc(-50% - 150px)) scale(0.72)', zIndex: 1, cursor: 'pointer' }}
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
            ›
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
            ‹
          </button>
        </div>
      </div>

      {lightbox && (
        <VideoLightbox src={VIDEOS[current].src} startTime={lightbox.startTime} onClose={closeLightbox} />
      )}
    </section>
  )
}
```

- [ ] **Step 2: Mount it in `src/App.jsx` directly after the Hero**

Current relevant excerpt of `src/App.jsx`:

```jsx
import Hero from './components/Hero'
import Features from './components/Features'
```

```jsx
      <Hero />
      <SectionDivider />
      <Features />
```

Change to:

```jsx
import Hero from './components/Hero'
import VideoShowcase from './components/VideoShowcase'
import Features from './components/Features'
```

```jsx
      <Hero />
      <SectionDivider />
      <VideoShowcase />
      <SectionDivider />
      <Features />
```

- [ ] **Step 3: Start the dev server**

```bash
npm run dev
```

Expected: Vite prints a `Local: http://localhost:<port>/` URL (5173 or the next free port if
that's taken — check the printed output, don't assume 5173).

- [ ] **Step 4: Verify the section renders with no console errors**

```bash
npx --yes playwright screenshot --viewport-size=1280,1400 --wait-for-timeout=2000 http://localhost:<port>/ /tmp/videoshowcase-desktop.png
```

Then read `/tmp/videoshowcase-desktop.png` with the Read tool. Expected: a new section between
the Hero and "מחפשים אירוע..." Features section, with a badge "🎥 מאחורי הקלעים", the heading,
subtitle, and a 3-card stage — center card showing the NEWS clip already playing (not a black
box), two blurred/dimmed poster cards peeking on either side, arrows + 4 dots below.

If the center card is black/broken: check the browser console for a 404 on
`/videos/news.mp4` or `/videos/news-poster.jpg` — most likely cause is Task 1's output filenames
not matching `VIDEOS` in this file exactly (they must, case-sensitively).

- [ ] **Step 5: Commit**

```bash
git add src/components/VideoShowcase.jsx src/App.jsx
git commit -m "Add video showcase section after the Hero"
```

---

### Task 3: Verify interactive behavior (mute, expand, navigation, auto-advance)

**Files:** none (verification only — no code changes unless a bug is found, in which case fix
it in `src/components/VideoShowcase.jsx` and re-run this task's checks).

**Interfaces:**
- Consumes: the running dev server from Task 2, `src/components/VideoShowcase.jsx`'s DOM
  structure (`aria-label`s defined in Task 2: "הפעל קול"/"השתק", "הגדל למסך מלא", "הסרטון הקודם",
  "הסרטון הבא").

- [ ] **Step 1: Write a driver script**

Create `scratch/verify-video-showcase.mjs` (adjust the path to this session's scratchpad
directory) — this is a throwaway verification script, not project code:

```js
import { chromium } from 'playwright-core'
import { execSync } from 'node:child_process'

const chromePath = execSync('echo "$HOME/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe"').toString().trim()
const URL = process.argv[2] || 'http://localhost:5173/'

const browser = await chromium.launch({ executablePath: chromePath })
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } })
const errors = []
page.on('pageerror', e => errors.push(String(e)))
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })

await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForSelector('#videos')

// 1. Center video is playing and muted by default
const initial = await page.evaluate(() => {
  const v = document.querySelector('#videos video')
  return { muted: v.muted, paused: v.paused, src: v.currentSrc }
})
console.log('initial:', initial)
if (!initial.muted) throw new Error('expected center video to start muted')
if (!initial.src.includes('news.mp4')) throw new Error('expected NEWS to be the first centered video, got ' + initial.src)

// 2. Mic button unmutes
await page.click('#videos button[aria-label="הפעל קול"]')
await page.waitForTimeout(200)
const afterMicClick = await page.evaluate(() => {
  const v = document.querySelector('#videos video')
  return { muted: v.muted, volume: v.volume }
})
console.log('after mic click:', afterMicClick)
if (afterMicClick.muted) throw new Error('expected unmuted after clicking mic')
if (Math.abs(afterMicClick.volume - 0.75) > 0.01) throw new Error('expected volume 0.75, got ' + afterMicClick.volume)

// 3. Expand opens the lightbox with a second, unmuted, larger video
await page.click('#videos button[aria-label="הגדל למסך מלא"]')
await page.waitForTimeout(300)
const lightboxState = await page.evaluate(() => {
  const videos = document.querySelectorAll('video')
  const overlay = videos[videos.length - 1]
  return { count: videos.length, muted: overlay.muted, hasControls: overlay.controls }
})
console.log('lightbox state:', lightboxState)
if (lightboxState.count !== 2) throw new Error('expected 2 video elements while lightbox open, got ' + lightboxState.count)
if (!lightboxState.hasControls) throw new Error('expected native controls in the lightbox video')
await page.screenshot({ path: '/tmp/videoshowcase-lightbox.png' })

// 4. Escape closes it back to 1 video
await page.keyboard.press('Escape')
await page.waitForTimeout(300)
const afterClose = await page.evaluate(() => document.querySelectorAll('video').length)
if (afterClose !== 1) throw new Error('expected lightbox to close on Escape, still see ' + afterClose + ' video(s)')

// 5. Next/prev navigation switches the centered clip and resets to muted
await page.click('#videos button[aria-label="הסרטון הבא"]')
await page.waitForTimeout(600) // carousel transition
const afterNext = await page.evaluate(() => {
  const v = document.querySelector('#videos video')
  return { muted: v.muted, src: v.currentSrc }
})
console.log('after next:', afterNext)
if (!afterNext.muted) throw new Error('expected next video to start muted again')
if (!afterNext.src.includes('birthday.mp4')) throw new Error('expected BIRTHDAY after one "next" click, got ' + afterNext.src)

// 6. Simulate the current video ending -> auto-advance to the next one
await page.evaluate(() => {
  document.querySelector('#videos video').dispatchEvent(new Event('ended'))
})
await page.waitForTimeout(600)
const afterEnded = await page.evaluate(() => document.querySelector('#videos video').currentSrc)
console.log('after ended event:', afterEnded)
if (!afterEnded.includes('london.mp4')) throw new Error('expected LONDON after BIRTHDAY ends, got ' + afterEnded)

console.log('console/page errors seen:', errors)
if (errors.length) throw new Error('unexpected console errors: ' + errors.join(' | '))

await browser.close()
console.log('ALL CHECKS PASSED')
```

- [ ] **Step 2: Install `playwright-core` for the script and run it**

```bash
cd /tmp && npm install --no-save playwright-core >/dev/null 2>&1
node /path/to/scratch/verify-video-showcase.mjs http://localhost:<port>/
```

(Use the actual scratchpad path from this session and the actual dev server port from Task 2
Step 3.)

Expected final line: `ALL CHECKS PASSED`. If any check throws, that's a real bug in
`VideoShowcase.jsx` — fix it and re-run the whole script (don't hand-wave partial passes).

- [ ] **Step 3: Read the lightbox screenshot**

Read `/tmp/videoshowcase-lightbox.png` with the Read tool. Expected: a large video filling most
of the viewport over a blurred dark backdrop, with native browser video controls visible at the
bottom and a small ✕ button top-left.

- [ ] **Step 4: Check mobile layout**

```bash
npx --yes playwright screenshot --viewport-size=390,844 --wait-for-timeout=2000 http://localhost:<port>/ /tmp/videoshowcase-mobile.png
```

Read the result. Expected: side peek cards are hidden (the `hidden sm:block` classes), only the
center card + badge/heading/subtitle + arrows/dots are visible, nothing overlapping or clipped
off-screen.

- [ ] **Step 5: Stop the dev server**

```bash
for p in 5173 5174 5175 5176; do
  pid=$(netstat -ano 2>/dev/null | grep ":$p " | grep LISTENING | awk '{print $5}' | head -1)
  if [ -n "$pid" ]; then taskkill //F //PID "$pid" 2>/dev/null; fi
done
```

- [ ] **Step 6: Commit** (only if Step 1's bugfix loop actually changed `VideoShowcase.jsx`;
skip this commit if Task 2 already covered the current code with no changes needed)

```bash
git add src/components/VideoShowcase.jsx
git commit -m "Fix video showcase interaction bugs found during verification"
```

---

### Task 4: Production build check

**Files:** none (verification only).

**Interfaces:** none — this is the final integration check across everything Tasks 1–3 produced.

- [ ] **Step 1: Build**

```bash
npm run build
```

Expected: exits 0, no errors.

- [ ] **Step 2: Confirm the video assets shipped**

```bash
ls dist/videos
```

Expected: all 8 files from Task 1 (`news.mp4`, `news-poster.jpg`, `birthday.mp4`,
`birthday-poster.jpg`, `london.mp4`, `london-poster.jpg`, `tiktok.mp4`, `tiktok-poster.jpg`).

- [ ] **Step 3: Smoke-test the production build**

```bash
npm run preview -- --port 4173 &
timeout 15 bash -c 'until curl -sf http://localhost:4173 >/dev/null; do sleep 1; done'
npx --yes playwright screenshot --viewport-size=1280,1400 --wait-for-timeout=2000 http://localhost:4173/ /tmp/videoshowcase-prod.png
```

Read `/tmp/videoshowcase-prod.png`. Expected: identical to the dev screenshot from Task 2 Step
4 — video playing, no broken images.

- [ ] **Step 4: Stop the preview server and clean up the build output**

```bash
for p in 4173; do
  pid=$(netstat -ano 2>/dev/null | grep ":$p " | grep LISTENING | awk '{print $5}' | head -1)
  if [ -n "$pid" ]; then taskkill //F //PID "$pid" 2>/dev/null; fi
done
rm -rf dist
```

(`dist/` is gitignored — this just tidies the working directory, nothing to commit here.)
