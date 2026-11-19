'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignBridgeCard from '@/components/SignBridgeCard';
import RazorpayBuyModal from '@/components/RazorpayBuyModal';
import { getAllProducts } from '@/lib/store';
import { Product } from '@/lib/types';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedBuyCardType, setSelectedBuyCardType] = useState<'business' | 'personal'>('business');

  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  const handleOpenBuy = (product: Product) => {
    setSelectedBuyCardType(product.category === 'business' ? 'business' : 'personal');
    setIsBuyModalOpen(true);
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
    </div>
  );
}
