import { useEffect, useRef, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

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
  isOpen: boolean;
  onClose: () => void;
}

export function MobileChatDrawer({ groupId, isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch initial messages
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, groupId]);

  // Set up SSE for real-time messages
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, groupId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Group Chat</h2>
          </div>

          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={message.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {message.user.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.user.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{message.content}</p>
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
      </SheetContent>
    </Sheet>
  );
} 