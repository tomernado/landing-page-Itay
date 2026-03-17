import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import ReviewsCarousel from './components/ReviewsCarousel'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

function Meteors() {
  return (
    <div className="meteors" aria-hidden="true">
      <span className="meteor" style={{ '--x': '10%', '--y': '-12%', '--delay': '.8s',  '--dur': '7.2s' }} />
      <span className="meteor" style={{ '--x': '34%', '--y': '-18%', '--delay': '3.1s', '--dur': '8.0s' }} />
      <span className="meteor" style={{ '--x': '62%', '--y': '-14%', '--delay': '6.2s', '--dur': '7.6s' }} />
      <span className="meteor" style={{ '--x': '78%', '--y': '-20%', '--delay': '1.9s', '--dur': '8.4s' }} />
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
