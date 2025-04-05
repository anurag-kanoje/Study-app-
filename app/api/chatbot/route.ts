import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
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

    const { message, subject } = await request.json();

    // Get chat history for context
    const { data: history } = await supabase
      .from('chat_history')
      .select('message, response')
      .eq('user_id', user.id)
      .eq('subject', subject)
      .order('created_at', { ascending: false })
      .limit(5);

    // Prepare conversation context
    const conversationHistory = history?.flatMap(h => [
      { role: 'user' as const, content: h.message },
      { role: 'assistant' as const, content: h.response }
    ]) || [];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable tutor helping a student with ${subject}. 
                   Provide clear, concise explanations and encourage critical thinking.
                   If asked about complex topics, break them down into simpler concepts.
                   Use examples when helpful.`
        },
        ...conversationHistory,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I cannot generate a response at this time.';

    // Save to chat history
    const { error: saveError } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        message,
        response,
        subject,
      });

    if (saveError) throw saveError;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
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
    const subject = url.searchParams.get('subject');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (subject) {
      query = query.eq('subject', subject);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat history error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
