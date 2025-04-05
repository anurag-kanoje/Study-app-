import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import type { User } from '@/types';

interface Message {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface Props {
  groupId: string;
  currentUser: User;
}

export function StudyGroupChat({ groupId, currentUser }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch initial messages
  useEffect(() => {
    fetchMessages();
  }, [groupId]);

  // Set up SSE for real-time messages
  useEffect(() => {
    const eventSource = new EventSource(`/api/study-groups/${groupId}/chat-stream`);

    eventSource.onmessage = (event) => {
      if (event.data === 'heartbeat') return;
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };

    eventSource.onerror = () => {
      eventSource.close();
      toast({
        title: 'Connection lost',
        description: 'Trying to reconnect...',
        variant: 'destructive',
      });
    };

    return () => {
      eventSource.close();
    };
  }, [groupId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/study-groups/${groupId}/chat`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/study-groups/${groupId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      setNewMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Group Chat</h2>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.user.id === currentUser.id ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar>
                <AvatarImage src={message.user.avatar_url || undefined} />
                <AvatarFallback>
                  {message.user.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col ${
                  message.user.id === currentUser.id ? 'items-end' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.user.full_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div
                  className={`mt-1 px-3 py-2 rounded-lg ${
                    message.user.id === currentUser.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
} 