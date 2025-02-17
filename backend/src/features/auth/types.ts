import { Request } from 'express';
import { Models } from 'appwrite';

declare global {
  namespace Express {
    interface Request {
      user?: Models.User<Models.Preferences>;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: Models.User<Models.Preferences> & {
    $id: string;
  };
} 