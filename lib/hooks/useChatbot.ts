"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/config/supabase-client"
import { useAuth } from "@/contexts/AuthContext"

export type ChatMessage = {
  id: string
  message: string
  response: string
  created_at: string
  user_id: string
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchChatHistory = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("chat_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (message: string) => {
    if (!user) return { response: null, error: "User not authenticated" }

    try {
      setLoading(true)
      setError(null)

      // Call AI API for chat response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot")
      }

      const { response: aiResponse } = await response.json()

      // Save to Supabase
      const { data, error } = await supabase
        .from("chat_history")
        .insert({
          message,
          response: aiResponse,
          user_id: user.id,
        })
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        setMessages([...messages, data[0]])
      }

      return { response: aiResponse, error: null }
    } catch (err: any) {
      setError(err.message)
      return { response: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchChatHistory()
    }
  }, [user])

  return {
    messages,
    loading,
    error,
    sendMessage,
    fetchChatHistory,
  }
}

