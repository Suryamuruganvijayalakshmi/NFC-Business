'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import SignatureTemplate from '@/components/templates/SignatureTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import { INITIAL_PROFILES, INITIAL_PROJECTS, INITIAL_LINKS, INITIAL_SECTIONS } from '@/lib/initialData';
import { TemplateTheme } from '@/lib/types';
import { Sparkles, Eye, ArrowRight, Check, ExternalLink } from 'lucide-react';

export default function TemplatesGalleryPage() {
  const [selectedTheme, setSelectedTheme] = useState<TemplateTheme>('signature');
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);

  const currentProfile = {
    ...INITIAL_PROFILES[selectedProfileIndex],
    theme: selectedTheme,
  };

  const templatesInfo = [
    {
      id: 'minimal' as TemplateTheme,
      name: 'Minimal',
      badge: 'Classic & Clean',
      headline: 'Crisp white canvas with refined modern typography',
      desc: 'Perfect for executives, academics, doctors, lawyers, and purists who value quiet sophistication and distraction-free communication.',
      highlights: ['Pure white background', 'High-contrast typography', 'Structured portfolio card grid', 'Instant contact vCard download'],
      accentSample: '#101828',
    },
    {
      id: 'signature' as TemplateTheme,
      name: 'Signature',
      badge: 'SignBridge Flagship',
      headline: 'Dark navy background with vibrant blue & orange accents',
      desc: 'Our flagship identity template inspired by tech hardware, encrypted microchips, and high-impact physical NFC smart cards.',
      highlights: ['Deep navy (#101828) canvas', 'Verified hardware badge glyph', 'Glassmorphism link containers', 'Dynamic portfolio showcase'],
      accentSample: '#087CF0',
    },
    {
      id: 'creative' as TemplateTheme,
      name: 'Creative',
      badge: 'Expressive & Vibrant',
      headline: 'Soft gradient overlays with creator collaboration tools',
      desc: 'Designed for artists, YouTubers, photographers, and freelance designers showcasing visual portfolios and booking inquiries.',
      highlights: ['Soft multi-color gradients', 'Integrated Collab Inquiry modal', 'Large avatar hero presentation', 'Fluid social media chips'],
      accentSample: '#FF7900',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="pt-16 pb-16 bg-gradient-to-b from-white to-[#FAFAFB] border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7900]/10 text-[#FF7900] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Template Showcase
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
              Three premium templates. Endless possibilities.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Every SignBridge ID profile looks like a bespoke personal website. Switch templates anytime with zero data loss.
            </p>

            {/* Template Switcher Tabs */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/60 gap-1">
                {templatesInfo.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                      selectedTheme === t.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: t.accentSample }} 
                    />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo User Switcher */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span>Previewing with data from:</span>
              {INITIAL_PROFILES.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfileIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedProfileIndex === idx
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.full_name} ({p.profile_type})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Live Template Interactive Preview Container */}
        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-2xl bg-slate-100 p-2 sm:p-6">
            
            <div className="flex items-center justify-between pb-4 px-2 text-xs text-slate-500 border-b border-slate-200/60 mb-6">
              <span className="font-mono flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Live Interactive Preview: <b className="text-slate-900">{selectedTheme.toUpperCase()} TEMPLATE</b>
              </span>
              <Link
                href={`/id/${currentProfile.username}`}
                target="_blank"
                className="text-[#087CF0] hover:underline flex items-center gap-1 font-semibold"
              >
                Open in Full Window <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Render Selected Template */}
            <div className="rounded-2xl overflow-hidden shadow-inner border border-slate-200">
              {selectedTheme === 'minimal' && (
                <MinimalTemplate
                  profile={currentProfile}
                  sections={INITIAL_SECTIONS}
                  projects={INITIAL_PROJECTS}
                  links={INITIAL_LINKS}
                  isPreview={true}
                />
              )}

              {selectedTheme === 'signature' && (
                <SignatureTemplate
                  profile={currentProfile}
                  sections={INITIAL_SECTIONS}
                  projects={INITIAL_PROJECTS}
                  links={INITIAL_LINKS}
                  isPreview={true}
                />
              )}

              {selectedTheme === 'creative' && (
                <CreativeTemplate
                  profile={currentProfile}
                  sections={INITIAL_SECTIONS}
                  projects={INITIAL_PROJECTS}
                  links={INITIAL_LINKS}
                  isPreview={true}
                />
              )}
            </div>

          </div>

          {/* Template Feature Comparison Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {templatesInfo.map((t) => (
              <div 
                key={t.id}
                className={`p-6 rounded-3xl border transition-all ${
                  selectedTheme === t.id
                    ? 'border-[#087CF0] bg-white shadow-lg ring-2 ring-[#087CF0]/20'
                    : 'border-slate-200 bg-white shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t.badge}
                  </span>
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: t.accentSample }} 
                  />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900">
                  {t.name}
                </h3>
                
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {t.desc}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  {t.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4">
                  <button
                    onClick={() => setSelectedTheme(t.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedTheme === t.id
                        ? 'bg-[#101828] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {selectedTheme === t.id ? 'Currently Selected' : `Preview ${t.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
