'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { saveServiceInquiry } from '../../lib/firestore';

const ServiceCard = ({ title, description, index }: { title: string; description: string; index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
  >
    <h3 className="text-xl font-bold mb-3 text-primary-dark">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
    service: 'startup'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Save to Firestore using our service
      const result = await saveServiceInquiry(formData);
      
      if (result.success) {
        setSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            role: '',
            message: '',
            service: 'startup'
          });
        }, 3000);
      } else {
        setError('There was an error submitting your form. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {submitted ? (
        <div className="text-center py-10">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
          <p className="text-gray-600">Your message has been sent successfully. We&apos;ll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-gray-700 font-medium mb-2">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Your Company"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Your Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="CEO, CTO, Manager, etc."
              />
            </div>
            <div>
              <label htmlFor="service" className="block text-gray-700 font-medium mb-2">Service Type</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
              >
                <option value="startup">Startup Services</option>
                <option value="investor">Investor Services</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Tell us about your needs and how we can help..."
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 bg-gold text-white rounded-md font-medium hover:bg-gold/90 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

const ServicesPage = () => {
  const startupServices = [
    {
      title: "Management Consulting",
      description: "We help startups scale with strategic planning, operational efficiency, and organizational development, laying the foundation for long-term success."
    },
    {
      title: "Virtual CFO",
      description: "Comprehensive financial management, including budgeting, forecasting, and cash flow optimization, to ensure your business stays on track and thrives."
    },
    {
      title: "Fundraising Strategy",
      description: "Tailored support to craft compelling funding strategies, attract investors, and secure the capital needed to fuel your growth."
    },
    {
      title: "Transaction Advisory",
      description: "Guidance on mergers, acquisitions, and other strategic transactions, optimizing value and ensuring smooth execution."
    },
    {
      title: "M&A",
      description: "Expert support in mergers, acquisitions, and exits, focusing on maximizing shareholder value and ensuring seamless transitions."
    },
    {
      title: "IPO Advisory Services",
      description: "End-to-end support for preparing your company for an Initial Public Offering (IPO), from financial audits and regulatory compliance to creating a compelling story for investors."
    }
  ];

  const investorServices = [
    {
      title: "Scouting LP Investors",
      description: "We help you connect with potential Limited Partners (LPs) who align with your investment strategy, broadening your capital sources and strengthening your fund-raising efforts."
    },
    {
      title: "Due Diligence",
      description: "Our thorough due diligence services allow investors to carefully assess potential investments, evaluating financial, legal, and operational risks before making a commitment."
    },
    {
      title: "Deal Negotiation",
      description: "We assist in negotiating favorable terms, ensuring alignment with your investment objectives and helping you secure the best possible deal."
    },
    {
      title: "Deal Structuring",
      description: "Our team helps design the optimal deal structure, including pricing, equity distribution, and financing terms, to enhance value and minimize risk for your portfolio."
    },
    {
      title: "Deal Execution",
      description: "We manage all closing activities, compliance checks, and legal documentation, ensuring a smooth and efficient execution of the deal."
    },
    {
      title: "Post-Deal Integration",
      description: "Our support continues after the deal is closed, focusing on the successful integration of the acquired company to ensure operational efficiency and maximize value creation."
    }
  ];

  return (
    <Layout isServicesPage={true}>
      <div className="bg-gray-50 pt-24">
        {/* Page Header */}
        <div className="bg-primary-dark text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-xl max-w-3xl mx-auto text-gray-300">
                Tailored solutions to accelerate growth and maximize value for both startups and investors.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Startup Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-primary-dark mb-4">Startup Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive solutions to help startups navigate challenges, accelerate growth, and achieve their vision.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {startupServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Investor Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-primary-dark mb-4">Investor Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Strategic support to enhance investment decisions, optimize portfolio performance, and maximize returns.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {investorServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact-form" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-primary-dark mb-4">Get in Touch</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                In mean time download our detailed brochure.
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ServicesPage; 