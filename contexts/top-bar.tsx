'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Bell, Menu, Moon, Sun, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { type Database } from '@/app/types/supabase';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/ssr';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { session, loading, error } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (loading) return;

    if (error) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    if (!session) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Subscribe to notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      }, (payload: { new: Notification }) => {
        const newNotification = payload.new as Notification;
        setNotifications((prev) => [newNotification, ...prev]);
        if (!newNotification.read) {
          setUnreadCount((prev) => prev + 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, session, loading, error]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (!error) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:text-foreground md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-xl font-semibold">StudyBuddy</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-md',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-md',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className={cn(
                'absolute right-0 mt-2 w-80 rounded-md border bg-popover p-4 shadow-md',
                'animate-in fade-in-0 zoom-in-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Notifications</h2>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        notifications.forEach((n) => !n.read && markAsRead(n.id));
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'rounded-md p-3 text-sm',
                          !notification.read && 'bg-accent',
                          'transition-colors duration-200'
                        )}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="mb-1 font-medium">{notification.title}</div>
                        <p className="text-muted-foreground">{notification.message}</p>
                        <time className="mt-1 block text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </time>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground">
                      No notifications yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-md',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              <User className="h-6 w-6" />
            </button>

            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover p-2 shadow-md">
              <div className="space-y-1">
                <div className="flex items-center px-3 py-2">
                  <User className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">{session?.user?.email}</span>
                </div>
                <button
                  onClick={() => {
                    supabase.auth.signOut();
                    router.push('/login');
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
