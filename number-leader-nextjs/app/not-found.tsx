'use client';

import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-dark mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-lg">
          We couldn&apos;t find the page you were looking for. Perhaps you&apos;ve mistyped the URL or the page has been moved.
        </p>
        <Link 
          href="/" 
          className="bg-gold hover:bg-gold/90 text-white font-medium py-3 px-8 rounded-md transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </Layout>
  );
} 