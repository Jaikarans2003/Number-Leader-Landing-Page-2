'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { saveRegistration } from '../../lib/firestore';

const CtaSection = () => {
  const [formData, setFormData] = useState({
    email: '',
    userType: 'startup'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await saveRegistration(
        { email: formData.email }, 
        formData.userType as 'startup' | 'investor' | 'enabler'
      );
      
      if (result.success) {
        setSubmitted(true);
        // Reset form after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            email: '',
            userType: 'startup'
          });
        }, 5000);
      } else {
        setError('There was an error submitting your information. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="cta" className="py-20 bg-primary-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary-light to-secondary rounded-lg p-8 md:p-12 shadow-xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Scale Your Business?</h2>
              <p className="text-lg md:text-xl mb-6 text-gray-300">
                Join Number Leader today and gain access to expert guidance, tailored strategies, and innovative tools to accelerate your growth.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <FaArrowRight className="mt-1 mr-2 text-gold" />
                  <span>Personalized business strategies for your unique needs</span>
                </li>
                <li className="flex items-start">
                  <FaArrowRight className="mt-1 mr-2 text-gold" />
                  <span>Connect with investors and enablers in our network</span>
                </li>
                <li className="flex items-start">
                  <FaArrowRight className="mt-1 mr-2 text-gold" />
                  <span>Access to data-driven insights and analytics</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
            >
              {submitted ? (
                <div className="text-center py-10">
                  <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-300">We've received your information. Our team will be in touch soon!</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-4 text-center">Get Started Now</h3>
                  {error && <p className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md text-sm">{error}</p>}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="userType" className="block text-gray-300 mb-2">I am a...</label>
                      <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="startup">Startup</option>
                        <option value="investor">Investor</option>
                        <option value="enabler">Enabler</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 bg-gold hover:bg-gold/90 text-white font-medium rounded-md transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Processing...' : 'Get Started'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 