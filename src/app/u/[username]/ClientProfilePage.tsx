'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  getProfileByUsername, 
  getSectionsByProfileId, 
  getProjectsByProfileId, 
  getLinksByProfileId, 
  cacheProfileLocally,
  logAnalyticsEvent,
  getCurrentUser
} from '@/lib/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Profile, ProfileSection, PortfolioProject, SocialLink, UserSession } from '@/lib/types';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import SignatureTemplate from '@/components/templates/SignatureTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import PremiumIdentityTemplate from '@/components/templates/PremiumIdentityTemplate';
import { UserX, ArrowLeft, Sparkles, Wifi, ShieldAlert, Lock, Compass, ExternalLink } from 'lucide-react';

function extractUsernameFromPath(paramUsername?: string): string {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/(?:u|id)\/([^/?#]+)/i);
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]).trim().toLowerCase();
      if (decoded && decoded !== '_shell' && decoded !== '[username]' && decoded !== '%5busername%5d') {
        return decoded;
      }
    }
  }

  if (paramUsername) {
    const clean = decodeURIComponent(paramUsername).trim().toLowerCase();
    if (clean && clean !== '_shell' && clean !== '[username]') {
      return clean;
    }
  }

  return '';
}

function ProfileContent() {
  const params = useParams();
  const rawParamUsername = Array.isArray(params?.username) ? params.username[0] : (params?.username as string);
  
  const [username, setUsername] = useState<string>(() => extractUsernameFromPath(rawParamUsername));
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isPrivateDenied, setIsPrivateDenied] = useState(false);

  // Sync username if URL or params change
  useEffect(() => {
    const extracted = extractUsernameFromPath(rawParamUsername);
    if (extracted && extracted !== username) {
      setUsername(extracted);
    }
  }, [rawParamUsername]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!username) {
      // Re-try extracting from window.location after hydration
      const fromPath = extractUsernameFromPath();
      if (fromPath) {
        setUsername(fromPath);
      } else {
        setLoading(false);
      }
      return;
    }

    let isSubscribed = true;

    async function resolveProfile() {
      setLoading(true);
      setIsPrivateDenied(false);

      // 1. Check local cached store first for immediate render
      let localProfile = getProfileByUsername(username);

      if (localProfile) {
        if (isSubscribed) {
          // Check privacy: if published is false, allow only if currentUser is owner
          if (localProfile.published === false && (!user || user.id !== localProfile.user_id)) {
            setIsPrivateDenied(true);
            setProfile(localProfile);
            setLoading(false);
            return;
          }

          setProfile(localProfile);
          setSections(getSectionsByProfileId(localProfile.id));
          setProjects(getProjectsByProfileId(localProfile.id));
          setLinks(getLinksByProfileId(localProfile.id));
          logAnalyticsEvent(localProfile.id, 'profile_view');
          setLoading(false);
        }
      }

      // 2. Fetch fresh live profile data from Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username.toLowerCase())
            .maybeSingle();

          if (!isSubscribed) return;

          if (data && !error) {
            // Unpack extended sections if packed in section_visibility._extended
            const ext = data.section_visibility?._extended || {};
            const unpackedProfile: Profile = {
              ...data,
              headline: data.headline || ext.headline || data.title || '',
              about: data.about || ext.about || data.bio || '',
              experiences: (data.experiences && data.experiences.length > 0) ? data.experiences : (ext.experiences || []),
              education: (data.education && data.education.length > 0) ? data.education : (ext.education || []),
              certifications: (data.certifications && data.certifications.length > 0) ? data.certifications : (ext.certifications || []),
              achievements: (data.achievements && data.achievements.length > 0) ? data.achievements : (ext.achievements || []),
              businesses: (data.businesses && data.businesses.length > 0) ? data.businesses : (ext.businesses || []),
              services: (data.services && data.services.length > 0) ? data.services : (ext.services || []),
              languages: (data.languages && data.languages.length > 0) ? data.languages : (ext.languages || []),
              custom_links: (data.custom_links && data.custom_links.length > 0) ? data.custom_links : (ext.custom_links || []),
              skills: Array.isArray(data.skills) ? data.skills : (localProfile?.skills || []),
              theme: data.theme || localProfile?.theme || 'signature',
              accent_color: data.accent_color || localProfile?.accent_color || '#087CF0',
              published: data.published !== false,
            };

            // Privacy check
            if (unpackedProfile.published === false && (!user || user.id !== unpackedProfile.user_id)) {
              setIsPrivateDenied(true);
              setProfile(unpackedProfile);
              setLoading(false);
              return;
            }

            // Fetch any social links from Supabase
            try {
              const { data: dbLinks } = await supabase
                .from('social_links')
                .select('*')
                .eq('profile_id', unpackedProfile.id);

              if (dbLinks && dbLinks.length > 0) {
                setLinks(dbLinks);
              } else {
                setLinks(getLinksByProfileId(unpackedProfile.id));
              }
            } catch {
              setLinks(getLinksByProfileId(unpackedProfile.id));
            }

            cacheProfileLocally(unpackedProfile);
            setProfile(unpackedProfile);
            setSections(getSectionsByProfileId(unpackedProfile.id));
            setProjects(getProjectsByProfileId(unpackedProfile.id));
            logAnalyticsEvent(unpackedProfile.id, 'profile_view');
          } else if (!localProfile) {
            setProfile(null);
          }
        } catch (err) {
          console.warn('Error fetching Supabase profile:', err);
        } finally {
          if (isSubscribed) setLoading(false);
        }
      } else {
        if (isSubscribed) setLoading(false);
      }
    }

    resolveProfile();

    return () => {
      isSubscribed = false;
    };
  }, [username]);

  // Dynamic Browser Document Title & Meta Tags
  useEffect(() => {
    if (profile && typeof document !== 'undefined') {
      const pageTitle = `${profile.full_name} | SignTap Professional Profile`;
      document.title = pageTitle;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute(
        'content', 
        `${profile.headline || profile.title || 'Digital Identity'} · Connect with ${profile.full_name} on SignTap.`
      );
    }
  }, [profile]);

  const handleLinkClick = (linkId: string) => {
    if (profile) {
      logAnalyticsEvent(profile.id, 'link_click', linkId);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0C121E] text-white">
        <div className="relative">
          <div className="w-14 h-14 rounded-3xl bg-[#087CF0]/10 border border-[#087CF0]/30 flex items-center justify-center text-[#087CF0] shadow-lg animate-pulse">
            <Wifi className="w-7 h-7 rotate-90" />
          </div>
          <div className="absolute -inset-1 rounded-3xl border border-[#087CF0]/40 animate-ping pointer-events-none" />
        </div>
        <p className="mt-5 text-sm font-bold text-white tracking-wide">
          Connecting SignTap Contactless Identity...
        </p>
        <p className="text-xs text-slate-400 font-mono mt-1">
          /u/{username || 'profile'}
        </p>
      </div>
    );
  }

  // 2. Private Profile State
  if (isPrivateDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0C121E] text-slate-100 text-center selection:bg-[#087CF0]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#131B2E] border border-white/10 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white">
            This Profile is Private
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The owner of <strong className="text-white font-mono">@{username}</strong> has set their profile visibility to private. Only approved connections or the profile owner can view it.
          </p>

          <div className="pt-4 flex flex-col gap-2.5">
            <Link
              href="/discover"
              className="py-3 px-4 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Discover Directory</span>
            </Link>

            <Link
              href="/"
              className="py-2.5 px-4 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Profile Not Found State (Professional 404)
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0C121E] text-slate-100 text-center selection:bg-[#087CF0]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#131B2E] border border-white/10 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
            <UserX className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-white">
            Profile Not Found
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The username <strong className="text-[#087CF0] font-mono">@{username || 'unknown'}</strong> has not been registered yet on SignTap, or the link may have been entered incorrectly.
          </p>

          <div className="pt-4 flex flex-col gap-2.5">
            <Link
              href={`/signup?claim=${encodeURIComponent(username || '')}`}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#087CF0] to-[#FF7900] text-white text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim &ldquo;{username || 'this-username'}&rdquo; on SignTap NFC</span>
            </Link>

            <Link
              href="/discover"
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-[#087CF0]" />
              <span>Discover Verified Professionals</span>
            </Link>

            <Link
              href="/"
              className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Render Active Theme Template (Guaranteed Fallback)
  const activeTheme = profile.theme || 'signature';

  return (
    <>
      {/* Banner if owner is viewing their own private profile */}
      {profile.published === false && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 text-amber-200 text-xs px-4 py-2.5 text-center font-medium flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Private Mode: Only you can view this profile. Turn on Public Visibility in your dashboard settings to make it public.</span>
        </div>
      )}

      {activeTheme === 'minimal' && (
        <MinimalTemplate 
          profile={profile} 
          sections={sections} 
          projects={projects} 
          links={links}
          onLinkClick={handleLinkClick}
        />
      )}

      {activeTheme === 'creative' && (
        <CreativeTemplate 
          profile={profile} 
          sections={sections} 
          projects={projects} 
          links={links}
          onLinkClick={handleLinkClick}
        />
      )}

      {(activeTheme === 'signature' || (activeTheme !== 'minimal' && activeTheme !== 'creative')) && (
        <PremiumIdentityTemplate 
          profile={profile} 
          sections={sections} 
          projects={projects} 
          links={links}
          onLinkClick={handleLinkClick}
        />
      )}
    </>
  );
}

export default function ClientProfilePage() {
  return <ProfileContent />;
}
