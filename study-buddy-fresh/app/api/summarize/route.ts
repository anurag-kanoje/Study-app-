import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content, type, title } = await request.json();

    if (!content || !type) {
      return NextResponse.json({ error: "Content and type are required" }, { status: 400 });
    }

    let summary = '';
    let keyPoints = [];

    if (type === 'text' || type === 'document') {
      // Use OpenAI for text summarization
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates concise summaries and extracts key points from text."
          },
          {
            role: "user",
            content: `Please provide a summary and key points for the following text:\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      summary = completion.choices[0]?.message?.content || '';
      
      // Extract key points using a separate API call
      const keyPointsCompletion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Extract the main points from the text as a JSON array of strings."
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      try {
        const keyPointsResponse = JSON.parse(keyPointsCompletion.choices[0]?.message?.content || '{}');
        keyPoints = keyPointsResponse.points || [];
      } catch (e) {
        console.error('Error parsing key points:', e);
        keyPoints = [];
      }
    } else if (type === 'video') {
      // For video, first transcribe then summarize
      // Download video and create a File object for OpenAI
      const videoResponse = await fetch(content);
      const videoBlob = await videoResponse.blob();
      const videoFile = new File([videoBlob], 'video.mp4', { type: 'video/mp4' });

      const transcription = await openai.audio.transcriptions.create({
        file: videoFile,
        model: "whisper-1",
      });

      // Summarize transcription
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Create a concise summary and extract key points from this video transcription."
          },
          {
            role: "user",
            content: transcription.text
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      summary = completion.choices[0]?.message?.content || '';
      
      // Extract key points from video
      const keyPointsCompletion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Extract the main points from the video transcription as a JSON array of strings."
          },
          {
            role: "user",
            content: transcription.text
          }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      try {
        const keyPointsResponse = JSON.parse(keyPointsCompletion.choices[0]?.message?.content || '{}');
        keyPoints = keyPointsResponse.points || [];
      } catch (e) {
        console.error('Error parsing key points:', e);
        keyPoints = [];
      }
    }

    // Save summary to database
    const { error: saveError } = await supabase
      .from('document_summaries')
      .insert({
        user_id: user.id,
        title: title || 'Untitled',
        content,
        summary,
        key_points: keyPoints,
        document_type: type,
      });

    if (saveError) throw saveError;

    return NextResponse.json({ summary, keyPoints });
  } catch (error) {
    console.error("Error in summarize API:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to process content" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let query = supabase
      .from('document_summaries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq('document_type', type);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Summary history error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

