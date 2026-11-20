'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  saveProfile, 
  getOrCreateProfileForUser,
  getLinksByProfileId
} from '@/lib/store';
import { 
  Profile, 
  ProfileType, 
  WorkExperience, 
  EducationItem, 
  CertificationItem, 
  ServiceItem, 
  LanguageItem 
} from '@/lib/types';
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
  GraduationCap, 
  Award, 
  Languages, 
  Layers, 
  ExternalLink,
  MessageCircle,
  FileText,
  Sliders
} from 'lucide-react';

export default function ProfileEditorPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<'core' | 'about' | 'experience' | 'education' | 'certifications' | 'skills' | 'services' | 'languages' | 'visibility'>('core');
  const [savedToast, setSavedToast] = useState(false);

  // 1. Core Profile
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [company, setCompany] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('professional');

  // 2. About & Bio
  const [bio, setBio] = useState('');
  const [about, setAbout] = useState('');

  // 3. Work Experiences
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpLocation, setNewExpLocation] = useState('');
  const [newExpType, setNewExpType] = useState<any>('Full-time');
  const [newExpStartDate, setNewExpStartDate] = useState('');
  const [newExpEndDate, setNewExpEndDate] = useState('');
  const [newExpIsCurrent, setNewExpIsCurrent] = useState(true);
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpSkills, setNewExpSkills] = useState('');

  // 4. Education
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [newEduSchool, setNewEduSchool] = useState('');
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduField, setNewEduField] = useState('');
  const [newEduStartYear, setNewEduStartYear] = useState('');
  const [newEduEndYear, setNewEduEndYear] = useState('');
  const [newEduGrade, setNewEduGrade] = useState('');
  const [newEduDesc, setNewEduDesc] = useState('');

  // 5. Certifications
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [newCertName, setNewCertName] = useState('');
  const [newCertOrg, setNewCertOrg] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertId, setNewCertId] = useState('');

  // 6. Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // 7. Services
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  // 8. Languages
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [newLangName, setNewLangName] = useState('');
  const [newLangProficiency, setNewLangProficiency] = useState<any>('Professional');

  // 9. Section Visibility
  const [sectionVisibility, setSectionVisibility] = useState({
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
  });

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
      setHeadline(p.headline || p.title || '');
      setProfileImage(p.profile_image || '');
      setCoverImage(p.cover_image || '');
      setLocation(p.location || '');
      setEmail(p.email || '');
      setPhone(p.phone || '');
      setWebsite(p.website || '');
      setCompany(p.company || p.business_name || '');
      setWhatsappNumber(p.whatsapp_number || '');
      setProfileType(p.profile_type || 'professional');

      setBio(p.bio || '');
      setAbout(p.about || p.bio || '');

      setExperiences(p.experiences || []);
      setEducation(p.education || []);
      setCertifications(p.certifications || []);
      setSkills(p.skills || ['NFC Architecture', 'Next.js', 'System Security']);
      setServices(p.services || []);
      setLanguages(p.languages || [{ id: 'l-1', language: 'English', proficiency: 'Fluent' }]);
      setSectionVisibility({
        bio: p.section_visibility?.bio ?? true,
        contact: p.section_visibility?.contact ?? true,
        socials: p.section_visibility?.socials ?? true,
        skills: p.section_visibility?.skills ?? true,
        services: p.section_visibility?.services ?? true,
        portfolio: p.section_visibility?.portfolio ?? true,
        experience: p.section_visibility?.experience ?? true,
        education: p.section_visibility?.education ?? true,
        certifications: p.section_visibility?.certifications ?? true,
        achievements: p.section_visibility?.achievements ?? true,
        businesses: p.section_visibility?.businesses ?? true,
        languages: p.section_visibility?.languages ?? true,
        activity: p.section_visibility?.activity ?? true,
      });
      setPublished(p.published !== false);
    }
  }, []);

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim() || !newExpCompany.trim()) return;

    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      title: newExpTitle.trim(),
      company: newExpCompany.trim(),
      location: newExpLocation.trim() || undefined,
      employment_type: newExpType,
      start_date: newExpStartDate.trim() || '2024',
      end_date: newExpIsCurrent ? undefined : (newExpEndDate.trim() || 'Present'),
      is_current: newExpIsCurrent,
      description: newExpDesc.trim() || undefined,
      skills_used: newExpSkills ? newExpSkills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    };

    setExperiences([newExp, ...experiences]);
    setNewExpTitle('');
    setNewExpCompany('');
    setNewExpLocation('');
    setNewExpStartDate('');
    setNewExpEndDate('');
    setNewExpDesc('');
    setNewExpSkills('');
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduSchool.trim() || !newEduDegree.trim()) return;

    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      school: newEduSchool.trim(),
      degree: newEduDegree.trim(),
      field_of_study: newEduField.trim(),
      start_year: newEduStartYear.trim() || '2018',
      end_year: newEduEndYear.trim() || '2022',
      grade: newEduGrade.trim() || undefined,
      description: newEduDesc.trim() || undefined,
    };

    setEducation([newEdu, ...education]);
    setNewEduSchool('');
    setNewEduDegree('');
    setNewEduField('');
    setNewEduStartYear('');
    setNewEduEndYear('');
    setNewEduGrade('');
    setNewEduDesc('');
  };

  const handleRemoveEducation = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertOrg.trim()) return;

    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: newCertName.trim(),
      issuing_org: newCertOrg.trim(),
      issue_date: newCertDate.trim() || '2024',
      credential_id: newCertId.trim() || undefined,
    };

    setCertifications([newCert, ...certifications]);
    setNewCertName('');
    setNewCertOrg('');
    setNewCertDate('');
    setNewCertId('');
  };

  const handleRemoveCertification = (id: string) => {
    setCertifications(certifications.filter(c => c.id !== id));
  };

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
      { 
        title: newServiceTitle.trim(), 
        description: newServiceDesc.trim() || undefined,
        price: newServicePrice.trim() || undefined
      }
    ]);
    setNewServiceTitle('');
    setNewServiceDesc('');
    setNewServicePrice('');
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    setLanguages([
      ...languages,
      { id: `lang-${Date.now()}`, language: newLangName.trim(), proficiency: newLangProficiency }
    ]);
    setNewLangName('');
  };

  const handleRemoveLanguage = (id: string) => {
    setLanguages(languages.filter(l => l.id !== id));
  };

  const handleToggleVisibility = (key: keyof typeof sectionVisibility) => {
    setSectionVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profile) return;

    const updatedProfile: Profile = {
      ...profile,
      full_name: fullName,
      title,
      headline,
      profile_image: profileImage,
      cover_image: coverImage,
      location,
      email,
      phone,
      website,
      company,
      whatsapp_number: whatsappNumber,
      profile_type: profileType,
      bio,
      about,
      experiences,
      education,
      certifications,
      skills,
      services,
      languages,
      section_visibility: sectionVisibility,
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

  const tabs = [
    { id: 'core', label: 'Core Identity', icon: User },
    { id: 'about', label: 'About & Bio', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: experiences.length },
    { id: 'education', label: 'Education', icon: GraduationCap, count: education.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: certifications.length },
    { id: 'skills', label: 'Skills', icon: Sparkles, count: skills.length },
    { id: 'services', label: 'Services', icon: Layers, count: services.length },
    { id: 'languages', label: 'Languages', icon: Languages, count: languages.length },
    { id: 'visibility', label: 'Privacy & Sections', icon: Sliders },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile changes saved & synced to NFC cloud!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-[#087CF0]" />
            <span>Edit Professional Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain your entire professional career, credentials, and identity in one place.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/u/${profile.username}`}
            target="_blank"
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>Live Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => handleSaveAll()}
            className="px-5 py-2 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                isActive
                  ? 'bg-[#101828] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. Core Identity Tab */}
      {activeTab === 'core' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#101828] border-b border-slate-100 pb-3">
            Core Identity & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Profile Type
              </label>
              <select
                value={profileType}
                onChange={(e) => setProfileType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              >
                <option value="professional">Professional / Executive</option>
                <option value="creator">Creator / Designer</option>
                <option value="business">Business / Founder</option>
                <option value="personal">Personal / Minimal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Professional Headline * (e.g. Founder & Hardware Architect at SignBridge)
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Your LinkedIn-style headline"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Profile Image URL
              </label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98422 53267"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Location (City, Country)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bengaluru, India"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Current Organization / Company
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="SignBridge Technologies"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Primary Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://signbridge.click"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. About & Bio Tab */}
      {activeTab === 'about' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#101828] border-b border-slate-100 pb-3">
            About Summary & Bio
          </h2>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Short Bio (shown under header)
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="1-2 sentences summarizing who you are and what you do..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Complete "About" Story (LinkedIn style)
            </label>
            <textarea
              rows={6}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Write a comprehensive summary of your background, career trajectory, technical passions, and what drives you..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
            />
          </div>
        </div>
      )}

      {/* 3. Work Experience Tab */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          {/* Add Experience Form */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#101828]">
              Add Work Experience
            </h2>

            <form onSubmit={handleAddExperience} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={newExpTitle}
                    onChange={(e) => setNewExpTitle(e.target.value)}
                    placeholder="e.g. Founder & Chief Hardware Architect"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={newExpCompany}
                    onChange={(e) => setNewExpCompany(e.target.value)}
                    placeholder="e.g. SignBridge Technologies"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={newExpLocation}
                    onChange={(e) => setNewExpLocation(e.target.value)}
                    placeholder="Bengaluru, India"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Employment Type</label>
                  <select
                    value={newExpType}
                    onChange={(e) => setNewExpType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Co-Founder">Co-Founder</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="text"
                    value={newExpStartDate}
                    onChange={(e) => setNewExpStartDate(e.target.value)}
                    placeholder="Jan 2024"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currentJob"
                  checked={newExpIsCurrent}
                  onChange={(e) => setNewExpIsCurrent(e.target.checked)}
                  className="w-4 h-4 rounded text-[#087CF0] focus:ring-[#087CF0]"
                />
                <label htmlFor="currentJob" className="text-xs font-medium text-slate-700 cursor-pointer">
                  I currently work in this role
                </label>
              </div>

              {!newExpIsCurrent && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="text"
                    value={newExpEndDate}
                    onChange={(e) => setNewExpEndDate(e.target.value)}
                    placeholder="Dec 2023"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description / Key Accomplishments</label>
                <textarea
                  rows={2}
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  placeholder="Led the architecture, scaled deployment, reduced latency..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Skills Used (comma separated)</label>
                <input
                  type="text"
                  value={newExpSkills}
                  onChange={(e) => setNewExpSkills(e.target.value)}
                  placeholder="NTAG216, Next.js, Embedded Systems, IoT"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                />
              </div>

              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-[#101828] text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#087CF0]" />
                <span>Add Role</span>
              </button>
            </form>
          </div>

          {/* List of Experiences */}
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#101828]">{exp.title}</h3>
                    {exp.is_current && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#087CF0]">{exp.company} · {exp.employment_type || 'Full-time'}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date} {exp.location ? `· ${exp.location}` : ''}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.skills_used && exp.skills_used.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {exp.skills_used.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRemoveExperience(exp.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Education Tab */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#101828]">
              Add Education
            </h2>

            <form onSubmit={handleAddEducation} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">School / University *</label>
                  <input
                    type="text"
                    required
                    value={newEduSchool}
                    onChange={(e) => setNewEduSchool(e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Degree *</label>
                  <input
                    type="text"
                    required
                    value={newEduDegree}
                    onChange={(e) => setNewEduDegree(e.target.value)}
                    placeholder="e.g. Bachelor of Technology (B.Tech)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={newEduField}
                    onChange={(e) => setNewEduField(e.target.value)}
                    placeholder="Computer Science & Engineering"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Start Year</label>
                  <input
                    type="text"
                    value={newEduStartYear}
                    onChange={(e) => setNewEduStartYear(e.target.value)}
                    placeholder="2017"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">End Year (or Expected)</label>
                  <input
                    type="text"
                    value={newEduEndYear}
                    onChange={(e) => setNewEduEndYear(e.target.value)}
                    placeholder="2021"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Grade / Distinction</label>
                <input
                  type="text"
                  value={newEduGrade}
                  onChange={(e) => setNewEduGrade(e.target.value)}
                  placeholder="First Class with Distinction (8.9 CGPA)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                />
              </div>

              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-[#101828] text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#087CF0]" />
                <span>Add Education</span>
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#101828]">{edu.school}</h3>
                  <p className="text-xs font-medium text-[#087CF0]">{edu.degree} · {edu.field_of_study}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{edu.start_year} — {edu.end_year} {edu.grade ? `· ${edu.grade}` : ''}</p>
                  {edu.description && <p className="text-xs text-slate-600 mt-2">{edu.description}</p>}
                </div>

                <button
                  onClick={() => handleRemoveEducation(edu.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#101828]">
              Add Certification or License
            </h2>

            <form onSubmit={handleAddCertification} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Certification Name *</label>
                  <input
                    type="text"
                    required
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                    placeholder="e.g. Certified IoT Systems Architect"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={newCertOrg}
                    onChange={(e) => setNewCertOrg(e.target.value)}
                    placeholder="e.g. IEEE Computer Society"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={newCertDate}
                    onChange={(e) => setNewCertDate(e.target.value)}
                    placeholder="Oct 2023"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    value={newCertId}
                    onChange={(e) => setNewCertId(e.target.value)}
                    placeholder="IEEE-IOT-84920"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-[#101828] text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#087CF0]" />
                <span>Add Certification</span>
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#101828]">{cert.name}</h3>
                  <p className="text-xs font-medium text-[#087CF0]">{cert.issuing_org}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Issued {cert.issue_date} {cert.credential_id ? `· ID: ${cert.credential_id}` : ''}</p>
                </div>

                <button
                  onClick={() => handleRemoveCertification(cert.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Skills Tab */}
      {activeTab === 'skills' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#101828] border-b border-slate-100 pb-3">
            Skills & Expertise
          </h2>

          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. NFC Architecture, TypeScript, Web NFC"
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
            />
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#087CF0] text-white text-xs font-bold hover:bg-[#0668cc] transition-colors"
            >
              Add Skill
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold group hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 group-hover:text-rose-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7. Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#101828]">
              Add Service Offering
            </h2>

            <form onSubmit={handleAddService} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    placeholder="e.g. Custom NFC Fleet Deployment"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Rate / Starting Price</label>
                  <input
                    type="text"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    placeholder="e.g. ₹4,999 onwards"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Service Description</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Enterprise-grade smart card architecture for company executives..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-[#101828] text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#087CF0]" />
                <span>Add Service</span>
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {services.map((serv, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#101828]">{serv.title}</h3>
                    {serv.price && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                        {serv.price}
                      </span>
                    )}
                  </div>
                  {serv.description && <p className="text-xs text-slate-600">{serv.description}</p>}
                </div>

                <button
                  onClick={() => handleRemoveService(idx)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Languages Tab */}
      {activeTab === 'languages' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#101828] border-b border-slate-100 pb-3">
            Languages Spoken
          </h2>

          <form onSubmit={handleAddLanguage} className="flex gap-2">
            <input
              type="text"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              placeholder="e.g. English, Tamil, Hindi, German"
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
            />
            <select
              value={newLangProficiency}
              onChange={(e) => setNewLangProficiency(e.target.value as any)}
              className="p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
            >
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Professional">Professional</option>
              <option value="Conversational">Conversational</option>
            </select>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#087CF0] text-white text-xs font-bold hover:bg-[#0668cc] transition-colors"
            >
              Add
            </button>
          </form>

          <div className="space-y-2 pt-2">
            {languages.map((lang) => (
              <div key={lang.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#101828]">{lang.language}</span>
                  <span className="text-slate-400 ml-2 font-mono">({lang.proficiency})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(lang.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Privacy & Section Visibility Tab */}
      {activeTab === 'visibility' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#101828]">
              Section Visibility & Privacy
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose which sections appear publicly when someone taps your physical NFC card or visits your URL.
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(sectionVisibility).map(([key, isVisible]) => (
              <div key={key} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <span className="text-xs font-bold text-slate-800 capitalize">
                  {key} Section
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleVisibility(key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isVisible 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-3">
        <button
          onClick={() => handleSaveAll()}
          className="px-8 py-3 rounded-2xl bg-[#101828] hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95"
        >
          <Save className="w-4 h-4 text-[#087CF0]" />
          <span>Save All Profile Changes</span>
        </button>
      </div>
    </div>
  );
}
