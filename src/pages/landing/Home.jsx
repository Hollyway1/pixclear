
import Navbar from '../../components/landing/Navbar'
import Hero from '../../components/landing/Hero'
import Features from '../../components/landing/Features'
import HowItWorks from '../../components/landing/HowItWorks'
import Pricing from '../../components/landing/Pricing'
import CallToAction from '../../components/landing/CallToAction'
import Footer from '../../components/landing/Footer'

const Home = () => {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CallToAction />
      <Footer />
    </main>
  )
}

export default Home
