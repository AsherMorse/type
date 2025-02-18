import { Request, Response, NextFunction } from 'express';
import { Account } from 'appwrite';
import { client } from '../../utils/client';

// Initialize account service
const account = new Account(client);

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Debug all cookies
  console.log('All cookies:', req.cookies);

  // Try different possible cookie names
  const sessionCookie =
    req.cookies?.['a_session_type'] ||
    req.cookies?.['a_session'] ||
    req.cookies?.['appwrite_session'] ||
    req.cookies?.['session'];

  console.log('Session cookie:', sessionCookie);

  if (!sessionCookie) {
    res.status(401).json({ error: 'No session cookie found' });
    return;
  }

  try {
    console.log('Setting session...');
    client.setSession(sessionCookie);
    console.log('Getting user...');
    const user = await account.get();
    console.log('User:', user);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid session' });
    return;
  }
}; 