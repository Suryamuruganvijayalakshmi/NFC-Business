'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Lock, 
  RefreshCw, 
  Wifi, 
  Crown, 
  ThumbsUp, 
  MessageSquare, 
  Repeat, 
  Send, 
  Sparkles, 
  Check, 
  CreditCard, 
  Users, 
  Briefcase, 
  TrendingUp,
  Globe,
  Share2
} from 'lucide-react';

export default function SignTapDashboardMockup() {
  const [tapped, setTapped] = useState(false);

  const handleTapSimulation = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 3000);
  };

  return (
    <div className="w-full bg-[#F4F2EE] text-slate-800 rounded-[10px] overflow-hidden select-none border border-slate-200/90 shadow-inner">
      
      {/* =====================================================================
          1. SAFARI / MACOS BROWSER CHROME HEADER
      ===================================================================== */}
      <div className="bg-[#EAE8E4] px-3 sm:px-4 py-2 border-b border-slate-300/80 flex items-center justify-between gap-2">
        {/* Window controls traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
        </div>

        {/* Central URL Address Pill */}
        <div className="flex-1 max-w-sm sm:max-w-md mx-auto bg-white/90 rounded-md px-3 py-1 text-[11px] sm:text-xs text-slate-600 flex items-center justify-center gap-1.5 shadow-2xs border border-slate-200 truncate">
          <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="font-medium truncate">nfc.signbridge.click/u/surya</span>
          <span className="text-[10px] text-slate-400 ml-1 hidden sm:inline">• Contactless Verified</span>
        </div>

        {/* Browser right actions */}
        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
          <RefreshCw className="w-3 h-3 hover:text-slate-600 cursor-pointer" />
        </div>
      </div>

      {/* =====================================================================
          2. SIGNTAP IN-APP TOP BAR
      ===================================================================== */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-5 py-2 flex items-center justify-between gap-3 text-xs">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0A66C2] flex items-center justify-center shadow-xs">
            <Wifi className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight hidden sm:inline">
            Sign<span className="text-[#0A66C2]">Tap</span>
          </span>
        </div>

        {/* Mock Navigation Tabs */}
        <div className="flex items-center gap-3 sm:gap-5 text-slate-500 font-medium text-[11px]">
          <span className="text-slate-900 font-bold border-b-2 border-slate-900 pb-0.5">Feed</span>
          <span className="hover:text-slate-900 cursor-pointer">Network (24)</span>
          <span className="hover:text-slate-900 cursor-pointer hidden sm:inline">Jobs</span>
          <span className="hover:text-slate-900 cursor-pointer hidden md:inline">Messaging</span>
          <span className="text-[#0A66C2] font-semibold flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            <span>NFC Cards</span>
          </span>
        </div>

        {/* User Mini Avatar */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Surya"
              className="w-6 h-6 rounded-full object-cover border border-slate-300"
            />
            <Crown className="w-2.5 h-2.5 text-amber-500 absolute -bottom-0.5 -right-0.5 fill-amber-400" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 hidden sm:inline">Surya V.M</span>
        </div>
      </div>

      {/* =====================================================================
          3. SIGNTAP SOCIAL FEED & HARDWARE MOCKUP BODY
      ===================================================================== */}
      <div className="p-3 sm:p-5 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          
          {/* Left Mini Column: Profile Card */}
          <div className="hidden md:block md:col-span-4 space-y-2.5">
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs text-center">
              <div className="h-10 rounded-lg bg-gradient-to-r from-[#0A66C2] to-slate-900 -mx-1 -mt-1 relative overflow-hidden" />
              <div className="-mt-6 relative inline-block">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Surya"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs mx-auto"
                />
                <Crown className="w-3.5 h-3.5 text-amber-500 absolute bottom-0 right-0 fill-amber-400 stroke-amber-600" />
              </div>

              <h4 className="font-bold text-slate-900 text-xs mt-1">Surya Narayanan</h4>
              <p className="text-[10px] text-slate-500 line-clamp-1">Founder & Hardware Architect</p>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600 font-medium">
                <span>Network</span>
                <span className="font-bold text-[#0A66C2]">24 connections</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium mt-1">
                <span>Impressions</span>
                <span className="font-bold text-slate-800">1,280</span>
              </div>
            </div>

            {/* Hardware Status */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-3 shadow-xs text-left text-[11px]">
              <div className="flex items-center justify-between text-amber-400 font-semibold text-[10px] mb-1">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  <span>Physical Chip Online</span>
                </span>
                <span className="text-emerald-400 font-bold">● Active</span>
              </div>
              <p className="text-slate-300 text-[10px]">Card UID: ST-NFC-9842 (NTAG216)</p>
            </div>
          </div>

          {/* Center Column: Social Activity Feed Card */}
          <div className="col-span-1 md:col-span-8 space-y-2.5 text-left">
            
            {/* Create Post Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-3 shadow-xs flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Surya"
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 bg-slate-100 rounded-full px-3 py-1.5 text-[11px] text-slate-500 font-medium truncate">
                Start a post, share a project, milestone...
              </div>
            </div>

            {/* Live Post Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Surya"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-slate-900">Surya Narayanan</span>
                      <span className="px-1 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">PRO</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Founder & Hardware Architect • 2h ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[#0A66C2] font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                  <Globe className="w-2.5 h-2.5" />
                  <span>Public</span>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed mb-3">
                🚀 Excited to share that <strong>SignTap NFC v2.0</strong> is live! Every contactless card tap now syncs your career history, live portfolio, and verified credentials with sub-millisecond cloud routing. Welcome to the physical web revolution! 🌐✨
              </p>

              {/* NFC Card Product Preview inside the Post */}
              <div className="rounded-lg bg-gradient-to-r from-slate-900 via-slate-800 to-[#0A66C2] p-3 text-white flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>SignTap Laser-Engraved NFC Card</span>
                  </div>
                  <h5 className="font-bold text-xs mt-0.5">Surya Narayanan · Midnight Obsidian Finish</h5>
                  <p className="text-[10px] text-slate-300">Tap anywhere to share vCard, portfolio & verified social links.</p>
                </div>

                <button
                  onClick={handleTapSimulation}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-white text-slate-900 text-[11px] font-bold hover:bg-slate-100 transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
                >
                  <Wifi className="w-3 h-3 text-[#0A66C2]" />
                  <span>{tapped ? 'Tapped!' : 'Tap Card'}</span>
                </button>
              </div>

              {/* Contactless Tap Toast Banner */}
              {tapped && (
                <div className="mb-2.5 p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in zoom-in-95">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Contactless NFC Handshake Successful! Surya's profile opened on phone in 12ms.</span>
                </div>
              )}

              {/* Social Reaction Counts & 4-Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <span>👍 👏 ❤️</span>
                  <span className="ml-0.5">84 reactions</span>
                </span>
                <span>16 comments • 12 reposts</span>
              </div>

              <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-around text-[10px] text-slate-600 font-semibold">
                <span className="flex items-center gap-1 hover:text-[#0A66C2] cursor-pointer">
                  <ThumbsUp className="w-3 h-3 text-[#0A66C2]" /> Like
                </span>
                <span className="flex items-center gap-1 hover:text-[#0A66C2] cursor-pointer">
                  <MessageSquare className="w-3 h-3" /> Comment
                </span>
                <span className="flex items-center gap-1 hover:text-[#0A66C2] cursor-pointer">
                  <Repeat className="w-3 h-3" /> Repost
                </span>
                <span className="flex items-center gap-1 hover:text-[#0A66C2] cursor-pointer">
                  <Send className="w-3 h-3" /> Send
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

