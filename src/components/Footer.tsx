'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Wifi, ShieldCheck, Sparkles, ArrowRight, ArrowUpRight, Mail, Globe, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAFAFB] px-2.5 sm:px-4 pb-4 pt-10 text-white selection:bg-[#923cf6] selection:text-white">
      {/* Outer Rounded Container matching Hero 02 shell */}
      <div className="max-w-7xl mx-auto rounded-3xl md:rounded-[2rem] bg-[#101828] border border-white/10 p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#923cf6]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#087CF0]/10 blur-3xl pointer-events-none" />

        {/* Top CTA Band within Footer */}
        <div className="pb-12 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-purple-200 border border-purple-400/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse" />
              <span>Next-Gen SignTap Identity</span>
            </div>
            <h3 className="font-urbanist text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Upgrade to SignTap Contactless Identity?
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-lg">
              Equip yourself or your corporate fleet with precision-manufactured NTAG216 smart cards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/explore-cards"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] px-7 py-3 text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-purple-500/25 active:scale-95"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Explore All SignTap Cards</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Link>

            <Link
              href="/order"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/15 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.96]"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#FF7900]" />
              <span>Order Custom Card</span>
            </Link>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 py-12 border-b border-white/10 relative z-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo theme="dark" size="md" />
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              SignTap connects physical smart cards to personalized, dynamic digital identity profiles. Share your portfolio, contact details, and business credentials with a single contactless tap.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                <Wifi className="w-3.5 h-3.5 text-[#923cf6]" />
                NTAG216 Chipset
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                RLS Encrypted
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400 pt-2 font-mono">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#923cf6]" />
                <a href="mailto:signbridge.aiauto@gmail.com" className="hover:text-white transition-colors">
                  signbridge.aiauto@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <a href="tel:+919842253267" className="hover:text-white transition-colors">
                  +91 98422 53267
                </a>
              </p>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/explore-cards" className="hover:text-white transition-colors">
                  Explore SignTap Cards
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ & Compatibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Digital Identity */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Live Profiles
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/u/surya" className="hover:text-[#923cf6] transition-colors flex items-center gap-1">
                  Surya (Professional) <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/u/elena" className="hover:text-[#FF7900] transition-colors flex items-center gap-1">
                  Elena (Creator) <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/u/apex-studios" className="hover:text-white transition-colors flex items-center gap-1">
                  Apex Labs (Business) <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-white transition-colors">
                  Profile Themes
                </Link>
              </li>
              <li>
                <Link href="/order" className="hover:text-white transition-colors">
                  Order SignTap Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Account & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Account & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 relative z-10">
          <p>
            &copy; 2026 SignTap by SignBridge Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('signtap_loader_seen');
                  window.location.reload();
                }
              }}
              className="text-[11px] font-mono text-purple-300 hover:text-white transition-colors underline underline-offset-2 cursor-pointer"
            >
              Replay NFC Boot Loader
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-[#923cf6]" />
            <span className="font-mono text-[11px] text-slate-400">
              SignTap — Your Identity. One Tap Away.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
