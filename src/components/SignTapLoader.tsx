'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Wifi, Sparkles } from 'lucide-react';

interface SignTapLoaderProps {
  forceShow?: boolean;
  onFinish?: () => void;
}

export default function SignTapLoader({ forceShow = false, onFinish }: SignTapLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    { label: 'Initializing NXP NTAG216 Protocol', sub: 'Calibrating 13.56 MHz High-Frequency Field', pct: 25 },
    { label: 'Handshaking Contactless Transceiver', sub: 'ISO/IEC 14443 Type A Standard Compliant', pct: 55 },
    { label: 'Synchronizing SignTap Cloud Identity', sub: 'Zero-App Instant Smartphone Resolution', pct: 85 },
    { label: 'Digital Identity Ready • One Tap Away', sub: 'Welcome to SignTap NFC Platform', pct: 100 },
  ];

  const startLoader = () => {
    setVisible(true);
    setIsExiting(false);
    setProgress(0);
    setStageIndex(0);

    const totalDuration = 1250; // Snappy 1.25s animation
    const intervalTime = 16;
    const increment = 100 / (totalDuration / intervalTime);

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setStageIndex(3);
        clearInterval(timer);

        // Smooth curtain exit
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setVisible(false);
            if (onFinish) onFinish();
          }, 450);
        }, 220);
      } else {
        const nextVal = Math.floor(current);
        setProgress(nextVal);
        if (nextVal < 25) setStageIndex(0);
        else if (nextVal < 55) setStageIndex(1);
        else if (nextVal < 85) setStageIndex(2);
        else setStageIndex(3);
      }
    }, intervalTime);

    return timer;
  };

  useEffect(() => {
    setMounted(true);
    const timer = startLoader();

    const handleReplay = () => {
      startLoader();
    };
    window.addEventListener('signtap:play-loader', handleReplay);

    return () => {
      clearInterval(timer);
      window.removeEventListener('signtap:play-loader', handleReplay);
    };
  }, [forceShow, onFinish]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 200);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading SignTap NFC Platform"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#F8FAFC] text-[#0d0d0d] p-4 sm:p-6 transition-all duration-500 select-none ${
        isExiting
          ? 'opacity-0 scale-102 pointer-events-none filter blur-sm'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Light Theme Ambient Glow & Mesh Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Lavender / Purple Top-Left Glow */}
        <div className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#923cf6]/10 blur-[90px] animate-pulse" />
        
        {/* Soft Cyan Bottom-Right Glow */}
        <div className="absolute -bottom-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#06b6d4]/10 blur-[90px] animate-pulse" />
        
        {/* Dot Matrix Texture */}
        <div 
          className="absolute inset-0 opacity-40 bg-[radial-gradient(#923cf6_1px,transparent_1px)] [background-size:24px_24px]" 
        />
      </div>

      {/* Top Header Row with Status & Skip Button */}
      <div className="w-full max-w-4xl flex items-center justify-between relative z-10 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#30D158] animate-ping" />
          <span className="font-mono text-[11px] sm:text-xs text-slate-700 tracking-wider uppercase font-semibold">
            SignTap <span className="text-[#923cf6]">Contactless Loader</span>
          </span>
        </div>

        <button
          onClick={handleSkip}
          type="button"
          className="px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-mono font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          Skip Intro →
        </button>
      </div>

      {/* Center NFC Resonator Visualizer in Light Theme */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-md">
        
        {/* Concentric Expanding NFC Radio Waves */}
        <div className="relative flex items-center justify-center w-56 h-56 sm:w-72 sm:h-72">
          
          {/* Wave Ring 1 */}
          <div className="absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full border-2 border-purple-500/35 animate-nfc-wave-1 pointer-events-none" />
          
          {/* Wave Ring 2 */}
          <div className="absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full border-2 border-cyan-500/35 animate-nfc-wave-2 pointer-events-none" />
          
          {/* Wave Ring 3 */}
          <div className="absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full border-2 border-[#923cf6]/25 animate-nfc-wave-3 pointer-events-none" />

          {/* Outer Rotating Radar Ring */}
          <div className="absolute inset-3 sm:inset-4 rounded-full border border-dashed border-purple-300/40 animate-[spin_14s_linear_infinite]" />

          {/* Inner Glowing Card Pod with Official Logo */}
          <div className="relative z-20 w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/95 border border-slate-200/90 shadow-[0_12px_36px_rgba(146,60,246,0.16)] flex items-center justify-center overflow-hidden group">
            
            {/* Laser Scanline Beam moving vertically */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#923cf6] to-transparent shadow-[0_0_12px_#923cf6] animate-laser-scan z-30 pointer-events-none" />

            {/* Official SignTap Logo with dynamic breathing animation */}
            <div className="relative z-20 w-14 h-14 sm:w-18 sm:h-18 flex items-center justify-center animate-pulse" style={{ animationDuration: '2s' }}>
              <Image
                src="/images/signtap-logo.png"
                alt="SignTap Official Logo"
                width={64}
                height={54}
                priority
                className="object-contain drop-shadow-[0_2px_12px_rgba(146,60,246,0.35)]"
              />
            </div>

            {/* Contactless Corner Icon */}
            <div className="absolute top-2 right-2 text-[#923cf6]">
              <Wifi className="w-3.5 h-3.5 rotate-45 animate-pulse" />
            </div>
          </div>

        </div>

        {/* Dynamic Telemetry Status in Light Theme */}
        <div className="mt-3 text-center max-w-sm px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200 shadow-2xs mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#923cf6] animate-pulse" />
            <span className="font-mono text-xs text-purple-900 tracking-wider font-semibold">
              {stages[stageIndex]?.label || stages[0].label}
            </span>
          </div>

          <p className="font-mono text-[11px] text-slate-500 tracking-wide">
            {stages[stageIndex]?.sub || stages[0].sub}
          </p>
        </div>

      </div>

      {/* Bottom Loading Progress Bar & Percentage in Light Theme */}
      <div className="w-full max-w-md relative z-10 pb-2 sm:pb-4 px-2">
        
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-slate-600 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            NFC Hardware Handshake
          </span>
          <span className="text-[#923cf6] font-bold tracking-widest text-sm font-mono">
            {progress.toString().padStart(2, '0')}%
          </span>
        </div>

        {/* Outer Track */}
        <div className="relative w-full h-2 rounded-full bg-slate-200/90 overflow-hidden border border-slate-300/50 shadow-inner">
          {/* Animated Glowing Fill */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#923cf6] via-[#06b6d4] to-[#30D158] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(146,60,246,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2">
          <span>SECURE CRYPTO CHIP</span>
          <span>NXP NTAG216 • 13.56 MHz</span>
        </div>

      </div>

    </div>
  );
}
