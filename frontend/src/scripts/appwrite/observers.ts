import { updateUserState, clearAuthState, state } from '../state';
import { menu } from '../menu/elements';

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