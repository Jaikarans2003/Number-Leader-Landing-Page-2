'use client';

import Layout from '../components/layout/Layout';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import StartupsSection from '../components/sections/StartupsSection';
import InvestorsSection from '../components/sections/InvestorsSection';
import EnablersSection from '../components/sections/EnablersSection';
import MetricsSection from '../components/sections/MetricsSection';
import ContactSection from '../components/sections/ContactSection';
import { useEffect } from 'react';

export default function Home() {
  // Handle preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Preloader */}
      <div id="preloader">
        <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full" />
      </div>
      
      <Layout>
        <HeroSection />
        <AboutSection />
        <StartupsSection />
        <InvestorsSection />
        <EnablersSection />
        <MetricsSection />
        
        <ContactSection />
      </Layout>
    </>
  );
} 