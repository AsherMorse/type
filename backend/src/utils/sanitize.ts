/**
 * Simple sanitization for markdown content
 * Removes potentially harmful content while preserving valid markdown
 */
export const sanitizeHtml = (content: string): string => {
  if (typeof content !== 'string') return '';

  return content
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove HTML tags except for basic markdown-compatible ones
    .replace(/<(?!\/?(?:p|br|ul|ol|li|h[1-6]|code|pre|blockquote)\b)[^>]+>/gi, '')
    // Remove potentially harmful attributes
    .replace(/\s+(?:on\w+|style|class|id)="[^"]*"/gi, '')
    // Ensure proper spacing after sanitization
    .trim();
}; 