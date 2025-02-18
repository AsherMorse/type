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
          content: `You are a markdown note assistant. Your task is to format the user's input as plain markdown text.

Rules:
- Return ONLY plain markdown text, no special formatting or structures
- Use standard markdown syntax:
  * For headings use: # Heading
  * For bullet points use: - Item
  * For numbered lists use: 1. Item
- Do not return any structured data like doc(), paragraph(), etc.
- Do not add any metadata or explanations
- Keep the content concise

Example input: "make a list of animals I saw: cats, dogs, pigs"
Example output:
# Animals I Saw
- Cats
- Dogs
- Pigs

Example input: "add section about food"
Example output:
# Food
- Pizza
- Pasta
- Salad

Current note content:
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

    console.log('Raw AI response:', formattedContent);
    console.log('Response type:', typeof formattedContent);
    console.log('Response length:', formattedContent.length);
    console.log('Response char codes:', [...formattedContent].map(c => c.charCodeAt(0)));

    return formattedContent;
  }
} 