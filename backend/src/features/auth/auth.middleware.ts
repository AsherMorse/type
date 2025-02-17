import { Request, Response, NextFunction } from 'express';
import { Client, Account } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://appwrite.ashermorse.dev/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || 'type');

// Log client configuration
console.log('Appwrite client config:', {
  endpoint: client.config.endpoint,
  project: client.config.project
});

const account = new Account(client);

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const sessionCookie = req.cookies?.['a_session_type'];
  console.log('Session cookie:', sessionCookie);

  if (!sessionCookie) {
    res.status(401).json({ error: 'No session cookie found' });
    return;
  }

  try {
    console.log('Setting session...');
    // Set the session cookie
    client.setSession(sessionCookie);

    console.log('Getting user...');
    // Try to get the user - this will fail if session is invalid
    const user = await account.get();
    console.log('User:', user);

    // Set the user object on the request
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid session' });
    return;
  }
}; 