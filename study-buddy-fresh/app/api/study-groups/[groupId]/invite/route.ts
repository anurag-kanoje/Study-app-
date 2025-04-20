import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const inviteSchema = z.object({
  email: z.string().email(),
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

    // Check if user is an admin or owner of the group
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
      },
    });

    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      return new NextResponse('Not authorized to invite members', { status: 403 });
    }

    const body = await request.json();
    const result = inviteSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Invalid email format', { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email: result.data.email,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: user.id,
      },
    });

    if (existingMember) {
      return new NextResponse('User is already a member', { status: 400 });
    }

    // Add user as a member
    const newMember = await prisma.studyGroupMember.create({
      data: {
        group_id: params.groupId,
        user_id: user.id,
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
    console.error('[STUDY_GROUP_INVITE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 