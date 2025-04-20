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

    const { email } = await request.json();

    if (!email) {
      return new NextResponse('Missing email', { status: 400 });
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
      return new NextResponse('Not authorized to invite members', { status: 403 });
    }

    // Find user by email
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!userData) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: params.groupId,
        user_id: userData.id,
      },
    });

    if (existingMembership) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const role = searchParams.get('role');
    const search = searchParams.get('search') || '';

    // Build where clause
    const where = {
      group_id: params.groupId,
      ...(role ? { role } : {}),
      ...(search ? {
        user: {
          OR: [
            { full_name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      } : {}),
    };

    // Get members with pagination
    const [members, total] = await Promise.all([
      prisma.studyGroupMember.findMany({
        where,
        orderBy: [
          { role: 'asc' },
          { created_at: 'desc' },
        ],
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
              avatar_url: true,
              last_seen: true,
            },
          },
        },
      }),
      prisma.studyGroupMember.count({ where }),
    ]);

    return NextResponse.json({
      members,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[STUDY_GROUP_MEMBERS]', error);
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

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; userId: string } }
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
        role: {
          in: ['OWNER', 'ADMIN'],
        },
      },
    });

    if (!membership) {
      return new NextResponse('Not authorized to remove members', { status: 403 });
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

    // Cannot remove owner
    if (targetMember.role === 'OWNER') {
      return new NextResponse('Cannot remove owner', { status: 403 });
    }

    // Remove member
    await prisma.studyGroupMember.delete({
      where: {
        id: targetMember.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDY_GROUP_MEMBERS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 