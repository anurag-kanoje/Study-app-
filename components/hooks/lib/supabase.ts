import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export type Note = {
  id: number
  user_id: string
  content: string
  title: string
  created_at: string
  updated_at: string
}

export type UserProfile = {
  id: string
  email: string
  avatar_url?: string
  full_name?: string
}

export type FileObject = {
  id: string
  name: string
  size: number
  created_at: string
  url: string
  type: string
}

