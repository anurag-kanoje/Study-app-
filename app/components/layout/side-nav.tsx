'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Book,
  MessageSquare,
  Brain,
  User,
  Calendar,
  Users,
  Award,
  Settings,
  BarChart,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from '@/app/types/supabase';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  roles?: ('student' | 'parent' | 'teacher')[];
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
    roles: ['student', 'teacher'],
  },
  {
    icon: MessageSquare,
    label: 'AI Chat',
    path: '/ai-chat',
    roles: ['student', 'teacher'],
  },
  {
    icon: Brain,
    label: 'Quiz',
    path: '/quiz',
    roles: ['student'],
  },
  {
    icon: Calendar,
    label: 'Planner',
    path: '/planner',
    roles: ['student', 'teacher'],
  },
  {
    icon: Users,
    label: 'Study Groups',
    path: '/study-groups',
    roles: ['student', 'teacher'],
  },
  {
    icon: Award,
    label: 'Progress',
    path: '/progress',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    path: '/analytics',
    roles: ['parent', 'teacher'],
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile',
  },
];

interface SideNavProps {
  className?: string;
}

export function SideNav({ className }: SideNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.role);
        }
      }
    };

    fetchUserRole();
  }, [supabase]);

  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole as any)
  );

  return (
    <nav className={cn(
      'w-64 border-r bg-background/80 backdrop-blur-lg',
      'flex flex-col gap-2 p-4',
      className
    )}>
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="h-8 w-8 rounded-full bg-primary" />
        <span className="text-lg font-semibold">StudyBuddy</span>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {filteredNavItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                'transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="rounded-md border bg-card p-4">
          <div className="mb-2 text-sm font-medium">Study Streak</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">7</div>
            <div className="text-sm text-muted-foreground">days</div>
            <Award className="ml-auto h-5 w-5 text-primary" />
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-accent">
            <div className="h-full w-3/4 bg-primary transition-all duration-500" />
          </div>
        </div>
      </div>
    </nav>
  );
}
