import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Initialize Supabase client
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type StudyGroup = {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type StudyGroupMember = {
  group_id: string;
  user_id: string;
  joined_at: string;
};

export type StudyMaterial = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  created_by: string;
  group_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Tag = {
  id: string;
  name: string;
  created_at: string;
};

export type StudyMaterialTag = {
  material_id: string;
  tag_id: string;
};

export type VideoGeneration = {
  id: string;
  user_id: string;
  prompt: string;
  script: string | null;
  video_url: string | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}; 