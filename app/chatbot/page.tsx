"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Chatbot from "@/components/chatbot"

export default function ChatbotPage() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to use the chatbot</h1>
        <Button asChild>
          <a href="/auth/login">Sign In</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto py-6 px-4 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Study Assistant</h1>
        <div className="flex-1 bg-card rounded-lg shadow-sm border overflow-hidden flex flex-col">
          <Chatbot />
        </div>
      </div>
    </div>
  )
}

