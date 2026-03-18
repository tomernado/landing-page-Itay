import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import ReviewsCarousel from './components/ReviewsCarousel'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

const METEORS_DATA = [
  { x: '5%',  y: '-8%',  delay: '0s',    dur: '9s',   size: '1.2px', len: '90px'  },
  { x: '14%', y: '-15%', delay: '2.4s',  dur: '7.5s', size: '1.8px', len: '120px' },
  { x: '23%', y: '-5%',  delay: '5.8s',  dur: '8.8s', size: '1px',   len: '75px'  },
  { x: '31%', y: '-18%', delay: '1.2s',  dur: '10s',  size: '1.5px', len: '105px' },
  { x: '40%', y: '-10%', delay: '7.3s',  dur: '8.2s', size: '1px',   len: '80px'  },
  { x: '48%', y: '-22%', delay: '3.9s',  dur: '9.4s', size: '2px',   len: '130px' },
  { x: '57%', y: '-7%',  delay: '0.6s',  dur: '7.8s', size: '1.2px', len: '88px'  },
  { x: '65%', y: '-13%', delay: '4.7s',  dur: '11s',  size: '1.6px', len: '110px' },
  { x: '73%', y: '-19%', delay: '2.1s',  dur: '8.6s', size: '1px',   len: '70px'  },
  { x: '81%', y: '-9%',  delay: '6.5s',  dur: '9.2s', size: '1.4px', len: '95px'  },
  { x: '88%', y: '-16%', delay: '1.8s',  dur: '7.4s', size: '1.8px', len: '115px' },
  { x: '94%', y: '-6%',  delay: '8.9s',  dur: '10.5s',size: '1px',   len: '78px'  },
  { x: '19%', y: '-24%', delay: '11.2s', dur: '9s',   size: '1.3px', len: '92px'  },
  { x: '52%', y: '-11%', delay: '13.5s', dur: '8s',   size: '1.6px', len: '108px' },
  { x: '77%', y: '-3%',  delay: '9.8s',  dur: '11.5s',size: '1.1px', len: '82px'  },
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
