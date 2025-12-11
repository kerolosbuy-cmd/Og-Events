import { supabase } from './supabase';

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder The folder path within the bucket
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  bucket: string = 'Payment',
  folder: string = 'payment-proofs'
): Promise<{ url: string | null; error: string | null }> => {
  try {
    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Generate a unique file name
    const fileExt = file.name.split('.').pop();

    // Create user-specific folder if authenticated, otherwise use a temporary folder
    const userFolder = session ? session.user.id : 'temp';
    const fileName = `${folder}/${userFolder}/${Date.now()}.${fileExt}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Error uploading file:', error);
      let errorMessage = error.message;

      // Provide more user-friendly error messages
      if (error.message.includes('row-level security policy')) {
        errorMessage = 'Permission denied. You may not have permission to upload files.';
      }

      return { url: null, error: errorMessage };
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error during file upload:', error);
    return { url: null, error: 'An unexpected error occurred during file upload' };
  }
};
