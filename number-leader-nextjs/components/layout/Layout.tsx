'use client';

import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from '../ui/BackToTop';

interface LayoutProps {
  children: React.ReactNode;
  isServicesPage?: boolean;
}

const Layout = ({ children, isServicesPage = false }: LayoutProps) => {
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

  return (
    <>
      <Navbar isServicesPage={isServicesPage} />
      <main>
        {children}
      </main>
      <Footer isServicesPage={isServicesPage} />
      <BackToTop />
    </>
  );
};

export default Layout; 