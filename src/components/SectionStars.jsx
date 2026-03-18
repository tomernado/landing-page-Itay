import { useEffect, useRef } from 'react'

function rand(a, b) { return a + Math.random() * (b - a) }

// Each star has its own personality
const STYLES = [
  { color: 'rgba(210,195,255,', maxAlpha: 0.32, minLen: 50,  maxLen: 130, minSize: 0.5, maxSize: 1.2, minAngle: 20, maxAngle: 35  },
  { color: 'rgba(175,215,255,', maxAlpha: 0.25, minLen: 80,  maxLen: 200, minSize: 0.7, maxSize: 1.6, minAngle: 30, maxAngle: 50  },
  { color: 'rgba(255,200,240,', maxAlpha: 0.22, minLen: 40,  maxLen: 110, minSize: 0.5, maxSize: 1.0, minAngle: 15, maxAngle: 40  },
  { color: 'rgba(200,235,255,', maxAlpha: 0.28, minLen: 60,  maxLen: 160, minSize: 0.6, maxSize: 1.4, minAngle: 25, maxAngle: 45  },
  { color: 'rgba(240,230,255,', maxAlpha: 0.20, minLen: 35,  maxLen: 95,  minSize: 0.4, maxSize: 0.9, minAngle: 18, maxAngle: 38  },
]

function spawnStar(W, H, randomLife) {
  const style   = STYLES[Math.floor(Math.random() * STYLES.length)]
  const angle   = rand(style.minAngle, style.maxAngle) * (Math.PI / 180)
  const speed   = rand(0.08, 0.28)
  const length  = rand(style.minLen, style.maxLen)
  const size    = rand(style.minSize, style.maxSize)
  const maxLife = rand(300, 580)
  const alpha   = rand(0.5, 1) * style.maxAlpha

  // Spawn anywhere: top, middle, or randomly across canvas
  const spawnZone = Math.random()
  let x, y
  if (spawnZone < 0.45) {
    // top edge
    x = rand(-40, W + 40)
    y = rand(-100, -5)
  } else if (spawnZone < 0.75) {
    // anywhere on canvas (already mid-animation)
    x = rand(0, W)
    y = rand(0, H * 0.7)
  } else {
    // left edge
    x = rand(-80, -10)
    y = rand(0, H * 0.5)
  }

  return {
    x, y, angle, speed, length, size, maxLife, alpha,
    color: style.color,
    life: randomLife ? rand(0, maxLife) : 0,
  }
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

    // seed with random life so they don't all start at once
    const stars = Array.from({ length: count }, () => spawnStar(W, H, true))
    let rafId

    function draw() {
      ctx.clearRect(0, 0, W, H)

      stars.forEach((s, i) => {
        s.life += s.speed
        s.x    += Math.sin(s.angle) * s.speed * 1.3
        s.y    += Math.cos(s.angle) * s.speed * 1.3

        const t = s.life / s.maxLife
        let fade
        if      (t < 0.08) fade = t / 0.08
        else if (t < 0.68) fade = 1
        else               fade = 1 - (t - 0.68) / 0.32
        const alpha = Math.max(0, Math.min(1, fade)) * s.alpha

        if (alpha > 0.004) {
          const tx = s.x - Math.sin(s.angle) * s.length
          const ty = s.y - Math.cos(s.angle) * s.length

          // tail gradient
          const grad = ctx.createLinearGradient(tx, ty, s.x, s.y)
          grad.addColorStop(0,   `${s.color}0)`)
          grad.addColorStop(0.55, `${s.color}${(alpha * 0.15).toFixed(3)})`)
          grad.addColorStop(1,   `${s.color}${(alpha * 0.48).toFixed(3)})`)

          ctx.save()
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(s.x, s.y)
          ctx.strokeStyle = grad
          ctx.lineWidth   = s.size
          ctx.lineCap     = 'round'
          ctx.stroke()

          // soft halo
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4.5)
          halo.addColorStop(0,   `rgba(255,255,255,${(alpha * 0.8).toFixed(3)})`)
          halo.addColorStop(0.4, `${s.color}${(alpha * 0.28).toFixed(3)})`)
          halo.addColorStop(1,   `${s.color}0)`)
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = halo
          ctx.fill()

          // bright core
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.88).toFixed(3)})`
          ctx.fill()

          ctx.restore()
        }

        if (s.life >= s.maxLife || s.x > W + 120 || s.y > H + 120) {
          stars[i] = spawnStar(W, H, false)
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
