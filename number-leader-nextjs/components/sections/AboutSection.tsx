'use client';

import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaHandshake } from 'react-icons/fa';

const AboutSection = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      }
    })
  };

  const cards = [
    {
      icon: <FaRocket className="text-5xl text-gold" />,
      title: 'Startups',
      description: 'Access tools for valuation, financial planning, and connect with the right investors.'
    },
    {
      icon: <FaChartLine className="text-5xl text-gold" />,
      title: 'Investors',
      description: 'Discover high-potential startups aligned with your investment thesis and track performance.'
    },
    {
      icon: <FaHandshake className="text-5xl text-gold" />,
      title: 'Enablers',
      description: 'Showcase your services, connect with startups and investors, and grow your network.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-dark">
            About Number Leader
          </h2>
          <p className="text-lg text-gray-700">
            Number Leader is a comprehensive platform designed to connect the entire startup ecosystem. 
            We empower startups with financial clarity, enable investors with intelligent deal flow, 
            and support enablers with growth-driven tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInVariants}
              className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-dark">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 