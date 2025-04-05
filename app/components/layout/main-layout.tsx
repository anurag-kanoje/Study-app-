'use client';

import { type PropsWithChildren } from 'react';
import { BottomNav } from './bottom-nav';
import { SideNav } from './side-nav';
import { TopBar } from './top-bar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const publicPaths = ['/login', '/register', '/forgot-password'];

export function MainLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isPublicPath = publicPaths.includes(pathname);

  if (isPublicPath) {
    return (
      <main className="min-h-screen bg-background">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <div className="flex flex-1">
        <SideNav className="hidden md:flex" />
        <main className={cn(
          'flex-1 pb-16 md:pb-0', // Add padding for bottom nav on mobile
          'px-4 py-4 md:px-8 md:py-6', // Responsive padding
          'overflow-y-auto' // Enable scrolling
        )}>
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
