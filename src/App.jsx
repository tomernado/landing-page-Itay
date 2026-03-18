import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import ReviewsCarousel from './components/ReviewsCarousel'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

const METEORS_DATA = [
  { x: '4%',  y: '-6%',  delay: '0s',    dur: '14s',  size: '1.2px', len: '120px' },
  { x: '11%', y: '-14%', delay: '5.5s',  dur: '16s',  size: '1.6px', len: '160px' },
  { x: '20%', y: '-4%',  delay: '11s',   dur: '13s',  size: '1px',   len: '100px' },
  { x: '29%', y: '-18%', delay: '2.5s',  dur: '17s',  size: '1.4px', len: '140px' },
  { x: '38%', y: '-9%',  delay: '8s',    dur: '15s',  size: '1px',   len: '95px'  },
  { x: '46%', y: '-20%', delay: '14s',   dur: '18s',  size: '1.8px', len: '175px' },
  { x: '55%', y: '-5%',  delay: '3.5s',  dur: '14.5s',size: '1.1px', len: '110px' },
  { x: '63%', y: '-12%', delay: '9.5s',  dur: '16.5s',size: '1.5px', len: '148px' },
  { x: '72%', y: '-17%', delay: '1s',    dur: '13.5s',size: '1px',   len: '92px'  },
  { x: '80%', y: '-7%',  delay: '7s',    dur: '15.5s',size: '1.3px', len: '128px' },
  { x: '87%', y: '-15%', delay: '12.5s', dur: '14s',  size: '1.7px', len: '155px' },
  { x: '93%', y: '-3%',  delay: '4s',    dur: '17.5s',size: '1px',   len: '88px'  },
  { x: '16%', y: '-22%', delay: '16s',   dur: '15s',  size: '1.2px', len: '118px' },
  { x: '50%', y: '-10%', delay: '6s',    dur: '19s',  size: '1.5px', len: '145px' },
  { x: '75%', y: '-2%',  delay: '10s',   dur: '16s',  size: '1.1px', len: '102px' },
  { x: '33%', y: '-25%', delay: '18s',   dur: '14.5s',size: '1.3px', len: '132px' },
  { x: '58%', y: '-8%',  delay: '13s',   dur: '18.5s',size: '1px',   len: '96px'  },
  { x: '85%', y: '-20%', delay: '2s',    dur: '15s',  size: '1.6px', len: '152px' },
]

function Meteors() {
  return (
    <div className="meteors" aria-hidden="true">
      {METEORS_DATA.map((m, i) => (
        <span
          key={i}
          className="meteor"
          style={{
            '--x': m.x, '--y': m.y,
            '--delay': m.delay, '--dur': m.dur,
            '--size': m.size, '--len': m.len,
          }}
        />
      ))}
    </div>
  )
}

function SectionDivider() {
  return <div className="section-glow mx-6 md:mx-16" />
}

export default function App() {
  /* Scroll-reveal observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="relative min-h-screen font-heebo overflow-x-hidden"
      style={{ background: '#060b18' }}
    >
      {/* Fixed layers */}
      <div className="stars" aria-hidden="true" />
      <Meteors />
      <Navbar />

      <Hero />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <ReviewsCarousel />
      <SectionDivider />
      <ContactForm />
      <Footer />
    </div>
  )
}
