'use client';

import { useState, useEffect } from 'react';
import { createAdminUser } from '../../lib/auth';
import { FaSpinner, FaUserPlus, FaUser, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

const UserManager = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loadingUsers] = useState(false);

  useEffect(() => {
    // We don't have direct access to list all users in Firebase Auth from client-side
    // In a real app, this would be handled via a secure admin API
    // For demo purposes, we're just showing a placeholder
    
    const placeholderAdmins: AdminUser[] = [
      {
        uid: "1",
        email: "info@numberleader.com",
        displayName: "Primary Admin",
        emailVerified: true
      }
    ];
    
    setAdminUsers(placeholderAdmins);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    // Reset errors
    setError('');
    
    // Check if fields are empty
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return false;
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Ensure email is a numberleader.com domain
    if (!formData.email.endsWith('@numberleader.com')) {
      setError('Admin email must use the numberleader.com domain');
      return false;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Check password strength (minimum 8 characters)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const result = await createAdminUser(
        formData.email,
        formData.password,
        formData.name
      );
      
      if (result.success) {
        setSuccess(true);
        
        // Add the new admin to the list
        const newAdmin: AdminUser = {
          uid: Date.now().toString(), // placeholder ID
          email: formData.email,
          displayName: formData.name,
          emailVerified: false
        };
        
        setAdminUsers(prev => [...prev, newAdmin]);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError(result.error || 'Failed to create admin user. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Create admin user error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Admin User Management</h2>
      <p className="mb-6 text-gray-600">
        Create new admin users who will have access to the admin dashboard.
        All admin emails must use the <strong>@numberleader.com</strong> domain.
      </p>
      
      {/* Existing Admins */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4">Existing Admins</h3>
        
        {loadingUsers ? (
          <div className="text-center py-4">
            <FaSpinner className="animate-spin text-2xl text-gold mx-auto" />
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div>
        ) : adminUsers.length > 0 ? (
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminUsers.map((admin) => (
                  <tr key={admin.uid}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{admin.displayName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaEnvelope className="mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{admin.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.emailVerified ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <FaCheckCircle className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending Verification
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No admin users found.</p>
        )}
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          Admin user created successfully!
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4 flex items-center">
          <FaUserPlus className="mr-2" /> Create New Admin
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Full Name
              </label>
              <input 
                type="text" 
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                  placeholder="admin@numberleader.com"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must use the numberleader.com domain
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input 
                type="password" 
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters long
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <input 
                type="password" 
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              type="submit"
              className="bg-gold hover:bg-gold/90 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <><FaSpinner className="animate-spin mr-2" /> Creating user...</>
              ) : (
                <><FaUserPlus className="mr-2" /> Create Admin User</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManager; 