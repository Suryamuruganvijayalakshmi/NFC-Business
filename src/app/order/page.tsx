'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllProducts, createOrder, getCurrentUser } from '@/lib/store';
import { Product, Order } from '@/lib/types';
import { 
  CreditCard, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Wifi, 
  Truck, 
  Sparkles, 
  Building2, 
  Copy, 
  CheckCircle2, 
  Mail, 
  AlertCircle 
} from 'lucide-react';

function OrderWorkflowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialProductId = searchParams.get('product') || 'prod-professional';

  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Workflow steps: 1 = Select Card & Qty, 2 = Customization, 3 = Delivery, 4 = Review, 5 = Confirmed
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId);
  const [quantity, setQuantity] = useState<number>(1);
  const [customNameToPrint, setCustomNameToPrint] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');

  // Shipping Address
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('United States');

  // Confirmation result
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  useEffect(() => {
    const prods = getAllProducts();
    setProducts(prods);

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
      setCustomNameToPrint(user.user_metadata?.full_name || '');
    }
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0] || {
    id: 'prod-professional',
    name: 'Professional NFC Card',
    price: 49,
    currency: 'USD',
    material: 'Brushed Titanium Hybrid',
  };

  const unitPrice = selectedProduct.price || 49;
  const subtotal = unitPrice * quantity;
  const shippingCost = 0; // Free shipping
  const totalAmount = subtotal + shippingCost;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedProductId) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!customNameToPrint.trim()) {
        alert('Please enter the name you want printed/engraved on your NFC Card.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!fullName.trim() || !email.trim() || !street.trim() || !city.trim() || !postalCode.trim()) {
        alert('Please fill out all required shipping fields.');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1 && currentStep < 5) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      user_id: currentUser ? currentUser.id : `user-${Date.now()}`,
      customer_name: fullName.trim(),
      customer_email: email.trim(),
      customer_phone: phone.trim(),
      shipping_address: {
        fullName: fullName.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      },
      items: [
        {
          id: `item-${Date.now()}`,
          order_id: '',
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          quantity: quantity,
          unit_price: unitPrice,
          custom_name_to_print: customNameToPrint.trim(),
          custom_notes: customNotes.trim(),
        }
      ],
      total_amount: totalAmount,
      currency: selectedProduct.currency || 'USD',
      status: 'payment_pending' as const,
      payment_method: 'Manual Bank Wire / UPI Transfer',
      payment_status: 'pending' as const,
      notes: `Card Customization: "${customNameToPrint.trim()}" | Notes: ${customNotes.trim() || 'None'}`,
    };

    const newOrder = createOrder(orderData);
    setPlacedOrder(newOrder);
    setCurrentStep(5);
  };

  const copyBankDetails = () => {
    const text = `SignBridge Technologies Private Limited\nAccount: 987210481920\nIFSC/SWIFT: SIGNINBB01\nRef: ${placedOrder?.order_number}`;
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1 w-full px-2.5 sm:px-4 py-4 max-w-5xl mx-auto">
        
        {/* Top Header Card matching Hero 02 */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl border border-solid border-[#dee5ed] bg-[#f8fafc] shadow-[0_0_0_4px_white,0_10px_25px_rgba(140,150,169,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-size-[186px_186px] bg-top-left opacity-90"
            style={{ backgroundImage: `url(/originkit/hero-02/dots.png)` }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-slate-800 border border-[#dee5ed] shadow-xs mb-2">
              <CreditCard className="w-3.5 h-3.5 text-[#923cf6]" />
              <span>Official SignTap Hardware</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">NTAG216 Embedded</span>
            </div>
            <h1 className="font-urbanist text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0d0d0d] tracking-[-0.02em]">
              Order Your SignTap Smart Card
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Precision-manufactured smart card with lifetime cloud profile hosting and universal smartphone compatibility.
            </p>
          </div>
          <div className="relative z-10 flex shrink-0 items-center gap-2 text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-full border border-[#dee5ed] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 5-Step Order</span>
          </div>
        </div>

        {/* Step Progress Indicator (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="mb-8 p-4 rounded-2xl bg-white border border-[#dee5ed] shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span className={currentStep >= 1 ? 'text-[#923cf6] font-bold' : ''}>1. Select Card</span>
              <span className={currentStep >= 2 ? 'text-[#923cf6] font-bold' : ''}>2. Customization</span>
              <span className={currentStep >= 3 ? 'text-[#923cf6] font-bold' : ''}>3. Delivery Details</span>
              <span className={currentStep >= 4 ? 'text-[#923cf6] font-bold' : ''}>4. Review & Confirm</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#923cf6] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Select Card & Quantity */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
                Step 1: Select Your NFC Smart Card
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Choose the hardware tier and quantity for your order.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(prod => {
                const isSelected = selectedProductId === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#923cf6] bg-purple-50/50 shadow-md ring-2 ring-[#923cf6]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#923cf6]">
                          {prod.category}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#923cf6] text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-[#101828] text-base">{prod.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prod.short_description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-[#101828]">${prod.price}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{prod.material}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#101828]">Card Quantity</h4>
                <p className="text-xs text-slate-500">Need multiple cards for backups or team members?</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-50"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-base text-[#101828]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="relative inline-flex min-h-11 items-center justify-center overflow-clip rounded-full border-3 border-solid border-[#3E3E3E] bg-linear-to-b from-[#292929] to-[#111] py-3 px-8 text-center text-xs sm:text-sm font-semibold text-white transition-all active:scale-[0.96] hover:opacity-95 shadow-md gap-2"
              >
                <span>Continue to Customization</span>
                <ArrowRight className="w-4 h-4 text-[#FF7900]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Customization */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
                Step 2: Card Laser Engraving & Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Tell us what you want printed on your physical card.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cardholder Name to Engrave *
                </label>
                <input
                  type="text"
                  required
                  value={customNameToPrint}
                  onChange={(e) => setCustomNameToPrint(e.target.value)}
                  placeholder="e.g. Surya Narayanan or Apex Digital Labs"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  This name will be high-precision laser-etched onto the front of your NFC Card.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Special Notes / Custom Logo Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Any corporate logo placement notes, specific titles, or custom requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-2.5 px-5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="relative inline-flex min-h-11 items-center justify-center overflow-clip rounded-full border-3 border-solid border-[#3E3E3E] bg-linear-to-b from-[#292929] to-[#111] py-3 px-8 text-center text-xs sm:text-sm font-semibold text-white transition-all active:scale-[0.96] hover:opacity-95 shadow-md gap-2"
              >
                <span>Continue to Delivery</span>
                <ArrowRight className="w-4 h-4 text-[#FF7900]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Delivery Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
                Step 3: Shipping & Delivery Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Where should we dispatch your physical NFC smart cards?
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Recipient Full Name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="order.updates@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number (for Courier Delivery)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000 or +91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street name, apartment, suite, or office floor"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State or Region"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Postal / ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="ZIP Code"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-2.5 px-5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="relative inline-flex min-h-11 items-center justify-center overflow-clip rounded-full border-3 border-solid border-[#3E3E3E] bg-linear-to-b from-[#292929] to-[#111] py-3 px-8 text-center text-xs sm:text-sm font-semibold text-white transition-all active:scale-[0.96] hover:opacity-95 shadow-md gap-2"
              >
                <span>Review Order</span>
                <ArrowRight className="w-4 h-4 text-[#FF7900]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
                Step 4: Review Your Order
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Please review your hardware details and delivery address before submitting.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-8 space-y-4">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-[#101828] uppercase tracking-wider">
                    Selected Product
                  </h3>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-base text-[#101828]">{selectedProduct.name}</h4>
                      <p className="text-xs text-slate-500">Material: {selectedProduct.material}</p>
                      <p className="text-xs text-[#087CF0] font-semibold mt-1">
                        Laser Engraving: &ldquo;{customNameToPrint}&rdquo;
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-base">${unitPrice} &times; {quantity}</span>
                      <p className="text-xs text-slate-400 font-mono">${subtotal}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Shipping To:
                    </h4>
                    <p className="text-sm font-semibold text-[#101828]">{fullName}</p>
                    <p className="text-xs text-slate-600">{street}, {city}, {state} {postalCode}, {country}</p>
                    <p className="text-xs text-slate-500 mt-1">Email: {email} | Phone: {phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">Initial MVP Notice: Manual Payment Verification</h5>
                    <p className="mt-0.5 text-amber-800 leading-relaxed">
                      To keep initial platform fees zero, our MVP supports manual payment verification via direct bank transfer, UPI, or corporate invoice. You will receive transfer instructions immediately upon submission.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Price Summary Box */}
              <div className="lg:col-span-4">
                <div className="p-6 rounded-3xl bg-[#101828] text-white shadow-xl space-y-4">
                  <h3 className="font-bold text-sm tracking-wide uppercase border-b border-white/10 pb-3">
                    Order Summary
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Items Subtotal ({quantity}x)</span>
                      <span>${subtotal}.00</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Express Courier Shipping</span>
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Profile Hosting & Encryption</span>
                      <span className="text-emerald-400 font-semibold">Included</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                    <span className="font-bold text-sm">Total Due</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">${totalAmount}.00</span>
                      <p className="text-[10px] text-slate-400 font-mono">USD</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    className="w-full mt-4 py-3 px-5 rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Submit & Place SignTap Order</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 leading-tight">
                    By submitting, your order is recorded in our production system.
                  </p>
                </div>
              </div>

            </div>

            {/* Step 4 Actions */}
            <div className="flex justify-start pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-2.5 px-5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Edit</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Order Confirmation Screen */}
        {currentStep === 5 && placedOrder && (
          <div className="max-w-2xl mx-auto space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
            
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Order Received
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-3">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Your order has been recorded. Here are your order details and payment verification steps.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-6 sm:p-8 rounded-[20px] bg-white border border-slate-200/80 shadow-md text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Order Reference ID
                  </span>
                  <h3 className="text-xl font-mono font-extrabold text-[#923cf6]">
                    {placedOrder.order_number}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Amount
                  </span>
                  <p className="text-lg font-black text-[#101828]">
                    ${placedOrder.total_amount}.00 USD
                  </p>
                </div>
              </div>

              {/* Simulated Notification Banner */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 text-xs flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#087CF0] shrink-0" />
                <span>
                  Order confirmation email dispatched to <b>{placedOrder.customer_email}</b>.
                </span>
              </div>

              {/* Manual Payment Verification Instructions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Payment Verification Instructions:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please transfer the total amount of <b>${placedOrder.total_amount}.00 USD</b> using our verified banking credentials below. Be sure to include your Order Reference ID in the transfer remarks.
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5 relative">
                  <p><b className="text-slate-800">Beneficiary:</b> SignBridge Technologies Private Limited</p>
                  <p><b className="text-slate-800">Bank:</b> Silicon Tech International Bank</p>
                  <p><b className="text-slate-800">Account No:</b> 987210481920</p>
                  <p><b className="text-slate-800">IFSC / SWIFT:</b> SIGNINBB01</p>
                  <p><b className="text-slate-800">Transfer Remarks:</b> {placedOrder.order_number}</p>

                  <button
                    type="button"
                    onClick={copyBankDetails}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#087CF0] transition-colors"
                    title="Copy details"
                  >
                    {copiedBank ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Once your transfer is initiated, our team verifies it in the administrative portal and updates your status to <b>&ldquo;Confirmed&rdquo;</b> and <b>&ldquo;In Production&rdquo;</b>.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard/orders"
                className="relative inline-flex min-h-11 items-center justify-center overflow-clip rounded-full border-3 border-solid border-[#3E3E3E] bg-linear-to-b from-[#292929] to-[#111] py-3 px-7 text-center text-xs sm:text-sm font-semibold text-white transition-all active:scale-[0.96] hover:opacity-95 shadow-md"
              >
                <span>View Order in Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 text-[#FF7900]" />
              </Link>
              <Link
                href="/"
                className="py-2.5 px-6 rounded-full border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <span>Return to Homepage</span>
              </Link>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
        <div className="w-8 h-8 border-2 border-[#087CF0] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderWorkflowContent />
    </Suspense>
  );
}

