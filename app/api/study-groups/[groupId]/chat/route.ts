import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const messageSchema = z.object({
  content: z.string().min(1).max(1000),
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
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Invalid message format', { status: 400 });
    }

    // Create the message
    const message = await prisma.groupMessage.create({
      data: {
        content: result.data.content,
        group_id: params.groupId,
        user_id: session.user.id,
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

    return NextResponse.json(message);
  } catch (error) {
    console.error('[STUDY_GROUP_CHAT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

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

    // Get the latest messages
    const messages = await prisma.groupMessage.findMany({
      where: {
        group_id: params.groupId,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 50,
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

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('[STUDY_GROUP_CHAT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 