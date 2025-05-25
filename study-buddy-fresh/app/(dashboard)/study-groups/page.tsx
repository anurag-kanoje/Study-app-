'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useToast } from '@/app/components/ui/use-toast';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  description: string;
  createdBy: string;
}

interface GroupMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export default function StudyGroupsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Advanced Mathematics',
      subject: 'Mathematics',
      members: 5,
      description: 'Study group for advanced mathematics topics',
      createdBy: 'John Doe',
    },
    {
      id: '2',
      name: 'Physics Lab',
      subject: 'Physics',
      members: 3,
      description: 'Collaborative physics lab study group',
      createdBy: 'Jane Smith',
    },
  ]);

  const [messages, setMessages] = useState<GroupMessage[]>([
    {
      id: '1',
      content: 'Hello everyone! Welcome to the study group.',
      sender: 'John Doe',
      timestamp: new Date(),
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleCreateGroup = () => {
    // TODO: Implement group creation
    toast({
      title: 'Group Created',
      description: 'Your study group has been created successfully.',
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: GroupMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'Current User',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Study Groups</h1>

      <Tabs defaultValue="my-groups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{group.subject}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {group.members} members
                      </span>
                    </div>
                    <Button className="w-full">Join Group</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
              <CardDescription>
                Start a new study group and invite your classmates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input id="group-name" placeholder="Enter group name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter group description"
                  />
                </div>
                <Button onClick={handleCreateGroup}>Create Group</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Group Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[400px]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-2"
                  >
                    <Avatar>
                      <AvatarImage src={`/avatars/${message.sender}.png`} />
                      <AvatarFallback>
                        {message.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{message.sender}</span>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex space-x-2 mt-4">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
