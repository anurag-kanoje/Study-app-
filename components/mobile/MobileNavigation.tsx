import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  Menu,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const bottomTabs = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Groups', href: '/study-groups', icon: Users },
  { name: 'Notes', href: '/notes', icon: BookOpen },
  { name: 'Sessions', href: '/planner', icon: Calendar },
  { name: 'Chat', href: '/chatbot', icon: MessageSquare },
];

const drawerItems = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Sign Out', href: '/auth/logout', icon: LogOut },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
        <nav className="flex items-center justify-around h-16">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full space-y-1',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Drawer Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 right-4 z-50 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80%] sm:w-[350px] p-0">
          <ScrollArea className="h-full py-6">
            <div className="space-y-4 py-4">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-6 py-3 space-x-3 text-sm hover:bg-accent"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Bottom Padding for Content */}
      <div className="pb-16 md:pb-0" />
    </>
  );
} 