'use client';

import React, { useState } from 'react';
import {
  Profile,
  WorkExperience,
  EducationItem,
  CertificationItem,
  PortfolioProject,
  SocialLink,
  SocialPlatform,
} from '@/lib/types';
import {
  saveProfile,
  getProjectsByProfileId,
  saveProject,
  deleteProject,
  getLinksByProfileId,
  saveLink,
  deleteLink,
} from '@/lib/store';
import {
  X,
  Save,
  Plus,
  Trash2,
  Loader2,
  Upload,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';

export type ProfileEditTab =
  | 'basic'
  | 'about'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'socials'
  | 'contact';

interface ProfileEditModalProps {
  profile: Profile;
  initialTab?: ProfileEditTab;
  onClose: () => void;
  onSaved: (updated: Profile) => void;
}

function compressImageFile(file: File, maxWidth: number, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Invalid image file.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(ev.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfileEditModal({
  profile,
  initialTab = 'basic',
  onClose,
  onSaved,
}: ProfileEditModalProps) {
  const [tab, setTab] = useState<ProfileEditTab>(initialTab);
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [headline, setHeadline] = useState(profile.headline || profile.title || '');
  const [location, setLocation] = useState(profile.location || '');
  const [company, setCompany] = useState(profile.company || '');
  const [about, setAbout] = useState(profile.about || profile.bio || '');
  const [profileImage, setProfileImage] = useState(profile.profile_image || '');
  const [coverImage, setCoverImage] = useState(profile.cover_image || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [published, setPublished] = useState(profile.published !== false);

  // Skills
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Experience
  const [experiences, setExperiences] = useState<WorkExperience[]>(profile.experiences || []);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');
  const [expCurrent, setExpCurrent] = useState(true);
  const [expDesc, setExpDesc] = useState('');

  // Education
  const [education, setEducation] = useState<EducationItem[]>(profile.education || []);
  const [eduSchool, setEduSchool] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduStart, setEduStart] = useState('');
  const [eduEnd, setEduEnd] = useState('');

  // Projects
  const [projects, setProjects] = useState<PortfolioProject[]>(() => getProjectsByProfileId(profile.id));
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projImage, setProjImage] = useState('');
  const [projUrl, setProjUrl] = useState('');
  const [projTech, setProjTech] = useState('');

  // Certifications
  const [certifications, setCertifications] = useState<CertificationItem[]>(profile.certifications || []);
  const [certName, setCertName] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certDate, setCertDate] = useState('');

  // Social Links
  const [links, setLinks] = useState<SocialLink[]>(() => getLinksByProfileId(profile.id));
  const [linkPlatform, setLinkPlatform] = useState<SocialPlatform>('linkedin');
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const [uploadingTarget, setUploadingTarget] = useState<'avatar' | 'cover' | 'project' | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'avatar' | 'cover' | 'project'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploadingTarget(target);
    try {
      const maxWidth = target === 'avatar' ? 512 : 1280;
      const compressedDataUrl = await compressImageFile(file, maxWidth, 0.84);
      if (target === 'avatar') setProfileImage(compressedDataUrl);
      else if (target === 'cover') setCoverImage(compressedDataUrl);
      else setProjImage(compressedDataUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process selected image.');
    } finally {
      setUploadingTarget(null);
      e.target.value = '';
    }
  };

  const handleAddSkill = () => {
    const clean = newSkill.trim();
    if (!clean || skills.includes(clean)) return;
    setSkills([...skills, clean]);
    setNewSkill('');
  };

  const handleAddExperience = () => {
    if (!expRole.trim() || !expCompany.trim()) return;
    setExperiences([
      {
        id: `exp-${Date.now()}`,
        title: expRole.trim(),
        company: expCompany.trim(),
        start_date: expStart.trim() || '2025',
        end_date: expCurrent ? undefined : expEnd.trim() || undefined,
        is_current: expCurrent,
        description: expDesc.trim() || undefined,
      },
      ...experiences,
    ]);
    setExpRole('');
    setExpCompany('');
    setExpStart('');
    setExpEnd('');
    setExpDesc('');
  };

  const handleAddEducation = () => {
    if (!eduSchool.trim() || !eduDegree.trim()) return;
    setEducation([
      {
        id: `edu-${Date.now()}`,
        school: eduSchool.trim(),
        degree: eduDegree.trim(),
        field_of_study: eduField.trim() || eduDegree.trim(),
        start_year: eduStart.trim() || '2020',
        end_year: eduEnd.trim() || '2024',
      },
      ...education,
    ]);
    setEduSchool('');
    setEduDegree('');
    setEduField('');
    setEduStart('');
    setEduEnd('');
  };

  const handleAddProject = () => {
    if (!projTitle.trim()) return;
    const newProj: PortfolioProject = {
      id: `proj-${Date.now()}`,
      profile_id: profile.id,
      title: projTitle.trim(),
      description: projDesc.trim() || 'Featured project on SignTap.',
      image_url: projImage || '/images/nfc-smart-card.webp',
      project_url: projUrl.trim() || undefined,
      technologies: projTech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      category: 'Featured Work',
      display_order: projects.length + 1,
      created_at: new Date().toISOString(),
    };
    saveProject(newProj);
    setProjects([...projects, newProj]);
    setProjTitle('');
    setProjDesc('');
    setProjImage('');
    setProjUrl('');
    setProjTech('');
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleAddCertification = () => {
    if (!certName.trim() || !certOrg.trim()) return;
    setCertifications([
      {
        id: `cert-${Date.now()}`,
        name: certName.trim(),
        issuing_organization: certOrg.trim(),
        issue_date: certDate.trim() || '2025',
      },
      ...certifications,
    ]);
    setCertName('');
    setCertOrg('');
    setCertDate('');
  };

  const handleAddSocialLink = () => {
    if (!linkUrl.trim()) return;
    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      profile_id: profile.id,
      platform: linkPlatform,
      label: linkLabel.trim() || linkPlatform.toUpperCase(),
      url: linkUrl.trim(),
      display_order: links.length + 1,
      visible: true,
    };
    saveLink(newLink);
    setLinks([...links, newLink]);
    setLinkLabel('');
    setLinkUrl('');
  };

  const handleDeleteSocialLink = (id: string) => {
    deleteLink(id);
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    setSaving(true);
    const updated: Profile = {
      ...profile,
      full_name: fullName.trim(),
      headline: headline.trim(),
      title: headline.trim() || profile.title,
      location: location.trim(),
      company: company.trim(),
      about: about.trim(),
      bio: about.trim().slice(0, 220),
      profile_image: profileImage || profile.profile_image,
      cover_image: coverImage || profile.cover_image,
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
      published,
      skills,
      experiences,
      education,
      certifications,
      updated_at: new Date().toISOString(),
    };

    saveProfile(updated);
    setSaving(false);
    onSaved(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit LinkedIn-Style Profile</h2>
            <p className="text-xs text-slate-500">Upload photos directly and manage all your professional sections.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {([
            ['basic', 'Intro & Photos'],
            ['about', 'About'],
            ['experience', 'Experience'],
            ['education', 'Education'],
            ['skills', 'Skills'],
            ['projects', 'Projects'],
            ['certifications', 'Certifications'],
            ['socials', 'Social Links'],
            ['contact', 'Contact & Privacy'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                tab === key ? 'bg-[#0A66C2] text-white' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {tab === 'basic' && (
            <div className="space-y-5">
              {/* Direct Image Uploads for Cover & Profile Photo */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Cover Banner Image</label>
                <div className="relative h-28 rounded-xl border border-dashed border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> No cover uploaded
                    </span>
                  )}
                  <label className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm">
                    {uploadingTarget === 'cover' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{coverImage ? 'Change Cover' : 'Upload Cover'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'cover')}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full border-2 border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-slate-400">{fullName.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-700">Profile Photograph</p>
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold cursor-pointer">
                    {uploadingTarget === 'avatar' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                    <span>Upload Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'avatar')}
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">JPG, PNG or WebP — automatically optimized.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Professional Headline</label>
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Founder & Full-Stack Engineer | Building AI & IoT"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Company</label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company or University"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'about' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">About / Professional Summary</label>
                <textarea
                  rows={6}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Share your background, mission, and what you're building..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          )}

          {tab === 'experience' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-700">Add Work Experience</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={expRole} onChange={(e) => setExpRole(e.target.value)} placeholder="Job Title / Role *" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="Company / Organization *" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={expStart} onChange={(e) => setExpStart(e.target.value)} placeholder="Start Date (e.g. Jan 2024)" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  {!expCurrent && (
                    <input value={expEnd} onChange={(e) => setExpEnd(e.target.value)} placeholder="End Date (e.g. Dec 2025)" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" checked={expCurrent} onChange={(e) => setExpCurrent(e.target.checked)} />
                  I currently work in this role
                </label>
                <textarea rows={2} value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="Key responsibilities or impact (optional)" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-bold cursor-pointer"
                >
                  + Add Experience
                </button>
              </div>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{exp.title}</p>
                      <p className="text-xs text-slate-500">
                        {exp.company} · {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date || ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExperiences(experiences.filter((x) => x.id !== exp.id))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'education' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-700">Add Education</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={eduSchool} onChange={(e) => setEduSchool(e.target.value)} placeholder="School / University *" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} placeholder="Degree (e.g. B.Tech) *" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input value={eduField} onChange={(e) => setEduField(e.target.value)} placeholder="Field of study" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={eduStart} onChange={(e) => setEduStart(e.target.value)} placeholder="Start Year" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={eduEnd} onChange={(e) => setEduEnd(e.target.value)} placeholder="End Year" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-bold cursor-pointer"
                >
                  + Add Education
                </button>
              </div>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{edu.school}</p>
                      <p className="text-xs text-slate-500">{edu.degree} · {edu.field_of_study}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEducation(education.filter((x) => x.id !== edu.id))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'skills' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g. TypeScript, Product Strategy)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0A66C2] text-xs font-semibold border border-blue-200"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setSkills(skills.filter((item) => item !== s))}
                      className="text-blue-500 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {tab === 'projects' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-700">Add Portfolio Project</p>
                <input value={projTitle} onChange={(e) => setProjTitle(e.target.value)} placeholder="Project Title *" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                <textarea rows={2} value={projDesc} onChange={(e) => setProjDesc(e.target.value)} placeholder="Project description & problem solved..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={projTech} onChange={(e) => setProjTech(e.target.value)} placeholder="Technologies (comma separated)" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={projUrl} onChange={(e) => setProjUrl(e.target.value)} placeholder="Live Demo or GitHub URL (optional)" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer">
                    {uploadingTarget === 'project' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{projImage ? 'Change Project Image' : 'Upload Project Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'project')} />
                  </label>
                  {projImage && <img src={projImage} alt="Project preview" className="w-12 h-8 rounded object-cover border border-slate-200" />}
                </div>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-bold cursor-pointer"
                >
                  + Add Project
                </button>
              </div>
              <div className="space-y-2">
                {projects.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.image_url && <img src={p.image_url} alt={p.title} className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{p.title}</p>
                        <p className="text-xs text-slate-500 truncate">{p.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'certifications' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-700">Add License / Certification</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input value={certName} onChange={(e) => setCertName(e.target.value)} placeholder="Certification Name *" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={certOrg} onChange={(e) => setCertOrg(e.target.value)} placeholder="Issuing Organization *" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={certDate} onChange={(e) => setCertDate(e.target.value)} placeholder="Issue Date" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                </div>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-bold cursor-pointer"
                >
                  + Add Certification
                </button>
              </div>
              <div className="space-y-2">
                {certifications.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.issuing_organization} · {c.issue_date}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCertifications(certifications.filter((x) => x.id !== c.id))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'socials' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-700">Add Social / External Link</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={linkPlatform}
                    onChange={(e) => setLinkPlatform(e.target.value as SocialPlatform)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="x">X / Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="website">Website</option>
                    <option value="behance">Behance</option>
                    <option value="dribbble">Dribbble</option>
                  </select>
                  <input value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} placeholder="Label (optional)" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                </div>
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-bold cursor-pointer"
                >
                  + Add Link
                </button>
              </div>
              <div className="space-y-2">
                {links.map((l) => (
                  <div key={l.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">{l.label || l.platform}</p>
                      <p className="text-xs text-slate-500 truncate">{l.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSocialLink(l.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Public Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Website / Portfolio</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm" />
              </div>
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-800">Public Profile Visibility</p>
                  <p className="text-[11px] text-slate-500">Allow SignTap members and NFC taps to view your profile</p>
                </div>
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4 text-[#0A66C2]" />
              </label>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
