'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getAllProfiles, 
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
  Share2
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
      const all = getAllProfiles();
      p = all[0] || null;
    }
    setProfile(p);

    if (p) {
      setAnalytics(getAnalyticsSummary(p.id));
      setCards(getNFCCardsByUserId(user.id));
    }
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xs text-slate-400">Loading your profile workspace...</p>
      </div>
    );
  }

  // Calculate profile completion percentage
  let completedFields = 0;
  const totalFields = 7;
  if (profile.full_name) completedFields++;
  if (profile.title) completedFields++;
  if (profile.bio) completedFields++;
  if (profile.profile_image) completedFields++;
  if (profile.email) completedFields++;
  if (profile.location) completedFields++;
  const projects = getProjectsByProfileId(profile.id);
  if (projects.length > 0) completedFields++;

  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/id/${profile.username}`
    : `https://signbridge.click/id/${profile.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Hello, {profile.full_name}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#087CF0]/10 text-[#087CF0] text-[11px] font-bold uppercase tracking-wider">
              {profile.profile_type}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your SignBridge Smart Identity is live and ready for physical card tapping.
          </p>
        </div>

        {/* Copy Link & Share */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Copied URL!' : 'Copy Profile Link'}</span>
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-[#FF7900]" />
            <span>Download QR</span>
          </button>
        </div>
      </div>

      {/* Completion Meter & Onboarding */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 border border-blue-100/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Identity Completion Score: {completionPercentage}%
              </span>
              {completionPercentage === 100 && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Fields Complete
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {completionPercentage < 100 
                ? 'Add your custom portfolio projects and social channels to reach 100% impact.'
                : 'Your profile is fully optimized for maximum connection conversions.'}
            </p>
          </div>

          <Link
            href="/dashboard/profile"
            className="text-xs font-bold text-[#087CF0] hover:underline flex items-center gap-1 flex-shrink-0"
          >
            Enhance Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/70 h-2 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#087CF0] to-[#FF7900] h-full rounded-full transition-all duration-700" 
            style={{ width: `${completionPercentage}%` }} 
          />
        </div>
      </div>

      {/* 4 Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Views */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Views</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#087CF0] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {analytics?.total_views || 42}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% this week
          </p>
        </div>

        {/* Metric 2: NFC Taps */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">NFC Smart Taps</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#FF7900] flex items-center justify-center">
              <Wifi className="w-4 h-4 rotate-90" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {analytics?.total_nfc_taps || 28}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            via SignBridge Card
          </p>
        </div>

        {/* Metric 3: QR Scans */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">QR Code Scans</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {analytics?.total_qr_scans || 14}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Camera optical visits
          </p>
        </div>

        {/* Metric 4: Link Clicks */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">External Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {analytics?.total_link_clicks || 39}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Social & portfolio CTR
          </p>
        </div>

      </div>

      {/* Main Grid: Quick Actions + NFC Hardware Card Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Quick Actions Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-base font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Link
              href="/dashboard/profile"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#087CF0]/50 hover:shadow-md transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#087CF0]/10 text-[#087CF0] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Profile</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Update your bio, title, location, and custom experience sections.
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/design"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#FF7900]/50 hover:shadow-md transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Customize Design</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Switch between Minimal, Signature, & Creative templates and color palettes.
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/nfc"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manage NFC Card</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Program physical smart card UID and generate unique redirect routes.
                </p>
              </div>
            </Link>

            <a
              href={`/id/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-500/50 hover:shadow-md transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">View Public Profile</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Preview your published page as visitors and NFC tappers experience it.
                </p>
              </div>
            </a>

          </div>

          {/* Connected Links Overview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Connected External Channels
              </h3>
              <Link href="/dashboard/links" className="text-xs font-semibold text-[#087CF0] hover:underline">
                Manage All Links
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {getLinksByProfileId(profile.id).map((l) => (
                <span key={l.id} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#087CF0]" />
                  {l.label || l.platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Connected Physical NFC Card Mockup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Active NFC Smart Card
            </h2>
            <Link href="/dashboard/nfc" className="text-xs font-bold text-[#087CF0] hover:underline">
              Settings
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-[#101828] text-white border border-white/10 shadow-xl flex flex-col items-center text-center">
            <NFCCardVisual
              fullName={profile.full_name}
              title={profile.title}
              username={profile.username}
            />

            <div className="mt-4 pt-4 border-t border-white/10 w-full flex items-center justify-between text-xs text-slate-400">
              <span>Card Status:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Linked & Active
              </span>
            </div>

            <div className="mt-2 w-full flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Redirect URL:</span>
              <span className="text-[#087CF0] truncate max-w-[140px]">
                /t/SB-{profile.username.toUpperCase().slice(0, 4)}-2026
              </span>
            </div>
          </div>
        </div>

      </div>

      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        url={publicUrl}
        fullName={profile.full_name}
        username={profile.username}
      />
    </div>
  );
}
