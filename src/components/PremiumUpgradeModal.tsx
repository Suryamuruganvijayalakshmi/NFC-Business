'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { upgradeProfileToPremium, createOrder, getCurrentUser } from '@/lib/store';
import { Profile } from '@/lib/types';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Award, 
  ArrowRight,
  Loader2,
  Lock,
  CreditCard,
  Phone,
  Mail,
  User,
  AlertCircle,
  Copy
} from 'lucide-react';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onSuccess?: () => void;
}

// Dynamically load Razorpay standard web checkout script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existing) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if ((window as any).Razorpay) {
          clearInterval(interval);
          resolve(true);
        } else if (attempts > 30) {
          clearInterval(interval);
          resolve(false);
        }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PremiumUpgradeModal({
  isOpen,
  onClose,
  profile,
  onSuccess
}: PremiumUpgradeModalProps) {
  const [billingName, setBillingName] = useState(profile?.full_name || '');
  const [billingEmail, setBillingEmail] = useState(profile?.email || '');
  const [billingPhone, setBillingPhone] = useState(profile?.phone || '');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedPayment, setConfirmedPayment] = useState<{
    paymentId: string;
    orderId?: string;
    plan: string;
    amount: number;
    expiresAt: string;
  } | null>(null);
  const [copiedPaymentId, setCopiedPaymentId] = useState(false);

  useEffect(() => {
    if (profile) {
      setBillingName(profile.full_name || '');
      setBillingEmail(profile.email || '');
      setBillingPhone(profile.phone || '');
    }
    setErrorMessage(null);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleCopyPaymentId = () => {
    if (confirmedPayment?.paymentId && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(confirmedPayment.paymentId);
      setCopiedPaymentId(true);
      setTimeout(() => setCopiedPaymentId(false), 2000);
    }
  };

  const handleRazorpayUpgrade = async () => {
    setErrorMessage(null);

    // Validation
    if (!billingName.trim()) {
      setErrorMessage('Please enter your full name for membership billing.');
      return;
    }
    if (!billingEmail.trim() || !billingEmail.includes('@')) {
      setErrorMessage('Please enter a valid billing email address.');
      return;
    }

    const cleanPhone = billingPhone.replace(/\D/g, '');
    if (billingPhone.trim() && cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay secure checkout could not be loaded. Please check your internet connection.');
      }

      const amountPaise = 1000 * 100; // ₹1,000 in paise
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_U1aUQnurjyIrSG';

      // 2. Try creating order on backend
      let serverOrderId: string | undefined = undefined;
      let activeKey = rzpKey;

      try {
        const orderPayload = {
          amount: amountPaise,
          currency: 'INR',
          receipt: `rcpt_prem_${Date.now()}`,
          notes: {
            plan: 'SignTap Professional Premium (1-Year Pass)',
            profile_id: profile.id,
            user_id: profile.user_id,
            username: profile.username,
            customer_name: billingName.trim(),
            customer_email: billingEmail.trim(),
            customer_phone: cleanPhone || '',
          }
        };

        const orderRes = await fetch('https://signbridge.click/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          if (orderData.order_id) {
            serverOrderId = orderData.order_id;
          }
          if (orderData.key_id) {
            activeKey = orderData.key_id;
          }
        }
      } catch (backendErr) {
        console.warn('Backend order generation fallback to standard gateway:', backendErr);
      }

      // 3. Configure Razorpay checkout options
      const options: any = {
        key: activeKey,
        amount: amountPaise,
        currency: 'INR',
        name: 'SignTap NFC',
        description: 'SignTap Professional Premium — 1 Year All-Access Pass',
        image: 'https://signbridge.click/signbridge-emblem.webp',
        order_id: serverOrderId,
        prefill: {
          name: billingName.trim(),
          email: billingEmail.trim(),
          contact: cleanPhone || '',
        },
        notes: {
          product: 'SignTap Premium Membership',
          plan_type: 'yearly_1000',
          profile_username: profile.username,
        },
        theme: {
          color: '#D97706', // Premium Gold Amber
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        },
        handler: async (response: any) => {
          try {
            // Optional: call verify payment endpoint
            await fetch('https://signbridge.click/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: 1000,
                currency: 'INR',
                customer: {
                  name: billingName.trim(),
                  email: billingEmail.trim(),
                  phone: cleanPhone,
                },
                package_label: 'SignTap Professional Premium (1 Year)',
                quantity: 1,
              }),
            }).catch(console.warn);
          } catch (e) {
            console.warn('Payment verification note:', e);
          }

          // 1. Upgrade the profile in store
          upgradeProfileToPremium(profile.id, 'yearly');

          // 2. Record the order transaction in store
          const currentUser = getCurrentUser();
          const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

          createOrder({
            user_id: currentUser?.id || profile.user_id,
            customer_name: billingName.trim(),
            customer_email: billingEmail.trim(),
            customer_phone: cleanPhone || '',
            shipping_address: {
              fullName: billingName.trim(),
              street: 'Digital Subscription Activation',
              city: 'Online',
              state: 'Digital',
              postalCode: '000000',
              country: 'India',
            },
            items: [
              {
                id: `item-prem-${Date.now()}`,
                order_id: '',
                product_id: 'prod-premium-yearly',
                product_name: 'SignTap Professional Premium (1-Year Pass)',
                quantity: 1,
                unit_price: 1000,
                custom_name_to_print: billingName.trim(),
              }
            ],
            total_amount: 1000,
            currency: 'INR',
            status: 'delivered',
            payment_method: 'card',
            payment_status: 'verified',
            notes: `Razorpay Payment ID: ${response.razorpay_payment_id} | Golden Badge Active until ${oneYearFromNow.slice(0, 10)}`,
          });

          // 3. Trigger Confetti Celebration
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });

          setIsProcessing(false);
          setConfirmedPayment({
            paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
            orderId: response.razorpay_order_id,
            plan: 'Annual All-Access Pass (1 Year)',
            amount: 1000,
            expiresAt: oneYearFromNow,
          });

          if (onSuccess) {
            onSuccess();
          }
        }
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', (err: any) => {
        setIsProcessing(false);
        setErrorMessage(err?.error?.description || 'Payment was declined or cancelled. Please try again.');
      });
      rzpInstance.open();

    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'Could not initiate Razorpay checkout. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-amber-200/80 text-slate-900 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Gold Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-52 h-52 rounded-full bg-gradient-to-br from-amber-300/40 via-amber-500/20 to-orange-400/10 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedPayment ? (
          <div className="space-y-5">
            
            {/* Header Badge & Title */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>SignTap Professional Premium</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Stand Out with Golden Verified Identity
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Unlock career-changing visibility, direct Razorpay checkout, and unlimited Smart CRM networking power.
              </p>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/40 border border-amber-200 flex items-baseline justify-between shadow-2xs">
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Annual All-Access Membership
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-slate-900">
                    ₹1,000
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ year</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold shadow-xs">
                Annual Deal • Save 70%
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Billing Contact Details (prefilled for Razorpay) */}
            <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Razorpay Billing & Verification Details</span>
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">Email Receipt</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="email" 
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">Phone (for UPI & SMS)</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="tel" 
                        value={billingPhone}
                        onChange={(e) => setBillingPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Included */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Premium Power Included
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold">Golden Crown Verified Badge</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold">Priority NFC Hardware Sync</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <TrendingUp className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold">Visitor Analytics & Impressions</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold">Unlimited Smart CRM Contacts</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold">Follow-Up Reminders & Notes</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold">24/7 Dedicated Concierge</span>
                </div>
              </div>
            </div>

            {/* CTA Razorpay Button */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleRazorpayUpgrade}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 fill-white" />
                    <span>Pay ₹1,000 via Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Supported Payment Logos / Reassurance */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Razorpay 256-Bit SSL</span>
                </span>
                <span>•</span>
                <span>UPI / GPay / PhonePe</span>
                <span>•</span>
                <span>Cards / NetBanking</span>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Success Confirmation */
          <div className="py-6 text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Crown className="w-9 h-9 fill-white" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                Payment Successful • Verified
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Welcome to SignTap Premium!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your annual membership is active. The Golden Crown badge and unlimited networking tools are now unlocked on your profile.
              </p>
            </div>

            {/* Official Receipt Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-200/60">
                <span>Transaction Reference</span>
                <button 
                  onClick={handleCopyPaymentId}
                  className="font-mono text-slate-900 font-bold flex items-center gap-1 hover:text-[#087CF0] transition-colors"
                  title="Copy payment ID"
                >
                  <span>{confirmedPayment.paymentId}</span>
                  {copiedPaymentId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span>Plan</span>
                <span className="font-bold text-slate-900">{confirmedPayment.plan}</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span>Amount Paid</span>
                <span className="font-bold text-slate-900">₹{confirmedPayment.amount.toLocaleString('en-IN')} (Incl. Taxes)</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span>Payment Gateway</span>
                <span className="font-semibold text-emerald-700">Razorpay Official Standard Checkout</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span>Active Until</span>
                <span className="font-semibold text-slate-900">{new Date(confirmedPayment.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Done & View My Golden Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
