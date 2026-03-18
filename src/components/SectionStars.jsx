import { useEffect, useRef } from 'react'

function rand(a, b) { return a + Math.random() * (b - a) }

const PALETTES = [
  'rgba(200,185,255,',   // soft violet
  'rgba(180,210,255,',   // ice blue
  'rgba(255,200,230,',   // pink
  'rgba(210,240,255,',   // sky
  'rgba(240,230,255,',   // pale lavender
]

function spawnStar(W, H) {
  const angle   = rand(15, 55) * (Math.PI / 180)
  const speed   = rand(0.12, 0.32)
  const length  = rand(60, 180)
  const size    = rand(0.6, 1.6)
  const maxLife = rand(280, 500)
  const color   = PALETTES[Math.floor(Math.random() * PALETTES.length)]

  // spread across full width, start above section
  const x = rand(-60, W + 60)
  const y = rand(-120, -10)

  return { x, y, angle, speed, length, size, life: rand(0, maxLife), maxLife, color }
}

export default function SectionStars({ count = 10 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const parent = canvas.parentElement
    let W = parent.offsetWidth
    let H = parent.offsetHeight

    function resize() {
      W = parent.offsetWidth
      H = parent.offsetHeight
      canvas.width  = W
      canvas.height = H
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    const stars = Array.from({ length: count }, () => spawnStar(W, H))
    let rafId

    function draw() {
      ctx.clearRect(0, 0, W, H)

      stars.forEach((s, i) => {
        s.life  += s.speed
        s.x     += Math.sin(s.angle) * s.speed * 1.4
        s.y     += Math.cos(s.angle) * s.speed * 1.4

        const t = s.life / s.maxLife
        let alpha
        if      (t < 0.10) alpha = t / 0.10
        else if (t < 0.72) alpha = 1
        else               alpha = 1 - (t - 0.72) / 0.28
        alpha = Math.max(0, Math.min(1, alpha)) * 0.38  // subtle max opacity

        if (alpha > 0.005) {
          const tx = s.x - Math.sin(s.angle) * s.length
          const ty = s.y - Math.cos(s.angle) * s.length

          // tail
          const grad = ctx.createLinearGradient(tx, ty, s.x, s.y)
          grad.addColorStop(0,   `${s.color}0)`)
          grad.addColorStop(0.6, `${s.color}${(alpha * 0.18).toFixed(3)})`)
          grad.addColorStop(1,   `${s.color}${(alpha * 0.50).toFixed(3)})`)

          ctx.save()
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(s.x, s.y)
          ctx.strokeStyle = grad
          ctx.lineWidth   = s.size
          ctx.lineCap     = 'round'
          ctx.stroke()

          // head glow
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5)
          glow.addColorStop(0,   `rgba(255,255,255,${(alpha * 0.85).toFixed(3)})`)
          glow.addColorStop(0.4, `${s.color}${(alpha * 0.35).toFixed(3)})`)
          glow.addColorStop(1,   `${s.color}0)`)
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          // core dot
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 0.85, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.9).toFixed(3)})`
          ctx.fill()

          ctx.restore()
        }

        // respawn when done or off-canvas
        if (s.life >= s.maxLife || s.x > W + 100 || s.y > H + 100) {
          stars[i] = spawnStar(W, H)
        }
      })

      rafId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width:  '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  )
}
