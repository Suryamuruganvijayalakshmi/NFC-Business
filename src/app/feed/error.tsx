'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';

export default function FeedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.warn('SignTap Feed boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-64"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(105, 105, 245, 0.14), rgba(232, 224, 255, 0.25) 55%, transparent 100%)',
        }}
      />
      <div className="relative max-w-md w-full bg-white border border-[#E8E8EF] rounded-3xl p-8 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#6969F5]/10 text-[#6969F5] flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#202124]">Refreshing your SignTap Feed</h2>
        <p className="text-xs text-[#777783] mt-1.5 leading-relaxed">
          We hit a brief hiccup loading your feed data. Tap below to reload cleanly.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => {
              reset();
              if (typeof window !== 'undefined') window.location.reload();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6969F5] hover:bg-[#5858E0] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Feed
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F7F7FB] hover:bg-[#EFEFF7] text-[#202124] text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
