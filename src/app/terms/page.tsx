'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, FileText, Wifi, CheckCircle2, AlertCircle, Scale, Mail, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="pt-16 pb-16 bg-gradient-to-b from-white to-[#FAFAFB] border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087CF0]/10 text-[#087CF0] text-xs font-semibold uppercase tracking-wider mb-4">
              <Scale className="w-3.5 h-3.5" />
              Legal & Compliance
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
              Terms of Service
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using SignBridge ID or our NFC Smart Card products.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>Effective Date: November 1, 2026</span>
              <span>•</span>
              <span>Version 1.2</span>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-12 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
            
            {/* Quick Summary Box */}
            <div className="p-6 rounded-2xl bg-[#087CF0]/5 border border-[#087CF0]/20 space-y-2">
              <h3 className="text-base font-bold text-[#087CF0] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Summary of Key Points
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                You own your profile content. You agree not to distribute malicious links or commit identity theft. Your SignBridge NFC card points to your dynamic cloud URL, which you can re-target or lock at any time from your dashboard.
              </p>
            </div>

            {/* 1. Acceptance */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">1</span>
                Acceptance of Terms
              </h2>
              <p>
                By accessing or using the SignBridge platform (<a href="https://signbridge.click" className="text-[#087CF0] hover:underline font-medium">signbridge.click</a>), signing up for a SignBridge ID account, or purchasing and tapping any SignBridge NFC Smart Card, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) and our <Link href="/privacy" className="text-[#087CF0] hover:underline font-medium">Privacy Policy</Link>.
              </p>
              <p>
                If you do not agree to these Terms, you may not access or use our services.
              </p>
            </div>

            {/* 2. Platform & Services */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">2</span>
                The SignBridge ID Platform
              </h2>
              <p>
                SignBridge ID is a next-generation contactless digital identity platform operated by SignBridge (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We provide:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>Dynamic public digital identity pages accessible at unique URLs (e.g. <code className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-[#087CF0]">signbridge.click/id/[username]</code>).</li>
                <li>Contact sharing utilities, including digital vCard generation and automatic address book integration.</li>
                <li>Contactless tap redirect infrastructure connecting physical NFC chips (<code className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-[#087CF0]">signbridge.click/t/[cardId]</code>) to user profiles.</li>
                <li>QR code generation and visual fallback sharing tools.</li>
                <li>Interactive portfolio, lead generation, link in bio, and performance analytics services.</li>
              </ul>
            </div>

            {/* 3. Account Responsibilities */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">3</span>
                Accounts, Usernames & Security
              </h2>
              <p>
                To utilize our platform, you must register for an account using accurate, current, and complete information. You are solely responsible for safeguarding the credentials associated with your account and for all activities that occur under your account.
              </p>
              <p>
                <strong>Username Reservation:</strong> Usernames are granted on a first-come, first-served basis. We reserve the right to reclaim, suspend, or reassign usernames that impersonate individuals or registered trademarks, violate intellectual property rights, or are registered for speculative squatting.
              </p>
            </div>

            {/* 4. NFC Hardware & Smart Cards */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">4</span>
                Physical NFC Smart Cards & Hardware
              </h2>
              <p>
                SignBridge manufactures and distributes high-performance Near Field Communication (NFC) cards containing embedded ISO 14443 Type A high-frequency radio chips.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-[#087CF0]" /> Dynamic Cloud Redirection
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Your physical card is programmed with a secure redirect identifier. Changing your job title, phone number, or links in your dashboard updates your card immediately without requiring re-flashing.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Card Protection & Loss
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    If your physical card is lost or stolen, you can instantly deactivate it or re-route its destination URL through your SignBridge dashboard to safeguard your information.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                <strong>Hardware Warranty:</strong> SignBridge cards are covered by a 12-month manufacturer defect warranty. Physical damage resulting from water immersion beyond IP rating, snapping, bending, or intentional chip destruction is not covered.
              </p>
            </div>

            {/* 5. Acceptable Use Policy */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">5</span>
                Content Ownership & Acceptable Use
              </h2>
              <p>
                You retain all rights to the photos, text, links, portfolio items, and media you publish on your SignBridge ID page. By posting content, you grant SignBridge a non-exclusive, worldwide license to host, display, and format your content for the purpose of operating the service.
              </p>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Prohibited Activities
                </div>
                You agree not to use SignBridge ID or your physical NFC cards to:
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>Distribute phishing links, deceptive bank portals, malware, or drive-by exploit scripts.</li>
                  <li>Impersonate any government agency, bank, official corporation, or private person without authorization.</li>
                  <li>Engage in harassment, hate speech, illegal narcotics trade, or unconsented adult content dissemination.</li>
                  <li>Reverse engineer, scrape, flood, or attack SignBridge servers or contactless redirect relays.</li>
                </ul>
              </div>
            </div>

            {/* 6. Subscriptions & Payments */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">6</span>
                Pricing, Subscriptions & Refund Policy
              </h2>
              <p>
                <strong>Free Tier:</strong> SignBridge offers a comprehensive Starter tier allowing users to create personal identity pages and export contact vCards free of charge.
              </p>
              <p>
                <strong>Pro & Business Tiers:</strong> Premium subscriptions provide advanced design themes, remove platform branding, unlock custom domain routing, and provide enterprise analytics. Fees are charged in advance on a recurring monthly or annual billing cycle.
              </p>
              <p>
                <strong>Hardware Orders:</strong> Custom-printed NFC cards enter production promptly upon digital mockup approval. Because custom cards are laser-engraved or personalized with your name, they are non-refundable once production commences, except in cases of verified manufacturing defects.
              </p>
            </div>

            {/* 7. Tap Analytics */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">7</span>
                Contactless Tap Telemetry & Privacy
              </h2>
              <p>
                When a smartphone taps your NFC card or scans your QR code, our relay counts the interaction to present you with tap metrics (timestamp, country/region, and device OS). We do <strong>not</strong> collect personally identifiable information from the person tapping your card without their explicit voluntary submission (such as when filling an exchange contact form).
              </p>
            </div>

            {/* 8. Limitation of Liability */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">8</span>
                Disclaimer of Warranties & Limitation of Liability
              </h2>
              <p className="text-xs uppercase text-slate-500 font-mono">
                THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <p className="text-sm text-slate-600">
                To the maximum extent permitted by applicable law, SignBridge, its directors, employees, and suppliers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business interruptions arising out of your access to or inability to access the service or tap redirects.
              </p>
            </div>

            {/* 9. Termination */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#087CF0] text-xs font-mono font-bold flex items-center justify-center">9</span>
                Termination & Account Closure
              </h2>
              <p>
                You may terminate your account at any time via your Account Settings. Upon deletion, your public profile and tap routes are permanently disabled, and your associated data is purged in accordance with our Privacy Policy.
              </p>
              <p>
                SignBridge reserves the right to suspend or terminate accounts that breach these Terms without prior notice.
              </p>
            </div>

            {/* 10. Contact Us */}
            <div className="pt-6 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#087CF0]" /> Questions & Legal Inquiries
              </h2>
              <p className="text-sm text-slate-600">
                If you have any questions regarding these Terms of Service or your SignBridge NFC card, please reach out to our team:
              </p>
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs sm:text-sm">
                <p><strong>SignBridge Legal & Support</strong></p>
                <p>Email: <a href="mailto:support@signbridge.click" className="text-[#087CF0] hover:underline">support@signbridge.click</a></p>
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
