import { updateUserState, clearAuthState } from './state';

const AUTH_STATE_EVENT = 'auth-state-change';

export const observers = {
  // Initialize auth state listener
  initAuthObserver: () => {
    // Check auth state on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        const event = new CustomEvent(AUTH_STATE_EVENT);
        window.dispatchEvent(event);
      }
    });

    // Check auth state on focus
    window.addEventListener('focus', () => {
      const event = new CustomEvent(AUTH_STATE_EVENT);
      window.dispatchEvent(event);
    });

    // Listen for auth state changes
    window.addEventListener(AUTH_STATE_EVENT, async () => {
      await updateUserState();
    });

    // Initial auth state check
    updateUserState();
  },

  // Cleanup auth state
  cleanupAuth: () => {
    clearAuthState();
    window.removeEventListener(AUTH_STATE_EVENT, updateUserState);
    document.removeEventListener('visibilitychange', updateUserState);
    window.removeEventListener('focus', updateUserState);
  }
}; 