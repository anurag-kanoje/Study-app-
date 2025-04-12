'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { StudyGroup, StudyGroupMemberRole } from '@prisma/client';

interface Props {
  group: StudyGroup;
  currentUserRole: StudyGroupMemberRole;
}

export function StudyGroupHeader({ group, currentUserRole }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || '');
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/study-groups/${group.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) throw new Error('Failed to update group');

      toast({
        title: 'Success',
        description: 'Study group updated successfully',
      });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update study group',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/study-groups/${group.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete group');

      toast({
        title: 'Success',
        description: 'Study group deleted successfully',
      });
      router.push('/study-groups');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete study group',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          {group.description && (
            <p className="text-muted-foreground">{group.description}</p>
          )}
        </div>
        {canEdit && (
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleting(true)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Study Group</DialogTitle>
            <DialogDescription>
              Make changes to your study group here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Study Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this study group? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 