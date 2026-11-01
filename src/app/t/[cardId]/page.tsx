'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getNFCCardByUID, getAllProfiles, logAnalyticsEvent } from '@/lib/store';
import { Wifi, AlertCircle, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';

function NFCTapContent() {
  const params = useParams();
  const router = useRouter();
  const cardId = Array.isArray(params?.cardId) ? params.cardId[0] : (params?.cardId as string);

  const [status, setStatus] = useState<'verifying' | 'redirecting' | 'inactive' | 'not_found'>('verifying');
  const [targetUsername, setTargetUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) return;

    // 1. Validate that the card exists
    const card = getNFCCardByUID(cardId);
    
    if (!card) {
      setStatus('not_found');
      return;
    }

    if (card.status !== 'active') {
      setStatus('inactive');
      return;
    }

    // 2. Identify the linked profile
    const profiles = getAllProfiles();
    const linkedProfile = profiles.find(p => p.id === card.profile_id);

    if (!linkedProfile) {
      setStatus('not_found');
      return;
    }

    // 4. Record an NFC tap event
    logAnalyticsEvent(linkedProfile.id, 'nfc_tap');

    setTargetUsername(linkedProfile.username);
    setStatus('redirecting');

    // 3. Smooth transition redirect to the public profile
    const timer = setTimeout(() => {
      router.replace(`/id/${linkedProfile.username}`);
    }, 800);

    return () => clearTimeout(timer);
  }, [cardId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0C121E] text-white text-center">
      <div className="max-w-sm w-full p-8 rounded-3xl bg-[#131B2E] border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#087CF0]/20 blur-2xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <Logo theme="dark" size="sm" className="mb-6" />

          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-[#087CF0]/10 border border-[#087CF0]/30 text-[#087CF0] flex items-center justify-center mb-4 animate-pulse">
                <Wifi className="w-8 h-8 rotate-90" />
              </div>
              <h2 className="text-xl font-bold">Verifying SignBridge Card...</h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">UID: {cardId}</p>
            </>
          )}

          {status === 'redirecting' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Smart Card Authenticated</h2>
              <p className="text-xs text-emerald-400 mt-1">Connecting to @{targetUsername}&apos;s profile...</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-6 overflow-hidden">
                <div className="bg-[#087CF0] h-full animate-[shimmerWave_1s_infinite_linear]" style={{ width: '100%' }} />
              </div>
            </>
          )}

          {status === 'inactive' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold">Card Inactive</h2>
              <p className="text-xs text-slate-400 mt-2">
                This NFC card has been temporarily deactivated by its cardholder.
              </p>
              <Link
                href="/"
                className="mt-6 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15"
              >
                Go to SignBridge Home
              </Link>
            </>
          )}

          {status === 'not_found' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold">Unassigned Card</h2>
              <p className="text-xs text-slate-400 mt-2">
                Card <span className="font-mono text-white">{cardId}</span> is not linked to an active digital identity profile yet.
              </p>
              <div className="mt-6 flex flex-col gap-2 w-full">
                <Link
                  href="/dashboard/nfc"
                  className="py-2.5 px-4 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc]"
                >
                  Link Card in Dashboard
                </Link>
                <Link
                  href="/"
                  className="py-2 px-4 rounded-xl border border-white/10 text-slate-400 text-xs hover:text-white"
                >
                  Return to Homepage
                </Link>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default function NFCTapRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0C121E] text-white text-center">
        <p className="text-xs text-slate-400 font-mono">Verifying card...</p>
      </div>
    }>
      <NFCTapContent />
    </Suspense>
  );
}
