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

export function SideNav({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, loading, error } = useAuth();

  if (loading) {
    return (
      <div className={cn(
        'fixed left-0 top-0 h-full w-64 bg-background/80 backdrop-blur-lg',
        className
      )}>
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
    <nav className={cn(
      'fixed left-0 top-0 h-full w-64 border-r bg-background/80 backdrop-blur-lg',
      className
    )}>
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              const isDisabled = item.role && session.user?.role !== item.role;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  disabled={Boolean(isDisabled)}
                  className={cn(
                    'relative flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isDisabled ? 'opacity-50 cursor-not-allowed' : '',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {React.createElement(item.icon, {
                    className: cn(
                      'h-5 w-5',
                      isActive && 'animate-bounce'
                    ),
                  })}
                  <span>{item.label}</span>
                  {item.badge && !isDisabled && (
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
