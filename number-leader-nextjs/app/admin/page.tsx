'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Layout from '../../components/layout/Layout';
import { FaDownload, FaLock, FaSpinner } from 'react-icons/fa';

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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [collections] = useState<string[]>([
    'CTA_LandingPage',
    'CTA_ServicesPage',
    'CTA_Newsletter',
    'CTA_Registration'
  ]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  
  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedAuth = sessionStorage.getItem('nlAdminAuth');
        if (storedAuth === 'true') {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Session storage error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Simple authentication handler
  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    // Very simple authentication - in a real app use proper auth
    if (password === 'NumberLeader2025') {
      setIsAuthenticated(true);
      setError('');
      
      // Store in session storage to persist during the session
      try {
        sessionStorage.setItem('nlAdminAuth', 'true');
      } catch (error) {
        console.error('Session storage error:', error);
      }
    } else {
      setError('Invalid password');
    }
  };
  
  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    
    // Clear from session storage
    try {
      sessionStorage.removeItem('nlAdminAuth');
    } catch (error) {
      console.error('Session storage error:', error);
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
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      alert(`Error downloading ${collectionName}. See console for details.`);
    } finally {
      setLoading(prev => ({ ...prev, [collectionName]: false }));
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-gold mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <section className="py-16 min-h-screen">
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
              
              <form onSubmit={handleAuthentication}>
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
                  className="w-full bg-gold hover:bg-gold/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Login
                </button>
              </form>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Download Collection Data</h2>
                <p className="mb-6 text-gray-600">
                  Select a collection to download its data as a CSV file. The data will include all documents in the collection.
                </p>
                
                <div className="space-y-4">
                  {collections.map((collectionName) => (
                    <div 
                      key={collectionName}
                      className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">{collectionName}</h3>
                          <p className="text-sm text-gray-600">
                            Download all documents as CSV
                          </p>
                        </div>
                        
                        <button
                          onClick={() => fetchAndDownloadCollection(collectionName)}
                          disabled={loading[collectionName]}
                          className="flex items-center bg-primary-dark hover:bg-primary-dark/90 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                        >
                          {loading[collectionName] ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <FaDownload className="mr-2" />
                              Download CSV
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminPage; 