'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import { QRCodeSVG } from 'qrcode.react';
import {
  getCurrentUser,
  getProfileByUserId,
  getAllProfiles,
  recordContactExchange,
  getContactExchangesForUser,
  sendConnectionRequest,
} from '@/lib/store';
import { Profile, ContactExchange, ExchangeMethod, UserSession } from '@/lib/types';
import {
  Wifi,
  QrCode,
  Link2,
  Hash,
  CheckCircle2,
  Copy,
  Check,
  UserPlus,
  Clock,
  Sparkles,
  ArrowRight,
  Smartphone,
} from 'lucide-react';

function ConnectContent() {
  const searchParams = useSearchParams();
  const targetUsername = searchParams.get('with');
  const eventId = searchParams.get('event') || undefined;
  const eventName = searchParams.get('eventName') || undefined;
  const methodParam = (searchParams.get('method') as ExchangeMethod) || 'qr';

  const [user, setUser] = useState<UserSession | null>(null);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [targetProfile, setTargetProfile] = useState<Profile | null>(null);
  const [exchanges, setExchanges] = useState<ContactExchange[]>([]);
  const [shortCodeInput, setShortCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<string | null>(null);
  const [exchangeFeedback, setExchangeFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const loadData = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const profiles = getAllProfiles();

    if (currentUser) {
      const p = getProfileByUserId(currentUser.id);
      setMyProfile(p);
      setExchanges(getContactExchangesForUser(currentUser.id));
    }

    if (targetUsername) {
      const found = profiles.find((p) => p.username.toLowerCase() === targetUsername.toLowerCase());
      if (found) setTargetProfile(found);
    }
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, [targetUsername]);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://signtap.click';
  const myConnectUrl = myProfile
    ? `${origin}/connect?with=${myProfile.username}&method=qr${eventId ? `&event=${encodeURIComponent(eventId)}` : ''}`
    : `${origin}/connect`;

  const handleConfirmExchange = (target: Profile, method: ExchangeMethod = methodParam) => {
    if (!myProfile) {
      setExchangeFeedback({ ok: false, msg: 'Please sign in to confirm and save contact exchanges.' });
      return;
    }
    const { duplicate } = recordContactExchange(myProfile, target, method, eventId, eventName);
    sendConnectionRequest(myProfile, target);
    setExchanges(getContactExchangesForUser(myProfile.user_id));
    setExchangeFeedback({
      ok: true,
      msg: duplicate
        ? `Already exchanged with ${target.full_name} recently — saved in your Smart CRM.`
        : `Exchanged identities with ${target.full_name}! Saved to your Smart CRM & connection request sent.`,
    });
  };

  const handleCodeLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = shortCodeInput.trim().toLowerCase().replace(/^@/, '');
    if (!clean) return;
    const found = getAllProfiles().find((p) => p.username.toLowerCase() === clean);
    if (found) {
      setTargetProfile(found);
      setExchangeFeedback(null);
    } else {
      setExchangeFeedback({ ok: false, msg: `No SignTap member found for handle "@${clean}".` });
    }
  };

  const handleStartWebNfc = async () => {
    if (!('NDEFReader' in window)) {
      setNfcStatus('Web NFC is only supported on Chrome for Android. Use QR or Shareable Link on this device.');
      return;
    }
    try {
      setNfcStatus('Hold your device near a SignTap NFC card or peer device...');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ndef.onreading = (event: any) => {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          if (record.recordType === 'url') {
            const url = decoder.decode(record.data);
            setNfcStatus(`Detected SignTap Card URL: ${url}`);
            window.location.href = url;
            return;
          }
        }
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to start NFC scan.';
      setNfcStatus(msg);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(myConnectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 pb-20 md:pb-12">
      <LinkedInNavbar />
      <main className="max-w-5xl mx-auto px-4 pt-20 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6969F5] bg-blue-50 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> SignTap Connect
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              Instant Real-World Identity Exchange
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Exchange verified profiles via NFC tap, QR scan, shareable link, or member handle — with automatic Smart CRM saving.
            </p>
          </div>
          {eventName && (
            <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
              Event Context: {eventName}
            </div>
          )}
        </div>

        {exchangeFeedback && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${
              exchangeFeedback.ok
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{exchangeFeedback.msg}</span>
          </div>
        )}

        {/* Mutual Reveal Card when a target user is scanned/selected */}
        {targetProfile && (
          <div className="bg-white rounded-2xl border-2 border-[#6969F5]/30 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={targetProfile.profile_image || '/images/default-avatar.png'}
                  alt={targetProfile.full_name}
                  className="w-16 h-16 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{targetProfile.full_name}</h2>
                  <p className="text-xs text-slate-600">{targetProfile.headline || targetProfile.title}</p>
                  <p className="text-xs text-[#6969F5] font-semibold mt-0.5">@{targetProfile.username}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleConfirmExchange(targetProfile, methodParam)}
                  className="px-4 py-2 rounded-full bg-[#6969F5] hover:bg-[#5858E6] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Confirm Exchange & Save to CRM
                </button>
                <Link
                  href={`/u/${targetProfile.username}`}
                  className="px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  View Full Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My QR & Shareable Link */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4">
              <QrCode className="w-4 h-4 text-[#6969F5]" />
              <span>Your SignTap Connect QR</span>
            </div>

            {myProfile ? (
              <>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <QRCodeSVG value={myConnectUrl} size={180} fgColor="#0f172a" level="M" />
                </div>
                <p className="text-xs text-slate-500 mt-3 max-w-xs">
                  Ask someone to scan this QR with their phone camera to reveal your profile and exchange contacts.
                </p>
                <div className="mt-4 w-full flex items-center gap-2">
                  <input
                    readOnly
                    value={myConnectUrl}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 space-y-3">
                <p className="text-sm text-slate-600">Sign in to generate your personal SignTap Connect QR & NFC link.</p>
                <Link
                  href="/login"
                  className="inline-block px-5 py-2 rounded-full bg-[#6969F5] text-white text-xs font-bold"
                >
                  Sign In to Connect
                </Link>
              </div>
            )}
          </div>

          {/* NFC Tap & Short Code Lookup */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#6969F5] rotate-90" />
                  NFC Tap Reader
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {nfcSupported ? 'Web NFC Ready' : 'Fallback Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Tap a physical SignTap NFC card directly to any iOS/Android phone, or start an active Web NFC read on supported Android browsers.
              </p>
              <button
                onClick={handleStartWebNfc}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                {nfcSupported ? 'Scan Nearby NFC Card' : 'Check Device NFC Support'}
              </button>
              {nfcStatus && <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">{nfcStatus}</p>}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#6969F5]" />
                Exchange by Handle / Code
              </h2>
              <form onSubmit={handleCodeLookup} className="flex gap-2">
                <input
                  type="text"
                  value={shortCodeInput}
                  onChange={(e) => setShortCodeInput(e.target.value)}
                  placeholder="Enter username (e.g. surya, elena)"
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#6969F5]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6969F5] text-white text-xs font-bold cursor-pointer"
                >
                  Find
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Exchange History */}
        {user && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Recent Contact Exchanges ({exchanges.length})
              </h2>
              <Link href="/dashboard/contacts" className="text-xs font-semibold text-[#6969F5] hover:underline">
                Open Private CRM →
              </Link>
            </div>

            {exchanges.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">
                No contact exchanges recorded yet. Scan a QR code, tap an NFC card, or enter a member handle above.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {exchanges.map((ex) => {
                  const isInitiator = ex.initiator_user_id === user.id;
                  const peerName = isInitiator ? ex.recipient_name : ex.initiator_name;
                  const peerUsername = isInitiator ? ex.recipient_username : ex.initiator_username;
                  const peerHeadline = isInitiator ? ex.recipient_headline : ex.initiator_headline;
                  return (
                    <div key={ex.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <Link href={`/u/${peerUsername}`} className="text-sm font-bold text-slate-900 hover:text-[#6969F5]">
                          {peerName}
                        </Link>
                        <p className="text-xs text-slate-500">{peerHeadline || `@${peerUsername}`}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Method: <span className="uppercase font-semibold">{ex.method}</span>
                          {ex.event_name ? ` · Event: ${ex.event_name}` : ''} · {new Date(ex.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        href={`/u/${peerUsername}`}
                        className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Profile
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFFFF]" />}>
      <ConnectContent />
    </Suspense>
  );
}

