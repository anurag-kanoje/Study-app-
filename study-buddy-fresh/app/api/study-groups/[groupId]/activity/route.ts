import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

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

    // Get all activities
    const [
      notes,
      sessions,
      messages,
      memberChanges,
    ] = await Promise.all([
      // Get notes
      prisma.note.findMany({
        where: {
          group_id: params.groupId,
        },
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
      // Get sessions
      prisma.session.findMany({
        where: {
          group_id: params.groupId,
        },
        orderBy: {
          start_time: 'desc',
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
      // Get messages
      prisma.groupMessage.findMany({
        where: {
          group_id: params.groupId,
        },
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
      // Get member changes
      prisma.studyGroupMember.findMany({
        where: {
          group_id: params.groupId,
        },
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
    ]);

    // Combine and sort all activities by date
    const activities = [
      ...notes.map(note => ({
        type: 'NOTE',
        data: note,
        timestamp: note.created_at,
      })),
      ...sessions.map(session => ({
        type: 'SESSION',
        data: session,
        timestamp: session.start_time,
      })),
      ...messages.map(message => ({
        type: 'MESSAGE',
        data: message,
        timestamp: message.created_at,
      })),
      ...memberChanges.map(member => ({
        type: 'MEMBER',
        data: member,
        timestamp: member.created_at,
      })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return NextResponse.json({
      activities,
      page,
      limit,
    });
  } catch (error) {
    console.error('[STUDY_GROUP_ACTIVITY]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 