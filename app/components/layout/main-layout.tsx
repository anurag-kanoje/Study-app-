'use client';

import { type PropsWithChildren } from 'react';
import { BottomNav } from './bottom-nav';
import { SideNav } from './side-nav';
import { TopBar } from './top-bar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const publicPaths = ['/login', '/register', '/forgot-password'];

export function MainLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isPublicPath = publicPaths.includes(pathname);
  const { session, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we initialize the application.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isPublicPath) {
    return (
      <main className="min-h-screen bg-background">
        {children}
      </main>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">Please log in to access this page.</p>
        </div>
      </div>
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
