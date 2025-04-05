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

    // Cannot leave if user is the owner
    if (membership.role === 'OWNER') {
      return new NextResponse('Owner cannot leave the group', { status: 403 });
    }

    // Remove user from the group
    await prisma.studyGroupMember.delete({
      where: {
        id: membership.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDY_GROUP_LEAVE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 