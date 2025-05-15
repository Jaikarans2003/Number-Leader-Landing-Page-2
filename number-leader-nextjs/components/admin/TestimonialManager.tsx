'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  getTestimonials, 
  addTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  Testimonial,
  initializeTestimonials
} from '../../lib/testimonials';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaSave, FaTimes, FaImage, FaUser } from 'react-icons/fa';
import Image from 'next/image';
import { auth } from '../../lib/firebase';

// Default placeholder image for testimonials
const PLACEHOLDER_IMAGE = '/assets/images/placeholder-user.svg';

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [systemInitialized, setSystemInitialized] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize testimonials system
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeTestimonials();
        setSystemInitialized(true);
        console.log('Testimonials system initialized successfully');
      } catch (error) {
        console.error('Error initializing testimonials system:', error);
      }
    };
    
    initialize();
  }, []);
  
  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      console.log('Auth state changed:', user ? `User authenticated: ${user.email}` : 'No user authenticated');
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch testimonials on component mount and when system is initialized
  useEffect(() => {
    if (systemInitialized) {
      fetchTestimonials();
    }
  }, [systemInitialized]);
  
  // Fetch testimonials from Firestore
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error: unknown) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentTestimonial(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Open image file dialog
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Add or update a testimonial
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWorking(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Check if system is initialized
      if (!systemInitialized) {
        throw new Error('Testimonials system is not yet initialized. Please try again in a moment.');
      }
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add or edit testimonials. Please refresh the page and log in again.');
      }
      
      if (!currentTestimonial.name || !currentTestimonial.position || !currentTestimonial.quote) {
        throw new Error('Please fill in all fields');
      }
      
      if (!currentTestimonial.id) {
        // Adding new testimonial
        if (!imageFile && !currentTestimonial.image) {
          throw new Error('Please upload an image');
        }
        
        await addTestimonial(currentTestimonial as Omit<Testimonial, 'id'>, imageFile || undefined);
        setSuccess('Testimonial added successfully!');
      } else {
        // Updating existing testimonial
        await updateTestimonial(
          currentTestimonial.id, 
          currentTestimonial, 
          imageFile || undefined
        );
        setSuccess('Testimonial updated successfully!');
      }
      
      // Reset form and refresh testimonials
      resetForm();
      fetchTestimonials();
    } catch (error: unknown) {
      console.error('Error saving testimonial:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setWorking(false);
    }
  };
  
  // Delete a testimonial
  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    setWorking(true);
    setError(null);
    
    try {
      await deleteTestimonial(id, imageUrl);
      setSuccess('Testimonial deleted successfully!');
      fetchTestimonials();
    } catch (error: unknown) {
      console.error('Error deleting testimonial:', error);
      setError('Failed to delete testimonial');
    } finally {
      setWorking(false);
    }
  };
  
  // Edit a testimonial
  const handleEdit = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setImagePreview(testimonial.image);
    setEditMode(true);
  };
  
  // Reset form
  const resetForm = () => {
    setCurrentTestimonial({});
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
  };
  
  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-6">Manage Testimonials</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {!editMode ? (
        <>
          <div className="mb-4">
            <button 
              onClick={() => setEditMode(true)}
              className="bg-gold hover:bg-gold/90 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
              disabled={working}
            >
              <FaPlus className="mr-2" />
              Add New Testimonial
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center my-8">
              <FaSpinner className="animate-spin text-2xl text-gold" />
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-gray-500 italic">No testimonials found. Add one to get started.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    {testimonial.image ? (
                      <Image 
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-400 text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                    <p className="text-sm mt-1 line-clamp-2">{testimonial.quote}</p>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button 
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit testimonial"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(testimonial.id!, testimonial.image)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete testimonial"
                      disabled={working}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">
              {currentTestimonial.id ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <button 
              type="button"
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input 
                type="text"
                name="name"
                value={currentTestimonial.name || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Position</label>
              <input 
                type="text"
                name="position"
                value={currentTestimonial.position || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Testimonial</label>
            <textarea 
              name="quote"
              value={currentTestimonial.quote || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Photo</label>
            <div className="flex items-start gap-4">
              {(imagePreview || currentTestimonial.image) ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold">
                  <Image 
                    src={imagePreview || currentTestimonial.image || PLACEHOLDER_IMAGE}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold flex items-center justify-center bg-gray-200">
                  <FaUser className="text-gray-400 text-3xl" />
                </div>
              )}
              
              <div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleImageUploadClick}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors flex items-center"
                >
                  <FaImage className="mr-2" />
                  {imagePreview || currentTestimonial.image ? 'Change Photo' : 'Upload Photo'}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
              disabled={working}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gold hover:bg-gold/90 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
              disabled={working}
            >
              {working ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Testimonial
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TestimonialManager; 