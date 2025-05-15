'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveContactForm } from '../../lib/firestore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    userType: false,
    message: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const errors = {
      name: formData.name.trim() === '',
      email: formData.email.trim() === '' || !validateEmail(formData.email),
      userType: formData.userType === '',
      message: formData.message.trim() === ''
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user types
    if (formErrors[id as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      // Create a reference to the CTA_LandingPage collection
      const ctaRef = collection(db, 'CTA_LandingPage');
      
      // Add a new document with form data
      await addDoc(ctaRef, {
        ...formData,
        timestamp: serverTimestamp(),
        source: 'landing_page_contact'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        userType: '',
        message: '',
      });
      
      setSubmitSuccess(true);
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark">Get In Touch</h2>
          <p className="text-xl text-gray-600">Ready to take the next step? Reach out to us today.</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {submitError && (
            <motion.div 
              className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {submitError}
            </motion.div>
          )}
          
          <motion.form 
            className="space-y-4"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <input 
                type="text" 
                id="name" 
                className={`w-full px-4 py-3 rounded-md border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-gold/50`}
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">Please enter your name</p>}
            </div>
            
            <div>
              <input 
                type="email" 
                id="email" 
                className={`w-full px-4 py-3 rounded-md border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-gold/50`}
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">Please enter a valid email</p>}
            </div>
            
            <div>
              <select 
                id="userType" 
                className={`w-full px-4 py-3 rounded-md border ${formErrors.userType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-gold/50`}
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="" disabled>I am a...</option>
                <option value="startup">Startup</option>
                <option value="investor">Investor</option>
                <option value="enabler">Enabler</option>
                <option value="other">Other</option>
              </select>
              {formErrors.userType && <p className="text-red-500 text-sm mt-1">Please select an option</p>}
            </div>
            
            <div>
              <textarea 
                id="message" 
                rows={5} 
                className={`w-full px-4 py-3 rounded-md border ${formErrors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-gold/50`}
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              {formErrors.message && <p className="text-red-500 text-sm mt-1">Please enter your message</p>}
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                className={`bg-gold hover:bg-gold/90 text-white font-medium py-3 px-8 rounded-md transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </motion.form>
          
          {submitSuccess && (
            <motion.div 
              className="mt-6 p-4 bg-green-100 text-green-700 rounded-md flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your message has been sent successfully. We will get back to you soon!
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 