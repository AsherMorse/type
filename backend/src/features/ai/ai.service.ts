import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'error'
});

export class AIService {
  static async formatText(noteContext: string, userInput: string): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a note formatting assistant. Format the user's input to match the style of their existing note content. Follow these guidelines:

          - Match the formatting style and patterns used in the existing note
          - Keep the content concise and clear
          - Use consistent markdown formatting
          - Do not add any extra content or explanations
          
          Existing note content for style reference:
          ${noteContext}`
        },
        { role: 'user', content: userInput }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const formattedContent = completion.choices[0]?.message?.content;
    if (!formattedContent) {
      throw new Error('No content received from OpenAI');
    }

    return formattedContent;
  }
} 