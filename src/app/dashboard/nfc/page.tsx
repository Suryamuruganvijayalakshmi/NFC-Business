'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser,
  getNFCCardsByUserId, 
  saveNFCCard, 
  activateNFCCard,
  updateNFCCardStatus,
  deleteNFCCard 
} from '@/lib/store';
import { Profile, NFCCard, NFCCardStatus } from '@/lib/types';
import NFCCardVisual from '@/components/NFCCardVisual';
import { 
  Wifi, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Power, 
  ExternalLink, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle, 
  ShieldAlert, 
  KeyRound, 
  CreditCard,
  Radio,
  Clock,
  Truck
} from 'lucide-react';

export default function NFCCardManagementPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cards, setCards] = useState<NFCCard[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Activate Card Modal
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activationInput, setActivationInput] = useState('');
  const [activationError, setActivationError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
    }

    if (p) {
      setProfile(p);
      let userCards = getNFCCardsByUserId(user.id);
      setCards(userCards);
    }
  }, []);

  const handleActivateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivationError('');
    const user = getCurrentUser();
    if (!user || !profile || !activationInput.trim()) return;

    const result = activateNFCCard(activationInput.trim(), user.id, profile.id);
    if (!result.success) {
      setActivationError(result.message);
      return;
    }

    setToastMessage(result.message);
    setShowActivateModal(false);
    setActivationInput('');
    setCards(getNFCCardsByUserId(user.id));
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleActive = (card: NFCCard) => {
    const newStatus: NFCCardStatus = card.status === 'activated' || card.status === 'active' ? 'inactive' : 'activated';
    updateNFCCardStatus(card.id, newStatus);
    setCards(cards.map(c => c.id === card.id ? { ...c, status: newStatus } : c));
    setToastMessage(`Card ${card.card_uid} is now ${newStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBlockCard = (card: NFCCard) => {
    if (!confirm(`Are you sure you want to mark ${card.card_uid} as BLOCKED? Anyone tapping this physical card will be alerted that the card has been revoked.`)) {
      return;
    }
    updateNFCCardStatus(card.id, 'blocked');
    setCards(cards.map(c => c.id === card.id ? { ...c, status: 'blocked' } : c));
    setToastMessage(`Card ${card.card_uid} has been reported blocked.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyTapUrl = (cardUid: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://signbridge.click';
    const tapUrl = `${origin}/t/${cardUid}`;
    navigator.clipboard.writeText(tapUrl);
    setCopiedUrl(cardUid);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const getStatusBadge = (status: NFCCardStatus) => {
    switch (status) {
      case 'activated':
      case 'active':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Activated</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 flex items-center gap-1.5"><Clock className="w-3 h-3" />Pending</span>;
      case 'in_production':
        return <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF7900] text-xs font-semibold border border-orange-200 flex items-center gap-1.5"><Radio className="w-3 h-3 animate-spin" />In Production</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-200 flex items-center gap-1.5"><Truck className="w-3 h-3" />Shipped</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">Delivered</span>;
      case 'blocked':
        return <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" />Blocked</span>;
      case 'inactive':
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Inactive</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101828]">
            NFC Card Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your physical smart cards, pair new hardware, or block lost cards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowActivateModal(true)}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Activate New Card</span>
          </button>

          <Link
            href="/order"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#101828] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <CreditCard className="w-4 h-4 text-[#FF7900]" />
            <span>Order Card</span>
          </Link>
        </div>
      </div>

      {/* Information Banner */}
      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-900 text-xs flex items-start gap-3">
        <Wifi className="w-5 h-5 text-[#087CF0] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold">How NFC Redirection Works</h4>
          <p className="text-blue-800 leading-relaxed">
            Your physical smart card stores a secure, unique redirect token pointing to our cloud infrastructure. When someone taps the card, it automatically looks up your profile and routes to <b className="font-mono">/u/{profile?.username}</b>. You can update your profile details anytime without rewriting the physical chip!
          </p>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-[#101828]">
          Your Registered Cards ({cards.length})
        </h2>

        {cards.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <Wifi className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#101828]">No NFC Cards Linked</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t paired any physical NFC cards yet. Enter the activation code from your card packaging or place an order.
            </p>
            <button
              onClick={() => setShowActivateModal(true)}
              className="py-2.5 px-4 rounded-xl bg-[#087CF0] text-white text-xs font-semibold"
            >
              Activate Card Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map((card) => {
              const origin = typeof window !== 'undefined' ? window.location.origin : 'https://signbridge.click';
              const tapUrl = `${origin}/t/${card.card_uid}`;

              return (
                <div 
                  key={card.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Row: Name and Status */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base text-[#101828]">{card.card_name}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">UID: {card.card_uid}</p>
                      </div>
                      {getStatusBadge(card.status)}
                    </div>

                    {/* Card Metadata Details */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Activation Code:</span>
                        <span className="font-mono font-bold text-slate-800">{card.activation_code || 'ACT-INITIAL'}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Linked Profile:</span>
                        <span className="font-mono text-[#087CF0]">/u/{profile?.username}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Total Contactless Taps:</span>
                        <span className="font-bold text-emerald-600">{card.tap_count || 0} taps</span>
                      </div>
                      {card.order_reference && (
                        <div className="flex justify-between text-slate-600">
                          <span>Order Reference:</span>
                          <span className="font-mono text-slate-500">{card.order_reference}</span>
                        </div>
                      )}
                    </div>

                    {/* Unique NFC Redirect URL */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        NFC Chip Hardware URL
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={tapUrl}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyTapUrl(card.card_uid)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
                          title="Copy tap URL"
                        >
                          {copiedUrl === card.card_uid ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={tapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087CF0] hover:underline"
                    >
                      <span>Simulate Tap</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex items-center gap-2">
                      {card.status !== 'blocked' && (
                        <button
                          type="button"
                          onClick={() => handleToggleActive(card)}
                          className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                        >
                          {card.status === 'activated' || card.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}

                      {card.status !== 'blocked' ? (
                        <button
                          type="button"
                          onClick={() => handleBlockCard(card)}
                          className="py-1.5 px-3 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-medium transition-colors"
                        >
                          Report Lost / Block
                        </button>
                      ) : (
                        <span className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" /> Card Revoked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activate Card Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#087CF0] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-[#101828]">Activate Physical Card</h3>
              </div>
              <button
                onClick={() => setShowActivateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the unique <b>Activation Code</b> or <b>Card UID</b> printed on your SignBridge card packaging (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">ACT-9842-X</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">SB-NFC-9842</code>).
            </p>

            <form onSubmit={handleActivateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Card UID or Activation Code *
                </label>
                <input
                  type="text"
                  required
                  value={activationInput}
                  onChange={(e) => setActivationInput(e.target.value)}
                  placeholder="e.g. SB-NFC-9842 or ACT-9842-X"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              {activationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{activationError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActivateModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
