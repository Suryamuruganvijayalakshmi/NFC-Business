'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  HelpCircle, 
  Plus, 
  Minus, 
  Wifi, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight 
} from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true });

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'nfc', label: 'NFC & Compatibility' },
    { id: 'activation', label: 'Activation & Hardware' },
    { id: 'profile', label: 'Profile & Editing' },
    { id: 'security', label: 'Security & Privacy' },
    { id: 'orders', label: 'Orders & Shipping' },
  ];

  const faqData = [
    {
      category: 'nfc',
      q: 'Do visitors need an app or account to view my digital profile?',
      a: 'No app or account is needed! When an NFC-enabled smartphone touches your SignBridge card, your public profile opens immediately in their default browser (Safari, Chrome, etc.). Visitors can immediately view your portfolio, links, and click "Save Contact" to download your complete vCard to their phonebook.'
    },
    {
      category: 'nfc',
      q: 'Which smartphones are compatible with SignBridge NFC?',
      a: 'Virtually all modern smartphones are compatible. All iPhones from iPhone XS onwards (including iPhone 11, 12, 13, 14, 15, 16) read NFC cards natively in the background. On Android, over 95% of devices from Samsung, Google Pixel, OnePlus, Xiaomi, and Motorola have NFC enabled. For older phones, every card features a high-resolution backup QR code.'
    },
    {
      category: 'activation',
      q: 'How do I activate my physical NFC smart card?',
      a: 'Every physical card is delivered with a unique Card UID and activation code. Once you receive your card, log in to your SignBridge account, go to "NFC Card Management", and enter your activation code. Your card is immediately bound to your digital profile.'
    },
    {
      category: 'activation',
      q: 'Can an NFC card be programmed or encoded via the browser?',
      a: 'No. Physical NFC chip encoding requires specialized NFC encoding hardware during production. When you purchase a SignBridge card, our production facility encodes it with a secure, unique URL pointing to our dynamic redirection engine. This ensures your card never needs reprogramming even when you change your profile details.'
    },
    {
      category: 'profile',
      q: 'Can I edit my contact details after purchasing the card?',
      a: 'Yes, as many times as you like! The physical NFC card stores only your unique public URL or redirect token, never your personal information directly. You can update your phone, email, company, bio, portfolio projects, and themes anytime in your dashboard, and your card will immediately serve the updated information.'
    },
    {
      category: 'profile',
      q: 'How does the "Save Contact" button work?',
      a: 'Clicking "Save Contact" generates a standardized vCard 3.0 file (.vcf) formatted with your full name, phone number, email, company, title, website, and social links. The visitor’s smartphone instantly prompts them to save you directly into their contacts app.'
    },
    {
      category: 'security',
      q: 'What happens if I lose my SignBridge NFC Card?',
      a: 'If your card is misplaced or stolen, you can log in to your dashboard and immediately set the card status to "Blocked" or "Inactive". Anyone tapping the blocked card will see a polite notification that the card has been revoked, preventing unauthorized access.'
    },
    {
      category: 'security',
      q: 'Is my personal information protected by Row Level Security?',
      a: 'Yes. Our backend utilizes Supabase PostgreSQL with strict Row Level Security (RLS). Only public profile details marked as published are accessible by visitors. Private dashboard data, order records, and settings can only be accessed by the authenticated cardholder.'
    },
    {
      category: 'orders',
      q: 'What are the payment options for NFC cards?',
      a: 'For our MVP rollout, we support manual payment verification via direct bank wire, UPI, and invoice billing. Once you submit an order, you receive an order reference number and transfer instructions. Once verified by our administration team, your order advances to production.'
    },
    {
      category: 'orders',
      q: 'How long does shipping take?',
      a: 'Orders are produced and quality-checked within 2 to 4 business days. Standard domestic shipping takes 3 to 5 business days, and international priority shipping takes 5 to 9 business days. You can track your shipment status anytime in your dashboard.'
    },
  ];

  const filteredFaqs = faqData.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleItem = (idx: number) => {
    setOpenItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1 w-full px-2.5 sm:px-4 py-4 space-y-8 sm:space-y-12">
        
        {/* Header Mesh Hero Card */}
        <section className="max-w-7xl mx-auto rounded-[20px] md:rounded-[24px] bg-[url(/originkit/hero-01/mesh-gradient.png)] bg-cover bg-center border border-slate-200/60 p-8 sm:p-14 lg:p-16 text-center shadow-xs">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-[#087CF0]" />
              <span>Support & Knowledge Base</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Frequently Asked Questions</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#010110] tracking-[-0.03em] leading-tight [text-shadow:0_3px_6px_rgba(0,0,0,0.06),0_1px_1px_rgba(255,255,255,0.7)]">
              Got Questions? We’re Here.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#45545e] max-w-2xl mx-auto leading-relaxed font-medium">
              Everything you need to know about NFC compatibility, physical card activation, profile editing, and security.
            </p>

            {/* Pill Search Box */}
            <div className="pt-2 max-w-lg mx-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search questions (e.g. iPhone, activation, battery)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/95 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#101828] text-white shadow-md'
                      : 'bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion List */}
        <section className="max-w-4xl mx-auto rounded-[20px] md:rounded-[24px] bg-white border border-slate-200/70 p-6 sm:p-10 lg:p-14 shadow-xs">
          
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = !!openItems[idx];
              return (
                <div
                  key={idx}
                  className="rounded-[16px] bg-[#FAFAFB] border border-slate-200/80 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => toggleItem(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm md:text-base text-[#101828] hover:text-[#087CF0] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-5 rounded-[16px] bg-[#FAFAFB] border border-slate-200 text-center">
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Still have questions or need enterprise bulk card orders?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087CF0] hover:text-[#0668cc] mt-1.5"
            >
              <span>Contact our hardware and identity team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
