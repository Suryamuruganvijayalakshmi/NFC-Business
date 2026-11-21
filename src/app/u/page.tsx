'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientProfilePage from './[username]/ClientProfilePage';

export default function UniversalProfileFallback() {
  const router = useRouter();
  const [hasPathUsername, setHasPathUsername] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const match = pathname.match(/^\/u\/([^/?#]+)/i);
      if (match && match[1] && match[1] !== '_shell' && match[1] !== 'undefined') {
        setHasPathUsername(true);
      } else {
        setHasPathUsername(false);
        router.replace('/discover');
      }
    }
  }, [router]);

  if (hasPathUsername) {
    return <ClientProfilePage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C121E]">
      <div className="w-8 h-8 border-2 border-[#087CF0] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

