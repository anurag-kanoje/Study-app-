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

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 backdrop-blur-lg md:hidden">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2',
              'transition-colors duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon
              className={cn(
                'h-6 w-6',
                isActive && 'animate-bounce'
              )}
            />
            <span className="text-xs font-medium">{item.label}</span>
            {item.badge && (
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
