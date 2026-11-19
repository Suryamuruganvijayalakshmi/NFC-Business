'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import Logo from '@/components/Logo';
import NFCCardVisual from '@/components/NFCCardVisual';
import { ArrowRight, Wifi, ShieldCheck, Sparkles, CreditCard, Download, ExternalLink, Phone, Mail } from 'lucide-react';

const A = '/originkit/hero-02';

const BRAND_LOGOS = [
  { name: 'Lumina', src: `${A}/brand-lumina.svg` },
  { name: 'Vortex', src: `${A}/brand-vortex.svg` },
  { name: 'Velocity', src: `${A}/brand-velocity.svg` },
  { name: 'Synergy', src: `${A}/brand-synergy.svg` },
  { name: 'Enigma', src: `${A}/brand-enigma.svg` },
  { name: 'Spectrum', src: `${A}/brand-spectrum.svg` },
] as const;

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;
const SHARED_TWEEN = {
  type: 'tween' as const,
  duration: 0.4,
  ease: EASE_OUT,
};

interface Hero02SignTapProps {
  currentProfile: {
    full_name: string;
    username: string;
    title: string;
    company?: string;
    bio: string;
    profile_image: string;
    skills?: string[];
  };
  onCardTap: () => void;
  tapSuccess: boolean;
}

export default function Hero02SignTap({
  currentProfile,
  onCardTap,
  tapSuccess,
}: Hero02SignTapProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;

  const [activeAction, setActiveAction] = useState<'profile' | 'save' | 'insights'>('save');
  const [isSimulatingTap, setIsSimulatingTap] = useState(false);

  const cardInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.96 };
  const cardAnimate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };

  const handleSimulateTap = () => {
    setIsSimulatingTap(true);
    if (onCardTap) onCardTap();
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#923cf6', '#06b6d4', '#FF7900', '#30D158'],
        disableForReducedMotion: true,
      });
    } catch {
      // Safe fallback
    }
    setTimeout(() => setIsSimulatingTap(false), 3000);
  };

  const handleReplayLoader = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('signtap:play-loader'));
    }
  };

  return (
    <section
      id="top"
      aria-label="SignTap hero"
      className="relative w-full overflow-hidden bg-white text-[#0d0d0d] pt-2"
    >
      <div className="relative mx-auto w-full px-2.5 sm:px-4">
        
        {/* Main Hero Shell with Hero 02 rounded bottom, layered shadow, and dot grid */}
        <div className="relative overflow-hidden rounded-3xl md:rounded-[clamp(2rem,4vw,3.125rem)] border border-solid border-[#dee5ed] bg-[#f8fafc] shadow-[0_0_0_6px_white,0_7px_6px_rgba(140,150,169,0.12),0_22px_30px_rgba(140,150,169,0.1)]">
          
          {/* Soft lavender wash at the bottom */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(55%,32rem)] rounded-b-[inherit]"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, rgba(248,250,252,0) 0%, #f0edf8 35%, #e3d4f9 70%, #dac2f7 100%)',
            }}
          />

          {/* Dot grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-b-[inherit] bg-size-[186px_186px] bg-top-left opacity-90"
            style={{ backgroundImage: `url(${A}/dots.png)` }}
          />

          {/* Radial soft top fade over dots */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-b-[inherit]"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 100% 70% at 50% 0%, #f8fafc 15%, transparent 70%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center px-4 pt-5 pb-10 ipad:px-8 ipad:pt-6">
            
            {/* 1. SignTap Floating Pill Navbar (Hero 02 Architecture) */}
            <header className="relative z-30 h-[72px] sm:h-[80px] mx-auto flex w-full max-w-[995px] items-center justify-between overflow-clip rounded-full border border-solid border-[#dee5ed] bg-white/95 backdrop-blur-md py-3 pr-3 pl-4 sm:pl-6 shadow-[0_4px_16px_rgba(140,150,169,0.12)]">
              
              {/* Brand Logo */}
              <Link href="/" className="flex items-center group">
                <Logo theme="light" size="sm" />
              </Link>

              {/* Navigation Links */}
              <nav aria-label="Hero navigation" className="hidden lg:flex items-center gap-6">
                <Link
                  href="/how-it-works"
                  className="text-sm font-medium text-[#45545e] hover:text-[#923cf6] transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="/explore-cards"
                  className="text-sm font-medium text-[#45545e] hover:text-[#923cf6] transition-colors"
                >
                  Explore Cards
                </Link>
                <Link
                  href="/features"
                  className="text-sm font-medium text-[#45545e] hover:text-[#923cf6] transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-[#45545e] hover:text-[#923cf6] transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#45545e] hover:text-[#923cf6] transition-colors"
                >
                  Login
                </Link>
              </nav>

              {/* Signature Hero 02 Pill CTA */}
              <Link
                href="/order"
                className="inline-flex items-center overflow-clip rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all shadow-md active:scale-95"
              >
                <span>Get SignTap Card</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </header>

            {/* 2. Hero Headline, Announcement Badge & CTAs */}
            <div className="mt-8 sm:mt-12 flex w-full max-w-[1080px] flex-col items-center text-center gap-5 sm:gap-6">
              
              {/* Hero 02 Signature Announcement Badge with Shimmer & Glow */}
              <div className="animate-page-reveal will-change-transform flex flex-wrap items-center justify-center gap-2">
                <Link
                  href="/explore-cards"
                  className="relative group inline-flex items-center gap-2 overflow-clip rounded-full border border-solid border-[#dee5ed] bg-white/90 backdrop-blur-md py-1.5 pr-4 pl-1.5 shadow-[0_0_0_3px_white,0_4px_12px_rgba(140,150,169,0.2)] transition-all hover:bg-white hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(146,60,246,0.2)]"
                >
                  <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#923cf6] to-[#087CF0] px-3 py-1 text-xs font-bold text-white shadow-2xs">
                    <Sparkles className="w-3 h-3 mr-1 animate-spin" style={{ animationDuration: '6s' }} />
                    New
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#262626]">
                    SignTap • Your Identity. One Tap Away.
                  </span>
                  <img
                    src={`${A}/arrow-right.svg`}
                    alt=""
                    width={16}
                    height={16}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                {/* Replay NFC Boot Loader Pill */}
                <button
                  type="button"
                  onClick={handleReplayLoader}
                  className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50/80 hover:bg-purple-100 text-purple-700 py-1.5 px-3.5 text-xs font-semibold shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title="Replay the SignTap Signature Animation"
                >
                  <Wifi className="w-3.5 h-3.5 text-[#923cf6] animate-pulse" />
                  <span>Replay SignTap Signature</span>
                </button>
              </div>

              {/* Urbanist Main Title with Kinetic Gradient Flow */}
              <h1 className="font-urbanist text-3xl sm:text-5xl lg:text-6xl xl:text-[68px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#0d0d0d] max-w-4xl">
                Your Identity.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#923cf6] via-[#06b6d4] to-[#923cf6] bg-[length:200%_auto] animate-border-shimmer">
                  One Tap Away.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-2xl text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#666] text-pretty">
                Meet <strong className="text-[#0d0d0d]">SignTap</strong>, the smarter way to connect. Create your personalized digital profile, share your portfolio and business credentials, and make every introduction memorable with genuine NTAG216 smart cards.
              </p>

              {/* Dual CTAs in Hero 02 Style */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/explore-cards"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] px-7 py-3.5 text-sm sm:text-base font-semibold text-white transition-all shadow-lg shadow-purple-500/25 active:scale-95"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Get Your SignTap Card</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-solid border-[#dee5ed] bg-white hover:bg-slate-50 px-6 py-3.5 text-sm sm:text-base font-semibold text-[#1d1d1d] shadow-xs transition-all"
                >
                  <Wifi className="w-4 h-4 mr-2 text-[#923cf6]" />
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Feature Checklist Pills */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#923cf6]" />
                  iOS & Android Native
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
                  Zero App Required
                </span>
                <span className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  1-Tap vCard Phonebook Save
                </span>
              </div>

            </div>

            {/* 3. Hero 02 Phone Showcase + SignTap Interactive Hardware & Profile */}
            <div className="relative z-10 mx-auto mt-8 sm:mt-12 w-full max-w-[1240px]">
              
              {/* Tap Notification Alert */}
              {(tapSuccess || isSimulatingTap) && (
                <div className="mb-4 mx-auto max-w-md p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-900 text-xs flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">SignTap NFC Tag Detected! Profile connected via 13.56 MHz RFID.</span>
                </div>
              )}

              {/* Interactive Split Experience inside Hero 02 Frame */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                
                {/* Left Side: Physical Matte Black SignTap Card with Tap Trigger */}
                <div className="lg:col-span-5 flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={handleSimulateTap}
                    className="mb-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border border-purple-200 text-[11px] font-semibold text-purple-700 shadow-xs hover:bg-purple-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Wifi className="w-3.5 h-3.5 text-[#923cf6] animate-pulse" />
                    <span>Click card to simulate NFC contactless tap</span>
                  </button>

                  <div className={`transition-all duration-500 transform ${isSimulatingTap ? '-translate-y-4 scale-[1.03] drop-shadow-[0_0_30px_rgba(146,60,246,0.6)]' : 'hover:scale-[1.02]'}`}>
                    <NFCCardVisual
                      fullName={currentProfile.full_name}
                      title={currentProfile.title}
                      username={currentProfile.username}
                      cardName="SignTap Smart Card"
                      theme="black"
                      onTap={handleSimulateTap}
                      interactive={true}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-500 font-medium">
                    Genuine NXP <span className="font-bold text-slate-800">NTAG216</span> contactless chip • Matte laser-etched finish
                  </p>
                </div>

                {/* Right Side: Hero 02 Floating Phone Mockup with Dynamic Island & Live Profile */}
                <div className="lg:col-span-7 relative flex justify-center">
                  
                  {/* Floating Action Cards from Hero 02 with Idle Floating Bobbing */}
                  {/* Liked Card (Hero 02 Top-Left) */}
                  <motion.div
                    className="absolute -top-4 -left-4 sm:left-4 z-30 hidden sm:flex items-center gap-2.5 overflow-clip rounded-full border border-solid border-[#dee5ed] bg-white py-2 pr-3.5 pl-2 shadow-[0_0_0_2px_white,0_15px_28.6px_rgba(0,0,0,0.12)] animate-float-bob"
                    initial={cardInitial}
                    animate={cardAnimate}
                    transition={{ ...SHARED_TWEEN, delay: 0.1 }}
                  >
                    <div className="flex items-center">
                      {[`${A}/avatar-1.png`, `${A}/avatar-2.png`, `${A}/avatar-3.png`].map((src, i) => (
                        <span key={i} className={`relative size-7 shrink-0 overflow-clip rounded-full ${i < 2 ? 'mr-[-10px]' : ''}`}>
                          <Image src={src} alt="" width={28} height={28} className="size-full object-cover" />
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#1d1d1d]">
                      <img src={`${A}/heart.svg`} alt="" width={18} height={18} />
                      <span>10k+ Connections</span>
                    </span>
                  </motion.div>

                  {/* Actions Card (Hero 02 Top-Right) */}
                  <motion.div
                    className="absolute -top-4 -right-2 sm:right-4 z-30 hidden sm:flex items-start gap-1.5 overflow-clip rounded-full bg-white p-1.5 shadow-[0_0_0_2px_white,0_15px_28.6px_rgba(0,0,0,0.12)] border border-[#dee5ed] animate-float-bob-delayed"
                    initial={cardInitial}
                    animate={cardAnimate}
                    transition={{ ...SHARED_TWEEN, delay: 0.2 }}
                  >
                    {[
                      { id: 'profile', label: 'Profile' },
                      { id: 'save', label: 'Save Contact' },
                      { id: 'insights', label: 'Insight' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveAction(item.id as any)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          activeAction === item.id
                            ? 'bg-[#923cf6] text-white shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>

                  {/* Stats Card (Hero 02 Bottom-Left) */}
                  <motion.div
                    className="absolute -bottom-4 -left-2 sm:left-4 z-30 hidden sm:flex items-center justify-between rounded-xl border border-solid border-[#dee5ed] bg-white p-3 shadow-[0_0_0_2px_white,0_12px_24px_rgba(0,0,0,0.12)] gap-4 min-w-[200px] animate-float-bob-slow"
                    initial={cardInitial}
                    animate={cardAnimate}
                    transition={{ ...SHARED_TWEEN, delay: 0.25 }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-extrabold text-[#1d1d1d]">58</span>
                      <span className="text-[10px] font-semibold text-slate-500">Taps</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200" />
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-extrabold text-[#1d1d1d]">486</span>
                      <span className="text-[10px] font-semibold text-slate-500">Views</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200" />
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-extrabold text-[#923cf6]">397</span>
                      <span className="text-[10px] font-semibold text-slate-500">Saved</span>
                    </div>
                  </motion.div>

                  {/* The Center Smartphone Frame with Dynamic Island & NFC Waves */}
                  <div className="relative w-[288px] sm:w-[330px] rounded-[42px] bg-[#1d1d1b] p-2.5 sm:p-3 shadow-2xl border-4 border-[#2b2b29] text-white overflow-hidden">
                    
                    {/* Concentric Contactless Radar Ripple at Top of Phone on Tap */}
                    {(tapSuccess || isSimulatingTap) && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
                        <div className="absolute w-36 h-36 rounded-full border border-purple-500 animate-ping opacity-50 [animation-delay:0.3s]" />
                      </div>
                    )}

                    {/* Dynamic Island with Live NFC Detection */}
                    <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-30 transition-all duration-300">
                      {(tapSuccess || isSimulatingTap) ? (
                        <div className="bg-black/95 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-2xl text-[10px] font-mono whitespace-nowrap animate-in zoom-in-95 duration-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-white font-bold">NFC Read:</span>
                          <span className="text-purple-300 font-semibold">{currentProfile.full_name.split(' ')[0]}</span>
                          <span className="text-[8px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200">100%</span>
                        </div>
                      ) : (
                        <img src={`${A}/dynamic-island.svg`} alt="" width={72} height={20} className="w-20" />
                      )}
                    </div>

                    {/* Smartphone Screen Viewport */}
                    <div className="rounded-[32px] bg-[#101828] pt-12 pb-6 px-4 text-center min-h-[440px] flex flex-col justify-between relative overflow-hidden border border-white/10">
                      
                      {/* Top URL Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                        </span>
                        <span>signtap.me/u/{currentProfile.username}</span>
                      </div>

                      {/* Profile Details */}
                      <div className="py-4 flex flex-col items-center">
                        <img
                          src={currentProfile.profile_image}
                          alt={currentProfile.full_name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#923cf6] shadow-lg mb-2.5"
                        />
                        <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                          {currentProfile.full_name}
                          <ShieldCheck className="w-4 h-4 text-[#923cf6]" />
                        </h4>
                        <p className="text-xs text-slate-400">{currentProfile.title}</p>
                        {currentProfile.company && (
                          <p className="text-[11px] text-[#FF7900] font-medium mt-0.5">{currentProfile.company}</p>
                        )}

                        <p className="mt-2.5 text-[11px] text-slate-300 bg-white/5 p-2 rounded-xl border border-white/5 line-clamp-2 max-w-[240px]">
                          {currentProfile.bio}
                        </p>
                      </div>

                      {/* Action Buttons inside Smartphone */}
                      <div className="space-y-2">
                        <Link
                          href={`/u/${currentProfile.username}`}
                          className="w-full py-2.5 px-4 rounded-full bg-[#923cf6] hover:bg-[#8129e0] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Save Contact to Phonebook</span>
                        </Link>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <Link
                            href={`/u/${currentProfile.username}`}
                            className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium transition-colors"
                          >
                            Full Portfolio
                          </Link>
                          <a
                            href="tel:+15550000000"
                            className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium transition-colors"
                          >
                            Direct Call
                          </a>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* 4. Trusted by Marquee from Hero 02 */}
        <div className="py-8 sm:py-12 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 px-4">
          <p className="text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Trusted by 10,000+ Modern Professionals & Leading Enterprises
          </p>

          <div
            className="relative w-full max-w-[840px] overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
            aria-label="Trusted brands"
            role="region"
          >
            <ul className="flex w-max items-center gap-x-6 sm:gap-x-10 animate-trusted-marquee will-change-transform">
              {BRAND_LOGOS.map((brand) => (
                <li key={brand.name} className="relative h-8 w-24 sm:h-9 sm:w-28 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                  <img src={brand.src} alt={brand.name} className="size-full object-contain" />
                </li>
              ))}
              {BRAND_LOGOS.map((brand) => (
                <li key={`${brand.name}-duplicate`} className="relative h-8 w-24 sm:h-9 sm:w-28 shrink-0 opacity-70 hover:opacity-100 transition-opacity" aria-hidden="true">
                  <img src={brand.src} alt="" className="size-full object-contain" />
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

