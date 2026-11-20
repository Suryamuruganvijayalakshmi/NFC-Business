'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Profile, 
  ProfileSection, 
  PortfolioProject, 
  SocialLink,
  PostItem
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
  savePublicProfileAsContact
} from '@/lib/store';
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
  Contact
} from 'lucide-react';

interface TemplateProps {
  profile: Profile;
  sections?: ProfileSection[];
  projects?: PortfolioProject[];
  links?: SocialLink[];
  onLinkClick?: (linkId: string) => void;
  isPreview?: boolean;
}

export default function SignatureTemplate({
  profile,
  sections = [],
  projects = [],
  links = [],
  onLinkClick,
  isPreview = false,
}: TemplateProps) {
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');
  const [userPosts, setUserPosts] = useState<PostItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [connStatus, setConnStatus] = useState<{ status: string; isRequester: boolean }>({ status: 'none', isRequester: false });
  const [following, setFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConnect = () => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    sendConnectionRequest(currentUser, profile);
    setConnStatus({ status: 'pending', isRequester: true });
    showToast(`Connection request sent to ${profile.full_name}!`);
  };

  const handleToggleFollow = () => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    const isNowFollowing = toggleFollow(currentUser.id, profile.user_id);
    setFollowing(isNowFollowing);
    showToast(isNowFollowing ? `Now following ${profile.full_name}` : `Unfollowed ${profile.full_name}`);
  };

  const [savedToCRM, setSavedToCRM] = useState(false);

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

  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/u/${profile.username}` 
    : `https://signbridge.click/u/${profile.username}`;

  const accentColor = profile.accent_color || '#087CF0';
  const visibleLinks = links.filter(l => l.visible);
  const visibleProjects = projects;
  const isOwnProfile = currentUser?.id === profile.user_id;

  const visibility = profile.section_visibility || {
    bio: true,
    contact: true,
    socials: true,
    skills: true,
    services: true,
    portfolio: true,
    experience: true,
    education: true,
    certifications: true,
    achievements: true,
    businesses: true,
    languages: true,
    activity: true
  };

  return (
    <div className="min-h-screen bg-[#0C121E] text-slate-100 font-sans py-6 sm:py-12 px-3 sm:px-6 relative selection:bg-[#087CF0] selection:text-white">
      {/* Background Subtle Gradient Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(8, 124, 240, 0.25) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px'
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="relative max-w-2xl mx-auto rounded-3xl bg-[#131B2E]/95 backdrop-blur-xl border border-white/10 p-5 sm:p-9 shadow-2xl space-y-6">
        
        {/* Cover Header Banner */}
        {profile.cover_image && (
          <div className="relative h-44 sm:h-56 -mx-5 sm:-mx-9 -mt-5 sm:-mt-9 rounded-t-3xl overflow-hidden">
            <img 
              src={profile.cover_image} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-transparent to-transparent" />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white font-mono flex items-center gap-1.5 shadow-md">
              <Wifi className="w-3 h-3 text-[#087CF0] rotate-90" />
              <span>NFC Hardware Synced</span>
            </div>
          </div>
        )}

        {/* Profile Identity Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-2 ring-[#087CF0]/40 p-1 bg-gradient-to-br from-[#087CF0] to-[#FF7900] shadow-lg">
              <img 
                src={profile.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                alt={profile.full_name} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* NFC Contactless Badge */}
            <div 
              className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-[#101828] border border-white/20 text-[#087CF0] shadow-md flex items-center justify-center"
              title="Verified SignTap NFC Smart Card"
            >
              <Wifi className="w-3.5 h-3.5 rotate-90" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {profile.full_name}
                <ShieldCheck className="w-5 h-5 text-[#087CF0]" />
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#087CF0]/15 text-[#087CF0] border border-[#087CF0]/30">
                {profile.profile_type}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed">
              {profile.headline || profile.title}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
              {profile.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#FF7900]" />
                  <span>{profile.company}</span>
                </span>
              )}

              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{profile.location}</span>
                </span>
              )}
            </div>

            {/* Network Count Stats (LinkedIn-style) */}
            <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-3 text-xs">
              <span className="text-[#087CF0] font-bold">
                {profile.connections_count ? `${profile.connections_count}+ connections` : '500+ connections'}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">
                {profile.followers_count || 1290} followers
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {visibility.bio && profile.bio && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Action Buttons: Connect, Follow, Save Contact & Share */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {!isOwnProfile ? (
            <>
              {connStatus.status === 'connected' ? (
                <button
                  disabled
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </button>
              ) : connStatus.status === 'pending' ? (
                <button
                  disabled
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/10 text-slate-400 text-xs font-semibold"
                >
                  <span>Pending</span>
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  style={{ backgroundColor: accentColor }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              )}

              <button
                onClick={handleToggleFollow}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  following
                    ? 'bg-white/15 text-white border-white/20'
                    : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{following ? 'Following' : '+ Follow'}</span>
              </button>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#087CF0] text-white text-xs font-bold hover:bg-[#0668cc] transition-colors"
            >
              <span>Manage My Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => downloadVCard(profile, links)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#087CF0]" />
            <span>Save Contact</span>
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-[#FF7900]" />
            <span>Share QR</span>
          </button>
        </div>

        {/* 1-Click Save to Smart Networking CRM for Authenticated Visitors / NFC Taps */}
        {!isOwnProfile && (
          <div className="pt-1">
            <button
              onClick={handleSaveToCRM}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                savedToCRM 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                  : 'bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500/40 text-indigo-300'
              }`}
            >
              <Contact className="w-4 h-4 text-indigo-400" />
              <span>{savedToCRM ? 'Saved to your Smart Networking CRM ✓' : 'Save to Smart Networking CRM (Private Notes & Reminders)'}</span>
            </button>
          </div>
        )}

        {/* Tab Navigation: Profile Details vs Professional Activity */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-[#101828]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile & Career
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'activity'
                ? 'bg-white text-[#101828]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Activity & Posts ({userPosts.length})</span>
          </button>
        </div>

        {/* Tab Content: Profile & Career */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            {/* About Section */}
            {profile.about && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#087CF0]" />
                  About
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                  {profile.about}
                </p>
              </div>
            )}

            {/* Work Experience Section */}
            {visibility.experience && profile.experiences && profile.experiences.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#FF7900]" />
                  Work Experience
                </h3>

                <div className="space-y-3">
                  {profile.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                        {exp.is_current && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Present
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-[#087CF0]">
                        {exp.company} {exp.employment_type ? `· ${exp.employment_type}` : ''}
                      </p>

                      <p className="text-[11px] text-slate-400 font-mono">
                        {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date} {exp.location ? `· ${exp.location}` : ''}
                      </p>

                      {exp.description && (
                        <p className="text-xs text-slate-300 leading-relaxed pt-1">
                          {exp.description}
                        </p>
                      )}

                      {exp.skills_used && exp.skills_used.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {exp.skills_used.map((skill, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {visibility.education && profile.education && profile.education.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#087CF0]" />
                  Education
                </h3>

                <div className="space-y-3">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                      <h4 className="text-sm font-bold text-white">{edu.school}</h4>
                      <p className="text-xs text-[#087CF0] font-medium">{edu.degree} · {edu.field_of_study}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{edu.start_year} — {edu.end_year} {edu.grade ? `· ${edu.grade}` : ''}</p>
                      {edu.description && <p className="text-xs text-slate-300 mt-1">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Section */}
            {visibility.certifications && profile.certifications && profile.certifications.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#FF7900]" />
                  Licenses & Certifications
                </h3>

                <div className="space-y-2">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{cert.name}</h4>
                        <p className="text-[11px] text-slate-400">{cert.issuing_org} · Issued {cert.issue_date}</p>
                      </div>
                      {cert.credential_id && (
                        <span className="text-[10px] font-mono text-[#087CF0] bg-[#087CF0]/10 px-2 py-0.5 rounded">
                          {cert.credential_id}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Entities Showcase */}
            {visibility.businesses && profile.businesses && profile.businesses.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-[#FF7900]" />
                  Ventures & Organizations
                </h3>

                <div className="space-y-3">
                  {profile.businesses.map((biz) => (
                    <div key={biz.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{biz.name}</h4>
                          {biz.tagline && <p className="text-xs text-[#087CF0] italic">{biz.tagline}</p>}
                        </div>
                        {biz.website && (
                          <a 
                            href={biz.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {biz.description && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {biz.description}
                        </p>
                      )}

                      {biz.services && biz.services.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {biz.services.map((s, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services & Pricing */}
            {visibility.services && profile.services && profile.services.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#087CF0]" />
                  Services & Offerings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.services.map((serv, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-white">{serv.title}</h4>
                          {serv.price && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#087CF0]/20 text-[#087CF0] border border-[#087CF0]/30 flex-shrink-0">
                              {serv.price}
                            </span>
                          )}
                        </div>
                        {serv.description && (
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {serv.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills & Expertise */}
            {visibility.skills && profile.skills && profile.skills.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900]" />
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-medium hover:border-[#087CF0]/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {visibility.languages && profile.languages && profile.languages.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <LangIcon className="w-3.5 h-3.5 text-slate-400" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <span key={lang.id} className="text-xs px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                      <span className="font-semibold text-white">{lang.language}</span> · {lang.proficiency}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Links */}
            {visibility.socials && visibleLinks.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#087CF0]" />
                  Verified Social Hub
                </h3>
                <div className="flex flex-col gap-2">
                  {visibleLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onLinkClick && onLinkClick(link.id)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#087CF0]/40 transition-all text-xs font-semibold text-slate-200 group"
                    >
                      <span className="group-hover:text-white transition-colors">
                        {link.label || link.platform}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#087CF0] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Direct Inquiry */}
            {profile.whatsapp_number && (
              <div className="pt-2 text-center">
                <a
                  href={`https://wa.me/${profile.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp Inquiry</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Activity & Posts */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div className="p-8 text-center bg-white/[0.03] rounded-2xl border border-white/5 space-y-2">
                <Newspaper className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No published posts yet</h4>
                <p className="text-xs text-slate-400">
                  {profile.full_name} hasn't posted any updates or project showcases yet.
                </p>
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    {post.media_type && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-[#087CF0]">
                        {post.media_type}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {post.media_url && (
                    <div className="rounded-xl overflow-hidden max-h-64 bg-slate-900">
                      <img src={post.media_url} alt="Post media" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{post.likes_count}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.comments_count}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer Official Badge */}
        <div className="mt-8 text-center pt-6 border-t border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#923cf6] animate-pulse" />
            <p className="text-[11px] text-slate-400">
              Verified Profile on{' '}
              <a href="/" className="font-semibold text-white hover:text-[#923cf6] transition-colors">
                SignTap NFC
              </a>
              {' '}· Contactless Physical Web
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
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
