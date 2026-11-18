'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllProducts } from '@/lib/store';
import { Product } from '@/lib/types';
import { Check, Sparkles, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

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
              <span>Transparent SignTap Hardware Pricing</span>
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

        {/* Pricing Cards Grid in Rounded Container */}
        <section className="max-w-7xl mx-auto rounded-3xl md:rounded-[2rem] bg-white border border-[#dee5ed] p-6 sm:p-10 lg:p-14 shadow-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isPopular = product.category === 'professional';
              return (
                <div
                  key={product.id}
                  className={`rounded-2xl md:rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? 'bg-[#101828] text-white shadow-2xl ring-2 ring-[#923cf6] -translate-y-2'
                      : 'bg-[#f8fafc] text-[#101828] border border-[#dee5ed] hover:shadow-lg'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isPopular 
                          ? 'bg-[#923cf6] text-white' 
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {product.badge || product.category}
                      </span>
                      <span className="text-[11px] font-mono opacity-60">
                        {product.material}
                      </span>
                    </div>

                    <h3 className="font-urbanist text-lg sm:text-xl font-bold tracking-tight">
                      {product.name}
                    </h3>
                    <p className={`text-xs mt-2 leading-relaxed ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                      {product.short_description}
                    </p>

                    {/* Price */}
                    <div className="mt-5 pb-5 border-b border-slate-200/30">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold font-sans">
                          ${product.price}
                        </span>
                        <span className="text-xs uppercase font-mono opacity-60">
                          {product.currency}
                        </span>
                      </div>
                      <span className="text-[11px] opacity-70">
                        One-time purchase · Lifetime profile hosting
                      </span>
                    </div>

                    {/* Features checklist */}
                    <div className="mt-5 space-y-2 text-xs">
                      <p className="font-semibold uppercase tracking-wider text-[10px] opacity-60">
                        Included with SignTap hardware:
                      </p>
                      {product.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPopular ? 'text-[#923cf6]' : 'text-[#923cf6]'}`} />
                          <span className={isPopular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Button in Hero 02 style */}
                  <div className="mt-8 pt-4">
                    <Link
                      href={`/order?product=${product.id}`}
                      className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 ${
                        isPopular
                          ? 'bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] text-white shadow-purple-500/25'
                          : 'bg-[#101828] hover:bg-[#923cf6] text-white'
                      }`}
                    >
                      <span>Order SignTap Card</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
