'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, Eye, Database, Smartphone, CheckCircle2, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="pt-16 pb-16 bg-gradient-to-b from-white to-[#FAFAFB] border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy & Data Protection
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We respect your privacy. Here is how SignBridge protects your identity and ensures your contactless interactions remain safe.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>Last Updated: November 1, 2026</span>
              <span>•</span>
              <span>GDPR & CCPA Compliant Design</span>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-12 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
            
            {/* Quick Summary Box */}
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <h3 className="text-base font-bold text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> The SignBridge Privacy Promise
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                We never sell your personal data or phonebook to third-party ad brokers. When someone taps your NFC smart card, we only display the profile information you chose to make public, with zero tracking cookies planted on the visitor.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">1</span>
                Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us when creating a digital identity profile:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>
                  <strong>Account Registration:</strong> Name, email address, password hash, and optional profile avatar.
                </li>
                <li>
                  <strong>Public Profile Information:</strong> Professional headline, bio, phone number, location, portfolio projects, custom links, and social media handles that you choose to display.
                </li>
                <li>
                  <strong>NFC Card Metadata:</strong> Unique hardware card IDs (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">cardId</code>), activation dates, and linked destination URLs.
                </li>
                <li>
                  <strong>Contactless Tap Telemetry:</strong> When someone taps your NFC card or scans your QR code, we log basic event metrics (timestamp, rough geographical region at city/country level, referrer URL, and browser/OS user agent) solely to compile your dashboard analytics.
                </li>
              </ul>
            </div>

            {/* 2. How We Use Data */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">2</span>
                How We Use Your Information
              </h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li>Host and serve your digital identity page at <code className="text-xs font-mono text-[#087CF0]">signbridge.click/id/[username]</code>.</li>
                <li>Generate downloadable vCard (.vcf) files for one-tap contact exchange.</li>
                <li>Route physical NFC taps safely to your designated live profile or custom link.</li>
                <li>Provide you with visual performance analytics (total taps, link clicks, device breakdowns).</li>
                <li>Authenticate your sessions and prevent fraud, spam, or malicious link distribution.</li>
              </ul>
            </div>

            {/* 3. Security & Row Level Security */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">3</span>
                Database Architecture & Security
              </h2>
              <p>
                SignBridge ID utilizes PostgreSQL with native <strong>Row Level Security (RLS)</strong>. This guarantees that private fields and account settings are cryptographically restricted to your authenticated user identity.
              </p>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Lock className="w-4 h-4 text-emerald-600" /> End-to-End Transport Security
                </div>
                <p className="text-slate-600">
                  All web traffic, API calls, and contactless card redirects are served over enforced TLS 1.3 encryption. Passwords are never stored in plain text and are salted and hashed using industry-standard cryptographic functions.
                </p>
              </div>
            </div>

            {/* 4. Visitor Privacy on NFC Taps */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">4</span>
                Visitor Privacy on Contactless Taps
              </h2>
              <p>
                One of the foundational tenets of SignBridge is that people tapping your physical card or scanning your QR code do <strong>not</strong> need to download an application, create an account, or grant intrusive permissions.
              </p>
              <p className="text-sm text-slate-600">
                We do not place tracking cookies, fingerprinting scripts, or cross-site pixels on the devices of visitors who view your public profile.
              </p>
            </div>

            {/* 5. Data Ownership & Portability */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">5</span>
                Your Rights & Data Portability
              </h2>
              <p>Under international privacy regulations (including GDPR and CCPA), you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li><strong>Access & Export:</strong> Export your profile data and contacts anytime via standard vCard or JSON formats.</li>
                <li><strong>Edit & Rectify:</strong> Modify your details in real time via the Profile Editor; all updates reflect immediately across taps.</li>
                <li><strong>Delete Account:</strong> Request or execute permanent account erasure from your Settings tab, purging your profile records from our databases.</li>
                <li><strong>Card De-linking:</strong> Revoke or reassign any physical NFC card from your account at any moment.</li>
              </ul>
            </div>

            {/* 6. Third-Party Integrations */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">6</span>
                Sub-processors & Third-Party Services
              </h2>
              <p>
                To deliver fast and reliable services, we collaborate with reputable cloud infrastructure providers:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                <li><strong>Supabase:</strong> Managed PostgreSQL database hosting with RLS and authentication.</li>
                <li><strong>Google OAuth:</strong> Optional single sign-on authentication service.</li>
                <li><strong>Vercel / Cloudflare:</strong> Edge hosting, CDN, and DNS caching for fast tap resolution.</li>
              </ul>
            </div>

            {/* 7. Contact */}
            <div className="pt-6 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#087CF0]" /> Privacy Officer & Inquiries
              </h2>
              <p className="text-sm text-slate-600">
                For privacy inquiries, data deletion requests, or compliance documentation, contact:
              </p>
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs sm:text-sm">
                <p><strong>SignBridge Privacy Team</strong></p>
                <p>Email: <a href="mailto:privacy@signbridge.click" className="text-[#087CF0] hover:underline">privacy@signbridge.click</a></p>
                <p>General Support: <a href="mailto:support@signbridge.click" className="text-[#087CF0] hover:underline">support@signbridge.click</a></p>
                <p>Website: <a href="https://signbridge.click" className="text-[#087CF0] hover:underline">https://signbridge.click</a></p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
