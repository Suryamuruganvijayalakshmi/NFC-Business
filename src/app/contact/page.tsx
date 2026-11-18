'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formType, setFormType] = useState<'support' | 'bulk'>('support');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1 w-full px-2.5 sm:px-4 py-4 space-y-8 sm:space-y-12">
        
        {/* Header Mesh Hero Card */}
        <section className="max-w-7xl mx-auto rounded-[20px] md:rounded-[24px] bg-[url(/originkit/hero-01/mesh-gradient.png)] bg-cover bg-center border border-slate-200/60 p-8 sm:p-14 lg:p-16 text-center shadow-xs">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-[#087CF0]" />
              <span>Direct Support & Inquiries</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Response within 24 Hours</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#010110] tracking-[-0.03em] leading-tight [text-shadow:0_3px_6px_rgba(0,0,0,0.06),0_1px_1px_rgba(255,255,255,0.7)]">
              We&apos;re here to help you connect.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#45545e] max-w-xl mx-auto leading-relaxed font-medium">
              Have questions about your SignBridge NFC Card, custom corporate branding, or profile setup? Our engineering team is ready.
            </p>
          </div>
        </section>

        {/* Contact Form & Info Grid */}
        <section className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Left Column: Direct Info */}
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-[20px] bg-white border border-slate-200/80 shadow-xs">
                <h3 className="text-lg font-bold text-[#101828] mb-4">
                  SignBridge Global Labs
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#087CF0] mt-0.5 flex-shrink-0" />
                    <span>SignBridge Technology Hub, Digital Corridor & International Fulfillment Centers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#923cf6] flex-shrink-0" />
                    <a href="mailto:signbridge.aiauto@gmail.com" className="hover:text-[#923cf6] transition-colors">
                      signbridge.aiauto@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <a href="tel:+919842253267" className="hover:text-emerald-600 transition-colors">
                      +91 98422 53267
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-[20px] bg-[#101828] text-white border border-white/10 shadow-xl">
                <h4 className="font-bold text-sm text-white mb-2">
                  Need Custom Enterprise Fleets?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  We create custom-engraved metal, matte black, and composite NFC smart cards for corporate teams of 10 to 10,000+.
                </p>
                <button
                  onClick={() => setFormType('bulk')}
                  className="w-full py-2.5 px-4 rounded-full bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc] transition-colors"
                >
                  Request Fleet Card Quote
                </button>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-2 p-6 sm:p-10 rounded-[20px] md:rounded-[24px] bg-white border border-slate-200/80 shadow-xs">
              
              {/* Type Switcher Pills */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setFormType('support')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    formType === 'support'
                      ? 'bg-[#101828] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  General Support
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('bulk')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    formType === 'bulk'
                      ? 'bg-[#101828] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Corporate Fleet Inquiries
                </button>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-[16px] text-emerald-800 space-y-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold">Message Dispatched!</h4>
                  <p className="text-xs sm:text-sm text-emerald-700">
                    Thank you for reaching out. A SignBridge representative will review your message and reply via email within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Surya Narayanan"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="surya@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={formType === 'bulk' ? 'Corporate Fleet Quote for 50 Cards' : 'Question regarding NFC Card Activation'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please let us know how we can help..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="relative inline-flex min-h-11 items-center justify-center overflow-clip rounded-full border-3 border-solid border-[#3E3E3E] bg-linear-to-b from-[#292929] to-[#111] py-3 px-8 text-center text-xs sm:text-sm font-semibold text-white transition-all active:scale-[0.96] hover:opacity-95 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5 mr-2 text-[#087CF0]" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
