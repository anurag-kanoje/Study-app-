import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const sessionSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
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
    const result = sessionSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Invalid session format', { status: 400 });
    }

    // Validate that end time is after start time
    const startTime = new Date(result.data.start_time);
    const endTime = new Date(result.data.end_time);

    if (endTime <= startTime) {
      return new NextResponse('End time must be after start time', { status: 400 });
    }

    // Create the session
    const studySession = await prisma.session.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        start_time: startTime,
        end_time: endTime,
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

    return NextResponse.json(studySession);
  } catch (error) {
    console.error('[STUDY_GROUP_SESSIONS]', error);
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
    const search = searchParams.get('search') || '';
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where = {
      group_id: params.groupId,
      ...(userId ? { user_id: userId } : {}),
      ...(status ? { status } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
      ...(startDate && endDate ? {
        start_time: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      } : {}),
    };

    // Get sessions with pagination
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        orderBy: {
          start_time: 'desc',
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              avatar_url: true,
            },
          },
          attendees: {
            include: {
              user: {
                select: {
                  id: true,
                  full_name: true,
                  avatar_url: true,
                },
              },
            },
          },
        },
      }),
      prisma.session.count({ where }),
    ]);

    return NextResponse.json({
      sessions,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[STUDY_GROUP_SESSIONS]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; sessionId: string } }
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
      return new NextResponse('Not authorized to delete sessions', { status: 403 });
    }

    // Delete session
    await prisma.session.delete({
      where: {
        id: params.sessionId,
        group_id: params.groupId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDY_GROUP_SESSIONS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 