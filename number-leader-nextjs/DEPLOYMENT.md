# Number Leader - Production Deployment Guide

This guide will walk you through deploying the Number Leader Next.js application to Firebase Hosting.

## Prerequisites

- Node.js and npm installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase account with a project created
- Access to the Firebase project

## Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:
```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

Replace the placeholder values with your actual Firebase configuration.

## Firebase Functions Configuration

For Firebase Functions, which handle email sending and other sensitive operations, configure the environment variables using the Firebase CLI:

```bash
# Set email service configuration
firebase functions:config:set email.user="notify@numberleader.com" email.password="your-secure-password" email.admin="notify@numberleader.com" email.contact="info@numberleader.com"

# Set storage URLs
firebase functions:config:set storage.brochure_url="https://firebasestorage.googleapis.com/v0/b/your-project-id.firebasestorage.app/o/your-brochure-path?alt=media"
```

## Building for Production

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

This will create a static export in the `out` directory (configured in `next.config.mjs`).

## Deploying to Firebase Hosting

1. Login to Firebase (if not already logged in):
```bash
firebase login
```

2. Deploy to Firebase Hosting:
```bash
npm run deploy
```

Or, to deploy both hosting and functions:
```bash
npm run deploy:all
```

## Verifying Deployment

After deployment is complete, you can access your application at the Firebase Hosting URL (e.g., `https://numberleader-9210c.web.app`).

## Security Best Practices

1. **Environment Variables**:
   - Never commit `.env.local` or any file containing secrets to version control
   - Use Firebase Config for server-side secrets instead of hardcoding them
   - Rotate credentials periodically

2. **Firebase Security Rules**:
   - Set up proper Firestore and Storage security rules
   - Restrict access to authenticated users where appropriate
   - Use role-based access control for admin functions

3. **API Keys**:
   - The Firebase Web API keys (NEXT_PUBLIC_*) are meant to be public, but still follow best practices
   - Restrict API key usage in the Google Cloud Console by:
     - Setting HTTP referrer restrictions
     - Enabling only necessary APIs for each key

4. **Email Configuration**:
   - Use app-specific passwords for email services
   - Consider using a dedicated email service like SendGrid or Mailgun for production

## Troubleshooting

- If you encounter issues with static export, check the `next.config.mjs` file to ensure `output: 'export'` is set.
- For image optimization issues, verify that `images: { unoptimized: true }` is set in `next.config.mjs`.
- If Firebase deployment fails, check your `firebase.json` configuration.
- If environment variables aren't working, verify they're properly set in both the local `.env.local` file and Firebase config.

## Security Notes

- Never commit your `.env.local` file to version control
- Regularly rotate your Firebase API keys
- Use Firebase Authentication security rules to protect your Firestore data 