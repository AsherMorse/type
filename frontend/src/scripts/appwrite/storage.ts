const AUTH_TOKEN_KEY = 'auth_token';
const TEMP_DATA_KEY = 'auth_temp';

export const storage = {
  // Local Storage for persistent auth token
  saveAuthToken: (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  getAuthToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  removeAuthToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // Session Storage for temporary data
  saveTempData: (data: any) => {
    sessionStorage.setItem(TEMP_DATA_KEY, JSON.stringify(data));
  },

  getTempData: () => {
    const data = sessionStorage.getItem(TEMP_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  removeTempData: () => {
    sessionStorage.removeItem(TEMP_DATA_KEY);
  }
}; 