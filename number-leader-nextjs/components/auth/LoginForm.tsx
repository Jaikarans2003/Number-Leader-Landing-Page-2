'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '../../lib/auth';
import { FaSpinner } from 'react-icons/fa';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginForm = ({ onSwitchToSignUp, onSwitchToForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn(email, password);
      
      if (result.success && result.user) {
        // Redirect to admin dashboard on successful login
        router.push('/admin');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-primary-dark">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
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
        
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            <><FaSpinner className="animate-spin mr-2" /> Logging in...</>
          ) : 'Login'}
        </button>
      </form>
      
      <div className="mt-6 text-center space-y-2">
        <button 
          type="button"
          onClick={onSwitchToForgotPassword}
          className="text-gold hover:text-gold/80 text-sm block w-full"
        >
          Forgot Password?
        </button>
        
        <div className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={onSwitchToSignUp}
            className="text-gold hover:text-gold/80"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 