'use client';

import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser,
  getNFCCardsByUserId, 
  saveNFCCard, 
  deleteNFCCard 
} from '@/lib/store';
import { Profile, NFCCard } from '@/lib/types';
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
  HelpCircle,
  Smartphone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function NFCCardManagementPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cards, setCards] = useState<NFCCard[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  // New card modal
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardName, setCardName] = useState('');
  const [customUID, setCustomUID] = useState('');

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
      if (userCards.length === 0) {
        const defaultCard: NFCCard = {
          id: `card-${Date.now()}`,
          card_uid: `SB-CARD-${Math.floor(1000 + Math.random() * 9000)}`,
          owner_user_id: user.id,
          profile_id: p.id,
          card_name: `${p.full_name}'s Smart Card`,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        saveNFCCard(defaultCard);
        userCards = [defaultCard];
      }
      setCards(userCards);
    }
  }, []);

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user || !profile) return;

    const generatedUid = customUID.trim().toUpperCase() || `SB-CARD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCard: NFCCard = {
      id: `card-${Date.now()}`,
      card_uid: generatedUid,
      owner_user_id: user.id,
      profile_id: profile.id,
      card_name: cardName.trim() || `${profile.full_name}'s Smart Card`,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveNFCCard(newCard);
    setCards([...cards, newCard]);
    setShowAddCard(false);
    setCardName('');
    setCustomUID('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleToggleStatus = (cardId: string) => {
    const target = cards.find(c => c.id === cardId);
    if (!target) return;

    const updated: NFCCard = {
      ...target,
      status: target.status === 'active' ? 'inactive' : 'active',
      updated_at: new Date().toISOString(),
    };

    saveNFCCard(updated);
    setCards(cards.map(c => c.id === cardId ? updated : c));
  };

  const handleDeleteCard = (cardId: string) => {
    deleteNFCCard(cardId);
    setCards(cards.filter(c => c.id !== cardId));
  };

  const handleCopy = (tapUrl: string) => {
    navigator.clipboard.writeText(tapUrl);
    setCopiedUrl(tapUrl);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!profile) return null;

  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://signbridge.click';

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              NFC Smart Card Management
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#087CF0]/10 text-[#087CF0] text-[10px] font-bold uppercase tracking-wider">
              NTAG216 Compatible
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Program, pair, and monitor your physical contactless smart cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedToast && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Card Configured!</span>
            </div>
          )}

          <button
            onClick={() => setShowAddCard(true)}
            className="px-5 py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-bold hover:bg-[#0668cc] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Link New NFC Card</span>
          </button>
        </div>
      </div>

      {/* Connected Cards List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Connected Smart Cards ({cards.length})
        </h2>

        {cards.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-400">
            <Wifi className="w-10 h-10 mx-auto mb-2 opacity-40 rotate-90" />
            <h3 className="text-base font-bold text-slate-700">No NFC Cards Linked</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Link your SignBridge physical card or tag UID to activate physical tap redirects.
            </p>
            <button
              onClick={() => setShowAddCard(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
            >
              Pair First NFC Card
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => {
              const redirectUrl = `${siteOrigin}/t/${card.card_uid}`;
              const isCopied = copiedUrl === redirectUrl;

              return (
                <div
                  key={card.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#101828] to-[#1A253A] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Wifi className="w-6 h-6 text-[#087CF0] rotate-90" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {card.card_name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          card.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {card.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5 font-mono">
                        Hardware UID: <b className="text-slate-800">{card.card_uid}</b>
                      </p>

                      {/* Tap Endpoint */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-slate-500">Tap URL:</span>
                        <code className="text-xs font-mono bg-slate-100 text-[#087CF0] px-2 py-1 rounded-lg">
                          {redirectUrl}
                        </code>
                        <button
                          onClick={() => handleCopy(redirectUrl)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                          title="Copy Tap URL"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Toggle Status, Delete */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <a
                      href={`/t/${card.card_uid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                    >
                      Test Redirect <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleToggleStatus(card.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        card.status === 'active'
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{card.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50"
                      title="Unlink card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Step-by-Step Programming Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101828] text-white border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-[#FF7900] text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" /> Physical Card Programming Instructions
        </div>

        <h3 className="text-xl font-bold text-white">
          How to write your tap URL onto any blank NFC Card or Tag
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <span className="w-7 h-7 rounded-lg bg-[#087CF0] text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h4 className="text-sm font-bold text-white">Download &apos;NFC Tools&apos;</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Install the free &ldquo;NFC Tools&rdquo; app from the App Store (iOS) or Google Play Store (Android).
            </p>
          </div>

          <div className="space-y-2">
            <span className="w-7 h-7 rounded-lg bg-[#FF7900] text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h4 className="text-sm font-bold text-white">Write Custom URL Record</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open the app, tap <b>Write &rarr; Add a record &rarr; Custom URL / URI</b>, and paste your card&apos;s unique tap URL (<code className="text-[#087CF0] text-[11px] font-mono">signbridge.click/t/cardId</code>).
            </p>
          </div>

          <div className="space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h4 className="text-sm font-bold text-white">Hold Phone Against Card</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tap <b>Write / 28 bytes</b> and touch the back of your smartphone against the SignBridge card until the green checkmark confirms write completion!
            </p>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Link Physical NFC Card
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Connect a new card or keychain tag to your SignBridge profile.
            </p>

            <form onSubmit={handleCreateCard} className="space-y-4 my-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Friendly Name</label>
                <input
                  required
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Executive Matte Black Card"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hardware Card UID (Optional)</label>
                <input
                  type="text"
                  value={customUID}
                  onChange={(e) => setCustomUID(e.target.value)}
                  placeholder="e.g. SB-CARD-7821 (Leave empty for auto-generation)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-[#087CF0]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Unique hardware identifier used to build signbridge.click/t/[cardId]
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc] shadow-sm"
                >
                  Pair Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
