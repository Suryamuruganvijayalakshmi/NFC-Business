'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Sparkles, ArrowRight, Wifi, ShieldCheck, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free Digital',
      price: '$0',
      period: 'forever',
      badge: 'Starter',
      description: 'Ideal for testing out your personalized digital identity without hardware.',
      features: [
        'Personalized URL (signbridge.click/id/username)',
        '3 Design Templates (Minimal, Signature, Creative)',
        'Up to 3 Portfolio projects',
        'Unlimited social & external links',
        'Dynamic QR Code generator & download',
        '1-Tap vCard phonebook download',
        'Basic profile view analytics',
      ],
      cta: 'Create Free Profile',
      href: '/signup',
      highlighted: false,
    },
    {
      name: 'Pro + NFC Smart Card',
      price: '$29',
      period: 'one-time card',
      badge: 'Most Popular',
      description: 'Our flagship bundle. Includes a physical SignBridge NFC Smart Card delivered to your door with unlimited digital profile updates.',
      features: [
        'Everything in Free Digital',
        '1x Physical SignBridge NFC Smart Card',
        'Matte Black or Brushed Steel finish',
        'NTAG216 high-durability encrypted microchip',
        'Direct physical tap redirect (signbridge.click/t/cardId)',
        'Re-program card anytime without replacing hardware',
        'Full Portfolio builder (Unlimited projects)',
        'Detailed Analytics (Views, NFC taps, QR scans, Link clicks)',
        'Priority email & WhatsApp hardware support',
      ],
      cta: 'Get Smart Card Bundle',
      href: '/signup',
      highlighted: true,
    },
    {
      name: 'Team & Enterprise',
      price: '$19',
      period: 'per card (min 5)',
      badge: 'Corporate',
      description: 'Equip your entire sales team, agency staff, or company executives with branded NFC credentials.',
      features: [
        'Everything in Pro bundle',
        'Custom company logo & artwork printing',
        'Bulk NFC Card management in Admin dashboard',
        'Centralized company directory routing',
        'Dedicated account manager',
        'Replacement warranty & volume discounts',
      ],
      cta: 'Inquire for Enterprise',
      href: '/contact',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: 'Does the other person need an app or SignBridge card to see my profile?',
      a: 'No! When someone taps your SignBridge NFC card or scans your QR code, your profile immediately opens in their phone\'s default web browser (Safari, Chrome, etc.). No app installation is needed.',
    },
    {
      q: 'Which smartphones work with SignBridge NFC Smart Cards?',
      a: 'All iPhones (iPhone XS and newer have native background NFC reading) and virtually all modern Android smartphones with NFC enabled can read your card by simply tapping the top back of the phone.',
    },
    {
      q: 'Can I update my info after the card is printed?',
      a: 'Yes, 100%! The card points to your dynamic cloud URL (signbridge.click/t/cardId). You can edit your phone number, portfolio, bio, or links anytime in your dashboard and the card reflects changes instantly.',
    },
    {
      q: 'Is there a recurring monthly subscription for the NFC card?',
      a: 'No recurring fees for basic card usage. You buy the physical card once and host your dynamic identity for free.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="pt-16 pb-16 bg-gradient-to-b from-white to-[#FAFAFB] border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087CF0]/10 text-[#087CF0] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Transparent Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
              One card. Lifetime connections.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              No hidden fees. Create your free digital profile now or upgrade to physical NFC Smart Card hardware.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((p, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  p.highlighted
                    ? 'bg-[#101828] text-white border-2 border-[#087CF0] shadow-2xl relative'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {p.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF7900] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    {p.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-bold ${p.highlighted ? 'text-white' : 'text-slate-900'}`}>
                      {p.name}
                    </h3>
                    {!p.highlighted && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs mt-2 leading-relaxed ${p.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>
                    {p.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                      {p.price}
                    </span>
                    <span className={`text-xs ${p.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                      /{p.period}
                    </span>
                  </div>

                  <div className={`mt-8 pt-6 border-t ${p.highlighted ? 'border-white/10' : 'border-slate-100'} space-y-3`}>
                    {p.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.highlighted ? 'text-[#087CF0]' : 'text-emerald-500'}`} />
                        <span className={p.highlighted ? 'text-slate-200' : 'text-slate-700'}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={p.href}
                    className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      p.highlighted
                        ? 'bg-[#087CF0] text-white hover:bg-[#0668cc] shadow-md shadow-blue-500/30'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{p.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className="mt-24 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Everything you need to know about SignBridge NFC Smart Cards and digital identity.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-[#087CF0] flex-shrink-0 mt-1" />
                    {faq.q}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
