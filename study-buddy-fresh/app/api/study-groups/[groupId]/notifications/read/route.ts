import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

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
    const { notificationIds } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return new NextResponse('Invalid notification IDs format', { status: 400 });
    }

    // Mark notifications as read
    const result = await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
        user_id: session.user.id,
        group_id: params.groupId,
      },
      data: {
        read_at: new Date(),
      },
    });

    return NextResponse.json({ count: result.count });
  } catch (error) {
    console.error('[STUDY_GROUP_NOTIFICATIONS_READ]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 