import OpenAI from 'openai';
import Replicate from 'replicate';
import * as FileSystem from 'expo-file-system';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.EXPO_PUBLIC_REPLICATE_API_KEY,
});

export interface VideoGenerationResult {
  videoUrl: string;
  script: string;
  error?: string;
}

export class VideoGenerator {
  static async generateScript(prompt: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a creative video script writer. Create a concise, engaging script for an educational video based on the given topic. Focus on key points and make it easy to understand."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate video script');
    }
  }

  static async generateVideo(script: string): Promise<string> {
    try {
      // Use Stable Video Diffusion model
      const output = await replicate.run(
        "stability-ai/stable-video-diffusion:3d4c3c5ecf8f0c4d6f5c5c5c5c5c5c5c5c5c5c5c5",
        {
          input: {
            prompt: script,
            num_frames: 24,
            num_inference_steps: 50,
            motion_bucket_id: 127,
            cond_aug: 0.02,
            decoding_t: 7,
            height: 576,
            width: 1024,
          }
        }
      );

      if (!output || typeof output !== 'string') {
        throw new Error('Invalid video generation output');
      }

      // Download the video to local storage
      const videoPath = `${FileSystem.cacheDirectory}generated_video_${Date.now()}.mp4`;
      await FileSystem.downloadAsync(output, videoPath);

      return videoPath;
    } catch (error) {
      console.error('Error generating video:', error);
      throw new Error('Failed to generate video');
    }
  }

  static async generateFromPrompt(prompt: string): Promise<VideoGenerationResult> {
    try {
      // Generate script
      const script = await this.generateScript(prompt);
      
      // Generate video
      const videoPath = await this.generateVideo(script);

      return {
        videoUrl: videoPath,
        script: script
      };
    } catch (error) {
      console.error('Error in video generation process:', error);
      return {
        videoUrl: '',
        script: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
} 