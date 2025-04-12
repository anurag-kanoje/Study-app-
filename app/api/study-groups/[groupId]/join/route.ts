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

    // Check if group exists and is public
    const group = await prisma.studyGroup.findUnique({
      where: {
        id: params.groupId,
      },
    });

    if (!group) {
      return new NextResponse('Group not found', { status: 404 });
    }

    if (group.is_private) {
      return new NextResponse('Cannot join private group', { status: 403 });
    }

    // Check if user is already a member
    const existingMember = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
      },
    });

    if (existingMember) {
      return new NextResponse('Already a member of this group', { status: 400 });
    }

    // Add user as a member
    const newMember = await prisma.studyGroupMember.create({
      data: {
        group_id: params.groupId,
        user_id: session.user.id,
        role: 'MEMBER',
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

    return NextResponse.json(newMember);
  } catch (error) {
    console.error('[STUDY_GROUP_JOIN]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 