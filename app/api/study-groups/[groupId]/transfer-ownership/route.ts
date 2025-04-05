import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const transferSchema = z.object({
  newOwnerId: z.string().uuid(),
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

    // Check if user is the owner of the group
    const currentOwner = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
        role: 'OWNER',
      },
    });

    if (!currentOwner) {
      return new NextResponse('Not authorized to transfer ownership', { status: 403 });
    }

    const body = await request.json();
    const result = transferSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Invalid new owner ID format', { status: 400 });
    }

    // Check if new owner exists and is a member of the group
    const newOwner = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: result.data.newOwnerId,
      },
    });

    if (!newOwner) {
      return new NextResponse('New owner must be a member of the group', { status: 400 });
    }

    // Transfer ownership using a transaction
    await prisma.$transaction([
      // Update current owner to admin
      prisma.studyGroupMember.update({
        where: {
          id: currentOwner.id,
        },
        data: {
          role: 'ADMIN',
        },
      }),
      // Update new owner
      prisma.studyGroupMember.update({
        where: {
          id: newOwner.id,
        },
        data: {
          role: 'OWNER',
        },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDY_GROUP_TRANSFER_OWNERSHIP]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 