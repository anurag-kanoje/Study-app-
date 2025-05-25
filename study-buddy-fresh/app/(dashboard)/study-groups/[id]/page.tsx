import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { StudyGroupClient } from './StudyGroupClient';

export const metadata: Metadata = {
  title: 'Study Group',
  description: 'View and manage your study group',
};

interface Props {
  params: {
    id: string;
  };
}

export default async function StudyGroupPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return notFound();
  }

  const studyGroup = await prisma.studyGroup.findUnique({
    where: { id: params.id },
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
      notes: {
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
      sessions: {
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

  if (!studyGroup) {
    return notFound();
  }

  const membership = studyGroup.members.find(
    (member) => member.user_id === session.user.id
  );

  if (!membership) {
    return notFound();
  }

  return (
    <StudyGroupClient
      studyGroup={studyGroup}
      membership={membership}
      currentUser={session.user}
    />
  );
} 