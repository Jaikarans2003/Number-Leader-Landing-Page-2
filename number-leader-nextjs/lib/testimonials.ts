import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  setDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { db, storage, auth } from './firebase';

// Collection name for testimonials
const TESTIMONIALS_COLLECTION = 'testimonials';
const TESTIMONIALS_STORAGE_PATH = 'testimonials';

// Default placeholder image
export const PLACEHOLDER_IMAGE = '/assets/images/placeholder-user.svg';

// Interface for testimonial data
export interface Testimonial {
  id?: string;
  name: string;
  position: string;
  quote: string;
  image: string;
  order?: number;
  createdAt?: Date;
}

/**
 * Ensure testimonials collection exists
 */
const ensureTestimonialsCollectionExists = async (): Promise<void> => {
  try {
    // Try to create a temporary document to ensure the collection exists
    const tempDocRef = doc(db, TESTIMONIALS_COLLECTION, 'temp_init_doc');
    
    // Check if the document exists first
    const q = query(collection(db, TESTIMONIALS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    // If collection is empty, create a temporary document
    if (querySnapshot.empty) {
      console.log('Creating testimonials collection with temporary document');
      await setDoc(tempDocRef, {
        _init: true,
        _timestamp: new Date()
      });
      
      // Then delete it immediately
      await deleteDoc(tempDocRef);
    }
  } catch (error) {
    console.error('Error ensuring testimonials collection exists:', error);
    // Continue anyway, as the error might just be that we don't have permission to read
  }
};

/**
 * Ensure testimonials storage folder exists
 */
const ensureTestimonialsStorageFolderExists = async (): Promise<void> => {
  try {
    // In Firebase Storage, folders are created implicitly when files are uploaded
    // We'll create a temporary file to ensure the folder exists
    const storageRef = ref(storage, `${TESTIMONIALS_STORAGE_PATH}/.folder_init`);
    
    // Check if any files exist in the folder
    const listRef = ref(storage, TESTIMONIALS_STORAGE_PATH);
    const result = await listAll(listRef).catch(() => null);
    
    // If folder is empty or doesn't exist, create a temporary file
    if (!result || (result.items.length === 0 && result.prefixes.length === 0)) {
      console.log('Creating testimonials storage folder with temporary file');
      
      // Create a small text file
      const bytes = new Uint8Array([0]);
      await uploadBytesResumable(storageRef, bytes);
      
      // We don't need to delete it - it's tiny and serves as a marker
    }
  } catch (error) {
    console.error('Error ensuring testimonials storage folder exists:', error);
    // Continue anyway, as the folder will be created when we upload a file
  }
};

/**
 * Initialize testimonials system
 */
export const initializeTestimonials = async (): Promise<void> => {
  await ensureTestimonialsCollectionExists();
  await ensureTestimonialsStorageFolderExists();
  console.log('Testimonials system initialized');
};

/**
 * Get all testimonials from Firestore
 */
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    // Initialize the testimonials system first
    await initializeTestimonials();
    
    const q = query(collection(db, TESTIMONIALS_COLLECTION), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure image is never undefined or empty string
      if (!data.image) {
        data.image = PLACEHOLDER_IMAGE;
      }
      
      return {
        id: doc.id,
        ...data,
      } as Testimonial;
    });
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return [];
  }
};

/**
 * Check if user is authenticated
 */
const checkAuthStatus = (): boolean => {
  const currentUser = auth.currentUser;
  console.log('Current auth user:', currentUser ? {
    uid: currentUser.uid,
    email: currentUser.email,
    isAnonymous: currentUser.isAnonymous,
    emailVerified: currentUser.emailVerified
  } : 'No user authenticated');
  return currentUser !== null;
};

/**
 * Upload an image to Firebase Storage
 */
export const uploadTestimonialImage = async (
  file: File, 
  testimonialId: string
): Promise<string> => {
  try {
    // Initialize the testimonials system first
    await initializeTestimonials();
    
    // Check authentication status first
    const isAuthenticated = checkAuthStatus();
    if (!isAuthenticated) {
      throw new Error('Authentication required to upload images. Please log in again.');
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${testimonialId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `${TESTIMONIALS_STORAGE_PATH}/${fileName}`);
    
    console.log('Uploading file to path:', `${TESTIMONIALS_STORAGE_PATH}/${fileName}`);
    
    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Wait for upload to complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress monitoring (can be expanded if needed)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Error handling
          console.error('Error uploading image:', error);
          reject(error);
        },
        async () => {
          // Upload complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File uploaded successfully, download URL:', downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Error in image upload:', error);
    throw error;
  }
};

/**
 * Add a new testimonial
 */
export const addTestimonial = async (
  testimonialData: Omit<Testimonial, 'id'>, 
  imageFile?: File
): Promise<string> => {
  try {
    // Initialize the testimonials system first
    await initializeTestimonials();
    
    // Get the count of existing testimonials for ordering
    const testimonials = await getTestimonials();
    const order = testimonials.length + 1;
    
    // Create testimonial doc first to get an ID
    const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), {
      ...testimonialData,
      // Set default image if none provided
      image: testimonialData.image || PLACEHOLDER_IMAGE,
      order,
      createdAt: new Date(),
    });
    
    // If we have an image file, upload it
    if (imageFile) {
      const imageUrl = await uploadTestimonialImage(imageFile, docRef.id);
      
      // Update the testimonial with the image URL
      await updateDoc(doc(db, TESTIMONIALS_COLLECTION, docRef.id), {
        image: imageUrl
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }
};

/**
 * Update an existing testimonial
 */
export const updateTestimonial = async (
  id: string, 
  testimonialData: Partial<Testimonial>, 
  imageFile?: File
): Promise<void> => {
  try {
    // Initialize the testimonials system first
    await initializeTestimonials();
    
    const testimonialRef = doc(db, TESTIMONIALS_COLLECTION, id);
    const updateData = { ...testimonialData };
    
    // If we have a new image file, upload it
    if (imageFile) {
      const imageUrl = await uploadTestimonialImage(imageFile, id);
      updateData.image = imageUrl;
    }
    
    await updateDoc(testimonialRef, updateData);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

/**
 * Delete a testimonial and its image
 */
export const deleteTestimonial = async (id: string, imageUrl?: string): Promise<void> => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, TESTIMONIALS_COLLECTION, id));
    
    // If we have an image URL, also delete from Storage
    if (imageUrl && !imageUrl.startsWith('/assets/')) {
      try {
        // Extract the path from the URL
        const path = imageUrl.split('testimonials%2F')[1].split('?')[0];
        const imageRef = ref(storage, `${TESTIMONIALS_STORAGE_PATH}/${decodeURIComponent(path)}`);
        await deleteObject(imageRef);
      } catch (imgError) {
        console.error('Error deleting image:', imgError);
        // Continue even if image deletion fails
      }
    }
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
}; 