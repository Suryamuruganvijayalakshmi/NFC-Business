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
  getProjectsByProfileId,
  getPendingRequests,
  acceptConnectionRequest,
  declineConnectionRequest,
  getConnectionsForUser,
  getAllPosts
} from '@/lib/store';
import { Profile, AnalyticsSummary, NFCCard, Connection, PostItem } from '@/lib/types';
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
  Users2, 
  Newspaper, 
  Building, 
  Plus, 
  UserCheck, 
  UserX, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  MessageSquare, 
  Compass,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [cards, setCards] = useState<NFCCard[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [recentPosts, setRecentPosts] = useState<PostItem[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
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

      const pending = getPendingRequests(user.id);
      setPendingRequests(pending);

      const conns = getConnectionsForUser(user.id);
      setConnectionsCount(p.connections_count || conns.length || 548);

      const posts = getAllPosts();
      setRecentPosts(posts.slice(0, 3));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAcceptRequest = (connId: string, name: string) => {
    acceptConnectionRequest(connId);
    showToast(`Connected with ${name}!`);
    loadData();
  };

  const handleDeclineRequest = (connId: string) => {
    declineConnectionRequest(connId);
    showToast('Connection request dismissed.');
    loadData();
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#087CF0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Profile completion meter calculation
  const completionChecks = [
    { label: 'Full Name & Professional Headline', done: Boolean(profile.full_name && (profile.headline || profile.title)) },
    { label: 'Profile Avatar & Cover Banner', done: Boolean(profile.profile_image && profile.cover_image) },
    { label: 'About / Summary', done: Boolean(profile.about || (profile.bio && profile.bio.length > 20)) },
    { label: 'Work Experience', done: Boolean(profile.experiences && profile.experiences.length > 0) },
    { label: 'Education History', done: Boolean(profile.education && profile.education.length > 0) },
    { label: 'Skills & Expertise (at least 3)', done: Boolean(profile.skills && profile.skills.length >= 3) },
    { label: 'Certifications or Licenses', done: Boolean(profile.certifications && profile.certifications.length > 0) },
    { label: 'Business Identity or Services', done: Boolean((profile.businesses && profile.businesses.length > 0) || (profile.services && profile.services.length > 0)) },
  ];

  const completedCount = completionChecks.filter(c => c.done).length;
  const completionPercent = Math.round((completedCount / completionChecks.length) * 100);

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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Hero Identity Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-[#101828] via-[#1A253A] to-[#101828] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Live Professional Identity · NFC Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <span>Welcome back, {profile.full_name}</span>
            <ShieldCheck className="w-6 h-6 text-[#087CF0]" />
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {profile.headline || profile.title || 'Digital Identity Pioneer & NFC Innovator'}
          </p>

          <p className="text-xs text-slate-400">
            Public Profile: <code className="text-[#087CF0] bg-white/10 px-2 py-0.5 rounded font-mono">/u/{profile.username}</code> · Instant sync to your physical NFC card
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-2.5">
            <a
              href={`/u/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>Preview Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/10 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied URL' : 'Copy Profile Link'}</span>
            </button>

            <button
              onClick={() => setShowQR(true)}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/10 active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>Share NFC QR</span>
            </button>

            <Link
              href="/dashboard/activity"
              className="py-2.5 px-4 rounded-xl bg-[#FF7900] hover:bg-[#e06b00] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write a Post</span>
            </Link>
          </div>
        </div>

        {/* Quick NFC Badge Visual on Right */}
        <div className="relative z-10 flex-shrink-0 flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-[#087CF0]/50 bg-slate-800">
            <img 
              src={profile.profile_image} 
              alt={profile.full_name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Wifi className="w-3.5 h-3.5 text-[#087CF0] rotate-90" />
              <span>NTAG216 Chip Synced</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              {primaryCard ? primaryCard.card_uid : 'SB-NFC-9842'}
            </p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">
              ● Ready for Contactless Tap
            </p>
          </div>
        </div>

        {/* Ambient Top Right Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#087CF0]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Professional Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Profile Views */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#087CF0]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Views</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#087CF0] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#101828] mt-3">
            {analytics?.total_views || 42}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-600 font-semibold">+18%</span> from this week
          </p>
        </div>

        {/* NFC Card Taps */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#FF7900]/30 transition-all">
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
            Physical card touches via contactless
          </p>
        </div>

        {/* Professional Connections */}
        <Link 
          href="/dashboard/network"
          className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#087CF0]/40 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#087CF0] transition-colors">
              Connections
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#101828] mt-3 flex items-center justify-between">
            <span>{connectionsCount}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#087CF0] transition-colors" />
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {pendingRequests.length > 0 ? (
              <span className="text-[#087CF0] font-semibold">{pendingRequests.length} pending request(s)</span>
            ) : (
              'Verified professional network'
            )}
          </p>
        </Link>

        {/* Followers & Activity Impressions */}
        <Link 
          href="/dashboard/activity"
          className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#923cf6]/40 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#923cf6] transition-colors">
              Followers & Posts
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#923cf6] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#101828] mt-3 flex items-center justify-between">
            <span>{profile.followers_count || 1290}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#923cf6] transition-colors" />
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Total active audience following updates
          </p>
        </Link>
      </div>

      {/* 3. Pending Connection Requests Alert (LinkedIn-style) */}
      {pendingRequests.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#087CF0] text-white flex items-center justify-center">
                <Users2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#101828]">
                Pending Connection Requests ({pendingRequests.length})
              </h2>
            </div>
            <Link 
              href="/dashboard/network" 
              className="text-xs font-semibold text-[#087CF0] hover:underline"
            >
              Manage all requests
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={req.requester_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'} 
                    alt={req.requester_name}
                    className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#101828] truncate">
                      {req.requester_name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {req.requester_headline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleAcceptRequest(req.id, req.requester_name)}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    title="Accept Connection"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Accept</span>
                  </button>

                  <button
                    onClick={() => handleDeclineRequest(req.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                    title="Dismiss"
                  >
                    <UserX className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Profile Completion Progress & Quick Workspace Tools */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Strength Progress Meter */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Strength</span>
                <h2 className="text-lg font-bold text-[#101828] mt-0.5">
                  {completionPercent === 100 ? 'All-Star Professional Profile' : `${completionPercent}% Complete`}
                </h2>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                completionPercent >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-[#087CF0]'
              }`}>
                {completionPercent >= 80 ? 'All-Star' : 'Intermediate'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#087CF0] to-[#FF7900] h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            {/* Checklist of Profile Items */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-slate-500">
                Complete these sections to maximize your NFC tap impact and discoverability:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {completionChecks.map((check, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80">
                    {check.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    )}
                    <span className={check.done ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <p className="text-xs text-slate-500">
                {completedCount} of {completionChecks.length} sections completed
              </p>
              <Link
                href="/dashboard/profile"
                className="text-xs font-semibold text-[#087CF0] hover:text-[#0668cc] flex items-center gap-1"
              >
                <span>Edit Profile Sections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Workspace Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/dashboard/profile"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#087CF0]/50 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#087CF0] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#101828]">Work Experience</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Manage roles & career</p>
              </div>
            </Link>

            <Link
              href="/dashboard/business"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#FF7900]/50 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF7900] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#101828]">Business Entities</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Showcase ventures</p>
              </div>
            </Link>

            <Link
              href="/dashboard/network"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#101828]">Grow Network</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Discover professionals</p>
              </div>
            </Link>

            <Link
              href="/dashboard/activity"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-500/50 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#923cf6] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Newspaper className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#101828]">Publish Post</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Milestones & updates</p>
              </div>
            </Link>
          </div>

          {/* Recent Professional Activity Feed Preview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#923cf6] flex items-center justify-center">
                  <Newspaper className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[#101828]">
                  Recent Network Activity
                </h2>
              </div>

              <Link
                href="/dashboard/activity"
                className="text-xs font-semibold text-[#087CF0] hover:underline"
              >
                View all posts
              </Link>
            </div>

            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={post.author_image} 
                        alt={post.author_name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#101828]">{post.author_name}</h4>
                        <p className="text-[10px] text-slate-400">{post.author_headline}</p>
                      </div>
                    </div>

                    {post.media_type && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-[#087CF0]">
                        {post.media_type}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200/40">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>{post.likes_count} likes</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.comments_count} comments</span>
                      </span>
                    </div>

                    <Link 
                      href="/dashboard/activity" 
                      className="font-semibold text-[#087CF0] hover:underline"
                    >
                      Join discussion
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Physical NFC Card Status & Discover Professionals */}
        <div className="space-y-6">
          
          {/* Active NFC Card Widget */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Paired NFC Smart Card
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                {primaryCard?.status || 'Activated'}
              </span>
            </div>

            {/* Visual NFC Card Representation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#101828] to-[#1e293b] text-white space-y-4 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono tracking-widest text-[#087CF0] font-bold">
                  SIGNTAP PRO
                </span>
                <Wifi className="w-4 h-4 text-white rotate-90" />
              </div>

              <div>
                <p className="text-sm font-bold truncate">{profile.full_name}</p>
                <p className="text-[10px] text-slate-300 truncate font-mono mt-0.5">
                  UID: {primaryCard?.card_uid || 'SB-NFC-9842'}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>NTAG216 CHIP</span>
                <span className="text-emerald-400 font-semibold">{analytics?.total_nfc_taps || 28} Total Taps</span>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Cardholder:</span>
                <span className="font-semibold text-slate-900">{profile.full_name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Direct NFC Route:</span>
                <span className="font-mono text-[#087CF0]">/u/{profile.username}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <Link
                href="/dashboard/nfc"
                className="text-xs font-semibold text-[#087CF0] hover:text-[#0668cc]"
              >
                Manage NFC Cards →
              </Link>
              <button
                onClick={() => setShowQR(true)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5 text-[#FF7900]" />
                <span>Show QR</span>
              </button>
            </div>
          </div>

          {/* Quick Discover Spotlight */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-[#101828] text-white shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#087CF0]" />
              <h2 className="text-sm font-bold text-white">
                Discover Professionals
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Expand your network by searching verified founders, engineers, designers, and investors equipped with SignTap NFC identity.
            </p>

            <Link
              href="/discover"
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-white/10"
            >
              <span>Explore Professional Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* QR Modal */}
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
