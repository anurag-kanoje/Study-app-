'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type Database } from '@/app/types/supabase';

interface SupabaseContextType {
  supabase: ReturnType<typeof createClientComponentClient<Database>>;
  session: Session | null;
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
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}
