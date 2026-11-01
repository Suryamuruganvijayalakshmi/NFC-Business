'use client';

import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  saveProfile, 
  getOrCreateProfileForUser,
  getSectionsByProfileId,
  getProjectsByProfileId,
  getLinksByProfileId
} from '@/lib/store';
import { 
  Profile, 
  TemplateTheme, 
  ButtonStyle, 
  FontFamily, 
  BackgroundStyle,
  ProfileSection,
  PortfolioProject,
  SocialLink
} from '@/lib/types';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import SignatureTemplate from '@/components/templates/SignatureTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import { 
  Palette, 
  Save, 
  CheckCircle2, 
  Check, 
  Sparkles, 
  Type, 
  Sliders, 
  Eye, 
  Layers,
  Smartphone
} from 'lucide-react';

export default function DesignCustomizationPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [savedToast, setSavedToast] = useState(false);

  // Customization State
  const [theme, setTheme] = useState<TemplateTheme>('signature');
  const [accentColor, setAccentColor] = useState('#087CF0');
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>('rounded');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('navy_grid');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
    }

    if (p) {
      setProfile(p);
      setTheme(p.theme || 'signature');
      setAccentColor(p.accent_color || '#087CF0');
      setButtonStyle(p.button_style || 'rounded');
      setFontFamily(p.font_family || 'sans');
      setBackgroundStyle(p.background_style || 'navy_grid');

      setSections(getSectionsByProfileId(p.id));
      setProjects(getProjectsByProfileId(p.id));
      setLinks(getLinksByProfileId(p.id));
    }
  }, []);

  const handleSave = () => {
    if (!profile) return;

    const updatedProfile: Profile = {
      ...profile,
      theme,
      accent_color: accentColor,
      button_style: buttonStyle,
      font_family: fontFamily,
      background_style: backgroundStyle,
      updated_at: new Date().toISOString(),
    };

    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const presetColors = [
    { name: 'SignBridge Blue', hex: '#087CF0' },
    { name: 'SignBridge Orange', hex: '#FF7900' },
    { name: 'Dark Navy', hex: '#101828' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Purple Violet', hex: '#8B5CF6' },
    { name: 'Crimson Rose', hex: '#F43F5E' },
  ];

  if (!profile) return null;

  // Transient profile for live preview
  const previewProfile: Profile = {
    ...profile,
    theme,
    accent_color: accentColor,
    button_style: buttonStyle,
    font_family: fontFamily,
    background_style: backgroundStyle,
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Profile Customization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose templates, custom palette accents, button styling, and preview in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedToast && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Design Saved!</span>
            </div>
          )}

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-bold hover:bg-[#0668cc] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Design</span>
          </button>
        </div>
      </div>

      {/* Split Workstation: Controls (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Template Theme Choice */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#087CF0]" />
              Select Base Template
            </h3>

            <div className="space-y-2.5">
              {[
                { id: 'minimal' as TemplateTheme, name: 'Minimal', desc: 'Clean white background, elegant modern typography' },
                { id: 'signature' as TemplateTheme, name: 'Signature', desc: 'Dark navy canvas with blue & orange microchip accents' },
                { id: 'creative' as TemplateTheme, name: 'Creative', desc: 'Soft pastel gradient overlays with collab inquiry tools' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                    theme === t.id
                      ? 'border-[#087CF0] bg-[#087CF0]/5 ring-2 ring-[#087CF0]/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{t.name}</span>
                    {theme === t.id && <Check className="w-4 h-4 text-[#087CF0]" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Accent Color Palette */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#FF7900]" />
              Accent Color
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {presetColors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setAccentColor(c.hex)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  title={c.name}
                >
                  <span 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white" 
                    style={{ backgroundColor: c.hex }}
                  >
                    {accentColor.toLowerCase() === c.hex.toLowerCase() && <Check className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">{c.hex}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-600">Custom Hex:</span>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-xs w-24"
              />
            </div>
          </div>

          {/* 3. Button Styles */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Button Geometry
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'rounded' as ButtonStyle, name: 'Rounded' },
                { id: 'pill' as ButtonStyle, name: 'Full Pill' },
                { id: 'sharp' as ButtonStyle, name: 'Sharp Modern' },
                { id: 'glow' as ButtonStyle, name: 'Soft Glow' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setButtonStyle(b.id)}
                  className={`py-2 px-3 text-xs font-semibold border transition-all ${
                    b.id === 'rounded' ? 'rounded-xl' : b.id === 'pill' ? 'rounded-full' : b.id === 'sharp' ? 'rounded-none' : 'rounded-xl ring-2 ring-blue-300'
                  } ${
                    buttonStyle === b.id
                      ? 'border-[#087CF0] bg-[#087CF0] text-white shadow-xs'
                      : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Typography Pairing */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-600" />
              Typography Style
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sans' as FontFamily, name: 'Modern Sans' },
                { id: 'serif' as FontFamily, name: 'Editorial Serif' },
                { id: 'mono' as FontFamily, name: 'Tech Monospace' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontFamily(f.id)}
                  className={`py-2 px-3 text-xs font-semibold border rounded-xl transition-all ${
                    fontFamily === f.id
                      ? 'border-[#087CF0] bg-[#087CF0]/10 text-[#087CF0]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Live Preview Column (7 cols) */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-md">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#087CF0]" />
                Live Interactive Smartphone Preview
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                signbridge.click/id/{profile.username}
              </span>
            </div>

            {/* Embedded Live Template Canvas */}
            <div className="max-h-[680px] overflow-y-auto rounded-2xl border border-slate-200 shadow-inner bg-slate-100">
              {theme === 'minimal' && (
                <MinimalTemplate
                  profile={previewProfile}
                  sections={sections}
                  projects={projects}
                  links={links}
                  isPreview={true}
                />
              )}

              {theme === 'signature' && (
                <SignatureTemplate
                  profile={previewProfile}
                  sections={sections}
                  projects={projects}
                  links={links}
                  isPreview={true}
                />
              )}

              {theme === 'creative' && (
                <CreativeTemplate
                  profile={previewProfile}
                  sections={sections}
                  projects={projects}
                  links={links}
                  isPreview={true}
                />
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
