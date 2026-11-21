'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignBridgeCard from '@/components/SignBridgeCard';
import RazorpayBuyModal from '@/components/RazorpayBuyModal';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';
import { getAllProducts, getCurrentUser, getOrCreateProfileForUser, getAllProfiles } from '@/lib/store';
import { Product, Profile } from '@/lib/types';
import { Sparkles, ShieldCheck, Crown, ArrowRight, Zap, TrendingUp, Award, Check } from 'lucide-react';

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedBuyCardType, setSelectedBuyCardType] = useState<'business' | 'personal'>('business');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProducts(getAllProducts());
    const user = getCurrentUser();
    if (user) {
      setActiveProfile(getOrCreateProfileForUser(user));
    } else {
      const all = getAllProfiles();
      if (all.length > 0) setActiveProfile(all[0]);
    }
  }, []);

  const handleOpenBuy = (product: Product) => {
    setSelectedBuyCardType(product.category === 'business' ? 'business' : 'personal');
    setIsBuyModalOpen(true);
  };

  const handleOpenPremium = () => {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = '/login?redirect=/pricing';
      return;
    }
    const prof = getOrCreateProfileForUser(user);
    setActiveProfile(prof);
    setIsPremiumModalOpen(true);
  };

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
              <Sparkles className="w-3.5 h-3.5 text-[#923cf6]" />
              <span>Transparent Hardware Pricing</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Zero Monthly Subscriptions</span>
            </div>

            <h1 className="font-urbanist text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0d0d0d] tracking-[-0.03em] leading-tight">
              One Card. Lifetime Dynamic Profile.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#666] max-w-2xl mx-auto leading-relaxed font-medium">
              No hidden fees or recurring subscriptions. Every physical SignTap NFC card includes lifetime cloud profile hosting, direct vCard downloads, and unlimited updates.
            </p>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="max-w-6xl mx-auto rounded-3xl md:rounded-[2rem] bg-white border border-[#dee5ed] p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product, idx) => (
              <SignBridgeCard
                key={product.id}
                product={product}
                productNumber={idx === 0 ? '01' : '02'}
                onBuy={handleOpenBuy}
              />
            ))}
          </div>
        </section>

        {/* SignTap Professional Premium Membership (Razorpay Checkout) */}
        <section className="max-w-6xl mx-auto rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-300 p-6 sm:p-10 lg:p-12 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-400/20 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-black uppercase tracking-wider shadow-2xs">
                <Crown className="w-4 h-4 fill-amber-500 text-amber-600" />
                <span>Annual Premium Membership</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                SignTap Professional Premium
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Unlock career-changing visibility with the Golden Verified Badge, priority NFC tap routing, unlimited Smart CRM contact storage, and real-time visitor impressions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-semibold">Golden Crown Verified Profile Badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-semibold">Priority NFC Contactless Hardware Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-semibold">Unlimited Smart CRM Contacts & Follow-ups</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-semibold">Visitor Telemetry & Profile Analytics</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end justify-center p-6 sm:p-8 rounded-3xl bg-white/90 border border-amber-200/90 shadow-md backdrop-blur-md min-w-[280px]">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Annual Pass</span>
              <div className="flex items-baseline gap-1 mt-1 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">₹1,000</span>
                <span className="text-xs font-semibold text-slate-500">/ year</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">Official Razorpay standard gateway</p>

              <button
                onClick={handleOpenPremium}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4 fill-white" />
                <span>Pay ₹1,000 via Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-[10px] text-slate-400 mt-2">Instant Golden Badge Activation</span>
            </div>
          </div>
        </section>

        {/* Value Proposition Note */}
        <section className="max-w-4xl mx-auto text-center px-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-[#923cf6] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Risk-Free Guarantee</h4>
                <p className="text-xs text-slate-500">Fast pan-India dispatch with live tracking and replacement guarantee.</p>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Instant Razorpay Checkout · UPI / Cards / Netbanking
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <RazorpayBuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        initialCardType={selectedBuyCardType}
      />

      {activeProfile && (
        <PremiumUpgradeModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          profile={activeProfile}
          onSuccess={() => {
            const user = getCurrentUser();
            if (user) {
              setActiveProfile(getOrCreateProfileForUser(user));
            }
          }}
        />
      )}
    </div>
  );
}
