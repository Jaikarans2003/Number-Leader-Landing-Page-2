# Number Leader - Next.js Website

This repository contains the Number Leader website built with Next.js, Firebase, and TailwindCSS. The site includes a landing page, services page, testimonials, contact forms, and an admin dashboard for managing content.

## Project Structure

```
number-leader-nextjs/
├── app/                # Next.js app directory (pages and routes)
├── components/         # React components
├── firebase/           # Firebase functions
│   └── functions/      # Cloud Functions for email notifications
├── firebase-config/    # Firebase configuration files
├── lib/                # Utility functions and Firebase setup
├── public/             # Static assets
└── out/                # Production build output (generated)
```

## Prerequisites

- Node.js 18+ and npm
- Firebase account with a project created
- Firebase CLI installed: `npm install -g firebase-tools`

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd number-leader-nextjs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
# Firebase Web App Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Email Configuration for Firebase Functions
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_notification_email@example.com
EMAIL_PASSWORD=your_app_password_here

# Admin Settings
ADMIN_EMAIL=admin@example.com
CONTACT_EMAIL=contact@example.com

# Storage URLs
BROCHURE_URL=https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/Number%20Leader%20Brochure.pdf?alt=media
```

### 4. Firebase Project Setup

1. Login to Firebase:
```bash
firebase login
```

2. Initialize Firebase with your project:
```bash
firebase use --add
```

3. Configure Firebase Functions environment:
```bash
# Email configuration
firebase functions:config:set email.user="notify@example.com" email.password="your-app-password" email.admin="admin@example.com" email.contact="contact@example.com"

# Storage URLs
firebase functions:config:set storage.brochure_url="https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/Number%20Leader%20Brochure.pdf?alt=media"
```

### 5. Firebase Security Rules

The repository includes security rules for Firestore and Storage:

- `firestore.rules`: Controls access to Firestore collections
- `storage.rules`: Controls access to Firebase Storage files

Review these files and update them according to your security requirements.

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Building for Production

```bash
npm run build
```

This creates a static export in the `out` directory.

### Deploy to Firebase

Deploy just the hosting:
```bash
npm run deploy
```

Deploy both hosting and functions:
```bash
npm run deploy:all
```

Deploy only functions:
```bash
npm run deploy:functions
```

## Features

- **Landing Page**: Modern, responsive landing page
- **Services Page**: Details about Number Leader services
- **Contact Forms**: Forms for inquiries with email notifications
- **Admin Dashboard**: Protected area for managing content
- **Testimonials System**: Add, edit, and delete testimonials with images
- **Firebase Integration**: Authentication, Firestore, Storage, and Functions

## Admin Access

To access the admin dashboard:
1. Go to `/admin`
2. Login with an admin email (must end with `@numberleader.com` or be listed in the admin emails)
3. Use the dashboard to manage testimonials and download form submissions

## Important Notes

### Firebase Storage

The site uses Firebase Storage for:
- Storing the services brochure (PDF)
- Storing testimonial images

Make sure your storage rules are properly configured to allow these operations.

### Firebase Functions

The site uses Firebase Functions for:
- Sending email notifications for contact form submissions
- Sending the services brochure to users

Make sure your functions are deployed and properly configured.

### Security

- Never commit `.env.local` or any files containing secrets to version control
- Regularly rotate your Firebase API keys and credentials
- Use Firebase Authentication security rules to protect your data

## Troubleshooting

- **Missing or insufficient permissions**: Ensure your Firebase storage rules are properly configured and deployed
- **Email notifications not working**: Check the Firebase Functions logs and ensure your email credentials are correct
- **Admin access issues**: Verify the admin email configuration in both environment variables and code
- **Testimonial image upload issues**: Check that your storage rules allow authenticated users to upload to the testimonials folder

## Files to Remove Before Deployment

The following files can be safely removed before deployment as they are either temporary or development-only:

1. `update-config.ps1` - PowerShell script for local development
2. `ENV-SETUP.md` - Instructions merged into this README
3. `DEPLOYMENT.md` - Instructions merged into this README
4. `.cursor/` directory - Editor-specific files
5. Any nested `number-leader-nextjs` directory - Duplicate files
6. `.firebase/` directory - Local Firebase cache
7. Any `.log` files - Temporary logs

## License

© 2023-2024 Number Leader. All rights reserved.
