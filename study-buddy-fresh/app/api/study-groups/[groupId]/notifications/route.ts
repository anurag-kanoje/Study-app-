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

    // Get notifications
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: {
          user_id: session.user.id,
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
      prisma.notification.count({
        where: {
          user_id: session.user.id,
          group_id: params.groupId,
        },
      }),
    ]);

    return NextResponse.json({
      notifications,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[STUDY_GROUP_NOTIFICATIONS]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

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

    // Check if user is an admin or owner of the group
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
      },
    });

    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      return new NextResponse('Not authorized to send notifications', { status: 403 });
    }

    const body = await request.json();
    const { title, message, userIds } = body;

    if (!title || !message || !userIds || !Array.isArray(userIds)) {
      return new NextResponse('Invalid notification format', { status: 400 });
    }

    // Create notifications for each user
    const notifications = await prisma.notification.createMany({
      data: userIds.map(userId => ({
        user_id: userId,
        group_id: params.groupId,
        title,
        message,
      })),
    });

    return NextResponse.json({ count: notifications.count });
  } catch (error) {
    console.error('[STUDY_GROUP_NOTIFICATIONS]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 