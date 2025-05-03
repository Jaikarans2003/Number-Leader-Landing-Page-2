'use client';

import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// FAQ Item component
const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        className="flex justify-between items-center w-full text-left font-medium text-lg text-primary-dark"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? (
          <FaChevronUp className="text-gold" />
        ) : (
          <FaChevronDown className="text-gold" />
        )}
      </button>
      
      <div 
        className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <p className="py-2">{answer}</p>
      </div>
    </div>
  );
};

export default function FaqPage() {
  // Sample FAQ data - replace with your actual FAQs
  const faqItems = [
    {
      question: "What is Number Leader?",
      answer: "Number Leader is a comprehensive platform designed to connect startups, investors, and enablers in the ecosystem. We provide AI-powered tools, curated deal flow, and tailored strategies to help startups grow, investors find opportunities, and enablers expand their impact."
    },
    {
      question: "How does Number Leader help startups?",
      answer: "Number Leader provides startups with financial planning tools, valuation assistance, AI-powered document generation (pitch decks, business plans), and connections to relevant investors through our intelligent CRM system."
    },
    {
      question: "What services does Number Leader offer to investors?",
      answer: "Investors can access our Private Market Intelligence Platform to discover startups categorized by sector and industry with key financials, use our CRM to find startups aligned with their investment thesis, and leverage our Fund Raising Suite for capital acquisition."
    },
    {
      question: "How can enablers benefit from Number Leader?",
      answer: "Enablers can showcase their services, display success stories, connect with high-potential startups through our Startup Acquisition Suite, and expand their investor network via our Investor Acquisition Suite."
    },
    {
      question: "Is Number Leader available globally?",
      answer: "Yes, Number Leader's platform is accessible to users globally. We aim to connect the startup ecosystem worldwide, while offering specialized insights for various regional markets."
    },
    {
      question: "How much does it cost to use Number Leader?",
      answer: "Number Leader offers various pricing tiers based on user type and needs. Please contact our sales team for detailed pricing information tailored to your specific requirements."
    },
    {
      question: "How do I get started with Number Leader?",
      answer: "Simply click on the 'Get Started' button on our homepage and follow the registration process. You can sign up as a startup, investor, or enabler and immediately start using our tools and network."
    },
    {
      question: "Does Number Leader provide support for users?",
      answer: "Yes, we provide dedicated support for all users. Once registered, you'll have access to our help resources, documentation, and customer service team to assist with any questions or issues."
    }
  ];

  return (
    <Layout>
      <div className="pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-dark">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about Number Leader and our services.
            </p>
          </motion.div>

          <motion.div 
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <FaqItem key={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-lg text-gray-700 mb-4">
              Still have questions? We're here to help!
            </p>
            <a 
              href="#contact" 
              className="bg-gold hover:bg-gold/90 text-white font-medium py-3 px-8 rounded-md inline-block transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 