"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { type Session } from "@supabase/supabase-js"
import { useSupabase } from "@/app/components/providers/supabase-provider"

interface AuthContextType {
  session: Session | null
  loading: boolean
  error: Error | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: { username?: string; avatar_url?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase, session, error: supabaseError, loading } = useSupabase()
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (supabaseError) {
      setError(supabaseError)
    }
  }, [supabaseError])

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } catch (err) {
      console.error('Sign up error:', err)
      setError(err as Error)
      throw err
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err as Error)
      throw err
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err as Error)
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (err) {
      console.error('Password reset error:', err)
      setError(err as Error)
      throw err
    }
  }

  const updateProfile = async (data: { username?: string; avatar_url?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      })

      if (error) throw error
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err as Error)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
