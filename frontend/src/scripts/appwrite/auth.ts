import { account } from './client';
import { ID } from "appwrite";

export const auth = {
  // Create new account
  register: async (email: string, password: string) => {
    try {
      // Create the account
      const user = await account.create(
        ID.unique(),
        email,
        password
      );

      // Immediately create a session
      const session = await account.createEmailPasswordSession(email, password);

      return { user, session };
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
      const session = await account.createEmailPasswordSession(
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