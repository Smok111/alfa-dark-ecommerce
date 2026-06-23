import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to use Supabase Storage.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      }
    });
  }

  async uploadFile(file: Express.Multer.File, bucket: string = 'products') {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      throw new InternalServerErrorException(`Failed to upload file to Supabase: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
      path: filePath
    };
  }

  async deleteFile(path: string, bucket: string = 'products') {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new InternalServerErrorException(`Failed to delete file from Supabase: ${error.message}`);
    }

    return { success: true };
  }
}