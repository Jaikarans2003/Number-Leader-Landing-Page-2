'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  {
    id: 1,
    title: 'AI-Powered Insights',
    description: 'Leverage advanced algorithms to identify opportunities, optimize decisions, and forecast trends with precision.',
    icon: '/assets/icons/ai-icon.svg',
  },
  {
    id: 2,
    title: 'Global Network Access',
    description: 'Connect with vetted entrepreneurs, investors, and enablers from over 50 countries through our exclusive platform.',
    icon: '/assets/icons/network-icon.svg',
  },
  {
    id: 3,
    title: 'Investment Opportunity Flow',
    description: 'Access a curated pipeline of high-potential ventures aligned with your investment thesis and preferences.',
    icon: '/assets/icons/investment-icon.svg',
  },
  {
    id: 4,
    title: 'Comprehensive Analytics',
    description: 'Track your performance with detailed metrics, benchmarks, and industry comparisons in real-time.',
    icon: '/assets/icons/analytics-icon.svg',
  },
  {
    id: 5,
    title: 'Strategic Mentorship',
    description: 'Receive guidance from industry leaders and domain experts to accelerate your growth trajectory.',
    icon: '/assets/icons/mentorship-icon.svg',
  },
  {
    id: 6,
    title: 'Secure Data Environment',
    description: 'Operate with confidence in our encrypted, compliance-ready platform built for sensitive business intelligence.',
    icon: '/assets/icons/security-icon.svg',
  }
];

const FeaturesSection = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <section id="features" className="nl-section-gradient py-20 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="nl-grid-pattern"></div>
      </div>
      
      {/* Blur circles for depth */}
      <div className="nl-blur-circle bg-blue-500 -top-64 -left-20"></div>
      <div className="nl-blur-circle bg-purple-500 bottom-0 right-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful Features for <span className="text-gold">Exceptional Growth</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform offers a comprehensive suite of tools and resources designed 
              to accelerate your business growth and maximize investment potential.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="nl-feature-card hover:transform hover:scale-105"
            >
              <div className="nl-feature-icon-wrapper">
                <Image 
                  src={feature.icon} 
                  alt={feature.title} 
                  width={40} 
                  height={40}
                  className="nl-feature-icon"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-white">Our Impact <span className="text-gold">By the Numbers</span></h3>
          <div className="nl-data-metrics">
            <div className="nl-metric">
              <span className="nl-metric-value">250+</span>
              <span className="nl-metric-label">Startups Accelerated</span>
            </div>
            <div className="nl-metric">
              <span className="nl-metric-value">$120M+</span>
              <span className="nl-metric-label">Capital Raised</span>
            </div>
            <div className="nl-metric">
              <span className="nl-metric-value">30+</span>
              <span className="nl-metric-label">Countries Represented</span>
            </div>
            <div className="nl-metric">
              <span className="nl-metric-value">98%</span>
              <span className="nl-metric-label">Member Satisfaction</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection; 