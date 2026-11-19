'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Wifi, 
  Check, 
  CreditCard, 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  ExternalLink,
  ShieldCheck,
  Building2,
  User,
  Phone,
  Briefcase
} from 'lucide-react';
import { Product } from '@/lib/types';

interface SignBridgeCardProps {
  product: Product;
  productNumber?: string; // e.g. "01" or "02"
  onBuy: (product: Product) => void;
}

export default function SignBridgeCard({
  product,
  productNumber = '01',
  onBuy,
}: SignBridgeCardProps) {
  const isBusiness = product.category === 'business';

  return (
    <article className="text-left bg-white border border-black/10 rounded-[20px] flex flex-col overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:border-black/20 hover:-translate-y-1 hover:shadow-[0_16px_36px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group">
      
      {/* 1. Top Meta Bar */}
      <div className="bg-[#fbf9f6] border-b border-black/5 px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold tracking-widest text-slate-700 uppercase">
          PRODUCT // {productNumber}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-2xs">
          <span className={`w-1.5 h-1.5 rounded-full ${isBusiness ? 'bg-[#923cf6]' : 'bg-[#087CF0]'}`} />
          NFC Digital Identity
        </span>
      </div>

      {/* 2. Visual Card Representation matching signbridge.click */}
      <div className="bg-gradient-to-b from-white to-[#fbf9f6] border-b border-black/5 p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]">
        {/* Subtle Ambient Glow */}
        <div 
          className={`absolute inset-0 opacity-10 pointer-events-none ${
            isBusiness ? 'bg-purple-600 blur-2xl' : 'bg-blue-600 blur-2xl'
          }`} 
        />

        {/* Physical Smart Card Mockup */}
        <div className={`w-full max-w-[290px] aspect-[1.586/1] rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative shadow-xl transition-all duration-500 group-hover:scale-[1.02] border ${
          isBusiness
            ? 'bg-gradient-to-br from-[#1c1917] via-[#0c0a09] to-[#1c1917] text-white border-amber-500/30 shadow-black/30'
            : 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white border-cyan-500/30 shadow-black/25'
        }`}>
          {/* Card Top Row: Chip + Contactless Signal */}
          <div className="flex items-center justify-between">
            {/* Embedded Golden Microchip */}
            <div className="w-10 h-7.5 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-500/60 shadow-inner flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-[1px] bg-amber-800/40 absolute top-1/3" />
              <div className="w-full h-[1px] bg-amber-800/40 absolute bottom-1/3" />
              <div className="h-full w-[1px] bg-amber-800/40 absolute left-1/3" />
              <div className="h-full w-[1px] bg-amber-800/40 absolute right-1/3" />
            </div>

            {/* NFC Waves Signal */}
            <div className="flex items-center gap-1 opacity-90">
              <Wifi className={`w-5 h-5 ${isBusiness ? 'text-amber-400' : 'text-cyan-400'} rotate-90`} />
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-300">NTAG216</span>
            </div>
          </div>

          {/* Card Middle: Brand Emblem */}
          <div className="my-1">
            <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase block">
              SIGNBRIDGE · SIGNTAP
            </span>
            <div className="font-urbanist font-extrabold text-sm tracking-wide text-white flex items-center gap-1.5 mt-0.5">
              <span>{product.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isBusiness ? 'bg-amber-400/20 text-amber-300' : 'bg-cyan-400/20 text-cyan-300'
              }`}>
                {isBusiness ? 'BUSINESS' : 'PERSONAL'}
              </span>
            </div>
          </div>

          {/* Card Bottom: Cardholder Laser Engraving & Mode */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-300 tracking-wider uppercase font-semibold">
              SURYA NARAYANAN
            </span>
            <span className={`font-bold ${isBusiness ? 'text-amber-300' : 'text-cyan-300'}`}>
              {isBusiness ? 'DUAL-MODE' : '1-TAP vCARD'}
            </span>
          </div>
        </div>

        {/* Feature Pill Underneath */}
        <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 font-mono">
          <Sparkles className="w-3 h-3 text-[#923cf6]" />
          <span>{isBusiness ? 'WhatsApp Chat · Catalog · Lead Capture' : '1-Tap vCard · Portfolio · Social Hub'}</span>
        </div>
      </div>

      {/* 3. Card Body */}
      <div className="bg-white p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category Tag */}
          <span className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
            {isBusiness ? 'DIGITAL IDENTITY SOLUTIONS | BUSINESS EDITION' : 'DIGITAL IDENTITY SOLUTIONS | PERSONAL EDITION'}
          </span>

          {/* Title */}
          <h3 className="font-urbanist text-2xl font-black text-[#0d0d0d] tracking-tight mt-1 group-hover:text-[#923cf6] transition-colors">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="font-mono text-xs font-bold text-slate-700 mt-1">
            {isBusiness ? 'Scale your corporate & sales networking.' : 'One tap. Every connection.'}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5">
            {product.short_description}
          </p>

          {/* Highlighted Features Bullet List */}
          <ul className="mt-4 space-y-2.5 pt-3 border-t border-slate-100" aria-label={`${product.name} features`}>
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Block */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="font-urbanist text-3xl sm:text-4xl font-extrabold text-[#0d0d0d]">
              ₹{product.price}
            </span>
            <span className="text-sm font-bold text-slate-400 line-through">
              ₹999
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              SPECIAL ₹199 (80% OFF)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            All-inclusive · Free Courier Delivery Across India
          </p>
        </div>
      </div>

      {/* 4. Action Buttons Bar matching signbridge.click */}
      <div className="bg-[#fbf9f6] border-t border-black/5 p-4 sm:p-5 flex items-center gap-3">
        {/* Primary Buy Now Button */}
        <button
          type="button"
          onClick={() => onBuy(product)}
          className="flex-1 py-3 px-5 rounded-full bg-[#0d0d0d] hover:bg-[#1e3a8a] text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-md shadow-black/15 flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Buy Card — ₹{product.price}</span>
        </button>

        {/* Secondary Specs / Customizer Link */}
        <Link
          href={`/order?product=${product.id}`}
          className="py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs"
          title="Customize card engraving"
        >
          <span>Specs</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
        </Link>
      </div>

    </article>
  );
}

