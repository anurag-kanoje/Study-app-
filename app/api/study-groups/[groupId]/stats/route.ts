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

    // Get group statistics
    const [
      memberCount,
      noteCount,
      sessionCount,
      messageCount,
      recentActivity,
    ] = await Promise.all([
      // Count members
      prisma.studyGroupMember.count({
        where: {
          group_id: params.groupId,
        },
      }),
      // Count notes
      prisma.note.count({
        where: {
          group_id: params.groupId,
        },
      }),
      // Count sessions
      prisma.session.count({
        where: {
          group_id: params.groupId,
        },
      }),
      // Count messages
      prisma.groupMessage.count({
        where: {
          group_id: params.groupId,
        },
      }),
      // Get recent activity
      prisma.$transaction([
        // Recent notes
        prisma.note.findMany({
          where: {
            group_id: params.groupId,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 5,
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
        // Recent sessions
        prisma.session.findMany({
          where: {
            group_id: params.groupId,
          },
          orderBy: {
            start_time: 'desc',
          },
          take: 5,
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
        // Recent messages
        prisma.groupMessage.findMany({
          where: {
            group_id: params.groupId,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 5,
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
      ]),
    ]);

    const [recentNotes, recentSessions, recentMessages] = recentActivity;

    return NextResponse.json({
      memberCount,
      noteCount,
      sessionCount,
      messageCount,
      recentActivity: {
        notes: recentNotes,
        sessions: recentSessions,
        messages: recentMessages,
      },
    });
  } catch (error) {
    console.error('[STUDY_GROUP_STATS]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 