'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import NFCCardVisual from '@/components/NFCCardVisual';
import RazorpayBuyModal from '@/components/RazorpayBuyModal';
import { getCurrentUser, getProfileByUserId, getOrdersByUserId, getAllProducts } from '@/lib/store';
import { Product, Order, Profile, UserSession } from '@/lib/types';
import { 
  CreditCard, 
  Wifi, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Truck, 
  Smartphone, 
  Crown, 
  ArrowRight, 
  RotateCcw, 
  Package, 
  Clock,
  Layers,
  Zap,
  Award
} from 'lucide-react';

export default function CardsMarketplacePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Card Engraving Studio State
  const [engravedName, setEngravedName] = useState('Surya Narayanan');
  const [engravedTitle, setEngravedTitle] = useState('Founder & Hardware Architect');
  const [cardTheme, setCardTheme] = useState<'black' | 'silver' | 'blue'>('black');

  // Checkout modal
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<'business' | 'personal'>('business');

  const syncData = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const p = getProfileByUserId(currentUser.id);
      setProfile(p);
      if (p) {
        setEngravedName(p.full_name || 'SignTap Member');
        setEngravedTitle(p.headline || p.title || 'Professional Pioneer');
      }
      const myOrders = getOrdersByUserId(currentUser.id);
      setOrders(myOrders);
    }
  };

  useEffect(() => {
    syncData();
  }, []);

  const openCheckout = (type: 'business' | 'personal') => {
    setSelectedCardType(type);
    setBuyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-slate-800">
      <LinkedInNavbar />

      <main className="max-w-6xl mx-auto px-3 sm:px-6 pt-20 pb-20 md:pb-12 space-y-8">
        
        {/* ================================================================= */}
        {/* HERO BANNER: The Contactless Hardware Standard */}
        {/* ================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-2xl space-y-3 z-10 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0A66C2] text-xs font-semibold border border-blue-200">
              <Wifi className="w-3.5 h-3.5" />
              <span>SignTap Physical Hardware · India Delivery</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              One Tap to Share Your Professional Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Replace stacks of disposable paper business cards with laser-engraved matte smart cards. Embedded with high-frequency NTAG216 microchips that instantly open your LinkedIn-style SignTap profile on any iPhone or Android phone.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                No app required for tap
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                Lifetime NFC chip warranty
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                Free courier shipping across India
              </span>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* INTERACTIVE 3D/2D CARD ENGRAVING STUDIO */}
        {/* ================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Live Card Engraving Studio
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Customize your laser-engraved name, corporate affiliation and finish in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Interactive Preview Canvas */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-[#F8FAFD] rounded-2xl border border-slate-200/80">
              <NFCCardVisual
                fullName={engravedName}
                title={engravedTitle}
                username={profile?.username || 'member'}
                cardName="SignTap Smart Identity"
                theme={cardTheme}
                interactive={true}
              />
              <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Click card to test contactless tap animation</span>
              </p>
            </div>

            {/* Customization Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cardholder Name (Laser Engraved)
                </label>
                <input
                  type="text"
                  value={engravedName}
                  onChange={(e) => setEngravedName(e.target.value)}
                  placeholder="e.g. SURYA NARAYANAN"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0A66C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline / Company Affiliation
                </label>
                <input
                  type="text"
                  value={engravedTitle}
                  onChange={(e) => setEngravedTitle(e.target.value)}
                  placeholder="e.g. FOUNDER & HARDWARE ARCHITECT"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0A66C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Card Finish
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCardTheme('black')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      cardTheme === 'black'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    Jet Black
                  </button>
                  <button
                    onClick={() => setCardTheme('silver')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      cardTheme === 'silver'
                        ? 'border-slate-400 bg-slate-200 text-slate-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    Brushed Silver
                  </button>
                  <button
                    onClick={() => setCardTheme('blue')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      cardTheme === 'blue'
                        ? 'border-[#0A66C2] bg-[#0A66C2] text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    SignTap Blue
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openCheckout('business')}
                  className="w-full py-3 px-6 rounded-full bg-[#0A66C2] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Order Custom Engraved Card · ₹199</span>
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  Razorpay Secure Checkout · UPI, Cards & NetBanking
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ================================================================= */}
        {/* CARD PACKAGES & PRICING GRID */}
        {/* ================================================================= */}
        <section className="space-y-4">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              SignTap NFC Hardware Editions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose the perfect physical card edition engineered for your career or business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            
            {/* Card 1: Business NFC Card */}
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-6 shadow-xs flex flex-col justify-between transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#0A66C2]">
                    Most Popular
                  </span>
                  <span className="text-xs text-slate-400 line-through">₹999</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mt-3">Business NFC Card</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Designed for founders, consultants, sales teams, and corporate executives.
                </p>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-slate-900">₹199</span>
                  <span className="text-xs text-slate-400 ml-1">/ one-time</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instant WhatsApp 1-click business chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Showcase company catalog & services</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Laser-engraved cardholder name</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dynamic backup QR code on back</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Free courier shipping across India</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openCheckout('business')}
                className="mt-6 w-full py-2.5 rounded-full bg-[#0A66C2] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Order Business Card
              </button>
            </div>

            {/* Card 2: Personal NFC Card */}
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-6 shadow-xs flex flex-col justify-between transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    Individual Choice
                  </span>
                  <span className="text-xs text-slate-400 line-through">₹799</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mt-3">Personal NFC Card</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Sleek, minimalist smart card for engineers, designers, creators, and students.
                </p>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-slate-900">₹199</span>
                  <span className="text-xs text-slate-400 ml-1">/ one-time</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>One-tap instant digital profile sharing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Direct phonebook vCard contact save</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Portfolio, project gallery & resume link</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Consolidated social media hub</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Unlimited real-time profile updates</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openCheckout('personal')}
                className="mt-6 w-full py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Order Personal Card
              </button>
            </div>

            {/* Card 3: SignTap Pro Membership */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-2xl border border-amber-300 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/50 rounded-full blur-2xl" />
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3 fill-white" />
                    <span>PRO PLAN</span>
                  </span>
                  <span className="text-xs text-amber-700 font-bold">ANNUAL PASS</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mt-3">SignTap Pro Annual</h3>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  Premium networking suite with Golden Crown badge & verified Pro status.
                </p>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-amber-950">₹1,000</span>
                  <span className="text-xs text-amber-800 ml-1">/ year</span>
                </div>
                <ul className="space-y-2 text-xs text-amber-900 border-t border-amber-200/60 pt-4">
                  <li className="flex items-center gap-2 font-medium">
                    <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-400 shrink-0" />
                    <span>Verified Golden Crown badge on public profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Complimentary laser-engraved NFC smart card</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Priority ranking in professional search discovery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Real-time tap analytics & location insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Priority 24/7 dedicated hardware support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openCheckout('business')}
                className="mt-6 w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Join Pro · ₹1,000/yr
              </button>
            </div>

          </div>
        </section>

        {/* ================================================================= */}
        {/* MY ORDERS TRACKER */}
        {/* ================================================================= */}
        {orders.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#0A66C2]" />
              <span>My SignTap Card Orders ({orders.length})</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        Order #{order.order_number}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0A66C2] border border-blue-200">
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {order.items?.map(i => i.product_name).join(', ') || 'SignTap Smart Card'} • Total: ₹{order.total_amount}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Deliver to: {order.shipping_address?.street}, {order.shipping_address?.city} ({order.shipping_address?.postalCode})
                    </p>
                  </div>

                  <span className="text-xs text-slate-400 self-end sm:self-center">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Razorpay Standard Payment Modal */}
      <RazorpayBuyModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        initialCardType={selectedCardType}
        onOrderSuccess={(orderId) => {
          syncData();
        }}
      />
    </div>
  );
}

