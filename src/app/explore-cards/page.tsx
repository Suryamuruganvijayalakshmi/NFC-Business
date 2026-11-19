'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignBridgeCard from '@/components/SignBridgeCard';
import RazorpayBuyModal from '@/components/RazorpayBuyModal';
import { getAllProducts } from '@/lib/store';
import { Product } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';

export default function ExploreCardsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'business' | 'personal'>('all');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedBuyCardType, setSelectedBuyCardType] = useState<'business' | 'personal'>('business');

  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  const handleOpenBuy = (product: Product) => {
    setSelectedBuyCardType(product.category === 'business' ? 'business' : 'personal');
    setIsBuyModalOpen(true);
  };

  const filteredProducts = selectedFilter === 'all' 
    ? products 
    : products.filter(p => p.category === selectedFilter);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1 w-full px-2.5 sm:px-4 py-4 space-y-8 sm:space-y-12">
        
        {/* Header Hero Card */}
        <section className="max-w-7xl mx-auto rounded-3xl md:rounded-[2.5rem] border border-solid border-[#dee5ed] bg-[#f8fafc] p-8 sm:p-14 lg:p-16 text-center shadow-[0_0_0_4px_white,0_10px_25px_rgba(140,150,169,0.12)] relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-size-[186px_186px] bg-top-left opacity-90"
            style={{ backgroundImage: `url(/originkit/hero-02/dots.png)` }}
          />

          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#dee5ed] shadow-xs text-xs font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#923cf6] animate-pulse" />
              <span>SignTap Physical Hardware Catalogue</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">NTAG216 Embedded</span>
            </div>

            <h1 className="font-urbanist text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0d0d0d] tracking-[-0.03em] leading-tight">
              Explore SignTap NFC Cards
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#666] max-w-2xl mx-auto leading-relaxed font-medium">
              Precision-crafted smart cards powered by NTAG216 contactless microchips, ultra-fast contactless transmission, and instant Razorpay checkout.
            </p>

            {/* Category Filter Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Cards (2)' },
                { id: 'business', label: 'Business Edition' },
                { id: 'personal', label: 'Personal Edition' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedFilter === tab.id
                      ? 'bg-[#923cf6] text-white shadow-md'
                      : 'bg-white text-slate-700 border border-[#dee5ed] hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-6xl mx-auto rounded-3xl md:rounded-[2rem] bg-white border border-[#dee5ed] p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {filteredProducts.map((product, idx) => (
              <SignBridgeCard
                key={product.id}
                product={product}
                productNumber={product.category === 'business' ? '01' : '02'}
                onBuy={handleOpenBuy}
              />
            ))}
          </div>
        </section>

        {/* Technical Hardware Specs Card */}
        <section className="max-w-7xl mx-auto rounded-3xl md:rounded-[2rem] bg-[#101828] border border-white/10 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#923cf6]/15 blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-purple-200 border border-purple-400/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Certified NXP Semiconductors Chipset</span>
            </div>
            <h2 className="font-urbanist text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Universal SignTap NFC Tag Compatibility
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every SignTap NFC card is manufactured with genuine NXP NTAG216 microchips providing 888 bytes of memory, 50-year data retention, and 100,000 write cycles. Backed by dual-encoded high-contrast QR technology for legacy smartphone devices.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">Standard: ISO 14443-A</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">Frequency: 13.56 MHz</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">Read Distance: 0–4 cm</span>
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
