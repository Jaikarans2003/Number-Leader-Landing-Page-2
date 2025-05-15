'use client';

import Layout from '../../components/layout/StaticPageLayout';

const FAQPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* About the Platform */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. About the Platform</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Q: What is NUMBER LEADER?</h3>
                <p className="text-gray-700">A: NUMBER LEADER is a dynamic investment and startup growth platform designed to facilitate secure connections between investors and startups. We provide data-driven insights, business valuation models, due diligence services, and investor outreach to streamline funding processes.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: How does NUMBER LEADER support decision-making for investors?</h3>
                <p className="text-gray-700">A: We provide in-depth startup profiles enriched with key metrics such as revenue projections, risk analysis, and sector-specific benchmarks. Investors can access due diligence reports, valuation assessments, and track record data to make well-informed investment decisions.</p>
              </div>
            </div>
          </section>

          {/* User Registration & Profiles */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. User Registration & Profiles</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Q: What types of accounts are available on NUMBER LEADER?</h3>
                <p className="text-gray-700">A: We offer three distinct account types:</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                  <li>Startup Accounts – Access to fundraising tools, valuation models, and investor insights.</li>
                  <li>Investor Accounts – Comprehensive portfolio tracking, startup scoring, and due diligence support.</li>
                  <li>Enabler Accounts – Access to business diagnostics and strategic consulting dashboards.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: Can I manage multiple profiles under a single account?</h3>
                <p className="text-gray-700">A: Yes, you can manage multiple profiles under a single user account, such as operating as both a startup founder and an investor. However, the subscription is structured on a per-company basis.</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                  <li>If you represent multiple startups or business entities, each company will require a separate subscription plan based on the chosen tier (Basic, Premium, Professional).</li>
                  <li>You can switch between company profiles from a unified dashboard for streamlined access, but billing will be calculated individually for each entity.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Advanced Services & Features */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Advanced Services & Features</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Q: What advanced services does the platform provide?</h3>
                <p className="text-gray-700">A: Beyond basic matchmaking, our advanced services include:</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                  <li>Data-Driven Valuation Models: Automated business valuation based on financials, sector trends, and comparable transactions.</li>
                  <li>Custom Due Diligence Reports: Deep dives into financial health, legal status, and market positioning.</li>
                  <li>Investor Insights Dashboard: Visual analytics, investor scoring, and tracking of investment interest levels.</li>
                  <li>Risk Profiling & Mitigation Analysis: Identifying and quantifying potential risks to enhance investor confidence.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: Can I request a custom report or investor presentation?</h3>
                <p className="text-gray-700">A: Yes, we offer customized reports and presentations based on your specific requirements, including financial projections, SWOT analysis, and funding strategy recommendations.</p>
              </div>
            </div>
          </section>

          {/* Pricing & Payment */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Pricing & Payment</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Q: How is pricing structured for various services?</h3>
                <p className="text-gray-700">A: Our subscription model is structured across three tiers, each designed to meet different business needs:</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                  <li>Basic Plan (INR 0/year):
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>Access to core features like pitch presentations, investment strategy, investor tools, and basic financial planning.</li>
                      <li>Suitable for early-stage startups seeking visibility.</li>
                    </ul>
                  </li>
                  <li>Premium Plan (INR 15,000/year):
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>Includes advanced features like business plan and financial analysis, valuation and benchmarking, cap table management, and fundraising tools.</li>
                      <li>Ideal for startups preparing for funding rounds and deeper investor engagement.</li>
                    </ul>
                  </li>
                  <li>Professional Plan (INR 20,000/year):
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>Comprehensive access to all features, including document vault, AI Assistant, Biz Plan Generator, and Pitch Deck Generator.</li>
                      <li>Best suited for growth-stage startups seeking structured funding and investor relations management.</li>
                    </ul>
                  </li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: Is the payment structure per user or per company?</h3>
                <p className="text-gray-700">A: The payment model is per company:</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                  <li>A single user can operate multiple company profiles under one account, but each company will require a separate subscription plan.</li>
                  <li>Subscription fees are applied based on the selected plan (Basic, Premium, or Professional) for each company entity.</li>
                  <li>Users can switch between company profiles seamlessly, but billing is calculated independently for each company.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: Can I upgrade or downgrade my subscription plan?</h3>
                <p className="text-gray-700">A: Yes, you can upgrade or downgrade your plan at any time. The billing difference will be adjusted on a prorated basis.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: What payment methods are accepted?</h3>
                <p className="text-gray-700">A: We accept payments via:</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                  <li>Credit/Debit Cards</li>
                  <li>UPI</li>
                  <li>Bank Transfers</li>
                  <li>Authorized Payment Gateways</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: Are refunds available for plan changes or cancellations?</h3>
                <p className="text-gray-700">A: Refunds are not available for partial months.</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                  <li>If you downgrade, the lower plan will be activated at the next billing cycle.</li>
                  <li>For upgrades, the higher plan features are activated immediately, with charges adjusted for the remaining billing period.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Data Security & Confidentiality */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security & Confidentiality</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Q: How is sensitive business information protected?</h3>
                <p className="text-gray-700">A: We use bank-grade encryption, multi-factor authentication (MFA), and real-time monitoring to secure all data. Additionally, all financial and strategic reports are stored in encrypted formats, accessible only to authorized users.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: Can I restrict data visibility to specific investors?</h3>
                <p className="text-gray-700">A: Absolutely. Our Data Sharing Controls allow startups to manage document visibility by investor, ensuring that only vetted stakeholders access confidential information.</p>
              </div>
            </div>
          </section>

          {/* Reporting & Analytics */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Reporting & Analytics</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Q: What analytics tools are available to startups and investors?</h3>
                <p className="text-gray-700">A: Our platform includes:</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                  <li>Valuation Heatmaps: Visual representation of financial and market metrics.</li>
                  <li>Investor Engagement Insights: Track investor interest, meeting requests, and document views.</li>
                  <li>Risk Analysis Reports: Real-time identification of financial or legal red flags.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: Can I export data and reports?</h3>
                <p className="text-gray-700">A: Yes. Users can export data in PDF, Excel, or custom formats for offline analysis and integration with existing financial tools.</p>
              </div>
            </div>
          </section>

          {/* Account Management & Customization */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Account Management & Customization</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Q: How do I update my profile information?</h3>
                <p className="text-gray-700">A: Your account is structured under main sections, few basic information can be accessed as under:</p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                  <li>Profile: Update company basics, product/services, pitch decks, cap table, and valuation details.</li>
                  <li>Business Finance: Manage financials, budgets, forecasting, and benchmarking.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Dispute Resolution & Support */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Dispute Resolution & Support</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Q: How does the platform handle disputes?</h3>
                <p className="text-gray-700">A: We have a structured Dispute Resolution Framework, enabling users to report concerns, request mediation, or escalate to formal dispute resolution channels.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Q: How can I get technical support?</h3>
                <p className="text-gray-700">A: Contact our 24/7 support team via nitish@numberleader.com</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 italic">
            Disclaimer: The FAQs provided herein are part of the alpha launch of NUMBER LEADER and are for informational purposes only. They are not legally binding on the platform or its users and may be subject to updates and modifications as the platform evolves.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage; 