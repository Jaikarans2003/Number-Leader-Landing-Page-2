import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  DocumentData, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  runTransaction 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get the next sequential ID for a collection
 * @param collectionName - The collection to get the next ID for
 * @returns Promise with the next ID number
 */
const getNextId = async (collectionName: string): Promise<number> => {
  const counterDocRef = doc(db, 'counters', collectionName);
  
  try {
    return await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);
      
      // If counter document doesn't exist, create it with initial value of 1
      if (!counterDoc.exists()) {
        transaction.set(counterDocRef, { value: 1 });
        return 1;
      }
      
      // Increment counter
      const newCount = (counterDoc.data()?.value || 0) + 1;
      transaction.update(counterDocRef, { value: newCount });
      return newCount;
    });
  } catch (error) {
    console.error(`Error getting next ID for ${collectionName}:`, error);
    // Fallback to a timestamp-based ID if transaction fails
    return Math.floor(Date.now() / 1000);
  }
};

/**
 * Format ID with leading zeros based on sequence number
 * @param sequence - The sequence number
 * @returns Formatted ID string (e.g., "000001")
 */
const formatId = (sequence: number): string => {
  return sequence.toString().padStart(6, '0');
};

/**
 * Save CTA form data to a specific Firestore collection with sequential ID
 * @param formData - Form data to save
 * @param collectionName - The collection name to save to
 * @returns Promise with the document reference
 */
export const saveToCTACollection = async (
  formData: DocumentData, 
  collectionName: string
): Promise<any> => {
  try {
    // Get the next sequential ID for this collection
    const nextIdNum = await getNextId(collectionName);
    const documentId = formatId(nextIdNum);
    
    // Add timestamp and sequence number to the form data
    const dataToSave = {
      ...formData,
      timestamp: serverTimestamp(),
      sequenceNumber: nextIdNum
    };
    
    // Save to the specified collection with custom document ID
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, dataToSave);
    
    return { success: true, id: documentId };
  } catch (error) {
    console.error(`Error saving to ${collectionName}:`, error);
    
    // Fall back to auto-generated ID if custom ID fails
    try {
      const dataToSave = {
        ...formData,
        timestamp: serverTimestamp(),
        idGenerationFailed: true
      };
      
      const docRef = await addDoc(collection(db, collectionName), dataToSave);
      return { success: true, id: docRef.id, usingFallback: true };
    } catch (fallbackError) {
      console.error(`Fallback save also failed for ${collectionName}:`, fallbackError);
      return { success: false, error };
    }
  }
};

/**
 * Save contact form data from the main landing page
 */
export const saveContactForm = async (formData: DocumentData): Promise<any> => {
  return saveToCTACollection(formData, 'CTA_LandingPage');
};

/**
 * Save newsletter signup from footer
 */
export const saveNewsletterSignup = async (email: string, source = 'footer'): Promise<any> => {
  return saveToCTACollection({ email, source }, 'CTA_Newsletter');
};

/**
 * Save service inquiry from Services page
 */
export const saveServiceInquiry = async (formData: DocumentData): Promise<any> => {
  return saveToCTACollection(formData, 'CTA_ServicesPage');
};

/**
 * Save startup, investor or enabler registration
 */
export const saveRegistration = async (
  formData: DocumentData, 
  userType: 'startup' | 'investor' | 'enabler'
): Promise<any> => {
  // Add user type to the form data
  const dataWithUserType = {
    ...formData,
    userType
  };
  
  return saveToCTACollection(dataWithUserType, 'CTA_Registration');
}; 