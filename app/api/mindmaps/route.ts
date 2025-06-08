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

    let where = { user_id: user.id };
    if (groupId) where = { ...where, group_id: groupId };
    if (noteId) where = { ...where, note_id: noteId };

    const mindmaps = await prisma.mindMap.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(mindmaps);
  } catch (error) {
    console.error('Error fetching mindmaps:', error);
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

    const { title, content, groupId, noteId, generateFromNote } = await request.json();

    let mindmapContent = content;

    // If generating from a note, use AI to create the mindmap structure
    if (generateFromNote && noteId) {
      const note = await prisma.note.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        return new NextResponse('Note not found', { status: 404 });
      }

      // Use OpenAI to generate mindmap structure
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a mindmap generator. Create a hierarchical mindmap structure from the given text. Return the structure as a JSON object with nodes and connections."
          },
          {
            role: "user",
            content: note.content
          }
        ],
        response_format: { type: "json_object" }
      });

      mindmapContent = JSON.parse(completion.choices[0].message.content);
    }

    const mindmap = await prisma.mindMap.create({
      data: {
        title,
        content: mindmapContent,
        user_id: user.id,
        group_id: groupId,
        note_id: noteId,
      },
    });

    return NextResponse.json(mindmap);
  } catch (error) {
    console.error('Error creating mindmap:', error);
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

    const { id, title, content } = await request.json();

    const mindmap = await prisma.mindMap.update({
      where: {
        id,
        user_id: user.id,
      },
      data: {
        title,
        content,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(mindmap);
  } catch (error) {
    console.error('Error updating mindmap:', error);
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
      return new NextResponse('Mindmap ID is required', { status: 400 });
    }

    await prisma.mindMap.delete({
      where: {
        id,
        user_id: user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting mindmap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 