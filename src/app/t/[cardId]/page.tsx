'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getNFCCardByUID, getAllProfiles, logAnalyticsEvent } from '@/lib/store';
import { Wifi, AlertCircle, ShieldCheck, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

function NFCTapContent() {
  const params = useParams();
  const router = useRouter();
  const cardId = Array.isArray(params?.cardId) ? params.cardId[0] : (params?.cardId as string);

  const [status, setStatus] = useState<'verifying' | 'redirecting' | 'inactive' | 'blocked' | 'unlinked' | 'not_found'>('verifying');
  const [targetUsername, setTargetUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) return;

    // 1. Validate that the card exists
    const card = getNFCCardByUID(cardId);
    
    if (!card) {
      setStatus('not_found');
      return;
    }

    if (card.status === 'blocked') {
      setStatus('blocked');
      return;
    }

    if (card.status === 'inactive') {
      setStatus('inactive');
      return;
    }

    if (card.status === 'pending' || card.status === 'in_production' || !card.profile_id) {
      setStatus('unlinked');
      return;
    }

    // 2. Identify the linked profile
    const profiles = getAllProfiles();
    const linkedProfile = profiles.find(p => p.id === card.profile_id);

    if (!linkedProfile) {
      setStatus('unlinked');
      return;
    }

    // 3. Record an NFC tap event
    logAnalyticsEvent(linkedProfile.id, 'nfc_tap');

    setTargetUsername(linkedProfile.username);
    setStatus('redirecting');

    // 4. Smooth transition redirect to the public profile
    const timer = setTimeout(() => {
      router.replace(`/u/${linkedProfile.username}`);
    }, 700);

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
              <h2 className="text-xl font-bold">Verifying SignBridge NFC...</h2>
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
                <div className="bg-[#087CF0] h-full w-full animate-pulse" />
              </div>
            </>
          )}

          {status === 'blocked' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Card Blocked</h2>
              <p className="text-xs text-slate-400 mt-2">
                This physical NFC card has been reported lost, stolen, or replaced by its cardholder. Contact support if you found this card.
              </p>
              <Link
                href="/contact"
                className="mt-6 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                Report Found Card <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          {status === 'inactive' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Card Inactive</h2>
              <p className="text-xs text-slate-400 mt-2">
                This NFC card is temporarily deactivated in the cardholder&apos;s privacy settings.
              </p>
              <Link
                href="/"
                className="mt-6 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                Go to SignTap Home
              </Link>
            </>
          )}

          {status === 'unlinked' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-[#087CF0]/10 border border-[#087CF0]/30 text-[#087CF0] flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Card Needs Activation</h2>
              <p className="text-xs text-slate-400 mt-2">
                This physical card has been delivered. If this is your card, log in to your dashboard to activate and link it to your profile.
              </p>
              <Link
                href="/dashboard/nfc"
                className="mt-6 py-2.5 px-5 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-500/20"
              >
                Activate Card in Dashboard
              </Link>
            </>
          )}

          {status === 'not_found' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Unregistered Smart Card</h2>
              <p className="text-xs text-slate-400 mt-2">
                The identifier <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded">{cardId}</code> is not provisioned on our network.
              </p>
              <Link
                href="/"
                className="mt-6 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                Visit SignBridge NFC
              </Link>
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
      <div className="min-h-screen flex items-center justify-center bg-[#0C121E]">
        <div className="w-8 h-8 border-2 border-[#087CF0] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NFCTapContent />
    </Suspense>
  );
}
