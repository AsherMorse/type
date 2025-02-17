import { Client, Databases } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'error')
  .setProject(process.env.APPWRITE_PROJECT_ID || 'error');

// Log client configuration
console.log('Appwrite client config:', {
  endpoint: process.env.APPWRITE_ENDPOINT || 'error',
  project: process.env.APPWRITE_PROJECT_ID || 'error'
});

// Initialize services
export const databases = new Databases(client);

// Export client for other services
export { client }; 