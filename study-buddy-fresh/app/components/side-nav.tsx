'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/Button';
import {
  BookOpen,
  Brain,
  Calendar,
  Clock,
  FileText,
  Home,
  Settings,
  Target,
  Users,
} from 'lucide-react';

interface SideNavProps {
  className?: string;
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Notes',
    href: '/dashboard/notes',
    icon: FileText,
  },
  {
    title: 'Study Timer',
    href: '/dashboard/timer',
    icon: Clock,
  },
  {
    title: 'AI Assistant',
    href: '/dashboard/ai',
    icon: Brain,
  },
  {
    title: 'Study Groups',
    href: '/dashboard/groups',
    icon: Users,
  },
  {
    title: 'Goals',
    href: '/dashboard/goals',
    icon: Target,
  },
  {
    title: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    title: 'Library',
    href: '/dashboard/library',
    icon: BookOpen,
  },
];

export function SideNav({ className }: SideNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col gap-4 p-4', className)}>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">StudyBuddy</span>
        </Link>
      </div>
      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          );
        })}
      </div>
      <div className="border-t">
        <Button
          variant="ghost"
          className="mt-4 w-full justify-start gap-2"
          asChild
        >
          <Link href="/dashboard/settings">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>
    </nav>
  );
}
