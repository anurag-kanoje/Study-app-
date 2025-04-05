import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudyGroup, StudyGroupMember } from '@prisma/client';
import { User } from '@/types';
import { Users } from 'lucide-react';

interface Props {
  studyGroup: StudyGroup & {
    members: (StudyGroupMember & {
      user: {
        id: string;
        full_name: string;
        avatar_url: string | null;
      };
    })[];
  };
  membership: StudyGroupMember & {
    user: {
      id: string;
      full_name: string;
      avatar_url: string | null;
    };
  };
}

export function StudyGroupHeader({ studyGroup, membership }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{studyGroup.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {studyGroup.members.length} members
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{studyGroup.description}</p>
        <div className="mt-4 flex -space-x-2">
          {studyGroup.members.slice(0, 5).map((member) => (
            <Avatar key={member.user.id} className="border-2 border-background">
              <AvatarImage src={member.user.avatar_url || undefined} />
              <AvatarFallback>
                {member.user.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
          {studyGroup.members.length > 5 && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
              +{studyGroup.members.length - 5}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 