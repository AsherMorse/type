import type { Models } from 'appwrite';
import { state } from '@scripts/state';
import { auth } from './auth';
import { storage } from './storage';

export const setAuthState = (user: Models.User<Models.Preferences>, token?: string) => {
  state.currentUser = user;
  state.isAuthenticated = true;
  if (token) {
    storage.saveAuthToken(token);
  }
};

export const clearAuthState = () => {
  state.currentUser = null;
  state.isAuthenticated = false;
  storage.removeAuthToken();
  storage.removeTempData();
};

export const updateUserState = async () => {
  try {
    const user = await auth.getCurrentUser();
    if (user) {
      setAuthState(user);
      return true;
    }
    clearAuthState();
    return false;
  } catch {
    clearAuthState();
    return false;
  }
}; 