import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
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

  return (
    <div
      className="relative min-h-screen font-heebo overflow-x-hidden"
      style={{ background: '#060b18' }}
    >
      {/* Fixed background layers */}
      <div className="stars" aria-hidden="true" />
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
