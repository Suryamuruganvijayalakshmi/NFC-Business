'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  getProfileByUsername, 
  getSectionsByProfileId, 
  getProjectsByProfileId, 
  getLinksByProfileId, 
  logAnalyticsEvent 
} from '@/lib/store';
import { Profile, ProfileSection, PortfolioProject, SocialLink } from '@/lib/types';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import SignatureTemplate from '@/components/templates/SignatureTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import { UserX, ArrowLeft, Sparkles } from 'lucide-react';

function ProfileContent() {
  const params = useParams();
  const username = Array.isArray(params?.username) ? params.username[0] : (params?.username as string);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    
    const foundProfile = getProfileByUsername(username);
    if (foundProfile) {
      setProfile(foundProfile);
      setSections(getSectionsByProfileId(foundProfile.id));
      setProjects(getProjectsByProfileId(foundProfile.id));
      setLinks(getLinksByProfileId(foundProfile.id));

      // Log profile view analytics event
      logAnalyticsEvent(foundProfile.id, 'profile_view');
    }
    setLoading(false);
  }, [username]);

  const handleLinkClick = (linkId: string) => {
    if (profile) {
      logAnalyticsEvent(profile.id, 'link_click', linkId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB]">
        <div className="w-10 h-10 border-3 border-[#087CF0] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-mono">Loading digital identity...</p>
      </div>
    );
  }

  // Profile not found
  if (!profile || (!profile.published && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFB] text-slate-800 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <UserX className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Profile Not Found
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            The username <b className="text-slate-800 font-mono">@{username}</b> has not been registered yet or is currently set to private.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href={`/signup?claim=${username}`}
              className="py-3 px-4 rounded-xl bg-[#087CF0] text-white text-xs sm:text-sm font-semibold hover:bg-[#0668cc] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim &ldquo;{username}&rdquo; on SignBridge ID</span>
            </Link>

            <Link
              href="/"
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render according to selected template
  return (
    <>
      {profile.theme === 'minimal' && (
        <MinimalTemplate
          profile={profile}
          sections={sections}
          projects={projects}
          links={links}
          onLinkClick={handleLinkClick}
        />
      )}

      {profile.theme === 'signature' && (
        <SignatureTemplate
          profile={profile}
          sections={sections}
          projects={projects}
          links={links}
          onLinkClick={handleLinkClick}
        />
      )}

      {profile.theme === 'creative' && (
        <CreativeTemplate
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

export default function PublicProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB]">
        <div className="w-10 h-10 border-3 border-[#087CF0] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-mono">Loading digital identity...</p>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
