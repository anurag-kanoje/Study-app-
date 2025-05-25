import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

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

    // Set up SSE headers
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Subscribe to real-time updates
        const { data: changes } = await supabase
          .channel('group-messages')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'GroupMessage',
              filter: `group_id=eq.${params.groupId}`,
            },
            async (payload) => {
              // Fetch the complete message with user data
              const message = await prisma.groupMessage.findUnique({
                where: { id: payload.new.id },
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

              if (message) {
                const data = `data: ${JSON.stringify(message)}\n\n`;
                controller.enqueue(encoder.encode(data));
              }
            }
          )
          .subscribe();

        // Keep the connection alive with a heartbeat
        const heartbeat = setInterval(() => {
          const data = 'data: heartbeat\n\n';
          controller.enqueue(encoder.encode(data));
        }, 30000);

        // Clean up on client disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeat);
          changes.unsubscribe();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[STUDY_GROUP_CHAT_STREAM]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 