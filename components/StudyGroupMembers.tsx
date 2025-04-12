import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { Crown, Shield, User as UserIcon } from 'lucide-react';

interface Props {
  members: {
    id: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    user: {
      id: string;
      full_name: string;
      avatar_url: string | null;
    };
  }[];
  groupId: string;
  currentUser: User;
  membership: {
    id: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    user: {
      id: string;
      full_name: string;
      avatar_url: string | null;
    };
  };
}

export function StudyGroupMembers({ members, groupId, currentUser, membership }: Props) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const canManageMembers = membership.role === 'OWNER' || membership.role === 'ADMIN';

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/study-groups/${groupId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (!response.ok) throw new Error('Failed to send invitation');
      
      toast({
        title: 'Invitation sent',
        description: `Invitation sent to ${inviteEmail}`,
      });
      
      setInviteEmail('');
      setIsInviteOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'ADMIN' | 'MEMBER') => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update role');
      
      toast({
        title: 'Role updated',
        description: 'Member role has been updated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove member');
      
      toast({
        title: 'Member removed',
        description: 'Member has been removed from the group',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Members</CardTitle>
        {canManageMembers && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button>Invite Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button onClick={handleInvite} disabled={isLoading}>
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.user.avatar_url || undefined} />
                  <AvatarFallback>
                    {member.user.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.user.full_name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {member.role === 'OWNER' ? (
                      <Crown className="h-3 w-3" />
                    ) : member.role === 'ADMIN' ? (
                      <Shield className="h-3 w-3" />
                    ) : (
                      <UserIcon className="h-3 w-3" />
                    )}
                    <span>{member.role}</span>
                  </div>
                </div>
              </div>
              {canManageMembers && member.role !== 'OWNER' && (
                <div className="flex items-center gap-2">
                  {member.role === 'ADMIN' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(member.id, 'MEMBER')}
                    >
                      Remove Admin
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(member.id, 'ADMIN')}
                    >
                      Make Admin
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 