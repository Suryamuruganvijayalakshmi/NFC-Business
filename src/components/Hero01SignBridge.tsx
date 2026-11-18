'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import SpotlightReveal from '@/components/originkit/ui/hero-01/spotlight-reveal';
import TrustedBy from '@/components/originkit/ui/hero-01/trusted-by';
import NFCCardVisual from '@/components/NFCCardVisual';
import { ArrowRight, Wifi, ShieldCheck, Sparkles, Download, Briefcase, Phone, Mail, ExternalLink, CreditCard } from 'lucide-react';

function asset(file: string) {
  return `/originkit/hero-01/${file}`;
}

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;

const TRUSTED_LOGOS = [
  {
    src: asset('logo-2.svg'),
    alt: 'Partner 1',
    width: 95,
    height: 22,
  },
  {
    src: asset('logo-3.svg'),
    alt: 'Partner 2',
    width: 108,
    height: 21,
  },
  {
    src: asset('logo-4.svg'),
    alt: 'Partner 3',
    width: 78,
    height: 18,
  },
  {
    src: asset('logo-1.svg'),
    alt: 'Partner 4',
    width: 100,
    height: 20,
  },
] as const;

const Annotation = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-8 -left-36 hidden h-[140px] w-[253px] select-none lg:block"
    >
      <div className="absolute top-[26px] left-[78px] flex h-[36px] w-[80px] items-center justify-center">
        <div className="-scale-y-100 rotate-[83.54deg]">
          <img
            alt=""
            src={asset('annotation-arrow.svg')}
            width={27}
            height={78}
            className="h-[64px] w-[22px] max-w-none"
          />
        </div>
      </div>

      <p className="absolute bottom-10 -left-12 flex w-[212px] rotate-[-10.6deg] flex-col justify-center text-center font-tillana text-[14px] leading-[1.25] tracking-[-0.02em] text-[#087CF0] font-semibold">
        <span>Instant NFC Tap</span>
        <span>No app required</span>
      </p>
    </div>
  );
};

const SlideIn = ({
  active,
  children,
  className,
  y = 20,
  duration = 0.3,
  onComplete,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  onComplete?: () => void;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const doneRef = useRef(false);

  const hidden = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y };
  const visible = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={active ? visible : hidden}
      transition={{
        type: 'tween',
        duration: prefersReducedMotion ? 0.2 : duration,
        ease: easeOutCubic,
      }}
      onAnimationComplete={() => {
        if (!active || doneRef.current) return;
        doneRef.current = true;
        onComplete?.();
      }}
    >
      {children}
    </motion.div>
  );
};

interface Hero01SignBridgeProps {
  currentProfile: {
    full_name: string;
    username: string;
    title: string;
    company?: string;
    bio: string;
    profile_image: string;
    skills?: string[];
    accent_color?: string;
  };
  onCardTap: () => void;
  tapSuccess: boolean;
}

export default function Hero01SignBridge({
  currentProfile,
  onCardTap,
  tapSuccess,
}: Hero01SignBridgeProps) {
  const prefersReducedMotion = useReducedMotion();
  const navDoneRef = useRef(false);

  const [showHero, setShowHero] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const [showTrusted, setShowTrusted] = useState(false);

  useEffect(() => {
    if (!prefersReducedMotion) return;
    setShowHero(true);
    setShowDescription(true);
    setShowCtas(true);
    setShowTrusted(true);
  }, [prefersReducedMotion]);

  const handleNavComplete = () => {
    if (navDoneRef.current || prefersReducedMotion) return;
    navDoneRef.current = true;
    setShowHero(true);
  };

  const handleSpotlightComplete = () => {
    if (prefersReducedMotion) return;
    setShowDescription(true);
  };

  const handleDescriptionComplete = () => {
    if (prefersReducedMotion) return;
    setShowCtas(true);
    setShowTrusted(true);
  };

  return (
    <div className="w-full bg-white px-2.5 sm:px-4 pt-2.5 text-[#010110]">
      {/* Mesh Gradient Main Hero Card */}
      <section
        aria-labelledby="signbridge-hero-heading"
        className="relative mx-auto w-full overflow-hidden rounded-[16px] md:rounded-[20px] bg-[url(/originkit/hero-01/mesh-gradient.png)] bg-cover bg-center pb-6 md:pb-12 shadow-sm border border-slate-200/60"
      >
        <div className="relative z-10 flex w-full flex-col items-center px-3 pt-3 ipad:px-6 ipad:pt-4">
          
          {/* Floating Pill Header / Nav */}
          <motion.header
            className="flex w-full max-w-160 items-center justify-between gap-2 rounded-full border border-white/80 bg-white/95 backdrop-blur-md px-3 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ipad:gap-3 ipad:px-4 ipad:py-2"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{
              type: 'tween',
              duration: prefersReducedMotion ? 0.2 : 0.35,
              ease: easeOutCubic,
            }}
            onAnimationComplete={handleNavComplete}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#010110]"
              aria-label="SignBridge NFC Home"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#087CF0] to-[#FF7900] flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-geist text-base font-extrabold leading-none text-[#101828]">
                Sign<span className="text-[#087CF0]">Bridge</span>
                <span className="ml-1.5 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-[#087CF0] font-bold border border-blue-100">
                  NFC
                </span>
              </span>
            </Link>

            {/* Nav links */}
            <nav aria-label="Hero navigation" className="flex items-center gap-2 sm:gap-4 ipad:gap-5">
              <Link
                href="/how-it-works"
                className="hidden md:inline-block text-xs font-semibold text-[#45545e] hover:text-[#087CF0] transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/explore-cards"
                className="hidden sm:inline-block text-xs font-semibold text-[#45545e] hover:text-[#087CF0] transition-colors"
              >
                Cards
              </Link>
              <Link
                href="/pricing"
                className="hidden lg:inline-block text-xs font-semibold text-[#45545e] hover:text-[#087CF0] transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-xs font-semibold text-[#363636] hover:text-[#087CF0] transition-colors px-2 py-1"
              >
                Login
              </Link>

              {/* Pill Button CTA */}
              <Link
                href="/order"
                className="relative inline-flex min-h-9 items-center justify-center overflow-clip rounded-full border border-solid border-[#454545] px-3.5 sm:px-4 py-1.5 text-center text-xs font-semibold text-white transition-all active:scale-[0.96] hover:opacity-95 shadow-xs"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #101828, #101828), radial-gradient(ellipse 170px 258px at 50% -198px, rgba(8,124,240,0.6) 0%, rgba(237,239,255,0) 100%), linear-gradient(123.39deg, #1f1f21 0%, #3e3d4c 34%, #1f1f21 51%, #3e3d4c 72%, #1f1f21 100%)',
                }}
              >
                <span>Get Card</span>
                <ArrowRight className="w-3 h-3 ml-1 text-[#FF7900]" />
              </Link>
            </nav>
          </motion.header>

          {/* Main Hero Typography & CTAs */}
          <div className="mt-8 sm:mt-12 flex w-full max-w-200 scroll-mt-24 flex-col items-center gap-5 text-center ipad:mt-14 ipad:gap-6">
            
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse" />
              <span className="text-[#087CF0] font-bold">SignBridge NFC</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Digital Identity Platform</span>
            </div>

            {/* Spotlight Reveal Title */}
            <SpotlightReveal
              id="signbridge-hero-heading"
              text="Your Identity. One Tap Away."
              blur={6}
              delay={0}
              active={showHero}
              onComplete={handleSpotlightComplete}
              className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[64px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#010110] [text-shadow:0_3px_6px_rgba(0,0,0,0.06),0_1px_1px_rgba(255,255,255,0.7)]"
            />

            {/* Slide-in Subtitle */}
            <SlideIn
              active={showDescription}
              y={16}
              duration={0.3}
              onComplete={handleDescriptionComplete}
              className="max-w-140 will-change-transform"
            >
              <p className="px-2 text-sm sm:text-base md:text-lg font-medium leading-relaxed tracking-[-0.01em] text-[#45545e]">
                Meet the smarter way to connect. Create your digital identity, share your portfolio and business details, and make every introduction memorable with SignBridge NFC.
              </p>
            </SlideIn>

            {/* CTAs with Playful Annotation Arrow */}
            <SlideIn
              active={showCtas}
              y={20}
              duration={0.3}
              className="relative flex w-full flex-col sm:flex-row items-center justify-center gap-3 pt-1 will-change-transform"
            >
              <Annotation />

              {/* Primary Dark Pill Button */}
              <Link
                href="/explore-cards"
                className="relative inline-flex min-h-12 w-full sm:w-auto shrink-0 items-center justify-center overflow-clip rounded-full border-3 border-solid border-[#3E3E3E] bg-linear-to-b from-[#292929] to-[#111] py-3.5 px-7 text-center text-sm font-semibold tracking-[-0.01em] text-white transition-all active:scale-[0.96] hover:opacity-95 shadow-lg shadow-black/15"
              >
                <CreditCard className="w-4 h-4 mr-2 text-[#FF7900]" />
                <span>Get Your NFC Card</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              {/* Secondary 3D Light Pill Button */}
              <a
                href="#how-it-works"
                className="relative inline-flex min-h-12 w-full sm:w-auto shrink-0 items-center justify-center rounded-full border-3 border-solid border-white bg-linear-to-b from-[#f4f4f4] to-[#fefefe] py-3.5 px-6 text-center text-sm font-semibold tracking-[-0.01em] text-[#161616] shadow-[0_0_0.225px_rgba(0,0,0,0.07),0_2.698px_2.923px_-1.349px_rgba(0,0,0,0.25),0_0.899px_3.598px_0.899px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.14)] transition-all active:scale-[0.96] hover:-translate-y-0.5 hover:shadow-md"
              >
                <Wifi className="w-4 h-4 mr-2 text-[#087CF0]" />
                <span>See How It Works</span>
              </a>
            </SlideIn>

            {/* Feature Checklist Pills */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#087CF0]" />
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

          {/* Browser Preview Mockup — Hero 01 Frame enclosing SignBridge NFC Interactive Showcase */}
          <motion.div
            className="relative mx-auto mt-8 sm:mt-10 mb-[-12px] w-full max-w-5xl self-center will-change-transform ipad:mt-12"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 36 }}
            animate={showHero ? (prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }) : { opacity: 0 }}
            transition={{
              type: 'tween',
              duration: prefersReducedMotion ? 0.2 : 0.45,
              ease: easeOutCubic,
            }}
          >
            {/* The Outer Browser Shell from Originkit Hero 01 */}
            <div className="rounded-[16px] md:rounded-[20px] bg-[#f4f0e8] p-2 sm:p-3 shadow-[0_0_6px_1px_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.12),0_15px_20px_-17px_rgba(0,0,0,0.13)] border border-[#e2ddd4]">
              
              {/* Browser Window Chrome Top Bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-white/70 rounded-t-[10px] border-b border-[#e6e1d7] mb-2">
                <div className="flex items-center gap-1.5">
                  <img src={asset('traffic-close.svg')} alt="" className="w-3 h-3" />
                  <img src={asset('traffic-min.svg')} alt="" className="w-3 h-3" />
                  <img src={asset('traffic-full.svg')} alt="" className="w-3 h-3" />
                </div>
                
                {/* Browser URL bar */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ece7dd] text-[11px] font-mono text-slate-700 min-w-50 sm:min-w-72 justify-center shadow-inner">
                  <img src={asset('lock.svg')} alt="" className="w-3 h-3 text-emerald-600" />
                  <span>https://signbridge.click/u/{currentProfile.username}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#087CF0] uppercase tracking-wider">
                  <Wifi className="w-3 h-3" />
                  <span className="hidden sm:inline">NFC Active</span>
                </div>
              </div>

              {/* Inside Browser Viewport: Interactive NFC Card Beside Live Smartphone Profile */}
              <div className="relative overflow-hidden rounded-[10px] bg-[#101828] p-4 sm:p-8 text-white min-h-110 flex flex-col justify-center">
                
                {/* Subtle Backdrop Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#087CF0]/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF7900]/10 blur-3xl pointer-events-none" />

                {/* Tap Alert Notification */}
                {tapSuccess && (
                  <div className="mb-4 mx-auto max-w-md p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold">NFC Tap Detected! Mobile profile rendered instantly.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  
                  {/* Left: Physical NFC Card with Click-to-Tap Hint */}
                  <div className="lg:col-span-6 flex flex-col items-center text-center">
                    <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-medium text-slate-300 border border-white/10">
                      <Wifi className="w-3 h-3 text-[#087CF0] animate-pulse" />
                      <span>Click the smart card to simulate instant phone tap</span>
                    </div>

                    <div className="transition-transform duration-300 hover:scale-[1.02]">
                      <NFCCardVisual
                        fullName={currentProfile.full_name}
                        title={currentProfile.title}
                        username={currentProfile.username}
                        cardName="SignBridge Smart Card"
                        theme="black"
                        onTap={onCardTap}
                        interactive={true}
                      />
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      Physical matte finish with embedded genuine <span className="text-white font-semibold">NTAG216</span> microchip
                    </p>
                  </div>

                  {/* Right: Live Profile Mobile Card */}
                  <div className="lg:col-span-6 flex justify-center">
                    <div className="w-full max-w-[340px] rounded-2xl bg-[#162032] border border-white/10 p-5 shadow-2xl">
                      
                      {/* Mobile Card Top Status */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#30D158]" />
                          <span className="font-mono text-slate-300 text-[11px]">/u/{currentProfile.username}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#087CF0]/20 text-[#087CF0] text-[10px] font-bold">
                          100% Mobile
                        </span>
                      </div>

                      {/* Profile Header */}
                      <div className="pt-4 flex items-center gap-3">
                        <img
                          src={currentProfile.profile_image}
                          alt={currentProfile.full_name}
                          className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#087CF0] shadow-md"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {currentProfile.full_name}
                            <ShieldCheck className="w-4 h-4 text-[#087CF0]" />
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">{currentProfile.title}</p>
                          {currentProfile.company && (
                            <p className="text-[11px] text-[#FF7900] font-medium">{currentProfile.company}</p>
                          )}
                        </div>
                      </div>

                      {/* Bio snippet */}
                      <p className="mt-3 text-xs text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-lg border border-white/5 line-clamp-2">
                        {currentProfile.bio}
                      </p>

                      {/* Action buttons inside live preview */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <Link
                          href={`/u/${currentProfile.username}`}
                          className="py-2 px-3 rounded-lg bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Save Contact</span>
                        </Link>
                        <Link
                          href={`/u/${currentProfile.username}`}
                          className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-[#FF7900]" />
                          <span>Portfolio</span>
                        </Link>
                      </div>

                      {/* Quick Contact Bar */}
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-slate-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-400" /> Call
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-sky-400" /> Email
                        </span>
                        <Link
                          href={`/u/${currentProfile.username}`}
                          className="text-[#087CF0] hover:underline flex items-center gap-0.5 font-medium"
                        >
                          Full Profile <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Trusted By Marquee (Exact Originkit Marquee adapted for SignBridge) */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-10 pb-8 ipad:pt-14 ipad:pb-12">
        <div className="flex w-full max-w-160 items-center gap-3 mb-6">
          <span
            aria-hidden="true"
            className="h-px min-w-0 flex-1 bg-linear-to-r from-transparent to-[#4b4b4b]/40"
          />
          <p className="shrink-0 text-center text-xs sm:text-sm font-semibold tracking-[-0.0125em] text-slate-500 uppercase">
            Trusted by 10,000+ Modern Professionals & Companies
          </p>
          <span
            aria-hidden="true"
            className="h-px min-w-0 flex-1 bg-linear-to-r from-[#4b4b4b]/40 to-transparent"
          />
        </div>

        <TrustedBy logos={TRUSTED_LOGOS} active={showTrusted} />
      </div>
    </div>
  );
}

