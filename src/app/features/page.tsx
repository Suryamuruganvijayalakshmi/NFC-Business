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
  FileText,
  Lock,
  Zap,
  CreditCard
} from 'lucide-react';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: Wifi,
      title: 'NFC Smart Card Integration',
      tagline: 'Instant Physical-to-Digital Bridge',
      description: 'Connect your physical SignBridge NFC Smart Card with an encrypted microchip. A single tap on an iPhone or Android phone opens your live profile instantly without any apps or reader downloads.',
      highlights: ['NTAG213 / NTAG216 Chip Architecture', 'Unique Tap URL: signbridge.click/t/cardId', 'Instant remote profile re-assignment', 'Physical water & bend resistant materials'],
    },
    {
      icon: Layers,
      title: '3 Dynamic Design Templates',
      tagline: 'Personal Website Quality',
      description: 'Choose between Minimal, Signature, and Creative templates. Customize your accent colors, typography, background patterns, and button geometries in real time.',
      highlights: ['Minimal, Signature, & Creative templates', 'Live side-by-side editing preview', 'Custom color palette & font pairings', 'Mobile-first fluid typography'],
    },
    {
      icon: QrCode,
      title: 'Vector QR Code Generation',
      tagline: 'Universal Camera Fallback',
      description: 'Every profile automatically generates an ultra-crisp vector QR code for print collateral, event badges, presentation slides, or scanning from older non-NFC devices.',
      highlights: ['One-click high-res PNG export', 'Embedded SignBridge logo mask', 'Native mobile OS share sheet', 'Direct URL clipboard copy'],
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

      <main className="flex-1">
        {/* Header */}
        <section className="pt-16 pb-20 bg-gradient-to-b from-white to-[#FAFAFB] border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087CF0]/10 text-[#087CF0] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Architecture
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
              Engineered to replace paper business cards forever.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore the technical capabilities and design craftsmanship powering SignBridge ID profiles and NFC hardware.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs hover:border-[#087CF0]/50 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#087CF0]/10 text-[#087CF0] flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7900]">
                      {item.tagline}
                    </span>

                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
                      {item.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 rounded-3xl bg-[#101828] text-white p-8 sm:p-12 text-center border border-white/10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Ready to create your personalized identity?
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              Get your unique public profile URL and connect your SignBridge NFC card today.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl bg-[#087CF0] text-white text-sm font-semibold hover:bg-[#0668cc] transition-colors flex items-center gap-2 shadow-sm"
              >
                Create Free Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
