import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const src = searchParams.get('src');

    if (!src) {
      return NextResponse.json({ error: 'Missing src parameter' }, { status: 400 });
    }

    // Create a Supabase client with service role key for admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Extract bucket and path from the URL
    const urlParts = src.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'public' || part === 'authenticated');

    if (bucketIndex === -1 || bucketIndex + 1 >= urlParts.length) {
      return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 });
    }

    const bucket = urlParts[bucketIndex + 1];
    const path = urlParts.slice(bucketIndex + 2).join('/');

    // Generate a signed URL valid for 1 hour
    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, 3600);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (error: any) {
    console.error('Error in image API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
