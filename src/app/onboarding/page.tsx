'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getAllProfiles, 
  saveProfile, 
  saveNFCCard,
  saveLink
} from '@/lib/store';
import { Profile, ProfileType, NFCCard, SocialLink } from '@/lib/types';
import { 
  Sparkles, 
  User, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Palette, 
  Building,
  GraduationCap,
  Wifi,
  ShieldCheck,
  Globe
} from 'lucide-react';

const profileCategories: { id: ProfileType; title: string; desc: string; icon: any }[] = [
  { id: 'professional', title: 'Professional', desc: 'Consultants, executives, developers & engineers', icon: Briefcase },
  { id: 'creator', title: 'Creator & Artist', desc: 'Designers, YouTubers, photographers & writers', icon: Palette },
  { id: 'personal', title: 'Student & Individual', desc: 'Students, graduates, resumes & social identity', icon: GraduationCap },
  { id: 'business', title: 'Business & Agency', desc: 'Startups, corporate sales teams & enterprises', icon: Building },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('professional');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    // If user already has an active profile, they can proceed to dashboard
    const existing = getProfileByUserId(user.id);
    if (existing && existing.title && existing.title !== 'Digital Identity Pioneer' && existing.title !== 'SignBridge Pioneer') {
      router.push('/dashboard');
      return;
    }

    // Pre-populate fields from Google or session metadata
    if (user.user_metadata) {
      const meta = user.user_metadata as any;
      if (meta.full_name) setFullName(meta.full_name);
      else if (meta.name) setFullName(meta.name);
      if (meta.username) setUsername(meta.username);
      if (meta.profile_type) setProfileType(meta.profile_type);
    }
    if (!username && user.email) {
      const suggested = user.email.split('@')[0].replace(/[^a-z0-9_-]/g, '').toLowerCase();
      setUsername(suggested);
    }
  }, [router]);

  const handleFinishOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      setError('Username must be at least 3 alphanumeric characters.');
      return;
    }

    // Check if username taken by another user
    const all = getAllProfiles();
    const taken = all.find(p => p.username.toLowerCase() === cleanUsername && p.user_id !== currentUser?.id);
    if (taken) {
      setError(`The username "${cleanUsername}" is already claimed. Please choose another.`);
      return;
    }

    setLoading(true);

    try {
      const user = currentUser;
      const profileId = `prof-${Date.now()}`;

      const newProfile: Profile = {
        id: profileId,
        user_id: user.id,
        username: cleanUsername,
        full_name: fullName.trim() || cleanUsername,
        profile_type: profileType,
        title: title.trim() || 'Professional & Innovator',
        bio: bio.trim() || `Welcome to my official digital identity page. Connect with me or save my contact details below.`,
        profile_image: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
        email: user.email || '',
        phone: phone.trim() || '',
        location: location.trim() || '',
        website: website.trim() || '',
        theme: profileType === 'creator' ? 'creative' : 'signature',
        accent_color: '#087CF0',
        button_style: 'rounded',
        font_family: 'sans',
        background_style: 'navy_grid',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      saveProfile(newProfile);

      // Create their unique NFC card
      const newCard: NFCCard = {
        id: `card-${Date.now()}`,
        card_uid: `SB-CARD-${Math.floor(1000 + Math.random() * 9000)}`,
        owner_user_id: user.id,
        profile_id: newProfile.id,
        card_name: `${newProfile.full_name}'s Smart Card`,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      saveNFCCard(newCard);

      // Add a starter link if website provided
      if (website.trim()) {
        const starterLink: SocialLink = {
          id: `link-${Date.now()}`,
          profile_id: newProfile.id,
          platform: 'website',
          label: 'My Official Website',
          url: website.startsWith('http') ? website : `https://${website}`,
          display_order: 1,
          visible: true,
        };
        saveLink(starterLink);
      }

      // Route directly to their personalized dashboard!
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to complete profile creation.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <Logo theme="light" size="lg" className="inline-block mb-3" />
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#087CF0]/10 text-[#087CF0] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Step 1 of 1: Welcome to SignBridge
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
          Claim Your Digital Identity Page
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Set up your unique public link and contactless profile. You can modify any details later from your dashboard.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200">
          
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="font-semibold">Notice:</span> {error}
            </div>
          )}

          <form onSubmit={handleFinishOnboarding} className="space-y-6">
            
            {/* 1. Unique Profile URL */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                1. Choose Your Unique Public Handle <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                This is the web link written to your physical NFC Smart Card and QR code.
              </p>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-mono font-medium text-slate-400 select-none">
                  signbridge.click/id/
                </span>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="yourname"
                  className="w-full pl-40 sm:pl-42 pr-3.5 py-3 rounded-xl border border-slate-200 text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087CF0] bg-slate-50/50"
                />
              </div>
            </div>

            {/* 2. Full Name & Professional Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Surya Narayanan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Title / Role <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Founder & Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                  <Briefcase className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 3. Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Profile Category
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {profileCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = profileType === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setProfileType(cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#087CF0] bg-[#087CF0]/5 ring-1 ring-[#087CF0]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#087CF0]' : 'text-slate-400'}`} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#087CF0]' : 'text-slate-800'}`}>
                          {cat.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Bio / Introduction
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe what you do, your achievements, or who you'd like to meet."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            {/* 5. Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Location (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bangalore, India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Website / Portfolio Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portfolio or Company Website (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
                <Globe className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-[#087CF0] text-white text-sm font-semibold hover:bg-[#0668cc] transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Configuring Your Identity...' : 'Launch My Digital Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-[#087CF0]" /> NFC Ready
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Encrypted Identity
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Instant vCard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
