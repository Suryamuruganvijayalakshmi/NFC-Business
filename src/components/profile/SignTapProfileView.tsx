'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import QRCodeModal from '@/components/QRCodeModal';
import ProfileEditModal, { ProfileEditTab } from '@/components/ProfileEditModal';
import {
  Profile,
  PortfolioProject,
  SocialLink,
  UserSession,
} from '@/lib/types';
import {
  getConnectionStatus,
  sendConnectionRequest,
  isFollowing,
  toggleFollow,
  getLiveConnectionCount,
  getLiveFollowersCount,
  getAnalyticsSummary,
  savePublicProfileAsContact,
  logAnalyticsEvent,
  getEndorsementsForProfile,
  endorseSkill,
  getProjectsByProfileId,
  getLinksByProfileId,
  getProfileByUserId,
  getOrCreateProfileForUser,
} from '@/lib/store';
import { downloadVCard } from '@/lib/vcard';
import { sanitizeUrl } from '@/lib/security';
import { popMiniPapers } from '@/lib/celebrate';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Share2,
  Check,
  QrCode,
  UserPlus,
  UserCheck,
  MessageSquare,
  Download,
  Edit3,
  Plus,
  CreditCard,
  Wifi,
  Globe,
  Mail,
  Phone,
  Zap,
  Heart,
  Eye,
  Sparkles,
  Layers,
  LayoutGrid,
  User as UserIcon,
} from 'lucide-react';

interface SignTapProfileViewProps {
  initialProfile: Profile;
  initialProjects: PortfolioProject[];
  initialLinks: SocialLink[];
  currentUser: UserSession | null;
  onLinkClick?: (linkId: string) => void;
}

type ProfileTab = 'overview' | 'projects' | 'experience' | 'skills' | 'certifications' | 'about';

export default function SignTapProfileView({
  initialProfile,
  initialProjects,
  initialLinks,
  currentUser,
  onLinkClick,
}: SignTapProfileViewProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects);
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const [following, setFollowing] = useState(false);
  const [connStatus, setConnStatus] = useState<'none' | 'pending' | 'connected' | 'declined'>('none');
  const [followersCount, setFollowersCount] = useState(0);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [nfcTapsCount, setNfcTapsCount] = useState(0);

  const [showQR, setShowQR] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [editModalTab, setEditModalTab] = useState<ProfileEditTab | null>(() => {
    if (typeof window !== 'undefined') {
      const editParam = new URLSearchParams(window.location.search).get('edit');
      if (editParam) return editParam === '1' ? 'basic' : (editParam as ProfileEditTab);
    }
    return null;
  });

  const isOwner = Boolean(
    currentUser &&
      (currentUser.id === profile.user_id ||
        (currentUser.email &&
          profile.email &&
          currentUser.email.toLowerCase() === profile.email.toLowerCase()))
  );

  useEffect(() => {
    setProfile(initialProfile);
    setProjects(initialProjects);
    setLinks(initialLinks);
  }, [initialProfile, initialProjects, initialLinks]);

  useEffect(() => {
    setFollowersCount(getLiveFollowersCount(profile.user_id));
    setConnectionsCount(getLiveConnectionCount(profile.user_id));
    const analytics = getAnalyticsSummary(profile.id, 'all');
    setViewsCount(analytics.total_views);
    setNfcTapsCount(analytics.total_nfc_taps);

    if (currentUser && !isOwner) {
      setFollowing(isFollowing(currentUser.id, profile.user_id));
      const status = getConnectionStatus(currentUser.id, profile.user_id);
      setConnStatus(status.status);
    }
  }, [profile.id, profile.user_id, currentUser, isOwner]);

  const showNotice = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!currentUser) {
      window.location.href = `/login?redirect=/u/${profile.username}`;
      return;
    }
    const next = toggleFollow(currentUser.id, profile.user_id);
    setFollowing(next);
    setFollowersCount(getLiveFollowersCount(profile.user_id));
    if (next) popMiniPapers(e);
  };

  const handleConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!currentUser) {
      window.location.href = `/login?redirect=/u/${profile.username}`;
      return;
    }
    const requesterProfile = getProfileByUserId(currentUser.id) || getOrCreateProfileForUser(currentUser);
    sendConnectionRequest(requesterProfile, profile);
    setConnStatus('pending');
    popMiniPapers(e);
    showNotice(`Connection request sent to ${profile.full_name}`);
  };

  const handleSaveContact = () => {
    downloadVCard(profile, links);
    logAnalyticsEvent(profile.id, 'contact_save');
    if (currentUser && !isOwner) {
      savePublicProfileAsContact(currentUser.id, profile, 'SignTap Digital Profile');
      showNotice(`${profile.full_name} saved to your device & Smart CRM`);
    } else {
      showNotice('vCard contact downloaded');
    }
  };

  const handleShareProfile = () => {
    const url = `${window.location.origin}/u/${profile.username}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleEndorse = (skillName: string) => {
    if (!currentUser) {
      window.location.href = `/login?redirect=/u/${profile.username}`;
      return;
    }
    const endorserProfile = getProfileByUserId(currentUser.id) || getOrCreateProfileForUser(currentUser);
    endorseSkill(profile.id, skillName, endorserProfile);
    showNotice(`Updated endorsement for ${skillName}`);
  };

  const endorsements = getEndorsementsForProfile(profile.id);
  const experiences = profile.experiences || [];
  const education = profile.education || [];
  const certifications = profile.certifications || [];
  const skills = profile.skills || [];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#202124] pb-24 md:pb-16">
      <LinkedInNavbar />

      {/* Toast Feedback */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#202124] text-white text-xs font-semibold shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* Compact Contained Cover Banner (never stretches full-width or overlaps text) */}
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="h-28 sm:h-36 w-full rounded-2xl relative overflow-hidden bg-gradient-to-r from-[#EEF2FF] via-[#F3E8FF] to-[#FCE7F3] border border-[#E8E8EF]">
            {profile.cover_image ? (
              <img
                src={profile.cover_image}
                alt={`${profile.full_name} banner`}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-[#6969F5]/20 blur-3xl pointer-events-none" />
                <div className="absolute -top-12 right-1/4 w-64 h-64 rounded-full bg-[#A78BFA]/25 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 right-12 w-56 h-56 rounded-full bg-pink-300/25 blur-3xl pointer-events-none" />
              </>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-4 pb-8">
            {/* Left + Middle: Rounded-Rect Photo overlapping compact cover + Clean White Text Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-7 flex-1 min-w-0">
              {/* Rounded-Rectangle Photograph */}
              <div className="-mt-16 sm:-mt-20 ml-2 sm:ml-4 relative z-10 w-32 h-32 sm:w-44 sm:h-44 rounded-[22px] border-4 border-white bg-[#F7F7FB] shadow-md overflow-hidden shrink-0">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6969F5] to-[#A78BFA] text-white text-5xl font-bold">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Middle: Name, PRO badge, Headline, Location, Bio, Action Buttons */}
              <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight">
                    {profile.full_name}
                  </h1>
                  <span className="text-xs sm:text-sm font-semibold text-[#6969F5] bg-[#F7F7FB] border border-[#E8E8EF] px-2.5 py-0.5 rounded-full">
                    @{profile.username}
                  </span>
                  {profile.is_premium && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6969F5] text-white text-[11px] font-bold tracking-wide">
                      PRO <Zap className="w-3 h-3 fill-white" />
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-[15px] text-[#777783] mt-1 font-medium">
                  {profile.headline || profile.title || 'SignTap Member'}
                </p>

                {profile.location && (
                  <p className="text-xs text-[#777783] mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#777783]" />
                    <span>based in {profile.location}</span>
                  </p>
                )}

                {profile.bio && (
                  <p className="text-sm text-[#202124]/80 mt-2.5 max-w-xl line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  {isOwner ? (
                    <>
                      <button
                        onClick={() => setEditModalTab('basic')}
                        className="px-4 py-2 rounded-xl bg-[#202124] hover:bg-black text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setEditModalTab('projects')}
                        className="px-4 py-2 rounded-xl border border-[#E8E8EF] bg-white hover:bg-[#F7F7FB] text-[#202124] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Project
                      </button>
                      <Link
                        href="/dashboard/nfc"
                        className="px-4 py-2 rounded-xl border border-[#E8E8EF] bg-white hover:bg-[#F7F7FB] text-[#202124] text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#6969F5]" />
                        Manage NFC Card
                      </Link>
                      <button
                        onClick={handleShareProfile}
                        className="px-4 py-2 rounded-xl border border-[#E8E8EF] bg-white hover:bg-[#F7F7FB] text-[#202124] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        {copiedShare ? 'Copied' : 'Share Profile'}
                      </button>
                      <button
                        onClick={() => setShowQR(true)}
                        className="p-2 rounded-xl border border-[#E8E8EF] bg-white hover:bg-[#F7F7FB] text-[#202124] transition-colors cursor-pointer"
                        aria-label="Show SignTap QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`px-5 py-2 rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                          following
                            ? 'bg-[#F7F7FB] border border-[#E8E8EF] text-[#202124]'
                            : 'bg-[#202124] hover:bg-black text-white'
                        }`}
                      >
                        {following ? 'Following' : 'Follow'}
                      </button>

                      {connStatus === 'connected' ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5" /> Connected
                        </span>
                      ) : connStatus === 'pending' ? (
                        <span className="px-4 py-2 rounded-xl bg-[#F7F7FB] border border-[#E8E8EF] text-[#777783] text-xs font-semibold">
                          Request Sent
                        </span>
                      ) : (
                        <button
                          onClick={handleConnect}
                          className="px-4 py-2 rounded-xl bg-[#6969F5] hover:bg-[#5858e6] text-white text-xs font-semibold active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Connect
                        </button>
                      )}

                      <Link
                        href={`/messages?user=${profile.user_id}`}
                        className="px-4 py-2 rounded-xl border border-[#E8E8EF] bg-white hover:bg-[#F7F7FB] text-[#202124] text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Get in touch
                      </Link>

                      <button
                        onClick={handleSaveContact}
                        className="px-4 py-2 rounded-xl border border-[#E8E8EF] bg-white hover:bg-[#F7F7FB] text-[#202124] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Save Contact
                      </button>

                      <button
                        onClick={handleShareProfile}
                        className="p-2 rounded-xl border border-[#E8E8EF] bg-white hover:bg-[#F7F7FB] text-[#202124] transition-colors cursor-pointer"
                        aria-label="Share Profile"
                      >
                        {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setShowQR(true)}
                        className="p-2 rounded-xl border border-[#E8E8EF] bg-white hover:bg-[#F7F7FB] text-[#202124] transition-colors cursor-pointer"
                        aria-label="QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Prominent Clean Statistics */}
            <div className="flex items-center gap-6 sm:gap-8 pt-2 lg:pb-3 shrink-0">
              <div>
                <p className="text-xs text-[#777783] font-medium">Followers</p>
                <p className="text-xl sm:text-2xl font-bold text-[#202124] mt-0.5">
                  {followersCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#777783] font-medium">Connections</p>
                <p className="text-xl sm:text-2xl font-bold text-[#202124] mt-0.5">
                  {connectionsCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#777783] font-medium">Profile Views</p>
                <p className="text-xl sm:text-2xl font-bold text-[#202124] mt-0.5">
                  {viewsCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#777783] font-medium">NFC Taps</p>
                <p className="text-xl sm:text-2xl font-bold text-[#6969F5] mt-0.5">
                  {nfcTapsCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Horizontal Pill Tabs (inspired by modern SignTap mobile/web card aesthetic) */}
          <div className="pb-3 border-b border-[#E8E8EF] flex items-center gap-2.5 overflow-x-auto no-scrollbar">
            {([
              { id: 'overview', label: 'Overview', icon: LayoutGrid },
              { id: 'projects', label: 'Projects', count: projects.length, icon: Layers },
              { id: 'experience', label: 'Experience', count: experiences.length, icon: Briefcase },
              { id: 'skills', label: 'Skills', count: skills.length, icon: Sparkles },
              { id: 'certifications', label: 'Certifications', count: certifications.length, icon: Award },
              { id: 'about', label: 'About', icon: UserIcon },
            ] as const).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#6969F5] text-white font-semibold shadow-sm shadow-[#6969F5]/25'
                      : 'bg-[#F7F7FB] text-[#202124] hover:bg-[#EFEFF7] font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#777783]'}`} />
                  <span>{tab.label}</span>
                  {'count' in tab && tab.count > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-[#777783]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="py-8">
            {activeTab === 'overview' && (
              <div className="space-y-10">
                {/* Featured Projects Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-[#202124]">Featured Projects</h2>
                    {projects.length > 0 && (
                      <button
                        onClick={() => setActiveTab('projects')}
                        className="text-xs font-semibold text-[#6969F5] hover:underline cursor-pointer"
                      >
                        View all ({projects.length}) →
                      </button>
                    )}
                  </div>

                  {projects.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-[#E8E8EF] bg-[#F7F7FB] text-center">
                      <p className="text-sm text-[#777783]">No projects added yet.</p>
                      {isOwner && (
                        <button
                          onClick={() => setEditModalTab('projects')}
                          className="mt-3 px-4 py-2 rounded-xl bg-[#6969F5] text-white text-xs font-semibold cursor-pointer"
                        >
                          + Add Your First Project
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.slice(0, 6).map((proj) => (
                        <ProjectCard key={proj.id} project={proj} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Snapshot Row: Experience + Skills + Digital NFC Identity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-[#E8E8EF]">
                  <div className="p-6 rounded-2xl border border-[#E8E8EF] bg-white space-y-3">
                    <h3 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#6969F5]" /> Recent Experience
                    </h3>
                    {experiences.length === 0 ? (
                      <p className="text-xs text-[#777783]">No experience listed yet.</p>
                    ) : (
                      experiences.slice(0, 2).map((exp) => (
                        <div key={exp.id} className="pt-2 border-t border-[#E8E8EF]/60 first:border-0 first:pt-0">
                          <p className="text-sm font-semibold text-[#202124]">{exp.title}</p>
                          <p className="text-xs text-[#777783]">
                            {exp.company} · {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date || ''}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-6 rounded-2xl border border-[#E8E8EF] bg-white space-y-3">
                    <h3 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#6969F5]" /> Key Skills
                    </h3>
                    {skills.length === 0 ? (
                      <p className="text-xs text-[#777783]">No skills added yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 8).map((s) => (
                          <span
                            key={s}
                            className="px-3 py-1 rounded-xl bg-[#F7F7FB] border border-[#E8E8EF] text-xs font-medium text-[#202124]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6 rounded-2xl border border-[#E8E8EF] bg-[#F7F7FB] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-[#6969F5] rotate-90" /> SignTap NFC Identity
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-[#777783]">
                      Verified digital business card at <span className="font-mono text-[#202124]">/u/{profile.username}</span>
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setShowQR(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#202124] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Show QR
                      </button>
                      <Link
                        href={`/connect?with=${profile.username}&method=link`}
                        className="px-3.5 py-2 rounded-xl border border-[#E8E8EF] bg-white text-[#202124] text-xs font-semibold"
                      >
                        Exchange Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#202124]">Projects ({projects.length})</h2>
                  {isOwner && (
                    <button
                      onClick={() => setEditModalTab('projects')}
                      className="px-4 py-2 rounded-xl bg-[#6969F5] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                  )}
                </div>
                {projects.length === 0 ? (
                  <p className="text-sm text-[#777783]">No projects published yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((proj) => (
                      <ProjectCard key={proj.id} project={proj} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#202124]">Experience & Education</h2>
                  {isOwner && (
                    <button
                      onClick={() => setEditModalTab('experience')}
                      className="px-3.5 py-2 rounded-xl border border-[#E8E8EF] text-xs font-semibold hover:bg-[#F7F7FB] cursor-pointer"
                    >
                      + Edit Experience
                    </button>
                  )}
                </div>
                <div className="space-y-4 border-l-2 border-[#E8E8EF] pl-5">
                  {experiences.length === 0 ? (
                    <p className="text-sm text-[#777783]">No work experience added yet.</p>
                  ) : (
                    experiences.map((exp) => (
                      <div key={exp.id} className="relative p-5 rounded-2xl border border-[#E8E8EF] bg-white">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#6969F5] absolute -left-[27px] top-6 ring-4 ring-white" />
                        <h3 className="text-sm font-bold text-[#202124]">{exp.title}</h3>
                        <p className="text-xs text-[#777783] mt-0.5">
                          {exp.company} · {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date || ''}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-[#202124]/80 mt-2 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {education.length > 0 && (
                  <div className="pt-4 space-y-3">
                    <h3 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#6969F5]" /> Education
                    </h3>
                    {education.map((edu) => (
                      <div key={edu.id} className="p-4 rounded-2xl border border-[#E8E8EF] bg-[#F7F7FB]">
                        <p className="text-sm font-bold text-[#202124]">{edu.school}</p>
                        <p className="text-xs text-[#777783]">
                          {edu.degree} · {edu.field_of_study} ({edu.start_year} – {edu.end_year || 'Present'})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="max-w-3xl space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#202124]">Skills & Endorsements</h2>
                  {isOwner && (
                    <button
                      onClick={() => setEditModalTab('skills')}
                      className="px-3.5 py-2 rounded-xl border border-[#E8E8EF] text-xs font-semibold hover:bg-[#F7F7FB] cursor-pointer"
                    >
                      + Edit Skills
                    </button>
                  )}
                </div>
                {skills.length === 0 ? (
                  <p className="text-sm text-[#777783]">No skills added yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {skills.map((skill) => {
                      const count = endorsements.filter(
                        (e) => e.skill_name.toLowerCase() === skill.toLowerCase()
                      ).length;
                      return (
                        <button
                          key={skill}
                          onClick={() => !isOwner && handleEndorse(skill)}
                          className="px-4 py-2 rounded-xl bg-[#F7F7FB] border border-[#E8E8EF] hover:border-[#6969F5] text-xs font-semibold text-[#202124] flex items-center gap-2 transition-colors cursor-pointer"
                          title={isOwner ? skill : `Endorse ${skill}`}
                        >
                          <span>{skill}</span>
                          {count > 0 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#6969F5]/10 text-[#6969F5] text-[10px] font-bold">
                              +{count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'certifications' && (
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#202124]">Licenses & Certifications</h2>
                  {isOwner && (
                    <button
                      onClick={() => setEditModalTab('certifications')}
                      className="px-3.5 py-2 rounded-xl border border-[#E8E8EF] text-xs font-semibold hover:bg-[#F7F7FB] cursor-pointer"
                    >
                      + Add Certification
                    </button>
                  )}
                </div>
                {certifications.length === 0 ? (
                  <p className="text-sm text-[#777783]">No certifications added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certifications.map((c) => (
                      <div key={c.id} className="p-5 rounded-2xl border border-[#E8E8EF] bg-white flex items-start gap-3">
                        <Award className="w-5 h-5 text-[#6969F5] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-[#202124]">{c.name}</p>
                          <p className="text-xs text-[#777783] mt-0.5">{c.issuing_org}</p>
                          <p className="text-[11px] text-[#777783] mt-1">{c.issue_date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-lg font-bold text-[#202124]">About {profile.full_name}</h2>
                  <p className="text-sm text-[#202124]/85 leading-relaxed whitespace-pre-line">
                    {profile.about || profile.bio || 'No biography provided yet.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-[#E8E8EF] bg-[#F7F7FB] space-y-4 h-fit">
                  <h3 className="text-sm font-bold text-[#202124]">Contact & Links</h3>
                  <div className="space-y-2.5 text-xs text-[#202124]">
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-[#6969F5]">
                        <Mail className="w-4 h-4 text-[#777783]" /> {profile.email}
                      </a>
                    )}
                    {profile.phone && (
                      <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-[#6969F5]">
                        <Phone className="w-4 h-4 text-[#777783]" /> {profile.phone}
                      </a>
                    )}
                    {profile.website && (
                      <a
                        href={sanitizeUrl(profile.website)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => onLinkClick?.('website')}
                        className="flex items-center gap-2 text-[#6969F5] hover:underline"
                      >
                        <Globe className="w-4 h-4" /> {profile.website}
                      </a>
                    )}
                  </div>

                  {links.length > 0 && (
                    <div className="pt-3 border-t border-[#E8E8EF] flex flex-wrap gap-2">
                      {links
                        .filter((l) => l.visible !== false)
                        .map((l) => (
                          <a
                            key={l.id}
                            href={sanitizeUrl(l.url)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => onLinkClick?.(l.id)}
                            className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E8EF] hover:border-[#6969F5] text-xs font-semibold text-[#202124] flex items-center gap-1"
                          >
                            <span>{l.label || l.platform}</span>
                            <ExternalLink className="w-3 h-3 text-[#777783]" />
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showQR && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          fullName={profile.full_name}
          username={profile.username}
        />
      )}

      {editModalTab && isOwner && (
        <ProfileEditModal
          profile={profile}
          initialTab={editModalTab}
          onClose={() => setEditModalTab(null)}
          onSaved={(updated) => {
            setProfile(updated);
            setProjects(getProjectsByProfileId(updated.id));
            setLinks(getLinksByProfileId(updated.id));
            showNotice('Profile updated');
          }}
        />
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <div className="group relative pt-1.5">
      {/* Subtle stacked card edge behind main preview */}
      <div className="mx-3 h-2 rounded-t-2xl bg-[#EFEFF7] border border-b-0 border-[#E8E8EF] transition-transform duration-300 group-hover:-translate-y-0.5" />

      <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-[#F7F7FB] border border-[#E8E8EF] relative shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
        <img
          src={project.image_url || '/images/nfc-smart-card.webp'}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        {project.category && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[#202124] text-[10px] font-bold shadow-2xs">
            {project.category}
          </span>
        )}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate drop-shadow-xs">{project.title}</h3>
            <p className="text-[11px] text-white/80 truncate mt-0.5">
              {(project.technologies || []).slice(0, 3).join(' · ') || project.description}
            </p>
          </div>
          {project.project_url && (
            <a
              href={sanitizeUrl(project.project_url)}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-full bg-white/95 hover:bg-white text-[#202124] text-[11px] font-semibold flex items-center gap-1 shrink-0 shadow-xs"
            >
              <span>Open</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
