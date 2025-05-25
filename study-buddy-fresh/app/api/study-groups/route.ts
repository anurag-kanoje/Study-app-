import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  is_private: z.boolean(),
});

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get all groups where the user is a member
    const groups = await prisma.studyGroup.findMany({
      where: {
        members: {
          some: {
            user_id: session.user.id,
          },
        },
      },
      include: {
        members: {
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
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('[STUDY_GROUPS_LIST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const result = createGroupSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Invalid group format', { status: 400 });
    }

    // Create the group and add the creator as an owner
    const group = await prisma.studyGroup.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        is_private: result.data.is_private,
        members: {
          create: {
            user_id: session.user.id,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
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
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('[STUDY_GROUP_CREATE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { id, name, description } = json;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    }

    // Check if user is admin or owner
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: id,
        user_id: session.user.id,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    });

    if (!membership) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const group = await prisma.studyGroup.update({
      where: { id },
      data: { name, description },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                avatar_url: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error updating study group:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Check if user is owner
    const membership = await prisma.studyGroupMember.findFirst({
      where: {
        group_id: id,
        user_id: session.user.id,
        role: 'OWNER'
      }
    });

    if (!membership) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.studyGroup.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting study group:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 