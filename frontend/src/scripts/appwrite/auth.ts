import { account } from './client';
import { ID } from "appwrite";

export const auth = {
  // Create new account
  register: async (email: string, password: string) => {
    try {
      // Create a valid user ID from email (before @)
      const userId = 'user_' + email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

      return await account.create(
        userId,
        email,
        password
      );
    } catch (error) {
      if (error.code === 409) {
        throw new Error('An account with this email already exists');
      }
      throw error;
    }
  },

  // Login with email/password
  login: async (email: string, password: string) => {
    try {
      // First, try to delete any existing session
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore errors here - session might not exist
        console.debug('No existing session to delete');
      }

      // Now create a new session
      const session = await account.createSession(
        email,
        password
      );
      return session;
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 401) {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  },

  // Get current session
  getCurrentUser: async () => {
    try {
      return await account.get();
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  // Logout
  logout: async () => {
    try {
      await account.deleteSession('current');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }
}; 