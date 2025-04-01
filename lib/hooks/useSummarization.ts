"use client"

import { useState } from "react"
import { supabase } from "@/lib/config/supabase-client"
import { useAuth } from "@/contexts/AuthContext"

export type SummaryType = "text" | "image" | "video"

export type Summary = {
  id: string
  original_content: string
  summary_content: string
  type: SummaryType
  created_at: string
  user_id: string
}

export const useSummarization = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const summarizeText = async (text: string) => {
    if (!user) return { summary: null, error: "User not authenticated" }

    try {
      setLoading(true)
      setError(null)

      // Call OpenAI API for summarization
      const response = await fetch("/api/summarize/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Failed to summarize text")
      }

      const { summary } = await response.json()

      // Save summary to Supabase
      await supabase.from("summaries").insert({
        original_content: text,
        summary_content: summary,
        type: "text",
        user_id: user.id,
      })

      return { summary, error: null }
    } catch (err: any) {
      setError(err.message)
      return { summary: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const summarizeImage = async (imageFile: File) => {
    if (!user) return { summary: null, error: "User not authenticated" }

    try {
      setLoading(true)
      setError(null)

      // Upload image to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${imageFile.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage.from("images").upload(fileName, imageFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName)

      const imageUrl = urlData.publicUrl

      // Call API for image summarization
      const response = await fetch("/api/summarize/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to summarize image")
      }

      const { summary } = await response.json()

      // Save summary to Supabase
      await supabase.from("summaries").insert({
        original_content: imageUrl,
        summary_content: summary,
        type: "image",
        user_id: user.id,
      })

      return { summary, error: null }
    } catch (err: any) {
      setError(err.message)
      return { summary: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const summarizeVideo = async (videoUrl: string) => {
    if (!user) return { summary: null, error: "User not authenticated" }

    try {
      setLoading(true)
      setError(null)

      // Call API for video summarization
      const response = await fetch("/api/summarize/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to summarize video")
      }

      const { summary } = await response.json()

      // Save summary to Supabase
      await supabase.from("summaries").insert({
        original_content: videoUrl,
        summary_content: summary,
        type: "video",
        user_id: user.id,
      })

      return { summary, error: null }
    } catch (err: any) {
      setError(err.message)
      return { summary: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const getSummaries = async () => {
    if (!user) return { summaries: [], error: "User not authenticated" }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("summaries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      return { summaries: data || [], error: null }
    } catch (err: any) {
      setError(err.message)
      return { summaries: [], error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    summarizeText,
    summarizeImage,
    summarizeVideo,
    getSummaries,
  }
}

