import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const noteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(10000),
});

export async function POST(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is a member of the group
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
      },
    });

    if (!membership) {
      return new NextResponse('Not a member of this group', { status: 403 });
    }

    const body = await request.json();
    const result = noteSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Invalid note format', { status: 400 });
    }

    // Create the note
    const note = await prisma.note.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        group_id: params.groupId,
        user_id: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
          },
        },
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('[STUDY_GROUP_NOTES]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is a member of the group
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
      },
    });

    if (!membership) {
      return new NextResponse('Not a member of this group', { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const userId = searchParams.get('userId');

    // Build where clause
    const where = {
      group_id: params.groupId,
      ...(userId ? { user_id: userId } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    };

    // Get notes with pagination
    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              avatar_url: true,
            },
          },
        },
      }),
      prisma.note.count({ where }),
    ]);

    return NextResponse.json({
      notes,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[STUDY_GROUP_NOTES]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; noteId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is an admin or owner of the group
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
        role: {
          in: ['OWNER', 'ADMIN'],
        },
      },
    });

    if (!membership) {
      return new NextResponse('Not authorized to delete notes', { status: 403 });
    }

    // Delete note and associated tags
    await prisma.note.delete({
      where: {
        id: params.noteId,
        group_id: params.groupId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDY_GROUP_NOTES_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 