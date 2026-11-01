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

      <main className="flex-1">
        {/* Header */}
        <section className="pt-16 pb-16 bg-gradient-to-b from-white to-[#FAFAFB] border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087CF0]/10 text-[#087CF0] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
              We&apos;re here to help you connect.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Have questions about your SignBridge NFC Card, custom corporate branding, or profile setup? Our engineering team is ready.
            </p>
          </div>
        </section>

        {/* Contact Content Grid */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left: Contact Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  SignBridge Headquarters
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#087CF0] mt-0.5 flex-shrink-0" />
                    <span>SignBridge Technology Labs, Tech Corridor, Bengaluru & Global Hubs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#FF7900] flex-shrink-0" />
                    <span>support@signbridge.click</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>+91 98765 43210</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#101828] text-white border border-white/10 shadow-md">
                <h4 className="font-bold text-sm text-white mb-2">
                  Need Custom NFC Smart Cards?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  We create custom-engraved metal, matte black, and wood finish NFC cards for agencies and enterprise teams of 10 to 10,000+.
                </p>
                <button
                  onClick={() => setFormType('bulk')}
                  className="w-full py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc] transition-colors"
                >
                  Request Bulk Card Quote
                </button>
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div className="lg:col-span-2 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setFormType('support')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    formType === 'bulk'
                      ? 'bg-[#101828] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Bulk NFC Cards Order
                </button>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 text-emerald-800 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold">Message Received!</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you for reaching out. A SignBridge specialist will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                      />
                    </div>
                  </div>

                  {formType === 'bulk' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Estimated Quantity</label>
                        <select className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]">
                          <option>10 — 50 cards</option>
                          <option>50 — 250 cards</option>
                          <option>250 — 1,000 cards</option>
                          <option>1,000+ cards</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Material Preference</label>
                        <select className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]">
                          <option>Matte Black PVC</option>
                          <option>Stainless Steel Metal</option>
                          <option>Bamboo / Natural Wood</option>
                          <option>Custom Mix</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Message / Inquiries</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we assist you?"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#087CF0] text-white text-sm font-semibold hover:bg-[#0668cc] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
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
