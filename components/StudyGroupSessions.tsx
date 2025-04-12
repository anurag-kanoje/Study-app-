import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, Plus } from 'lucide-react';

interface Props {
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
  groupId: string;
  currentUser: User;
}

export function StudyGroupSessions({ sessions, groupId, currentUser }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateSession = async () => {
    if (!title.trim() || !description.trim() || !startTime || !endTime) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/study-groups/${groupId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');
      
      toast({
        title: 'Session created',
        description: 'Your study session has been created successfully',
      });
      
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create session',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete session');
      
      toast({
        title: 'Session deleted',
        description: 'The study session has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete session',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Sessions</CardTitle>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Session title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Session description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleCreateSession} disabled={isLoading}>
                Create Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                </div>
                {session.user.id === currentUser.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    Delete
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {session.user.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-muted-foreground">
                    <span>{session.user.full_name}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {formatDistanceToNow(new Date(session.start_time), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <p className="mb-4">{session.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(session.start_time), 'MMM d, h:mm a')} -{' '}
                      {format(new Date(session.end_time), 'h:mm a')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 