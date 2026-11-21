'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  getAllProfiles, 
  getCurrentUser, 
  getConnectionStatus, 
  sendConnectionRequest,
  isFollowing,
  toggleFollow,
  getNewMemberStatus
} from '@/lib/store';
import { Profile } from '@/lib/types';
import { downloadVCard } from '@/lib/vcard';
import { 
  Search, 
  MapPin, 
  Building2, 
  UserPlus, 
  UserCheck, 
  ExternalLink, 
  ShieldCheck, 
  Wifi, 
  Sparkles, 
  Filter,
  CheckCircle2,
  Share2,
  Users2,
  ArrowRight
} from 'lucide-react';

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const all = getAllProfiles().filter(p => p.published !== false);
    setProfiles(all);

    const user = getCurrentUser();
    if (user) {
      const match = all.find(p => p.user_id === user.id);
      if (match) setCurrentUserProfile(match);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConnect = (targetProfile: Profile) => {
    if (!currentUserProfile) {
      window.location.href = '/login';
      return;
    }
    sendConnectionRequest(currentUserProfile, targetProfile);
    showToast(`Connection request sent to ${targetProfile.full_name}!`);
    loadData();
  };

  const handleToggleFollow = (targetUserId: string, name: string) => {
    if (!currentUserProfile) {
      window.location.href = '/login';
      return;
    }
    const following = toggleFollow(currentUserProfile.user_id, targetUserId);
    showToast(following ? `Now following ${name}` : `Unfollowed ${name}`);
    loadData();
  };

  const categories = [
    { id: 'all', label: 'All Professionals' },
    { id: 'hardware', label: 'Hardware & IoT' },
    { id: 'ai', label: 'AI & Engineering' },
    { id: 'design', label: 'Design & Creative' },
    { id: 'investor', label: 'Venture & Strategy' },
  ];

  // Filtering logic
  const filteredProfiles = profiles.filter(p => {
    // Text search
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      p.full_name.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q) ||
      p.headline?.toLowerCase().includes(q) ||
      p.company?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      (p.skills && p.skills.some(s => s.toLowerCase().includes(q))) ||
      (p.businesses && p.businesses.some(b => b.name.toLowerCase().includes(q) || b.industry?.toLowerCase().includes(q)))
    );

    // Category filter
    let matchesCategory = true;
    if (selectedCategory === 'hardware') {
      matchesCategory = Boolean(
        p.skills?.some(s => /nfc|hardware|iot|embedded|rfid/i.test(s)) ||
        /hardware|iot|embedded/i.test(p.headline || '') ||
        /hardware/i.test(p.title || '')
      );
    } else if (selectedCategory === 'ai') {
      matchesCategory = Boolean(
        p.skills?.some(s => /ai|ml|pytorch|software|full-stack/i.test(s)) ||
        /ai|architect|engineer/i.test(p.headline || '') ||
        /ai/i.test(p.title || '')
      );
    } else if (selectedCategory === 'design') {
      matchesCategory = Boolean(
        p.profile_type === 'creator' ||
        p.skills?.some(s => /design|motion|3d|brand/i.test(s)) ||
        /designer|creative/i.test(p.headline || '')
      );
    } else if (selectedCategory === 'investor') {
      matchesCategory = Boolean(
        p.profile_type === 'business' ||
        /partner|investor|capital|growth/i.test(p.headline || '') ||
        /partner/i.test(p.title || '')
      );
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#087CF0] selection:text-white">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        
        {/* Hero Directory Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#087CF0] text-xs font-bold uppercase tracking-wider">
            <Users2 className="w-3.5 h-3.5" />
            <span>SignTap Verified Professional Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Discover & Connect with Professionals
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Explore founders, hardware architects, AI engineers, and creative leaders powered by contactless NFC identity.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, skill (e.g. NFC, PyTorch, Motion), company, or city..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20 focus:border-[#087CF0]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#101828] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Results Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <Search className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No professionals matched your search</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching for "NFC", "Hardware", "Elena", "Alex", "Bengaluru", or clear your filter.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc]"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((prof) => {
              const connStatus = currentUserProfile 
                ? getConnectionStatus(currentUserProfile.user_id, prof.user_id)
                : { status: 'none', isRequester: false };
              const following = currentUserProfile 
                ? isFollowing(currentUserProfile.user_id, prof.user_id)
                : false;
              const isOwnProfile = currentUserProfile?.user_id === prof.user_id;
              const profNewStatus = getNewMemberStatus(prof.created_at, 20);

              return (
                <div 
                  key={prof.id}
                  className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden hover:border-[#087CF0]/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Top Cover Banner */}
                  <div className="relative h-24 bg-gradient-to-r from-[#101828] to-[#1A253A] overflow-hidden">
                    {prof.cover_image && (
                      <img 
                        src={prof.cover_image} 
                        alt="Cover" 
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] text-white font-mono flex items-center gap-1.5 border border-white/10">
                      <Wifi className="w-3 h-3 text-[#087CF0] rotate-90" />
                      <span>NFC Active</span>
                    </div>
                  </div>

                  {/* Body Identity */}
                  <div className="p-6 pt-0 relative flex-1 flex flex-col justify-between">
                    <div>
                      {/* Avatar & Follow button */}
                      <div className="-mt-12 mb-3.5 flex justify-between items-end">
                        <div className="relative">
                          {profNewStatus.isNew && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm border border-white">
                              NEW
                            </span>
                          )}
                          <div className={`w-20 h-20 rounded-2xl overflow-hidden ring-4 ${
                            profNewStatus.isNew ? 'ring-emerald-400 shadow-md shadow-emerald-400/20' : 'ring-white shadow-lg'
                          } bg-slate-800`}>
                            <img 
                              src={prof.profile_image} 
                              alt={prof.full_name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {!isOwnProfile && (
                          <button
                            onClick={() => handleToggleFollow(prof.user_id, prof.full_name)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
                              following 
                                ? 'bg-slate-100 text-slate-700 border-slate-200' 
                                : 'bg-white text-[#087CF0] border-[#087CF0]/40 hover:bg-blue-50'
                            }`}
                          >
                            {following ? 'Following' : '+ Follow'}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link 
                          href={`/u/${prof.username}`}
                          className="text-base font-bold text-[#101828] hover:text-[#087CF0] transition-colors flex items-center gap-1.5"
                        >
                          <span>{prof.full_name}</span>
                          {profNewStatus.isNew && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                              NEW
                            </span>
                          )}
                        </Link>
                        <ShieldCheck className="w-4 h-4 text-[#087CF0]" />
                      </div>

                          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {prof.headline || prof.title}
                      </p>

                      <div className="mt-2.5 space-y-1 text-[11px] text-slate-400">
                        {prof.company && (
                          <p className="flex items-center gap-1.5 truncate">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span className="truncate">{prof.company}</span>
                          </p>
                        )}
                        {prof.location && (
                          <p className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span className="truncate">{prof.location}</span>
                          </p>
                        )}
                      </div>

                      {/* Skills Tags */}
                      {prof.skills && prof.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3.5">
                          {prof.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                              {skill}
                            </span>
                          ))}
                          {prof.skills.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400 font-mono">
                              +{prof.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions: Connect & View Profile */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                      {isOwnProfile ? (
                        <Link
                          href="/dashboard"
                          className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold text-center hover:bg-slate-200 transition-colors"
                        >
                          Manage My Profile
                        </Link>
                      ) : (
                        <>
                          {connStatus.status === 'connected' ? (
                            <span className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Connected</span>
                            </span>
                          ) : connStatus.status === 'pending' ? (
                            <span className="w-full py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold text-center">
                              Pending
                            </span>
                          ) : (
                            <button
                              onClick={() => handleConnect(prof)}
                              className="w-full py-2 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Connect</span>
                            </button>
                          )}

                          <button
                            onClick={() => downloadVCard(prof)}
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors flex-shrink-0"
                            title="Save Contact (vCard)"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <Link
                        href={`/u/${prof.username}`}
                        className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

