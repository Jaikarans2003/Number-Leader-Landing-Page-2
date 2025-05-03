// Environment configuration for Firebase Functions
// This keeps sensitive information out of version control

// Email configuration
export const emailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'jaikaran.pesce@gmail.com',
    pass: 'okjihtjsfbldesvr' // App password with spaces removed
  },
  tls: {
    rejectUnauthorized: false
  }
};

// Replace the above email placeholders with actual values
// when deploying to production by setting environment variables
// Example Firebase CLI command to set environment variables:
// firebase functions:config:set email.service="gmail" email.user="jaikaran.pesce@gmail.com" email.password="okjihtjsfbldesvr"

// Company information used in emails and PDFs
export const companyInfo = {
  name: 'NUMBER LEADER',
  tagline: 'Empowering Startups. Enabling Investments!',
  email: 'info@numberleader.com',
  phone: '+1 (234) 567-890',
  website: 'www.numberleader.com',
  year: new Date().getFullYear()
};

// Services offered, used in PDF generation
export const services = [
  'Management Consulting: Strategic planning, operational efficiency, and organizational development.',
  'Virtual CFO: Comprehensive financial management including budgeting and forecasting.',
  'Fundraising Strategy: Tailored support to craft compelling funding strategies.',
  'Transaction Advisory: Guidance on mergers, acquisitions, and strategic transactions.',
  'M&A: Expert support in mergers, acquisitions, and exits.',
  'IPO Advisory: End-to-end support for preparing your company for an IPO.'
]; 