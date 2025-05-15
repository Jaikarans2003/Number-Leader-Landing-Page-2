'use client';

import { useState } from 'react';
import { resetPassword } from '../../lib/auth';
import { FaSpinner } from 'react-icons/fa';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

const ForgotPasswordForm = ({ onSwitchToLogin }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-primary-dark">Reset Password</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Reset instructions sent! Please check your email.
          </div>
          
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="bg-gold hover:bg-gold/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">
            Enter your email address below and we'll send you instructions to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-gold hover:bg-gold/90 text-white font-medium py-2 px-4 rounded-md transition-colors flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <><FaSpinner className="animate-spin mr-2" /> Sending...</>
              ) : 'Send Reset Instructions'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={onSwitchToLogin}
              className="text-gold hover:text-gold/80 text-sm"
            >
              Back to Login
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm; 