'use client';

import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';

export default function TermsPage() {
  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Layout>
      <div className="pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-12"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-dark">
              Terms and Conditions
            </h1>
            <p className="text-xl text-gray-600">
              Last updated: January 1, 2024
            </p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-primary-dark">1. Introduction</h2>
              <p>Welcome to Number Leader. These Terms and Conditions govern your use of our website and services provided by Number Leader.</p>
              <p>By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
              
              <h2 className="text-2xl font-semibold mb-4 mt-8 text-primary-dark">2. Services Description</h2>
              <p>Number Leader provides a comprehensive platform designed to connect startups, investors, and enablers in the ecosystem. Our services include but are not limited to:</p>
              <ul className="list-disc ml-6 mb-4">
                <li>Financial planning and valuation tools for startups</li>
                <li>Investment opportunity discovery for investors</li>
                <li>Networking and showcasing capabilities for ecosystem enablers</li>
                <li>AI-powered document generation</li>
                <li>CRM and pipeline management tools</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4 mt-8 text-primary-dark">3. User Accounts</h2>
              <p>When you create an account with us, you must provide accurate, complete, and up-to-date information. You are responsible for safeguarding the password and for all activities that occur under your account.</p>
              <p>You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We cannot and will not be liable for any loss or damage arising from your failure to comply with this provision.</p>
              
              <h2 className="text-2xl font-semibold mb-4 mt-8 text-primary-dark">4. Intellectual Property</h2>
              <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Number Leader and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
              <p>Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Number Leader.</p>
              
              <h2 className="text-2xl font-semibold mb-4 mt-8 text-primary-dark">5. Data Privacy</h2>
              <p>Your use of our Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy for information on how we collect, use and disclose information from our users.</p>
              
              <h2 className="text-2xl font-semibold mb-4 mt-8 text-primary-dark">6. Termination</h2>
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p>
              
              <h2 className="text-2xl font-semibold mb-4 mt-8 text-primary-dark">7. Limitation of Liability</h2>
              <p>In no event shall Number Leader, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
              
              <h2 className="text-2xl font-semibold mb-4 mt-8 text-primary-dark">8. Changes</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
              <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>
              
              <h2 className="text-2xl font-semibold mb-4 mt-8 text-primary-dark">9. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p>Email: info@numberleader.com</p>
              <p>Address: Bangalore, India</p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 