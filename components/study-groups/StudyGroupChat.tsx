import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

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
  currentUser: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export function StudyGroupChat({ groupId, currentUser }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/study-groups/${groupId}/messages`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load chat history',
          variant: 'destructive',
        });
      }
    };

    fetchMessages();
  }, [groupId]);

  // Set up real-time connection
  useEffect(() => {
    // TODO: Implement WebSocket or Server-Sent Events connection
    // This is a placeholder for real-time functionality
    const eventSource = new EventSource(`/api/study-groups/${groupId}/chat-stream`);

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };

    return () => {
      eventSource.close();
    };
  }, [groupId]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/study-groups/${groupId}/messages`, {
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
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.user.id === currentUser.id ? 'flex-row-reverse' : ''
              }`}
            >
              <Image
                src={message.user.avatar_url || '/default-avatar.png'}
                alt={message.user.full_name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div
                className={`flex flex-col space-y-1 ${
                  message.user.id === currentUser.id ? 'items-end' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {message.user.full_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.created_at), 'h:mm a')}
                  </span>
                </div>
                <div
                  className={`px-3 py-2 rounded-lg ${
                    message.user.id === currentUser.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
} 