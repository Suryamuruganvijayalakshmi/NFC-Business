'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Profile, 
  ProfileSection, 
  PortfolioProject, 
  SocialLink,
  PostItem,
  WorkExperience,
  EducationItem,
  CertificationItem,
  BusinessEntity,
  ServiceItem,
  LanguageItem
} from '@/lib/types';
import { downloadVCard } from '@/lib/vcard';
import QRCodeModal from '@/components/QRCodeModal';
import { 
  getCurrentUser, 
  getConnectionStatus, 
  sendConnectionRequest, 
  isFollowing, 
  toggleFollow, 
  getPostsByUserId,
  savePublicProfileAsContact,
  toggleLikePost
} from '@/lib/store';
import { sanitizeUrl } from '@/lib/security';
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  QrCode, 
  UserPlus, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  ShieldCheck,
  Wifi,
  Building2,
  MessageCircle,
  FolderGit2,
  CheckCircle2,
  Award,
  Languages as LangIcon,
  Newspaper,
  Heart,
  MessageSquare,
  Building,
  Check,
  Contact,
  Share2,
  ArrowUpRight,
  Send,
  Calendar,
  Clock,
  ChevronRight,
  Compass,
  ArrowLeft,
  Layers,
  Zap,
  Lock
} from 'lucide-react';

interface PremiumIdentityTemplateProps {
  profile: Profile;
  sections?: ProfileSection[];
  projects?: PortfolioProject[];
  links?: SocialLink[];
  onLinkClick?: (linkId: string) => void;
  isPreview?: boolean;
}

export default function PremiumIdentityTemplate({
  profile,
  sections = [],
  projects = [],
  links = [],
  onLinkClick,
  isPreview = false,
}: PremiumIdentityTemplateProps) {
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');
  const [userPosts, setUserPosts] = useState<PostItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [connStatus, setConnStatus] = useState<{ status: string; isRequester: boolean }>({ status: 'none', isRequester: false });
  const [following, setFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedToCRM, setSavedToCRM] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user && profile) {
      setConnStatus(getConnectionStatus(user.id, profile.user_id));
      setFollowing(isFollowing(user.id, profile.user_id));
    }

    if (profile) {
      const posts = getPostsByUserId(profile.user_id);
      setUserPosts(posts);
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleConnect = () => {
    if (!currentUser) {
      window.location.href = `/login?redirect=/u/${profile.username}`;
      return;
    }
    sendConnectionRequest(currentUser, profile);
    setConnStatus({ status: 'pending', isRequester: true });
    showToast(`Connection request sent to ${profile.full_name}!`);
  };

  const handleToggleFollow = () => {
    if (!currentUser) {
      window.location.href = `/login?redirect=/u/${profile.username}`;
      return;
    }
    const isNowFollowing = toggleFollow(currentUser.id, profile.user_id);
    setFollowing(isNowFollowing);
    showToast(isNowFollowing ? `Now following ${profile.full_name}` : `Unfollowed ${profile.full_name}`);
  };

  const handleSaveToCRM = () => {
    if (!currentUser) {
      window.location.href = `/login?redirect=/u/${profile.username}`;
      return;
    }
    const res = savePublicProfileAsContact(currentUser.id, profile, 'SignTap NFC Profile Tap');
    setSavedToCRM(true);
    showToast(res.isNew 
      ? `Saved ${profile.full_name} to your Smart CRM! Check your dashboard.`
      : `Updated ${profile.full_name} in your Smart CRM (NFC tap logged)!`
    );
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Profile link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.full_name} | SignTap Professional Identity`,
          text: `Check out ${profile.full_name}'s digital identity on SignTap NFC:`,
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      setShowQR(true);
    }
  };

  const handleLikePost = (postId: string) => {
    if (!currentUser) {
      window.location.href = `/login?redirect=/u/${profile.username}`;
      return;
    }
    toggleLikePost(postId, currentUser.id);
    setUserPosts(getPostsByUserId(profile.user_id));
  };

  const accentColor = profile.accent_color || '#087CF0';
  const visibleLinks = links.filter(l => l.visible);
  const isOwnProfile = currentUser?.id === profile.user_id;

  // Extract initials for the typographic monogram avatar
  const getInitials = (name: string): string => {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Safe external URLs
  const safeWebsite = sanitizeUrl(profile.website);
  const safePortfolio = sanitizeUrl(profile.portfolio_url);
  const safeResume = sanitizeUrl(profile.resume_url);

  // Dynamic profile sections
  const experiences = profile.experiences || [];
  const education = profile.education || [];
  const certifications = profile.certifications || [];
  const achievements = profile.achievements || [];
  const businesses = profile.businesses || [];
  const services = profile.services || [];
  const languages = profile.languages || [];
  const customLinks = profile.custom_links || [];
  const skills = profile.skills || [];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-[#087CF0] selection:text-white pb-20 relative">
      
      {/* Dynamic Ambient Background Glows */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, ${accentColor} 0%, transparent 45%),
            radial-gradient(circle at 100% 100%, rgba(255, 121, 0, 0.12) 0%, transparent 40%),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px'
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6">
        
        {/* Profile Card Header Container */}
        <div className="relative rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          
          {/* Panoramic Cover Banner */}
          <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-gradient-to-r from-[#0C121E] via-[#141E34] to-[#0C121E]">
            {profile.cover_image ? (
              <img 
                src={profile.cover_image} 
                alt="Profile Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full relative flex items-center justify-center">
                {/* Architectural Grid Overlay */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 35% 50%, ${accentColor} 0%, transparent 55%),
                      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 28px 28px, 28px 28px'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101726] via-transparent to-transparent" />
              </div>
            )}

            {/* Hardware Verified Chip Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white flex items-center gap-1.5 shadow-lg">
                <Wifi className="w-3.5 h-3.5 text-[#087CF0] rotate-90" />
                <span className="font-semibold tracking-wide">SignTap NFC Synced</span>
              </div>
            </div>

            {/* Status Indicator Pill: Available for Collaboration */}
            <div className="absolute top-4 left-4">
              <div className="px-3 py-1 rounded-full bg-[#101726]/80 backdrop-blur-md border border-emerald-500/30 text-[11px] font-medium text-emerald-300 flex items-center gap-2 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Open for Collaboration</span>
              </div>
            </div>
          </div>

          {/* Profile Identity Info Row */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-6">
              
              {/* Avatar: Photo or Typographic Monogram */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-1 bg-gradient-to-tr from-[#087CF0] via-white/20 to-[#FF7900] shadow-[0_0_25px_rgba(8,124,240,0.3)]">
                  {profile.profile_image ? (
                    <img 
                      src={profile.profile_image} 
                      alt={profile.full_name} 
                      className="w-full h-full object-cover rounded-[22px] bg-[#0C121E]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#121A2E] to-[#0A0E18] flex items-center justify-center text-white text-3xl sm:text-4xl font-black tracking-tight border border-white/10 shadow-inner">
                      <span className="bg-gradient-to-tr from-white via-slate-100 to-[#087CF0] bg-clip-text text-transparent">
                        {getInitials(profile.full_name || profile.username)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Verified Hardware Badge icon overlay */}
                <div 
                  className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-[#101726] border border-white/20 text-[#087CF0] shadow-xl flex items-center justify-center"
                  title="Verified SignTap NFC Identity"
                >
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#087CF0]" />
                </div>
              </div>

              {/* Top Right Floating Actions: Share & Save Contact */}
              <div className="flex items-center gap-2.5 sm:self-end">
                <button
                  onClick={handleShare}
                  className="py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                  title="Share Profile or View QR"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#087CF0]" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => setShowQR(true)}
                  className="py-2.5 px-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                  title="Display QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#FF7900]" />
                  <span className="hidden sm:inline">QR Code</span>
                </button>

                <button
                  onClick={() => downloadVCard(profile, links)}
                  style={{ backgroundColor: accentColor }}
                  className="py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center gap-2 hover:opacity-95 transition-all shadow-lg active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Save Contact</span>
                </button>
              </div>
            </div>

            {/* Name, Headline & Metadata */}
            <div className="mt-5 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  {profile.full_name}
                  <ShieldCheck className="w-6 h-6 text-[#087CF0]" />
                </h1>

                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#087CF0]/15 text-[#087CF0] border border-[#087CF0]/30">
                  {profile.profile_type || 'Professional'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10">
                  @{profile.username}
                </span>
              </div>

              {/* Headline */}
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-2xl">
                {profile.headline || profile.title || 'Digital Pioneer & Professional Identity'}
              </p>

              {/* Quick Location & Affiliation Row */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-medium">
                {profile.company && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#FF7900]" />
                    <span className="text-slate-300">{profile.company}</span>
                  </span>
                )}

                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{profile.location}</span>
                  </span>
                )}

                {safeWebsite !== '#' && (
                  <a 
                    href={safeWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#087CF0] hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Connections & Followers Count */}
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold">
                <span className="text-[#087CF0]">
                  {profile.connections_count ?? 0} <span className="text-slate-400 font-normal">connections</span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-200">
                  {profile.followers_count ?? 0} <span className="text-slate-400 font-normal">followers</span>
                </span>
              </div>
            </div>

            {/* Action Command Bar: Connect, Follow, Save to Smart CRM */}
            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {!isOwnProfile ? (
                <>
                  {/* Connect Button */}
                  {connStatus.status === 'connected' ? (
                    <button
                      disabled
                      className="py-3 px-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Connected</span>
                    </button>
                  ) : connStatus.status === 'pending' ? (
                    <button
                      disabled
                      className="py-3 px-4 rounded-xl bg-white/10 text-slate-400 text-xs font-semibold flex items-center justify-center gap-2 cursor-default"
                    >
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Connection Pending</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleConnect}
                      style={{ backgroundColor: accentColor }}
                      className="py-3 px-4 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Connect with {profile.full_name?.split(' ')[0]}</span>
                    </button>
                  )}

                  {/* Follow Button */}
                  <button
                    onClick={handleToggleFollow}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                      following
                        ? 'bg-white/15 text-white border-white/30'
                        : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>{following ? 'Following ✓' : '+ Follow'}</span>
                  </button>

                  {/* 1-Click Save to Smart Networking CRM */}
                  <button
                    onClick={handleSaveToCRM}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      savedToCRM
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500/40 text-indigo-200'
                    }`}
                  >
                    <Contact className="w-4 h-4 text-indigo-400" />
                    <span>{savedToCRM ? 'Saved to CRM ✓' : 'Save to Smart CRM'}</span>
                  </button>
                </>
              ) : (
                <div className="col-span-full flex items-center justify-between p-3 rounded-2xl bg-[#087CF0]/10 border border-[#087CF0]/30 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Sparkles className="w-4 h-4 text-[#087CF0]" />
                    <span>This is your live public identity profile.</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="py-2 px-4 rounded-xl bg-[#087CF0] text-white font-bold hover:bg-[#0668cc] transition-colors"
                  >
                    Open Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs: Profile vs Activity */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#101726] border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-white text-[#101828] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Identity & Career</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'bg-white text-[#101828] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Activity & Insights ({userPosts.length})</span>
          </button>
        </div>

        {/* Tab 1: Profile & Career Showcase */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            {/* 1. About / Narrative Story */}
            {(profile.about || profile.bio) && (
              <section className="p-6 sm:p-8 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#087CF0] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>About</span>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {profile.about || profile.bio}
                </div>
              </section>
            )}

            {/* 2. Skills & Domain Matrix */}
            {skills.length > 0 && (
              <section className="p-6 sm:p-8 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#087CF0] uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Skills & Competencies</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold hover:border-[#087CF0]/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Verified Digital Footprint & Social Links Hub */}
            {visibleLinks.length > 0 && (
              <section className="p-6 sm:p-8 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#087CF0] uppercase tracking-wider">
                  <Globe className="w-4 h-4" />
                  <span>Verified Links & Digital Touchpoints</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {visibleLinks.map((link) => {
                    const safeUrl = sanitizeUrl(link.url);
                    if (safeUrl === '#') return null;
                    return (
                      <a
                        key={link.id}
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onLinkClick?.(link.id)}
                        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#087CF0]/10 border border-[#087CF0]/20 text-[#087CF0] flex items-center justify-center font-bold text-xs uppercase">
                            {link.platform.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-[#087CF0] transition-colors">
                              {link.label || link.platform}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                              {link.url.replace(/^https?:\/\//i, '')}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 4. Career Journey / Timeline (Work Experience) */}
            {experiences.length > 0 && (
              <section className="p-6 sm:p-8 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold text-[#087CF0] uppercase tracking-wider">
                  <Briefcase className="w-4 h-4" />
                  <span>Experience</span>
                </div>
                <div className="space-y-6 border-l-2 border-white/10 pl-4 sm:pl-6 ml-2 sm:ml-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative group">
                      {/* Timeline Node */}
                      <div className="absolute -left-[21px] sm:-left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#101726] border-2 border-[#087CF0]" />
                      
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {exp.title}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                            {exp.start_date} — {exp.is_current ? 'Present' : (exp.end_date || 'Present')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-slate-300">{exp.company}</span>
                          {exp.employment_type && (
                            <>
                              <span>·</span>
                              <span className="text-slate-400">{exp.employment_type}</span>
                            </>
                          )}
                          {exp.location && (
                            <>
                              <span>·</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>

                        {exp.description && (
                          <p className="text-xs text-slate-300 pt-1 leading-relaxed whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}

                        {exp.skills_used && exp.skills_used.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {exp.skills_used.map((sk, sIdx) => (
                              <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#087CF0]/10 text-[#087CF0] border border-[#087CF0]/20 font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Ventures & Organizations (Businesses) */}
            {businesses.length > 0 && (
              <section className="p-6 sm:p-8 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF7900] uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>Ventures & Organizations</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {businesses.map((biz) => {
                    const safeBizUrl = sanitizeUrl(biz.website);
                    return (
                      <div 
                        key={biz.id}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-bold text-white">{biz.name}</h4>
                            {biz.tagline && (
                              <p className="text-xs text-slate-400 mt-0.5">{biz.tagline}</p>
                            )}
                          </div>
                          {biz.industry && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF7900]/15 text-[#FF7900] border border-[#FF7900]/30 flex-shrink-0">
                              {biz.industry}
                            </span>
                          )}
                        </div>

                        {biz.description && (
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {biz.description}
                          </p>
                        )}

                        {safeBizUrl !== '#' && (
                          <a
                            href={safeBizUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087CF0] hover:underline pt-1"
                          >
                            <span>Visit Venture Website</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 6. Services Offered & 1-Click Inquiries */}
            {services.length > 0 && (
              <section className="p-6 sm:p-8 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Services & Collaboration</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((srv, idx) => {
                    const emailSubject = encodeURIComponent(`Inquiry regarding ${srv.title}`);
                    const emailBody = encodeURIComponent(`Hi ${profile.full_name},\n\nI saw your service "${srv.title}" on your SignTap profile and would like to discuss collaboration.\n\nBest regards,`);
                    const mailtoUrl = profile.email ? `mailto:${profile.email}?subject=${emailSubject}&body=${emailBody}` : '#';

                    const cleanWa = profile.whatsapp_number?.replace(/[^0-9]/g, '') || profile.phone?.replace(/[^0-9]/g, '');
                    const waText = encodeURIComponent(`Hi ${profile.full_name}, I saw your service "${srv.title}" on your SignTap profile and would like to connect!`);
                    const waUrl = cleanWa ? `https://wa.me/${cleanWa}?text=${waText}` : '#';

                    return (
                      <div 
                        key={srv.id || idx}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-bold text-white">{srv.title}</h4>
                            {srv.price && (
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                {srv.price}
                              </span>
                            )}
                          </div>
                          {srv.description && (
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {srv.description}
                            </p>
                          )}
                        </div>

                        {/* 1-Click Inquiry Actions */}
                        <div className="pt-2 flex items-center gap-2">
                          {cleanWa && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                          {profile.email && (
                            <a
                              href={mailtoUrl}
                              className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-[#087CF0]" />
                              <span>Email</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 7. Featured Projects Gallery */}
            {projects.length > 0 && (
              <section className="p-6 sm:p-8 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#087CF0] uppercase tracking-wider">
                  <FolderGit2 className="w-4 h-4" />
                  <span>Featured Projects</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((proj) => {
                    const safeProjUrl = sanitizeUrl(proj.project_url);
                    return (
                      <div 
                        key={proj.id}
                        className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all"
                      >
                        {proj.image_url && (
                          <div className="h-36 w-full overflow-hidden bg-black/40">
                            <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                          </div>

                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {proj.technologies.map((tech, tIdx) => (
                                <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                            {safeProjUrl !== '#' && (
                              <a
                                href={safeProjUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087CF0] hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Live Demo</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 8. Education & Certifications */}
            {(education.length > 0 || certifications.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {education.length > 0 && (
                  <section className="p-6 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#087CF0] uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4" />
                      <span>Education</span>
                    </div>
                    <div className="space-y-4">
                      {education.map((edu) => (
                        <div key={edu.id} className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{edu.school}</h4>
                          <p className="text-xs text-slate-300">{edu.degree} · {edu.field_of_study}</p>
                          <p className="text-[11px] font-mono text-slate-500">
                            {edu.start_year} — {edu.end_year || 'Present'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {certifications.length > 0 && (
                  <section className="p-6 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#FF7900] uppercase tracking-wider">
                      <Award className="w-4 h-4" />
                      <span>Licenses & Certifications</span>
                    </div>
                    <div className="space-y-4">
                      {certifications.map((cert) => {
                        const safeCredUrl = sanitizeUrl(cert.credential_url);
                        return (
                          <div key={cert.id} className="space-y-1">
                            <h4 className="text-xs sm:text-sm font-bold text-white">{cert.name}</h4>
                            <p className="text-xs text-slate-300">{cert.issuing_org}</p>
                            <p className="text-[11px] font-mono text-slate-500">
                              Issued {cert.issue_date}
                            </p>
                            {safeCredUrl !== '#' && (
                              <a
                                href={safeCredUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087CF0] hover:underline pt-0.5"
                              >
                                <span>Show Credential</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* 9. Direct Contact & Communication Hub */}
            <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121A2E] to-[#0A0E18] border border-white/10 shadow-2xl space-y-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                    <Send className="w-5 h-5 text-[#087CF0]" />
                    <span>Get in Touch with {profile.full_name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Connect instantly through phone, WhatsApp, or direct email.
                  </p>
                </div>

                <button
                  onClick={() => downloadVCard(profile, links)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#087CF0]" />
                  <span>Download vCard Contact</span>
                </button>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 text-slate-200 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#087CF0] flex-shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </a>
                )}

                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 text-slate-200 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{profile.phone}</span>
                  </a>
                )}

                {profile.whatsapp_number && (
                  <a
                    href={`https://wa.me/${profile.whatsapp_number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 text-slate-200 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">WhatsApp Chat</span>
                  </a>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Activity & Posts */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#101726]/90 border border-white/10 space-y-3">
                <Newspaper className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Public Posts Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {profile.full_name} has not published any announcements or articles yet.
                </p>
              </div>
            ) : (
              userPosts.map((post) => (
                <article 
                  key={post.id}
                  className="p-6 rounded-3xl bg-[#101726]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#087CF0] to-[#FF7900] flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(post.author_name)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{post.author_name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {post.media_url && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 max-h-80 bg-black/40">
                      <img src={post.media_url} alt="Post Attachment" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/10 flex items-center gap-4 text-xs">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 font-semibold transition-colors ${
                        currentUser && post.liked_by?.includes(currentUser.id)
                          ? 'text-rose-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span>{post.likes_count || 0} Likes</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments_count || 0} Comments</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* Footer Brand Attribution */}
        <footer className="pt-10 pb-6 text-center text-xs text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-[#087CF0] rotate-90" />
            <span className="font-semibold text-slate-400">Powered by SignTap NFC</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Contactless Professional Identity Platform ·{' '}
            <Link href="/" className="text-[#087CF0] hover:underline font-medium">
              Create your NFC Smart Card
            </Link>
          </p>
        </footer>
      </main>

      {/* QR Code Modal */}
      {showQR && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          fullName={profile.full_name}
          username={profile.username}
          url={typeof window !== 'undefined' ? window.location.href : undefined}
        />
      )}
    </div>
  );
}
