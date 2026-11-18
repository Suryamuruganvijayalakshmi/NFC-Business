import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  animated?: boolean;
}

export default function Logo({ 
  className = '', 
  variant = 'full', 
  theme = 'light',
  size = 'md',
  showBadge = true,
  animated = true,
}: LogoProps) {
  const isDark = theme === 'dark';

  const sizeConfig = {
    xs: { iconWidth: 26, iconHeight: 22, text: 'text-base', sub: 'text-[8px]', badge: 'text-[8px] px-1 py-0.2' },
    sm: { iconWidth: 34, iconHeight: 29, text: 'text-lg sm:text-xl', sub: 'text-[9px]', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { iconWidth: 42, iconHeight: 36, text: 'text-xl sm:text-2xl', sub: 'text-[10px]', badge: 'text-[10px] px-2 py-0.5' },
    lg: { iconWidth: 54, iconHeight: 46, text: 'text-2xl sm:text-3xl', sub: 'text-xs', badge: 'text-xs px-2.5 py-1' },
    xl: { iconWidth: 72, iconHeight: 61, text: 'text-3xl sm:text-4xl', sub: 'text-sm', badge: 'text-sm px-3 py-1' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none group ${className}`}>
      {/* Official SignTap Futuristic Gradient NFC S Logo Icon with Continuous Animation */}
      <div className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
        animated ? 'hover:rotate-1' : ''
      }`}>
        
        {/* Animated Contactless Backglow Aura */}
        {animated && (
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#923cf6]/30 via-[#06b6d4]/20 to-[#FF7900]/20 blur-md pointer-events-none animate-pulse" 
            style={{ animationDuration: '3s' }}
          />
        )}

        <Image
          src="/images/signtap-logo.png"
          alt="SignTap Logo"
          width={sizeConfig.iconWidth}
          height={sizeConfig.iconHeight}
          priority
          className="relative z-10 object-contain drop-shadow-[0_2px_10px_rgba(146,60,246,0.35)] transition-all group-hover:drop-shadow-[0_0_16px_rgba(146,60,246,0.6)]"
        />

        {/* Animated Micro NFC Signal Waves */}
        {animated && (
          <span 
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 opacity-75 animate-ping pointer-events-none" 
            style={{ animationDuration: '2.5s' }}
          />
        )}
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-urbanist font-extrabold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-[#0d0d0d]'
            } ${sizeConfig.text}`}>
              Sign<span className="text-[#923cf6] group-hover:text-[#a855f7] transition-colors">Tap</span>
            </span>
            {showBadge && (
              <span className={`rounded-full font-bold uppercase tracking-wider font-mono border transition-all ${
                isDark 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400/30 group-hover:border-purple-400/60' 
                  : 'bg-purple-50 text-[#923cf6] border-purple-200 group-hover:bg-purple-100'
              } ${sizeConfig.badge}`}>
                NFC
              </span>
            )}
          </div>
          <span className={`font-medium tracking-wider uppercase mt-1 opacity-70 transition-opacity group-hover:opacity-100 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          } ${sizeConfig.sub}`}>
            Digital Identity
          </span>
        </div>
      )}
    </div>
  );
}
