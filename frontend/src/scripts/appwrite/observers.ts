import { updateUserState, clearAuthState, state } from '../state';
import { menu } from '../menu/elements';

const AUTH_STATE_EVENT = 'auth-state-change';
let isCheckingAuth = false;
let lastAuthCheck = 0;
const AUTH_CHECK_INTERVAL = 30000; // Only check auth every 30 seconds max

export const observers = {
  // Initialize auth state listener
  initAuthObserver: () => {
    const checkAuth = () => {
      const now = Date.now();
      if (isCheckingAuth || now - lastAuthCheck < AUTH_CHECK_INTERVAL) return;

      const event = new CustomEvent(AUTH_STATE_EVENT);
      window.dispatchEvent(event);
      lastAuthCheck = now;
    };

    // Check auth state on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        checkAuth();
      }
    });

    // Check auth state on focus
    window.addEventListener('focus', checkAuth);

    // Listen for auth state changes
    window.addEventListener(AUTH_STATE_EVENT, async () => {
      if (isCheckingAuth) return;
      isCheckingAuth = true;

      try {
        await updateUserState();
        // Update menu auth buttons visibility
        const authSection = document.querySelectorAll(".auth-section");
        authSection.forEach((section) => {
          const button = section.querySelector("button");
          if (button) {
            if (button.classList.contains("logout")) {
              (section as HTMLElement).hidden = !state.isAuthenticated;
            } else {
              (section as HTMLElement).hidden = state.isAuthenticated;
            }
          }
        });
        // Update logged-in-only elements visibility
        const loggedInOnly = document.querySelectorAll(".logged-in-only");
        loggedInOnly.forEach((element) => {
          (element as HTMLElement).hidden = !state.isAuthenticated;
        });
      } catch (error) {
        console.debug('Auth check failed:', error);
        clearAuthState();
      } finally {
        isCheckingAuth = false;
      }
    });

    // Initial auth state check
    checkAuth();
  },

  // Cleanup auth state
  cleanupAuth: () => {
    clearAuthState();
    window.removeEventListener(AUTH_STATE_EVENT, updateUserState);
    document.removeEventListener('visibilitychange', updateUserState);
    window.removeEventListener('focus', updateUserState);
  }
}; 