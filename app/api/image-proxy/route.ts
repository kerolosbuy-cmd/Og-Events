import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL parameter is required' }, { status: 400 });
    }

    // Extract bucket and path from the full URL
    // URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    // Or: https://[project-ref].supabase.co/storage/v1/object/authenticated/[bucket]/[path]
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'public' || part === 'authenticated');

    if (bucketIndex === -1 || bucketIndex + 1 >= urlParts.length) {
      return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 });
    }

    const bucket = urlParts[bucketIndex + 1];
    const path = urlParts.slice(bucketIndex + 2).join('/');

    // Generate a signed URL that's valid for 1 hour
    const { data, error } = await supabaseService.storage.from(bucket).createSignedUrl(path, 3600); // 3600 seconds = 1 hour

    if (error) {
      console.error('Error creating signed URL:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Redirect to the signed URL
    return NextResponse.redirect(data.signedUrl);
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
