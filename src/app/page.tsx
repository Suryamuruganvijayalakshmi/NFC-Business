'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NFCCardVisual from '@/components/NFCCardVisual';
import { 
  ArrowRight, 
  Wifi, 
  Smartphone, 
  QrCode, 
  UserCheck, 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ExternalLink,
  ChevronRight,
  Briefcase,
  Palette,
  Building,
  User,
  Zap
} from 'lucide-react';

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'professional' | 'creator' | 'business' | 'personal'>('professional');
  const [nfcTapped, setNfcTapped] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Create Your Identity',
      headline: 'Build your personal or business profile in minutes.',
      description: 'Choose your unique username (signbridge.click/id/yourname), add your professional bio, headshot, contact credentials, and verified social links.',
      badge: 'Zero Coding Required',
    },
    {
      num: '02',
      title: 'Customize Your Experience',
      headline: 'Tailor templates, colors, and showcase projects.',
      description: 'Switch between Minimal, Signature, and Creative themes. Highlight your design portfolio, services, certifications, work history, and custom accent tones.',
      badge: 'Real-time Live Preview',
    },
    {
      num: '03',
      title: 'Tap. Share. Connect.',
      headline: 'Bridge the physical world with one smartphone tap.',
      description: 'Link your SignBridge NFC Smart Card or share your dynamic QR code. Anyone tapping their phone gets instant access with 1-click vCard phonebook saving.',
      badge: 'Works on iOS & Android',
    },
  ];

  const categories = {
    professional: {
      title: 'Professional',
      desc: 'Engineers, executives, consultants, and founders looking to replace paper business cards with high-conversion dynamic identity.',
      features: ['Experience & Education Timeline', 'Verified Skill Badges', '1-Tap Phonebook vCard Save', 'Resume & Project Links'],
      demoUser: 'surya',
      name: 'Surya Narayanan',
      role: 'Founder & Hardware Architect',
      tagline: 'SignBridge Inc.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      badgeColor: 'bg-[#087CF0]/10 text-[#087CF0] border-[#087CF0]/30',
    },
    creator: {
      title: 'Creator',
      desc: 'Artists, YouTubers, photographers, and streamers highlighting media showcases, sponsorship inquiry buttons, and social channels.',
      features: ['Visual Media Gallery', 'Direct Collab Inquiry Modal', 'Social Media Hub', 'Custom Creator Gradients'],
      demoUser: 'elena',
      name: 'Elena Rostova',
      role: 'Visual Storyteller & Motion Designer',
      tagline: 'Amsterdam',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      badgeColor: 'bg-[#FF7900]/10 text-[#FF7900] border-[#FF7900]/30',
    },
    business: {
      title: 'Business',
      desc: 'Agencies, stores, clinics, and enterprises offering services, direct WhatsApp messaging, location directions, and product portfolios.',
      features: ['WhatsApp 1-Click Chat', 'Service & Product Showcase', 'Team NFC Smart Cards', 'Corporate Domain Routing'],
      demoUser: 'apex-studios',
      name: 'Apex Digital Labs',
      role: 'Enterprise NFC Solutions',
      tagline: 'London & Singapore',
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    },
    personal: {
      title: 'Personal',
      desc: 'Students, graduates, and innovators sharing personal projects, hobbies, resumes, and contact links on campus or tech conferences.',
      features: ['Clean Minimal Layout', 'Quick Bio & Interests', 'Instant QR & Link Share', 'No App Installation'],
      demoUser: 'surya',
      name: 'Surya Narayanan',
      role: 'Student & Tech Explorer',
      tagline: 'Class of 2026',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    },
  };

  const handleSimulatedTap = () => {
    setNfcTapped(true);
    setTimeout(() => setNfcTapped(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1">
        {/* =========================================================================
            HERO SECTION — Inspired by twocode.nl Spacious Impact
            ========================================================================= */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white via-[#F8FAFD] to-[#FAFAFB]">
          
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-[#087CF0]/10 via-[#FF7900]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Top Pill / Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-2xs backdrop-blur-md">
                <span className="pulse-beacon" />
                <span>SignBridge ID V2.0 is live</span>
                <span className="text-slate-300">|</span>
                <span className="text-[#087CF0] flex items-center gap-1">
                  NFC + QR + Smart Web <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Headline & Subhead */}
            <div className="mt-8 text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#101828] leading-[1.08]">
                Your Identity.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#087CF0] via-[#0560bd] to-[#FF7900]">
                  One Tap Away.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Create your digital identity. Showcase your work, share your story, and connect with the world through your personalized SignBridge profile and physical NFC Smart Card.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#101828] text-white text-base font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/15 flex items-center justify-center gap-3 group"
                >
                  <span>Create Your Free Profile</span>
                  <span className="w-6 h-6 rounded-lg bg-[#FF7900] flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  href="/id/surya"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-base font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Explore Live Profile</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Small Trust Note */}
              <p className="mt-4 text-xs text-slate-400 font-medium">
                No app installation required for visitors · Compatible with all NFC smartphones
              </p>
            </div>

            {/* Hero Interactive Hardware Visual (NFC Card + Smartphone Mockup) */}
            <div className="mt-16 lg:mt-24 max-w-5xl mx-auto">
              <div className="relative rounded-3xl bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/90 p-6 sm:p-12 shadow-2xl">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  
                  {/* Left Column: Interactive Physical NFC Smart Card */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#087CF0] mb-2 flex items-center gap-1.5">
                      <Wifi className="w-4 h-4" /> Physical SignBridge Smart Card
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                      Tap against any modern phone
                    </h3>

                    {/* Interactive 3D Card */}
                    <NFCCardVisual 
                      fullName="Surya Narayanan"
                      title="Founder & Hardware Architect"
                      username="surya"
                      onTap={handleSimulatedTap}
                    />

                    <p className="text-xs text-slate-500 mt-4 max-w-xs">
                      Tapping the card triggers an encrypted NDEF payload redirecting directly to your dynamic identity.
                    </p>
                  </div>

                  {/* Right Column: Mobile Screen Profile Representation */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF7900] mb-2 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" /> Instant Mobile Profile View
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                      What visitors immediately see
                    </h3>

                    {/* Realistic Smartphone Shell */}
                    <div className="relative w-[280px] sm:w-[320px] rounded-[36px] bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-800">
                      
                      {/* Notch / Dynamic Island */}
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                      </div>

                      {/* Phone Screen Container */}
                      <div className="w-full h-[460px] rounded-[28px] bg-[#0C121E] overflow-y-auto overflow-x-hidden p-4 text-white relative text-left">
                        
                        {/* Tap Feedback Animation */}
                        {nfcTapped && (
                          <div className="absolute inset-0 bg-[#087CF0]/20 backdrop-blur-xs flex items-center justify-center z-30 animate-fade-in">
                            <div className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-2xl animate-bounce flex items-center gap-2">
                              <Zap className="w-4 h-4 text-[#FF7900]" />
                              Instant NFC Connection Established!
                            </div>
                          </div>
                        )}

                        {/* Top Micro-Header */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pb-3 border-b border-white/10">
                          <span className="font-mono">signbridge.click/id/surya</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>

                        {/* Avatar & Info */}
                        <div className="mt-4 flex items-center gap-3">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                            alt="Surya" 
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#087CF0]" 
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-1">
                              Surya Narayanan
                              <ShieldCheck className="w-3.5 h-3.5 text-[#087CF0]" />
                            </h4>
                            <p className="text-[11px] text-slate-400">Founder & Hardware Architect</p>
                          </div>
                        </div>

                        {/* Quick CTA */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <button className="py-2 px-3 rounded-lg bg-[#087CF0] text-[11px] font-semibold text-white shadow-sm flex items-center justify-center gap-1">
                            <UserCheck className="w-3 h-3" /> Save Contact
                          </button>
                          <button className="py-2 px-3 rounded-lg bg-white/10 text-[11px] font-semibold text-white border border-white/10 flex items-center justify-center gap-1">
                            <QrCode className="w-3 h-3 text-[#FF7900]" /> Show QR
                          </button>
                        </div>

                        {/* Social Links Chips */}
                        <div className="mt-4 space-y-1.5">
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#087CF0]" />
                              LinkedIn Profile
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                              Hardware GitHub Repos
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              WhatsApp Connect
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </div>
                        </div>

                        {/* Portfolio Mini Card */}
                        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[9px] uppercase font-mono text-[#087CF0]">Featured Work</span>
                          <p className="text-xs font-bold text-white mt-0.5">SignBridge Smart Card V2</p>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                            Matte black encrypted NFC hardware with instant cloud redirect.
                          </p>
                        </div>

                        <div className="mt-6 text-center">
                          <p className="text-[9px] text-slate-500">
                            Powered by SignBridge ID · One Tap Away
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link 
                      href="/id/surya"
                      className="text-xs font-semibold text-[#087CF0] mt-3 hover:underline flex items-center gap-1"
                    >
                      Open full public view in new tab <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            HOW IT WORKS — Interactive Timeline Tabs (twocode.nl style)
            ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF7900]">
                Simple 3-Step Setup
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] mt-2">
                Set it up once.{' '}
                <span className="italic font-normal text-slate-600">Share forever.</span>
              </h2>
              <p className="mt-4 text-slate-600 text-sm sm:text-base">
                Go from a blank page to a fully functioning NFC contactless card and smart web identity in under three minutes.
              </p>
            </div>

            {/* Interactive Step Tabs */}
            <div className="mt-12 max-w-4xl mx-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                {steps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-all ${
                      activeStep === idx
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      activeStep === idx ? 'bg-[#087CF0] text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {step.num}
                    </span>
                    <span className="text-sm font-medium">{step.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Step Panel */}
              <div className="mt-6 rounded-3xl bg-[#101828] text-white p-8 sm:p-12 border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-[#FF7900]">
                    <Sparkles className="w-3.5 h-3.5" />
                    {steps[activeStep].badge}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {steps[activeStep].headline}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {steps[activeStep].description}
                  </p>
                  
                  <div className="pt-2">
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc] transition-colors"
                    >
                      Try Step {steps[activeStep].num} Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="w-full md:w-72 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#087CF0] to-[#FF7900] flex items-center justify-center text-white mb-4 shadow-lg">
                    {activeStep === 0 && <User className="w-8 h-8" />}
                    {activeStep === 1 && <Palette className="w-8 h-8" />}
                    {activeStep === 2 && <Wifi className="w-8 h-8" />}
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {steps[activeStep].title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Instant sync to cloud database & NFC chips
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            PROFILE TYPES — 4 Categories with Live Switcher
            ========================================================================= */}
        <section id="profile-types" className="py-20 sm:py-28 bg-[#FAFAFB] border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087CF0]">
                Tailored Archetypes
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] mt-2">
                Designed for every kind of ambition
              </h2>
              <p className="mt-4 text-slate-600 text-sm sm:text-base">
                Whether you are a solo creative, founder, executive, or growing business, SignBridge ID provides purpose-built layouts.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/60">
                {(['professional', 'creator', 'business', 'personal'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all ${
                      activeCategory === cat
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Showcase Card */}
            <div className="mt-8 max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-12 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Details */}
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${categories[activeCategory].badgeColor}`}>
                    {categories[activeCategory].title} Profile
                  </span>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mt-3">
                    Built for high-impact networking
                  </h3>
                  
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                    {categories[activeCategory].desc}
                  </p>

                  <div className="mt-6 space-y-2.5">
                    {categories[activeCategory].features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        {feat}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-3">
                    <Link
                      href={`/id/${categories[activeCategory].demoUser}`}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      View Live Example <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/signup"
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Create This Profile
                    </Link>
                  </div>
                </div>

                {/* Visual Preview */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                  <img 
                    src={categories[activeCategory].avatar} 
                    alt={categories[activeCategory].name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-md ring-4 ring-white"
                  />
                  <h4 className="font-bold text-slate-900 text-base mt-3">
                    {categories[activeCategory].name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {categories[activeCategory].role}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {categories[activeCategory].tagline}
                  </p>

                  <div className="w-full mt-5 pt-4 border-t border-slate-200/60 flex justify-between text-xs font-medium text-slate-600">
                    <span>URL Path:</span>
                    <span className="font-mono text-[#087CF0]">/id/{categories[activeCategory].demoUser}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            FEATURES GRID — 8 Core Pillars
            ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF7900]">
                Everything You Need
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] mt-2">
                Engineered for trust, performance, & physical simplicity
              </h2>
              <p className="mt-4 text-slate-600 text-sm sm:text-base">
                SignBridge ID removes paper card waste, app installation barriers, and outdated contacts forever.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#FAFAFB] hover:border-[#087CF0]/40 hover:bg-white transition-all shadow-2xs group">
                <div className="w-10 h-10 rounded-xl bg-[#087CF0]/10 text-[#087CF0] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Personalized Digital Identity</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Your custom username (signbridge.click/id/you) with bio, social links, resume, and credentials.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#FAFAFB] hover:border-[#FF7900]/40 hover:bg-white transition-all shadow-2xs group">
                <div className="w-10 h-10 rounded-xl bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">3 Premium Templates</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Switch between Minimal, Signature, and Creative themes with live previews and custom accents.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#FAFAFB] hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Portfolio Showcase</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Display high-resolution project cards, technology tags, and direct web links with ordering controls.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#FAFAFB] hover:border-purple-500/40 hover:bg-white transition-all shadow-2xs group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Business Information</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Direct WhatsApp messaging, office locations, product listings, and corporate inquiries.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#FAFAFB] hover:border-[#087CF0]/40 hover:bg-white transition-all shadow-2xs group">
                <div className="w-10 h-10 rounded-xl bg-[#087CF0]/10 text-[#087CF0] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wifi className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">NFC Smart Card Link</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Manage physical card UIDs, generate unique tap URLs (signbridge.click/t/cardId), and reassign cards.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#FAFAFB] hover:border-[#FF7900]/40 hover:bg-white transition-all shadow-2xs group">
                <div className="w-10 h-10 rounded-xl bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Vector QR Code Sharing</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Download high-resolution PNG QR codes, share via native mobile sheets, or print on merchandise.
                </p>
              </div>

              {/* Feature 7 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#FAFAFB] hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">1-Tap Contact Saving</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Downloads standard vCard (.vcf) formatted files directly into the smartphone's address book.
                </p>
              </div>

              {/* Feature 8 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#FAFAFB] hover:border-purple-500/40 hover:bg-white transition-all shadow-2xs group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Profile Analytics</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Track profile views, NFC taps, QR scans, and link click engagement metrics privately.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            FINAL CALL TO ACTION
            ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#101828] text-white relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#087CF0]/20 via-transparent to-[#FF7900]/20 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FF7900] mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Start Free in 60 Seconds
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Your Digital Identity Starts Here.
            </h2>
            
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join thousands of creators, founders, and professionals who have elevated their networking with SignBridge ID.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#087CF0] text-white text-base font-semibold hover:bg-[#0668cc] transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <span>Create Your Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 border border-white/15 text-white text-base font-semibold hover:bg-white/15 transition-all"
              >
                View NFC Card Pricing
              </Link>
            </div>

            <p className="text-xs text-slate-400 mt-6">
              SignBridge ID · Website: signbridge.click · Tagline: Your Identity. One Tap Away.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
