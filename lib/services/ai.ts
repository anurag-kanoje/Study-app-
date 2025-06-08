import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export class AIService {
  static async generateSummary(text: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful study assistant. Summarize the following text in a concise and clear manner.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        max_tokens: config.openai.maxTokens,
      });

      return response.choices[0].message.content || 'No summary generated';
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary');
    }
  }

  static async generateStudyPlan(topic: string, duration: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful study assistant. Create a detailed study plan for the given topic.',
          },
          {
            role: 'user',
            content: `Create a study plan for ${topic} that can be completed in ${duration}.`,
          },
        ],
        max_tokens: config.openai.maxTokens,
      });

      return response.choices[0].message.content || 'No study plan generated';
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw new Error('Failed to generate study plan');
    }
  }

  static async chat(message: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful study assistant. Provide clear and concise answers to study-related questions.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: config.openai.maxTokens,
      });

      return response.choices[0].message.content || 'No response generated';
    } catch (error) {
      console.error('Error in chat:', error);
      throw new Error('Failed to get chat response');
    }
  }
} 