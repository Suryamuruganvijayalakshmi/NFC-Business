'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  saveProfile, 
  getOrCreateProfileForUser,
  getSectionsByProfileId,
  getLinksByProfileId,
  saveLink,
  getProjectsByProfileId
} from '@/lib/store';
import { Profile, ProfileType, ProfileSection, SocialLink, ServiceItem } from '@/lib/types';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import SignatureTemplate from '@/components/templates/SignatureTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import { 
  Save, 
  User, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  MessageCircle,
  FileText,
  Check,
  ExternalLink,
  Smartphone
} from 'lucide-react';

export default function ProfileEditorPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [savedToast, setSavedToast] = useState(false);
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);

  // 1. Personal Information
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

  // 2. Professional Information
  const [businessDescription, setBusinessDescription] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // 3. Contact Options & WhatsApp
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // 4. Publishing & Status
  const [published, setPublished] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
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
      setBusinessDescription(p.business_description || '');
      setPortfolioUrl(p.portfolio_url || '');
      setResumeUrl(p.resume_url || '');
      setSkills(p.skills || ['NFC Architecture', 'Next.js', 'System Security']);
      setServices(p.services || [
        { title: 'Digital Identity Consulting', description: 'Transforming brand networking into contactless digital touchpoints.' }
      ]);
      setWhatsappNumber(p.whatsapp_number || '');
      setPublished(p.published !== false);

      setLinks(getLinksByProfileId(p.id));
    }
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;
    setServices([
      ...services,
      { title: newServiceTitle.trim(), description: newServiceDesc.trim() }
    ]);
    setNewServiceTitle('');
    setNewServiceDesc('');
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

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
      business_description: businessDescription,
      portfolio_url: portfolioUrl,
      resume_url: resumeUrl,
      skills,
      services,
      whatsapp_number: whatsappNumber,
      published,
      updated_at: new Date().toISOString(),
    };

    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#087CF0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Live mockup profile object
  const previewProfile: Profile = {
    ...profile,
    full_name: fullName || 'Your Name',
    title: title || 'Professional Designation',
    bio: bio || 'Your bio will appear here...',
    profile_image: profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    cover_image: coverImage,
    location,
    email,
    phone,
    website,
    company,
    skills,
    services,
    whatsapp_number: whatsappNumber,
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile changes saved and published to your NFC smart card!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101828]">
            Edit Digital Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update personal, professional, and contact details linked to your SignBridge NFC Card.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowLivePreviewModal(!showLivePreviewModal)}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <Smartphone className="w-4 h-4 text-[#087CF0]" />
            <span>{showLivePreviewModal ? 'Hide Live Preview' : 'Mobile Preview'}</span>
          </button>

          <a
            href={`/u/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#101828] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <span>Live URL</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#087CF0]" />
          </a>
        </div>
      </div>

      {/* Editor Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Container */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          
          {/* Publish / Privacy Status Toggle */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${published ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                {published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#101828]">Profile Visibility Status</h4>
                <p className="text-xs text-slate-500">
                  {published ? 'Published & reachable by public NFC visitors' : 'Private / Draft mode (visitors see a private notice)'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                published ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {published ? 'Published' : 'Draft / Private'}
            </button>
          </div>

          {/* 1. Personal Information */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-[#087CF0]" />
              <h3 className="font-bold text-sm text-[#101828] uppercase tracking-wider">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hardware Architect or Motion Designer"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. SignBridge Technologies"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Location (City, Country)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Short Biography
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Introduce yourself, your mission, and what you are building..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Cover Header Banner URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>
          </div>

          {/* 2. Contact Information & WhatsApp */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="w-4 h-4 text-[#FF7900]" />
              <h3 className="font-bold text-sm text-[#101828] uppercase tracking-wider">
                Contact Options (For 1-Tap Save & Calling)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Public Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  WhatsApp Direct Number
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+919876543210 (Country code, no spaces)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Website / Portfolio
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://signbridge.click"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>
          </div>

          {/* 3. Professional Information: Skills & Services */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Briefcase className="w-4 h-4 text-[#087CF0]" />
              <h3 className="font-bold text-sm text-[#101828] uppercase tracking-wider">
                Professional Credentials & Skills
              </h3>
            </div>

            {/* Skills Tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Core Competencies & Skills
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-medium text-[#087CF0]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-600 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. Hardware Security, Product Design)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Add Skill
                </button>
              </div>
            </div>

            {/* Services Offered */}
            <div className="pt-2 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Services / Offerings
              </label>

              <div className="space-y-2">
                {services.map((serv, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                    <div>
                      <h5 className="font-bold text-xs text-[#101828]">{serv.title}</h5>
                      {serv.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{serv.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl border border-dashed border-slate-200 space-y-2">
                <input
                  type="text"
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  placeholder="New Service Title (e.g. Enterprise NFC Deployment)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
                <input
                  type="text"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Short description of this service..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-slate-500">
              Changes sync instantly to your live card URL.
            </span>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-sm font-semibold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Profile</span>
            </button>
          </div>

        </form>

        {/* Live Side Preview Drawer / Panel */}
        <div className={`lg:col-span-5 sticky top-24 ${showLivePreviewModal ? 'block' : 'hidden lg:block'}`}>
          <div className="p-4 rounded-3xl bg-[#101828] text-white shadow-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Mobile Preview
              </span>
              <span className="text-[10px] text-[#087CF0] uppercase font-bold tracking-wider font-mono">
                /u/{profile.username}
              </span>
            </div>

            {/* Mobile frame */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#131B2E] max-h-[600px] overflow-y-auto">
              <SignatureTemplate
                profile={previewProfile}
                links={links}
                isPreview={true}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
