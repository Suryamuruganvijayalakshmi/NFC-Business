import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tzqpsxtjfgkmqsxrtlgx.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_5lDEIb-SirWekMpfsr8xaw_5hbj5z_X';

/**
 * DELETE /api/account/delete
 * Authenticates the bearer token, removes the user's profile/CRM/posts data,
 * and deletes the auth user if SUPABASE_SERVICE_ROLE_KEY is configured.
 */
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Authentication token required.' }, { status: 401 });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ success: false, error: 'Invalid or expired session.' }, { status: 401 });
    }

    const userId = userData.user.id;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const dbClient = serviceKey ? createClient(SUPABASE_URL, serviceKey) : userClient;

    // Delete user-owned records
    await dbClient.from('smart_contacts').delete().eq('owner_user_id', userId);
    await dbClient.from('contact_follow_ups').delete().eq('owner_user_id', userId);
    await dbClient.from('contact_interactions').delete().eq('owner_user_id', userId);
    await dbClient.from('posts').delete().eq('author_user_id', userId);
    await dbClient.from('profiles').delete().eq('user_id', userId);

    if (serviceKey) {
      const { error: adminErr } = await createClient(SUPABASE_URL, serviceKey).auth.admin.deleteUser(userId);
      if (adminErr) {
        return NextResponse.json(
          { success: false, error: `Profile deleted, but auth deletion failed: ${adminErr.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      authDeleted: Boolean(serviceKey),
      message: serviceKey
        ? 'Account and profile permanently deleted.'
        : 'Profile data removed. Full auth record deletion requires SUPABASE_SERVICE_ROLE_KEY.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Account deletion failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

