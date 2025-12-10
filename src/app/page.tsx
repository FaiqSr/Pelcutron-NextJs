import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import AutomationSection from '@/components/AutomationSection';
import BoatSection from '@/components/BoatSection';
import DashboardPreview from '@/components/DashboardPreview';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <AutomationSection />
        <BoatSection />
        <DashboardPreview />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
