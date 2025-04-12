'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { MobileChatDrawer } from '@/components/MobileChatDrawer';
import { StudyGroupHeader } from '@/components/StudyGroupHeader';
import { StudyGroupMembers } from '@/components/StudyGroupMembers';
import { StudyGroupNotes } from '@/components/StudyGroupNotes';
import { StudyGroupSessions } from '@/components/StudyGroupSessions';
import { StudyGroupChat } from '@/components/StudyGroupChat';
import type { StudyGroup, StudyGroupMember } from '@prisma/client';
import type { User } from '@/types';

interface Props {
  studyGroup: StudyGroup & {
    members: (StudyGroupMember & {
      user: {
        id: string;
        full_name: string;
        avatar_url: string | null;
      };
    })[];
    notes: {
      id: string;
      title: string;
      content: string;
      created_at: string;
      user: {
        id: string;
        full_name: string;
        avatar_url: string | null;
      };
    }[];
    sessions: {
      id: string;
      title: string;
      description: string;
      start_time: string;
      end_time: string;
      user: {
        id: string;
        full_name: string;
        avatar_url: string | null;
      };
    }[];
  };
  membership: StudyGroupMember & {
    user: {
      id: string;
      full_name: string;
      avatar_url: string | null;
    };
  };
  currentUser: User;
}

export function StudyGroupClient({ studyGroup, membership, currentUser }: Props) {
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  return (
    <div className="container py-6 space-y-6">
      <StudyGroupHeader studyGroup={studyGroup} membership={membership} />

      <div className="flex items-center justify-between">
        <Tabs defaultValue="notes" className="w-full">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <StudyGroupNotes
              notes={studyGroup.notes}
              groupId={studyGroup.id}
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="sessions">
            <StudyGroupSessions
              sessions={studyGroup.sessions}
              groupId={studyGroup.id}
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="members">
            <StudyGroupMembers
              members={studyGroup.members}
              groupId={studyGroup.id}
              currentUser={currentUser}
              membership={membership}
            />
          </TabsContent>
        </Tabs>

        <Button
          variant="outline"
          size="icon"
          className="ml-4 md:hidden"
          onClick={() => setIsMobileChatOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>

      <div className="hidden md:block">
        <StudyGroupChat groupId={studyGroup.id} currentUser={currentUser} />
      </div>

      <MobileChatDrawer
        groupId={studyGroup.id}
        isOpen={isMobileChatOpen}
        onClose={() => setIsMobileChatOpen(false)}
      />
    </div>
  );
} 