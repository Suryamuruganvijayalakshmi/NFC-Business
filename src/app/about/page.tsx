'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { Sparkles, Wifi, ShieldCheck, Heart, Leaf, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="pt-16 pb-20 bg-gradient-to-b from-white to-[#FAFAFB] border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087CF0]/10 text-[#087CF0] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Our Mission & Vision
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
              Connecting Ideas, Empowering Innovation.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              SignBridge was founded with a singular conviction: the physical act of exchanging a business card shouldn't belong to the 19th century.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                The Problem with Traditional Business Cards
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
                Over 27 million paper business cards are printed every day around the globe. Yet 88% of them are thrown away within one week. Phone numbers change, job titles advance, and portfolios evolve—yet a printed card remains frozen in time.
              </p>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
                Worse, anyone receiving a paper card has to manually type your email and phone into their contacts, causing valuable leads and connections to slip away.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-[#101828] text-white border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 text-[#FF7900] text-xs font-bold uppercase tracking-wider mb-2">
                <Wifi className="w-4 h-4" /> The SignBridge Innovation
              </div>
              <h2 className="text-2xl font-bold text-white">
                Physical Hardware Meets Dynamic Cloud Identity
              </h2>
              <p className="mt-3 text-slate-300 leading-relaxed text-sm sm:text-base">
                SignBridge ID pairs an elegant, durable physical smart card (equipped with an encrypted high-frequency NFC chip) with your personal web identity at <b className="text-white">signbridge.click</b>.
              </p>
              <p className="mt-3 text-slate-300 leading-relaxed text-sm sm:text-base">
                When you tap your card against someone's phone, it instantly opens your live digital page. They can view your work, follow your social channels, or click &ldquo;Save Contact&rdquo; to add your complete vCard directly to their phonebook with one tap.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-white border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Eco-Friendly</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  One durable smart card replaces thousands of paper cards, saving trees and eliminating printer reorders forever.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-[#087CF0]/10 text-[#087CF0] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Privacy & Trust</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Row Level Security guarantees you own your data. We never sell contact information or track invasive visitor metrics.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Always In Sync</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Update your title, resume, or projects anytime. Anyone holding your card or link immediately sees your newest work.
                </p>
              </div>

            </div>

            {/* Brand Quote */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#087CF0]/10 via-[#FF7900]/10 to-transparent border border-slate-200 text-center">
              <Logo theme="light" size="sm" className="justify-center mb-3" />
              <blockquote className="text-lg font-medium text-slate-800 italic">
                &ldquo;Your Identity. One Tap Away.&rdquo;
              </blockquote>
              <p className="text-xs text-slate-500 mt-2">
                SignBridge ID · Official Platform at signbridge.click
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
