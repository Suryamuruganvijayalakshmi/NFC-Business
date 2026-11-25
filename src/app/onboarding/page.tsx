'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import {
  getCurrentUser,
  getProfileByUserId,
  getAllProfiles,
  saveProfile,
  saveProject,
  saveLink,
  getProjectsByProfileId,
  getLinksByProfileId,
} from '@/lib/store';
import { calculateProfileCompletion } from '@/lib/profileCompletion';
import { Profile, ProfileType, SocialLink, PortfolioProject, UserSession } from '@/lib/types';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Camera,
  MapPin,
  Briefcase,
  Sparkles,
  FolderGit2,
  Globe,
  Eye,
  Upload,
} from 'lucide-react';

const PROFILE_CATEGORIES: { id: ProfileType; label: string }[] = [
  { id: 'professional', label: 'Professional / Engineer' },
  { id: 'creator', label: 'Creator / Designer' },
  { id: 'personal', label: 'Student / Individual' },
  { id: 'business', label: 'Founder / Business' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [existingProfile, setExistingProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Basic Identity
  const [fullName, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('professional');

  // Step 2: Professional Information
  const [about, setAbout] = useState('');
  const [company, setCompany] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [eduSchool, setEduSchool] = useState('');
  const [eduDegree, setEduDegree] = useState('');

  // Step 3: Work & Projects (Optional)
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');

  // Step 4: Digital Identity
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [published, setPublished] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace('/login');
      return;
    }
    setCurrentUser(user);

    const existing = getProfileByUserId(user.id);
    const onboardingDone = Boolean(
      (existing?.section_visibility as Record<string, unknown> | undefined)?._onboarding_completed
    );

    // Existing user who already completed onboarding -> immediate Home Feed
    if (existing && onboardingDone) {
      router.replace('/feed');
      return;
    }

    if (existing) {
      setExistingProfile(existing);
      setFullName(existing.full_name || '');
      setHeadline(existing.headline || existing.title || '');
      setLocation(existing.location || '');
      setProfileType(existing.profile_type || 'professional');
      setProfileImage(existing.profile_image || '');
      setAbout(existing.about || existing.bio || '');
      setCompany(existing.company || '');
      setSkillsInput((existing.skills || []).join(', '));
      setUsername(existing.username || '');
      setWebsite(existing.website || existing.portfolio_url || '');
      setPhone(existing.phone || '');
    } else {
      const meta = (user.user_metadata || {}) as Record<string, string>;
      if (meta.full_name) setFullName(meta.full_name);
      if (meta.username) setUsername(meta.username);
      if (meta.profile_type) setProfileType(meta.profile_type as ProfileType);
      if (!meta.username && user.email) {
        setUsername(user.email.split('@')[0].replace(/[^a-z0-9_-]/g, '').toLowerCase());
      }
    }
  }, [router]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 512;
        let w = img.width;
        let h = img.height;
        if (w > maxW) {
          h = Math.round((h * maxW) / w);
          w = maxW;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          setProfileImage(canvas.toDataURL('image/jpeg', 0.85));
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const buildDraftProfile = (markCompleted: boolean): Profile => {
    const cleanUsername = (username || currentUser?.email?.split('@')[0] || 'member')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '')
      .trim();

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const profileId = existingProfile?.id || `prof-${Date.now()}`;

    return {
      ...(existingProfile || {}),
      id: profileId,
      user_id: currentUser?.id || existingProfile?.user_id || '',
      username: cleanUsername,
      full_name: fullName.trim() || cleanUsername,
      profile_type: profileType,
      title: headline.trim() || 'SignTap Member',
      headline: headline.trim() || 'SignTap Member',
      about: about.trim(),
      bio: about.trim().slice(0, 220),
      profile_image: profileImage || existingProfile?.profile_image || '',
      cover_image: existingProfile?.cover_image || '',
      location: location.trim(),
      company: company.trim(),
      email: existingProfile?.email || currentUser?.email || '',
      phone: phone.trim(),
      website: website.trim(),
      portfolio_url: website.trim(),
      skills: parsedSkills,
      education:
        eduSchool.trim() && eduDegree.trim()
          ? [
              {
                id: `edu-${Date.now()}`,
                school: eduSchool.trim(),
                degree: eduDegree.trim(),
                field_of_study: eduDegree.trim(),
                start_year: '2021',
                end_year: '2025',
              },
              ...(existingProfile?.education || []),
            ]
          : existingProfile?.education || [],
      theme: existingProfile?.theme || 'signature',
      accent_color: existingProfile?.accent_color || '#0A66C2',
      button_style: existingProfile?.button_style || 'rounded',
      font_family: existingProfile?.font_family || 'sans',
      background_style: existingProfile?.background_style || 'clean',
      published,
      section_visibility: {
        ...(existingProfile?.section_visibility || {}),
        bio: true,
        contact: true,
        socials: true,
        skills: true,
        portfolio: true,
        education: true,
        experience: true,
        _onboarding_completed: markCompleted,
      } as Profile['section_visibility'],
      created_at: existingProfile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  const previewProfile = buildDraftProfile(false);
  const previewProjects: PortfolioProject[] = projTitle.trim()
    ? [
        {
          id: 'preview-proj',
          profile_id: previewProfile.id,
          title: projTitle.trim(),
          description: projDesc.trim(),
          image_url: '/images/nfc-smart-card.webp',
          project_url: projLive.trim() || projGithub.trim(),
          technologies: projTech.split(',').map((t) => t.trim()).filter(Boolean),
          category: 'Featured Work',
          display_order: 1,
          created_at: new Date().toISOString(),
        },
        ...getProjectsByProfileId(previewProfile.id),
      ]
    : getProjectsByProfileId(previewProfile.id);

  const previewLinks: SocialLink[] = [
    ...(linkedinUrl.trim()
      ? [
          {
            id: 'preview-li',
            profile_id: previewProfile.id,
            platform: 'linkedin' as const,
            label: 'LinkedIn',
            url: linkedinUrl.trim(),
            display_order: 1,
            visible: true,
          },
        ]
      : []),
    ...getLinksByProfileId(previewProfile.id),
  ];

  const completion = calculateProfileCompletion(previewProfile, previewProjects, previewLinks);

  const handleFinish = (skipForLater: boolean = false) => {
    setError('');
    if (!currentUser) return;

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      setError('Username must be at least 3 alphanumeric characters.');
      setStep(4);
      return;
    }

    const taken = getAllProfiles().find(
      (p) => p.username.toLowerCase() === cleanUsername && p.user_id !== currentUser.id
    );
    if (taken) {
      setError(`@${cleanUsername} is already taken. Please choose another handle.`);
      setStep(4);
      return;
    }

    setLoading(true);
    const finalProfile = buildDraftProfile(!skipForLater);
    saveProfile(finalProfile);

    if (projTitle.trim()) {
      saveProject({
        id: `proj-${Date.now()}`,
        profile_id: finalProfile.id,
        title: projTitle.trim(),
        description: projDesc.trim() || 'Featured project on SignTap.',
        image_url: '/images/nfc-smart-card.webp',
        project_url: projLive.trim() || projGithub.trim() || '',
        technologies: projTech.split(',').map((t) => t.trim()).filter(Boolean),
        category: 'Featured Work',
        display_order: 1,
        created_at: new Date().toISOString(),
      });
    }

    if (linkedinUrl.trim()) {
      saveLink({
        id: `link-li-${Date.now()}`,
        profile_id: finalProfile.id,
        platform: 'linkedin',
        label: 'LinkedIn',
        url: linkedinUrl.trim(),
        display_order: 1,
        visible: true,
      });
    }

    router.push('/feed');
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Logo theme="light" size="md" />
          <button
            type="button"
            onClick={() => handleFinish(true)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Continue later →
          </button>
        </div>

        {/* Stepper & Live Completion Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Step {step} of 5 · Profile Setup</span>
            <span className="font-bold text-[#0A66C2]">Profile Completion: {completion.percentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0A66C2] transition-all duration-300"
              style={{ width: `${completion.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-2 pt-1 text-[11px] font-semibold text-slate-400">
            {['Basic Identity', 'Professional Info', 'Projects', 'Digital Identity', 'Preview'].map((lbl, idx) => (
              <button
                key={lbl}
                type="button"
                onClick={() => setStep(idx + 1)}
                className={`cursor-pointer ${step === idx + 1 ? 'text-[#0A66C2]' : step > idx + 1 ? 'text-emerald-600' : ''}`}
              >
                {idx + 1}. {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h1 className="text-xl font-extrabold text-slate-900">Basic Identity</h1>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {profileImage ? (
                    <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <label className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Profile Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Professional Headline</label>
                <input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Product Engineer | Building AI & Hardware" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Role / Category</label>
                  <select value={profileType} onChange={(e) => setProfileType(e.target.value as ProfileType)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm">
                    {PROFILE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h1 className="text-xl font-extrabold text-slate-900">Professional Information</h1>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">About</label>
                <textarea rows={3} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Briefly describe your work, goals, or interests..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Industry / Organization</label>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company, Startup, or College" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Skills (comma separated)</label>
                  <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="React, Product Design, IoT" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Education (School / University)</label>
                  <input value={eduSchool} onChange={(e) => setEduSchool(e.target.value)} placeholder="e.g. IIT Madras" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Program</label>
                  <input value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} placeholder="e.g. B.Tech Computer Science" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-[#0A66C2]" /> Work & Projects
                </h1>
                <span className="text-xs text-slate-400 font-semibold">Optional</span>
              </div>
              <input value={projTitle} onChange={(e) => setProjTitle(e.target.value)} placeholder="Project Title" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
              <textarea rows={3} value={projDesc} onChange={(e) => setProjDesc(e.target.value)} placeholder="Short description of what you built..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
              <input value={projTech} onChange={(e) => setProjTech(e.target.value)} placeholder="Technologies used (comma separated)" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={projGithub} onChange={(e) => setProjGithub(e.target.value)} placeholder="GitHub Link (optional)" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
                <input value={projLive} onChange={(e) => setProjLive(e.target.value)} placeholder="Live Project URL (optional)" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#0A66C2]" /> Digital Identity
              </h1>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Public SignTap Handle *</label>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden">
                  <span className="px-3 py-2.5 bg-slate-50 text-xs text-slate-500 border-r border-slate-200">
                    signtap.click/u/
                  </span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    className="flex-1 px-3 py-2.5 text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Portfolio / Website URL" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
                <input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="LinkedIn URL (optional)" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contact Phone / WhatsApp (optional)" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                Make my public profile discoverable on SignTap
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#0A66C2]" /> Profile Preview
              </h1>
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#0A66C2] text-white font-bold flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
                    ) : (
                      (fullName || 'S').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">{fullName || username}</h2>
                    <p className="text-xs text-slate-600">{headline || 'SignTap Member'}</p>
                    <p className="text-[11px] text-[#0A66C2] font-mono mt-0.5">/u/{username}</p>
                  </div>
                </div>
                {about && <p className="text-xs text-slate-700 leading-relaxed">{about}</p>}
                {skillsInput && (
                  <div className="flex flex-wrap gap-1.5">
                    {skillsInput.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {completion.suggestions.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-[#0A66C2] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Remaining optional items ({100 - completion.percentage}%):
                  </p>
                  {completion.suggestions.slice(0, 3).map((s) => (
                    <p key={s.id}>• {s.label}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => handleFinish(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {loading ? 'Publishing...' : 'Publish & Go to Home Feed'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
