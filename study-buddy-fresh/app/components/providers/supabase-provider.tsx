'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { type Session, AuthChangeEvent } from '@supabase/supabase-js';
import { type Database } from '@/app/types/supabase';

interface SupabaseContextType {
  supabase: ReturnType<typeof createClient<Database>>;
  session: Session | null;
  error: Error | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase client
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    // Check if environment variables are properly set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError(new Error('Missing Supabase environment variables'));
      setLoading(false);
      return;
    }

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession: Session | null) => {
      try {
        setSession(newSession);
        setLoading(false);
      } catch (err) {
        console.error('Error updating session:', err);
        setError(err as Error);
        setLoading(false);
      }
    });

    // Get initial session
    supabase.auth.getSession().then(
      async ({ data: { session } }: { data: { session: Session | null } }) => {
        try {
          setSession(session);
          setLoading(false);
        } catch (err) {
          console.error('Error getting initial session:', err);
          setError(err as Error);
          setLoading(false);
        }
      },
      (err: Error) => {
        console.error('Error in initial session:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (subscription as any).unsubscribe();
      } catch (err) {
        console.error('Error unsubscribing from auth state changes:', err);
      }
    };
  }, []); // Empty dependency array to run only once on mount

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
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <SupabaseContext.Provider value={{ supabase, session, error, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}
