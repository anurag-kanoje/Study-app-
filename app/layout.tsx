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
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (hasError) {
      console.error('Error in ErrorBoundary:', error);
    }
  }, [hasError, error]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Internal Server Error</h2>
          <p className="text-muted-foreground">Something went wrong. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return children;
}
