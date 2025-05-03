'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube
} from 'react-icons/fa';

interface FooterProps {
  isServicesPage?: boolean;
}

const Footer = ({ isServicesPage = false }: FooterProps) => {
  // Quick links section
  const quickLinks = [
    { name: 'Home', href: isServicesPage ? '/' : '#home' },
    { name: 'About', href: isServicesPage ? '/#about' : '#about' },
    { name: 'Services', href: isServicesPage ? '#' : '/services' },
    { name: 'Products', href: isServicesPage ? '/#products' : '#products' },
    { name: 'Contact', href: isServicesPage ? '/#contact' : '#contact' },
  ];

  // Resources section
  const resources = [
    { name: 'FAQs', href: '/faq' },
    { name: 'Terms and Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Blog', href: '#' },
    { name: 'Admin', href: '/admin' },
  ];

  return (
    <footer className="bg-primary-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Image 
                src="/assets/img/Logos/Number Leader White.png" 
                alt="Number Leader Logo" 
                width={40} 
                height={40}
                className="h-[40px] w-auto"
              />
              <span className="ml-2 text-xl font-semibold">Number Leader</span>
            </Link>
            <p className="text-gray-300 mb-6">
              Transforming startups into market leaders through strategic guidance, innovative solutions, and data-driven insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-300 hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <Link href={resource.href} className="text-gray-300 hover:text-gold transition-colors">
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-gray-300">
                <span className="block">Email:</span>
                <a href="mailto:info@numberleader.com" className="hover:text-gold transition-colors">
                  info@numberleader.com
                </a>
              </li>
              <li className="text-gray-300">
                <span className="block">Phone:</span>
                <a href="tel:+1234567890" className="hover:text-gold transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="text-gray-300">
                <span className="block">Location:</span>
                <span>New York, NY 10001, USA</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6 flex space-x-4">
              <a href="https://www.linkedin.com/company/number-leader/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="https://x.com/Number_Leader" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="https://www.instagram.com/numberleader?igsh=MW9udWVyaWYzZjV6cg==" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="https://youtube.com/@numberleader?si=0Zs72kSPge44lyho" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold transition-colors">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Number Leader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 