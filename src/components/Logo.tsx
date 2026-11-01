import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ 
  className = '', 
  variant = 'full', 
  theme = 'dark',
  size = 'md' 
}: LogoProps) {
  const isDark = theme === 'dark'; // Dark theme means dark background (so white/light text)

  const sizeDimensions = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 34, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 44, text: 'text-2xl', sub: 'text-xs' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official SignBridge Hex-Bridge Signal Icon */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#101828] to-[#1A253A] border border-white/10 shadow-sm transition-transform hover:scale-105 duration-300"
        style={{ width: sizeDimensions.icon, height: sizeDimensions.icon }}
      >
        <svg 
          viewBox="0 0 36 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* NFC contactless wave - SignBridge Blue */}
          <path 
            d="M8 18C8 12.4772 12.4772 8 18 8" 
            stroke="#087CF0" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
          />
          {/* Outer Wave - SignBridge Orange */}
          <path 
            d="M5 18C5 10.8203 10.8203 5 18 5" 
            stroke="#FF7900" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            strokeDasharray="1 5"
          />
          {/* Bridge Arch Connection */}
          <path 
            d="M10 27C12.5 21 23.5 21 26 27" 
            stroke="#087CF0" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
          />
          {/* Dynamic Chip Core - Orange */}
          <circle cx="18" cy="18" r="3.2" fill="#FF7900" />
          <path 
            d="M18 18L26 12" 
            stroke="#087CF0" 
            strokeWidth="2.4" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#101828]'} ${sizeDimensions.text}`}>
              Sign<span className="text-[#087CF0]">Bridge</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#FF7900]/10 text-[#FF7900] text-[10px] font-bold tracking-wider uppercase border border-[#FF7900]/20">
              ID
            </span>
          </div>
          <span className={`font-medium tracking-wider uppercase mt-0.5 opacity-60 ${isDark ? 'text-slate-300' : 'text-slate-500'} ${sizeDimensions.sub}`}>
            signbridge.click
          </span>
        </div>
      )}
    </div>
  );
}
