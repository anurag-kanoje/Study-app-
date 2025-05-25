import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const settingsSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  is_private: z.boolean(),
});

export async function PATCH(
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
      return new NextResponse('Not authorized to update settings', { status: 403 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return new NextResponse('Invalid settings format', { status: 400 });
    }

    // Update group settings
    const updatedGroup = await prisma.studyGroup.update({
      where: {
        id: params.groupId,
      },
      data: {
        settings,
      },
      select: {
        id: true,
        name: true,
        description: true,
        is_private: true,
        created_at: true,
        updated_at: true,
        settings: true,
      },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error('[STUDY_GROUP_SETTINGS]', error);
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

    // Get group settings
    const group = await prisma.studyGroup.findUnique({
      where: {
        id: params.groupId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        is_private: true,
        created_at: true,
        updated_at: true,
        settings: true,
      },
    });

    if (!group) {
      return new NextResponse('Group not found', { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error('[STUDY_GROUP_SETTINGS]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 