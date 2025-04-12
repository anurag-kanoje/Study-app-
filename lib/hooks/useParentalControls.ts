"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/config/supabase-client"
import { useAuth } from "@/contexts/AuthContext"

export type ParentalControls = {
  id: string
  user_id: string
  screen_time_limit: number // in minutes
  content_restrictions: string[]
  study_tracking: boolean
  created_at: string
  updated_at: string
}

export const useParentalControls = () => {
  const [controls, setControls] = useState<ParentalControls | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchParentalControls = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase.from("parental_controls").select("*").eq("user_id", user.id).single()

      if (error && error.code !== "PGRST116") throw error
      setControls(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateParentalControls = async (
    screenTimeLimit: number,
    contentRestrictions: string[],
    studyTracking: boolean,
  ) => {
    if (!user) return { error: "User not authenticated" }

    try {
      setLoading(true)

      const updates = {
        screen_time_limit: screenTimeLimit,
        content_restrictions: contentRestrictions,
        study_tracking: studyTracking,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }

      let result

      if (controls) {
        // Update existing controls
        const { data, error } = await supabase.from("parental_controls").update(updates).eq("id", controls.id).select()

        if (error) throw error
        result = data?.[0]
      } else {
        // Create new controls
        const { data, error } = await supabase
          .from("parental_controls")
          .insert({
            ...updates,
            created_at: new Date().toISOString(),
          })
          .select()

        if (error) throw error
        result = data?.[0]
      }

      setControls(result)
      return { error: null }
    } catch (err: any) {
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchParentalControls()
    }
  }, [user])

  return {
    controls,
    loading,
    error,
    updateParentalControls,
    fetchParentalControls,
  }
}

