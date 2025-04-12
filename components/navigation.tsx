'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Brain,
  Calendar,
  GraduationCap,
  Group,
  Home,
  Lock,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Study Groups', href: '/study-groups', icon: Group },
  { name: 'AI Chatbot', href: '/chatbot', icon: MessageSquare },
  { name: 'Exam Prep', href: '/exam-prep', icon: GraduationCap },
  { name: 'Content Summarizer', href: '/summarize', icon: Brain },
  { name: 'Parental Controls', href: '/parental-controls', icon: Lock },
  { name: 'Study Calendar', href: '/calendar', icon: Calendar },
  { name: 'Notes', href: '/notes', icon: BookOpen },
  { name: 'Profile', href: '/profile', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
} 