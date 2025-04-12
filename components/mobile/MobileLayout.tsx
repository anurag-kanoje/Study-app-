import React from 'react';
import { MobileNavigation } from './MobileNavigation';

interface Props {
  children: React.ReactNode;
}

export function MobileLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
} 