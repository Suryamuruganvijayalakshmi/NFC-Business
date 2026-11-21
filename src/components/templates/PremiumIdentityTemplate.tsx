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
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';
import Logo from '@/components/Logo';
import { 
  getCurrentUser, 
  getConnectionStatus, 
  sendConnectionRequest, 
  isFollowing, 
  toggleFollow, 
  getPostsByUserId,
  savePublicProfileAsContact,
  toggleLikePost,
  getAllProfiles
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
  Crown,
  Search,
  LayoutDashboard,
  MoreHorizontal,
  Compass,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle,
  Zap,
  Info
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
  profile: initialProfile,
  sections = [],
  projects = [],
  links = [],
  onLinkClick,
  isPreview = false,
}: PremiumIdentityTemplateProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [showQR, setShowQR] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [userPosts, setUserPosts] = useState<PostItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [connStatus, setConnStatus] = useState<{ status: string; isRequester: boolean }>({ status: 'none', isRequester: false });
  const [following, setFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedToCRM, setSavedToCRM] = useState(false);
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'posts'>('all');

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

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

      // Load suggested other verified profiles for the sidebar
      const all = getAllProfiles();
      const others = all
        .filter(p => p.id !== profile.id && p.published !== false)
        .slice(0, 4);
      setSuggestedProfiles(others);
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
          title: `${profile.full_name} | SignTap Professional Profile`,
          text: `Connect with ${profile.full_name} on SignTap NFC:`,
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

  const isOwnProfile = currentUser?.id === profile.user_id;
  const isPremium = Boolean(profile.is_premium);

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
  const skills = profile.skills || [];
  const visibleLinks = links.filter(l => l.visible);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 font-sans selection:bg-[#087CF0] selection:text-white flex flex-col justify-between">
      
      {/* 1. Full-Width Clean LinkedIn-Style Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Search */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Logo theme="light" size="sm" />
            </Link>

            <div className="hidden md:flex items-center bg-slate-100/80 hover:bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200 text-xs text-slate-500 w-64 transition-colors">
              <Search className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <span>Search professionals or cards...</span>
            </div>
          </div>

          {/* Navigation Links & Dashboard CTA */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link 
              href="/discover"
              className="text-xs font-semibold text-slate-600 hover:text-[#087CF0] transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover</span>
            </Link>

            {currentUser ? (
              <Link
                href="/dashboard"
                className="py-1.5 px-3.5 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>My Workspace</span>
              </Link>
            ) : (
              <Link
                href={`/login?redirect=/u/${profile.username}`}
                className="py-1.5 px-3.5 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Full-Screen Layout Container (2 Columns: Main Feed + Sidebar) */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ================================================================ */}
          {/* LEFT / CENTER MAIN COLUMN (8 of 12 columns)                      */}
          {/* ================================================================ */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Top Primary Profile Card (LinkedIn Style) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              
              {/* Cover Banner */}
              <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
                {profile.cover_image ? (
                  <img 
                    src={profile.cover_image} 
                    alt="Cover Banner" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                )}

                {/* NFC Touchpoint Status Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-slate-200">
                    <Wifi className="w-3.5 h-3.5 text-[#087CF0] rotate-90" />
                    <span>NFC Smart Card Synced</span>
                  </div>
                </div>
              </div>

              {/* Profile Details Header Section */}
              <div className="px-5 sm:px-7 pb-6 pt-0 relative">
                
                {/* Avatar and Top Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-3">
                  
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-white ring-4 ${isPremium ? 'ring-amber-400 shadow-lg shadow-amber-200/50' : 'ring-white shadow-md'}`}>
                      {profile.profile_image ? (
                        <img 
                          src={profile.profile_image} 
                          alt={profile.full_name} 
                          className="w-full h-full object-cover rounded-full bg-slate-100"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#087CF0] to-sky-400 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
                          {getInitials(profile.full_name || profile.username)}
                        </div>
                      )}
                    </div>

                    {/* Verified Shield Overlay */}
                    <div 
                      className="absolute bottom-1 right-1 p-1.5 rounded-full bg-white shadow-md border border-slate-100 text-[#087CF0]" 
                      title="Verified SignTap Identity"
                    >
                      <ShieldCheck className="w-5 h-5 text-[#087CF0] fill-[#087CF0]/10" />
                    </div>
                  </div>

                  {/* Header Quick Buttons */}
                  <div className="flex items-center gap-2 self-center sm:self-end">
                    <button
                      onClick={handleShare}
                      className="py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Share Profile"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => setShowQR(true)}
                      className="py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="View QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5 text-slate-500" />
                      <span>QR</span>
                    </button>

                    <button
                      onClick={() => downloadVCard(profile, links)}
                      className="py-1.5 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#087CF0]" />
                      <span>Save Contact</span>
                    </button>
                  </div>
                </div>

                {/* Identity Name, Badges & Headline */}
                <div className="space-y-1.5 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      {profile.full_name}
                      <ShieldCheck className="w-6 h-6 text-[#087CF0] flex-shrink-0" />
                    </h1>

                    {/* Golden Premium Badge */}
                    {isPremium ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-black tracking-wide shadow-xs uppercase">
                        <Crown className="w-3 h-3 fill-white" />
                        <span>PREMIUM</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowPremiumModal(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-bold transition-colors cursor-pointer"
                        title="Click to upgrade to Premium"
                      >
                        <Crown className="w-3 h-3 text-amber-600" />
                        <span>Get Premium ₹1,000/yr</span>
                      </button>
                    )}

                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      @{profile.username}
                    </span>
                  </div>

                  {/* Headline */}
                  <p className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
                    {profile.headline || profile.title || 'Digital Pioneer & Professional Identity'}
                  </p>

                  {/* Metadata Row: Company, Location, Contact Info */}
                  <div className="pt-1 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                    {profile.company && (
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{profile.company}</span>
                      </span>
                    )}

                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{profile.location}</span>
                      </span>
                    )}

                    {safeWebsite !== '#' && (
                      <a 
                        href={safeWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#087CF0] hover:underline font-semibold"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Contact info &amp; website</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Network stats */}
                  <div className="pt-2 flex items-center gap-3 text-xs font-semibold">
                    <span className="text-[#087CF0] hover:underline cursor-pointer">
                      {profile.connections_count ?? 0} connections
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-600">
                      {profile.followers_count ?? 0} followers
                    </span>
                  </div>
                </div>

                {/* Primary Action Row: Connect, Follow, Smart CRM */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                  {!isOwnProfile ? (
                    <>
                      {/* Connect Button */}
                      {connStatus.status === 'connected' ? (
                        <button
                          disabled
                          className="py-2 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Connected</span>
                        </button>
                      ) : connStatus.status === 'pending' ? (
                        <button
                          disabled
                          className="py-2 px-4 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Pending</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleConnect}
                          className="py-2 px-5 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Connect</span>
                        </button>
                      )}

                      {/* Follow Button */}
                      <button
                        onClick={handleToggleFollow}
                        className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                          following
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        <span>{following ? 'Following ✓' : '+ Follow'}</span>
                      </button>

                      {/* 1-Click Save to Smart CRM */}
                      <button
                        onClick={handleSaveToCRM}
                        className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          savedToCRM
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                        }`}
                      >
                        <Contact className="w-3.5 h-3.5" />
                        <span>{savedToCRM ? 'Saved to CRM ✓' : 'Save to Smart CRM'}</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                      <span className="text-slate-700 font-medium">This is your live public SignTap profile visible to everyone.</span>
                      <Link
                        href="/dashboard/profile"
                        className="py-1.5 px-3 rounded-lg bg-[#087CF0] text-white font-bold hover:bg-[#0668cc] transition-colors"
                      >
                        Edit Profile
                      </Link>
                    </div>
                  )}
                </div>

                {/* LinkedIn-style Open To Work / Collaboration Card */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Open to collaboration &amp; new opportunities</span>
                    </p>
                    <p className="text-slate-500 mt-0.5">
                      Available for full-time, consulting, or strategic partnership discussions.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadVCard(profile, links)}
                    className="text-[#087CF0] hover:underline font-bold whitespace-nowrap"
                  >
                    Get in touch
                  </button>
                </div>
              </div>
            </div>

            {/* About Card */}
            {(profile.about || profile.bio) && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  About
                </h2>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {profile.about || profile.bio}
                </div>
              </div>
            )}

            {/* Featured Projects Card */}
            {projects.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Featured Portfolio
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">{projects.length} projects</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {projects.map((proj) => {
                    const safeProjUrl = sanitizeUrl(proj.project_url);
                    return (
                      <div 
                        key={proj.id}
                        className="rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-all flex flex-col justify-between bg-slate-50/50"
                      >
                        <div className="space-y-2">
                          {proj.image_url && (
                            <div className="h-32 w-full rounded-lg overflow-hidden bg-slate-200">
                              <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{proj.description}</p>
                        </div>

                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {proj.technologies.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {safeProjUrl !== '#' && (
                          <div className="pt-3 border-t border-slate-200/60 mt-3">
                            <a
                              href={safeProjUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#087CF0] hover:underline"
                            >
                              <span>View Project</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Experience Timeline Card */}
            {experiences.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Experience
                </h2>

                <div className="space-y-6">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id || idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#087CF0] flex items-center justify-center flex-shrink-0 font-bold text-base shadow-xs">
                        <Briefcase className="w-5 h-5" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {exp.title}
                        </h3>

                        <p className="text-xs font-semibold text-slate-700">
                          {exp.company} {exp.employment_type && `· ${exp.employment_type}`}
                        </p>

                        <p className="text-[11px] text-slate-500 font-medium">
                          {exp.start_date} — {exp.is_current ? 'Present' : (exp.end_date || 'Present')} {exp.location && `· ${exp.location}`}
                        </p>

                        {exp.description && (
                          <p className="text-xs text-slate-600 pt-1 leading-relaxed whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}

                        {exp.skills_used && exp.skills_used.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {exp.skills_used.map((sk, sIdx) => (
                              <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Card */}
            {education.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Education
                </h2>

                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900">{edu.school}</h3>
                        <p className="text-xs text-slate-600">{edu.degree} · {edu.field_of_study}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {edu.start_year} — {edu.end_year || 'Present'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Licenses & Certifications Card */}
            {certifications.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Licenses &amp; Certifications
                </h2>

                <div className="space-y-4">
                  {certifications.map((cert) => {
                    const safeCertUrl = sanitizeUrl(cert.credential_url);
                    return (
                      <div key={cert.id} className="flex gap-4">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <h3 className="text-sm font-bold text-slate-900">{cert.name}</h3>
                          <p className="text-xs text-slate-600">{cert.issuing_org}</p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            Issued {cert.issue_date}
                          </p>
                          {safeCertUrl !== '#' && (
                            <a
                              href={safeCertUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#087CF0] hover:underline pt-1"
                            >
                              <span>Show Credential</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Skills & Endorsements Card */}
            {skills.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Skills &amp; Expertise
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services Offered Card */}
            {services.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Services &amp; Consultation
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {services.map((srv, idx) => {
                    const cleanWa = profile.whatsapp_number?.replace(/[^0-9]/g, '') || profile.phone?.replace(/[^0-9]/g, '');
                    const waText = encodeURIComponent(`Hi ${profile.full_name}, I saw your service "${srv.title}" on SignTap and want to inquire!`);
                    const waUrl = cleanWa ? `https://wa.me/${cleanWa}?text=${waText}` : '#';

                    return (
                      <div key={srv.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{srv.title}</h3>
                            {srv.price && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                {srv.price}
                              </span>
                            )}
                          </div>
                          {srv.description && (
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{srv.description}</p>
                          )}
                        </div>

                        <div className="pt-2">
                          {cleanWa ? (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Inquire on WhatsApp</span>
                            </a>
                          ) : profile.email ? (
                            <a
                              href={`mailto:${profile.email}?subject=Inquiry on ${srv.title}`}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087CF0] hover:underline"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Send Inquiry Email</span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Activity & Posts Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Activity &amp; Posts
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {profile.followers_count ?? 0} followers
                  </p>
                </div>

                {isOwnProfile && (
                  <Link
                    href="/dashboard/activity"
                    className="py-1.5 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Create a post
                  </Link>
                )}
              </div>

              {userPosts.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-1">
                  <Newspaper className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">No posts published yet</p>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  {userPosts.map((post) => (
                    <div key={post.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-[#087CF0] flex items-center justify-center font-bold text-xs">
                          {getInitials(post.author_name)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{post.author_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      {post.media_url && (
                        <div className="rounded-xl overflow-hidden max-h-72 border border-slate-200">
                          <img src={post.media_url} alt="Attachment" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200/60 flex items-center gap-4 text-xs">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 font-semibold transition-colors ${
                            currentUser && post.liked_by?.includes(currentUser.id)
                              ? 'text-rose-600'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                          <span>{post.likes_count || 0} Likes</span>
                        </button>

                        <span className="flex items-center gap-1.5 text-slate-500">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments_count || 0} Comments</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ================================================================ */}
          {/* RIGHT SIDEBAR COLUMN (4 of 12 columns)                           */}
          {/* ================================================================ */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. SignTap Premium Membership Upgrade Widget */}
            <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Crown className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black tracking-wide uppercase text-amber-900">
                      SignTap Premium
                    </h3>
                    <p className="text-[11px] text-amber-700 font-bold">
                      ₹1,000 / year
                    </p>
                  </div>
                </div>

                {isPremium && (
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold uppercase">
                    Active
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isPremium ? (
                  'You have unlocked verified Golden Crown credentials, priority NFC tap routing, and unlimited Smart CRM contacts.'
                ) : (
                  'Stand out with the verified Golden Crown badge, unlimited NFC chip reprogramming, and see who viewed your identity.'
                )}
              </p>

              {!isPremium ? (
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Crown className="w-3.5 h-3.5 fill-white" />
                  <span>Upgrade to Premium (₹1,000/yr)</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-100/60 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-700" />
                  <span>Annual Membership Verified</span>
                </div>
              )}
            </div>

            {/* 2. Physical NFC Hardware Card Widget */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#087CF0] rotate-90" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    SignTap NFC Touchpoint
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ONLINE
                </span>
              </div>

              {/* NFC Card Graphic */}
              <div className="h-28 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 p-4 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider">
                    <Wifi className="w-3.5 h-3.5 text-[#087CF0] rotate-90" />
                    <span>SIGNTAP SMART</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">13.56 MHz</span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-200">{profile.full_name}</p>
                    <p className="text-[10px] font-mono text-slate-400">@{profile.username}</p>
                  </div>
                  <div className="w-6 h-6 rounded bg-amber-400/20 border border-amber-400/50 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Connect your physical NFC card to instantly transfer this profile to any smartphone with a single tap.
              </p>

              <Link
                href="/explore-cards"
                className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Get a Physical NFC Card</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* 3. Verified Digital Links & Social Footprint */}
            {visibleLinks.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Social Links &amp; Touchpoints
                </h3>

                <div className="space-y-2">
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
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-blue-50 text-[#087CF0] flex items-center justify-center font-bold text-[10px] uppercase flex-shrink-0">
                            {link.platform.slice(0, 2)}
                          </span>
                          <span className="font-semibold text-slate-800 truncate">
                            {link.label || link.platform}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Suggested Connections / People Also Viewed */}
            {suggestedProfiles.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  People You May Know
                </h3>

                <div className="space-y-3">
                  {suggestedProfiles.map((person) => (
                    <div key={person.id} className="flex items-center justify-between gap-3 text-xs">
                      <Link 
                        href={`/u/${person.username}`}
                        className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {person.profile_image ? (
                            <img src={person.profile_image} alt={person.full_name} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(person.full_name)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{person.full_name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{person.headline || person.title || 'Professional'}</p>
                        </div>
                      </Link>

                      <Link
                        href={`/u/${person.username}`}
                        className="py-1 px-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-slate-700 transition-colors flex-shrink-0"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Direct QR Code Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3 text-center">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Scan to Save Profile
              </h3>
              <p className="text-[11px] text-slate-500">
                Point any smartphone camera at this QR code to open {profile.full_name}&apos;s profile.
              </p>
              <button
                onClick={() => setShowQR(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#087CF0]" />
                <span>Display Full QR Code</span>
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo theme="light" size="sm" />
            <span>· Contactless Professional Identity Platform</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Powered by SignTap NFC ·{' '}
            <Link href="/explore-cards" className="text-[#087CF0] hover:underline font-semibold">
              Get your Smart Card
            </Link>
          </p>
        </div>
      </footer>

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

      {/* SignTap Premium Membership Upgrade Modal (₹1,000 / year) */}
      {showPremiumModal && (
        <PremiumUpgradeModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          profile={profile}
          onSuccess={() => {
            setProfile(prev => ({
              ...prev,
              is_premium: true,
              premium_plan: 'yearly',
              premium_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            }));
            showToast('Congratulations! SignTap Premium Membership activated.');
          }}
        />
      )}
    </div>
  );
}
