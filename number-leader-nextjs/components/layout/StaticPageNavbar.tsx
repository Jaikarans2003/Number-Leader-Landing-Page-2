'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { FaBars, FaChevronDown } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

// Type definitions
interface SubNavItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  dropdown?: boolean;
  items?: SubNavItem[];
}

interface StaticPageNavbarProps {
  isStaticPage?: boolean; // Add this prop even though we don't use it (for type compatibility)
}

const StaticPageNavbar = ({ isStaticPage = true }: StaticPageNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);
  const pathname = usePathname();
  const productsRef = useRef<HTMLDivElement>(null);
  
  // Check if current page is admin page
  const isAdminPage = pathname === '/admin';
  
  // Don't display navbar on admin page
  if (isAdminPage) {
    return null;
  }

  // Nav items for static pages link directly to main site sections
  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { 
      name: 'Products', 
      dropdown: true,
      items: [
        { name: 'Startups', href: '/#startups' },
        { name: 'Investors', href: '/#investors' },
        { name: 'Enablers', href: '/#enablers' }
      ]
    },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/#contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-primary-dark shadow-lg py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl md:text-3xl company-name px-2 py-1 rounded">
              Number<span className="text-gold">Leader</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              item.dropdown ? (
                <div 
                  key={index} 
                  className="relative" 
                  ref={productsRef}
                >
                  <button
                    className="flex items-center text-white hover:text-gold transition-colors"
                    onClick={() => setProductsDropdown(!productsDropdown)}
                  >
                    {item.name}
                    <FaChevronDown className="ml-1 h-3 w-3" />
                  </button>
                  {/* Dropdown Menu */}
                  <div 
                    className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white py-1 z-10 transition-all duration-200 ${
                      productsDropdown ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                    }`}
                  >
                    {item.items && item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProductsDropdown(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link 
                  href={item.href || '#'} 
                  key={index}
                  className="text-white hover:text-gold transition-colors"
                >
                  {item.name}
                </Link>
              )
            ))}

            {/* Login/SignUp Button */}
            <Link 
              href="/auth" 
              className="bg-gold hover:bg-gold/90 text-white px-5 py-2 rounded-md transition-colors font-medium"
            >
              Login / SignUp
            </Link>
          </div>
          
          <button 
            className="lg:hidden text-white text-2xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars />
          </button>
        </div>
        
        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-4 py-4">
            {navItems.map((item, index) => (
              item.dropdown ? (
                <div key={index} className="flex flex-col">
                  <button
                    className="flex items-center text-white hover:text-gold transition-colors mb-2"
                    onClick={() => setProductsDropdown(!productsDropdown)}
                  >
                    {item.name}
                    <FaChevronDown className={`ml-1 h-3 w-3 transition-transform ${
                      productsDropdown ? 'rotate-180' : 'rotate-0'
                    }`} />
                  </button>
                  <div className={`pl-4 space-y-2 overflow-hidden transition-all duration-200 ${
                    productsDropdown ? 'max-h-32 opacity-100 mb-2' : 'max-h-0 opacity-0'
                  }`}>
                    {item.items && item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="block text-white hover:text-gold transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link 
                  href={item.href || '#'} 
                  key={index}
                  className="text-white hover:text-gold transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {/* Login/SignUp Button Mobile */}
            <Link 
              href="/auth" 
              className="bg-gold hover:bg-gold/90 text-white px-5 py-2 rounded-md transition-colors font-medium inline-block w-fit"
              onClick={() => setIsOpen(false)}
            >
              Login / SignUp
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StaticPageNavbar; 