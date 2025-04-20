'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { themeConfig } from '@/app/styles/theme';
import {
  Home,
  Book,
  MessageSquare,
  Brain,
  User,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
  role?: string;
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: Book,
    label: 'Notes',
    path: '/notes',
  },
  {
    icon: MessageSquare,
    label: 'AI Chat',
    path: '/ai-chat',
  },
  {
    icon: Brain,
    label: 'Quiz',
    path: '/quiz',
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile',
  },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-lg md:hidden">
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 backdrop-blur-lg md:hidden">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        const isDisabled = item.role && session.user?.role !== item.role;

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            disabled={Boolean(isDisabled)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2',
              'transition-colors duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              isDisabled ? 'opacity-50 cursor-not-allowed' : '',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {React.createElement(item.icon, {
              className: cn(
                'h-6 w-6',
                isActive && 'animate-bounce'
              ),
            })}
            <span className="text-xs font-medium">{item.label}</span>
            {item.badge && !isDisabled && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
