'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { StudyGroupMember, StudyGroupMemberRole } from '@prisma/client';

interface Props {
  members: Array<StudyGroupMember & {
    user: {
      id: string;
      full_name: string;
      avatar_url: string;
      email: string;
    };
  }>;
  groupId: string;
  currentUserRole: StudyGroupMemberRole;
}

export function StudyGroupMembers({ members, groupId, currentUserRole }: Props) {
  const router = useRouter();
  const [isInviting, setIsInviting] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);
  const [newRole, setNewRole] = useState<StudyGroupMemberRole>('MEMBER');

  const canManageMembers = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const handleInvite = async () => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to invite member');

      toast({
        title: 'Success',
        description: 'Invitation sent successfully',
      });
      setIsInviting(false);
      setEmail('');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedMember) return;

    try {
      const response = await fetch(`/api/study-groups/${groupId}/members/${selectedMember.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update member role');

      toast({
        title: 'Success',
        description: 'Member role updated successfully',
      });
      setSelectedMember(null);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update member role',
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
        title: 'Success',
        description: 'Member removed successfully',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {canManageMembers && (
        <Button onClick={() => setIsInviting(true)}>
          Invite Member
        </Button>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.user.id} className="p-4">
            <div className="flex items-center space-x-4">
              <Image
                src={member.user.avatar_url || '/default-avatar.png'}
                alt={member.user.full_name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-medium">{member.user.full_name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              {canManageMembers && member.user.id !== members.find(m => m.role === 'OWNER')?.user.id && (
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member);
                      setNewRole(member.role);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member.user.id)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isInviting} onOpenChange={setIsInviting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to invite.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviting(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Member Role</DialogTitle>
            <DialogDescription>
              Change the role of {selectedMember?.user.full_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="role">Role</label>
              <Select value={newRole} onValueChange={(value: StudyGroupMemberRole) => setNewRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMember(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 