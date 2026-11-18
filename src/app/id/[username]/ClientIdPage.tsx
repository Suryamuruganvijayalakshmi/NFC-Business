'use client';

import React, { useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';

function IdRedirectContent() {
  const params = useParams();
  const router = useRouter();
  const username = Array.isArray(params?.username) ? params.username[0] : (params?.username as string);

  useEffect(() => {
    if (username) {
      router.replace(`/u/${username}`);
    }
  }, [username, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB]">
      <div className="w-10 h-10 border-3 border-[#923cf6] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs text-slate-500 font-mono">Redirecting to SignTap Identity...</p>
    </div>
  );
}

export default function ClientIdPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
        <div className="w-8 h-8 border-2 border-[#923cf6] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <IdRedirectContent />
    </Suspense>
  );
}

