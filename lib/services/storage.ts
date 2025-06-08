import { supabase } from '../supabase';
import { config } from '../config';

export class StorageService {
  static async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    userId: string
  ): Promise<string> {
    try {
      const filePath = `${userId}/${fileName}`;
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, fileBuffer, {
          contentType,
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  static async getFile(fileName: string, userId: string): Promise<Buffer> {
    try {
      const filePath = `${userId}/${fileName}`;
      const { data, error } = await supabase.storage
        .from('uploads')
        .download(filePath);

      if (error) throw error;

      return Buffer.from(await data.arrayBuffer());
    } catch (error) {
      console.error('Error getting file:', error);
      throw new Error('Failed to get file');
    }
  }

  static async deleteFile(fileName: string, userId: string): Promise<void> {
    try {
      const filePath = `${userId}/${fileName}`;
      const { error } = await supabase.storage
        .from('uploads')
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  static async uploadStudyMaterial(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    metadata: {
      subject: string;
      topic: string;
      userId: string;
    }
  ): Promise<string> {
    try {
      const filePath = `study-materials/${metadata.userId}/${fileName}`;
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, fileBuffer, {
          contentType,
          cacheControl: '3600',
          upsert: true,
          metadata
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading study material:', error);
      throw new Error('Failed to upload study material');
    }
  }

  static async listFiles(userId: string): Promise<Array<{ name: string; url: string; type: string }>> {
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .list(userId, {
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const filesWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(`${userId}/${file.name}`);

          return {
            name: file.name,
            url: publicUrl,
            type: file.metadata?.mimetype || 'application/octet-stream'
          };
        })
      );

      return filesWithUrls;
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list files');
    }
  }
} 