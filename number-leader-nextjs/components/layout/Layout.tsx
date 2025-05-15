'use client';

import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from '../ui/BackToTop';
import CustomCursor from '../ui/CustomCursor';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  isServicesPage?: boolean;
}

const Layout = ({ children, isServicesPage = false }: LayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is a static content page that should use solid navbar
  // Using a stronger check that looks for specific URL paths
  const staticPages = ['/faq', '/privacy', '/terms'];
  const isStaticContentPage = isServicesPage || staticPages.some(page => pathname === page);

  // Check if device is mobile or tablet (no cursor on touch devices)
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice || /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent));
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the clicked element is an anchor with a hash
      if (target.tagName === 'A' && 
          target.getAttribute('href')?.startsWith('#') && 
          !target.getAttribute('target')) {
        
        e.preventDefault();
        const hash = target.getAttribute('href');
        
        if (hash) {
          // Get the ID from the hash by removing the # character
          const id = hash.substring(1);
          // Use getElementById which is more reliable for this purpose
          const element = document.getElementById(id);
          
          if (element) {
            // Smooth scroll to the element
            window.scrollTo({
              top: element.getBoundingClientRect().top + window.scrollY - 80,
              behavior: 'smooth'
            });
            
            // Update URL without page jump
            history.pushState(null, '', hash);
          }
        }
      }
    };

    // Add event listener
    document.addEventListener('click', handleLinkClick);
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // For debugging
  useEffect(() => {
    console.log('Current pathname:', pathname);
    console.log('Is static page:', isStaticContentPage);
  }, [pathname, isStaticContentPage]);

  return (
    <>
      <Navbar isStaticPage={isStaticContentPage} />
      <main>
        {children}
      </main>
      <Footer isServicesPage={isServicesPage} />
      <BackToTop />
      {!isMobile && <CustomCursor />}
    </>
  );
};

export default Layout; 