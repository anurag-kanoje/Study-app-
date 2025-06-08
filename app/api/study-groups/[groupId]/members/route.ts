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

    // Get all members
    const members = await prisma.studyGroupMember.findMany({
      where: {
        group_id: params.groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('[STUDY_GROUP_MEMBERS]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

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

    // Check if user is admin or owner
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
        role: { in: ['OWNER', 'ADMIN'] },
      },
    });

    if (!membership) {
      return new NextResponse('Not authorized to add members', { status: 403 });
    }

    const { email } = await request.json();

    // Get user data from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, full_name, avatar_url, email')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: userData.id,
      },
    });

    if (existingMember) {
      return new NextResponse('User is already a member', { status: 400 });
    }

    // Add user to group
    const newMember = await prisma.studyGroupMember.create({
      data: {
        user_id: userData.id,
        group_id: params.groupId,
        role: 'MEMBER',
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newMember);
  } catch (error) {
    console.error('[STUDY_GROUP_MEMBERS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

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

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return new NextResponse('Member ID is required', { status: 400 });
    }

    // Check if user is admin or owner
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
        role: { in: ['OWNER', 'ADMIN'] },
      },
    });

    if (!membership) {
      return new NextResponse('Not authorized to remove members', { status: 403 });
    }

    // Don't allow removing the last owner
    if (membership.role === 'OWNER') {
      const ownerCount = await prisma.studyGroupMember.count({
        where: {
          group_id: params.groupId,
          role: 'OWNER',
        },
      });

      if (ownerCount <= 1) {
        return new NextResponse('Cannot remove the last owner', { status: 400 });
      }
    }

    // Remove member
    await prisma.studyGroupMember.delete({
      where: {
        id: memberId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDY_GROUP_MEMBERS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { groupId: string; userId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { role } = await request.json();

    if (!role || !['MEMBER', 'ADMIN'].includes(role)) {
      return new NextResponse('Invalid role', { status: 400 });
    }

    // Check if user is an admin or owner of the group
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: session.user.id,
        role: {
          in: ['OWNER', 'ADMIN'],
        },
      },
    });

    if (!membership) {
      return new NextResponse('Not authorized to update member roles', { status: 403 });
    }

    // Check if target member exists
    const targetMember = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: params.userId,
      },
    });

    if (!targetMember) {
      return new NextResponse('Member not found', { status: 404 });
    }

    // Cannot modify owner's role
    if (targetMember.role === 'OWNER') {
      return new NextResponse('Cannot modify owner\'s role', { status: 403 });
    }

    // Update member role
    const updatedMember = await prisma.studyGroupMember.update({
      where: {
        id: targetMember.id,
      },
      data: {
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('[STUDY_GROUP_MEMBERS_PUT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 