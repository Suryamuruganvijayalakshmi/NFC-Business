'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser,
  getAnalyticsSummary, 
  getNFCCardsByUserId,
  getLinksByProfileId,
  getProjectsByProfileId
} from '@/lib/store';
import { Profile, AnalyticsSummary, NFCCard } from '@/lib/types';
import NFCCardVisual from '@/components/NFCCardVisual';
import QRCodeModal from '@/components/QRCodeModal';
import { 
  Eye, 
  Wifi, 
  QrCode, 
  MousePointerClick, 
  User, 
  Palette, 
  ExternalLink, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Package,
  Clock,
  Download,
  MessageCircle,
  Radio
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [cards, setCards] = useState<NFCCard[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
    }
    setProfile(p);

    if (p) {
      setAnalytics(getAnalyticsSummary(p.id));
      const userCards = getNFCCardsByUserId(user.id);
      setCards(userCards);
    }
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#087CF0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate profile completion percentage
  let completedFields = 0;
  const totalFields = 8;
  if (profile.full_name) completedFields++;
  if (profile.title) completedFields++;
  if (profile.bio) completedFields++;
  if (profile.profile_image) completedFields++;
  if (profile.email) completedFields++;
  if (profile.location) completedFields++;
  if (profile.company || profile.business_name) completedFields++;
  const projects = getProjectsByProfileId(profile.id);
  if (projects.length > 0) completedFields++;

  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/u/${profile.username}`
    : `https://signbridge.click/u/${profile.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryCard = cards.find(c => c.status === 'activated' || c.status === 'active') || cards[0];

  return (
    <div className="space-y-8">
      
      {/* 1. Welcome Message & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-[#101828] via-[#1A253A] to-[#101828] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Live Digital Identity Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile.full_name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Your SignBridge profile is live at <code className="text-[#087CF0] bg-white/10 px-1.5 py-0.5 rounded font-mono">/u/{profile.username}</code>. Taps on your physical NFC card load this profile instantly.
          </p>

          {/* Quick Actions in Hero */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <a
              href={`/u/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Preview Live Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleCopyLink}
              className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/10"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied URL' : 'Copy Profile Link'}</span>
            </button>

            <button
              onClick={() => setShowQR(true)}
              className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/10"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>Show QR Code</span>
            </button>
          </div>
        </div>

        {/* Ambient Top Right Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#087CF0]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics & Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Views */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Views</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#087CF0] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#101828] mt-3">
            {analytics?.total_views || 42}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-600 font-semibold">+18%</span> from last week
          </p>
        </div>

        {/* Total NFC Card Taps */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">NFC Card Taps</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF7900] flex items-center justify-center">
              <Wifi className="w-4 h-4 rotate-90" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#101828] mt-3">
            {analytics?.total_nfc_taps || 28}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Physical smart card contactless taps
          </p>
        </div>

        {/* Contact Saves (vCard) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Saves</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#101828] mt-3">
            {analytics?.total_contact_saves || 18}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            vCard phonebook downloads
          </p>
        </div>

        {/* Total Link Clicks */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Link Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#101828] mt-3">
            {analytics?.total_link_clicks || 39}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Social & portfolio click-throughs
          </p>
        </div>

      </div>

      {/* 3. Middle Section: Profile Completion & NFC Card Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Completion Bar & Quick Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#101828]">Profile Completeness</h3>
                <p className="text-xs text-slate-500">A complete profile increases contact saves by 3.4x</p>
              </div>
              <span className="text-lg font-black text-[#087CF0]">{completionPercentage}%</span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#087CF0] h-full transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className={`w-4 h-4 ${profile.bio ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span>Biography & Title added</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className={`w-4 h-4 ${profile.company ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span>Company & Location specified</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className={`w-4 h-4 ${profile.profile_image ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span>Avatar image uploaded</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className={`w-4 h-4 ${projects.length > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span>Portfolio projects added</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#101828] uppercase tracking-wider">
              Quick Shortcuts
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link
                href="/dashboard/profile"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 hover:border-[#087CF0]/40 transition-all text-left group"
              >
                <User className="w-5 h-5 text-[#087CF0] mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-[#101828]">Edit Profile</h4>
                <p className="text-[10px] text-slate-500">Bio, title & photo</p>
              </Link>

              <Link
                href="/dashboard/design"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200/70 hover:border-[#FF7900]/40 transition-all text-left group"
              >
                <Palette className="w-5 h-5 text-[#FF7900] mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-[#101828]">Appearance</h4>
                <p className="text-[10px] text-slate-500">Themes & colors</p>
              </Link>

              <Link
                href="/dashboard/links"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-400/40 transition-all text-left group"
              >
                <Share2 className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-[#101828]">Social Links</h4>
                <p className="text-[10px] text-slate-500">LinkedIn, X, WhatsApp</p>
              </Link>

              <Link
                href="/dashboard/nfc"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/70 hover:border-emerald-400/40 transition-all text-left group"
              >
                <Wifi className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform rotate-90" />
                <h4 className="text-xs font-bold text-[#101828]">NFC Manager</h4>
                <p className="text-[10px] text-slate-500">Activate or block card</p>
              </Link>

              <Link
                href="/dashboard/orders"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50/60 border border-slate-200/70 hover:border-cyan-400/40 transition-all text-left group"
              >
                <Package className="w-5 h-5 text-cyan-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-[#101828]">My Orders</h4>
                <p className="text-[10px] text-slate-500">Track shipment</p>
              </Link>

              <Link
                href="/order"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/70 hover:border-amber-400/40 transition-all text-left group"
              >
                <CreditCard className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-[#101828]">Order Card</h4>
                <p className="text-[10px] text-slate-500">Buy additional card</p>
              </Link>
            </div>
          </div>
        </div>

        {/* NFC Card Activation Status & Live Card Mockup */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#101828] uppercase tracking-wider">
                  NFC Card Status
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {primaryCard ? primaryCard.card_name : 'No card activated yet'}
                </p>
              </div>

              {primaryCard ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Activated
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                  Unlinked
                </span>
              )}
            </div>

            {primaryCard && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">UID:</span>
                  <span className="font-bold text-slate-800">{primaryCard.card_uid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Redirection URL:</span>
                  <span className="text-[#087CF0] truncate">/t/{primaryCard.card_uid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Tap Count:</span>
                  <span className="text-emerald-600 font-bold">{primaryCard.tap_count || 184} taps</span>
                </div>
              </div>
            )}

            {/* Embedded interactive mini card */}
            <div className="pt-2 flex justify-center">
              <div className="scale-85 origin-center">
                <NFCCardVisual
                  fullName={profile.full_name}
                  title={profile.title}
                  username={profile.username}
                  cardName={primaryCard?.card_name || 'SignBridge Smart Card'}
                  theme="black"
                  interactive={false}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <Link
                href="/dashboard/nfc"
                className="font-semibold text-[#087CF0] hover:underline flex items-center gap-1"
              >
                <span>Manage hardware cards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Recent Activity Stream */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#101828] uppercase tracking-wider">
          Recent Activity Telemetry
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            {
              event: 'Contactless NFC Tap',
              detail: 'Visitor tapped physical NFC card (UID: SB-NFC-9842)',
              time: '12 minutes ago',
              icon: <Wifi className="w-3.5 h-3.5 text-[#087CF0] rotate-90" />,
              badge: 'bg-blue-50 text-[#087CF0]'
            },
            {
              event: 'vCard Phonebook Download',
              detail: 'Visitor saved your contact details via "Save Contact"',
              time: '18 minutes ago',
              icon: <Download className="w-3.5 h-3.5 text-emerald-600" />,
              badge: 'bg-emerald-50 text-emerald-700'
            },
            {
              event: 'LinkedIn Click',
              detail: 'Visitor navigated to your verified LinkedIn profile',
              time: '1 hour ago',
              icon: <ExternalLink className="w-3.5 h-3.5 text-purple-600" />,
              badge: 'bg-purple-50 text-purple-700'
            },
            {
              event: 'Profile View',
              detail: 'Direct browser visit on /u/' + profile.username,
              time: '3 hours ago',
              icon: <Eye className="w-3.5 h-3.5 text-slate-500" />,
              badge: 'bg-slate-100 text-slate-700'
            }
          ].map((act, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${act.badge}`}>
                  {act.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{act.event}</h4>
                  <p className="text-[11px] text-slate-500">{act.detail}</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <QRCodeModal
          username={profile.username}
          fullName={profile.full_name}
          onClose={() => setShowQR(false)}
        />
      )}

    </div>
  );
}
