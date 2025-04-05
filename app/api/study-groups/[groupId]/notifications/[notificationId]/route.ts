import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; notificationId: string } }
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

    // Check if notification exists and belongs to the user
    const notification = await prisma.notification.findFirst({
      where: {
        id: params.notificationId,
        user_id: session.user.id,
        group_id: params.groupId,
      },
    });

    if (!notification) {
      return new NextResponse('Notification not found', { status: 404 });
    }

    // Delete the notification
    await prisma.notification.delete({
      where: {
        id: params.notificationId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDY_GROUP_NOTIFICATION_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 