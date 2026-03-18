import { useEffect, useRef } from 'react'

const STAR_COUNT  = 22   // active stars at once
const SPEED_MIN   = 0.18
const SPEED_MAX   = 0.55

function rand(a, b) { return a + Math.random() * (b - a) }
function pick(arr)  { return arr[Math.floor(Math.random() * arr.length)] }

const COLORS = [
  { h: 255, s: 90, tail: 'rgba(200,180,255,' },   // soft violet
  { h: 220, s: 80, tail: 'rgba(180,200,255,' },   // ice blue
  { h: 300, s: 60, tail: 'rgba(230,180,255,' },   // pink-purple
  { h:   0, s:  0, tail: 'rgba(255,255,255,' },   // pure white
]

function spawnStar(W, H) {
  const col    = pick(COLORS)
  const angle  = rand(28, 42) * (Math.PI / 180)    // 28-42° from vertical
  const speed  = rand(SPEED_MIN, SPEED_MAX)
  const length = rand(90, 260)
  const size   = rand(1.0, 2.2)
  const life   = rand(0.6, 1)                       // how far through animation (0=just born, 1=done)

  // start anywhere along top + right edges
  const edge = Math.random()
  let x, y
  if (edge < 0.72) {
    x = rand(-50, W + 50);  y = rand(-80, -20)      // top edge
  } else {
    x = rand(-80, -20);      y = rand(-50, H * 0.5)  // left edge (RTL — stars come from right)
  }

  return { x, y, angle, speed, length, size, life, maxLife: rand(240, 420), col }
}

export default function ShootingStars() {
  const canvasRef = useRef(null)
  const starsRef  = useRef([])
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let W = window.innerWidth
    let H = window.innerHeight

    function resize() {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W
      canvas.height = H
    }
    resize()
    window.addEventListener('resize', resize)

    // seed initial stars at various life stages
    starsRef.current = Array.from({ length: STAR_COUNT }, () => {
      const s = spawnStar(W, H)
      s.life = rand(0, s.maxLife)
      return s
    })

    function draw() {
      ctx.clearRect(0, 0, W, H)

      starsRef.current.forEach((s, i) => {
        s.life += s.speed

        // move
        s.x += Math.sin(s.angle) * s.speed * 1.6
        s.y += Math.cos(s.angle) * s.speed * 1.6

        // life fraction 0→1
        const t = s.life / s.maxLife

        // fade in 0-12%, full 12-70%, fade out 70-100%
        let alpha
        if      (t < 0.12) alpha = t / 0.12
        else if (t < 0.70) alpha = 1
        else               alpha = 1 - (t - 0.70) / 0.30
        alpha = Math.max(0, Math.min(1, alpha)) * 0.72

        if (alpha > 0.01) {
          // tail
          const tx = s.x - Math.sin(s.angle) * s.length
          const ty = s.y - Math.cos(s.angle) * s.length

          const grad = ctx.createLinearGradient(tx, ty, s.x, s.y)
          grad.addColorStop(0,    `${s.col.tail}0)`)
          grad.addColorStop(0.5,  `${s.col.tail}${(alpha * 0.22).toFixed(3)})`)
          grad.addColorStop(1,    `${s.col.tail}${(alpha * 0.55).toFixed(3)})`)

          ctx.save()
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(s.x, s.y)
          ctx.strokeStyle = grad
          ctx.lineWidth   = s.size * 0.9
          ctx.lineCap     = 'round'
          ctx.stroke()

          // glowing head
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5)
          glow.addColorStop(0,   `rgba(255,255,255,${(alpha * 0.95).toFixed(3)})`)
          glow.addColorStop(0.3, `${s.col.tail}${(alpha * 0.55).toFixed(3)})`)
          glow.addColorStop(1,   `${s.col.tail}0)`)

          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 4.5, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          // sharp bright core
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 0.9, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
          ctx.fill()

          ctx.restore()
        }

        // respawn when dead or off-screen
        if (s.life >= s.maxLife || s.x > W + 100 || s.y > H + 100) {
          starsRef.current[i] = spawnStar(W, H)
        }
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width:  '100%',
        height: '100%',
        zIndex: 40,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
