"use strict";
// Environment configuration for Firebase Functions
// This keeps sensitive information out of version control
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = exports.companyInfo = exports.emailConfig = void 0;
// Email configuration
exports.emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE !== 'false', // use SSL
    auth: {
        user: process.env.EMAIL_USER || 'notify@numberleader.com',
        pass: process.env.EMAIL_PASSWORD || 'buytkobxrqgkubrh'
    },
    tls: {
        rejectUnauthorized: false
    }
};
// Replace the above email placeholders with actual values
// when deploying to production by setting environment variables
// Example Firebase CLI command to set environment variables:
// firebase functions:config:set email.user="your_email_here" email.password="your-secure-password" email.admin="your_admin_email_here"
// Contact email (for user-facing communications)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@numberleader.com';
// Company information used in emails and PDFs
exports.companyInfo = {
    name: 'NUMBER LEADER',
    tagline: 'Empowering Startups. Enabling Investments!',
    email: CONTACT_EMAIL,
    phone: '+1 (234) 567-890',
    website: 'www.numberleader.com',
    year: new Date().getFullYear()
};
// Services offered, used in PDF generation
exports.services = [
    'Management Consulting: Strategic planning, operational efficiency, and organizational development.',
    'Virtual CFO: Comprehensive financial management including budgeting and forecasting.',
    'Fundraising Strategy: Tailored support to craft compelling funding strategies.',
    'Transaction Advisory: Guidance on mergers, acquisitions, and strategic transactions.',
    'M&A: Expert support in mergers, acquisitions, and exits.',
    'IPO Advisory: End-to-end support for preparing your company for an IPO.'
];
//# sourceMappingURL=environment.js.map