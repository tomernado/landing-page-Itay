import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import VideoShowcase from './components/VideoShowcase'
import Features from './components/Features'
import ReviewsCarousel from './components/ReviewsCarousel'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

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

  /* Block pinch-zoom. The viewport meta tag + touch-action CSS already
     signal no-zoom, but iOS Safari's native pinch gesture runs through its
     own legacy gesture events and ignores both — zooming a page this heavy
     with blur filters and canvas animations forces a re-rasterize that can
     crash the tab on memory-constrained phones. */
  useEffect(() => {
    const preventGesture = e => e.preventDefault()
    const preventMultiTouch = e => { if (e.touches.length > 1) e.preventDefault() }

    document.addEventListener('gesturestart', preventGesture)
    document.addEventListener('gesturechange', preventGesture)
    document.addEventListener('touchmove', preventMultiTouch, { passive: false })

    return () => {
      document.removeEventListener('gesturestart', preventGesture)
      document.removeEventListener('gesturechange', preventGesture)
      document.removeEventListener('touchmove', preventMultiTouch)
    }
  }, [])

  return (
    <div
      className="relative min-h-screen font-telaviv overflow-x-hidden"
      style={{ background: '#060b18' }}
    >
      {/* Fixed background layers */}
      <div className="stars" aria-hidden="true" />
      <Navbar />

      <Hero />
      <SectionDivider />
      <VideoShowcase />
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
