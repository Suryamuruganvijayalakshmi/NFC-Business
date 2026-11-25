'use client';

import React, { useState } from 'react';
import { Profile, WorkExperience, EducationItem } from '@/lib/types';
import { saveProfile } from '@/lib/store';
import { X, Save, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

interface ProfileEditModalProps {
  profile: Profile;
  initialTab?: 'basic' | 'about' | 'skills' | 'experience' | 'education' | 'contact';
  onClose: () => void;
  onSaved: (updated: Profile) => void;
}

export default function ProfileEditModal({
  profile,
  initialTab = 'basic',
  onClose,
  onSaved,
}: ProfileEditModalProps) {
  const [tab, setTab] = useState(initialTab);
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

  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const [experiences, setExperiences] = useState<WorkExperience[]>(profile.experiences || []);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expStart, setExpStart] = useState('');

  const [education, setEducation] = useState<EducationItem[]>(profile.education || []);
  const [eduSchool, setEduSchool] = useState('');
  const [eduDegree, setEduDegree] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
        is_current: true,
      },
      ...experiences,
    ]);
    setExpRole('');
    setExpCompany('');
    setExpStart('');
  };

  const handleAddEducation = () => {
    if (!eduSchool.trim() || !eduDegree.trim()) return;
    setEducation([
      {
        id: `edu-${Date.now()}`,
        school: eduSchool.trim(),
        degree: eduDegree.trim(),
        field_of_study: eduDegree.trim(),
        start_year: '2020',
        end_year: '2024',
      },
      ...education,
    ]);
    setEduSchool('');
    setEduDegree('');
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
      profile_image: profileImage.trim() || profile.profile_image,
      cover_image: coverImage.trim() || profile.cover_image,
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
      published,
      skills,
      experiences,
      education,
      updated_at: new Date().toISOString(),
    };

    saveProfile(updated);
    setSaving(false);
    onSaved(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Professional Profile</h2>
            <p className="text-xs text-slate-500">Update your public identity, experience, skills, and privacy.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {([
            ['basic', 'Basic Info'],
            ['about', 'About & Media'],
            ['skills', 'Skills'],
            ['experience', 'Experience'],
            ['education', 'Education'],
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
            <div className="space-y-4">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">About / Summary</label>
                <textarea
                  rows={5}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Share your background, mission, and what you're building..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profile Photo URL</label>
                <input
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
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

          {tab === 'experience' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-700">Add Work Experience</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input value={expRole} onChange={(e) => setExpRole(e.target.value)} placeholder="Role / Title" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="Company" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={expStart} onChange={(e) => setExpStart(e.target.value)} placeholder="Start Year" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                </div>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-bold cursor-pointer"
                >
                  + Add Role
                </button>
              </div>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{exp.title}</p>
                      <p className="text-xs text-slate-500">{exp.company} · {exp.start_date}</p>
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
                  <input value={eduSchool} onChange={(e) => setEduSchool(e.target.value)} placeholder="School / University" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                  <input value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} placeholder="Degree / Field" className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-bold cursor-pointer"
                >
                  + Add Education
                </button>
              </div>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{edu.school}</p>
                      <p className="text-xs text-slate-500">{edu.degree}</p>
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
