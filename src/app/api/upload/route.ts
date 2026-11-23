import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tzqpsxtjfgkmqsxrtlgx.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_5lDEIb-SirWekMpfsr8xaw_5hbj5z_X';

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * POST /api/upload
 * Handles file uploads for profile pictures, post media, and documents.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'media';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in upload request.' },
        { status: 400 }
      );
    }

    // 10MB size limit
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum allowed limit of 10MB.' },
        { status: 400 }
      );
    }

    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Try Supabase Storage upload
    const supabase = getSupabase();
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(cleanFileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        if (urlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            fileName: cleanFileName,
            size: file.size,
            type: file.type,
          });
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage bucket upload note:', storageErr);
    }

    // Fallback: Return optimized base64 Data URL
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: cleanFileName,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error('API /api/upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
