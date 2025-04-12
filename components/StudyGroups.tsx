import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  members: {
    user: {
      id: string;
      full_name: string;
      avatar_url: string | null;
    };
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
  }[];
  _count: {
    notes: number;
    sessions: number;
  };
}

export function StudyGroups() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async (query = '') => {
    try {
      const response = await fetch(`/api/study-groups?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load study groups',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchGroups(e.target.value);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: 'Error',
        description: 'Group name is required',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/study-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDescription,
        }),
      });

      if (!response.ok) throw new Error('Failed to create group');

      const newGroup = await response.json();
      setGroups([newGroup, ...groups]);
      setShowCreateDialog(false);
      setNewGroupName('');
      setNewGroupDescription('');
      toast({
        title: 'Success',
        description: 'Study group created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create study group',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search study groups..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>Create Study Group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
              <DialogDescription>
                Create a new study group to collaborate with others.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateGroup}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Group'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2 overflow-hidden">
                {group.members.slice(0, 5).map((member) => (
                  <Avatar key={member.user.id}>
                    <AvatarImage src={member.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.user.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {group.members.length > 5 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary">
                    <span className="text-xs">+{group.members.length - 5}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="space-x-2">
                <Badge variant="secondary">
                  {group._count.notes} Notes
                </Badge>
                <Badge variant="secondary">
                  {group._count.sessions} Sessions
                </Badge>
              </div>
              <Button variant="outline" onClick={() => window.location.href = `/study-groups/${group.id}`}>
                View Group
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {groups.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No study groups found.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new group to get started!
          </p>
        </div>
      )}
    </div>
  );
} 