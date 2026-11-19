'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Wifi, Sparkles, ArrowRight } from 'lucide-react';
import Signature from '@/components/originkit/ui/signature';

interface SignTapLoaderProps {
  forceShow?: boolean;
  onFinish?: () => void;
}

export default function SignTapLoader({ forceShow = false, onFinish }: SignTapLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [signatureKey, setSignatureKey] = useState(0);
  const hasFinishedRef = useRef(false);

  const startLoader = () => {
    setVisible(true);
    setIsExiting(false);
    setProgress(0);
    hasFinishedRef.current = false;
    setSignatureKey((k) => k + 1);

    // Duration of signature write animation is 2.3 seconds
    const totalDuration = 2400;
    const intervalTime = 20;
    const step = 100 / (totalDuration / intervalTime);

    let curr = 0;
    const interval = setInterval(() => {
      curr += step;
      if (curr >= 100) {
        curr = 100;
        setProgress(100);
        clearInterval(interval);

        // Allow user to admire finished signature for 450ms, then smoothly dissolve
        setTimeout(() => {
          if (!hasFinishedRef.current) {
            hasFinishedRef.current = true;
            setIsExiting(true);
            setTimeout(() => {
              setVisible(false);
              if (onFinish) onFinish();
            }, 600);
          }
        }, 450);
      } else {
        setProgress(Math.floor(curr));
      }
    }, intervalTime);

    return interval;
  };

  useEffect(() => {
    setMounted(true);
    const interval = startLoader();

    const handleReplay = () => {
      startLoader();
    };
    window.addEventListener('signtap:play-loader', handleReplay);

    return () => {
      clearInterval(interval);
      window.removeEventListener('signtap:play-loader', handleReplay);
    };
  }, [forceShow, onFinish]);

  const handleSkip = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 300);
  };

  const handleSignatureReplay = () => {
    setSignatureKey((k) => k + 1);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading SignTap Signature Experience"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#080B11] text-white p-4 sm:p-8 transition-all duration-700 select-none overflow-hidden ${
        isExiting
          ? 'opacity-0 scale-102 pointer-events-none filter blur-md'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Dark Ambient Radial Glows like Originkit Preview */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Violet Center Ambient Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[480px] rounded-full bg-[#923cf6]/14 blur-[120px]" />
        
        {/* Electric Cyan Accent Ambient Glow */}
        <div className="absolute -top-24 right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#06b6d4]/10 blur-[100px]" />

        {/* Subtle Geometric Dot Mesh */}
        <div 
          className="absolute inset-0 opacity-[0.14] bg-[radial-gradient(#923cf6_1px,transparent_1px)] [background-size:28px_28px]" 
        />
      </div>

      {/* Top Header Row with Verified Status & Skip Button */}
      <div className="w-full max-w-4xl flex items-center justify-between relative z-20 pt-2">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#30D158] animate-ping" />
          <span className="font-mono text-[11px] sm:text-xs text-slate-300 tracking-wider uppercase font-semibold">
            SignTap <span className="text-[#923cf6]">Contactless Signature</span>
          </span>
        </div>

        <button
          onClick={handleSkip}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-white bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3 h-3 text-[#923cf6]" />
        </button>
      </div>

      {/* Centerpiece: Originkit Signature signing "SignTap" */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto w-full max-w-2xl px-4">
        
        {/* Subtle Brand Pill with Official Logo */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md mb-4 shadow-sm">
          <div className="w-6 h-6 relative flex items-center justify-center">
            <Image
              src="/images/signtap-logo.png"
              alt="SignTap Logo"
              width={26}
              height={22}
              priority
              className="object-contain"
            />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-medium">
            Contactless Smart Identity
          </span>
          <Wifi className="w-3.5 h-3.5 text-[#923cf6] rotate-45" />
        </div>

        {/* Centered Originkit Signature Box on Dark Background */}
        <div 
          onClick={handleSignatureReplay}
          title="Click to sign again"
          className="w-full max-w-xl h-44 sm:h-56 md:h-64 flex items-center justify-center relative cursor-pointer group"
        >
          {/* Subtle Ambient Laser Flare beneath Signature */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#923cf6]/10 to-transparent blur-xl pointer-events-none" />

          {/* The Originkit Signature Component */}
          <Signature
            key={signatureKey}
            text="SignTap"
            ink="#FFFFFF"
            size={124}
            duration={2.2}
            outline={true}
            inset={16}
            background="transparent"
          />
        </div>

        {/* Telemetry Status Line */}
        <div className="mt-2 text-center">
          <p className="font-mono text-xs sm:text-sm text-slate-400 tracking-wider flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#06b6d4] animate-pulse" />
            <span>Click signature to re-sign</span>
            <span className="text-slate-600">•</span>
            <span className="text-purple-300 font-medium">NTAG216 Ready</span>
          </p>
        </div>

      </div>

      {/* Bottom Progress Bar & Technical Telemetry */}
      <div className="w-full max-w-md relative z-20 pb-2 sm:pb-4 px-2">
        
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Writing Contactless Identity
          </span>
          <span className="text-[#a855f7] font-bold tracking-widest text-sm font-mono">
            {progress.toString().padStart(2, '0')}%
          </span>
        </div>

        {/* Outer Progress Track */}
        <div className="relative w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden border border-white/10 shadow-inner">
          {/* Glowing Gradient Fill */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#923cf6] via-[#06b6d4] to-[#30D158] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(146,60,246,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
          <span>ORIGINKIT SIGNATURE</span>
          <span>13.56 MHz NFC FREQUENCY</span>
        </div>

      </div>

    </div>
  );
}
