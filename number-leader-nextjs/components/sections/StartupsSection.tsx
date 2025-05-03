'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCalculator, FaClipboardCheck, FaUsers } from 'react-icons/fa';

const StartupsSection = () => {
  const features = [
    {
      icon: <FaCalculator className="text-3xl text-gold" />,
      title: 'FP&A Suite',
      description: 'Update actuals, plan and budget, forecast, benchmark effortlessly and generate AI analytics to make data-driven decisions and drive growth.'
    },
    {
      icon: <FaClipboardCheck className="text-3xl text-gold" />,
      title: 'Fund Readiness Suite',
      description: 'Stay prepared with valuation reports, AI-powered pitch decks, market research, business plans, and secure document vault, alongside monthly updates for due diligence.'
    },
    {
      icon: <FaUsers className="text-3xl text-gold" />,
      title: 'Fund Raising Suite',
      description: 'Our proprietary Investor CRM tool will centralize investor relationships, streamline communication, and fast track your fundraising process.'
    }
  ];

  return (
    <section 
      id="startups" 
      className="py-20 bg-startup-pattern bg-cover bg-fixed bg-center relative text-white"
    >
      <div className="absolute inset-0 bg-primary-dark/80"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">For Startups</h2>
          <p className="text-xl mb-2">Unlock Your Growth Potential</p>
          <p className="text-gray-300">
            Comprehensive tools designed to help startups at every stage of their journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-8 hover:bg-white/10 transition-colors"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link 
            href="https://numberleader.cortexcraft.com/users/sign_in"
            className="bg-gold hover:bg-gold/90 text-white font-medium py-3 px-8 rounded-md inline-block transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Started as a Startup
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default StartupsSection; 