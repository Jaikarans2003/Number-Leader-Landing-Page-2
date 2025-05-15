'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import LoginForm from '../../components/auth/LoginForm';
import SignUpForm from '../../components/auth/SignUpForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { getCurrentUser } from '../../lib/auth';

type AuthView = 'login' | 'signup' | 'forgot';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          // Redirect to admin dashboard if already authenticated
          router.push('/admin');
        }
      } catch (error: unknown) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Handle view switching
  const switchToLogin = () => setCurrentView('login');
  const switchToSignUp = () => setCurrentView('signup');
  const switchToForgotPassword = () => setCurrentView('forgot');
  
  // Render the appropriate form based on the current view
  const renderAuthForm = () => {
    switch (currentView) {
      case 'signup':
        return <SignUpForm onSwitchToLogin={switchToLogin} />;
      case 'forgot':
        return <ForgotPasswordForm onSwitchToLogin={switchToLogin} />;
      case 'login':
      default:
        return (
          <LoginForm 
            onSwitchToSignUp={switchToSignUp} 
            onSwitchToForgotPassword={switchToForgotPassword} 
          />
        );
    }
  };
  
  return (
    <Layout>
      <section className="py-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {isLoading ? (
              <div className="text-center p-8">
                <div className="inline-block w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : (
              renderAuthForm()
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AuthPage; 