"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/config/supabase-client"
import { useAuth } from "@/contexts/AuthContext"

export type Note = {
  id: string
  title: string
  content: string
  created_at: string
  user_id: string
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchNotes = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async (title: string, content: string) => {
    if (!user) return { error: "User not authenticated" }

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ title, content, user_id: user.id }])
        .select()

      if (error) throw error
      setNotes([...(data || []), ...notes])
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateNote = async (id: string, title: string, content: string) => {
    if (!user) return { error: "User not authenticated" }

    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ title, content })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()

      if (error) throw error
      setNotes(notes.map((note) => (note.id === id ? { ...note, title, content } : note)))
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteNote = async (id: string) => {
    if (!user) return { error: "User not authenticated" }

    try {
      const { error } = await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error
      setNotes(notes.filter((note) => note.id !== id))
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
}

