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

    // Get unread notification count
    const count = await prisma.notification.count({
      where: {
        user_id: session.user.id,
        group_id: params.groupId,
        read_at: null,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('[STUDY_GROUP_NOTIFICATIONS_UNREAD]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 