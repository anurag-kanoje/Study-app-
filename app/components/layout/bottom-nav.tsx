'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import {
  Home,
  BookOpen,
  Brain,
  FileText,
  Users,
  Calendar,
  Trophy,
  Settings
} from 'lucide-react';

const mobileNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/notes', label: 'Notes', icon: BookOpen },
  { href: '/ai-chat', label: 'AI Chat', icon: Brain },
  { href: '/file-analysis', label: 'Files', icon: FileText },
  { href: '/peer-pods', label: 'Pods', icon: Users },
  { href: '/planner', label: 'Plan', icon: Calendar },
  { href: '/progress', label: 'Progress', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-4 items-center justify-around px-2">
        {mobileNavItems.slice(0, 4).map(({ href, label, icon: Icon }) => (
          <Button
            key={href}
            variant="ghost"
            size="sm"
            className={cn(
              'flex h-full flex-col items-center justify-center gap-1 rounded-none',
              pathname === href && 'text-primary'
            )}
            onClick={() => window.location.href = href}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
