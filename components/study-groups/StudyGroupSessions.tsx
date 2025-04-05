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
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { Session, StudyGroupMemberRole } from '@prisma/client';

interface Props {
  sessions: Array<Session & {
    user: {
      full_name: string;
      avatar_url: string;
    };
  }>;
  groupId: string;
  currentUserRole: StudyGroupMemberRole;
}

export function StudyGroupSessions({ sessions, groupId, currentUserRole }: Props) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedSession, setSelectedSession] = useState<typeof sessions[0] | null>(null);

  const handleCreate = async () => {
    if (!date || !startTime) return;

    try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDateTime = new Date(date);
      startDateTime.setHours(hours, minutes);

      const response = await fetch(`/api/study-groups/${groupId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          start_time: startDateTime.toISOString(),
          duration: parseInt(duration),
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      toast({
        title: 'Success',
        description: 'Study session created successfully',
      });
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setDate(new Date());
      setStartTime('');
      setDuration('');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create study session',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete session');

      toast({
        title: 'Success',
        description: 'Study session deleted successfully',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete study session',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsCreating(true)}>
        Schedule Session
      </Button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Image
                    src={session.user.avatar_url || '/default-avatar.png'}
                    alt={session.user.full_name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    {session.user.full_name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(session.start_time), 'MMM d, yyyy')}
                </span>
              </div>

              <div>
                <h3 className="font-medium">{session.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {session.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {format(new Date(session.start_time), 'h:mm a')}
                </span>
                <span>
                  Duration: {session.duration} minutes
                </span>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSession(session)}
                >
                  View
                </Button>
                {(currentUserRole === 'OWNER' || currentUserRole === 'ADMIN') && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(session.id)}
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
            <DialogTitle>Schedule Study Session</DialogTitle>
            <DialogDescription>
              Plan a study session with your group.
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
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label>Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-time">Start Time</label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration">Duration (minutes)</label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Image
                src={selectedSession?.user.avatar_url || '/default-avatar.png'}
                alt={selectedSession?.user.full_name || ''}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm text-muted-foreground">
                {selectedSession?.user.full_name}
              </span>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">{selectedSession?.description}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                <p>Date: {selectedSession && format(new Date(selectedSession.start_time), 'MMM d, yyyy')}</p>
                <p>Time: {selectedSession && format(new Date(selectedSession.start_time), 'h:mm a')}</p>
              </div>
              <p>Duration: {selectedSession?.duration} minutes</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedSession(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 