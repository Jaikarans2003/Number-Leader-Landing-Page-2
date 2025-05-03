// Import Firebase Functions v4
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { emailConfig } from './environment';

// Initialize Firebase Admin SDK
admin.initializeApp();

// URL to the existing Number Leader brochure PDF
const BROCHURE_URL = 'https://firebasestorage.googleapis.com/v0/b/numberleader-9210c.firebasestorage.app/o/Number%20Leader%20Brochure.pdf?alt=media&token=51898f02-e69a-463f-8946-2d27a329f531';

// Log email configuration (with password masked for security)
console.log(`Email configuration initialized with: 
  - Host: ${emailConfig.host}
  - Port: ${emailConfig.port}
  - User: ${emailConfig.auth.user}
  - Secure: ${emailConfig.secure}
  - Password provided: ${emailConfig.auth.pass ? 'Yes' : 'No'}
`);

// Create a function to get a fresh transporter for each email
const getTransporter = () => {
  // Create and verify transport configuration before returning
  const transporter = nodemailer.createTransport(emailConfig);
  
  // Log success after creating the transporter
  console.log('Nodemailer transporter created successfully');
  
  return transporter;
};

// Define the interface for our document data
interface ServicePageData {
  name: string;
  email: string;
  message?: string;
}

// Define the interface for brochure request tracking
interface BrochureRequestTracking {
  email: string;
  count: number;
  lastRequestTime: admin.firestore.Timestamp;
  blocked?: boolean;
}

// Define the interface for the landing page contact form data
interface LandingPageContactData {
  name: string;
  email: string;
  userType: string;
  message: string;
}

// Define the Cloud Function using v4 syntax
export const sendServicesBrochure = onDocumentCreated(
  'CTA_ServicesPage/{documentId}',
  async (event) => {
    try {
      // Get document data
      const snapshot = event.data as DocumentSnapshot | undefined;
      if (!snapshot) {
        console.log('No data in the document');
        return { error: 'No data in the document' };
      }
      
      const data = snapshot.data() as ServicePageData;
      const { name, email, message } = data;
      const documentId = snapshot.id;
      
      // Check if email is properly formatted
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        console.error('Invalid email address:', email);
        return { error: 'Invalid email address' };
      }
      
      // Check request limit - use a sanitized version of the email as document ID
      const sanitizedEmail = email.replace(/[.#$\/[\]]/g, '_');
      const requestTrackingRef = admin.firestore().collection('brochureRequestTracking').doc(sanitizedEmail);
      
      // Get current tracking data or create new if doesn't exist
      const requestTrackingDoc = await requestTrackingRef.get();
      let requestTracking: BrochureRequestTracking;
      
      if (requestTrackingDoc.exists) {
        requestTracking = requestTrackingDoc.data() as BrochureRequestTracking;
        
        // Check if user is blocked
        if (requestTracking.blocked) {
          console.log(`Request blocked - Email ${email} is marked as blocked`);
          
          // Update the original document with blocked status
          await snapshot.ref.update({
            emailSent: false,
            emailError: 'Email is blocked due to excessive requests',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          
          return { error: 'Email is blocked due to excessive requests' };
        }
        
        // Check if exceeding limit
        if (requestTracking.count >= 5) {
          console.log(`Request limit exceeded for ${email} - Count: ${requestTracking.count}`);
          
          // Mark as blocked
          await requestTrackingRef.update({
            blocked: true,
            lastRequestTime: admin.firestore.FieldValue.serverTimestamp()
          });
          
          // Send abuse notification to admin
          const adminNotificationOptions = {
            from: `"NUMBER LEADER" <${emailConfig.auth.user}>`,
            to: 'jaikaran.pesce@gmail.com',
            subject: 'ALERT: Brochure Request Limit Exceeded',
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #A52A2A;">Brochure Request Limit Exceeded</h2>
                <p>A user has exceeded the brochure request limit (5 requests).</p>
                <h3>User Details:</h3>
                <table style="border-collapse: collapse; width: 100%;">
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Request Count:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${requestTracking.count + 1}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Document ID:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${documentId}</td>
                  </tr>
                </table>
                <p>This email has been automatically blocked from requesting more brochures.</p>
                <p>This is an automated notification from the NUMBER LEADER website.</p>
              </div>
            `
          };
          
          // Send abuse warning to user
          const userWarningOptions = {
            from: `"NUMBER LEADER" <${emailConfig.auth.user}>`,
            to: email,
            subject: 'Number Leader - Brochure Request Limit',
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #A52A2A;">Brochure Request Limit Exceeded</h2>
                <p>Dear ${name},</p>
                <p>Our system has detected that you have requested our brochure multiple times.</p>
                <p>To prevent abuse of our systems, we limit the number of times a single email address can request our brochure.</p>
                <p>If you need additional information about our services, please contact us directly at <a href="mailto:info@numberleader.com">info@numberleader.com</a>.</p>
                <br>
                <p>Best regards,</p>
                <p><strong>NUMBER LEADER Team</strong></p>
              </div>
            `
          };
          
          // Get a fresh transporter for each email
          const adminTransporter = getTransporter();
          const userTransporter = getTransporter();
          
          // Send both notifications
          try {
            await adminTransporter.sendMail(adminNotificationOptions);
            await userTransporter.sendMail(userWarningOptions);
            console.log(`Abuse notifications sent for ${email}`);
          } catch (emailError) {
            console.error('Error sending abuse notifications:', emailError);
          }
          
          // Update document with blocked status
          await snapshot.ref.update({
            emailSent: false,
            emailError: 'Brochure request limit exceeded',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          
          return { error: 'Brochure request limit exceeded' };
        }
        
        // Increment request count
        await requestTrackingRef.update({
          count: admin.firestore.FieldValue.increment(1),
          lastRequestTime: admin.firestore.FieldValue.serverTimestamp()
        });
        
        requestTracking.count++; // Update local copy for notification
      } else {
        // Create new tracking document
        requestTracking = {
          email,
          count: 1,
          lastRequestTime: admin.firestore.Timestamp.now()
        };
        
        await requestTrackingRef.set(requestTracking);
      }
      
      // Download PDF brochure
      console.log(`Downloading brochure for ${email}`);
      const response = await axios.get(BROCHURE_URL, {
        responseType: 'arraybuffer'
      });
      
      // Convert to Buffer
      const pdfBuffer = Buffer.from(response.data);
      
      // Email content for user
      const userEmailOptions = {
        from: `"NUMBER LEADER" <${emailConfig.auth.user}>`,
        to: email,
        subject: 'Hi, welcome to NUMBER LEADER',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1a5276;">Welcome to NUMBER LEADER!</h2>
            <p>Dear ${name},</p>
            <p>Thank you for your interest in NUMBER LEADER. We're excited to have you join our community.</p>
            <p>We've attached our services brochure with details about how we can help your business grow.</p>
            ${message ? `<p>Regarding your message: <em>"${message}"</em></p>
            <p>Our team will contact you shortly to discuss your specific needs.</p>` : ''}
            <p>If you have any questions, please don't hesitate to reach out to us.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>NUMBER LEADER Team</strong></p>
          </div>
        `,
        attachments: [
          {
            filename: 'NumberLeader_Services_Brochure.pdf',
            content: pdfBuffer
          }
        ]
      };
      
      // Email content for admin notification
      const adminNotificationOptions = {
        from: `"NUMBER LEADER" <${emailConfig.auth.user}>`,
        to: 'jaikaran.pesce@gmail.com',
        subject: 'Brochure Sent - NUMBER LEADER',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1a5276;">Brochure Sent Notification</h2>
            <p>A brochure has been sent to a user from the NUMBER LEADER services page.</p>
            <h3>Details:</h3>
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Request Count:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${requestTracking.count} of 5 allowed</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Document ID:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${documentId}</td>
              </tr>
            </table>
            <p>This is an automated notification from the NUMBER LEADER website.</p>
          </div>
        `
      };
      
      // Get fresh transporters for each email
      const userTransporter = getTransporter();
      const adminTransporter = getTransporter();
      
      // Send email to user
      console.log(`Sending brochure email to ${email}`);
      try {
        const userInfo = await userTransporter.sendMail(userEmailOptions);
        console.log(`Email sent successfully to ${email}. Message ID: ${userInfo.messageId}`);
        
        // Send admin notification
        const adminInfo = await adminTransporter.sendMail(adminNotificationOptions);
        console.log(`Admin notification sent to jaikaran.pesce@gmail.com. Message ID: ${adminInfo.messageId}`);
      } catch (emailError) {
        console.error('Email sending error details:', emailError);
        throw emailError; // rethrow to handle in the main catch block
      }
      
      // Update document with success status
      await snapshot.ref.update({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        brochureUrl: BROCHURE_URL,
        requestCount: requestTracking.count
      });
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Error in sendServicesBrochure function:', error);
      
      // Update document with error status if data exists
      if (event.data) {
        try {
          await (event.data as DocumentSnapshot).ref.update({
            emailSent: false,
            emailError: error instanceof Error ? error.message : 'Unknown error',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (updateError) {
          console.error('Error updating document with error status:', updateError);
        }
      }
      
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
);

// Define the Cloud Function for sending notifications when a contact form is submitted
export const notifyLandingPageContact = onDocumentCreated(
  'CTA_LandingPage/{documentId}',
  async (event) => {
    try {
      // Get document data
      const snapshot = event.data as DocumentSnapshot | undefined;
      if (!snapshot) {
        console.log('No data in the document');
        return { error: 'No data in the document' };
      }
      
      const data = snapshot.data() as LandingPageContactData;
      const { name, email, userType, message } = data;
      const documentId = snapshot.id;
      
      // Email content for the notification
      const mailOptions = {
        from: `"NUMBER LEADER" <${emailConfig.auth.user}>`,
        to: 'jaikaran.pesce@gmail.com', // Email to notify about the new contact
        subject: 'New Contact Form Submission - NUMBER LEADER',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1a5276;">New Contact Form Submission</h2>
            <p>A new contact form has been submitted on the NUMBER LEADER landing page.</p>
            <h3>Contact Details:</h3>
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Document ID:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${documentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">User Type:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${userType}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
              </tr>
            </table>
            <p>Please respond to this inquiry as soon as possible.</p>
            <p>This is an automated notification from the NUMBER LEADER website.</p>
          </div>
        `
      };
      
      // Get a fresh transporter for this email
      const transporter = getTransporter();
      
      // Send email notification
      console.log(`Sending notification email to jaikaran.pesce@gmail.com for new contact form submission`);
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Notification email sent successfully. Message ID: ${info.messageId}`);
      } catch (emailError) {
        console.error('Email sending error details:', emailError);
        throw emailError; // rethrow to handle in the main catch block
      }
      
      // Update document with notification status
      await snapshot.ref.update({
        notificationSent: true,
        notificationSentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Error in notifyLandingPageContact function:', error);
      
      // Update document with error status if data exists
      if (event.data) {
        try {
          await (event.data as DocumentSnapshot).ref.update({
            notificationSent: false,
            notificationError: error instanceof Error ? error.message : 'Unknown error',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (updateError) {
          console.error('Error updating document with error status:', updateError);
        }
      }
      
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
); 