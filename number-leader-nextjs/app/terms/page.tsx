'use client';

import Layout from '../../components/layout/StaticPageLayout';

const TermsAndConditionsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-center mb-8">Terms and Conditions</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="mb-6 text-gray-700">
            <p className="font-medium">Effective Date: 03rd MAY 2025</p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using Number Leader (Platform), you agree to comply with and be bound by
              these Terms of Use (Terms). If you do not agree with these Terms, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Platform Overview</h2>
            <p className="text-gray-700 mb-4">
              Number Leader is a technology platform that connects startups and investors and provides
              auxiliary services such as business valuation, due diligence, document generation, and related
              advisory.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Eligibility</h2>
            <p className="text-gray-700 mb-4">
              You must be at least 18 years old and capable of entering into legally binding agreements to use
              this Platform. By using the Platform, you represent and warrant that you meet these eligibility
              requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Obligations</h2>
            <p className="text-gray-700 mb-4">
              Users agree to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-gray-700">
              <li>Provide accurate, complete, and updated information during registration and usage.</li>
              <li>Use the Platform only for lawful purposes.</li>
              <li>Not engage in any activity that interferes with or disrupts the services or the servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Disclaimers</h2>
            <p className="text-gray-700 mb-4">
              The Platform does not provide financial or investment advice. Any investment decision made by
              users is at their own risk. The Platform disclaims liability for any loss arising from reliance on any
              content, report, or recommendation presented.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content, trademarks, logos, and service marks are the property of Number Leader or its
              licensors. Unauthorized use is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our Privacy Policy explains how we collect, use, and store your information. By using the Platform,
              you consent to the collection and use of information as described therein.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Fees and Payments</h2>
            <p className="text-gray-700 mb-4">
              Some services on the Platform may be chargeable. Users will be notified of applicable fees before
              incurring charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate or suspend access to the Platform without prior notice for any
              conduct that violates these Terms or is otherwise harmful to other users or the integrity of the
              Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law and Legal Recourse</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by and construed in accordance with the laws of India. Any disputes
              will be subject to exclusive jurisdiction of the courts of India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Modifications</h2>
            <p className="text-gray-700 mb-4">
              We may revise these Terms at any time. Continued use of the Platform after changes implies
              acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
            <p className="text-gray-700 mb-4">
            For questions regarding these Terms, contact us at <a href="mailto:nitish@numberleader.com" className="text-blue-500 hover:text-blue-700">nitish@numberleader.com</a>.
            </p>
          </section>
          
        </div>

        <div className="mt-12 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 italic">
            Disclaimer: The Terms and Conditions provided herein are part of the alpha launch of NUMBER LEADER and are for informational purposes only. They are not legally binding on the platform or its users and may be subject to updates and modifications as the platform evolves.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditionsPage; 