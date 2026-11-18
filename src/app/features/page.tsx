'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Wifi, 
  QrCode, 
  UserCheck, 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Globe, 
  Smartphone, 
  CreditCard 
} from 'lucide-react';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: Wifi,
      title: 'NFC Smart Card Integration',
      tagline: 'Instant Physical-to-Digital Bridge',
      description: 'Connect your physical SignTap NFC Smart Card with an encrypted microchip. A single tap on an iPhone or Android phone opens your live profile instantly without any apps or reader downloads.',
      highlights: ['NTAG216 Chip Architecture', 'Unique Tap URL: /t/[cardId]', 'Instant remote profile re-assignment', 'Physical water & scratch resistant materials'],
    },
    {
      icon: Layers,
      title: 'Dynamic Design Templates',
      tagline: 'Personal Website Quality',
      description: 'Choose between Minimal, Signature, and Creative templates. Customize your accent colors, typography, background patterns, and button geometries in real time.',
      highlights: ['Minimal, Signature, & Creative templates', 'Live side-by-side editing preview', 'Custom color palette & font pairings', 'Mobile-first fluid typography'],
    },
    {
      icon: QrCode,
      title: 'Vector QR Code Generation',
      tagline: 'Universal Camera Fallback',
      description: 'Every profile automatically generates an ultra-crisp vector QR code for print collateral, event badges, presentation slides, or scanning from older non-NFC devices.',
      highlights: ['One-click high-res PNG export', 'Embedded SignTap logo mask', 'Native mobile OS share sheet', 'Direct URL clipboard copy'],
    },
    {
      icon: UserCheck,
      title: '1-Tap Smartphone vCard Contact Save',
      tagline: 'Never Lost in a Pile of Paper',
      description: 'Tapping your card or clicking Save Contact triggers an immediate .vcf file download that opens directly into Apple Contacts, Google Contacts, or Microsoft Outlook.',
      highlights: ['Full Name, Title, & Company', 'Phone, Email, & Location', 'Verified Social URLs in address book', 'No manual typing needed'],
    },
    {
      icon: BarChart3,
      title: 'Privacy-Preserving Analytics',
      tagline: 'Measure Your Networking ROI',
      description: 'Track how many people tap your card, scan your QR code, visit your page, and click external links over time with clean, private dashboard charts.',
      highlights: ['Total views & tap trends', 'Click-through rates by link platform', '7-day and 30-day timeline charts', 'Self-preview filtering to ensure clean metrics'],
    },
    {
      icon: ShieldCheck,
      title: 'PostgreSQL Row Level Security',
      tagline: 'Enterprise-Grade Data Ownership',
      description: 'Built with Supabase PostgreSQL and Row Level Security policies. Users can only modify their own profiles, projects, and NFC cards while public profiles remain fast and globally readable.',
      highlights: ['Strict RLS isolation', 'Username uniqueness enforcement', 'Encrypted database records', 'Safe image storage'],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1 w-full px-2.5 sm:px-4 py-4 space-y-8 sm:space-y-12">
        
        {/* Header Mesh Hero Card */}
        <section className="max-w-7xl mx-auto rounded-[20px] md:rounded-[24px] bg-[url(/originkit/hero-01/mesh-gradient.png)] bg-cover bg-center border border-slate-200/60 p-8 sm:p-14 lg:p-16 text-center shadow-xs">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-[#087CF0]" />
              <span>Platform Capabilities</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Enterprise Standard</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#010110] tracking-[-0.03em] leading-tight [text-shadow:0_3px_6px_rgba(0,0,0,0.06),0_1px_1px_rgba(255,255,255,0.7)]">
              Engineered to replace paper cards forever.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#45545e] max-w-2xl mx-auto leading-relaxed font-medium">
              Explore the technical capabilities, security features, and craftsmanship powering SignBridge NFC digital identity.
            </p>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="max-w-7xl mx-auto rounded-[20px] md:rounded-[24px] bg-white border border-slate-200/70 p-6 sm:p-10 lg:p-14 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-[20px] border border-slate-200/80 bg-[#FAFAFB] p-6 sm:p-7 shadow-xs hover:border-[#087CF0]/40 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-[#087CF0] mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF7900] font-mono">
                      {item.tagline}
                    </span>
                    <h3 className="text-lg font-bold text-[#101828] mt-1">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200/60 space-y-1.5">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
