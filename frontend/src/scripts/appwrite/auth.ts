import { account } from './client';
import { ID } from "appwrite";

export const auth = {
  // Create new account
  register: async (email: string, password: string) => {
    return await account.create(
      ID.unique(),
      email,
      password
    );
  },

  // Login with email/password
  login: async (email: string, password: string) => {
    return await account.createSession(
      email,
      password
    );
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
    return await account.deleteSession('current');
  }
}; 