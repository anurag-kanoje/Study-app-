import { supabase } from '../lib/supabase';
import type { Profile, StudyGroup, StudyGroupMember, StudyMaterial, Tag, StudyMaterialTag, VideoGeneration } from '../lib/supabase';

export const supabaseService = {
  supabase, // Expose the Supabase client

  // Profile operations
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  // Study Groups operations
  async getStudyGroups() {
    const { data, error } = await supabase
      .from('study_groups')
      .select(`
        *,
        study_group_members!inner(user_id)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (StudyGroup & { study_group_members: StudyGroupMember[] })[];
  },

  async createStudyGroup(group: Omit<StudyGroup, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('study_groups')
      .insert(group)
      .select()
      .single();
    
    if (error) throw error;
    return data as StudyGroup;
  },

  async joinStudyGroup(groupId: string, userId: string) {
    const { error } = await supabase
      .from('study_group_members')
      .insert({ group_id: groupId, user_id: userId });
    
    if (error) throw error;
  },

  // Study Materials operations
  async getStudyMaterials(groupId?: string) {
    let query = supabase
      .from('study_materials')
      .select(`
        *,
        study_material_tags(
          tag:tags(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (groupId) {
      query = query.eq('group_id', groupId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as (StudyMaterial & { study_material_tags: { tag: Tag }[] })[];
  },

  async createStudyMaterial(material: Omit<StudyMaterial, 'id' | 'created_at' | 'updated_at'>, tags?: string[]) {
    const { data: materialData, error: materialError } = await supabase
      .from('study_materials')
      .insert(material)
      .select()
      .single();
    
    if (materialError) throw materialError;

    if (tags && tags.length > 0) {
      // Create tags if they don't exist
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .upsert(
          tags.map(name => ({ name })),
          { onConflict: 'name' }
        )
        .select();
      
      if (tagError) throw tagError;

      // Create material-tag relationships
      const { error: relationError } = await supabase
        .from('study_material_tags')
        .insert(
          tagData.map(tag => ({
            material_id: materialData.id,
            tag_id: tag.id
          }))
        );
      
      if (relationError) throw relationError;
    }

    return materialData as StudyMaterial;
  },

  // Video Generation operations
  async createVideoGeneration(generation: Omit<VideoGeneration, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('video_generations')
      .insert(generation)
      .select()
      .single();
    
    if (error) throw error;
    return data as VideoGeneration;
  },

  async updateVideoGeneration(id: string, updates: Partial<VideoGeneration>) {
    const { data, error } = await supabase
      .from('video_generations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as VideoGeneration;
  },

  async getVideoGenerations(userId: string) {
    const { data, error } = await supabase
      .from('video_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as VideoGeneration[];
  },

  // Real-time subscriptions
  subscribeToStudyGroup(groupId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`study_group_${groupId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'study_materials',
        filter: `group_id=eq.${groupId}`,
      }, callback)
      .subscribe();
  },

  subscribeToVideoGenerations(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`video_generations_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'video_generations',
        filter: `user_id=eq.${userId}`,
      }, callback)
      .subscribe();
  },
}; 