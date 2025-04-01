"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { auth, firestore } from "../config/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useToast } from "./ToastContext"

export type UserRole = "student" | "teacher" | "parent"

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  role: UserRole
  photoURL: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: UserRole, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.displayName,
              role: userData.role,
              photoURL: firebaseUser.photoURL,
            })
          } else {
            // User document doesn't exist, sign out
            await firebaseSignOut(auth)
            setUser(null)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          showToast("Error loading user profile", "error")
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(firestore, "users", userCredential.user.uid))

      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || userData.displayName,
          role: userData.role,
          photoURL: userCredential.user.photoURL,
        })
        showToast("Signed in successfully", "success")
      } else {
        throw new Error("User profile not found")
      }
    } catch (error: any) {
      console.error("Sign in error:", error)
      let errorMessage = "Failed to sign in"
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password"
      }
      showToast(errorMessage, "error")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, role: UserRole, displayName: string) => {
    try {
      setIsLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Create user profile in Firestore
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        email,
        displayName,
        role,
        createdAt: new Date(),
      })

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName,
        role,
        photoURL: null,
      })

      showToast("Account created successfully", "success")
    } catch (error: any) {
      console.error("Sign up error:", error)
      let errorMessage = "Failed to create account"
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use"
      }
      showToast(errorMessage, "error")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      showToast("Signed out successfully", "success")
    } catch (error) {
      console.error("Sign out error:", error)
      showToast("Failed to sign out", "error")
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      showToast("Password reset email sent", "success")
    } catch (error) {
      console.error("Reset password error:", error)
      showToast("Failed to send password reset email", "error")
      throw error
    }
  }

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

