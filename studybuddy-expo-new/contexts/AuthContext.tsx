import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@supabase/ssr';

interface AuthContextType {
  session: { session: Session | null; user: User | null } | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ session: Session | null; user: User | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        error,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
