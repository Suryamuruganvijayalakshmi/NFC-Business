'use client';

import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  saveProfile, 
  getAllProfiles,
  getSectionsByProfileId,
  saveSection,
  deleteSection
} from '@/lib/store';
import { Profile, ProfileType, ProfileSection } from '@/lib/types';
import { 
  Save, 
  User, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  MessageCircle
} from 'lucide-react';

export default function ProfileEditorPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [savedToast, setSavedToast] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [company, setCompany] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('professional');

  // Custom section state
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionType, setNewSectionType] = useState<any>('skills');
  const [newSkillTag, setNewSkillTag] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      const all = getAllProfiles();
      p = all[0] || null;
    }

    if (p) {
      setProfile(p);
      setFullName(p.full_name || '');
      setTitle(p.title || '');
      setBio(p.bio || '');
      setProfileImage(p.profile_image || '');
      setCoverImage(p.cover_image || '');
      setLocation(p.location || '');
      setEmail(p.email || '');
      setPhone(p.phone || '');
      setWebsite(p.website || '');
      setCompany(p.company || p.business_name || '');
      setWhatsappNumber(p.whatsapp_number || '');
      setProfileType(p.profile_type || 'professional');

      setSections(getSectionsByProfileId(p.id));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updatedProfile: Profile = {
      ...profile,
      full_name: fullName,
      title,
      bio,
      profile_image: profileImage,
      cover_image: coverImage,
      location,
      email,
      phone,
      website,
      company,
      business_name: company,
      whatsapp_number: whatsappNumber,
      profile_type: profileType,
      updated_at: new Date().toISOString(),
    };

    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleAddSkillToSection = (sectionId: string) => {
    if (!newSkillTag.trim()) return;
    const sec = sections.find(s => s.id === sectionId);
    if (!sec) return;

    const currentTags = sec.content_json?.tags || [];
    const updated = {
      ...sec,
      content_json: {
        ...sec.content_json,
        tags: [...currentTags, newSkillTag.trim()]
      }
    };
    saveSection(updated);
    setSections(sections.map(s => s.id === sectionId ? updated : s));
    setNewSkillTag('');
  };

  const handleRemoveSkillFromSection = (sectionId: string, tagToRemove: string) => {
    const sec = sections.find(s => s.id === sectionId);
    if (!sec) return;

    const currentTags = sec.content_json?.tags || [];
    const updated = {
      ...sec,
      content_json: {
        ...sec.content_json,
        tags: currentTags.filter((t: string) => t !== tagToRemove)
      }
    };
    saveSection(updated);
    setSections(sections.map(s => s.id === sectionId ? updated : s));
  };

  const handleToggleSectionVisibility = (sectionId: string) => {
    const sec = sections.find(s => s.id === sectionId);
    if (!sec) return;

    const updated = { ...sec, visible: !sec.visible };
    saveSection(updated);
    setSections(sections.map(s => s.id === sectionId ? updated : s));
  };

  const handleDeleteSection = (sectionId: string) => {
    deleteSection(sectionId);
    setSections(sections.filter(s => s.id !== sectionId));
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Profile Editor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customize your identity details, professional bio, and archetype sections.
          </p>
        </div>

        {savedToast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Basic Information Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Basic Information
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              @{profile.username}
            </span>
          </div>

          {/* Profile Type Radio Badges */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Profile Category Archetype
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['professional', 'creator', 'business', 'personal'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProfileType(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    profileType === type
                      ? 'bg-[#087CF0] text-white border-[#087CF0] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar & Cover Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Profile Photo URL
              </label>
              <div className="flex items-center gap-3 mt-1.5">
                <img 
                  src={profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200 flex-shrink-0" 
                />
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Cover Banner URL
              </label>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>
          </div>

          {/* Full Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Surya Narayanan"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Professional Title / Headline</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Founder & Hardware Architect"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">Short Bio / Overview</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell visitors who you are and what you are building..."
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
            />
          </div>

          {/* Company / Business Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Company / Organization</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="SignBridge Inc."
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bengaluru, India"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>
          </div>

          {/* Contact Details (Email, Phone, Website, WhatsApp) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="surya@signbridge.click"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Contact Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://signbridge.click"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">WhatsApp Direct Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+919876543210"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>
          </div>

        </div>

        {/* Dynamic Profile Sections */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Profile Sections & Skills
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control which sections appear on your public profile.
            </p>
          </div>

          <div className="space-y-4">
            {sections.map((sec) => (
              <div 
                key={sec.id}
                className={`p-4 rounded-2xl border transition-all ${
                  sec.visible ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#087CF0]">
                      {sec.section_type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {sec.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSectionVisibility(sec.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs flex items-center gap-1"
                    >
                      {sec.visible ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSection(sec.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                      title="Delete section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section Content: Skills tags */}
                {sec.section_type === 'skills' && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(sec.content_json?.tags || []).map((tag: string, idx: number) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
                          {tag}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSkillFromSection(sec.id, tag)} 
                            className="text-slate-400 hover:text-rose-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newSkillTag}
                        onChange={(e) => setNewSkillTag(e.target.value)}
                        placeholder="Add new skill (e.g. NFC Protocols, Python)..."
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSkillToSection(sec.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-[#087CF0] text-white text-sm font-bold hover:bg-[#0668cc] transition-all shadow-xl shadow-blue-500/25 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
}
