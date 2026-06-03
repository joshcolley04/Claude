import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProcessSection from '@/components/ProcessSection'
import BenefitsSection from '@/components/BenefitsSection'
import RevenueCalculator from '@/components/RevenueCalculator'
import FeaturesSection from '@/components/FeaturesSection'
import ProductTypesSection from '@/components/ProductTypesSection'
import BookingSection from '@/components/BookingSection'
import FAQ from '@/components/FAQ'
import FinalCTA from '@/components/FinalCTA'
import ScrollProgress from '@/components/ScrollProgress'
import ExitIntentModal from '@/components/ExitIntentModal'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <Hero />
        <ProcessSection />
        <BenefitsSection />
        <RevenueCalculator />
        <FeaturesSection />
        <ProductTypesSection />
        <BookingSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <ExitIntentModal />
    </>
  )
}
