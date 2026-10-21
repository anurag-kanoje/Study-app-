import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, type UserRole } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

export type { UserRole };

export interface AppUser {
  id: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  avatar_url: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role?: UserRole,
    displayName?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loadAppUser(userId: string): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, username, full_name, avatar_url, role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    displayName: data.full_name || data.username,
    role: data.role as UserRole,
    avatar_url: data.avatar_url,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;

    const applySession = async (nextSession: Session | null) => {
      setSession(nextSession);
      if (nextSession?.user) {
        const profile = await loadAppUser(nextSession.user.id);
        if (mounted) {
          setUser(
            profile ?? {
              id: nextSession.user.id,
              email: nextSession.user.email ?? null,
              displayName: nextSession.user.email?.split('@')[0] ?? null,
              role: 'student',
              avatar_url: null,
            }
          );
        }
      } else if (mounted) {
        setUser(null);
      }
      if (mounted) {
        setLoading(false);
      }
    };

    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => applySession(initialSession))
      .catch((error) => {
        console.warn('Supabase session unavailable:', error);
        if (mounted) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        showToast('Invalid email or password', 'error');
        throw error ?? new Error('Invalid email or password');
      }
      showToast('Signed in successfully', 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: UserRole = 'student',
    displayName?: string
  ) => {
    setLoading(true);
    const name = displayName?.trim() || email.split('@')[0] || 'User';
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role,
          },
        },
      });
      if (error || !data.user) {
        showToast('Failed to create account', 'error');
        throw error ?? new Error('Failed to create account');
      }

      const username = `${email.split('@')[0].replace(/\W/g, '_')}_${data.user.id.slice(0, 8)}`;
      await supabase.from('profiles').upsert({
        id: data.user.id,
        username,
        email,
        full_name: name,
        role,
        avatar_url: null,
      });

      showToast('Account created successfully', 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      showToast('Signed out successfully', 'success');
    } catch {
      showToast('Failed to sign out', 'error');
      throw new Error('Failed to sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      showToast('Password reset email sent', 'success');
    } catch {
      showToast('Failed to send password reset email', 'error');
      throw new Error('Failed to send password reset email');
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isLoading: loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
