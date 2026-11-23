'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { createOrder, getCurrentUser } from '@/lib/store';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Check, 
  ArrowRight, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Sparkles,
  Building2,
  User,
  Truck
} from 'lucide-react';

export interface CardPackage {
  qty: number;
  label: string;
  price: number;
  originalPrice: number;
  savings: string;
  popular?: boolean;
}

export const CARD_PACKAGES: CardPackage[] = [
  { qty: 1, label: 'Single Card', price: 199, originalPrice: 999, savings: 'SPECIAL ₹199' },
  { qty: 2, label: 'Duo Pack', price: 349, originalPrice: 1998, savings: 'BEST VALUE', popular: true },
  { qty: 3, label: 'Team Pack', price: 499, originalPrice: 2997, savings: 'SAVE MORE' },
];

interface RazorpayBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCardType?: 'business' | 'personal';
  onOrderSuccess?: (orderId: string) => void;
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

export default function RazorpayBuyModal({
  isOpen,
  onClose,
  initialCardType = 'business',
  onOrderSuccess,
}: RazorpayBuyModalProps) {
  const [cardType, setCardType] = useState<'business' | 'personal'>(initialCardType);
  const [selectedPackage, setSelectedPackage] = useState<CardPackage>(CARD_PACKAGES[0]);
  const [nameOnCard, setNameOnCard] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    setCardType(initialCardType);
  }, [initialCardType]);

  useEffect(() => {
    // Preload user details if logged in
    const user = getCurrentUser();
    if (user) {
      if (!nameOnCard && user.user_metadata?.full_name) {
        setNameOnCard(user.user_metadata.full_name);
      }
      if (!email && user.email) {
        setEmail(user.email);
      }
    }
    // Preload Razorpay script in background
    loadRazorpayScript();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyPaymentId = (id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!nameOnCard.trim()) {
      setErrorMessage('Please enter the Name to engrave on your NFC Smart Card.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address for order confirmation.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile / WhatsApp number.');
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('Please enter complete delivery street address.');
      return;
    }
    const cleanPincode = pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit postal pincode.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Ensure Razorpay script is loaded
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !(window as any).Razorpay) {
        throw new Error('Could not initialize Razorpay payment gateway. Please disable ad-blockers and try again.');
      }

      // 2. Create order via SignBridge backend API
      const amountPaise = selectedPackage.price * 100;
      const orderPayload = {
        amount: amountPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          product: `${cardType === 'business' ? 'Business' : 'Personal'} NFC Smart Card`,
          card_type: cardType,
          package: selectedPackage.label,
          quantity: String(selectedPackage.qty),
          name_on_card: nameOnCard.trim(),
          customer_phone: cleanPhone,
          customer_email: email.trim(),
          shipping_address: address.trim(),
          pincode: cleanPincode,
        }
      };

      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || `Order generation failed (HTTP ${orderRes.status})`);
      }

      const orderData = await orderRes.json();
      const { order_id, key_id } = orderData;
      if (!order_id) {
        throw new Error('Order creation failed: No order_id returned from gateway.');
      }

      const activeKey = key_id || 'rzp_live_U1aUQnurjyIrSG';

      // 3. Open Razorpay Checkout modal
      const options = {
        key: activeKey,
        amount: orderData.amount || amountPaise,
        currency: orderData.currency || 'INR',
        name: 'SignTap',
        description: `SignTap NFC Smart Card (${selectedPackage.label})`,
        image: '/images/signtap-logo.png',
        order_id: order_id,
        prefill: {
          name: nameOnCard.trim(),
          email: email.trim(),
          contact: cleanPhone,
        },
        notes: {
          name_on_card: nameOnCard.trim(),
          package: selectedPackage.label,
          shipping_address: address.trim(),
          pincode: cleanPincode,
          card_type: cardType,
        },
        theme: {
          color: cardType === 'business' ? '#0A66C2' : '#2563eb',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        },
        handler: async (paymentResponse: any) => {
          try {
            // Verify payment on backend
            await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                amount: selectedPackage.price,
                currency: 'INR',
                order_type: 'card_purchase',
                user_id: getCurrentUser()?.id,
                customer: {
                  name: nameOnCard.trim(),
                  email: email.trim(),
                  phone: cleanPhone,
                  address: address.trim(),
                  pincode: cleanPincode,
                },
                package_label: `SignTap ${selectedPackage.label} (${cardType.toUpperCase()})`,
                quantity: selectedPackage.qty,
              }),
            }).catch(console.warn);
          } catch (e) {
            console.warn('Payment verification note:', e);
          }

          // Save local order record
          const currentUser = getCurrentUser();
          const newOrder = createOrder({
            user_id: currentUser?.id || `guest-${Date.now()}`,
            customer_name: nameOnCard.trim(),
            customer_email: email.trim(),
            customer_phone: cleanPhone,
            shipping_address: {
              fullName: nameOnCard.trim(),
              street: address.trim(),
              city: 'India',
              state: '',
              postalCode: cleanPincode,
              country: 'India',
            },
            items: [
              {
                id: `item-${Date.now()}`,
                order_id: '',
                product_id: cardType === 'business' ? 'prod-business' : 'prod-personal',
                product_name: cardType === 'business' ? 'SignTap Business NFC Card' : 'SignTap Personal NFC Card',
                quantity: selectedPackage.qty,
                unit_price: selectedPackage.price,
                custom_name_to_print: nameOnCard.trim(),
              }
            ],
            total_amount: selectedPackage.price,
            currency: 'INR',
            status: 'confirmed',
            payment_method: 'card',
            payment_status: 'verified',
            notes: `Razorpay Payment ID: ${paymentResponse.razorpay_payment_id} | ${selectedPackage.label} (${cardType.toUpperCase()})`,
          });

          // Trigger Confetti Celebration
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });

          setIsProcessing(false);
          setConfirmedOrder({
            paymentId: paymentResponse.razorpay_payment_id,
            orderId: paymentResponse.razorpay_order_id || newOrder.id,
            trackingRef: newOrder.tracking_number,
            packageName: selectedPackage.label,
            totalAmount: selectedPackage.price,
            cardType: cardType,
            nameOnCard: nameOnCard.trim(),
          });

          if (onOrderSuccess) {
            onOrderSuccess(newOrder.id);
          }
        }
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', (err: any) => {
        setIsProcessing(false);
        setErrorMessage(err?.error?.description || 'Payment processing could not be completed. Please try again.');
      });
      rzpInstance.open();

    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment initiation failed. Please check your internet connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-3xl border border-black/10 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#faf8f5] border-b border-black/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-700">
              SignBridge Direct Checkout
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 text-slate-800">
          {confirmedOrder ? (
            /* =================================================================
               ORDER CONFIRMATION STATE
            ================================================================= */
            <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Payment Confirmed via Razorpay
                </span>
                <h3 className="font-urbanist text-2xl sm:text-3xl font-extrabold text-[#0d0d0d]">
                  Your SignTap NFC Card is In Production!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  Thank you for ordering. Your contactless card will be laser-engraved with &ldquo;{confirmedOrder.nameOnCard}&rdquo; and dispatched via express courier.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Payment Reference:</span>
                  <button
                    onClick={() => handleCopyPaymentId(confirmedOrder.paymentId)}
                    className="inline-flex items-center gap-1 font-bold text-slate-900 hover:text-[#923cf6]"
                  >
                    <span>{confirmedOrder.paymentId}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Edition:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {confirmedOrder.cardType} NFC Smart Card ({confirmedOrder.packageName})
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    ₹{confirmedOrder.totalAmount}.00 (All Inclusive)
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Tracking Code:</span>
                  <span className="font-bold text-[#923cf6]">{confirmedOrder.trackingRef}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-6 rounded-full bg-[#0d0d0d] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md"
                >
                  Done & Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* =================================================================
               ORDER FORM STATE (Razorpay Standard)
            ================================================================= */
            <form onSubmit={handlePay} className="space-y-5">
              
              {/* Product Header Snippet matching signbridge.click */}
              <div className="p-3.5 rounded-2xl bg-[#fbf9f6] border border-black/10 flex items-center gap-3.5">
                <img
                  src="/images/nfc-smart-card.webp"
                  alt="SignBridge NFC Card"
                  className="w-14 h-18 object-cover rounded-xl border border-black/10 shadow-sm shrink-0"
                  onError={(e: any) => {
                    e.target.src = 'https://signbridge.click/assets/nfc-smart-card.webp';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-bold text-[#923cf6] border border-purple-200">
                    <Sparkles className="w-3 h-3" />
                    <span>One Tap · Business & Personal Dual Mode</span>
                  </div>
                  <h4 className="font-urbanist font-extrabold text-sm sm:text-base text-[#0d0d0d] mt-1 truncate">
                    SignBridge NFC Smart Card
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    Matte Black Finish · Contactless RFID · Free Courier Delivery
                  </p>
                </div>
              </div>

              {/* Card Edition Selector (Business vs Personal) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choose Card Edition
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCardType('business')}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      cardType === 'business'
                        ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${cardType === 'business' ? 'text-[#923cf6]' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-[#0d0d0d]">Business Edition</div>
                      <div className="text-[10px] text-slate-500">Corporate & Sales Leads</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardType('personal')}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      cardType === 'personal'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <User className={`w-4 h-4 ${cardType === 'personal' ? 'text-[#087CF0]' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-[#0d0d0d]">Personal Edition</div>
                      <div className="text-[10px] text-slate-500">Portfolio & 1-Tap vCard</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Package Tier Selection (Single Card, Duo Pack, Team Pack) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Package
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CARD_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackage.qty === pkg.qty;
                    return (
                      <button
                        key={pkg.qty}
                        type="button"
                        onClick={() => setSelectedPackage(pkg)}
                        className={`relative p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0d0d0d] bg-slate-900 text-white shadow-md ring-1 ring-[#0d0d0d]'
                            : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {pkg.popular && (
                          <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-[#923cf6] text-white'
                          }`}>
                            POPULAR
                          </span>
                        )}
                        <span className="text-[11px] font-bold block">{pkg.label}</span>
                        <div className="my-1">
                          <span className="text-base sm:text-lg font-black block">₹{pkg.price}</span>
                          <span className={`text-[10px] line-through block ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                            ₹{pkg.originalPrice}
                          </span>
                        </div>
                        <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-white/10 text-emerald-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {pkg.savings}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Input: Name on Card */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Name on Card <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surya Murugan"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#923cf6]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  High-precision laser engraved directly onto the front of your physical smart card.
                </p>
              </div>

              {/* Form Input: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#923cf6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9842253267"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#923cf6]"
                  />
                </div>
              </div>

              {/* Form Input: Delivery Address & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Flat / Building / Street / Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#923cf6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="641001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#923cf6]"
                  />
                </div>
              </div>

              {/* Error banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Order Total Line */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Total to Pay (All Inclusive + Free Courier):</span>
                </div>
                <span className="font-extrabold text-base sm:text-lg text-[#0d0d0d]">
                  ₹{selectedPackage.price}.00
                </span>
              </div>

              {/* Submit Razorpay Button */}
              <div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-full bg-[#0d0d0d] hover:bg-slate-800 active:scale-98 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-black/15 flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      <span>Securing Order & Opening Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pay ₹{selectedPackage.price} with Razorpay</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Razorpay Trust Footer */}
              <div className="pt-1 flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Razorpay</span>
                </span>
                <span>UPI (GPay / PhonePe) · Cards · NetBanking</span>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

