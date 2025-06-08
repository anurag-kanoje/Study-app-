import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const noteId = searchParams.get('noteId');
    const type = searchParams.get('type');

    let where: any = { user_id: user.id };
    if (groupId) where.group_id = groupId;
    if (noteId) where.note_id = noteId;
    if (type) where.type = type;

    const charts = await prisma.chart.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(charts);
  } catch (error) {
    console.error('Error fetching charts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, type, content, groupId, noteId, generateFromNote } = await request.json();

    let chartContent = content;

    // If generating from a note, use AI to create the chart structure
    if (generateFromNote && noteId) {
      const note = await prisma.note.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        return new NextResponse('Note not found', { status: 404 });
      }

      // Use OpenAI to generate chart structure based on type
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a chart generator. Create a ${type} chart structure from the given text. 
                     For bar/line charts, extract numerical data and categories.
                     For pie charts, extract proportions and categories.
                     For flowcharts, extract processes and their relationships.
                     Return the structure as a JSON object with appropriate data format.`
          },
          {
            role: "user",
            content: note.content
          }
        ],
        response_format: { type: "json_object" }
      });

      chartContent = JSON.parse(completion.choices[0].message.content);
    }

    const chart = await prisma.chart.create({
      data: {
        title,
        type,
        content: chartContent,
        user_id: user.id,
        group_id: groupId,
        note_id: noteId,
      },
    });

    return NextResponse.json(chart);
  } catch (error) {
    console.error('Error creating chart:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id, title, type, content } = await request.json();

    const chart = await prisma.chart.update({
      where: {
        id,
        user_id: user.id,
      },
      data: {
        title,
        type,
        content,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(chart);
  } catch (error) {
    console.error('Error updating chart:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Chart ID is required', { status: 400 });
    }

    await prisma.chart.delete({
      where: {
        id,
        user_id: user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting chart:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 