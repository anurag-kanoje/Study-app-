import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/app/components/theme-provider';
import { MainLayout } from './components/layout/main-layout';
import { Toaster } from '@/app/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { cn } from './lib/utils';
import { SupabaseProvider } from "@/app/components/providers/supabase-provider";
import './globals.css';
import { useState, useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'StudyBuddy',
    template: '%s | StudyBuddy',
  },
  description: 'AI-powered study assistant with parental controls',
  keywords: [
    'study',
    'education',
    'AI',
    'learning',
    'parental control',
    'quiz',
    'notes',
  ],
  authors: [
    {
      name: 'StudyBuddy Team',
    },
  ],
  creator: 'StudyBuddy Team',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://studybuddy.app',
    title: 'StudyBuddy',
    description: 'AI-powered study assistant with parental controls',
    siteName: 'StudyBuddy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyBuddy',
    description: 'AI-powered study assistant with parental controls',
    creator: '@studybuddy',
  },
  manifest: '/site.webmanifest',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        <SupabaseProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ErrorBoundary>
                <MainLayout>{children}</MainLayout>
                <Toaster />
              </ErrorBoundary>
            </ThemeProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(new Error(event.message));
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">{error.message}</p>
          <div className="space-x-4">
            <button
              onClick={() => setError(null)}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
