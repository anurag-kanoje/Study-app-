import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is the owner of the group
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
        role: 'OWNER',
      },
    });

    if (!membership) {
      return new NextResponse('Not authorized to delete group', { status: 403 });
    }

    // Delete the group and all related data
    await prisma.$transaction([
      // Delete all messages
      prisma.groupMessage.deleteMany({
        where: {
          group_id: params.groupId,
        },
      }),
      // Delete all notes
      prisma.note.deleteMany({
        where: {
          group_id: params.groupId,
        },
      }),
      // Delete all sessions
      prisma.session.deleteMany({
        where: {
          group_id: params.groupId,
        },
      }),
      // Delete all members
      prisma.studyGroupMember.deleteMany({
        where: {
          group_id: params.groupId,
        },
      }),
      // Delete the group
      prisma.studyGroup.delete({
        where: {
          id: params.groupId,
        },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDY_GROUP_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 