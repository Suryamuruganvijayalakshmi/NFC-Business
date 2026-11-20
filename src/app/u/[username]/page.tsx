import { Metadata } from 'next';
import ClientProfilePage from './ClientProfilePage';
import { INITIAL_PROFILES } from '@/lib/initialData';
import { Profile } from '@/lib/types';
import { createClient } from '@supabase/supabase-js';

export async function generateStaticParams() {
  const baseUsernames = [
    'surya',
    'elena',
    'alex',
    'marcus',
    'vmsurya2007',
    'signbridge.aiauto',
    'suryamuruganvijayalakshmi',
    '_shell',
  ];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tzqpsxtjfgkmqsxrtlgx.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_5lDEIb-SirWekMpfsr8xaw_5hbj5z_X';
    const client = createClient(supabaseUrl, supabaseKey);
    const { data } = await client.from('profiles').select('username').eq('published', true);
    if (data && data.length > 0) {
      const dbUsernames = data.map(p => p.username?.toLowerCase().trim()).filter(Boolean);
      const all = Array.from(new Set([...baseUsernames, ...dbUsernames]));
      return all.map(username => ({ username }));
    }
  } catch (err) {
    console.warn('generateStaticParams error:', err);
  }

  return baseUsernames.map(username => ({ username }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = (username || '').toLowerCase().trim();

  let profile: Profile | undefined = INITIAL_PROFILES.find(
    p => p.username.toLowerCase() === cleanUsername
  );

  if (!profile && cleanUsername !== '_shell') {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tzqpsxtjfgkmqsxrtlgx.supabase.co';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_5lDEIb-SirWekMpfsr8xaw_5hbj5z_X';
      const client = createClient(supabaseUrl, supabaseKey);
      const { data } = await client
        .from('profiles')
        .select('*')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (data) {
        profile = data as Profile;
      }
    } catch {
      // Fallback to generic metadata
    }
  }

  if (!profile || cleanUsername === '_shell') {
    return {
      title: 'SignTap Professional Identity | Contactless NFC Profiles',
      description: 'Official SignTap digital identity and professional network. Tap NFC card or scan QR code to connect.',
      openGraph: {
        title: 'SignTap Professional Identity',
        description: 'Official SignTap digital identity and professional network. Tap NFC card or scan QR code to connect.',
        siteName: 'SignTap',
        images: [{ url: 'https://nfc.signbridge.click/images/nfc-smart-card.webp', width: 1200, height: 630 }],
      }
    };
  }

  const title = `${profile.full_name} | SignTap Professional Profile`;
  const headline = profile.headline || profile.title || 'Digital Pioneer & Professional';
  const description = `${headline} · Connect with ${profile.full_name} on SignTap via contactless NFC or direct link. View experience, verified portfolio & contact details.`;
  const ogImage = profile.profile_image || profile.cover_image || 'https://nfc.signbridge.click/images/nfc-smart-card.webp';

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${profile.full_name} — ${headline} | SignTap`,
      description: description,
      url: `https://nfc.signbridge.click/u/${profile.username}`,
      siteName: 'SignTap Professional Identity',
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: profile.full_name,
        }
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.full_name} | SignTap`,
      description: description,
      images: [ogImage],
    }
  };
}

export default function PublicProfilePage() {
  return <ClientProfilePage />;
}
