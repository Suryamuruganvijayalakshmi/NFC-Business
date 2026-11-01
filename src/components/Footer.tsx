'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Wifi, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#101828] text-white border-t border-white/10 pt-16 pb-12 selection:bg-[#087CF0] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo theme="dark" size="md" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              SignBridge ID bridges physical cards with rich, instant digital identity pages. Showcase your portfolio, links, achievements, and services with a single smartphone tap.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                <Wifi className="w-3.5 h-3.5 text-[#087CF0]" />
                NFC Ready
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                RLS Encrypted
              </span>
            </div>

            <p className="text-xs text-slate-500 italic mt-3">
              &ldquo;Connecting Ideas, Empowering Innovation.&rdquo;
            </p>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-white transition-colors">
                  Profile Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Smart Cards
                </Link>
              </li>
              <li>
                <Link href="/id/surya" className="hover:text-[#087CF0] transition-colors flex items-center gap-1">
                  Demo Profile: Surya <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Dashboard */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Dashboard
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="hover:text-white transition-colors">
                  Profile Editor
                </Link>
              </li>
              <li>
                <Link href="/dashboard/design" className="hover:text-white transition-colors">
                  Customization
                </Link>
              </li>
              <li>
                <Link href="/dashboard/nfc" className="hover:text-white transition-colors">
                  NFC Card Manager
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="hover:text-white transition-colors">
                  Live Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About SignBridge
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <a 
                  href="https://signbridge.click" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  signbridge.click <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 SignBridge. All rights reserved. Your Identity. One Tap Away.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">NFC Hardware Specs</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
