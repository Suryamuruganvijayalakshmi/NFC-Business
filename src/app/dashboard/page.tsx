'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/store';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace('/login');
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
