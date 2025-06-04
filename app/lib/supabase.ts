<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Note = {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  tags: string[]
  subject: string
  ai_summary?: string
  flashcards?: Array<{
    id: string
    front: string
    back: string
    difficulty: 'easy' | 'medium' | 'hard'
  }>
=======
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Note = {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  tags: string[]
  subject: string
  ai_summary?: string
  flashcards?: Array<{
    id: string
    front: string
    back: string
    difficulty: 'easy' | 'medium' | 'hard'
  }>
>>>>>>> c53144d (Initial commit)
} 