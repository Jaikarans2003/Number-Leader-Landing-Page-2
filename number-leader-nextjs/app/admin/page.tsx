'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { signIn, signOut, getCurrentUser, resetPassword } from '../../lib/auth';
import Link from 'next/link';
import { FaDownload, FaLock, FaSpinner, FaQuoteLeft, FaSignOutAlt, FaUsersCog, FaHome } from 'react-icons/fa';
import TestimonialManager from '../../components/admin/TestimonialManager';
import UserManager from '../../components/admin/UserManager';
import { useRouter } from 'next/navigation';

// Admin Navbar Component
const AdminNavbar = ({ onLogout, isLoadingLogout }: { onLogout: () => void, isLoadingLogout: boolean }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-primary-dark shadow-lg py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl md:text-3xl company-name px-2 py-1 rounded">
              Number<span className="text-blue-400">Leader</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-gold transition-colors flex items-center">
              <FaHome className="mr-2" /> Home
            </Link>
            <button 
              onClick={onLogout}
              className="flex items-center text-white hover:text-red-400 transition-colors"
              disabled={isLoadingLogout}
            >
              {isLoadingLogout ? (
                <><FaSpinner className="animate-spin mr-2" /> Logging out...</>
              ) : (
                <><FaSignOutAlt className="mr-2" /> Logout</>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface FirestoreDocument {
  id: string;
  [key: string]: unknown;
}

// Define the Firestore timestamp interface
interface FirestoreTimestamp {
  toDate: () => Date;
}

// Function to convert Firestore data to CSV
const convertToCSV = (data: FirestoreDocument[]) => {
  if (data.length === 0) return '';
  
  // Extract headers from the first item
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = headers.join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return headers.map(header => {
      let cell = item[header];
      
      // Handle nested objects and arrays
      if (typeof cell === 'object' && cell !== null) {
        if (cell instanceof Date) {
          // Format date objects
          cell = cell.toISOString();
        } else {
          // Stringify other objects but escape quotes
          cell = JSON.stringify(cell).replace(/"/g, '""');
        }
      }
      
      // Handle strings with commas by wrapping in quotes
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      
      // Return empty string for undefined or null
      return cell ?? '';
    }).join(',');
  });
  
  // Combine header and rows
  return [headerRow, ...rows].join('\n');
};

// Download CSV file helper
const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('downloads');
  const [collections] = useState<string[]>([
    'CTA_LandingPage',
    'CTA_ServicesPage',
    'CTA_Newsletter',
    'CTA_Registration'
  ]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [resetEmail, setResetEmail] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const router = useRouter();
  
  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
        }
      } catch (error: unknown) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Firebase authentication handler
  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(prev => ({ ...prev, login: true }));
      setError('');
      
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, login: false }));
    }
  };
  
  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, resetPassword: true }));
    setError('');
    setSuccessMessage('');
    
    try {
      if (!resetEmail.trim()) {
        setError('Please enter your email address');
        return;
      }
      
      const result = await resetPassword(resetEmail);
      
      if (result.success) {
      setSuccessMessage('Password reset email sent successfully.');
      setResetEmail('');
      setTimeout(() => setIsResetMode(false), 3000);
      } else {
        setError(result.error || 'Failed to send password reset email.');
      }
    } catch (error: unknown) {
      console.error('Error sending password reset email:', error);
      setError('Failed to send password reset email.');
    } finally {
      setLoading(prev => ({ ...prev, resetPassword: false }));
    }
  };
  
  // Logout handler
  const handleLogout = async () => {
    setLoading(prev => ({ ...prev, logout: true }));
    
    try {
      await signOut();
    setIsAuthenticated(false);
      router.push('/');
    } catch (error: unknown) {
      console.error('Logout error:', error);
    } finally {
      setLoading(prev => ({ ...prev, logout: false }));
    }
  };
  
  // Function to fetch and download collection data
  const fetchAndDownloadCollection = async (collectionName: string) => {
    setLoading(prev => ({ ...prev, [collectionName]: true }));
    
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data: FirestoreDocument[] = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        
        // Create processed object with proper typing
        const processed: FirestoreDocument = { 
          id: doc.id,
          ...docData 
        };
        
        // Process any timestamp fields
        Object.keys(processed).forEach(key => {
          const value = processed[key];
          // Check if value is a Firestore Timestamp
          if (value && typeof value === 'object' && 'toDate' in value) {
            const timestamp = value as FirestoreTimestamp;
            processed[key] = timestamp.toDate().toISOString();
          }
        });
        
        return processed;
      });
      
      if (data.length === 0) {
        alert(`No data found in ${collectionName} collection`);
        return;
      }
      
      const csv = convertToCSV(data);
      const date = new Date().toISOString().split('T')[0];
      downloadCSV(csv, `${collectionName}_${date}.csv`);
    } catch (error: unknown) {
      console.error(`Error fetching ${collectionName}:`, error);
      alert(`Error downloading ${collectionName}. See console for details.`);
    } finally {
      setLoading(prev => ({ ...prev, [collectionName]: false }));
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-gold mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
      </div>
    );
  }
  
  return (
    <>
      {isAuthenticated && (
        <AdminNavbar onLogout={handleLogout} isLoadingLogout={loading.logout || false} />
      )}
      
      <div className={`min-h-screen ${isAuthenticated ? 'pt-24' : 'py-16'}`}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-dark text-center">
            Admin Dashboard
          </h1>
          
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-center mb-6">
                <div className="bg-primary-dark p-4 rounded-full">
                  <FaLock className="text-white text-2xl" />
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-6 text-center">Admin Access</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  {successMessage}
                </div>
              )}
              
              {isResetMode ? (
                <form onSubmit={handlePasswordReset}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                      placeholder="Enter your admin email"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button 
                      type="submit"
                      className="w-full bg-gold hover:bg-gold/90 text-white font-medium py-2 px-4 rounded-md transition-colors flex justify-center items-center"
                      disabled={loading.resetPassword}
                    >
                      {loading.resetPassword ? (
                        <><FaSpinner className="animate-spin mr-2" /> Sending...</>
                      ) : 'Send Reset Link'}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setIsResetMode(false)}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAuthentication}>
                  <div className="mb-4">
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
                  
                  <div className="mb-4">
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
                    className="w-full bg-gold hover:bg-gold/90 text-white font-medium py-2 px-4 rounded-md transition-colors mb-4 flex justify-center items-center"
                    disabled={loading.login}
                  >
                    {loading.login ? (
                      <><FaSpinner className="animate-spin mr-2" /> Logging in...</>
                    ) : 'Login'}
                  </button>
                  
                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={() => setIsResetMode(true)}
                      className="text-gold hover:text-gold/80 underline transition-colors text-sm"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="border-b mb-8">
                <nav className="flex space-x-8">
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === 'downloads' 
                        ? 'border-gold text-gold' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('downloads')}
                  >
                    <FaDownload className="mr-2" />
                    Data Download
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === 'testimonials' 
                        ? 'border-gold text-gold' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('testimonials')}
                  >
                    <FaQuoteLeft className="mr-2" />
                    Testimonials
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === 'users' 
                        ? 'border-gold text-gold' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('users')}
                  >
                    <FaUsersCog className="mr-2" />
                    Users
                  </button>
                </nav>
              </div>
              
              {activeTab === 'downloads' && (
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-6">Download Collection Data</h2>
                  
                  <div className="space-y-4">
                    {collections.map(collectionName => (
                      <div 
                        key={collectionName}
                        className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{collectionName}</h3>
                          <p className="text-sm text-gray-500">
                            Export data as CSV file
                          </p>
                        </div>
                        <button
                          onClick={() => fetchAndDownloadCollection(collectionName)}
                          className="bg-gold hover:bg-gold/90 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                          disabled={loading[collectionName]}
                        >
                          {loading[collectionName] ? (
                            <><FaSpinner className="animate-spin mr-2" /> Downloading...</>
                          ) : (
                            <><FaDownload className="mr-2" /> Download</>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'testimonials' && (
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <TestimonialManager />
                </div>
              )}
              
              {activeTab === 'users' && (
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <UserManager />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPage; 