import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  UserCredential,
  sendEmailVerification,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Sign in a user with email and password
 * @param email - User's email
 * @param password - User's password
 * @returns Promise with the user credentials
 */
export const signIn = async (
  email: string, 
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Login error:', error);
    let errorMessage = 'Failed to log in. Please check your credentials.';
    
    // More descriptive errors
    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Please try again later.';
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Sign up a new user with email and password
 * @param email - User's email
 * @param password - User's password
 * @param displayName - User's display name
 * @returns Promise with the user credentials
 */
export const signUp = async (
  email: string, 
  password: string,
  displayName?: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Set display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Send email verification
    await sendEmailVerification(userCredential.user);
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Sign-up error:', error);
    let errorMessage = 'Failed to create account.';
    
    // More descriptive errors
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already in use.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use a stronger password.';
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Sign out the current user
 * @returns Promise with success status
 */
export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Sign-out error:', error);
    return { success: false, error: 'Failed to sign out.' };
  }
};

// List of authorized admin users with their UIDs
const AUTHORIZED_ADMINS = [
  { email: 'naren@numberleader.com', uid: 'HzINGyuqHkgs7WxWUcwwJLxqfEE3' },
  { email: 'jaikaran.pesce@gmail.com', uid: 'SZ3kcgW9uGbQbkLsn1pTA2ACcD02' },
  { email: 'nitish@numberleader.com', uid: 'cepkQAeCs3dOo1XHy5Q3UCtIbYt1' },
  { email: 'jaikaran@numberleader.com', uid: 'hihrGKi7k2M6dz6rta7QtXiLs9H3' }
];

/**
 * Reset password for a user
 * @param email - User's email
 * @returns Promise with success status
 */
export const resetPassword = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if the email is in the authorized admin list
    const isAuthorizedAdmin = AUTHORIZED_ADMINS.some(admin => admin.email === email);
    
    if (!isAuthorizedAdmin) {
      return { 
        success: false, 
        error: 'Password reset is only available for authorized administrators.' 
      };
    }

    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Password reset error:', error);
    let errorMessage = 'Failed to send password reset email.';
    
    // More descriptive errors
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Get the current authenticated user
 * @returns The current user or null
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Create a new admin user
 * @param email - New user's email
 * @param password - New user's password
 * @param displayName - New user's display name
 * @returns Promise with success status
 */
export const createAdminUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Set display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Create admin user error:', error);
    let errorMessage = 'Failed to create admin user.';
    
    // More descriptive errors
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already in use.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use a stronger password.';
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Check if a user is an admin
 * Note: In a real app, you would check against a database or custom claims
 * @param user - The Firebase user object
 * @returns Boolean indicating if the user is an admin
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  const email = user.email || '';
  
  // Get admin email from environment or use fallback list
  const adminEmail = process.env.ADMIN_EMAIL || 'info@numberleader.com';
  
  // List of admin email domains or specific emails
  const adminEmails = [
    adminEmail,
    'admin@numberleader.com'
  ];
  
  // Check if the user's email is in the admin list
  if (adminEmails.includes(email)) {
    return true;
  }
  
  // Check if the user's email domain is numberleader.com
  if (email.endsWith('@numberleader.com')) {
    return true;
  }
  
  return false;
}; 