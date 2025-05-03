'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaBullhorn, FaRocket, FaNetworkWired } from 'react-icons/fa';

const EnablersSection = () => {
  const features = [
    {
      icon: <FaBullhorn className="text-3xl text-gold" />,
      title: 'Showcasing Platform',
      description: 'List your services, display success stories, share startup pitches, and gain visibility in the entrepreneurial ecosystem.'
    },
    {
      icon: <FaRocket className="text-3xl text-gold" />,
      title: 'Startup Acquisition Suite',
      description: 'A dedicated CRM to identify, assess, and collaborate with high-potential startups through data-driven insights and strategic partnerships.'
    },
    {
      icon: <FaNetworkWired className="text-3xl text-gold" />,
      title: 'Investor Acquisition Suite',
      description: 'A CRM-based tool to expand your investor network, foster collaboration, and prioritize high-value investors with personalized communication.'
    }
  ];

  return (
    <section 
      id="enablers" 
      className="py-20 bg-enabler-pattern bg-cover bg-fixed bg-center relative text-white"
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
          <h2 className="text-3xl md:text-4xl font-bold mb-2">For Enablers</h2>
          <p className="text-xl mb-2">Powering Ecosystem Growth</p>
          <p className="text-gray-300">
            Resources designed to help enablers expand their reach and impact in the startup ecosystem.
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
            Join as an Enabler
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EnablersSection; 