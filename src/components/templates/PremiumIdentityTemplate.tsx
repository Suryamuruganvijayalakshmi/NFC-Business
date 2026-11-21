'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import LinkedInChatWidget from '@/components/chat/LinkedInChatWidget';
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
  getAllProfiles,
  getAnalyticsSummary,
  getUnreadMessageCount,
  getNewMemberStatus
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
  Info,
  Home,
  Users2,
  Bell,
  Camera,
  Lock,
  BarChart2,
  TrendingUp,
  X,
  CreditCard,
  Sliders,
  ChevronDown
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
  const [showContactModal, setShowContactModal] = useState(false);
  const [userPosts, setUserPosts] = useState<PostItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [connStatus, setConnStatus] = useState<{ status: string; isRequester: boolean }>({ status: 'none', isRequester: false });
  const [following, setFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedToCRM, setSavedToCRM] = useState(false);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  
  // Real-time Chat drawer state
  const [chatTargetUser, setChatTargetUser] = useState<Profile | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  // Global LinkedIn search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user) {
      setUnreadMsgCount(getUnreadMessageCount(user.id));
    }

    if (user && profile) {
      setConnStatus(getConnectionStatus(user.id, profile.user_id));
      setFollowing(isFollowing(user.id, profile.user_id));
    }

    if (profile) {
      const posts = getPostsByUserId(profile.user_id);
      setUserPosts(posts);

      // Load all profiles for global search and suggested network
      const all = getAllProfiles();
      setAllProfiles(all);
      const others = all
        .filter(p => p.id !== profile.id && p.published !== false)
        .slice(0, 5);
      setSuggestedProfiles(others);
    }
  }, [profile]);

  // Click outside listener for search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  const newMemberStatus = getNewMemberStatus(profile.created_at, 20);

  // Extract initials for avatar
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

  // Dynamic sections
  const experiences = profile.experiences || [];
  const education = profile.education || [];
  const certifications = profile.certifications || [];
  const achievements = profile.achievements || [];
  const businesses = profile.businesses || [];
  const services = profile.services || [];
  const skills = profile.skills || [];
  const visibleLinks = links.filter(l => l.visible);

  // Search filter
  const searchResults = searchQuery.trim()
    ? allProfiles.filter(p => 
        p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const currentRole = experiences.find(e => e.is_current) || experiences[0];
  const primarySchool = education[0];

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 font-sans selection:bg-[#087CF0] selection:text-white flex flex-col justify-between">
      
      {/* 1. Global LinkedIn Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* Logo & Working Search Bar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md" ref={searchRef}>
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#087CF0] flex items-center justify-center text-white font-black text-lg shadow-sm">
                S
              </div>
            </Link>

            {/* Global Search Input */}
            <div className="relative flex-1">
              <div className="flex items-center bg-slate-100 hover:bg-slate-200/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#087CF0]/40 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#087CF0] text-xs text-slate-700 transition-all">
                <Search className="w-3.5 h-3.5 mr-2 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, role, company..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="bg-transparent w-full text-xs text-slate-900 focus:outline-none placeholder-slate-400"
                />
              </div>

              {/* Live Search Results Dropdown */}
              {isSearchFocused && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in">
                  <div className="p-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    SignTap Community Results
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No professionals found matching &ldquo;{searchQuery}&rdquo;
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {searchResults.map((res) => {
                        const resNewStatus = getNewMemberStatus(res.created_at, 20);
                        return (
                          <div 
                            key={res.id} 
                            className="p-2.5 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                          >
                            <Link 
                              href={`/u/${res.username}`} 
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center gap-2.5 min-w-0 flex-1"
                            >
                              <div className={`relative w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-700 ${
                                resNewStatus.isNew ? 'ring-2 ring-emerald-500' : ''
                              }`}>
                                {res.profile_image ? (
                                  <img src={res.profile_image} alt={res.full_name} className="w-full h-full object-cover" />
                                ) : (
                                  res.full_name?.charAt(0) || 'U'
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                                  <span>{res.full_name}</span>
                                  {res.is_premium && <Crown className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                                  {resNewStatus.isNew && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                                      NEW
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">{res.headline || res.title || 'Professional'}</p>
                              </div>
                            </Link>

                            <Link
                              href={`/u/${res.username}`} 
                              onClick={() => setIsSearchFocused(false)}
                              className="py-1 px-2.5 rounded-lg border border-[#087CF0] text-[#087CF0] hover:bg-blue-50 text-[11px] font-bold flex-shrink-0"
                            >
                              View
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center / Right LinkedIn Nav Icons */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="hidden md:flex flex-col items-center justify-center py-1 px-3 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">Home</span>
            </Link>

            <Link
              href="/dashboard/network"
              className="hidden sm:flex flex-col items-center justify-center py-1 px-3 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Users2 className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">Network</span>
            </Link>

            <Link
              href="/dashboard/activity"
              className="hidden sm:flex flex-col items-center justify-center py-1 px-3 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Newspaper className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">Posts</span>
            </Link>

            {/* Direct Chat / Messaging Trigger */}
            <button
              onClick={() => {
                if (!currentUser) {
                  window.location.href = `/login?redirect=/u/${profile.username}`;
                  return;
                }
                setChatTargetUser(null);
                setIsChatOpen(true);
              }}
              className="relative flex flex-col items-center justify-center py-1 px-3 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">Messaging</span>
              {unreadMsgCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#087CF0]" />
              )}
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* User Profile / Dashboard Button */}
            {currentUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#087CF0] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.user_metadata?.full_name?.charAt(0) || 'M'}
                </div>
                <div className="hidden lg:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-slate-800">Me</span>
                  <span className="text-[9px] text-slate-400 font-mono">Workspace</span>
                </div>
              </Link>
            ) : (
              <Link
                href={`/login?redirect=/u/${profile.username}`}
                className="py-1.5 px-3.5 rounded-full bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-all shadow-xs"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/explore-cards"
              className="hidden xl:inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#087CF0]" />
              <span>NFC Smart Card</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Full-Screen Layout Container (Exact LinkedIn 2 Columns) */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ================================================================ */}
          {/* LEFT / CENTER MAIN COLUMN (8 of 12 columns)                      */}
          {/* ================================================================ */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Top Primary Profile Card (LinkedIn Style) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              
              {/* Cover Banner */}
              <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>
                )}

                {/* Cover Banner Action / NFC Status */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-slate-200">
                    <Wifi className="w-3.5 h-3.5 text-[#087CF0] rotate-90" />
                    <span>NFC Card Synced</span>
                  </div>

                  {isOwnProfile && (
                    <Link
                      href="/dashboard/profile"
                      className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-md transition-colors"
                      title="Edit banner"
                    >
                      <Camera className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Profile Details Header Section */}
              <div className="px-5 sm:px-7 pb-6 pt-0 relative">
                
                {/* Avatar and Top Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-3">
                  
                  {/* Avatar */}
                  <div className="relative group">
                    {/* Floating NEW badge on top of avatar if joined within 20 days */}
                    {newMemberStatus.isNew && (
                      <div 
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border-2 border-white animate-pulse"
                        title={`New Member • Joined ${newMemberStatus.daysAgo === 0 ? 'today' : `${newMemberStatus.daysAgo} day${newMemberStatus.daysAgo > 1 ? 's' : ''} ago`} • Displayed as NEW for 20 days (${newMemberStatus.daysLeft} days left)`}
                      >
                        <Sparkles className="w-2.5 h-2.5 fill-white text-white" />
                        <span>NEW</span>
                      </div>
                    )}

                    <div 
                      className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-white ring-4 transition-all ${
                        isPremium 
                          ? 'ring-amber-400 shadow-lg shadow-amber-200/50' 
                          : newMemberStatus.isNew 
                            ? 'ring-emerald-500 ring-offset-2 ring-offset-emerald-100 shadow-xl shadow-emerald-200/80 animate-pulse' 
                            : 'ring-white shadow-md'
                      }`}
                    >
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

                    {/* Verified Shield Badge Overlay */}
                    <div 
                      className="absolute bottom-1 right-1 p-1.5 rounded-full bg-white shadow-md border border-slate-100 text-[#087CF0]" 
                      title="Verified SignTap Identity"
                    >
                      <ShieldCheck className="w-5 h-5 text-[#087CF0] fill-[#087CF0]/10" />
                    </div>

                    {isOwnProfile && (
                      <Link
                        href="/dashboard/profile"
                        className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        title="Change photo"
                      >
                        <Camera className="w-6 h-6" />
                      </Link>
                    )}
                  </div>

                  {/* Header Quick Buttons */}
                  <div className="flex items-center gap-2 self-center sm:self-end">
                    <button
                      onClick={handleShare}
                      className="py-1.5 px-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Share Profile"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => setShowQR(true)}
                      className="py-1.5 px-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="View QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5 text-slate-500" />
                      <span>QR</span>
                    </button>

                    <button
                      onClick={() => downloadVCard(profile, links)}
                      className="py-1.5 px-3.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#087CF0]" />
                      <span>Save Contact</span>
                    </button>
                  </div>
                </div>

                {/* Identity Name, Current Organization & School Row (Exact LinkedIn Layout!) */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left: Name & Headline */}
                  <div className="space-y-1.5 text-left flex-1">
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

                      {/* New Member Badge (Active for first 20 days) */}
                      {newMemberStatus.isNew && (
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold tracking-tight shadow-2xs"
                          title={`New to SignTap • Joined within 20 days (${newMemberStatus.daysAgo === 0 ? 'today' : `${newMemberStatus.daysAgo} day${newMemberStatus.daysAgo > 1 ? 's' : ''} ago`}) • Highlighted as NEW for ${newMemberStatus.daysLeft} more days`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>NEW MEMBER</span>
                          <span className="text-[10px] text-emerald-600 font-semibold">({newMemberStatus.daysLeft}d left)</span>
                        </span>
                      )}

                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        @{profile.username}
                      </span>
                    </div>

                    {/* Headline */}
                    <p className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
                      {profile.headline || profile.title || 'Digital Pioneer & Professional Identity'}
                    </p>

                    {/* Location & Contact Info Modal Link */}
                    <div className="pt-1 flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-slate-500">
                      {profile.location && (
                        <span>{profile.location}</span>
                      )}
                      <span>·</span>
                      <button
                        onClick={() => setShowContactModal(true)}
                        className="text-[#087CF0] hover:underline font-bold"
                      >
                        Contact info
                      </button>
                    </div>

                    {/* Connections and Followers */}
                    <div className="pt-1.5 flex items-center gap-3 text-xs font-semibold">
                      <span className="text-[#087CF0] hover:underline cursor-pointer">
                        {profile.connections_count ?? 0} connections
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600">
                        {profile.followers_count ?? 0} followers
                      </span>
                    </div>

                    {/* 20-Day New Member Profile Highlight Banner */}
                    {newMemberStatus.isNew && (
                      <div className="mt-3.5 flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-emerald-50/90 rounded-xl border border-emerald-200/90 text-xs text-emerald-950 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-emerald-950 truncate">
                              New Member on SignTap! Joined {newMemberStatus.daysAgo === 0 ? 'today' : `${newMemberStatus.daysAgo} day${newMemberStatus.daysAgo > 1 ? 's' : ''} ago`}
                            </p>
                            <p className="text-[11px] text-emerald-700">
                              Say hello and give a warm welcome by connecting or messaging!
                            </p>
                          </div>
                        </div>
                        <span className="flex-shrink-0 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                          NEW for {newMemberStatus.daysLeft} more day{newMemberStatus.daysLeft > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Current Company & Primary Education (Exact LinkedIn Header Element!) */}
                  <div className="hidden md:flex flex-col gap-2 min-w-[200px] text-xs">
                    {(profile.company || currentRole) && (
                      <div className="flex items-center gap-2 text-slate-800 font-bold hover:text-[#087CF0] transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                          <Building2 className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="line-clamp-1">{profile.company || currentRole?.company}</span>
                      </div>
                    )}

                    {primarySchool && (
                      <div className="flex items-center gap-2 text-slate-800 font-bold hover:text-[#087CF0] transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                          <GraduationCap className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="line-clamp-1">{primarySchool.school}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Command Bar: Connect, Message, Follow, More */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                  {!isOwnProfile ? (
                    <>
                      {/* Connect Button */}
                      {connStatus.status === 'connected' ? (
                        <button
                          disabled
                          className="py-2 px-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Connected</span>
                        </button>
                      ) : connStatus.status === 'pending' ? (
                        <button
                          disabled
                          className="py-2 px-4 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Pending</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleConnect}
                          className="py-2 px-5 rounded-full bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Connect</span>
                        </button>
                      )}

                      {/* Direct In-App Chat / Message Button (LinkedIn style!) */}
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            window.location.href = `/login?redirect=/u/${profile.username}`;
                            return;
                          }
                          setChatTargetUser(profile);
                          setIsChatOpen(true);
                        }}
                        className="py-2 px-4 rounded-full border border-[#087CF0] text-[#087CF0] hover:bg-blue-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>

                      {/* Follow Button */}
                      <button
                        onClick={handleToggleFollow}
                        className={`py-2 px-4 rounded-full text-xs font-bold border transition-all ${
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
                        className={`py-2 px-4 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          savedToCRM
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                        }`}
                      >
                        <Contact className="w-3.5 h-3.5" />
                        <span>{savedToCRM ? 'Saved to CRM ✓' : 'Save to CRM'}</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href="/dashboard/profile"
                        className="py-1.5 px-4 rounded-full bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        Open to
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        className="py-1.5 px-4 rounded-full border border-[#087CF0] text-[#087CF0] hover:bg-blue-50 text-xs font-bold transition-colors"
                      >
                        Add profile section
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        className="py-1.5 px-4 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                      >
                        Enhance profile
                      </Link>
                    </div>
                  )}
                </div>

                {/* LinkedIn-style Open To Opportunities Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Open to collaboration &amp; new opportunities</span>
                    </p>
                    <p className="text-slate-500 mt-0.5">
                      Available for full-time roles, advising, consulting, or strategic partnership discussions.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="text-[#087CF0] hover:underline font-bold whitespace-nowrap"
                  >
                    See details
                  </button>
                </div>
              </div>
            </div>

            {/* Owner Analytics & Private to You (Shown only when viewing own profile!) */}
            {isOwnProfile && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Analytics</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Private to you</span>
                    </p>
                  </div>
                  <Link href="/dashboard/analytics" className="text-xs font-bold text-[#087CF0] hover:underline">
                    View all analytics
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Eye className="w-4 h-4 text-[#087CF0]" />
                      <span className="text-sm font-black text-slate-900">142</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">profile views</p>
                    <p className="text-[11px] text-slate-500">Discover who viewed your identity.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <BarChart2 className="w-4 h-4 text-[#FF7900]" />
                      <span className="text-sm font-black text-slate-900">{userPosts.length * 18 + 24}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">post impressions</p>
                    <p className="text-[11px] text-slate-500">Check out who is engaging with posts.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Search className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-black text-slate-900">48</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">search appearances</p>
                    <p className="text-[11px] text-slate-500">See how often you appear in search.</p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Featured Portfolio Card */}
            {projects.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Featured
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">{projects.length} featured items</span>
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

            {/* Activity & Posts Card (LinkedIn Exact Look) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Activity
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {profile.followers_count ?? 0} followers
                  </p>
                </div>

                {isOwnProfile && (
                  <Link
                    href="/dashboard/activity"
                    className="py-1.5 px-4 rounded-full border border-[#087CF0] text-[#087CF0] text-xs font-bold hover:bg-blue-50 transition-colors"
                  >
                    Start a post
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
                    <div key={post.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-[#087CF0] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {getInitials(post.author_name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{post.author_name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{post.author_headline || 'SignTap Member'}</p>
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

                      {/* LinkedIn Exact Reactions Bar */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">
                            ♥
                          </span>
                          <span>{post.likes_count || 0} likes</span>
                        </div>
                        <span className="text-[11px]">{post.comments_count || 0} comments</span>
                      </div>

                      <div className="pt-1 border-t border-slate-100 flex items-center justify-around text-xs">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors font-semibold ${
                            currentUser && post.liked_by?.includes(currentUser.id)
                              ? 'text-rose-600'
                              : 'text-slate-600'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                          <span>Like</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!currentUser) {
                              window.location.href = `/login?redirect=/u/${profile.username}`;
                              return;
                            }
                            setChatTargetUser(profile);
                            setIsChatOpen(true);
                          }}
                          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 font-semibold"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Comment</span>
                        </button>

                        <button
                          onClick={handleShare}
                          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 font-semibold"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Repost</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

            {/* Skills Card */}
            {skills.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Skills
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
                  Services
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

          </div>

          {/* ================================================================ */}
          {/* RIGHT SIDEBAR COLUMN (4 of 12 columns)                           */}
          {/* ================================================================ */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. Public Profile & URL Box (Exact LinkedIn Sidebar!) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Public profile &amp; URL
                </h3>
                {isOwnProfile && (
                  <Link href="/dashboard/profile" className="text-slate-400 hover:text-slate-700">
                    <Sliders className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              <p className="text-xs text-slate-500 font-mono truncate">
                https://nfc.signbridge.click/u/{profile.username}
              </p>

              <button
                onClick={handleCopyLink}
                className="w-full py-1.5 px-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{copiedLink ? 'Link Copied ✓' : 'Copy Public Link'}</span>
              </button>
            </div>

            {/* 2. SignTap Premium Membership Upgrade Widget */}
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
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Crown className="w-3.5 h-3.5 fill-white" />
                  <span>Upgrade to Premium (₹1,000/yr)</span>
                </button>
              ) : (
                <div className="p-2 rounded-xl bg-amber-100/60 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-700" />
                  <span>Annual Membership Verified</span>
                </div>
              )}
            </div>

            {/* 3. Physical NFC Hardware Card Widget */}
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
                className="w-full py-2 px-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Get a Physical NFC Card</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* 4. People You May Know (Exact LinkedIn Sidebar!) */}
            {suggestedProfiles.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  People You May Know
                </h3>

                <div className="space-y-3.5">
                  {suggestedProfiles.map((person) => {
                    const personNewStatus = getNewMemberStatus(person.created_at, 20);
                    return (
                      <div key={person.id} className="flex items-start justify-between gap-3 text-xs">
                        <Link 
                          href={`/u/${person.username}`}
                          className="flex items-start gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity"
                        >
                          <div className={`relative w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs ${
                            personNewStatus.isNew ? 'ring-2 ring-emerald-500' : ''
                          }`}>
                            {person.profile_image ? (
                              <img src={person.profile_image} alt={person.full_name} className="w-full h-full object-cover" />
                            ) : (
                              getInitials(person.full_name)
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{person.full_name}</span>
                              {person.is_premium && <Crown className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                              {personNewStatus.isNew && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                                  NEW
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{person.headline || person.title || 'Professional'}</p>
                            <p className="text-[10px] text-slate-400">{person.company}</p>
                          </div>
                        </Link>

                        <Link
                          href={`/u/${person.username}`}
                          className="py-1 px-3 rounded-full border border-slate-400 hover:bg-slate-50 hover:border-slate-600 text-[11px] font-bold text-slate-700 transition-colors flex-shrink-0"
                        >
                          + Connect
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Verified Digital Links */}
            {visibleLinks.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Social Links
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

      {/* LinkedIn-Style Contact Info Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span>{profile.full_name}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Contact Information</p>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-[#087CF0] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">SignTap Profile</p>
                  <a href={`/u/${profile.username}`} className="text-[#087CF0] hover:underline font-mono">
                    https://nfc.signbridge.click/u/{profile.username}
                  </a>
                </div>
              </div>

              {profile.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#087CF0] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Email Address</p>
                    <a href={`mailto:${profile.email}`} className="text-[#087CF0] hover:underline">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Phone</p>
                    <a href={`tel:${profile.phone}`} className="text-slate-700">
                      {profile.phone}
                    </a>
                  </div>
                </div>
              )}

              {profile.whatsapp_number && (
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">WhatsApp</p>
                    <a 
                      href={`https://wa.me/${profile.whatsapp_number.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-semibold"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {safeWebsite !== '#' && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-[#FF7900] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Website</p>
                    <a href={safeWebsite} target="_blank" rel="noopener noreferrer" className="text-[#087CF0] hover:underline">
                      {profile.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowContactModal(false)}
                className="py-2 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating LinkedIn Real-Time Messaging Drawer */}
      <LinkedInChatWidget 
        initialTargetUser={chatTargetUser} 
        isOpenExplicit={isChatOpen}
        onCloseExplicit={() => setIsChatOpen(false)}
      />
    </div>
  );
}
