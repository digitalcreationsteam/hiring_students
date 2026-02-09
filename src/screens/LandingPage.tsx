// src/screens/LandingPage.tsx
import HeroSection from 'src/ui/components/HeroSection';
import FeaturesSection from 'src/ui/components/FeaturesSection';
import StatsSection from 'src/ui/components/StatsSection';
import Navbar from "src/ui/components/Navbar";
import TrustSection from 'src/ui/components/TrustSection';
import TestimonialsSection from 'src/ui/components/TestimonialsSection';
import CTASection from 'src/ui/components/CTASection';
import Footer from 'src/ui/components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <TrustSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection/>
      <Footer />
    </div>
  );
};

export default LandingPage;