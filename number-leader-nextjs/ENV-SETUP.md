# Environment Setup Instructions

## Local Development

For local development, create a `.env.local` file in the project root with the following variables:

```
# Firebase Web App Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Email Configuration for Nodemailer 
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_email_here
EMAIL_PASSWORD=your_secure_password_here

# Admin Settings
ADMIN_EMAIL=your_admin_email_here
CONTACT_EMAIL=your_contact_email_here

# Storage URLs
BROCHURE_URL=https://firebasestorage.googleapis.com/v0/b/your-project-id.firebasestorage.app/o/your-brochure-path?alt=media
```

## Firebase Functions Environment

For the Firebase Functions (which handle email sending and PDF generation), set environment variables using Firebase CLI:

```bash
# Email configuration
firebase functions:config:set email.user="your_email_here" email.password="your-secure-password" email.admin="your_admin_email_here" email.contact="your_contact_email_here"

# Storage URLs
firebase functions:config:set storage.brochure_url="https://firebasestorage.googleapis.com/v0/b/your-project-id.firebasestorage.app/o/your-brochure-path?alt=media"
```

## Security Best Practices

1. **Never commit .env files to version control**
   - The `.gitignore` is set up to exclude all `.env*` files except for `.env.example`

2. **Rotate credentials regularly**
   - Change API keys and passwords periodically
   - Update both local `.env.local` and Firebase environment variables

3. **Restrict Firebase API key usage**
   - In Firebase Console, set up API key restrictions
   - Enable only the necessary APIs
   - Set up domain restrictions for your keys

## Environment Variables Summary

All sensitive information is now properly secured in environment variables:

1. **`lib/firebase.ts`** - Firebase configuration uses environment variables
2. **`firebase/functions/src/environment.ts`** - Email credentials now use Firebase Config 
3. **`firebase/functions/src/index.ts`** - Admin email and brochure URL use environment variables
4. **`firebase/functions/lib/environment.js`** - Compiled JS version of email settings
5. **`firebase/functions/lib/index.js`** - Compiled JS version with environment variables

## Security Improvements Made

1. **Removed hardcoded API keys** from the Firebase configuration
2. **Removed hardcoded email password** from the Firebase Functions
3. **Removed hardcoded admin email addresses** from notification functions
4. **Removed token from brochure URL** in both source and compiled files

## Before Deployment

Before deploying to production, ensure you:

1. Have properly set up all environment variables either through `.env.local` (for Next.js) or Firebase Config (for Cloud Functions)
2. Have updated `.env.example` with the correct variable names (but no actual values)
3. Test that no hardcoded credentials remain in the codebase
4. Verify your Firebase security rules are properly configured

The included `.gitignore` file already prevents any `.env` files from being committed to version control. 