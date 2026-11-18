'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  CreditCard, 
  UserCheck, 
  Wifi, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Cpu 
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Choose & Order Your SignTap Smart Card',
      desc: 'Browse our collection of Personal, Professional, Business, and Custom SignTap NFC cards. Select your favorite finish, enter the cardholder name you want engraved, and complete your order.',
      icon: <CreditCard className="w-6 h-6 text-[#923cf6]" />,
      details: [
        'Secure genuine NTAG216 contactless microchip embedded inside',
        'Dynamic backup QR code etched on the reverse side',
        'Water-resistant, scratch-proof, zero battery or charging required'
      ]
    },
    {
      num: '02',
      title: 'Build Your SignTap Digital Identity',
      desc: 'Log in to your SignTap private dashboard to customize your live profile. Add your professional title, bio, headshot, verified social media handles, portfolio projects, and direct contact options.',
      icon: <UserCheck className="w-6 h-6 text-[#FF7900]" />,
      details: [
        'Select between Minimal, Signature, and Creative themes',
        'Choose your accent color and verified social handles',
        'Real-time live preview while editing before publishing'
      ]
    },
    {
      num: '03',
      title: 'Receive & Activate Your SignTap Card',
      desc: 'When your physical card arrives at your doorstep, log in to your dashboard, head to "NFC Card Management", and enter the unique activation code printed on your packaging to bind your card in seconds.',
      icon: <Cpu className="w-6 h-6 text-[#087CF0]" />,
      details: [
        'Secure 1-to-1 cryptographic pairing with zero duplicate assignment',
        'Instant activation in under 10 seconds',
        'Physical card stores only your unique profile URL, never sensitive data'
      ]
    },
    {
      num: '04',
      title: 'Tap to Share Instantly',
      desc: 'In any meeting, conference, or client presentation, tap your card against the top of an iPhone or center of an Android smartphone. Your digital profile launches instantly in their browser with a 1-click vCard save button.',
      icon: <Wifi className="w-6 h-6 text-[#30D158]" />,
      details: [
        'Zero app installation or login required for visitors',
        'Direct phonebook saving with complete contact details',
        'Real-time analytics and engagement telemetries tracked in your dashboard'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1 w-full px-2.5 sm:px-4 py-4 space-y-8 sm:space-y-12">
        
        {/* Header Hero Card with Hero 02 Style */}
        <section className="max-w-7xl mx-auto rounded-3xl md:rounded-[2.5rem] border border-solid border-[#dee5ed] bg-[#f8fafc] p-8 sm:p-14 lg:p-16 text-center shadow-[0_0_0_4px_white,0_10px_25px_rgba(140,150,169,0.12)] relative overflow-hidden">
          
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-size-[186px_186px] bg-top-left opacity-90"
            style={{ backgroundImage: `url(/originkit/hero-02/dots.png)` }}
          />

          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#dee5ed] shadow-xs text-xs font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#923cf6] animate-pulse" />
              <span>Technology & Architecture</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">SignTap Ecosystem</span>
            </div>

            <h1 className="font-urbanist text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0d0d0d] tracking-[-0.03em] leading-tight">
              How SignTap Works
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#666] max-w-2xl mx-auto leading-relaxed font-medium">
              Bridging premium physical hardware with instant, dynamic cloud profiles. Here is how the complete SignTap ecosystem works from order to tap.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/explore-cards"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] px-7 py-3 text-xs sm:text-sm font-semibold text-white transition-all shadow-md active:scale-95"
              >
                <CreditCard className="w-3.5 h-3.5 mr-2" />
                <span>Get Your SignTap Card</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Steps Breakdown */}
        <section className="max-w-7xl mx-auto rounded-3xl md:rounded-[2rem] bg-white border border-[#dee5ed] p-6 sm:p-10 lg:p-14 shadow-xs">
          
          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-[#f8fafc] border border-[#dee5ed] hover:shadow-lg transition-all"
              >
                <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-300 font-mono">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mt-3">
                    {step.icon}
                  </div>
                </div>

                <div className="md:col-span-10 space-y-3">
                  <h3 className="font-urbanist text-lg sm:text-xl font-bold text-[#101828]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {step.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
