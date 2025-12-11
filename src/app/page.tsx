'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import AutomationSection from '@/components/AutomationSection';
import BoatSection from '@/components/BoatSection';
import DashboardPreview from '@/components/DashboardPreview';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

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
