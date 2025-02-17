import { Request, Response } from 'express';

interface AsyncResponse {
  handled?: boolean;  // If true, response has already been sent
  data?: any;        // Data to send in response
  status?: number;   // Status code to use
}

// Helper function to handle async operations with error handling
export const handleAsync = async (
  req: Request,
  res: Response,
  operation: () => Promise<AsyncResponse>,
  successStatus: number = 200
): Promise<void> => {
  try {
    const result = await operation();

    // If response was handled in operation, don't send another
    if (result.handled) {
      return;
    }

    // Handle null/undefined result as not found
    if (!result.data && result.status !== 204) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Use provided status or default
    const status = result.status || successStatus;

    // Don't send body for 204
    if (status === 204) {
      res.status(204).send();
      return;
    }

    res.status(status).json(result.data);
  } catch (error) {
    res.status(500).json({ error: 'Operation failed' });
  }
}; 