import OpenAI from 'openai';
import Replicate from 'replicate';
import * as FileSystem from 'expo-file-system';

export interface VideoGenerationResult {
  videoUrl: string;
  script: string;
  error?: string;
}

function getOpenAI(): OpenAI | null {
  const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

function getReplicate(): Replicate | null {
  const token =
    process.env.EXPO_PUBLIC_REPLICATE_API_TOKEN ?? process.env.EXPO_PUBLIC_REPLICATE_API_KEY;
  if (!token) return null;
  return new Replicate({ auth: token });
}

export class VideoGenerator {
  static async generateScript(prompt: string): Promise<string> {
    const openai = getOpenAI();
    if (!openai) {
      return `Educational overview: ${prompt}\n\nKey points:\n1. Introduction to the topic\n2. Core concepts explained simply\n3. Summary and next steps for study.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a creative video script writer. Create a concise, engaging script for an educational video based on the given topic.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    });

    return completion.choices[0].message.content || '';
  }

  static async generateVideo(_script: string): Promise<string> {
    if (!getReplicate()) {
      throw new Error(
        'Video rendering requires EXPO_PUBLIC_REPLICATE_API_TOKEN. Script generation still works without it.'
      );
    }
    throw new Error(
      'Cloud video rendering is not configured yet. Add your Replicate model in videoGenerator.ts.'
    );
  }

  static async generateFromPrompt(prompt: string): Promise<VideoGenerationResult> {
    try {
      const script = await this.generateScript(prompt);
      try {
        const videoPath = await this.generateVideo(script);
        return { videoUrl: videoPath, script };
      } catch (videoError) {
        return {
          videoUrl: '',
          script,
          error:
            videoError instanceof Error
              ? videoError.message
              : 'Video generation unavailable; script was saved.',
        };
      }
    } catch (error) {
      console.error('Error in video generation process:', error);
      return {
        videoUrl: '',
        script: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
