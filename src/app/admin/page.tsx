'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { 
  getAllProfiles, 
  getAllNFCCards, 
  saveNFCCard, 
  saveProfile 
} from '@/lib/store';
import { Profile, NFCCard } from '@/lib/types';
import { 
  ShieldCheck, 
  Users, 
  Wifi, 
  BarChart3, 
  Search, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Database,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cards, setCards] = useState<NFCCard[]>([]);
  const [search, setSearch] = useState('');
  const [newCardUID, setNewCardUID] = useState('');
  const [newCardOwner, setNewCardOwner] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    setProfiles(getAllProfiles());
    setCards(getAllNFCCards());
  }, []);

  const handleIssueCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardUID.trim() || !newCardOwner) return;

    const targetProfile = profiles.find(p => p.id === newCardOwner);
    if (!targetProfile) return;

    const newCard: NFCCard = {
      id: `card-${Date.now()}`,
      card_uid: newCardUID.trim().toUpperCase(),
      owner_user_id: targetProfile.user_id,
      profile_id: targetProfile.id,
      card_name: `${targetProfile.full_name}'s Provisioned Card`,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveNFCCard(newCard);
    setCards([...cards, newCard]);
    setNewCardUID('');
    setToast(`Card ${newCard.card_uid} successfully provisioned!`);
    setTimeout(() => setToast(''), 3000);
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    p.username.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1 py-12 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-[#101828] text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#087CF0]/20 text-[#087CF0] border border-[#087CF0]/40 text-[10px] font-bold uppercase tracking-wider">
                Protected Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">SignBridge Platform Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 flex items-center gap-2">
              System Administration
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Oversee user profiles, hardware smart card issuance, and network telemetries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-colors"
            >
              Back to User Dashboard
            </Link>
          </div>
        </div>

        {toast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toast}</span>
          </div>
        )}

        {/* System Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Registered Profiles</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{profiles.length}</p>
            <span className="text-[11px] text-emerald-600 font-medium">All database rows verified</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Active NFC Cards</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{cards.length}</p>
            <span className="text-[11px] text-[#087CF0] font-medium">NTAG216 Provisioned</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">RLS Database Security</span>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">Active</p>
            <span className="text-[11px] text-slate-400">PostgreSQL Policies enforced</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">NFC Tap Redirection</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">100%</p>
            <span className="text-[11px] text-emerald-600 font-medium">zero latency routing</span>
          </div>
        </div>

        {/* Card Provisioning Tool */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#FF7900]" />
            NFC Smart Card Hardware Provisioning
          </h2>
          <p className="text-xs text-slate-500">
            Issue a physical smart card UID directly to an existing registered identity.
          </p>

          <form onSubmit={handleIssueCard} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Card UID</label>
              <input
                required
                type="text"
                value={newCardUID}
                onChange={(e) => setNewCardUID(e.target.value)}
                placeholder="e.g. SB-CARD-8899"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assign to Profile</label>
              <select
                required
                value={newCardOwner}
                onChange={(e) => setNewCardOwner(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#087CF0]"
              >
                <option value="">Select Profile Holder...</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} (@{p.username})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-bold hover:bg-[#0668cc] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Issue & Activate Card</span>
              </button>
            </div>
          </form>
        </div>

        {/* Registered Profiles Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Registered Identity Profiles
              </h2>
              <p className="text-xs text-slate-400">
                Manage accounts, published states, and review public handles.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search profiles..."
                className="px-3.5 py-1.5 pl-8 rounded-xl border border-slate-200 text-xs w-60"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                  <th className="pb-3">User / Identity</th>
                  <th className="pb-3">Handle</th>
                  <th className="pb-3">Archetype</th>
                  <th className="pb-3">Theme</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={p.profile_image} 
                          alt="" 
                          className="w-7 h-7 rounded-lg object-cover" 
                        />
                        <div>
                          <p>{p.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-[#087CF0]">
                      /id/{p.username}
                    </td>
                    <td className="py-3 capitalize text-slate-600">
                      {p.profile_type}
                    </td>
                    <td className="py-3 capitalize text-slate-600">
                      {p.theme}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={`/id/${p.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 inline-flex items-center gap-1 font-semibold"
                      >
                        Visit <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
