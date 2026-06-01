import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CredibilitySection from '@/components/CredibilitySection'
import HowItWorks from '@/components/HowItWorks'
import BenefitsSection from '@/components/BenefitsSection'
import RevenueCalculator from '@/components/RevenueCalculator'
import FeaturesSection from '@/components/FeaturesSection'
import BookingSection from '@/components/BookingSection'
import FAQ from '@/components/FAQ'
import EmailCapture from '@/components/EmailCapture'
import FinalCTA from '@/components/FinalCTA'
import ScrollProgress from '@/components/ScrollProgress'
import MobileFloatingCTA from '@/components/MobileFloatingCTA'
import ExitIntentModal from '@/components/ExitIntentModal'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <Hero />
        <CredibilitySection />
        <HowItWorks />
        <BenefitsSection />
        <RevenueCalculator />
        <FeaturesSection />
        <BookingSection />
        <FAQ />
        <EmailCapture />
        <FinalCTA />
      </main>
      <Footer />
      <MobileFloatingCTA />
      <ExitIntentModal />
    </>
  )
}
