'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getProfileByUserId, getOrCreateProfileForUser } from '@/lib/store';

export default function DashboardProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace('/login');
      return;
    }
    const profile = getProfileByUserId(user.id) || getOrCreateProfileForUser(user);
    if (profile?.username) {
      router.replace(`/u/${profile.username}?edit=basic`);
    } else {
      router.replace('/feed');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F2EE]">
      <div className="w-8 h-8 border-2 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
