'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Note, StudyGroupMemberRole, Tag } from '@prisma/client';

interface Props {
  notes: Array<Note & {
    user: {
      full_name: string;
      avatar_url: string;
    };
    tags: Tag[];
  }>;
  groupId: string;
  currentUserRole: StudyGroupMemberRole;
}

export function StudyGroupNotes({ notes, groupId, currentUserRole }: Props) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [selectedNote, setSelectedNote] = useState<typeof notes[0] | null>(null);

  const handleCreate = async () => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) throw new Error('Failed to create note');

      toast({
        title: 'Success',
        description: 'Note created successfully',
      });
      setIsCreating(false);
      setTitle('');
      setContent('');
      setTags('');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');

      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsCreating(true)}>
        Create Note
      </Button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Image
                    src={note.user.avatar_url || '/default-avatar.png'}
                    alt={note.user.full_name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    {note.user.full_name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(note.created_at), 'MMM d, yyyy')}
                </span>
              </div>

              <div>
                <h3 className="font-medium">{note.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                  {note.content}
                </p>
              </div>

              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNote(note)}
                >
                  View
                </Button>
                {(currentUserRole === 'OWNER' || currentUserRole === 'ADMIN') && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Note</DialogTitle>
            <DialogDescription>
              Share your knowledge with the group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content">Content</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. math, physics, chemistry"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNote?.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Image
                src={selectedNote?.user.avatar_url || '/default-avatar.png'}
                alt={selectedNote?.user.full_name || ''}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm text-muted-foreground">
                {selectedNote?.user.full_name}
              </span>
              <span className="text-sm text-muted-foreground">
                {selectedNote && format(new Date(selectedNote.created_at), 'MMM d, yyyy')}
              </span>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">{selectedNote?.content}</p>
            {selectedNote?.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedNote.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedNote(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 