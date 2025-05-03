'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaSearchDollar, FaTools, FaFunnelDollar } from 'react-icons/fa';

const InvestorsSection = () => {
  const features = [
    {
      icon: <FaSearchDollar className="text-3xl text-gold" />,
      title: 'Private Market Intelligence Platform',
      description: 'Gain real-time insights into private market trends, valuations, and emerging opportunities to make informed investment decisions.'
    },
    {
      icon: <FaTools className="text-3xl text-gold" />,
      title: 'Investor Tool Suite',
      description: 'A comprehensive suite of tools designed to streamline your investment process, from deal sourcing to portfolio management and performance tracking.'
    },
    {
      icon: <FaFunnelDollar className="text-3xl text-gold" />,
      title: 'Fund Syndication Suite',
      description: 'Collaborate with co-investors and syndicate deals seamlessly, managing fund allocations, investor communications, and syndication terms efficiently'
    }
  ];

  return (
    <section id="investors" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark">For Investors</h2>
          <p className="text-xl mb-2 text-primary-dark">Smarter Deal Discovery</p>
          <p className="text-gray-600">
            Tools and insights designed to help investors find and evaluate the most promising opportunities.
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
              className="bg-gray-50 rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-dark">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
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
            Explore as an Investor
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestorsSection; 