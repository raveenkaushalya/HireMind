import { supabase } from './supabaseClient';

export async function uploadResumeToSupabase(file: File, userId: number | string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `resumes/user_${userId}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('resumes') // Make sure this bucket is created in Supabase Dashboard
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload error: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('resumes')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}