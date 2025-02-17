import { account } from './client';
import { ID } from "appwrite";

export const auth = {
  // Create new account
  register: async (email: string, password: string) => {
    try {
      return await account.create(
        ID.unique(),
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
      const session = await account.createEmailPasswordSession(
        email,
        password
      );
      return session;
    } catch (error) {
      // Provide more user-friendly error messages
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
    } catch {
      return null;
    }
  },

  // Logout
  logout: async () => {
    try {
      await account.deleteSession('current');
      return true;
    } catch {
      return false;
    }
  }
}; 