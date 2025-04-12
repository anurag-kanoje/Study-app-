import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Plus } from 'lucide-react';

interface Props {
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
  groupId: string;
  currentUser: User;
}

export function StudyGroupNotes({ notes, groupId, currentUser }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/study-groups/${groupId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) throw new Error('Failed to create note');
      
      toast({
        title: 'Note created',
        description: 'Your note has been created successfully',
      });
      
      setTitle('');
      setContent('');
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');
      
      toast({
        title: 'Note deleted',
        description: 'The note has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Notes</CardTitle>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Note content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
              <Button onClick={handleCreateNote} disabled={isLoading}>
                Create Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                </div>
                {note.user.id === currentUser.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Delete
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={note.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {note.user.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-muted-foreground">
                    <span>{note.user.full_name}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {formatDistanceToNow(new Date(note.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <p className="whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 