import { Request, Response } from 'express';
import { handleAsync } from '../../utils/handlers';
import { AIService } from './ai.service';
import { sanitizeHtml } from '../../utils/sanitize';

interface AsyncResponse {
  handled?: boolean;
  data?: any;
  status?: number;
}

export const formatContent = async (req: Request, res: Response) => {
  await handleAsync(req, res, async () => {
    const { message, noteContext } = req.body;

    // Input validation
    if (!message || typeof message !== 'string') {
      return {
        status: 400,
        data: { error: 'Message is required and must be a string' }
      };
    }

    if (!noteContext || typeof noteContext !== 'string') {
      return {
        status: 400,
        data: { error: 'Note context is required and must be a string' }
      };
    }

    try {
      // Call AI service
      const formattedContent = await AIService.formatText(noteContext, message);

      // Sanitize the response
      const sanitizedContent = sanitizeHtml(formattedContent);

      return {
        status: 200,
        data: { content: sanitizedContent }
      };
    } catch (error: any) {
      // Handle specific OpenAI errors
      if (error.code === 'rate_limit_exceeded') {
        return {
          status: 429,
          data: { error: 'Rate limit exceeded. Please try again later.' }
        };
      }
      if (error.code === 'invalid_api_key') {
        return {
          status: 401,
          data: { error: 'Authentication failed' }
        };
      }

      // Log the error for monitoring
      console.error('AI formatting error:', error);

      return {
        status: 500,
        data: { error: 'Failed to format content' }
      };
    }
  });
}; 