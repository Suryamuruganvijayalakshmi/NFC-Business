'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Hero02SignTap from '@/components/Hero02SignTap';
import SignTapLoader from '@/components/SignTapLoader';
import { getAllProducts, getAllProfiles } from '@/lib/store';
import { Product, Profile } from '@/lib/types';
import { 
  ArrowRight, 
  Wifi, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Briefcase, 
  Building, 
  User, 
  CreditCard, 
  Share2, 
  Phone, 
  Download, 
  Plus, 
  Minus, 
  Globe 
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activePreviewProfile, setActivePreviewProfile] = useState<string>('surya');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [tapSuccess, setTapSuccess] = useState(false);

  useEffect(() => {
    setProducts(getAllProducts());
    setProfiles(getAllProfiles());
  }, []);

  const currentProfile = profiles.find(p => p.username === activePreviewProfile) || profiles[0] || {
    full_name: 'Surya Narayanan',
    username: 'surya',
    title: 'Hardware Architect & Founder',
    company: 'SignTap Labs',
    bio: 'Pioneering physical-to-digital interactions. Building next-generation NFC embedded systems and modern web experiences.',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    skills: ['NFC Architecture', 'Embedded IoT', 'Full-Stack Next.js', 'System Security'],
    theme: 'signature',
    accent_color: '#923cf6',
  };

  const handleCardTapSimulation = () => {
    setTapSuccess(true);
    setTimeout(() => setTapSuccess(false), 3500);
  };

  const faqs = [
    {
      q: 'Do visitors need an app to read my SignTap NFC Card?',
      a: 'No! Modern iPhones (iPhone XS and newer) and Android phones natively read NFC tags in the background. When someone taps your card, your digital profile opens instantly in their default mobile browser. No app installation or account signup is required for visitors.'
    },
    {
      q: 'How does physical SignTap card activation work?',
      a: 'Each physical card is dispatched with a unique Card UID and activation code. Once you receive your card, log in to your dashboard, navigate to "NFC Card Management", and enter your code to link the card to your profile in seconds.'
    },
    {
      q: 'Can I update my profile after ordering the physical card?',
      a: 'Yes, absolutely! The physical NFC card stores only your secure unique profile URL or redirect token, never your personal data. You can update your phone number, social links, portfolio, or resume anytime from your dashboard, and your card will immediately reflect the changes without rewriting.'
    },
    {
      q: 'Is my personal information secure with SignTap?',
      a: 'Yes. Your data is stored in Supabase PostgreSQL with strict Row Level Security (RLS) policies. Only published information is visible to the public. If your card is ever lost or stolen, you can instantly block or unlink it from your private dashboard with a single click.'
    },
    {
      q: 'How long does card manufacturing and delivery take?',
      a: 'Standard orders are manufactured and dispatched within 2 to 4 business days. Delivery typically takes 3 to 7 business days depending on your shipping address. You can track your order status in real time from your account.'
    },
    {
      q: 'What happens if someone has an older phone without NFC?',
      a: 'Every SignTap NFC Card comes with a precision-printed dynamic backup QR code on the back. Anyone with any smartphone camera can scan the QR code to open your digital identity page instantly.'
    }
  ];

  const features = [
    {
      title: 'One-Tap Profile Sharing',
      desc: 'Simply touch your card to any NFC smartphone for instant profile transmission.',
      icon: <Wifi className="w-5 h-5 text-[#923cf6]" />,
    },
    {
      title: 'Personalized Digital Identity',
      desc: 'Showcase your photo, cover banner, biography, professional designation, and company.',
      icon: <User className="w-5 h-5 text-[#FF7900]" />,
    },
    {
      title: 'Portfolio & Project Integration',
      desc: 'Highlight your best case studies, code repositories, creative designs, and client work.',
      icon: <Briefcase className="w-5 h-5 text-[#087CF0]" />,
    },
    {
      title: 'Verified Social Links',
      desc: 'Consolidate LinkedIn, GitHub, X, Instagram, YouTube, and custom web links in one hub.',
      icon: <Share2 className="w-5 h-5 text-[#923cf6]" />,
    },
    {
      title: 'Direct Contact Actions',
      desc: 'Instant 1-tap phone calls, WhatsApp chat initiation, direct emails, and website routing.',
      icon: <Phone className="w-5 h-5 text-[#087CF0]" />,
    },
    {
      title: 'Business Information',
      desc: 'List company credentials, tax registration, team departments, and physical office location.',
      icon: <Building className="w-5 h-5 text-[#FF7900]" />,
    },
    {
      title: 'Custom Profile URL',
      desc: 'Claim your memorable personal handle (e.g. signtap.me/u/yourname) for easy sharing.',
      icon: <Globe className="w-5 h-5 text-[#923cf6]" />,
    },
    {
      title: 'Real-Time Editable Profile',
      desc: 'Update your contact details or change themes anytime without reprinting physical cards.',
      icon: <Sparkles className="w-5 h-5 text-[#FF7900]" />,
    },
    {
      title: 'Mobile-Optimized Experience',
      desc: 'Engineered specifically for lightning-fast mobile loading and responsive fluid layout.',
      icon: <Smartphone className="w-5 h-5 text-[#087CF0]" />,
    },
    {
      title: 'Zero App Required',
      desc: 'Visitors interact smoothly through their browser without installing third-party apps.',
      icon: <ShieldCheck className="w-5 h-5 text-[#30D158]" />,
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] overflow-x-hidden relative">
      {/* Light Theme Futuristic NFC Contactless Loader */}
      <SignTapLoader />

      {/* Main page content */}
      <div className="flex-1 flex flex-col">
        {/* =====================================================================
            ORIGINKIT HERO 02 SECTION ADAPTED FOR SIGNTAP
        ===================================================================== */}
        <Hero02SignTap
          currentProfile={currentProfile}
          onCardTap={handleCardTapSimulation}
          tapSuccess={tapSuccess}
        />

      <div className="w-full px-2.5 sm:px-4 space-y-12 sm:space-y-16">
        
        {/* =====================================================================
            C. HOW IT WORKS — HERO-02 STYLED CARD CONTAINER
        ===================================================================== */}
        <section id="how-it-works" className="max-w-7xl mx-auto rounded-3xl md:rounded-[2rem] bg-white border border-[#dee5ed] p-6 sm:p-10 lg:p-14 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-[#923cf6] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#923cf6] animate-pulse" />
              <span>Simple 3-Step Experience</span>
            </div>
            <h2 className="font-urbanist text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0d0d0d] tracking-tight mt-3">
              How SignTap Works
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-2">
              From choosing your card to making unforgettable contactless introductions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 01 */}
            <div className="relative p-7 sm:p-8 rounded-2xl md:rounded-3xl bg-[#f8fafc] border border-[#dee5ed] hover:border-[#923cf6]/40 hover:shadow-lg transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#923cf6]/30 font-mono group-hover:text-[#923cf6] transition-colors">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#923cf6] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-urbanist text-lg sm:text-xl font-bold text-[#101828] mt-4">Get Your Card</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Choose your preferred physical SignTap card design and place your order. Customize your name and shipping address.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-[#923cf6] flex items-center gap-1">
                <span>Explore products below</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative p-7 sm:p-8 rounded-2xl md:rounded-3xl bg-[#f8fafc] border border-[#dee5ed] hover:border-[#FF7900]/40 hover:shadow-lg transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#FF7900]/30 font-mono group-hover:text-[#FF7900] transition-colors">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7900] flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-urbanist text-lg sm:text-xl font-bold text-[#101828] mt-4">Create Your Identity</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Build your personalized digital profile using your dashboard. Add your bio, social hubs, portfolio, and contact buttons.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-[#FF7900] flex items-center gap-1">
                <span>Live preview editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative p-7 sm:p-8 rounded-2xl md:rounded-3xl bg-[#f8fafc] border border-[#dee5ed] hover:border-emerald-500/40 hover:shadow-lg transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-500/30 font-mono group-hover:text-emerald-500 transition-colors">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Wifi className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-urbanist text-lg sm:text-xl font-bold text-[#101828] mt-4">Tap and Connect</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Let anyone tap your NFC card to instantly access your digital profile and save your contact directly with 1 click.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span>No app or login needed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </section>

        {/* =====================================================================
            D. PRODUCT SHOWCASE — SIGNTAP HARDWARE COLLECTION
        ===================================================================== */}
        <section id="products" className="max-w-7xl mx-auto rounded-3xl md:rounded-[2rem] bg-white border border-[#dee5ed] p-6 sm:p-10 lg:p-14 shadow-xs">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-[#923cf6] shadow-2xs">
                <Wifi className="w-3.5 h-3.5" />
                <span>Genuine NTAG216 Microchips</span>
              </div>
              <h2 className="font-urbanist text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0d0d0d] tracking-tight mt-3">
                Explore SignTap NFC Cards
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-1.5 max-w-xl">
                Precision-engineered physical smart cards connected to your real-time cloud identity.
              </p>
            </div>

            <Link
              href="/explore-cards"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#923cf6] hover:text-[#8129e0]"
            >
              <span>View full technical specs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl md:rounded-3xl bg-[#f8fafc] border border-[#dee5ed] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Visual Banner */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {product.badge && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#101828]/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                        {product.badge}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-mono">
                      <Wifi className="w-3.5 h-3.5 text-[#923cf6]" />
                      <span>{product.material}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-urbanist text-base sm:text-lg font-bold text-[#101828] group-hover:text-[#923cf6] transition-colors">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#101828] font-sans">
                        ${product.price}
                      </span>
                      <span className="text-[11px] text-slate-500 uppercase font-mono">
                        {product.currency} · Lifetime updates
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {product.short_description}
                    </p>

                    {/* Feature bullet list */}
                    <div className="mt-4 space-y-2 pt-3 border-t border-slate-200/60">
                      {product.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-[#923cf6] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pill Order Button in Hero 02 style */}
                <div className="p-5 sm:p-6 pt-0">
                  <Link
                    href={`/order?product=${product.id}`}
                    className="w-full py-2.5 px-4 rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md active:scale-95"
                  >
                    <span>Customize & Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* =====================================================================
            E. FEATURES — MODERN BENTO CAPABILITIES
        ===================================================================== */}
        <section id="features" className="max-w-7xl mx-auto rounded-3xl md:rounded-[2rem] bg-white border border-[#dee5ed] p-6 sm:p-10 lg:p-14 shadow-xs">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-[#923cf6] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern Identity Infrastructure</span>
            </div>
            <h2 className="font-urbanist text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0d0d0d] tracking-tight mt-3">
              Engineered for Frictionless Connection
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-2">
              Everything you need to leave an unforgettable impression in professional, creative, and business encounters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl md:rounded-3xl bg-[#f8fafc] border border-[#dee5ed] hover:border-[#923cf6]/40 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mb-4">
                    {feat.icon}
                  </div>
                  <h3 className="font-urbanist text-base font-bold text-[#101828]">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* =====================================================================
            F. INTERACTIVE PROFILE PREVIEW — SIGNTAP LIVE EXPERIENCE
        ===================================================================== */}
        <section className="max-w-7xl mx-auto rounded-3xl md:rounded-[2rem] bg-[#101828] border border-white/10 p-6 sm:p-10 lg:p-14 shadow-2xl text-white relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#923cf6]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#087CF0]/10 blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-purple-200 border border-purple-400/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse" />
              <span>Live Public Profile Experience</span>
            </div>
            <h2 className="font-urbanist text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              See How Your Identity Looks
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Switch demo profiles to test the live mobile experience your contacts will see when tapping your SignTap card.
            </p>

            {/* Profile Switcher Pills */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setActivePreviewProfile('surya')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activePreviewProfile === 'surya'
                    ? 'bg-[#923cf6] text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                Surya (Professional)
              </button>
              <button
                onClick={() => setActivePreviewProfile('elena')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activePreviewProfile === 'elena'
                    ? 'bg-[#FF7900] text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                Elena (Creator)
              </button>
              <button
                onClick={() => setActivePreviewProfile('apex-studios')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activePreviewProfile === 'apex-studios'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                Apex Labs (Business)
              </button>
            </div>
          </div>

          {/* Smartphone Frame with Dynamic Island */}
          <div className="max-w-xl mx-auto rounded-[36px] bg-[#1d1d1b] p-3 shadow-2xl relative z-10 border-4 border-[#2b2b29]">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/10 rounded-t-[20px] border-b border-white/10 mb-2 text-white">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="px-3 py-0.5 rounded-md bg-white/5 text-[11px] font-mono text-slate-300 shadow-inner">
                signbridge.click/u/{currentProfile.username}
              </div>
              <span className="text-[10px] font-semibold text-[#923cf6] uppercase">SignTap Verified</span>
            </div>

            {/* Viewport Content */}
            <div className="rounded-[20px] bg-[#162032] p-6 text-white">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <img
                  src={currentProfile.profile_image}
                  alt={currentProfile.full_name}
                  className="w-18 h-18 rounded-2xl object-cover ring-2 ring-[#923cf6] shadow-md"
                />
                <div className="flex-1">
                  <h3 className="font-urbanist text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                    {currentProfile.full_name}
                    <ShieldCheck className="w-4 h-4 text-[#923cf6]" />
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{currentProfile.title}</p>
                  {currentProfile.company && (
                    <p className="text-xs text-[#FF7900] font-medium mt-0.5">{currentProfile.company}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed">
                {currentProfile.bio}
              </div>

              {/* Skills */}
              {currentProfile.skills && currentProfile.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {currentProfile.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Pill CTAs inside Profile */}
              <div className="grid grid-cols-2 gap-2.5 mt-5">
                <Link
                  href={`/u/${currentProfile.username}`}
                  className="py-2.5 px-4 rounded-full bg-[#923cf6] hover:bg-[#8129e0] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Contact</span>
                </Link>
                <Link
                  href={`/u/${currentProfile.username}`}
                  className="py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-white/10"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#FF7900]" />
                  <span>View Full Profile</span>
                </Link>
              </div>

            </div>

          </div>

          <div className="mt-8 text-center relative z-10">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] px-8 py-3.5 text-sm font-semibold text-white transition-all shadow-lg shadow-purple-500/25 active:scale-95"
            >
              <Sparkles className="w-4 h-4 mr-2 text-[#FF7900]" />
              <span>Claim Your Unique SignTap URL</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

        </section>

        {/* =====================================================================
            G. WHY SIGNTAP — COMPETITIVE ADVANTAGE
        ===================================================================== */}
        <section className="max-w-7xl mx-auto rounded-3xl md:rounded-[2rem] bg-white border border-[#dee5ed] p-6 sm:p-10 lg:p-14 shadow-xs">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-[#923cf6] shadow-2xs">
                <span>The Permanent Advantage</span>
              </div>
              <h2 className="font-urbanist text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0d0d0d] tracking-tight">
                Why Professionals Choose SignTap
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Traditional paper business cards get lost, thrown away, or quickly go out of date. SignTap transforms networking into an interactive, permanent digital touchpoint.
              </p>

              <div className="space-y-3.5 pt-1">
                {[
                  {
                    title: 'No need to carry multiple paper cards',
                    desc: 'Never run out of cards at conferences or networking mixers. One card is all you ever need.'
                  },
                  {
                    title: 'Update details without replacing your NFC card',
                    desc: 'Changed your phone number, promotion, or company? Update your profile online and your physical card syncs instantly.'
                  },
                  {
                    title: 'Share your information instantly',
                    desc: 'A single phone tap transmits your vCard directly into their contacts book with zero manual typing errors.'
                  },
                  {
                    title: 'Create an unforgettable professional first impression',
                    desc: 'Stand out with cutting-edge technology that signals modern fluency and sophisticated taste.'
                  },
                  {
                    title: 'One card for your complete digital identity',
                    desc: 'Combines your resume, portfolio, social hubs, WhatsApp, and booking links in one unified experience.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#101828]">{item.title}</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/explore-cards"
                  className="inline-flex items-center rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all"
                >
                  <span>Select Your SignTap Card</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="lg:col-span-6 bg-[#f8fafc] p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-[#dee5ed] space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-rose-100 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2 flex items-center gap-1.5 font-mono">
                  <Minus className="w-4 h-4" /> Traditional Paper Cards
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  <li>• Expensive reprints whenever details, titles, or numbers change</li>
                  <li>• 88% of paper business cards are thrown away in under 7 days</li>
                  <li>• Tedious manual typing of email and contact numbers</li>
                  <li>• Zero analytics or engagement telemetries</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#923cf6]/40 shadow-md">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#923cf6] mb-2 flex items-center gap-1.5 font-mono">
                  <Plus className="w-4 h-4" /> SignTap Smart Card
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>✓ One-time purchase with lifetime dynamic profile updates</li>
                  <li>✓ Direct 1-tap phonebook saving with clean vCard file</li>
                  <li>✓ Real-time analytics on profile visits and contact downloads</li>
                  <li>✓ High-impact professional statement backed by SignBridge brand</li>
                </ul>
              </div>
            </div>

          </div>

        </section>

        {/* =====================================================================
            H. FAQ — ROUNDED ACCORDION SHELL
        ===================================================================== */}
        <section id="faq" className="max-w-4xl mx-auto rounded-3xl md:rounded-[2rem] bg-white border border-[#dee5ed] p-6 sm:p-10 lg:p-14 shadow-xs">
          
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-[#923cf6] shadow-2xs">
              <span>Got Questions?</span>
            </div>
            <h2 className="font-urbanist text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0d0d0d] tracking-tight mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
              Everything you need to know about compatibility, activation, and delivery.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#f8fafc] border border-[#dee5ed] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm md:text-base text-[#101828] hover:text-[#923cf6] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Support Banner */}
          <div className="mt-8 p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-center">
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Have questions about enterprise fleets or custom materials?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#923cf6] hover:text-[#8129e0] mt-1.5"
            >
              <span>Contact our SignTap identity specialists</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>

      </div>

      <Footer />
      </div>
    </div>
  );
}
