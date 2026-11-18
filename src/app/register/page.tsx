'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/signup');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
      <div className="w-8 h-8 border-2 border-[#087CF0] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

