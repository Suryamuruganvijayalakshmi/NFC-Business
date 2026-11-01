'use client';

import React, { useState } from 'react';
import Logo from './Logo';
import { Wifi, Sparkles, CheckCircle2, Smartphone } from 'lucide-react';

interface NFCCardVisualProps {
  fullName?: string;
  title?: string;
  username?: string;
  cardName?: string;
  theme?: 'black' | 'silver' | 'blue';
  onTap?: () => void;
  interactive?: boolean;
}

export default function NFCCardVisual({
  fullName = 'Surya Narayanan',
  title = 'Founder & Hardware Architect',
  username = 'surya',
  cardName = 'SignBridge Smart Card',
  theme = 'black',
  onTap,
  interactive = true,
}: NFCCardVisualProps) {
  const [tapped, setTapped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleTap = () => {
    if (!interactive) return;
    setTapped(true);
    if (onTap) onTap();
    setTimeout(() => setTapped(false), 2400);
  };

  const themeStyles = {
    black: 'from-[#101828] via-[#162032] to-[#0A0F1D] border-white/15 text-white shadow-2xl',
    silver: 'from-slate-200 via-slate-100 to-slate-300 border-slate-300 text-slate-900 shadow-xl',
    blue: 'from-[#087CF0] via-[#0557AB] to-[#101828] border-white/25 text-white shadow-2xl',
  }[theme];

  return (
    <div className="relative group perspective-1000 flex flex-col items-center">
      {/* Physical Smart Card Container */}
      <div 
        onClick={handleTap}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-[340px] h-[214px] sm:w-[380px] sm:h-[240px] rounded-[18px] p-6 bg-gradient-to-tr ${themeStyles} border flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-500 transform ${
          isHovered ? '-translate-y-2 rotate-1 shadow-cyan-500/10' : 'shadow-slate-900/30'
        } ${tapped ? 'scale-95 ring-4 ring-[#087CF0]' : ''}`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(16, 24, 40, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
        }}
      >
        {/* Subtle holographic sheen overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 transition-transform duration-1000"
          style={{
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          }}
        />

        {/* Top Row: SignBridge Brand & Contactless Icon */}
        <div className="flex items-center justify-between z-10">
          <Logo theme="dark" size="sm" />
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase font-mono text-white/50">
              NFC · NTAG216
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-[#087CF0] rotate-90" />
            </div>
          </div>
        </div>

        {/* Middle Row: Gold/Silver Security Microchip */}
        <div className="flex items-center gap-4 z-10 my-auto">
          <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/40 p-1 flex flex-col justify-between shadow-inner">
            <div className="w-full h-px bg-amber-800/40" />
            <div className="w-full flex justify-between">
              <div className="w-2.5 h-3 border border-amber-800/30 rounded-sm" />
              <div className="w-2.5 h-3 border border-amber-800/30 rounded-sm" />
            </div>
            <div className="w-full h-px bg-amber-800/40" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-[11px] font-mono tracking-widest text-[#FF7900] uppercase font-semibold">
              SignBridge ID
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              signbridge.click/id/{username}
            </span>
          </div>
        </div>

        {/* Bottom Row: Cardholder Details & Status Badge */}
        <div className="flex items-end justify-between z-10">
          <div>
            <h4 className="text-base sm:text-lg font-bold tracking-tight text-white font-sans drop-shadow-sm">
              {fullName}
            </h4>
            <p className="text-xs text-white/60 font-medium">
              {title}
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVE
            </span>
            <span className="text-[9px] text-white/30 font-mono mt-1">
              UID: SB-{username.toUpperCase().slice(0, 4)}-2026
            </span>
          </div>
        </div>

        {/* Ripple Wave Animation upon NFC Tap */}
        {tapped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-48 h-48 rounded-full border-4 border-[#087CF0]/80 animate-ping" />
            <div className="absolute w-28 h-28 rounded-full bg-[#087CF0]/20 animate-pulse" />
          </div>
        )}
      </div>

      {/* Simulated Smartphone Tap Notification Modal / Popover */}
      {tapped && (
        <div className="mt-4 px-4 py-2.5 rounded-xl bg-white text-[#101828] border border-slate-200 shadow-xl flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-lg bg-[#087CF0]/10 flex items-center justify-center text-[#087CF0]">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-900 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              NFC Tag Discovered!
            </p>
            <p className="text-[11px] text-slate-500">
              Opening signbridge.click/id/{username}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Helper Hint */}
      {interactive && !tapped && (
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
          Click card to simulate smartphone NFC tap
        </p>
      )}
    </div>
  );
}
