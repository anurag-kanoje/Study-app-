import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // Search for public groups or groups where the user is a member
    const groups = await prisma.studyGroup.findMany({
      where: {
        OR: [
          {
            AND: [
              { is_private: false },
              {
                OR: [
                  { name: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } },
                ],
              },
            ],
          },
          {
            AND: [
              { is_private: true },
              {
                members: {
                  some: {
                    user_id: session.user.id,
                  },
                },
              },
              {
                OR: [
                  { name: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } },
                ],
              },
            ],
          },
        ],
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
        _count: {
          select: {
            members: true,
            notes: true,
            sessions: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('[STUDY_GROUPS_SEARCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 