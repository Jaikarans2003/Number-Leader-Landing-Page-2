'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Create parallax effect with useTransform
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  // Preload image
  useEffect(() => {
    const img = new window.Image();
    img.src = '/assets/img/backgrounds/hero-bg.webp'; // Use WebP format instead of PNG
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <section 
      id="home"
      ref={sectionRef}
      className="nl-parallax relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: imageLoaded ? "url('/assets/img/backgrounds/hero-bg.webp')" : "none",
        backgroundColor: "#0B2447", // Fallback color until image loads
        height: '100vh',
      }}
    >
      {/* Dark overlay */}
      <div className="nl-parallax-overlay z-0"></div>
      
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ y, opacity }}
      >
        <div className="flex justify-center items-center">
          {/* Hero Text Content - Centered */}
          <motion.div 
            className="w-full max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Empowering <span className="text-gold">Startups</span> Enabling <span className="text-gold">Investments</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 mx-auto max-w-2xl">
              Discover AI-powered tools, curated deal flow, and tailored strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://numberleader.cortexcraft.com/users/sign_in" className="nl-btn-primary">
                Explore as Startup
              </Link>
              <Link href="https://numberleader.cortexcraft.com/users/sign_in" className="nl-btn-secondary">
                Explore as Investor
              </Link>
              <Link href="https://numberleader.cortexcraft.com/users/sign_in" className="nl-btn-primary">
                Explore as Enabler
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <Link href="#about" className="text-white opacity-80 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection; 