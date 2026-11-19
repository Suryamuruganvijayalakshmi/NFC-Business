import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://tzqpsxtjfgkmqsxrtlgx.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_5lDEIb-SirWekMpfsr8xaw_5hbj5z_X';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseUrl.startsWith('https://')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
