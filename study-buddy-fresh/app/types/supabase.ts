export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'student' | 'parent' | 'teacher'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'student' | 'parent' | 'teacher'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'student' | 'parent' | 'teacher'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string | null
          duration: number | null
          subject: string
          topic: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time?: string
          end_time?: string | null
          duration?: number | null
          subject: string
          topic: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          duration?: number | null
          subject?: string
          topic?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          subject: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          subject: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          subject?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      study_groups: {
        Row: {
          id: string
          name: string
          description: string
          owner_id: string
          subject: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          owner_id: string
          subject: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          owner_id?: string
          subject?: string
          created_at?: string
        }
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
          role: 'member' | 'admin'
          joined_at: string
        }
        Insert: {
          group_id: string
          user_id: string
          role?: 'member' | 'admin'
          joined_at?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          role?: 'member' | 'admin'
          joined_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
